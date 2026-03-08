# Implementation Plan: SakshamAI Rural - Enhanced Multi-Page UI & Currency Detector

## Overview

This implementation plan focuses on transforming the existing single-page SakshamAI Rural application into a professional multi-page architecture with enhanced features. The key improvements include:

- Multi-page UI with dedicated pages for each feature
- Independent camera implementations for each feature page
- New currency detector feature for Indian currency notes
- Voice commands integration for hands-free operation
- Color identifier for visually impaired users
- Professional UI with modern design, animations, and gradients
- Enhanced prescription reading with better text extraction

The implementation uses Python for backend Lambda functions and React for the frontend, deployed via AWS CloudShell to ap-south-1 (Mumbai) region.

## Tasks

- [x] 1. Restructure frontend to multi-page architecture
  - [x] 1.1 Create new HomePage component with feature cards
    - Design home page with large, accessible feature cards/buttons
    - Add gradient backgrounds and modern styling
    - Include icons for each feature (vision, text-reader, face, prescription, communication, emergency, schemes, currency)
    - Implement navigation to feature-specific pages
    - Add voice announcement for each feature card on focus
    - _Requirements: NFR 3.7.1, NFR 3.7.5_

  - [x] 1.2 Create dedicated page components for each feature
    - Create separate page files: VisionAssistance.js, TextReader.js, FaceRecognition.js, PrescriptionReader.js, Communication.js, Emergency.js, Schemes.js, Currency.js
    - Each page has its own independent camera component (no shared camera)
    - Add back button navigation to return to home page
    - Implement consistent page layout with header and action buttons
    - _Requirements: 2.1.1, 2.1.2, 2.1.3, 2.2.1, 2.3.2_

  - [x] 1.3 Update routing configuration
    - Configure React Router for multi-page navigation
    - Set up routes for all feature pages
    - Implement route guards if needed
    - Add page transition animations
    - _Requirements: NFR 3.7.1_

  - [x] 1.4 Create reusable Navigation component
    - Build navigation component with back button
    - Add breadcrumb navigation for accessibility
    - Implement keyboard navigation support
    - Style navigation with consistent design
    - _Requirements: NFR 3.7.1, NFR 3.7.4_

- [x] 2. Implement independent camera components for each feature
  - [x] 2.1 Create CameraCapture component for vision assistance
    - Implement camera access using react-webcam
    - Add capture button with large touch target (44x44px minimum)
    - Handle camera permissions and errors gracefully
    - Compress images to ≤200KB before upload
    - _Requirements: 2.1.1.4, NFR 3.4.3, NFR 3.7.4_

  - [x] 2.2 Create CameraCapture component for text reader
    - Independent camera instance for text reading
    - Add focus/flash controls for better text capture
    - Implement image preprocessing for OCR optimization
    - Show preview before processing
    - _Requirements: 2.1.2.1, 2.1.2.4_

  - [x] 2.3 Create CameraCapture component for face recognition
    - Independent camera for face capture
    - Add face detection overlay/guide
    - Implement consent confirmation before capture
    - Handle multiple faces in frame
    - _Requirements: 2.1.3.1, 2.1.3.2, 2.1.3.4_

  - [x] 2.4 Create CameraCapture component for prescription reader
    - Independent camera for prescription capture
    - Add document alignment guides
    - Implement auto-capture when document is detected
    - Support multiple page prescriptions
    - _Requirements: 2.3.2.1, 2.3.2.3_

  - [x] 2.5 Create CameraCapture component for currency detector
    - Independent camera for currency note capture
    - Add currency note alignment guide overlay
    - Implement real-time detection feedback
    - Handle different lighting conditions
    - _Requirements: 2.1.1.2, NFR 3.1.2_

