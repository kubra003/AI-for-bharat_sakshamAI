import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaExclamationTriangle, FaPhone, FaMapMarkerAlt, FaCheck, FaPlus, FaTrash } from 'react-icons/fa';

const Emergency = ({ language }) => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [location, setLocation] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  const translations = {
    hi: {
      title: 'आपातकालीन अलर्ट',
      backButton: 'वापस जाएं',
      warning: 'केवल वास्तविक आपात स्थिति में उपयोग करें',
      sendAlert: 'आपातकालीन अलर्ट भेजें',
      sending: 'भेजा जा रहा है...',
      sent: 'अलर्ट भेजा गया!',
      sentMessage: 'आपके सभी आपातकालीन संपर्कों को SMS भेजा गया है।',
      contacts: 'आपातकालीन संपर्क',
      noContacts: 'कोई आपातकालीन संपर्क नहीं। संपर्क जोड़ने के लिए + बटन दबाएं।',
      addContact: 'संपर्क जोड़ें',
      name: 'नाम',
      phone: 'फोन नंबर',
      relationship: 'संबंध',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      location: 'स्थान',
      gettingLocation: 'स्थान प्राप्त कर रहे हैं...',
      locationError: 'स्थान प्राप्त नहीं कर सके',
      alertWillInclude: 'अलर्ट में शामिल होगा:',
      yourLocation: 'आपका स्थान (GPS निर्देशांक)',
      timestamp: 'समय',
      callNow: 'अभी कॉल करें',
      smsWillBeSent: 'SMS आपके फोन के मैसेजिंग ऐप से भेजा जाएगा'
    },
    en: {
      title: 'Emergency Alert',
      backButton: 'Go Back',
      warning: 'Use only in real emergencies',
      sendAlert: 'Send Emergency Alert',
      sending: 'Sending...',
      sent: 'Alert Sent!',
      sentMessage: 'SMS sent to all your emergency contacts.',
      contacts: 'Emergency Contacts',
      noContacts: 'No emergency contacts. Press + button to add contacts.',
      addContact: 'Add Contact',
      name: 'Name',
      phone: 'Phone Number',
      relationship: 'Relationship',
      save: 'Save',
      cancel: 'Cancel',
      location: 'Location',
      gettingLocation: 'Getting location...',
      locationError: 'Could not get location',
      alertWillInclude: 'Alert will include:',
      yourLocation: 'Your location (GPS coordinates)',
      timestamp: 'Timestamp',
      callNow: 'Call Now',
      smsWillBeSent: 'SMS will be sent from your phone messaging app'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError(t.locationError);
        }
      );
    }

    // Load emergency contacts from localStorage
    loadContacts();
  }, []);

  const loadContacts = () => {
    const saved = localStorage.getItem('emergencyContacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    }
  };

  const saveContacts = (newContacts) => {
    localStorage.setItem('emergencyContacts', JSON.stringify(newContacts));
    setContacts(newContacts);
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const updated = [...contacts, newContact];
      saveContacts(updated);
      setNewContact({ name: '', phone: '', relationship: '' });
      setShowAddContact(false);
    }
  };

  const handleDeleteContact = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    saveContacts(updated);
  };

  const handleSendAlert = () => {
    if (!location) {
      setError(t.locationError);
      return;
    }

    if (contacts.length === 0) {
      setError(t.noContacts);
      return;
    }

    setSending(true);
    setError(null);

    // Create emergency message
    const timestamp = new Date().toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US');
    const mapLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    const message = language === 'hi' 
      ? `आपातकाल! मुझे मदद चाहिए। मेरा स्थान: ${mapLink} समय: ${timestamp}`
      : `EMERGENCY! I need help. My location: ${mapLink} Time: ${timestamp}`;

    // Send SMS to all contacts using SMS URI scheme
    contacts.forEach((contact) => {
      const smsUri = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
      window.open(smsUri, '_blank');
    });

    setSending(false);
    setSent(true);

    // Speak confirmation
    speak(t.sentMessage, language);

    // Reset after 5 seconds
    setTimeout(() => {
      setSent(false);
    }, 5000);
  };

  const speak = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCallContact = (phone) => {
    window.location.href = `tel:${phone}`;
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
            className="mr-4 p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors focus:outline-none focus:ring-4 focus:ring-red-300"
            aria-label={t.backButton}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3" size={24} />
            <p className="text-red-800 font-semibold">{t.warning}</p>
          </div>
        </div>

        {/* Emergency Button */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          {!sent ? (
            <>
              <button
                onClick={handleSendAlert}
                disabled={sending || !location || contacts.length === 0}
                className="w-full max-w-md mx-auto bg-red-600 hover:bg-red-700 text-white px-12 py-8 rounded-xl font-bold text-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg mb-4"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label={t.sendAlert}
              >
                {sending ? (
                  <span>{t.sending}</span>
                ) : (
                  <>
                    <FaExclamationTriangle className="inline mr-3" size={32} />
                    {t.sendAlert}
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600">{t.smsWillBeSent}</p>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <FaCheck className="text-green-600 mx-auto mb-4" size={64} />
              <h2 className="text-3xl font-bold text-green-600 mb-2">{t.sent}</h2>
              <p className="text-lg text-gray-700">{t.sentMessage}</p>
            </motion.div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Alert Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.alertWillInclude}</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <FaMapMarkerAlt className="text-red-600 mr-2 mt-1" />
              <div>
                <span className="text-gray-700">{t.yourLocation}</span>
                {location && (
                  <p className="text-sm text-gray-500 mt-1">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                )}
                {!location && (
                  <p className="text-sm text-gray-500 mt-1">{t.gettingLocation}</p>
                )}
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span className="text-gray-700">{t.timestamp}</span>
            </li>
          </ul>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{t.contacts}</h2>
            <button
              onClick={() => setShowAddContact(true)}
              className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={t.addContact}
            >
              <FaPlus size={20} />
            </button>
          </div>

          {/* Add Contact Form */}
          {showAddContact && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-50 rounded-lg p-4 mb-4"
            >
              <h3 className="font-semibold text-gray-900 mb-3">{t.addContact}</h3>
              <div className="mb-2">
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.name}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder={t.name}
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  style={{ minHeight: '44px' }}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.phone}
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder={t.phone}
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  style={{ minHeight: '44px' }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="contact-relationship" className="block text-sm font-medium text-gray-700 mb-1">
                  {t.relationship}
                </label>
                <input
                  id="contact-relationship"
                  type="text"
                  placeholder={t.relationship}
                  value={newContact.relationship}
                  onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  style={{ minHeight: '44px' }}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddContact}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  {t.save}
                </button>
                <button
                  onClick={() => {
                    setShowAddContact(false);
                    setNewContact({ name: '', phone: '', relationship: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  {t.cancel}
                </button>
              </div>
            </motion.div>
          )}

          {/* Contacts List */}
          {contacts.length > 0 ? (
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center flex-1">
                    <FaPhone className="text-red-600 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                      {contact.relationship && (
                        <p className="text-xs text-gray-500">{contact.relationship}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCallContact(contact.phone)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                      aria-label={t.callNow}
                    >
                      <FaPhone size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(index)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                      aria-label="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">{t.noContacts}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Emergency;
