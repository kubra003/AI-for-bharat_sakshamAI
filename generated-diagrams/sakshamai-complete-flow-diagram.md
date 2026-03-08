# SakshamAI Rural - Complete System Flow Diagram with Hardware

## Overview
This document provides comprehensive flow diagrams showing how SakshamAI Rural integrates mobile software, cloud services, and future hardware components to serve differently abled individuals in rural India.

---

## 1. Complete System Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER LAYER (Rural India)                           │
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│  │ Blind User   │    │ Deaf User    │    │ Speech-      │                 │
│  │              │    │              │    │ Impaired     │                 │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                 │
│         │                   │                   │                          │
│         └───────────────────┴───────────────────┘                          │
│                             │                                              │
└─────────────────────────────┼──────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DEVICE LAYER (Current + Future)                          │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    PRIMARY DEVICE                                  │    │
│  │  ┌──────────────────────────────────────────────────────────┐     │    │
│  │  │  Mobile App (Android/iOS)                                │     │    │
│  │  │  - Voice-first interface                                 │     │    │
│  │  │  - Image/audio compression                               │     │    │
│  │  │  - Offline mode (cached data, TTS)                       │     │    │
│  │  │  - Device gateway for IoT hardware                       │     │    │
│  │  └──────────────────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │              FUTURE HARDWARE DEVICES (Phase 2+)                    │    │
│  │                                                                    │    │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│    │
│  │  │ Smart Walking    │  │ AI-Powered       │  │ Wearable Health  ││    │
│  │  │ Stick            │  │ Glasses          │  │ Monitor          ││    │
│  │  │                  │  │                  │  │                  ││    │
│  │  │ • Ultrasonic     │  │ • HD Camera      │  │ • Heart Rate     ││    │
│  │  │   Sensors (3m)   │  │ • Edge AI Chip   │  │   Sensor         ││    │
│  │  │ • GPS Module     │  │ • Bone Conduction│  │ • Accelerometer  ││    │
│  │  │ • Vibration      │  │   Audio          │  │   (Fall Detect)  ││    │
│  │  │   Motor          │  │ • Bluetooth 5.0  │  │ • GPS Module     ││    │
│  │  │ • Emergency Btn  │  │ • WiFi           │  │ • Emergency Btn  ││    │
│  │  │ • Bluetooth 5.0  │  │ • 8hr Battery    │  │ • Bluetooth 5.0  ││    │
│  │  │ • 7-day Battery  │  │ • <50g Weight    │  │ • 5-day Battery  ││    │
│  │  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘│    │
│  │           │                     │                     │          │    │
│  │           └─────────────────────┴─────────────────────┘          │    │
│  │                          Bluetooth/WiFi                          │    │
│  └────────────────────────────────────┬───────────────────────────────┘    │
└───────────────────────────────────────┼────────────────────────────────────┘
                                        │
                                        │ HTTPS/MQTT
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NETWORK LAYER                                       │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Amazon API Gateway                                                  │  │
│  │  ┌────────────────────────┐  ┌────────────────────────────────────┐ │  │
│  │  │ REST API               │  │ WebSocket API                      │ │  │
│  │  │ - Object detection     │  │ - Real-time speech-to-text         │ │  │
│  │  │ - OCR requests         │  │ - Live transcription               │ │  │
│  │  │ - Emergency alerts     │  │ - Streaming communication          │ │  │
│  │  │ - Healthcare queries   │  │                                    │ │  │
│  │  └────────────────────────┘  └────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  AWS IoT Core (Future Hardware)                                      │  │
│  │  - MQTT message broker                                               │  │
│  │  - Device registry & authentication                                  │  │
│  │  - Device shadows (state sync)                                       │  │
│  │  - IoT Rules Engine                                                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER (AWS Lambda)                        │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Vision       │  │Communication │  │ Healthcare   │  │ Information  │  │
│  │ Orchestrator │  │ Orchestrator │  │ Orchestrator │  │ Orchestrator │  │
│  │              │  │              │  │              │  │              │  │
│  │ • Route      │  │ • TTS        │  │ • Medical    │  │ • Govt       │  │
│  │   object     │  │   conversion │  │   report     │  │   schemes    │  │
│  │   detection  │  │ • STT        │  │   simplify   │  │ • Public     │  │
│  │ • Face       │  │   processing │  │ • Rx reading │  │   services   │  │
│  │   recognition│  │ • Gesture    │  │              │  │ • Voice      │  │
│  │ • OCR        │  │   recognition│  │              │  │   queries    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                                             │
│  ┌──────────────┐  ┌──────────────────────────────────────────────────┐   │
│  │ Emergency    │  │ IoT Device Handler (Future)                      │   │
│  │ Handler      │  │ • Process device telemetry                       │   │
│  │              │  │ • Coordinate hardware + software features        │   │
│  │ • Alert      │  │ • Manage device state                            │   │
│  │   processing │  │ • Edge computing coordination                    │   │
│  │ • Contact    │  │                                                  │   │
│  │   notification│  │                                                  │   │
│  └──────────────┘  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI/ML SERVICES LAYER                                │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Amazon       │  │ Amazon       │  │ Amazon       │  │ Amazon       │  │
│  │ Rekognition  │  │ Textract     │  │ Transcribe   │  │ Polly        │  │
│  │              │  │              │  │              │  │              │  │
│  │ • Object     │  │ • OCR        │  │ • Speech-to- │  │ • Text-to-   │  │
│  │   detection  │  │   (printed)  │  │   text       │  │   speech     │  │
│  │   (85%+)     │  │   (90%+)     │  │   (85%+)     │  │   (neural)   │  │
│  │ • Face       │  │ • Handwritten│  │ • Hindi +    │  │ • Hindi +    │  │
│  │   recognition│  │   (70%+)     │  │   5 langs    │  │   English    │  │
│  │   (90%+)     │  │ • Multi-lang │  │ • Real-time  │  │ • <2s        │  │
│  │ • Scene      │  │              │  │   streaming  │  │   latency    │  │
│  │   analysis   │  │              │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Amazon Bedrock (Conversational AI)                                   │  │
│  │ • Foundation models (Claude, Llama)                                  │  │
│  │ • Government scheme information                                      │  │
│  │ • Medical report simplification (educational only)                   │  │
│  │ • Multi-lingual conversations                                        │  │
│  │ • Contextual assistance                                              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ AWS IoT Greengrass (Edge Computing - Future)                         │  │
│  │ • Local ML inference on AI glasses                                   │  │
│  │ • Offline processing for poor connectivity                           │  │
│  │ • Lambda functions at the edge                                       │  │
│  │ • Local data aggregation                                             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA & STORAGE LAYER                                   │
│                                                                             │
│  ┌────────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │ Amazon S3                          │  │ Amazon DynamoDB              │  │
│  │                                    │  │                              │  │
│  │ • Media storage (images, audio)    │  │ • User profiles              │  │
│  │ • Face recognition data (encrypted)│  │ • Emergency contacts         │  │
│  │ • Application logs                 │  │ • Face recognition metadata  │  │
│  │ • Backups                          │  │ • Usage history              │  │
│  │ • Lifecycle policies (30-90 days)  │  │ • Session management         │  │
│  │                                    │  │ • Device telemetry (future)  │  │
│  │ Intelligent-Tiering for cost       │  │ • Health metrics (future)    │  │
│  └────────────────────────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   NOTIFICATION & MONITORING LAYER                           │
│                                                                             │
│  ┌────────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │ Amazon SNS                         │  │ AWS CloudWatch               │  │
│  │                                    │  │                              │  │
│  │ • Emergency SMS alerts             │  │ • Application logs           │  │
│  │ • Push notifications               │  │ • Performance metrics        │  │
│  │ • Multi-channel messaging          │  │ • Cost tracking              │  │
│  │ • 99.9% availability               │  │ • Error monitoring           │  │
│  │                                    │  │ • Anomaly detection          │  │
│  └────────────────────────────────────┘  └──────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ AWS IAM & KMS (Security)                                             │  │
│  │ • Authentication & authorization                                     │  │
│  │ • Encryption key management                                          │  │
│  │ • TLS 1.3 in transit, AES-256 at rest                                │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Feature-Specific Flow Diagrams with Hardware


