# SakshamAI Rural - AWS Architecture Diagram

## Architecture Overview

This document describes the complete AWS serverless architecture for the SakshamAI Rural platform, designed to provide AI-powered assistive capabilities for differently abled individuals in rural India.

---

## Architecture Layers

### 1. Mobile Application Layer (Edge)
```
┌─────────────────────────────────────────┐
│   Mobile App (Android/iOS)              │
│                                          │
│   ┌──────────┐  ┌──────────┐           │
│   │  Camera  │  │   Mic    │           │
│   └──────────┘  └──────────┘           │
│   ┌──────────┐  ┌──────────┐           │
│   │   GPS    │  │  Screen  │           │
│   └──────────┘  └──────────┘           │
│                                          │
│   Features:                              │
│   • Image/Audio Compression              │
│   • Offline Text-to-Speech               │
│   • Cached Data                          │
│   • Emergency Alerts                     │
└─────────────────────────────────────────┘
                    ↓
```

### 2. API Gateway Layer
```
┌─────────────────────────────────────────┐
│   Amazon API Gateway                     │
│                                          │
│   • REST APIs (Synchronous)              │
│   • WebSocket APIs (Real-time)           │
│   • Authentication & Rate Limiting       │
│   • Request Validation                   │
└─────────────────────────────────────────┘
                    ↓
```

### 3. Compute Layer (AWS Lambda)
```
┌─────────────────────────────────────────────────────────────┐
│   AWS Lambda Functions (Serverless Compute)                  │
│                                                               │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│   │   Vision     │  │Communication │  │  Healthcare  │     │
│   │  Processing  │  │  Processing  │  │  Processing  │     │
│   └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                               │
│   ┌──────────────┐  ┌──────────────┐                        │
│   │ Information  │  │  Emergency   │                        │
│   │  Assistant   │  │    Alert     │                        │
│   └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                    ↓
```

### 4. AI Services Layer
```
┌─────────────────────────────────────────────────────────────┐
│   AWS AI/ML Services                                         │
│                                                               │
│   ┌──────────────────┐  ┌──────────────────┐               │
│   │  Rekognition     │  │    Textract      │               │
│   │  • Object Det.   │  │    • OCR         │               │
│   │  • Face Recog.   │  │    • Handwriting │               │
│   │  • Gestures      │  │    • Forms       │               │
│   └──────────────────┘  └──────────────────┘               │
│                                                               │
│   ┌──────────────────┐  ┌──────────────────┐               │
│   │   Transcribe     │  │     Polly        │               │
│   │   • Speech-to-   │  │   • Text-to-     │               │
│   │     Text         │  │     Speech       │               │
│   │   • 8 Languages  │  │   • 8 Languages  │               │
│   └──────────────────┘  └──────────────────┘               │
│                                                               │
│   ┌──────────────────┐                                       │
│   │     Bedrock      │                                       │
│   │  • Conversational│                                       │
│   │    AI            │                                       │
│   │  • Multi-lingual │                                       │
│   └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
                    ↓
```

### 5. Data & Storage Layer
```
┌─────────────────────────────────────────────────────────────┐
│   Data & Storage Services                                    │
│                                                               │
│   ┌──────────────────┐  ┌──────────────────┐               │
│   │   Amazon S3      │  │   DynamoDB       │               │
│   │   • Images       │  │   • User Data    │               │
│   │   • Audio Files  │  │   • Prescriptions│               │
│   │   • Logs         │  │   • Contacts     │               │
│   │   • Backups      │  │   • Face Data    │               │
│   └──────────────────┘  └──────────────────┘               │
│                                                               │
│   ┌──────────────────┐                                       │
│   │ Location Service │                                       │
│   │ • GPS Coordinates│                                       │
│   │ • Emergency Only │                                       │
│   └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
                    ↓
```

### 6. Notification & Monitoring Layer
```
┌─────────────────────────────────────────────────────────────┐
│   Notifications & Monitoring                                 │
│                                                               │
│   ┌──────────────────┐  ┌──────────────────┐               │
│   │   Amazon SNS     │  │   CloudWatch     │               │
│   │   • SMS Alerts   │  │   • Logs         │               │
│   │   • Push Notif.  │  │   • Metrics      │               │
│   │   • Emergency    │  │   • Alarms       │               │
│   └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### 7. Security & Identity Layer
```
┌─────────────────────────────────────────────────────────────┐
│   Security & Identity Services                               │
│                                                               │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│   │     IAM      │  │     KMS      │  │   Cognito    │     │
│   │  • Roles     │  │  • Encryption│  │  • Auth      │     │
│   │  • Policies  │  │  • Keys      │  │  • Users     │     │
│   └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Vision Assistance Flow
```
Mobile Camera → API Gateway → Lambda (Vision) → Rekognition/Textract
                                    ↓
                                  S3 (Store Image)
                                    ↓
                                DynamoDB (Metadata)
                                    ↓
                                Polly (TTS)
                                    ↓
                              Mobile App (Audio)
```

### Communication Flow (Speech-to-Text)
```
Mobile Mic → API Gateway → Lambda (Communication) → Transcribe
                                    ↓
                                  S3 (Store Audio)
                                    ↓
                              Mobile App (Text Display)
```

### Communication Flow (Text-to-Speech)
```
Mobile Input → API Gateway → Lambda (Communication) → Polly
                                    ↓
                              Mobile App (Audio)
```

