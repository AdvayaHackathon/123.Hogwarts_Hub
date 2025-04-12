import React, { useState } from 'react';
import axios from 'axios';

const MentalHealthPage: React.FC = () => {
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [messageFile, setMessageFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!voiceFile || !messageFile) {
      setError('Please upload both a voice note and a message file.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('voice', voiceFile);
    formData.append('messages', messageFile);

    try {
      const res = await axios.post('http://localhost:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  // Function to save the result to a .txt file
  const saveResult = () => {
    if (!result) return;

    const blob = new Blob([`
      Voice Transcript: ${result.voice_text}\n
      Voice Sentiment: ${result.voice_sentiment}\n
      Message Sentiment: ${result.message_sentiment}\n
    `], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mental_health_analysis.txt';
    link.click();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        Mental Health Analysis
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Voice Note (.wav or .mp3)
        </label>
        <input
          type="file"
          accept=".wav, .mp3"
          onChange={(e) => setVoiceFile(e.target.files?.[0] || null)}
          className="block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Message File (.txt, .json, .csv)
        </label>
        <input
          type="file"
          accept=".txt, .json, .csv"
          onChange={(e) => setMessageFile(e.target.files?.[0] || null)}
          className="block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-3">{error}</p>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
      >
        {loading ? 'Analyzing...' : 'Analyze Mental Health'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Analysis Result:</h3>
          <p><strong>Voice Transcript:</strong> {result.voice_text}</p>
          <p><strong>Voice Sentiment:</strong> {result.voice_sentiment}</p>
          <p><strong>Message Sentiment:</strong> {result.message_sentiment}</p>

          <button
            onClick={saveResult}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
          >
            Save Result
          </button>
        </div>
      )}
    </div>
  );
};

export default MentalHealthPage;