### 2.1 Vision Assistance Flow (Mobile + AI Glasses)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SCENARIO: Blind user wants to identify objects                     │
└─────────────────────────────────────────────────────────────────────┘

CURRENT (Mobile Only):
┌──────────────┐
│ User         │ Captures image with phone camera
│              │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App                                                       │
│ 1. Compress image to ≤200KB (low bandwidth optimization)        │
│ 2. Send to API Gateway                                           │
└──────┬───────────────────────────────────────────────────────────┘
       │ HTTPS
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ API Gateway → Lambda Vision Orchestrator                         │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Rekognition                                               │
│ • Detects: furniture, vehicles, animals, people                  │
│ • Accuracy: ≥85%                                                 │
│ • Response time: <3 seconds                                      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Lambda → Store in S3 + DynamoDB                                  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Polly                                                     │
│ • Converts detection results to speech                           │
│ • Hindi/English output                                           │
│ • <2 second latency                                              │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App → Audio Output                                        │
│ "There is a chair 2 meters ahead and a person on your right"    │
└──────────────────────────────────────────────────────────────────┘


FUTURE (With AI-Powered Glasses):
┌──────────────┐
│ User         │ Wearing AI glasses, looks around
│              │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ AI-Powered Glasses                                               │
│ • HD Camera captures scene continuously                          │
│ • Edge AI Chip processes locally                                 │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ├─────────────────────────────────────────────────────────┐
       │                                                         │
       ▼ (Simple objects)                                        ▼ (Complex scenes)
