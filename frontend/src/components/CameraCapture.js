import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FaCamera, FaSpinner, FaRedo, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CameraCapture Component
 * 
 * A reusable camera component for vision assistance features with:
 * - Camera access using react-webcam
 * - Large touch targets (44x44px minimum) for accessibility
 * - Graceful permission and error handling
 * - Image compression to ≤200KB before upload
 * - Responsive design for mobile devices
 * 
 * @param {Object} props
 * @param {Function} props.onCapture - Callback function when image is captured (receives compressed base64 image)
 * @param {boolean} props.loading - Loading state from parent component
 * @param {string} props.language - Current language ('hi' or 'en')
 * @param {string} props.captureButtonText - Custom text for capture button
 * @param {string} props.facingMode - Camera facing mode ('user' or 'environment')
 * @param {number} props.maxSizeKB - Maximum image size in KB (default: 200)
 * @param {React.ReactNode} props.overlay - Optional overlay component (e.g., alignment guides)
 */
const CameraCapture = ({
  onCapture,
  loading = false,
  language = 'en',
  captureButtonText,
  facingMode = 'environment',
  maxSizeKB = 200,
  overlay = null
}) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const translations = {
    hi: {
      capture: 'फोटो लें',
      retake: 'फिर से लें',
      processing: 'प्रसंस्करण...',
      compressing: 'संपीड़न...',
      cameraError: 'कैमरा त्रुटि',
      permissionDenied: 'कैमरा अनुमति अस्वीकृत',
      permissionMessage: 'कृपया इस सुविधा का उपयोग करने के लिए कैमरा अनुमति दें',
      retryPermission: 'फिर से प्रयास करें',
      noCameraAvailable: 'कोई कैमरा उपलब्ध नहीं है',
      cameraErrorMessage: 'कैमरा एक्सेस करने में त्रुटि। कृपया पुनः प्रयास करें।'
    },
    en: {
      capture: 'Capture Photo',
      retake: 'Retake',
      processing: 'Processing...',
      compressing: 'Compressing...',
      cameraError: 'Camera Error',
      permissionDenied: 'Camera Permission Denied',
      permissionMessage: 'Please allow camera access to use this feature',
      retryPermission: 'Retry',
      noCameraAvailable: 'No camera available',
      cameraErrorMessage: 'Error accessing camera. Please try again.'
    }
  };

  const t = translations[language] || translations.en;

  // Handle camera errors
  const handleUserMediaError = useCallback((error) => {
    console.error('Camera error:', error);
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      setPermissionDenied(true);
      setCameraError(t.permissionMessage);
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      setCameraError(t.noCameraAvailable);
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      setCameraError('Camera is already in use by another application. Please close other apps using the camera.');
    } else if (error.name === 'OverconstrainedError') {
      setCameraError('Camera constraints not supported. Trying with default settings...');
      // Retry with relaxed constraints
      setTimeout(() => {
        setCameraError(null);
        setPermissionDenied(false);
      }, 2000);
    } else {
      setCameraError(t.cameraErrorMessage + ' (Error: ' + error.name + ')');
    }
  }, [t]);

  // Request camera permission again
  const retryPermission = useCallback(() => {
    setPermissionDenied(false);
    setCameraError(null);
  }, []);

  /**
   * Compress image to target size
   * Uses canvas to resize and compress image to ≤200KB
   */
  const compressImage = useCallback(async (base64Image, targetSizeKB = maxSizeKB) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate dimensions to maintain aspect ratio
        let width = img.width;
        let height = img.height;
        const maxDimension = 1024; // Max dimension for low-bandwidth scenarios
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Start with quality 0.8 and reduce if needed
        let quality = 0.8;
        let compressedImage = canvas.toDataURL('image/jpeg', quality);
        
        // Iteratively reduce quality until size is under target
        while (compressedImage.length > targetSizeKB * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          compressedImage = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve(compressedImage);
      };
      img.src = base64Image;
    });
  }, [maxSizeKB]);

  /**
   * Capture photo from webcam and compress
   */
  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return;
    
    try {
      setCompressing(true);
      
      // Capture screenshot
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (!imageSrc) {
        setCameraError(t.cameraErrorMessage);
        setCompressing(false);
        return;
      }
      
      // Compress image
      const compressedImage = await compressImage(imageSrc);
      
      // Calculate final size
      const sizeKB = Math.round((compressedImage.length * 0.75) / 1024);
      console.log(`Image compressed to ${sizeKB}KB`);
      
      setCapturedImage(compressedImage);
      setCompressing(false);
      
      // Call parent callback with compressed image
      if (onCapture) {
        onCapture(compressedImage);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      setCameraError(t.cameraErrorMessage);
      setCompressing(false);
    }
  }, [webcamRef, compressImage, onCapture, t]);

  /**
   * Retake photo
   */
  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setCameraError(null);
  }, []);

  // Announce camera status for screen readers
  useEffect(() => {
    if (cameraError && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(cameraError);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, [cameraError, language]);

  return (
    <div className="w-full">
      {/* Camera View */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
        {!capturedImage && !cameraError && (
          <>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{
                facingMode: facingMode,
                width: { ideal: 1280 },
                height: { ideal: 960 }
              }}
              onUserMediaError={handleUserMediaError}
              aria-label="Camera viewfinder"
            />
            {/* Optional overlay (e.g., alignment guides) */}
            {overlay && (
              <div className="absolute inset-0 pointer-events-none">
                {overlay}
              </div>
            )}
          </>
        )}
        
        {capturedImage && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Camera Error Display */}
        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
            <div className="text-center p-6">
              <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">
                {permissionDenied ? t.permissionDenied : t.cameraError}
              </h3>
              <p className="text-gray-300 mb-4">{cameraError}</p>
              {permissionDenied && (
                <button
                  onClick={retryPermission}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  {t.retryPermission}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        <AnimatePresence mode="wait">
          {!capturedImage ? (
            <motion.button
              key="capture"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleCapture}
              disabled={loading || compressing || !!cameraError}
              className="flex items-center justify-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={captureButtonText || t.capture}
            >
              {compressing ? (
                <>
                  <FaSpinner className="animate-spin" size={24} />
                  <span className="text-lg">{t.compressing}</span>
                </>
              ) : loading ? (
                <>
                  <FaSpinner className="animate-spin" size={24} />
                  <span className="text-lg">{t.processing}</span>
                </>
              ) : (
                <>
                  <FaCamera size={24} />
                  <span className="text-lg">{captureButtonText || t.capture}</span>
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              key="retake"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleRetake}
              disabled={loading}
              className="flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={t.retake}
            >
              <FaRedo size={24} />
              <span className="text-lg">{t.retake}</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CameraCapture;