- [x] 3. Implement currency detector feature (backend)
  - [x] 3.1 Create currency detection Lambda function
    - Create new Lambda function: currency_detector
    - Use Rekognition detect_text API to identify currency values
    - Implement logic to detect Indian currency denominations (₹10, ₹20, ₹50, ₹100, ₹200, ₹500, ₹2000)
    - Parse detected text to identify currency value and denomination
    - Return structured response with denomination and confidence score
    - Handle errors and edge cases (no currency detected, unclear image)
    - _Requirements: 2.1.1.1, 2.1.1.2_

  - [x] 3.2 Add currency detection API endpoint
    - Create new API Gateway endpoint: POST /detect-currency
    - Configure Lambda integration with currency_detector function
    - Set up CORS headers for frontend access
    - Implement request validation and error handling
    - Add API throttling and rate limiting
    - _Requirements: NFR 3.1.1, NFR 3.3.3_

  - [ ]* 3.3 Write unit tests for currency detection
    - Test currency denomination detection accuracy
    - Test error handling for invalid images
    - Test response format and structure
    - Test edge cases (torn notes, partial notes, multiple notes)
    - _Requirements: 2.1.1.1_

- [x] 4. Implement currency detector feature (frontend)
  - [x] 4.1 Create Currency.js page component
    - Build currency detector page with independent camera
    - Add capture button and currency note alignment guide
    - Implement image capture and compression
    - Call currency detection API endpoint
    - Display detected denomination with large text
    - _Requirements: 2.1.1.1, 2.1.1.2_

  - [x] 4.2 Implement voice announcement for currency
    - Use Amazon Polly API to announce detected denomination
    - Support Hindi and English voice output
    - Announce denomination immediately after detection
    - Handle voice synthesis errors gracefully
    - Add option to repeat announcement
    - _Requirements: 2.1.1.3, NFR 3.6.1_

  - [x] 4.3 Add currency detection to navigation
    - Add currency detector card to home page
    - Include currency icon and description
    - Link to currency detector page
    - Add voice description for accessibility
    - _Requirements: NFR 3.7.1, NFR 3.7.5_

- [x] 5. Implement voice commands integration
  - [x] 5.1 Create VoiceCommand component
    - Implement speech recognition using Web Speech API or AWS Transcribe
    - Support Hindi and English voice commands
    - Define command vocabulary (e.g., "open vision", "detect currency", "read text", "go back")
    - Implement command parsing and routing
    - Add visual feedback when listening for commands
    - _Requirements: 2.2.2.1, 2.2.2.2, NFR 3.6.1_

  - [x] 5.2 Integrate voice commands across all pages
    - Add voice command button to all feature pages
    - Implement global voice command listener
    - Handle voice command navigation between pages
    - Add voice command help/tutorial
    - Support continuous listening mode
    - _Requirements: 2.2.2.3, NFR 3.7.5_

  - [ ]* 5.3 Write integration tests for voice commands
    - Test voice command recognition accuracy
    - Test navigation via voice commands
    - Test multi-language voice command support
    - Test error handling for unrecognized commands
    - _Requirements: 2.2.2.1, 2.2.2.2_

- [x] 6. Implement color identifier feature
  - [x] 6.1 Create color detection Lambda function
    - Create new Lambda function: color_detector
    - Use Rekognition detect_labels or custom color analysis
    - Identify dominant colors in captured image
    - Return color name in user's preferred language
    - Support common color names in Hindi and English
    - _Requirements: 2.1.1.1, NFR 3.6.1_

  - [x] 6.2 Create ColorIdentifier.js page component
    - Build color identifier page with independent camera
    - Add capture button for color detection
    - Display detected color name with large text
    - Show color swatch with detected color
    - Announce color name via voice
    - _Requirements: 2.1.1.3, NFR 3.7.1_

  - [x] 6.3 Add color identifier API endpoint
    - Create API Gateway endpoint: POST /detect-color
    - Configure Lambda integration
    - Set up CORS and error handling
    - _Requirements: NFR 3.1.1_

