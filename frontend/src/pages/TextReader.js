import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaVolumeUp, FaCheckCircle } from 'react-icons/fa';
import { extractText } from '../services/api';
import CameraCapture from '../components/CameraCapture';

const TextReader = ({ language }) => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const translations = {
    hi: {
      title: 'पाठ पाठक',
      backButton: 'वापस जाएं',
      instructions: 'कैमरे को दस्तावेज़ या संकेत की ओर इंगित करें और फोटो लें',
      capture: 'फोटो लें',
      processing: 'प्रसंस्करण...',
      retake: 'फिर से लें',
      extractedText: 'निकाला गया पाठ',
      playAudio: 'ऑडियो चलाएं',
      noText: 'कोई पाठ नहीं मिला',
      error: 'त्रुटि हुई। कृपया पुनः प्रयास करें।',
      preview: 'पूर्वावलोकन',
      confirmProcess: 'प्रक्रिया की पुष्टि करें',
      previewInstructions: 'छवि की समीक्षा करें और पाठ निष्कर्षण के साथ आगे बढ़ें'
    },
    en: {
      title: 'Text Reader',
      backButton: 'Go Back',
      instructions: 'Point the camera at a document or sign and capture photo',
      capture: 'Capture Photo',
      processing: 'Processing...',
      retake: 'Retake',
      extractedText: 'Extracted Text',
      playAudio: 'Play Audio',
      noText: 'No text found',
      error: 'An error occurred. Please try again.',
      preview: 'Preview',
      confirmProcess: 'Confirm & Process',
      previewInstructions: 'Review the image and proceed with text extraction'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    document.title = t.title;
  }, [t.title]);

  // Text-to-speech function
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  // Handle image capture from CameraCapture component
  const handleCapture = useCallback((compressedImage) => {
    setCapturedImage(compressedImage);
    setShowPreview(true);
    setResult(null);
  }, []);

  // Process the captured image for text extraction
  const processImage = useCallback(async () => {
    if (!capturedImage) return;
    
    setLoading(true);
    setShowPreview(false);

    try {
      const apiUrl = 'https://10wxt88kuh.execute-api.ap-south-1.amazonaws.com/prod/read-text';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage, language })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Text extraction response:', data);
      
      if (data.error) {
        setResult({ error: data.error });
      } else {
        setResult(data);
        // Announce text automatically
        if (data.text) {
          speak(data.text);
        }
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      setResult({ error: t.error + ' ' + error.message });
    } finally {
      setLoading(false);
    }
  }, [capturedImage, language, t.error, speak]);

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
            className="mr-4 p-3 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label={t.backButton}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Instructions */}
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded">
          <p className="text-indigo-800">{t.instructions}</p>
        </div>

        {/* Camera View */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {!showPreview && !result ? (
            <CameraCapture
              onCapture={handleCapture}
              loading={loading}
              language={language}
              captureButtonText={t.capture}
              facingMode="environment"
              maxSizeKB={200}
              overlay={
                // OCR-specific overlay with document alignment guide
                <div className="flex items-center justify-center h-full">
                  <div className="border-4 border-white border-dashed rounded-lg opacity-50"
                       style={{ width: '80%', height: '60%' }}>
                  </div>
                </div>
              }
            />
          ) : showPreview ? (
            // Preview before processing
            <div>
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                <img 
                  src={capturedImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
                <p className="text-blue-800">{t.previewInstructions}</p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={processImage}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label={t.confirmProcess}
                >
                  <FaCheckCircle size={24} />
                  <span>{t.confirmProcess}</span>
                </button>

                <button
                  onClick={() => {
                    setCapturedImage(null);
                    setShowPreview(false);
                    setResult(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  {t.retake}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Results */}
        {result && !result.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.extractedText}</h2>
            
            {result.text ? (
              <>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-lg text-gray-800 whitespace-pre-wrap">{result.text}</p>
                </div>

                <button
                  onClick={() => speak(result.text)}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label={t.playAudio}
                >
                  <FaVolumeUp size={20} />
                  <span>{t.playAudio}</span>
                </button>
              </>
            ) : (
              <p className="text-gray-600">{t.noText}</p>
            )}
          </motion.div>
        )}

        {/* Error */}
        {result && result.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-800">{result.error}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TextReader;