┌──────────────────────────┐                          ┌──────────────────────┐
│ LOCAL PROCESSING         │                          │ CLOUD PROCESSING     │
│ (Edge AI Chip)           │                          │                      │
│                          │                          │ Mobile App (BT)      │
│ • MobileNet model        │                          │    ↓                 │
│ • <100ms latency         │                          │ API Gateway          │
│ • Common objects         │                          │    ↓                 │
│ • No internet needed     │                          │ Lambda + Rekognition │
│                          │                          │    ↓                 │
│ Result: "Chair ahead"    │                          │ Detailed analysis    │
└──────┬───────────────────┘                          └──────┬───────────────┘
       │                                                     │
       └─────────────────────┬───────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ Bone Conduction Audio Output                                     │
│ • Instant feedback without blocking ears                         │
│ • Continuous scene description                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

### 2.2 OCR & Text Reading Flow (Mobile + AI Glasses)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SCENARIO: Visually impaired farmer reads product label             │
└─────────────────────────────────────────────────────────────────────┘

CURRENT (Mobile):
┌──────────────┐
│ User         │ Points phone camera at label/document
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App → Capture image → Compress                            │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ API Gateway → Lambda Vision Orchestrator                         │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Textract                                                  │
│ • Printed text: ≥90% accuracy                                    │
│ • Handwritten: ≥70% accuracy                                     │
│ • Multi-language: Hindi, English, Tamil, Telugu, etc.            │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Lambda → Process extracted text                                  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Polly → Text-to-Speech                                    │
│ • Reads text aloud in user's preferred language                  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App → Audio Output                                        │
│ "Fertilizer: NPK 10-26-26. Usage: 50kg per acre..."             │
└──────────────────────────────────────────────────────────────────┘


FUTURE (With AI Glasses):
┌──────────────┐
│ User         │ Looks at text through glasses
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ AI Glasses → Continuous text detection                           │
│ • Edge OCR for simple text (instant)                             │
│ • Cloud Textract for complex documents                           │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Real-time audio narration through bone conduction                │
│ • Reads as user scans the document                               │
│ • No need to hold phone                                          │
└──────────────────────────────────────────────────────────────────┘
```

---

### 2.3 Navigation & Obstacle Detection (Smart Walking Stick)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SCENARIO: Blind user navigating rural path with walking stick      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ User         │ Walking with smart stick
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Smart Walking Stick                                              │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Ultrasonic Sensors (3 meters range)                        │  │
│ │ • Continuously scan for obstacles                          │  │
│ │ • Detect: walls, vehicles, people, animals, potholes       │  │
│ └────────────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ GPS Module                                                 │  │
│ │ • Track current location                                   │  │
│ │ • Navigation assistance                                    │  │
│ └────────────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Microcontroller (ESP32)                                    │  │
│ │ • Local processing                                         │  │
│ │ • Decision making                                          │  │
│ └────────────────────────────────────────────────────────────┘  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ├─────────────────────────────────────────────────────────┐
       │                                                         │
       ▼ (Immediate obstacle)                                   ▼ (Navigation)
┌──────────────────────────┐                          ┌──────────────────────┐
│ LOCAL RESPONSE           │                          │ CLOUD PROCESSING     │
│                          │                          │                      │
│ Vibration Motor          │                          │ Bluetooth → Mobile   │
│ • Intensity based on     │                          │    ↓                 │
│   distance               │                          │ MQTT → IoT Core      │
│ • Pattern indicates      │                          │    ↓                 │
│   direction              │                          │ Lambda IoT Handler   │
│                          │                          │    ↓                 │
│ <1 second response       │                          │ Calculate safe path  │
└──────────────────────────┘                          │    ↓                 │
                                                      │ Polly → Audio guide  │
                                                      └──────┬───────────────┘
                                                             │
                                                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App → Audio Output                                        │
│ "Obstacle 2 meters ahead. Turn slightly right."                  │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ DynamoDB Storage                                                 │
│ • Location history                                               │
│ • Obstacle patterns (learn safe routes)                          │
│ • Usage analytics                                                │
└──────────────────────────────────────────────────────────────────┘
```