### Gesture Recognition Flow
```
Mobile Camera → API Gateway → Lambda (Communication) → Rekognition Custom Labels
                                    ↓
                                DynamoDB (Custom Mappings)
                                    ↓
                                Polly (TTS)
                                    ↓
                              Mobile App (Audio + Text)
```

### Healthcare Support Flow
```
Mobile Camera → API Gateway → Lambda (Healthcare) → Textract (Extract)
                                    ↓
                                Bedrock (Simplify)
                                    ↓
                                DynamoDB (Store Prescription)
                                    ↓
                                Polly (TTS)
                                    ↓
                              Mobile App (Audio + Text)
```

### Emergency Alert Flow
```
Mobile (Emergency Button) → API Gateway → Lambda (Emergency)
                                    ↓
                            Location Service (GPS)
                                    ↓
                            DynamoDB (Get Contacts)
                                    ↓
                            SNS (Send SMS to 5 Contacts)
                                    ↓
                            Mobile App (Audio Confirmation)
```

### Rural Information Assistant Flow
```
Mobile (Voice/Text) → API Gateway → Lambda (Information) → Transcribe (if voice)
                                    ↓
                                Bedrock (Conversational AI)
                                    ↓
                                DynamoDB (Government Schemes DB)
                                    ↓
                                Polly (TTS)
                                    ↓
                              Mobile App (Audio + Text)
```

---

## Key Architecture Decisions

### 1. Serverless Architecture
- **Why**: Zero idle costs, automatic scaling, high availability
- **Services**: Lambda, API Gateway, DynamoDB, S3
- **Benefit**: Pay only for actual usage, scales from 100 to 100,000+ users

### 2. Edge + Cloud Hybrid
- **Edge (Mobile)**: Image/audio compression, offline TTS, cached data
- **Cloud (AWS)**: AI processing, data storage, real-time services
- **Benefit**: Minimizes bandwidth usage while maintaining AI capabilities

### 3. Multi-Language Support
- **Languages**: Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada
- **Services**: Transcribe, Polly, Textract, Bedrock
- **Benefit**: Accessible to diverse rural Indian population

### 4. Cost Optimization
- **Caching**: API Gateway, Lambda, Application-level
- **Compression**: Images ≤200KB, audio compression
- **Lifecycle Policies**: S3 auto-deletion after 90 days
- **Right-sizing**: Lambda memory tuning, ARM architecture
- **Target**: ≤₹5 per active user per month

### 5. Security & Privacy
- **Encryption**: TLS 1.3 in transit, AES-256 at rest
- **Consent**: Explicit consent for biometric data
- **Deletion**: User-initiated data deletion within 24 hours
- **Compliance**: DPDP Act 2023, RPWD Act 2016, WCAG 2.1 Level AA

### 6. Performance Targets
- **Response Time**: ≤3 seconds for 95% of requests
- **Image Processing**: ≤3 seconds for images ≤5MB
- **Speech-to-Text**: ≤2 seconds for 30-second audio
- **Text-to-Speech**: ≤2 seconds for 500-character text
- **Availability**: ≥99.5% system, ≥99.9% emergency alerts

---

## Scalability Features

### Horizontal Scaling
- Lambda: Auto-scales to 1,000+ concurrent executions
- API Gateway: Handles 10,000+ requests/second
- DynamoDB: On-demand mode auto-scales capacity
- S3: Unlimited storage and request scaling

### Geographic Distribution
- Primary Region: Mumbai (ap-south-1)
- CloudFront CDN: Cache static content
- Edge Locations: Reduce latency

### Caching Strategy
- API Gateway: Cache common responses (24 hours)
- Application: Cache AI responses for identical inputs
- Mobile App: Store frequently used data locally
- Polly: Cache common phrases

---

## Cost Breakdown (Estimated)

### Per User Per Month (Active User)
- Lambda: ₹0.50
- AI Services (Rekognition, Textract, Transcribe, Polly, Bedrock): ₹2.50
- DynamoDB: ₹0.30
- S3: ₹0.20
- API Gateway: ₹0.40
- SNS (Emergency only): ₹0.10
- Other (CloudWatch, Location): ₹0.20
- **Total**: ≤₹5.00 per active user per month

### Freemium Tier
- 50 free requests per month per user
- Subsidized access through NGO partnerships

---

## Monitoring & Observability

### CloudWatch Metrics
- API Gateway latency and error rates
- Lambda execution duration and cold starts
- DynamoDB read/write capacity and throttling
- AI service response times and error rates
- Emergency alert delivery success rate

### CloudWatch Alarms
- Response time exceeds 3 seconds for >5% of requests
- Error rate exceeds 1%
- Emergency alert delivery failure
- Cost exceeds daily budget threshold

### Custom Metrics
- Cost per user per month
- Cost per feature (vision, communication, healthcare, information)
- User engagement metrics
- Accessibility feature usage

---

## Future Enhancements

### Hardware Integration (Phase 5)
- AWS IoT Core for device connectivity
- Smart walking stick with obstacle detection
- AI-powered glasses for real-time vision
- Wearable emergency alert devices

### Feature Enhancements
- Offline AI models for core features
- Community support network
- Job matching for differently abled individuals
- Educational content and skill development
- Integration with telemedicine platforms

---

**Document Version**: 1.0  
**Created**: February 14, 2026  
**Based on**: SakshamAI Rural Requirements & Design Documents
