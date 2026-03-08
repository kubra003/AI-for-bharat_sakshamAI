import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCamera, FaSpinner, FaVolumeUp } from 'react-icons/fa';

const ColorIdentifier = ({ language }) => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const translations = {
    hi: {
      title: 'रंग पहचानकर्ता',
      backButton: 'वापस जाएं',
      instructions: 'कैमरे को वस्तु की ओर इंगित करें और फोटो लें',
      capture: 'फोटो लें',
      processing: 'प्रसंस्करण...',
      retake: 'फिर से लें',
      detectedColor: 'पहचाना गया रंग',
      playAudio: 'ऑडियो चलाएं',
      noColor: 'कोई रंग नहीं मिला',
      error: 'त्रुटि हुई। कृपया पुनः प्रयास करें।',
      comingSoon: 'जल्द आ रहा है',
      featureNote: 'यह सुविधा विकास में है और जल्द ही उपलब्ध होगी।'
    },
    en: {
      title: 'Color Identifier',
      backButton: 'Go Back',
      instructions: 'Point the camera at an object and capture photo',
      capture: 'Capture Photo',
      processing: 'Processing...',
      retake: 'Retake',
      detectedColor: 'Detected Color',
      playAudio: 'Play Audio',
      noColor: 'No color detected',
      error: 'An error occurred. Please try again.',
      comingSoon: 'Coming Soon',
      featureNote: 'This feature is under development and will be available soon.'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    document.title = t.title;
  }, [t.title]);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setLoading(true);
    setResult(null);

    try {
      // TODO: Implement actual color detection API call
      // For now, show placeholder message
      setTimeout(() => {
        setResult({ 
          message: t.featureNote,
          isPlaceholder: true 
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error detecting color:', error);
      setResult({ error: t.error });
      setLoading(false);
    }
  }, [webcamRef, t.error, t.featureNote]);

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
            className="mr-4 p-3 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300"
            aria-label={t.backButton}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
          <p className="text-yellow-800 font-semibold">{t.comingSoon}</p>
          <p className="text-yellow-700">{t.featureNote}</p>
        </div>

        {/* Instructions */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded">
          <p className="text-orange-800">{t.instructions}</p>
        </div>

        {/* Camera View */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
            {!image ? (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{
                  facingMode: 'environment'
                }}
                aria-label="Camera view"
              />
            ) : (
              <img 
                src={image} 
                alt="Captured object" 
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Color detection target */}
            {!image && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 border-4 border-orange-500 rounded-full opacity-50"></div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={capture}
              disabled={loading}
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={t.capture}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" size={24} />
                  <span>{t.processing}</span>
                </>
              ) : (
                <>
                  <FaCamera size={24} />
                  <span>{t.capture}</span>
                </>
              )}
            </button>

            {image && !loading && (
              <button
                onClick={() => {
                  setImage(null);
                  setResult(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                {t.retake}
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            {result.isPlaceholder ? (
              <div className="text-center">
                <p className="text-lg text-gray-700">{result.message}</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.detectedColor}</h2>
                
                {result.color ? (
                  <>
                    <div className="flex items-center justify-center mb-6">
                      <div
                        className="w-48 h-48 rounded-lg shadow-lg border-4 border-gray-200"
                        style={{ backgroundColor: result.colorHex || '#000000' }}
                        aria-label={`Color swatch: ${result.color}`}
                      ></div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg mb-4 text-center">
                      <p className="text-3xl font-bold text-orange-800">{result.color}</p>
                      {result.colorHex && (
                        <p className="text-sm text-gray-600 mt-2">{result.colorHex}</p>
                      )}
                    </div>

                    <button
                      onClick={() => speak(result.color)}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full justify-center"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                      aria-label={t.playAudio}
                    >
                      <FaVolumeUp size={20} />
                      <span>{t.playAudio}</span>
                    </button>
                  </>
                ) : (
                  <p className="text-gray-600 text-center">{t.noColor}</p>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Error */}
        {result && result.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-800">{result.error}</p>
          </div>
        )}

        {/* Common Colors Reference */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {language === 'hi' ? 'सामान्य रंग' : 'Common Colors'}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: language === 'hi' ? 'लाल' : 'Red', hex: '#FF0000' },
              { name: language === 'hi' ? 'नीला' : 'Blue', hex: '#0000FF' },
              { name: language === 'hi' ? 'हरा' : 'Green', hex: '#00FF00' },
              { name: language === 'hi' ? 'पीला' : 'Yellow', hex: '#FFFF00' },
              { name: language === 'hi' ? 'नारंगी' : 'Orange', hex: '#FFA500' },
              { name: language === 'hi' ? 'बैंगनी' : 'Purple', hex: '#800080' },
              { name: language === 'hi' ? 'गुलाबी' : 'Pink', hex: '#FFC0CB' },
              { name: language === 'hi' ? 'भूरा' : 'Brown', hex: '#A52A2A' }
            ].map((color) => (
              <div key={color.name} className="text-center">
                <div
                  className="w-full h-16 rounded-lg shadow-md border-2 border-gray-200 mb-2"
                  style={{ backgroundColor: color.hex }}
                ></div>
                <p className="text-sm text-gray-700">{color.name}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ColorIdentifier;
