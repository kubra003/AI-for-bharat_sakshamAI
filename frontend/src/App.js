import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import VisionAssistance from './pages/VisionAssistance';
import TextReader from './pages/TextReader';
import FaceRecognition from './pages/FaceRecognition';

import Communication from './pages/Communication';
import Healthcare from './pages/Healthcare';
import Information from './pages/Information';
import Emergency from './pages/Emergency';
import Currency from './pages/Currency';
import Settings from './pages/Settings';

// Components
import Navigation from './components/Navigation';
import VoiceCommand from './components/VoiceCommand';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

// Wrapper component for animated routes
const AnimatedRoutes = ({ language, highContrast, voiceEnabled, onLanguageChange, onContrastToggle, onVoiceToggle }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <HomePage language={language} />
            </motion.div>
          }
        />
        <Route
          path="/vision"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <VisionAssistance language={language} />
            </motion.div>
          }
        />
        <Route
          path="/text-reader"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TextReader language={language} />
            </motion.div>
          }
        />
        <Route
          path="/face-recognition"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <FaceRecognition language={language} />
            </motion.div>
          }
        />


        <Route
          path="/communication"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Communication language={language} />
            </motion.div>
          }
        />
        <Route
          path="/healthcare"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Healthcare language={language} />
            </motion.div>
          }
        />
        <Route
          path="/information"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Information language={language} />
            </motion.div>
          }
        />
        <Route
          path="/emergency"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Emergency language={language} />
            </motion.div>
          }
        />
        <Route
          path="/currency"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Currency language={language} />
            </motion.div>
          }
        />
        <Route
          path="/settings"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Settings
                language={language}
                highContrast={highContrast}
                voiceEnabled={voiceEnabled}
                onLanguageChange={onLanguageChange}
                onContrastToggle={onContrastToggle}
                onVoiceToggle={onVoiceToggle}
              />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState('en'); // Default: English
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    // Load user preferences from localStorage
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    const savedLanguage = localStorage.getItem('language') || 'en';
    const savedVoice = localStorage.getItem('voiceEnabled') !== 'false';

    setHighContrast(savedContrast);
    setLanguage(savedLanguage);
    setVoiceEnabled(savedVoice);

    // Apply high contrast mode
    if (savedContrast) {
      document.body.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', newValue);
    
    if (newValue) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const toggleVoice = () => {
    const newValue = !voiceEnabled;
    setVoiceEnabled(newValue);
    localStorage.setItem('voiceEnabled', newValue);
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        {/* Skip Navigation Link for Accessibility */}
        <a href="#main-content" className="skip-link">
          {language === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
        </a>
        
        {/* Voice Command Component */}
        {voiceEnabled && <VoiceCommand language={language} />}
        
        {/* Navigation */}
        <Navigation language={language} />
        
        {/* Main Content with Animated Routes */}
        <main id="main-content" className="container mx-auto px-4 py-8" tabIndex="-1">
          <AnimatedRoutes
            language={language}
            highContrast={highContrast}
            voiceEnabled={voiceEnabled}
            onLanguageChange={changeLanguage}
            onContrastToggle={toggleHighContrast}
            onVoiceToggle={toggleVoice}
          />
        </main>
      </div>
    </Router>
  );
}

export default App;
