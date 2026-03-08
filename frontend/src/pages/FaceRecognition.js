import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import CameraCapture from '../components/CameraCapture';

const FaceRecognition = ({ language }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('recognize'); // 'recognize' or 'register'
  const [result, setResult] = useState(null);
  const [name, setName] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);

  const translations = {
    hi: {
      title: 'चेहरा पहचान',
      backButton: 'वापस जाएं',
      recognize: 'चेहरा पहचानें',
      register: 'नया चेहरा पंजीकृत करें',
      instructions: 'कैमरे को चेहरे की ओर इंगित करें और फोटो लें',
      registerInstructions: 'व्यक्ति का नाम दर्ज करें और उनका चेहरा कैप्चर करें',
      capture: 'फोटो लें',
      processing: 'प्रसंस्करण...',
      retake: 'फिर से लें',
      enterName: 'नाम दर्ज करें',
      recognized: 'पहचाना गया',
      registered: 'पंजीकृत',
      unknown: 'अज्ञात चेहरा',
      consent: 'मैं अपने चेहरे के डेटा को संग्रहीत करने के लिए सहमति देता/देती हूं',
      consentRequired: 'कृपया आगे बढ़ने के लिए सहमति दें',
      consentDialogTitle: 'चेहरा डेटा सहमति',
      consentDialogMessage: 'क्या आप अपने चेहरे के डेटा को एन्क्रिप्टेड और सुरक्षित रूप से संग्रहीत करने के लिए सहमति देते हैं? आप किसी भी समय अपना डेटा हटा सकते हैं।',
      consentAccept: 'हां, मैं सहमत हूं',
      consentDecline: 'नहीं',
      multipleFacesWarning: 'कई चेहरे पाए गए। कृपया सुनिश्चित करें कि फ्रेम में केवल एक चेहरा है।',
      noFaceDetected: 'कोई चेहरा नहीं मिला। कृपया अपने चेहरे को ओवल गाइड के भीतर रखें।',
      alignFace: 'कृपया अपने चेहरे को ओवल गाइड के भीतर संरेखित करें',
      error: 'त्रुटि हुई। कृपया पुनः प्रयास करें।',
      comingSoon: 'जल्द आ रहा है',
      featureNote: 'यह सुविधा विकास में है और जल्द ही उपलब्ध होगी।'
    },
    en: {
      title: 'Face Recognition',
      backButton: 'Go Back',
      recognize: 'Recognize Face',
      register: 'Register New Face',
      instructions: 'Point the camera at a face and capture photo',
      registerInstructions: 'Enter the person\'s name and capture their face',
      capture: 'Capture Photo',
      processing: 'Processing...',
      retake: 'Retake',
      enterName: 'Enter Name',
      recognized: 'Recognized',
      registered: 'Registered',
      unknown: 'Unknown Face',
      consent: 'I consent to storing my face data',
      consentRequired: 'Please provide consent to proceed',
      consentDialogTitle: 'Face Data Consent',
      consentDialogMessage: 'Do you consent to storing your face data encrypted and securely? You can delete your data at any time.',
      consentAccept: 'Yes, I Consent',
      consentDecline: 'No',
      multipleFacesWarning: 'Multiple faces detected. Please ensure only one face is in the frame.',
      noFaceDetected: 'No face detected. Please position your face within the oval guide.',
      alignFace: 'Please align your face within the oval guide',
      error: 'An error occurred. Please try again.',
      comingSoon: 'Coming Soon',
      featureNote: 'This feature is under development and will be available soon.'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    document.title = t.title;
  }, [t.title]);

  // Handle image capture from CameraCapture component
  const handleCapture = useCallback(async (capturedImage) => {
    // Check consent for registration mode
    if (mode === 'register' && !consentGiven) {
      setShowConsentDialog(true);
      return;
    }

    setImage(capturedImage);
    setLoading(true);
    setResult(null);

    try {
      const apiUrl = 'https://10wxt88kuh.execute-api.ap-south-1.amazonaws.com/prod/recognize-face';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage })
      });
      const data = await response.json();
      
      if (data.faces && data.faces.length > 0) {
        const face = data.faces[0];
        const emotions = face.emotions.join(', ');
        const message = `${face.gender}, Age: ${face.ageRange.Low}-${face.ageRange.High}, Emotions: ${emotions}`;
        setResult({ 
          name: message,
          confidence: face.confidence,
          count: data.count
        });
        speak(message);
      } else {
        setResult({ error: t.noFaceDetected });
        speak(t.noFaceDetected);
      }
    } catch (error) {
      console.error('Error processing face:', error);
      setResult({ error: t.error });
      speak(t.error);
    } finally {
      setLoading(false);
    }
  }, [mode, consentGiven, t.error, t.noFaceDetected, language]);

  // Handle consent acceptance
  const handleConsentAccept = useCallback(() => {
    setConsentGiven(true);
    setShowConsentDialog(false);
    speak(t.consentAccept);
  }, [t.consentAccept]);

  // Handle consent decline
  const handleConsentDecline = useCallback(() => {
    setShowConsentDialog(false);
    speak(t.consentDecline);
  }, [t.consentDecline]);

  // Reset consent when switching modes
  useEffect(() => {
    if (mode === 'recognize') {
      setConsentGiven(false);
    }
  }, [mode]);

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
            className="mr-4 p-3 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors focus:outline-none focus:ring-4 focus:ring-purple-300"
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
            onClick={() => setMode('recognize')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              mode === 'recognize'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-pressed={mode === 'recognize'}
          >
            <FaUserCheck className="inline mr-2" />
            {t.recognize}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              mode === 'register'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-pressed={mode === 'register'}
          >
            <FaUserPlus className="inline mr-2" />
            {t.register}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded">
          <p className="text-purple-800">
            {mode === 'register' ? t.registerInstructions : t.instructions}
          </p>
        </div>

        {/* Name Input for Registration */}
        {mode === 'register' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t.enterName}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder={t.enterName}
              style={{ minHeight: '44px' }}
            />
          </div>
        )}

        {/* Camera View */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Face alignment instruction */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-3 mb-4 rounded">
            <p className="text-purple-800 text-sm">{t.alignFace}</p>
          </div>

          {/* CameraCapture component with face detection overlay */}
          <CameraCapture
            onCapture={handleCapture}
            loading={loading}
            language={language}
            captureButtonText={t.capture}
            facingMode="user"
            maxSizeKB={200}
            overlay={
              // Face detection oval guide overlay
              <div className="flex items-center justify-center h-full">
                <div 
                  className="border-4 border-purple-500 rounded-full opacity-60"
                  style={{
                    width: '280px',
                    height: '360px',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                  }}
                  aria-hidden="true"
                >
                  {/* Corner guides for better alignment */}
                  <div className="relative w-full h-full">
                    {/* Top guide */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                      <div className="w-1 h-6 bg-purple-400"></div>
                    </div>
                    {/* Bottom guide */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                      <div className="w-1 h-6 bg-purple-400"></div>
                    </div>
                    {/* Left guide */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
                      <div className="w-6 h-1 bg-purple-400"></div>
                    </div>
                    {/* Right guide */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
                      <div className="w-6 h-1 bg-purple-400"></div>
                    </div>
                  </div>
                </div>
              </div>
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
            {result.isPlaceholder ? (
              <div className="text-center">
                <p className="text-lg text-gray-700">{result.message}</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {mode === 'register' ? t.registered : t.recognized}
                </h2>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-lg text-purple-800">{result.name || t.unknown}</p>
                </div>
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

        {/* Consent Notice */}
        {mode === 'register' && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-6">
            <p className="text-blue-800 text-sm">
              <strong>{t.consent}</strong>
              <br />
              {language === 'hi' 
                ? 'आपका चेहरा डेटा एन्क्रिप्टेड और सुरक्षित रूप से संग्रहीत किया जाएगा। आप किसी भी समय अपना डेटा हटा सकते हैं।'
                : 'Your face data will be stored encrypted and securely. You can delete your data at any time.'}
            </p>
          </div>
        )}

        {/* Consent Dialog Modal */}
        {showConsentDialog && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-labelledby="consent-dialog-title"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
            >
              <h2 
                id="consent-dialog-title"
                className="text-2xl font-bold text-gray-900 mb-4"
              >
                {t.consentDialogTitle}
              </h2>
              <p className="text-gray-700 mb-6">
                {t.consentDialogMessage}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleConsentAccept}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  autoFocus
                >
                  {t.consentAccept}
                </button>
                <button
                  onClick={handleConsentDecline}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  {t.consentDecline}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FaceRecognition;
