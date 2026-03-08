import React from 'react';
import { motion } from 'framer-motion';
import { FaLanguage, FaAdjust, FaMicrophone, FaUser } from 'react-icons/fa';

const Settings = ({ 
  language, 
  highContrast, 
  voiceEnabled,
  onLanguageChange,
  onContrastToggle,
  onVoiceToggle
}) => {
  const translations = {
    hi: {
      title: 'सेटिंग्स',
      language: 'भाषा',
      hindi: 'हिंदी',
      english: 'अंग्रेज़ी',
      display: 'प्रदर्शन',
      highContrast: 'उच्च कंट्रास्ट मोड',
      voice: 'आवाज़',
      voiceCommands: 'आवाज़ कमांड सक्षम करें',
      profile: 'प्रोफ़ाइल',
      name: 'नाम',
      phone: 'फ़ोन',
      save: 'सहेजें'
    },
    en: {
      title: 'Settings',
      language: 'Language',
      hindi: 'Hindi',
      english: 'English',
      display: 'Display',
      highContrast: 'High Contrast Mode',
      voice: 'Voice',
      voiceCommands: 'Enable Voice Commands',
      profile: 'Profile',
      name: 'Name',
      phone: 'Phone',
      save: 'Save'
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t.title}</h1>

        {/* Language Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaLanguage className="text-primary-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">{t.language}</h2>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => onLanguageChange('hi')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                language === 'hi'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.hindi}
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                language === 'en'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t.english}
            </button>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaAdjust className="text-primary-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">{t.display}</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-700">{t.highContrast}</span>
            <button
              onClick={onContrastToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                highContrast ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-pressed={highContrast}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaMicrophone className="text-primary-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">{t.voice}</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-700">{t.voiceCommands}</span>
            <button
              onClick={onVoiceToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                voiceEnabled ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-pressed={voiceEnabled}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  voiceEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <FaUser className="text-primary-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">{t.profile}</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.name}
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.phone}
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              {t.save}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
