import cv2
import time
import mysql.connector
from datetime import datetime
from ultralytics import YOLO
import cvzone
from twilio.rest import Client

# Twilio setup
def send_sms_alert(fall_detected):
    if fall_detected > 0:
        account_sid = 'ACf894fdba07fcbe6c01ebb4ae7ee328f4'

        auth_token =  '5b3e7f371a264c8f7492b6312d52eacf'
        client = Client(account_sid, auth_token)

        message = client.messages.create(
            body="Alert: A fall has been detected. Please check the patient's condition.",
            from_='‪+1 970 293 3830‬',  # Replace with your Twilio phone number
            to='+916374389468' # Replace with the recipient's phone number
        )
        print(f"SMS alert sent: {message.sid}")

# Database Connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Sanju@2004",
        database="fall_detection"
    )

# Initialize YOLO model
model = YOLO("yolo11s.pt")
names = model.model.names

cap = cv2.VideoCapture("f.mp4")
last_update_time = time.time()
update_interval = 20  # seconds

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.resize(frame, (1020, 600))
    results = model.track(frame, persist=True, classes=0)

    fall_detected = 0
    normal_detected = 0

    if results[0].boxes is not None and results[0].boxes.id is not None:
        boxes = results[0].boxes.xyxy.int().cpu().tolist()
        class_ids = results[0].boxes.cls.int().cpu().tolist()
        track_ids = results[0].boxes.id.int().cpu().tolist()

        for box, class_id, track_id in zip(boxes, class_ids, track_ids):
            x1, y1, x2, y2 = box
            h, w = y2 - y1, x2 - x1
            thresh = h - w

            if thresh <= 0:
                color = (0, 0, 255)
                label = "Fall"
                fall_detected += 1
            else:
                color = (0, 255, 0)
                label = "Normal"
                normal_detected += 1

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cvzone.putTextRect(frame, f'{label} {track_id}', (x1, y1), 1, 1)

    # Send SMS alert if fall detected
    if fall_detected > 0:
        send_sms_alert(fall_detected)

    # Update to DB
    if time.time() - last_update_time >= update_interval:
        try:
            db = get_db_connection()
            cursor = db.cursor()
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute(
                "INSERT INTO fall_records (fall_count, normal_count, timestamp) VALUES (%s, %s, %s)",
                (fall_detected, normal_detected, timestamp)
            )
            db.commit()
            cursor.close()
            db.close()
            print(f"DB Updated: {fall_detected} falls, {normal_detected} normal at {timestamp}")
        except Exception as e:
            print(f"DB Error: {e}")
        last_update_time = time.time()

    cv2.imshow("Fall Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
