import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone } from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceCommand = ({ language }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Voice command mappings
  const commands = {
    hi: {
      'दृष्टि': '/vision',
      'दृष्टि सहायता': '/vision',
      'संचार': '/communication',
      'स्वास्थ्य': '/healthcare',
      'जानकारी': '/information',
      'आपातकाल': '/emergency',
      'सेटिंग्स': '/settings',
      'घर': '/',
      'होम': '/'
    },
    en: {
      'vision': '/vision',
      'communication': '/communication',
      'healthcare': '/healthcare',
      'health': '/healthcare',
      'information': '/information',
      'emergency': '/emergency',
      'settings': '/settings',
      'home': '/'
    }
  };

  useEffect(() => {
    if (transcript) {
      const lowerTranscript = transcript.toLowerCase();
      const commandMap = commands[language] || commands.en;
      
      // Check if transcript matches any command
      for (const [command, path] of Object.entries(commandMap)) {
        if (lowerTranscript.includes(command.toLowerCase())) {
          navigate(path);
          resetTranscript();
          SpeechRecognition.stopListening();
          
          // Announce navigation
          speak(`Navigating to ${command}`, language);
          break;
        }
      }
    }
  }, [transcript, language, navigate, resetTranscript]);

  const speak = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ 
        continuous: true,
        language: language === 'hi' ? 'hi-IN' : 'en-US'
      });
      setIsListening(true);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleListening}
        className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 ${
          listening 
            ? 'bg-red-500 voice-active' 
            : 'bg-primary-600 hover:bg-primary-700'
        } text-white`}
        aria-label={listening ? 'Stop voice command' : 'Start voice command'}
        aria-pressed={listening}
      >
        <FaMicrophone size={24} />
      </button>
      
      {listening && (
        <div className="absolute bottom-16 right-0 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          <p className="text-sm font-medium">Listening...</p>
          {transcript && (
            <p className="text-xs text-gray-600 mt-1">{transcript}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceCommand;
