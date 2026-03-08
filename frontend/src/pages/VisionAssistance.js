import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaCamera, FaSpinner, FaVolumeUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { detectObjects, extractText } from '../services/api';

const VisionAssistance = ({ language }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('object'); // 'object' or 'text'

  const translations = {
    hi: {
      title: 'दृष्टि सहायता',
      objectDetection: 'वस्तु पहचान',
      textReading: 'पाठ पढ़ना',
      capture: 'फोटो लें',
      processing: 'प्रसंस्करण...',
      playAudio: 'ऑडियो चलाएं',
      detected: 'पहचाना गया',
      noCamera: 'कैमरा उपलब्ध नहीं है',
      instructions: 'कैमरे को वस्तु या पाठ की ओर इंगित करें और फोटो लें बटन दबाएं'
    },
    en: {
      title: 'Vision Assistance',
      objectDetection: 'Object Detection',
      textReading: 'Text Reading',
      capture: 'Capture Photo',
      processing: 'Processing...',
      playAudio: 'Play Audio',
      detected: 'Detected',
      noCamera: 'Camera not available',
      instructions: 'Point the camera at an object or text and press Capture Photo'
    }
  };

  const t = translations[language] || translations.en;

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setLoading(true);
    setResult(null);

    try {
      let response;
      if (mode === 'object') {
        response = await detectObjects(imageSrc, language);
      } else {
        response = await extractText(imageSrc, language);
      }
      
      setResult(response);
      
      // Play audio automatically
      if (response.audioUrl) {
        playAudio(response.audioUrl);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setResult({ error: 'Failed to process image. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [webcamRef, mode, language]);

  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{t.title}</h1>

        {/* Mode Selection */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setMode('object')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              mode === 'object'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-pressed={mode === 'object'}
          >
            {t.objectDetection}
          </button>
          <button
            onClick={() => setMode('text')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              mode === 'text'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-pressed={mode === 'text'}
          >
            {t.textReading}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-blue-800">{t.instructions}</p>
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
                alt="Captured" 
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Capture Button */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={capture}
              disabled={loading}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              >
                Retake
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.detected}</h2>
            
            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-lg text-gray-800">{result.description}</p>
            </div>

            {/* Objects List (for object detection) */}
            {result.objects && result.objects.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Objects:</h3>
                <div className="flex flex-wrap gap-2">
                  {result.objects.map((obj, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {obj.name} ({Math.round(obj.confidence)}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Text (for OCR) */}
            {result.text && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Extracted Text:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{result.text}</p>
                </div>
              </div>
            )}

            {/* Play Audio Button */}
            {result.audioUrl && (
              <button
                onClick={() => playAudio(result.audioUrl)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                aria-label={t.playAudio}
              >
                <FaVolumeUp size={20} />
                <span>{t.playAudio}</span>
              </button>
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

export default VisionAssistance;
