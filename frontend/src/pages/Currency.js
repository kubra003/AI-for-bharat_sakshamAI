import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaVolumeUp } from 'react-icons/fa';
import CameraCapture from '../components/CameraCapture';
import { detectCurrency } from '../services/api';

const Currency = ({ language }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const translations = {
    hi: {
      title: 'मुद्रा पहचानकर्ता',
      backButton: 'वापस जाएं',
      instructions: 'कैमरे को मुद्रा नोट की ओर इंगित करें और फोटो लें',
      capture: 'फोटो लें',
      processing: 'प्रसंस्करण...',
      retake: 'फिर से लें',
      detected: 'पहचाना गया',
      denomination: 'मूल्यवर्ग',
      confidence: 'विश्वास',
      playAudio: 'ऑडियो चलाएं',
      noCurrency: 'कोई मुद्रा नहीं मिली',
      error: 'त्रुटि हुई। कृपया पुनः प्रयास करें।',
      rupees: 'रुपये'
    },
    en: {
      title: 'Currency Detector',
      backButton: 'Go Back',
      instructions: 'Point the camera at a currency note and capture photo',
      capture: 'Capture Photo',
      processing: 'Processing...',
      retake: 'Retake',
      detected: 'Detected',
      denomination: 'Denomination',
      confidence: 'Confidence',
      playAudio: 'Play Audio',
      noCurrency: 'No currency detected',
      error: 'An error occurred. Please try again.',
      rupees: 'Rupees'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    document.title = t.title;
  }, [t.title]);

  const handleCapture = useCallback(async (compressedImage) => {
    setLoading(true);
    setResult(null);

    try {
      // Call currency detection API
      const response = await detectCurrency(compressedImage, language);
      
      if (response.detected && response.denomination) {
        setResult({
          denomination: response.denomination,
          confidence: response.confidence,
          message: response.message,
          currency: response.currency,
          symbol: response.symbol
        });
        
        // Automatically announce the detected denomination
        speak(`${response.denomination} ${t.rupees}`);
      } else {
        setResult({
          error: response.message || t.noCurrency
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error detecting currency:', error);
      setResult({ 
        error: error.response?.data?.error || t.error 
      });
      setLoading(false);
    }
  }, [language, t.error, t.noCurrency, t.rupees]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

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
            className="mr-4 p-3 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors focus:outline-none focus:ring-4 focus:ring-yellow-300"
            aria-label={t.backButton}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
          <p className="text-yellow-800">{t.instructions}</p>
        </div>

        {/* Camera View with Currency Note Alignment Guide */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <CameraCapture
            onCapture={handleCapture}
            loading={loading}
            language={language}
            captureButtonText={t.capture}
            facingMode="environment"
            maxSizeKB={200}
            overlay={
              <CurrencyAlignmentGuide language={language} />
            }
          />
        </div>

        {/* Results */}
        {result && !result.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.detected}</h2>
            
            {result.denomination ? (
              <>
                <div className="bg-yellow-50 p-6 rounded-lg mb-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">{t.denomination}</p>
                  <p className="text-5xl font-bold text-yellow-800">
                    ₹{result.denomination}
                  </p>
                  <p className="text-lg text-gray-700 mt-2">
                    {result.denomination} {t.rupees}
                  </p>
                  {result.confidence && (
                    <p className="text-sm text-gray-600 mt-2">
                      {t.confidence}: {Math.round(result.confidence)}%
                    </p>
                  )}
                </div>

                <button
                  onClick={() => speak(`${result.denomination} ${t.rupees}`)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full justify-center"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label={t.playAudio}
                >
                  <FaVolumeUp size={20} />
                  <span>{t.playAudio}</span>
                </button>
              </>
            ) : (
              <p className="text-gray-600 text-center">{t.noCurrency}</p>
            )}
          </motion.div>
        )}

        {/* Error */}
        {result && result.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-800">{result.error}</p>
          </div>
        )}

        {/* Supported Denominations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'hi' ? 'समर्थित मूल्यवर्ग' : 'Supported Denominations'}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[10, 20, 50, 100, 200, 500, 2000].map((denom) => (
              <div
                key={denom}
                className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3 text-center"
              >
                <p className="text-lg font-bold text-yellow-800">₹{denom}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * CurrencyAlignmentGuide Component
 * 
 * Provides visual guidance for aligning currency notes in the camera frame
 * with real-time feedback for optimal capture
 */
const CurrencyAlignmentGuide = ({ language }) => {
  const translations = {
    hi: {
      alignNote: 'नोट को गाइड के अंदर संरेखित करें',
      holdSteady: 'स्थिर रखें'
    },
    en: {
      alignNote: 'Align note inside guide',
      holdSteady: 'Hold steady'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="flex items-center justify-center h-full">
      {/* Currency note alignment rectangle */}
      <div className="relative" style={{ width: '85%', height: '60%' }}>
        {/* Main alignment border */}
        <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg shadow-lg">
          {/* Corner markers for better visibility */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-500 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-500 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-500 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-500 rounded-br-lg"></div>
        </div>

        {/* Instruction text */}
        <div className="absolute -bottom-12 left-0 right-0 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            className="text-yellow-400 font-semibold text-lg bg-black bg-opacity-50 px-4 py-2 rounded-lg inline-block"
          >
            {t.alignNote}
          </motion.p>
        </div>

        {/* Center crosshair for precise alignment */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-12 h-12">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-400 transform -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-400 transform -translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Currency;
