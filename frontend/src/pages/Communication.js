import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMicrophone, FaVolumeUp, FaSpinner, FaStop } from 'react-icons/fa';

const Communication = ({ language }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('tts'); // 'tts' or 'stt'
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        setListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };
      
      recognitionInstance.onend = () => {
        setListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [language]);

  const handleTextToSpeech = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const apiUrl = 'https://10wxt88kuh.execute-api.ap-south-1.amazonaws.com/prod/text-to-speech';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language, voiceGender: 'female' })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('TTS response:', data);
      
      if (data.success && data.audioContent) {
        // Create audio URL from base64
        const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(audioBlob);
        
        // Play audio
        const audio = new Audio(url);
        audio.play();
      } else {
        console.error('TTS failed:', data);
        alert('Failed to convert text to speech. Please try again.');
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleSpeechToText = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      setText('');
      recognition.start();
      setListening(true);
    }
  };

  const translations = {
    hi: {
      title: 'संचार',
      backButton: 'वापस जाएं',
      textToSpeech: 'पाठ-से-भाषण',
      speechToText: 'भाषण-से-पाठ',
      enterText: 'यहाँ पाठ दर्ज करें...',
      speak: 'बोलें',
      startListening: 'सुनना शुरू करें',
      stopListening: 'सुनना बंद करें',
      comingSoon: 'जल्द आ रहा है!',
      description: 'यह सुविधा विकास में है और जल्द ही उपलब्ध होगी।'
    },
    en: {
      title: 'Communication',
      backButton: 'Go Back',
      textToSpeech: 'Text-to-Speech',
      speechToText: 'Speech-to-Text',
      enterText: 'Enter text here...',
      speak: 'Speak',
      startListening: 'Start Listening',
      stopListening: 'Stop Listening',
      comingSoon: 'Coming Soon!',
      description: 'This feature is under development and will be available soon.'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-3 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label={t.backButton}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Mode Selection */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setMode('tts')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              mode === 'tts'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {t.textToSpeech}
          </button>
          <button
            onClick={() => setMode('stt')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              mode === 'stt'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {t.speechToText}
          </button>
        </div>

        {/* Text-to-Speech Interface */}
        {mode === 'tts' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.enterText}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent mb-4"
              aria-label="Text input for speech conversion"
            />
            
            <button
              onClick={handleTextToSpeech}
              disabled={!text || loading}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {loading ? <FaSpinner className="animate-spin" size={24} /> : <FaVolumeUp size={24} />}
              <span>{loading ? 'Processing...' : t.speak}</span>
            </button>
          </div>
        )}

        {/* Speech-to-Text Interface */}
        {mode === 'stt' && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
              <p className="text-blue-800">Click the microphone and speak clearly. Your browser will convert speech to text.</p>
            </div>
            
            <button
              onClick={handleSpeechToText}
              disabled={loading}
              className={`flex items-center space-x-2 ${listening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white px-8 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto`}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {listening ? <FaStop size={24} /> : <FaMicrophone size={24} />}
              <span>{listening ? t.stopListening : t.startListening}</span>
            </button>
            
            {text && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <p className="text-lg text-gray-800">{text}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Communication;
