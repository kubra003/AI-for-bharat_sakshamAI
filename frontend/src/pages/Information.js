import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaQuestionCircle, FaUniversity, FaHandsHelping, FaVolumeUp } from 'react-icons/fa';

const Information = ({ language }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const translations = {
    hi: {
      title: 'जानकारी सहायक',
      backButton: 'वापस जाएं',
      categories: 'श्रेणियाँ',
      govSchemes: 'सरकारी योजनाएं',
      publicServices: 'सार्वजनिक सेवाएं',
      commonQuestions: 'सामान्य प्रश्न',
      selectCategory: 'एक श्रेणी चुनें',
      listen: 'सुनें'
    },
    en: {
      title: 'Information Assistant',
      backButton: 'Go Back',
      categories: 'Categories',
      govSchemes: 'Government Schemes',
      publicServices: 'Public Services',
      commonQuestions: 'Common Questions',
      selectCategory: 'Select a category',
      listen: 'Listen'
    }
  };

  const informationData = {
    hi: {
      govSchemes: {
        title: 'सरकारी योजनाएं',
        questions: [
          {
            q: 'दिव्यांगजन के लिए कौन सी योजनाएं हैं?',
            a: 'प्रमुख योजनाएं: 1) दीनदयाल विकलांग पुनर्वास योजना 2) सुगम्य भारत अभियान 3) विकलांग छात्रों के लिए छात्रवृत्ति 4) राष्ट्रीय विकलांग वित्त और विकास निगम (NHFDC) ऋण योजना'
          },
          {
            q: 'विकलांगता प्रमाण पत्र कैसे प्राप्त करें?',
            a: 'निकटतम सरकारी अस्पताल या प्राथमिक स्वास्थ्य केंद्र में जाएं। मेडिकल बोर्ड द्वारा जांच के बाद प्रमाण पत्र जारी किया जाता है। ऑनलाइन आवेदन UDID पोर्टल पर भी किया जा सकता है।'
          },
          {
            q: 'UDID कार्ड क्या है?',
            a: 'UDID (Unique Disability ID) एक विशेष पहचान पत्र है जो दिव्यांगजनों को दिया जाता है। यह सभी सरकारी योजनाओं और लाभों के लिए एकल दस्तावेज़ के रूप में काम करता है।'
          }
        ]
      },
      publicServices: {
        title: 'सार्वजनिक सेवाएं',
        questions: [
          {
            q: 'निकटतम सरकारी अस्पताल कैसे खोजें?',
            a: 'आप 104 हेल्पलाइन पर कॉल कर सकते हैं या आरोग्य सेतु ऐप का उपयोग कर सकते हैं। जिला प्रशासन की वेबसाइट पर भी सूची उपलब्ध है।'
          },
          {
            q: 'बैंक खाता कैसे खोलें?',
            a: 'आधार कार्ड, पैन कार्ड और पते का प्रमाण लेकर निकटतम बैंक शाखा में जाएं। जन धन योजना के तहत शून्य बैलेंस खाता खोला जा सकता है।'
          },
          {
            q: 'आपातकालीन नंबर क्या हैं?',
            a: 'पुलिस: 100, एम्बुलेंस: 108, महिला हेल्पलाइन: 1091, चाइल्ड हेल्पलाइन: 1098, आपदा प्रबंधन: 108'
          }
        ]
      },
      commonQuestions: {
        title: 'सामान्य प्रश्न',
        questions: [
          {
            q: 'राशन कार्ड कैसे बनवाएं?',
            a: 'खाद्य विभाग कार्यालय में आवेदन करें या ऑनलाइन राज्य के खाद्य विभाग पोर्टल पर आवेदन करें। आधार कार्ड, पते का प्रमाण और आय प्रमाण पत्र आवश्यक हैं।'
          },
          {
            q: 'मुफ्त कानूनी सहायता कैसे प्राप्त करें?',
            a: 'जिला कानूनी सेवा प्राधिकरण (DLSA) से संपर्क करें। गरीबों और दिव्यांगजनों के लिए मुफ्त कानूनी सहायता उपलब्ध है।'
          },
          {
            q: 'पेंशन योजना के लिए आवेदन कैसे करें?',
            a: 'ग्राम पंचायत या नगर पालिका कार्यालय में आवेदन करें। विकलांगता पेंशन के लिए विकलांगता प्रमाण पत्र आवश्यक है।'
          }
        ]
      }
    },
    en: {
      govSchemes: {
        title: 'Government Schemes',
        questions: [
          {
            q: 'What schemes are available for persons with disabilities?',
            a: 'Key schemes: 1) Deendayal Disabled Rehabilitation Scheme 2) Accessible India Campaign 3) Scholarships for disabled students 4) National Handicapped Finance and Development Corporation (NHFDC) loan schemes'
          },
          {
            q: 'How to get disability certificate?',
            a: 'Visit nearest government hospital or primary health center. Certificate is issued after medical board examination. Online application can also be made on UDID portal.'
          },
          {
            q: 'What is UDID card?',
            a: 'UDID (Unique Disability ID) is a special identity card given to persons with disabilities. It serves as a single document for all government schemes and benefits.'
          }
        ]
      },
      publicServices: {
        title: 'Public Services',
        questions: [
          {
            q: 'How to find nearest government hospital?',
            a: 'You can call 104 helpline or use Aarogya Setu app. List is also available on district administration website.'
          },
          {
            q: 'How to open bank account?',
            a: 'Visit nearest bank branch with Aadhaar card, PAN card and address proof. Zero balance account can be opened under Jan Dhan Yojana.'
          },
          {
            q: 'What are emergency numbers?',
            a: 'Police: 100, Ambulance: 108, Women Helpline: 1091, Child Helpline: 1098, Disaster Management: 108'
          }
        ]
      },
      commonQuestions: {
        title: 'Common Questions',
        questions: [
          {
            q: 'How to get ration card?',
            a: 'Apply at Food Department office or online on state food department portal. Aadhaar card, address proof and income certificate are required.'
          },
          {
            q: 'How to get free legal aid?',
            a: 'Contact District Legal Services Authority (DLSA). Free legal aid is available for poor and persons with disabilities.'
          },
          {
            q: 'How to apply for pension scheme?',
            a: 'Apply at Gram Panchayat or Municipal office. Disability certificate is required for disability pension.'
          }
        ]
      }
    }
  };

  const t = translations[language] || translations.en;
  const data = informationData[language] || informationData.en;

  const categories = [
    { id: 'govSchemes', title: t.govSchemes, icon: FaUniversity, color: 'blue' },
    { id: 'publicServices', title: t.publicServices, icon: FaHandsHelping, color: 'green' },
    { id: 'commonQuestions', title: t.commonQuestions, icon: FaQuestionCircle, color: 'purple' }
  ];

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    handleSpeak(question.a);
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
            onClick={() => {
              if (selectedQuestion) {
                setSelectedQuestion(null);
              } else if (selectedCategory) {
                setSelectedCategory(null);
              } else {
                navigate('/');
              }
            }}
            className="mr-4 p-3 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors focus:outline-none focus:ring-4 focus:ring-teal-300"
            aria-label={t.backButton}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Category Selection */}
        {!selectedCategory && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.selectCategory}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 text-left`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <category.icon className={`text-${category.color}-500 mb-4`} size={48} />
                  <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Questions List */}
        {selectedCategory && !selectedQuestion && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {data[selectedCategory].title}
            </h2>
            <div className="space-y-4">
              {data[selectedCategory].questions.map((question, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <div className="flex items-start">
                    <FaQuestionCircle className="text-teal-500 mr-3 mt-1 flex-shrink-0" size={24} />
                    <p className="text-lg font-semibold text-gray-900">{question.q}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Answer Display */}
        {selectedQuestion && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-start mb-4">
                <FaQuestionCircle className="text-teal-500 mr-3 mt-1 flex-shrink-0" size={24} />
                <h3 className="text-xl font-bold text-gray-900">{selectedQuestion.q}</h3>
              </div>
              <div className="bg-teal-50 rounded-lg p-6">
                <p className="text-lg text-gray-800 leading-relaxed">{selectedQuestion.a}</p>
              </div>
            </div>
            
            <button
              onClick={() => handleSpeak(selectedQuestion.a)}
              className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <FaVolumeUp size={20} />
              <span>{t.listen}</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Information;
