import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaCamera, FaSpinner, FaVolumeUp, FaArrowLeft, FaComments, FaFilePrescription } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';

const Healthcare = ({ language }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('chatbot'); // 'chatbot' or 'prescription'
  
  // Chatbot state
  const [question, setQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  
  // Prescription reader state
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const translations = {
    hi: {
      title: 'स्वास्थ्य सहायक',
      backButton: 'वापस जाएं',
      chatbot: 'स्वास्थ्य चैटबॉट',
      prescriptionReader: 'प्रिस्क्रिप्शन रीडर',
      askQuestion: 'अपना प्रश्न पूछें',
      placeholder: 'उदाहरण: बुखार, मधुमेह, रक्तचाप',
      askButton: 'पूछें',
      capture: 'फोटो लें',
      processing: 'प्रसंस्करण...',
      analyzing: 'विश्लेषण हो रहा है...',
      playAudio: 'जोर से पढ़ें',
      prescription: 'प्रिस्क्रिप्शन',
      instructions: 'कैमरे को प्रिस्क्रिप्शन की ओर इंगित करें',
      retake: 'फिर से लें',
      disclaimer: 'अस्वीकरण: यह केवल शैक्षिक जानकारी है।',
      poweredBy: 'Tesseract OCR द्वारा संचालित'
    },
    en: {
      title: 'Health Assistant',
      backButton: 'Go Back',
      chatbot: 'Health Chatbot',
      prescriptionReader: 'Prescription Reader',
      askQuestion: 'Ask your health question',
      placeholder: 'Example: fever, diabetes, blood pressure',
      askButton: 'Ask',
      capture: 'Capture Photo',
      processing: 'Processing...',
      analyzing: 'Analyzing...',
      playAudio: 'Read Aloud',
      prescription: 'Prescription',
      instructions: 'Point camera at prescription',
      retake: 'Retake',
      disclaimer: 'Educational info only. Consult your doctor.',
      poweredBy: 'Powered by Tesseract OCR'
    }
  };

  const t = translations[language] || translations.en;

  const healthResponses = {
    en: {
      diabetes: "Diabetes Management:\n• Monitor blood sugar regularly\n• Eat balanced meals with low sugar\n• Exercise 30 minutes daily\n• Take prescribed medications\n• Stay hydrated\n• Regular doctor checkups",
      fever: "Fever Care:\n• Rest and stay hydrated\n• Take paracetamol if needed\n• Use cool compress on forehead\n• Wear light clothing\n• Monitor temperature\n• See doctor if fever persists >3 days",
      'blood pressure': "Blood Pressure Tips:\n• Reduce salt intake\n• Exercise regularly\n• Maintain healthy weight\n• Limit alcohol\n• Manage stress\n• Take medications as prescribed",
      cold: "Cold Relief:\n• Rest well\n• Drink warm fluids\n• Gargle with salt water\n• Use steam inhalation\n• Take vitamin C\n• Avoid cold drinks",
      headache: "Headache Relief:\n• Rest in quiet, dark room\n• Apply cold/warm compress\n• Stay hydrated\n• Avoid screen time\n• Take pain reliever if needed\n• Practice relaxation",
      default: "General Health Tips:\n• Eat nutritious food\n• Exercise regularly\n• Get 7-8 hours sleep\n• Stay hydrated\n• Manage stress\n• Regular health checkups\n\nFor specific concerns, consult a doctor."
    },
    hi: {
      diabetes: "मधुमेह प्रबंधन:\n• नियमित रूप से रक्त शर्करा की जांच करें\n• कम चीनी वाला संतुलित भोजन करें\n• रोजाना 30 मिनट व्यायाम करें\n• निर्धारित दवाएं लें\n• हाइड्रेटेड रहें\n• नियमित डॉक्टर चेकअप",
      fever: "बुखार की देखभाल:\n• आराम करें और हाइड्रेटेड रहें\n• जरूरत पड़ने पर पैरासिटामोल लें\n• माथे पर ठंडी पट्टी रखें\n• हल्के कपड़े पहनें\n• तापमान की निगरानी करें\n• 3 दिन से अधिक बुखार हो तो डॉक्टर से मिलें",
      'blood pressure': "रक्तचाप सुझाव:\n• नमक का सेवन कम करें\n• नियमित व्यायाम करें\n• स्वस्थ वजन बनाए रखें\n• शराब सीमित करें\n• तनाव प्रबंधित करें\n• निर्धारित दवाएं लें",
      cold: "सर्दी से राहत:\n• अच्छी तरह आराम करें\n• गर्म तरल पदार्थ पिएं\n• नमक के पानी से गरारे करें\n• भाप लें\n• विटामिन सी लें\n• ठंडे पेय से बचें",
      headache: "सिरदर्द से राहत:\n• शांत, अंधेरे कमरे में आराम करें\n• ठंडी/गर्म पट्टी लगाएं\n• हाइड्रेटेड रहें\n• स्क्रीन टाइम से बचें\n• जरूरत पड़ने पर दर्द निवारक लें\n• विश्राम का अभ्यास करें",
      default: "सामान्य स्वास्थ्य सुझाव:\n• पौष्टिक भोजन करें\n• नियमित व्यायाम करें\n• 7-8 घंटे की नींद लें\n• हाइड्रेटेड रहें\n• तनाव प्रबंधित करें\n• नियमित स्वास्थ्य जांच\n\nविशिष्ट चिंताओं के लिए डॉक्टर से परामर्श लें।"
    }
  };

  const handleAsk = () => {
    if (!question.trim()) return;

    const q = question.toLowerCase();
    const responses = healthResponses[language] || healthResponses.en;
    
    let answer = responses.default;
    
    for (const [key, value] of Object.entries(responses)) {
      if (key !== 'default' && q.includes(key)) {
        answer = value;
        break;
      }
    }
    
    setChatResponse(answer);
    speak(answer);
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setLoading(true);
    setResult(null);
    setProgress(0);

    try {
      const { data: { text } } = await Tesseract.recognize(
        imageSrc,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      
      const cleanedText = text.trim() || (language === 'hi' ? 'टेक्स्ट नहीं मिला' : 'No text found');
      setResult(cleanedText);
      speak(cleanedText);
    } catch (error) {
      setResult(language === 'hi' ? `त्रुटि: ${error.message}` : `Error: ${error.message}`);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [webcamRef, language]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="mr-4 p-3 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <FaArrowLeft size={24} />
        </button>
        <h1 className="text-4xl font-bold">{t.title}</h1>
      </div>

      {/* Mode Selection */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMode('chatbot')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            mode === 'chatbot'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FaComments size={20} />
          {t.chatbot}
        </button>
        <button
          onClick={() => setMode('prescription')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            mode === 'prescription'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FaFilePrescription size={20} />
          {t.prescriptionReader}
        </button>
      </div>

      {/* Chatbot Mode */}
      {mode === 'chatbot' && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-bold mb-4">{t.askQuestion}</h3>
          <p className="text-sm text-gray-600 mb-4">{t.placeholder}</p>
          
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            placeholder={t.placeholder}
            className="w-full p-4 text-lg border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 mb-4"
          />
          <button
            onClick={handleAsk}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-lg hover:from-pink-600 hover:to-purple-600 text-lg font-semibold"
          >
            {t.askButton}
          </button>
          
          {chatResponse && (
            <div className="mt-6 bg-pink-50 border-l-4 border-pink-500 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold">Response:</h4>
                <button
                  onClick={() => speak(chatResponse)}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 flex items-center gap-2"
                >
                  <FaVolumeUp size={20} />
                  {t.playAudio}
                </button>
              </div>
              <p className="text-lg whitespace-pre-line">{chatResponse}</p>
            </div>
          )}
        </div>
      )}

      {/* Prescription Reader Mode */}
      {mode === 'prescription' && (
        <>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-blue-800">{t.instructions}</p>
            <p className="text-sm text-blue-600 mt-1">{t.poweredBy}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
              {!image ? (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: 'environment' }}
                />
              ) : (
                <img src={image} alt="Captured" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={capture}
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-lg font-semibold disabled:opacity-50"
                style={{ minHeight: '56px' }}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" size={24} />
                    <span>{t.analyzing} {progress}%</span>
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
                  onClick={() => { setImage(null); setResult(null); }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold"
                  style={{ minHeight: '56px' }}
                >
                  {t.retake}
                </button>
              )}
            </div>
          </div>

          {result && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{t.prescription}:</h2>
                <button
                  onClick={() => speak(result)}
                  className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  <FaVolumeUp size={20} />
                  <span>{t.playAudio}</span>
                </button>
              </div>
              <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-lg">
                <p className="text-lg whitespace-pre-line">{result}</p>
              </div>
            </div>
          )}
        </>
      )}

      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-sm text-red-800"><strong>⚠️ {t.disclaimer}</strong></p>
      </div>
    </div>
  );
};

export default Healthcare;
