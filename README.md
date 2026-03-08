# SakshamAI Rural - AI-Powered Assistive Technology Platform

[![Frontend CI](https://github.com/kubra003/AI-for-bharat_sakshamAI/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/kubra003/AI-for-bharat_sakshamAI/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/kubra003/AI-for-bharat_sakshamAI/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/kubra003/AI-for-bharat_sakshamAI/actions/workflows/backend-ci.yml)
[![Code Quality](https://github.com/kubra003/AI-for-bharat_sakshamAI/actions/workflows/code-quality.yml/badge.svg)](https://github.com/kubra003/AI-for-bharat_sakshamAI/actions/workflows/code-quality.yml)

## 🚀 Live Demo

**Try the live application:** [https://d31p7zdqvca7ij.cloudfront.net/](https://d31p7zdqvca7ij.cloudfront.net/)

All features are fully deployed and working on AWS!

---

## Overview

SakshamAI Rural is a comprehensive AI-powered assistive technology platform designed to empower differently abled individuals in rural India. The platform provides vision assistance, communication support, healthcare information, and emergency services through an accessible web application backed by AWS serverless infrastructure.

## Features

### 1. Vision Assistance
- **Object Detection**: Identify objects, people, animals, and vehicles
- **Text Reading (OCR)**: Read text from documents, signs, and labels
- **Face Recognition**: Recognize familiar faces with consent
- **Audio Output**: Descriptions in Hindi and English

### 2. Communication
- **Text-to-Speech**: Convert typed text to natural-sounding speech
- **Speech-to-Text**: Real-time transcription of spoken words
- **Multi-lingual Support**: Hindi, English, and 5+ Indian languages

### 3. Healthcare Support
- **Medical Report Simplification**: Understand lab results in simple language
- **Prescription Reading**: Read medicine names and dosages
- **Educational Information**: Non-diagnostic health guidance

### 4. Information Assistant
- **Government Schemes**: Learn about disability welfare programs
- **Public Services**: Information about banks, hospitals, post offices
- **Voice Queries**: Ask questions in your local language

### 5. Emergency Alert
- **One-Tap SOS**: Send emergency alerts to up to 5 contacts
- **Location Sharing**: Automatic GPS coordinates in alerts
- **SMS Notifications**: Works even on 2G/3G networks

## Technology Stack

### Frontend
- React 18
- Tailwind CSS (accessibility-focused)
- React Speech Recognition
- Progressive Web App (PWA)
- WCAG 2.1 Level AA compliant

### Backend
- AWS Lambda (Python 3.11)
- Amazon API Gateway
- Serverless architecture

### AI Services
- Amazon Rekognition (object detection, face recognition)
- Amazon Textract (OCR)
- Amazon Transcribe (speech-to-text)
- Amazon Polly (text-to-speech)
- Amazon Bedrock (conversational AI)

### Storage & Database
- Amazon S3 (media storage)
- Amazon DynamoDB (user data)
- Amazon SNS (notifications)

### Monitoring
- AWS CloudWatch
- AWS IAM & KMS (security)

## Project Structure

```
sakshamai-rural/
├── frontend/                    # React web application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navigation.js
│   │   │   └── VoiceCommand.js
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── VisionAssistance.js
│   │   │   ├── Communication.js
│   │   │   ├── Healthcare.js
│   │   │   ├── Information.js
│   │   │   ├── Emergency.js
│   │   │   └── Settings.js
│   │   ├── services/           # API services
│   │   │   └── api.js
│   │   ├── index.css
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/                     # AWS Lambda functions
│   ├── vision_orchestrator/
│   ├── communication_handler/
│   ├── healthcare_handler/
│   ├── information_handler/
│   └── emergency_handler/
├── generated-diagrams/          # Architecture diagrams
│   ├── sakshamai-aws-architecture.md
│   └── sakshamai-complete-flow-diagram.md
├── .kiro/specs/sakshamai-rural/ # Specifications
│   ├── requirements.md
│   └── design.md
├── DEPLOYMENT_GUIDE.md          # Complete deployment instructions
└── README.md                    # This file
```

## Quick Start

### Prerequisites
- Node.js 18+
- AWS Account with $100 credits
- AWS CLI configured
- Python 3.11

### Local Development

#### Frontend Development

```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3000`

#### Run Tests

```bash
cd frontend
npm test
```

### Deployment

#### Option 1: GitHub Actions (Recommended)

1. Fork/clone this repository
2. Configure GitHub Secrets (see [GITHUB_CICD_SETUP.md](./GITHUB_CICD_SETUP.md))
3. Push to main branch - automatic deployment

#### Option 2: Manual Deployment

```powershell
# Deploy everything
.\deploy.ps1 -Target all

# Deploy only frontend
.\deploy.ps1 -Target frontend

# Deploy only backend
.\deploy.ps1 -Target backend
```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## Accessibility Features

- **Voice-First Interface**: Navigate using voice commands
- **Screen Reader Compatible**: Full ARIA labels and semantic HTML
- **High Contrast Mode**: Toggle for better visibility
- **Large Touch Targets**: Minimum 44x44 pixels for all interactive elements
- **Keyboard Navigation**: Full keyboard support
- **Multi-lingual**: Hindi, English, and regional Indian languages

## Cost Optimization

- **Serverless Architecture**: Pay only for actual usage
- **Image Compression**: Reduce bandwidth and storage costs
- **Response Caching**: 24-hour cache for identical requests
- **Lifecycle Policies**: Automatic data deletion after 30-90 days
- **Target Cost**: ≤₹5 per active user per month

## Security & Privacy

- **Encryption**: TLS 1.3 in transit, AES-256 at rest
- **Consent Management**: Explicit consent for biometric data
- **Data Deletion**: User-initiated deletion within 24 hours
- **Compliance**: DPDP Act 2023, RPWD Act 2016
- **No Third-Party Sharing**: User data never shared without consent

## Performance Targets

- Response time: ≤3 seconds for 95% of requests
- Image processing: ≤3 seconds for images ≤5MB
- Speech-to-text: ≤2 second latency
- Text-to-speech: ≤2 seconds for 500 characters
- Availability: ≥99.5% uptime

## Scalability

- Support 1 million+ registered users
- Handle 100,000+ concurrent users
- Process 10 million+ API requests per day
- Auto-scale to handle 10x traffic spikes

## Implementation Phases

### Phase 1: MVP (Completed)
✅ Frontend web application
✅ Vision assistance (object detection, OCR)
✅ Basic communication features
✅ Emergency alert system
✅ AWS infrastructure setup

### Phase 2: Enhanced Features (Next)
- Face recognition with consent
- Gesture recognition
- Healthcare report simplification
- Add 3 more Indian languages

### Phase 3: Information Assistant
- Conversational AI with Bedrock
- Government scheme information
- Public services directory

### Phase 4: Hardware Integration (Future)
- Smart walking stick
- AI-powered glasses
- Wearable health monitor

## Testing

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Test API Endpoints
```bash
# Test object detection
curl -X POST https://YOUR_API_URL/vision/detect-objects \
  -H "Content-Type: application/json" \
  -d '{"image": "BASE64_IMAGE", "language": "en"}'
```

## Monitoring

- CloudWatch Dashboard for metrics
- Cost tracking and alerts
- Error monitoring and debugging
- Usage analytics

## Contributing

This is a social impact project. Contributions are welcome!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

Quick start:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

This software is developed for social impact and accessibility.

## Support

For issues or questions:
- Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Review CloudWatch logs
- Contact the development team

## Acknowledgments

- AWS for providing $100 credits
- Rural India's differently abled community for inspiration
- Open-source community for tools and libraries

## Impact Goals

- Empower 1 million+ differently abled individuals in rural India
- Provide affordable assistive technology (≤₹5 per user per month)
- Bridge the digital accessibility gap
- Support Hindi and major Indian regional languages
- Enable independence, safety, and quality of life

---

**Built with ❤️ for Rural India**

*SakshamAI Rural - Empowering Differently Abled Individuals Through AI*