---


### 2.4 Communication Flow (Speech-to-Text & Text-to-Speech)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SCENARIO A: Deaf user wants to understand spoken conversation      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Deaf User    │ Someone speaking nearby
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App                                                       │
│ • Microphone captures audio                                      │
│ • Real-time streaming mode                                       │
└──────┬───────────────────────────────────────────────────────────┘
       │ WebSocket
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ API Gateway (WebSocket) → Lambda Communication Orchestrator      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Transcribe (Streaming)                                    │
│ • Real-time speech-to-text                                       │
│ • Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati      │
│ • ≤2 second latency                                              │
│ • 85%+ accuracy                                                  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App → Real-time Text Display                              │
│ • Large, high-contrast text                                      │
│ • Scrolling transcript                                           │
│ • Save conversation option                                       │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ DynamoDB → Save transcript (optional)                            │
└──────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│ SCENARIO B: Speech-impaired user wants to communicate              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│ Speech-Impaired  │ Types message on phone
│ User             │
└──────┬───────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App                                                       │
│ • Text input interface                                           │
│ • Quick phrase buttons                                           │
│ • Customizable templates                                         │
└──────┬───────────────────────────────────────────────────────────┘
       │ HTTPS
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ API Gateway → Lambda Communication Orchestrator                  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Polly                                                     │
│ • Text-to-speech conversion                                      │
│ • Neural voices (natural sounding)                               │
│ • Male/female voice options                                      │
│ • Adjustable speed (slow/normal/fast)                            │
│ • <2 second latency                                              │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App → Audio Output (Speaker)                              │
│ "Hello, I need help finding the post office."                    │
└──────────────────────────────────────────────────────────────────┘
```

---

### 2.5 Healthcare Support Flow (Medical Report Simplification)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SCENARIO: User receives medical report and wants to understand it  │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ User         │ Captures photo of medical report
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App → Capture & compress image                            │
└──────┬───────────────────────────────────────────────────────────┘
       │ HTTPS
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ API Gateway → Lambda Healthcare Orchestrator                     │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Textract                                                  │
│ • Extract text from medical report                               │
│ • Handle complex layouts (tables, forms)                         │
│ • Identify key values (test results, medications)                │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Lambda → Parse medical data                                      │
│ • Identify test names and values                                 │
│ • Flag abnormal results                                          │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Bedrock (Claude/Llama)                                    │
│ • Simplify medical terminology                                   │
│ • Explain test results in simple language                        │
│ • Highlight abnormal values                                      │
│ • Provide educational context (NOT diagnosis)                    │
│ • Include disclaimer                                             │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Lambda → Format response                                         │
│ • Add medical disclaimer                                         │
│ • Recommend consulting doctor                                    │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Polly → Text-to-Speech                                    │
│ • Read simplified explanation aloud                              │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App → Display + Audio Output                              │
│                                                                  │
│ TEXT: "Your blood sugar (HbA1c) is 7.2%. This is slightly       │
│ higher than normal (normal is below 5.7%). This may indicate    │
│ prediabetes. Please consult your doctor for proper diagnosis    │
│ and treatment."                                                  │
│                                                                  │
│ AUDIO: Same content read aloud                                   │
│                                                                  │
│ DISCLAIMER: "This is educational information only. Not medical   │
│ advice. Consult healthcare professional."                        │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ S3 + DynamoDB → Store report (encrypted, with consent)           │
└──────────────────────────────────────────────────────────────────┘
```

