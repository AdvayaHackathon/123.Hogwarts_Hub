from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import os, hashlib, json, requests
import tempfile, csv
from textblob import TextBlob
import speech_recognition as sr

# ------------------- Setup -------------------
load_dotenv()
app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['qr_database']
patients = db['patients']

# Pinata API keys (for IPFS)
PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_API_KEY = os.getenv("PINATA_SECRET_API_KEY")

# ------------------- IPFS Upload -------------------
def upload_to_ipfs(file_stream, filename):
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
    }
    files = {'file': (filename, file_stream)}
    response = requests.post(url, files=files, headers=headers)
    if response.status_code == 200:
        ipfs_hash = response.json()["IpfsHash"]
        return f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
    else:
        print("IPFS Error:", response.text)
        return None

# ------------------- QR Code APIs -------------------
@app.route('/api/qr', methods=['POST'])
def save_qr_data():
    data = request.get_json()
    if not data or 'id' not in data or 'name' not in data:
        return jsonify({'error': 'Missing patient data'}), 400

    data['timestamp'] = datetime.now().isoformat()
    existing = patients.find_one({'id': data['id']})
    if existing:
        patients.update_one({'id': data['id']}, {'$set': data})
        return jsonify({'message': 'QR data updated'}), 200

    patients.insert_one(data)
    return jsonify({'message': 'QR data stored successfully'}), 201

@app.route('/api/qr', methods=['GET'])
def get_all_qr_data():
    records = list(patients.find({}, {'_id': 0}))
    return jsonify(records), 200

# ------------------- Doctor Verification -------------------
@app.route('/api/doctor/verify', methods=['POST'])
def verify_doctor():
    data = request.get_json()
    valid_doctors = {
        'DR12345': 'access123',
        'DR67890': 'access456',
    }
    if valid_doctors.get(data.get("doctorId")) == data.get("accessCode"):
        return jsonify({'verified': True}), 200
    return jsonify({'verified': False, 'message': 'Invalid credentials'}), 403

# ------------------- Patient APIs -------------------
@app.route('/api/patients/search', methods=['GET'])
def search_patient():
    query = request.args.get('query', '').strip()
    if not query:
        return jsonify({'error': 'Search query required'}), 400

    result = patients.find_one({'id': query})
    if not result:
        return jsonify({'error': 'Patient not found'}), 404

    result['_id'] = str(result['_id'])
    return jsonify({'patient': result}), 200

@app.route('/api/patients', methods=['POST'])
def save_patient():
    data = request.get_json()
    if not data.get('id') or not data.get('name'):
        return jsonify({'error': 'Missing patient ID or name'}), 400

    data.pop('_id', None)
    patients.update_one({'id': data['id']}, {'$set': data}, upsert=True)
    return jsonify({'message': 'Patient data saved'}), 200

# ------------------- Add Report -------------------
@app.route('/api/patients/<patient_id>/reports', methods=['POST'])
def add_report(patient_id):
    report = request.form.to_dict()
    file_url = None
    file_hash = None

    # File Upload
    if 'reportFile' in request.files:
        file = request.files['reportFile']
        filename = secure_filename(file.filename)
        file.stream.seek(0)
        file_bytes = file.stream.read()

        file_hash = hashlib.sha256(file_bytes).hexdigest()
        report['fileHash'] = file_hash

        file.stream.seek(0)
        file_url = upload_to_ipfs(file.stream, filename)
        if not file_url:
            return jsonify({'error': 'IPFS upload failed'}), 500
        report['fileUrl'] = file_url

    # Report Metadata
    report['date'] = report.get('date', datetime.now().isoformat())
    report['critical'] = report.get('critical', 'false') == 'true'

    # Blockchain Chaining
    patient = patients.find_one({'id': patient_id})
    previous_reports = patient.get('reports', []) if patient else []
    previous_hash = previous_reports[-1].get('reportHash') if previous_reports else 'GENESIS'
    report['previousHash'] = previous_hash

    hash_input = json.dumps(report, sort_keys=True).encode()
    report_hash = hashlib.sha256(hash_input).hexdigest()
    report['reportHash'] = report_hash

    # Save Report
    patients.update_one({'id': patient_id}, {'$push': {'reports': report}})
    return jsonify({'message': 'Report added and uploaded to IPFS', 'report': report}), 200

@app.route('/api/patient/<string:patient_id>', methods=['GET'])
def get_patient_by_id(patient_id):
    patient = patients.find_one({'id': patient_id}, {'_id': 0})
    if patient:
        return jsonify(patient), 200
    return jsonify({'error': 'Patient not found'}), 404

# ------------------- Sentiment Analysis -------------------
@app.route('/analyze', methods=['POST'])
def analyze():
    voice_file = request.files.get('voice')
    message_file = request.files.get('messages')

    if not voice_file or not message_file:
        return jsonify({'error': 'Missing voice or message file'}), 400

    # Voice Sentiment
    recognizer = sr.Recognizer()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        voice_file.save(temp_audio.name)
        with sr.AudioFile(temp_audio.name) as source:
            audio = recognizer.record(source)
            try:
                voice_text = recognizer.recognize_google(audio)
                voice_sentiment_score = TextBlob(voice_text).sentiment.polarity
            except Exception as e:
                return jsonify({'error': f"Voice processing failed: {str(e)}"}), 500

    # Message Sentiment
    messages_text = ""
    filename = message_file.filename.lower()
    try:
        if filename.endswith('.txt'):
            messages_text = message_file.read().decode('utf-8')
        elif filename.endswith('.json'):
            data = json.load(message_file)
            messages_text = " ".join([str(msg) for msg in data.values()])
        elif filename.endswith('.csv'):
            decoded = message_file.read().decode('utf-8').splitlines()
            reader = csv.reader(decoded)
            messages_text = " ".join([" ".join(row) for row in reader])
        else:
            return jsonify({'error': 'Unsupported file type'}), 400
    except Exception as e:
        return jsonify({'error': f"Message file processing failed: {str(e)}"}), 500

    message_sentiment_score = TextBlob(messages_text).sentiment.polarity

    def label(score):
        return "Positive" if score > 0 else "Negative" if score < 0 else "Neutral"

    voice_sentiment = label(voice_sentiment_score)
    message_sentiment = label(message_sentiment_score)

    avg_score = (voice_sentiment_score + message_sentiment_score) / 2
    if avg_score > 0.2:
        mental_state = "Healthy"
    elif avg_score < -0.2:
        mental_state = "Needs Attention"
    else:
        mental_state = "Stable"

    return jsonify({
        'voice_text': voice_text,
        'voice_sentiment': voice_sentiment,
        'message_sentiment': message_sentiment,
        'mental_state': mental_state
    }), 200

# ------------------- Run Server -------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
