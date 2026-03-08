import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaEye, 
  FaComments, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaFileAlt,
  FaUserFriends,
  FaMoneyBillWave
} from 'react-icons/fa';

const HomePage = ({ language }) => {
  const announcementRef = useRef(null);

  const translations = {
    hi: {
      title: 'सक्षमAI ग्रामीण में आपका स्वागत है',
      subtitle: 'ग्रामीण भारत के लिए AI-संचालित सहायक प्रौद्योगिकी',
      features: 'सुविधाएँ',
      vision: {
        title: 'दृष्टि सहायता',
        desc: 'वस्तुओं की पहचान करें और दृश्य विवरण प्राप्त करें'
      },
      textReader: {
        title: 'पाठ पाठक',
        desc: 'दस्तावेज़ों और संकेतों से पाठ पढ़ें'
      },
      faceRecognition: {
        title: 'चेहरा पहचान',
        desc: 'परिचित चेहरों को पहचानें और याद रखें'
      },

      communication: {
        title: 'संचार',
        desc: 'पाठ-से-भाषण और भाषण-से-पाठ रूपांतरण'
      },
      emergency: {
        title: 'आपातकालीन अलर्ट',
        desc: 'एक टैप में आपातकालीन संपर्कों को सूचित करें'
      },
      schemes: {
        title: 'सरकारी योजनाएं',
        desc: 'सरकारी योजनाओं और सेवाओं के बारे में जानें'
      },
      currency: {
        title: 'मुद्रा पहचानकर्ता',
        desc: 'भारतीय मुद्रा नोटों की पहचान करें'
      },
      colorIdentifier: {
        title: 'रंग पहचानकर्ता',
        desc: 'वस्तुओं के रंगों की पहचान करें'
      },
      about: 'सक्षमAI ग्रामीण के बारे में',
      aboutText: 'सक्षमAI ग्रामीण एक AI-संचालित सहायक प्रौद्योगिकी मंच है जो ग्रामीण भारत में विभिन्न रूप से सक्षम व्यक्तियों को सशक्त बनाने के लिए डिज़ाइन किया गया है। हम दृष्टि सहायता, संचार समर्थन, स्वास्थ्य जानकारी और आपातकालीन सेवाएं प्रदान करते हैं।'
    },
    en: {
      title: 'Welcome to SakshamAI Rural',
      subtitle: 'AI-Powered Assistive Technology for Rural India',
      features: 'Features',
      vision: {
        title: 'Vision Assistance',
        desc: 'Identify objects and get visual descriptions'
      },
      textReader: {
        title: 'Text Reader',
        desc: 'Read text from documents and signs'
      },
      faceRecognition: {
        title: 'Face Recognition',
        desc: 'Recognize and remember familiar faces'
      },

      communication: {
        title: 'Communication',
        desc: 'Text-to-speech and speech-to-text conversion'
      },
      emergency: {
        title: 'Emergency Alert',
        desc: 'Notify emergency contacts with one tap'
      },
      schemes: {
        title: 'Government Schemes',
        desc: 'Learn about government schemes and services'
      },
      currency: {
        title: 'Currency Detector',
        desc: 'Identify Indian currency notes'
      },
      colorIdentifier: {
        title: 'Color Identifier',
        desc: 'Identify colors of objects'
      },
      about: 'About SakshamAI Rural',
      aboutText: 'SakshamAI Rural is an AI-powered assistive technology platform designed to empower differently abled individuals in rural India. We provide vision assistance, communication support, healthcare information, and emergency services.'
    }
  };

  const t = translations[language] || translations.en;

  const features = [
    {
      icon: FaEye,
      title: t.vision.title,
      desc: t.vision.desc,
      path: '/vision',
      gradient: 'from-blue-500 to-blue-700',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-800'
    },
    {
      icon: FaFileAlt,
      title: t.textReader.title,
      desc: t.textReader.desc,
      path: '/text-reader',
      gradient: 'from-indigo-500 to-indigo-700',
      hoverGradient: 'hover:from-indigo-600 hover:to-indigo-800'
    },
    {
      icon: FaUserFriends,
      title: t.faceRecognition.title,
      desc: t.faceRecognition.desc,
      path: '/face-recognition',
      gradient: 'from-purple-500 to-purple-700',
      hoverGradient: 'hover:from-purple-600 hover:to-purple-800'
    },
    {
      icon: FaComments,
      title: t.communication.title,
      desc: t.communication.desc,
      path: '/communication',
      gradient: 'from-green-500 to-green-700',
      hoverGradient: 'hover:from-green-600 hover:to-green-800'
    },
    {
      icon: FaExclamationTriangle,
      title: t.emergency.title,
      desc: t.emergency.desc,
      path: '/emergency',
      gradient: 'from-red-500 to-red-700',
      hoverGradient: 'hover:from-red-600 hover:to-red-800'
    },
    {
      icon: FaInfoCircle,
      title: t.schemes.title,
      desc: t.schemes.desc,
      path: '/information',
      gradient: 'from-teal-500 to-teal-700',
      hoverGradient: 'hover:from-teal-600 hover:to-teal-800'
    },
    {
      icon: FaMoneyBillWave,
      title: t.currency.title,
      desc: t.currency.desc,
      path: '/currency',
      gradient: 'from-yellow-500 to-yellow-700',
      hoverGradient: 'hover:from-yellow-600 hover:to-yellow-800'
    }
  ];

  // Voice announcement function
  const announceFeature = (featureTitle, featureDesc) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${featureTitle}. ${featureDesc}`);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Announce page title for screen readers
    document.title = t.title;
    
    // Cleanup speech synthesis on unmount
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [t.title]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Screen reader announcement area */}
      <div 
        ref={announcementRef}
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t.subtitle}
        </p>
      </motion.div>

      {/* Features Grid */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {t.features}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={feature.path}
                  className={`block p-8 rounded-2xl shadow-xl bg-gradient-to-br ${feature.gradient} ${feature.hoverGradient} text-white transition-all transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 min-h-[180px]`}
                  aria-label={`${feature.title}: ${feature.desc}`}
                  onFocus={() => announceFeature(feature.title, feature.desc)}
                  onMouseEnter={() => announceFeature(feature.title, feature.desc)}
                  tabIndex={0}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-4 bg-white bg-opacity-20 rounded-full">
                      <Icon size={48} aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-lg opacity-90 leading-relaxed">{feature.desc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
        aria-labelledby="about-heading"
      >
        <h2 id="about-heading" className="text-3xl font-bold text-gray-900 mb-4">
          {t.about}
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          {t.aboutText}
        </p>
      </motion.section>

      {/* Accessibility Notice */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md" 
        role="note"
      >
        <p className="text-sm text-blue-900 leading-relaxed">
          <strong className="text-blue-800">Accessibility:</strong> This platform is designed with accessibility in mind. 
          Use voice commands, keyboard navigation, or screen readers for the best experience. 
          Each feature card announces its purpose when focused.
        </p>
      </motion.div>
    </div>
  );
};

export default HomePage;