---

### 2.6 Emergency Alert Flow (Mobile + Wearable Device)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SCENARIO: User has medical emergency and needs immediate help      │
└─────────────────────────────────────────────────────────────────────┘

CURRENT (Mobile Only):
┌──────────────┐
│ User         │ Single tap on emergency button
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App                                                       │
│ • Capture GPS location                                           │
│ • Prepare emergency message                                      │
└──────┬───────────────────────────────────────────────────────────┘
       │ HTTPS (works even on 2G)
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ API Gateway → Lambda Emergency Handler                           │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ DynamoDB → Fetch emergency contacts (up to 5)                    │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon SNS → Send SMS to all contacts                            │
│                                                                  │
│ MESSAGE: "EMERGENCY ALERT: [User Name] needs help!              │
│ Location: [GPS coordinates / Google Maps link]                   │
│ Time: [Timestamp]                                                │
│ Condition: [User's registered condition]"                        │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App → Audio confirmation                                  │
│ "Emergency alert sent to 5 contacts"                             │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ DynamoDB → Log emergency event                                   │
└──────────────────────────────────────────────────────────────────┘


FUTURE (With Wearable Health Monitor):
┌──────────────┐
│ User         │ Falls down / Health emergency
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Wearable Health Monitor                                          │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Accelerometer detects fall (sudden impact + no movement)   │  │
│ └────────────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Wait 10 seconds for user response                          │  │
│ │ • Vibration alert                                          │  │
│ │ • "Are you okay?" prompt                                   │  │
│ └────────────────────────────────────────────────────────────┘  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ├─────────────────────────────────────────────────────────┐
       │                                                         │
       ▼ (No response)                                          ▼ (User responds OK)
┌──────────────────────────┐                          ┌──────────────────────┐
│ AUTOMATIC ALERT          │                          │ Cancel alert         │
│                          │                          │ Log false alarm      │
│ Bluetooth → Mobile App   │                          └──────────────────────┘
│    ↓                     │
│ MQTT → IoT Core          │
│    ↓                     │
│ Lambda Emergency Handler │
│    ↓                     │
│ Fetch contacts           │
│    ↓                     │
│ SNS → SMS Alert          │
│                          │
│ MESSAGE includes:        │
│ • Fall detected          │
│ • Heart rate data        │
│ • GPS location           │
│ • Timestamp              │
└──────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ CloudWatch → Log event + Trigger monitoring                      │
└──────────────────────────────────────────────────────────────────┘
```

---


### 2.7 Information Assistant Flow (Government Schemes & Services)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SCENARIO: User wants to learn about disability welfare schemes     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ User         │ Asks voice question in Hindi
│              │ "मुझे विकलांगता पेंशन योजना के बारे में बताओ"
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App                                                       │
│ • Voice input captured                                           │
│ • Audio compressed                                               │
└──────┬───────────────────────────────────────────────────────────┘
       │ HTTPS
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ API Gateway → Lambda Information Orchestrator                    │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Transcribe                                                │
│ • Convert Hindi speech to text                                   │
│ • "मुझे विकलांगता पेंशन योजना के बारे में बताओ"                │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Bedrock (Claude/Llama)                                    │
│ • Understand query intent                                        │
│ • Retrieve information about disability pension schemes          │
│ • Format response in simple Hindi                                │
│                                                                  │
│ RESPONSE: "विकलांगता पेंशन योजना के तहत, 40% या अधिक           │
│ विकलांगता वाले व्यक्तियों को मासिक पेंशन मिलती है।             │
│ आवेदन के लिए: 1) विकलांगता प्रमाण पत्र 2) आधार कार्ड           │
│ 3) बैंक खाता विवरण चाहिए। नजदीकी तहसील कार्यालय में             │
│ आवेदन करें।"                                                     │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Amazon Polly                                                     │
│ • Convert Hindi text to speech                                   │
│ • Natural-sounding Hindi voice                                   │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ Mobile App → Display + Audio Output                              │
│ • Text displayed in Hindi                                        │
│ • Audio played in Hindi                                          │
│ • Option to save information                                     │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ DynamoDB → Save conversation history (optional)                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Multi-Device Coordination Flow (Future)

```
┌─────────────────────────────────────────────────────────────────────┐
│ SCENARIO: User with multiple devices working together              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         USER'S DEVICE ECOSYSTEM                      │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │ AI Glasses     │  │ Smart Stick    │  │ Wearable       │        │
│  │ (Vision)       │  │ (Navigation)   │  │ (Health)       │        │
│  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘        │
│          │                   │                   │                  │
│          └───────────────────┴───────────────────┘                  │
│                              │                                      │
│                         Bluetooth                                   │
│                              │                                      │
│                              ▼                                      │
│                    ┌──────────────────┐                             │
│                    │  Mobile App      │                             │
│                    │  (Hub/Gateway)   │                             │
│                    └────────┬─────────┘                             │
└─────────────────────────────┼──────────────────────────────────────┘
                              │
                              │ HTTPS/MQTT
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         AWS IoT CORE                                 │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ Device Shadows (State Synchronization)                         │ │
│  │                                                                │ │
│  │ glasses-001:                                                   │ │
│  │   battery: 75%, mode: "continuous", lastCapture: "10:30:00"   │ │
│  │                                                                │ │
│  │ stick-001:                                                     │ │
│  │   battery: 85%, lastObstacle: "2m ahead", location: [lat,lon] │ │
│  │                                                                │ │
│  │ wearable-001:                                                  │ │
│  │   battery: 60%, heartRate: 72, activity: "walking"            │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    Lambda: Multi-Device Coordinator                  │
│                                                                      │
│  • Aggregate data from all devices                                   │
│  • Coordinate actions across devices                                 │
│  • Optimize battery usage                                            │
│  • Prioritize critical alerts                                        │
│                                                                      │
│  EXAMPLE COORDINATION:                                               │
│  1. Glasses detect person approaching                                │
│  2. Stick detects no obstacle in path                                │
│  3. Wearable confirms user is walking                                │
│  → Combined insight: "Person approaching from right, path clear"     │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    Unified Response to User                          │
│                                                                      │
│  • Glasses: Visual indicator (LED)                                   │
│  • Stick: Vibration pattern                                          │
│  • Mobile: Audio announcement                                        │
│  • Wearable: Haptic feedback                                         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Flow Summary Table

| Feature | Input Device | Processing | AI Service | Output Device | Latency |
|---------|-------------|------------|------------|---------------|---------|
| Object Detection | Mobile Camera / AI Glasses | Lambda + Edge | Rekognition | Mobile Audio / Glasses Audio | <3s / <100ms |
| OCR | Mobile Camera / AI Glasses | Lambda + Edge | Textract | Mobile Audio / Glasses Audio | <3s |
| Speech-to-Text | Mobile Mic | Lambda | Transcribe | Mobile Display | <2s |
| Text-to-Speech | Mobile Keyboard | Lambda | Polly | Mobile Speaker | <2s |
| Face Recognition | Mobile Camera / AI Glasses | Lambda + Edge | Rekognition | Mobile Audio / Glasses Audio | <3s |
| Medical Report | Mobile Camera | Lambda | Textract + Bedrock | Mobile Display + Audio | <5s |
| Government Info | Mobile Mic | Lambda | Transcribe + Bedrock + Polly | Mobile Audio | <3s |
| Navigation | Smart Stick | Lambda + Edge | Location Service | Stick Vibration + Mobile Audio | <1s |
| Fall Detection | Wearable | Lambda | CloudWatch | SNS SMS | <10s |
| Emergency Alert | Mobile / Wearable | Lambda | SNS | SMS to Contacts | <5s |

---

## 5. Hardware Specifications Summary

### Smart Walking Stick
```
┌─────────────────────────────────────────────────────────────┐
│ HARDWARE COMPONENTS                                         │
├─────────────────────────────────────────────────────────────┤
│ • Ultrasonic Sensors: 3 sensors, 3m range                   │
│ • GPS Module: Real-time location tracking                   │
│ • Vibration Motor: Haptic feedback (3 intensity levels)     │
│ • Emergency Button: One-touch SOS                           │
│ • Microcontroller: ESP32 (WiFi + Bluetooth)                 │
│ • Battery: 2000mAh, 7-day life, USB-C charging              │
│ • Dimensions: 90cm length, 3cm diameter, 250g weight        │
├─────────────────────────────────────────────────────────────┤
│ CONNECTIVITY                                                │
├─────────────────────────────────────────────────────────────┤
│ • Bluetooth 5.0 to mobile app                               │
│ • MQTT over mobile data to AWS IoT Core                     │
├─────────────────────────────────────────────────────────────┤
│ COST                                                        │
├─────────────────────────────────────────────────────────────┤
│ • Hardware: ₹2,500-₹3,500                                   │
│ • Cloud: ₹0.20 per device per month                         │
└─────────────────────────────────────────────────────────────┘
```

### AI-Powered Glasses
```
┌─────────────────────────────────────────────────────────────┐
│ HARDWARE COMPONENTS                                         │
├─────────────────────────────────────────────────────────────┤
│ • HD Camera: 1080p, 60fps, wide-angle lens                  │
│ • Edge AI Chip: NVIDIA Jetson Nano / Google Coral           │
│ • Bone Conduction Speakers: Audio without blocking ears     │
│ • Touch Controls: Tap/swipe gestures                        │
│ • Battery: 1500mAh, 8-hour continuous use                   │
│ • Weight: <50 grams (lightweight frame)                     │
├─────────────────────────────────────────────────────────────┤
│ CONNECTIVITY                                                │
├─────────────────────────────────────────────────────────────┤
│ • Bluetooth 5.0 to mobile app                               │
│ • WiFi for direct cloud connection (optional)               │
├─────────────────────────────────────────────────────────────┤
│ EDGE COMPUTING                                              │
├─────────────────────────────────────────────────────────────┤
│ • Local ML models: MobileNet for object detection           │
│ • <100ms latency for common objects                         │
│ • Offline mode for basic features                           │
├─────────────────────────────────────────────────────────────┤
│ COST                                                        │
├─────────────────────────────────────────────────────────────┤
│ • Hardware: ₹8,000-₹12,000                                  │
│ • Cloud: ₹0.80 per device per month                         │
└─────────────────────────────────────────────────────────────┘
```

### Wearable Health Monitor
```
┌─────────────────────────────────────────────────────────────┐
│ HARDWARE COMPONENTS                                         │
├─────────────────────────────────────────────────────────────┤
│ • Heart Rate Sensor: Continuous monitoring                  │
│ • Accelerometer: 3-axis, fall detection                     │
│ • GPS Module: Location tracking                             │
│ • Emergency Button: One-touch SOS                           │
│ • Vibration Motor: Alerts and notifications                 │
│ • Battery: 300mAh, 5-day life, magnetic charging            │
│ • Form Factor: Wristband, 30g weight, IP67 water resistant  │
├─────────────────────────────────────────────────────────────┤
│ CONNECTIVITY                                                │
├─────────────────────────────────────────────────────────────┤
│ • Bluetooth 5.0 to mobile app                               │
│ • MQTT over mobile data to AWS IoT Core                     │
├─────────────────────────────────────────────────────────────┤
│ HEALTH MONITORING                                           │
├─────────────────────────────────────────────────────────────┤
│ • Heart rate: Continuous, alerts on anomalies               │
│ • Fall detection: Automatic emergency alert                 │
│ • Activity tracking: Steps, movement patterns               │
│ • NON-DIAGNOSTIC: Educational purposes only                 │
├─────────────────────────────────────────────────────────────┤
│ COST                                                        │
├─────────────────────────────────────────────────────────────┤
│ • Hardware: ₹1,500-₹2,500                                   │
│ • Cloud: ₹0.30 per device per month                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Phases

```
PHASE 1: MVP (Months 1-3) - MOBILE ONLY
┌────────────────────────────────────────────────────────────┐
│ ✓ Mobile app (Android/iOS)                                │
│ ✓ Vision assistance (object detection, OCR)               │
│ ✓ Basic TTS and STT                                        │
│ ✓ Emergency alerts                                         │
│ ✓ Hindi and English support                                │
│ ✓ AWS serverless backend                                   │
└────────────────────────────────────────────────────────────┘

PHASE 2: Enhanced Features (Months 4-6) - MOBILE
┌────────────────────────────────────────────────────────────┐
│ ✓ Face recognition with consent                            │
│ ✓ Gesture recognition                                      │
│ ✓ Healthcare report simplification                         │
│ ✓ Add 3 more Indian languages                              │
└────────────────────────────────────────────────────────────┘

PHASE 3: Information Assistant (Months 7-9) - MOBILE
┌────────────────────────────────────────────────────────────┐
│ ✓ Conversational AI with Bedrock                           │
│ ✓ Government scheme information                            │
│ ✓ Public services directory                                │
│ ✓ Add remaining Indian languages                           │
└────────────────────────────────────────────────────────────┘

PHASE 4: Smart Walking Stick (Months 10-12) - HARDWARE
┌────────────────────────────────────────────────────────────┐
│ ○ Hardware prototype development                           │
│ ○ AWS IoT Core integration                                 │
│ ○ Obstacle detection algorithms                            │
│ ○ GPS navigation                                           │
│ ○ Field testing in rural areas                             │
└────────────────────────────────────────────────────────────┘

PHASE 5: AI-Powered Glasses (Months 13-18) - HARDWARE
┌────────────────────────────────────────────────────────────┐
│ ○ Edge AI model optimization                               │
│ ○ AWS IoT Greengrass deployment                            │
│ ○ Face recognition integration                             │
│ ○ Battery optimization                                     │
│ ○ Clinical trials                                          │
└────────────────────────────────────────────────────────────┘

PHASE 6: Wearable Devices (Months 19-21) - HARDWARE
┌────────────────────────────────────────────────────────────┐
│ ○ Health monitoring algorithms                             │
│ ○ Fall detection accuracy improvement                      │
│ ○ Emergency alert system integration                       │
│ ○ Non-diagnostic validation                                │
└────────────────────────────────────────────────────────────┘

PHASE 7: Scale & Optimize (Months 22-24)
┌────────────────────────────────────────────────────────────┐
│ ○ Mass production partnerships                             │
│ ○ Cost optimization                                        │
│ ○ Multi-device coordination                                │
│ ○ Advanced analytics                                       │
└────────────────────────────────────────────────────────────┘
```

---

## 7. Cost Projections

### Per User Per Month (Software Only - Phase 1-3)
```
Mobile App User:
├─ Lambda: ₹0.50
├─ AI Services: ₹2.50
├─ Storage: ₹0.30
├─ Data Transfer: ₹0.40
├─ API Gateway: ₹0.20
└─ SNS: ₹0.10
TOTAL: ~₹4.00 per active user per month
```

### Per User Per Month (With Hardware - Phase 4+)
```
User with Smart Walking Stick:
├─ Software: ₹4.00
├─ IoT Core: ₹0.10
├─ Lambda (IoT): ₹0.05
└─ Storage (device data): ₹0.05
TOTAL: ~₹4.20 per user per month

User with AI Glasses:
├─ Software: ₹4.00
├─ IoT Core: ₹0.15
├─ Greengrass: ₹0.25
├─ Lambda (IoT): ₹0.30
└─ Storage: ₹0.10
TOTAL: ~₹4.80 per user per month

User with All Devices (Glasses + Stick + Wearable):
├─ Software: ₹4.00
├─ All IoT services: ₹1.30
TOTAL: ~₹5.30 per user per month
```

### Scaling Projections
```
10,000 Users (Mixed):
├─ 7,000 mobile only: ₹28,000/month
├─ 2,000 with stick: ₹8,400/month
├─ 1,000 with glasses: ₹4,800/month
TOTAL: ₹41,200/month (~₹4.12 per user)

100,000 Users (Mixed):
├─ Volume discounts apply
├─ Estimated: ₹3.50 per user
TOTAL: ₹3,50,000/month
```

---

## Summary

SakshamAI Rural provides a comprehensive assistive technology platform that:

1. **Current Phase (Mobile)**: Delivers vision assistance, communication support, healthcare information, and emergency services through a mobile app connected to AWS serverless services.

2. **Future Phase (Hardware)**: Integrates IoT devices (smart walking stick, AI glasses, wearable health monitor) for enhanced capabilities while maintaining cost-effectiveness.

3. **Architecture**: Hybrid edge-cloud computing ensures low latency, offline capabilities, and bandwidth optimization for rural connectivity.

4. **Cost**: Maintains target of ≤₹5 per user per month even with multiple hardware devices.

5. **Impact**: Empowers 1 million+ differently abled individuals in rural India with affordable, accessible AI-powered assistance.