- [x] 7. Enhance prescription reading feature
  - [x] 7.1 Update prescription reading Lambda function
    - Improve text extraction using Rekognition detect_text
    - Implement better parsing for medicine names and dosages
    - Extract structured data (medicine name, dosage, frequency, duration)
    - Handle handwritten prescriptions with better accuracy
    - Add support for multiple prescription formats
    - _Requirements: 2.3.2.1, 2.3.2.3_

  - [x] 7.2 Update PrescriptionReader.js page
    - Enhance UI with better image capture guidance
    - Display extracted prescription data in structured format
    - Add voice reading of prescription details
    - Implement save prescription feature
    - Allow users to view prescription history
    - _Requirements: 2.3.2.2, 2.3.2.4_

  - [ ]* 7.3 Write unit tests for prescription parsing
    - Test medicine name extraction
    - Test dosage and frequency parsing
    - Test handwritten prescription handling
    - Test error cases (unclear image, missing information)
    - _Requirements: 2.3.2.1, 2.3.2.3_

- [x] 8. Implement professional UI styling
  - [x] 8.1 Create global design system
    - Define color palette with gradients
    - Create typography scale for accessibility
    - Define spacing and layout grid
    - Create reusable styled components
    - Implement dark mode support
    - _Requirements: NFR 3.7.3, NFR 3.7.1_

  - [x] 8.2 Add animations and transitions
    - Implement page transition animations
    - Add button hover and press animations
    - Create loading animations for API calls
    - Add success/error feedback animations
    - Ensure animations respect prefers-reduced-motion
    - _Requirements: NFR 3.7.1_

  - [x] 8.3 Implement gradient backgrounds
    - Create gradient backgrounds for each feature page
    - Use brand colors with smooth gradients
    - Ensure sufficient contrast for text readability
    - Add subtle background patterns or textures
    - _Requirements: NFR 3.7.3_

  - [x] 8.4 Enhance accessibility features
    - Implement high contrast mode toggle
    - Add screen reader announcements for all actions
    - Ensure all interactive elements have focus indicators
    - Add skip navigation links
    - Test with screen readers (NVDA, JAWS, VoiceOver)
    - _Requirements: NFR 3.7.1, NFR 3.7.2, NFR 3.7.5_

- [x] 9. Update API service layer
  - [x] 9.1 Refactor API service module
    - Update api.js with new endpoints (currency, color)
    - Implement request/response interceptors
    - Add retry logic for failed requests
    - Implement request caching for common queries
    - Add request timeout handling
    - _Requirements: NFR 3.1.1, NFR 3.2.2_

  - [x] 9.2 Implement error handling
    - Create centralized error handling utility
    - Add user-friendly error messages in Hindi and English
    - Implement error logging for debugging
    - Add fallback mechanisms for API failures
    - _Requirements: NFR 3.2.2_

  - [x] 9.3 Add loading states and feedback
    - Implement loading indicators for all API calls
    - Add progress bars for long-running operations
    - Show success/error toasts after operations
    - Implement optimistic UI updates where appropriate
    - _Requirements: NFR 3.1.1_

- [x] 10. Checkpoint - Test core functionality
  - Ensure all tests pass, ask the user if questions arise.
  - Test multi-page navigation on mobile devices
  - Verify camera functionality on each feature page
  - Test currency detection with real Indian currency notes
  - Verify voice commands work in Hindi and English
  - Test color identifier with various objects
  - Verify prescription reading improvements

- [x] 11. Create deployment scripts for AWS CloudShell
  - [x] 11.1 Create Lambda deployment script
    - Write script to package Lambda functions with dependencies
    - Create/update Lambda functions via AWS CLI
    - Configure Lambda environment variables
    - Set up Lambda execution roles and permissions
    - Deploy to ap-south-1 region
    - _Requirements: 2.5.1.1, NFR 3.5.1_

  - [x] 11.2 Create API Gateway deployment script
    - Write script to create/update API Gateway endpoints
    - Configure CORS settings for all endpoints
    - Set up API throttling and rate limiting
    - Deploy API to production stage
    - Output API endpoint URLs
    - _Requirements: NFR 3.3.3, NFR 3.5.1_

  - [x] 11.3 Create frontend deployment script
    - Write script to build React app
    - Upload build files to S3 bucket
    - Configure S3 bucket for static website hosting
    - Set up CloudFront distribution (optional)
    - Update API endpoint URLs in frontend config
    - _Requirements: NFR 3.4.1_

  - [x] 11.4 Create complete deployment script
    - Combine all deployment steps into single script
    - Add deployment validation checks
    - Implement rollback mechanism for failed deployments
    - Add deployment logging and status reporting
    - Create deployment documentation
    - _Requirements: 2.5.1.1_

