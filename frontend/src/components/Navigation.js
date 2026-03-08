import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaEye, 
  FaComments, 
  FaHeartbeat, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaCog,
  FaBars,
  FaTimes,
  FaArrowLeft,
  FaHome,
  FaChevronRight,
  FaFileAlt,
  FaUserFriends,
  FaMoneyBillWave,
  FaPalette
} from 'react-icons/fa';

const Navigation = ({ language, showBreadcrumb = false, showBackButton = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const translations = {
    hi: {
      title: 'सक्षमAI ग्रामीण',
      home: 'होम',
      vision: 'दृष्टि सहायता',
      communication: 'संचार',
      healthcare: 'स्वास्थ्य',
      information: 'जानकारी',
      emergency: 'आपातकाल',
      settings: 'सेटिंग्स',
      textReader: 'पाठ पाठक',
      faceRecognition: 'चेहरा पहचान',
      currency: 'मुद्रा पहचानकर्ता',
      colorIdentifier: 'रंग पहचानकर्ता',
      backButton: 'वापस जाएं',
      skipToContent: 'सामग्री पर जाएं',
      openMenu: 'मेनू खोलें',
      closeMenu: 'मेनू बंद करें'
    },
    en: {
      title: 'SakshamAI Rural',
      home: 'Home',
      vision: 'Vision',
      communication: 'Communication',
      healthcare: 'Healthcare',
      information: 'Information',
      emergency: 'Emergency',
      settings: 'Settings',
      textReader: 'Text Reader',
      faceRecognition: 'Face Recognition',
      currency: 'Currency Detector',
      colorIdentifier: 'Color Identifier',
      backButton: 'Go Back',
      skipToContent: 'Skip to content',
      openMenu: 'Open menu',
      closeMenu: 'Close menu'
    }
  };

  const t = translations[language] || translations.en;

  // Page metadata for breadcrumbs
  const pageMetadata = {
    '/': { label: t.home, icon: FaHome },
    '/vision': { label: t.vision, icon: FaEye },
    '/text-reader': { label: t.textReader, icon: FaFileAlt },
    '/face-recognition': { label: t.faceRecognition, icon: FaUserFriends },

    '/communication': { label: t.communication, icon: FaComments },
    '/emergency': { label: t.emergency, icon: FaExclamationTriangle },
    '/information': { label: t.information, icon: FaInfoCircle },
    '/healthcare': { label: t.healthcare, icon: FaHeartbeat },
    '/currency': { label: t.currency, icon: FaMoneyBillWave },
    '/color-identifier': { label: t.colorIdentifier, icon: FaPalette },
    '/settings': { label: t.settings, icon: FaCog }
  };

  const navItems = [
    { path: '/vision', icon: FaEye, label: t.vision, ariaLabel: 'Vision Assistance' },
    { path: '/communication', icon: FaComments, label: t.communication, ariaLabel: 'Communication' },
    { path: '/healthcare', icon: FaHeartbeat, label: t.healthcare, ariaLabel: 'Healthcare' },
    { path: '/information', icon: FaInfoCircle, label: t.information, ariaLabel: 'Information' },
    { path: '/emergency', icon: FaExclamationTriangle, label: t.emergency, ariaLabel: 'Emergency' },
    { path: '/settings', icon: FaCog, label: t.settings, ariaLabel: 'Settings' },
  ];

  // Generate breadcrumb trail
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ path: '/', label: t.home, icon: FaHome }];
    
    let currentPath = '';
    paths.forEach(segment => {
      currentPath += `/${segment}`;
      const metadata = pageMetadata[currentPath];
      if (metadata) {
        breadcrumbs.push({ path: currentPath, label: metadata.label, icon: metadata.icon });
      }
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const isHomePage = location.pathname === '/';

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + Left Arrow: Go back
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(-1);
      }
      // Alt + H: Go home
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-primary-600 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500"
      >
        {t.skipToContent}
      </a>

      <nav className="bg-primary-600 text-white shadow-lg" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-2xl font-bold hover:text-primary-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 rounded px-2 py-1"
              aria-label="Home - SakshamAI Rural"
            >
              {t.title}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={isOpen ? t.closeMenu : t.openMenu}
              aria-expanded={isOpen}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                      isActive 
                        ? 'bg-primary-700 font-semibold' 
                        : 'hover:bg-primary-500'
                    }`}
                    aria-label={item.ariaLabel}
                    aria-current={isActive ? 'page' : undefined}
                    style={{ minWidth: '44px', minHeight: '44px' }}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                        isActive 
                          ? 'bg-primary-700 font-semibold' 
                          : 'hover:bg-primary-500'
                      }`}
                      aria-label={item.ariaLabel}
                      aria-current={isActive ? 'page' : undefined}
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <Icon size={24} aria-hidden="true" />
                      <span className="text-lg">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Breadcrumb Navigation */}
        {(showBreadcrumb || !isHomePage) && breadcrumbs.length > 1 && (
          <div className="bg-primary-700 border-t border-primary-500">
            <div className="container mx-auto px-4 py-3">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => {
                    const Icon = crumb.icon;
                    const isLast = index === breadcrumbs.length - 1;
                    
                    return (
                      <li key={crumb.path} className="flex items-center">
                        {index > 0 && (
                          <FaChevronRight 
                            size={12} 
                            className="mx-2 text-primary-300" 
                            aria-hidden="true" 
                          />
                        )}
                        {isLast ? (
                          <span 
                            className="flex items-center space-x-2 text-white font-semibold"
                            aria-current="page"
                          >
                            <Icon size={16} aria-hidden="true" />
                            <span>{crumb.label}</span>
                          </span>
                        ) : (
                          <Link
                            to={crumb.path}
                            className="flex items-center space-x-2 text-primary-100 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
                            style={{ minWidth: '44px', minHeight: '44px' }}
                          >
                            <Icon size={16} aria-hidden="true" />
                            <span>{crumb.label}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </div>
        )}

        {/* Back Button Bar */}
        {(showBackButton || !isHomePage) && (
          <div className="bg-primary-700 border-t border-primary-500">
            <div className="container mx-auto px-4 py-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-primary-100 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-3 py-2"
                aria-label={t.backButton}
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <FaArrowLeft size={18} aria-hidden="true" />
                <span className="font-medium">{t.backButton}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Keyboard shortcuts hint (screen reader only) */}
      <div className="sr-only" role="region" aria-label="Keyboard shortcuts">
        <p>Press Alt + Left Arrow to go back. Press Alt + H to go home.</p>
      </div>
    </>
  );
};

export default Navigation;