- [x] 12. Optimize for cost and performance
  - [x] 12.1 Implement image compression
    - Add client-side image compression before upload
    - Resize images to optimal dimensions for each feature
    - Use efficient image formats (WebP with JPEG fallback)
    - Implement lazy loading for images
    - _Requirements: NFR 3.4.3, NFR 3.5.2_

  - [x] 12.2 Optimize Lambda functions
    - Reduce Lambda cold start times
    - Implement connection pooling for AWS SDK clients
    - Optimize Lambda memory allocation
    - Add Lambda function caching where appropriate
    - _Requirements: NFR 3.1.1, NFR 3.5.2_

  - [x] 12.3 Implement API response caching
    - Add caching for government schemes data
    - Cache common voice synthesis responses
    - Implement cache invalidation strategy
    - Use API Gateway caching for static responses
    - _Requirements: NFR 3.5.2_

- [x] 13. Add multi-language support
  - [x] 13.1 Create language selection component
    - Build language selector with Hindi and English options
    - Store language preference in local storage
    - Update all UI text based on selected language
    - Add language-specific voice output
    - _Requirements: NFR 3.6.1, NFR 3.6.2_

  - [x] 13.2 Create translation files
    - Create JSON translation files for Hindi and English
    - Translate all UI strings and messages
    - Translate error messages and notifications
    - Translate feature descriptions and help text
    - _Requirements: NFR 3.6.2, NFR 3.6.4_

  - [x] 13.3 Implement i18n in components
    - Integrate i18n library (react-i18next)
    - Update all components to use translation keys
    - Implement dynamic language switching
    - Test all features in both languages
    - _Requirements: NFR 3.6.1, NFR 3.6.2_

- [x] 14. Implement emergency alert enhancements
  - [x] 14.1 Update Emergency.js page
    - Redesign emergency page with prominent alert button
    - Add emergency contact management UI
    - Implement location services integration
    - Add emergency alert confirmation dialog
    - Show alert status and delivery confirmation
    - _Requirements: 2.3.3.1, 2.3.3.2, 2.3.3.5_

  - [x] 14.2 Enhance emergency alert Lambda function
    - Update Lambda to send SMS via SNS
    - Include GPS coordinates in alert message
    - Add user name and condition to alert
    - Implement retry logic for failed SMS
    - Add alert logging for audit trail
    - _Requirements: 2.3.3.2, 2.3.3.3, 2.3.3.4_

  - [ ]* 14.3 Write integration tests for emergency alerts
    - Test SMS delivery to multiple contacts
    - Test location data inclusion
    - Test low-bandwidth scenarios
    - Test error handling and retries
    - _Requirements: 2.3.3.2, 2.3.3.4_

- [x] 15. Final checkpoint and validation
  - Ensure all tests pass, ask the user if questions arise.
  - Perform end-to-end testing on mobile devices
  - Verify all features work in low-bandwidth conditions
  - Test with screen readers for accessibility
  - Validate cost per user is ≤₹5 per month
  - Verify deployment scripts work in AWS CloudShell
  - Test all features in Hindi and English
  - Prepare demo for judges with AWS architecture showcase

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- All Lambda functions use Python 3.9+ runtime
- Frontend uses React with Tailwind CSS for styling
- Deployment via AWS CloudShell to ap-south-1 (Mumbai) region
- Budget constraint: $100 AWS credits, target ≤₹5 per user per month
- Submission deadline: Tomorrow (urgent priority)
- Focus on deep AWS integration to impress judges
