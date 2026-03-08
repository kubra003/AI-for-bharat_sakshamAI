# AWS Architecture Diagram Creation Guide

## Official AWS Architecture Icons

### Download AWS Icons

1. Go to: https://aws.amazon.com/architecture/icons/
2. Click "Download AWS Architecture Icons"
3. Extract the ZIP file
4. You'll get PNG and SVG files for all AWS services

---

## Method 1: PowerPoint with AWS Icons (Recommended)

### Step 1: Set Up PowerPoint

1. Open PowerPoint
2. Create new blank presentation
3. Set slide size to 16:9 (Design → Slide Size → Widescreen)
4. Remove title placeholder

### Step 2: Import AWS Icons

1. Insert → Pictures → Browse
2. Navigate to extracted AWS icons folder
3. Import these icons:

**Frontend Layer:**
- `Arch_Compute/Arch_64/Arch_Amazon-EC2_64.png` (or use generic computer icon)

**API Layer:**
- `Arch_App-Integration/Arch_64/Arch_Amazon-API-Gateway_64.png`

**Compute Layer (5 copies):**
- `Arch_Compute/Arch_64/Arch_AWS-Lambda_64.png`

**AI Services Layer:**
- `Arch_Machine-Learning/Arch_64/Arch_Amazon-Rekognition_64.png`
- `Arch_Machine-Learning/Arch_64/Arch_Amazon-Polly_64.png`
- `Arch_Machine-Learning/Arch_64/Arch_Amazon-Textract_64.png`
- `Arch_Machine-Learning/Arch_64/Arch_Amazon-Transcribe_64.png`
- `Arch_Machine-Learning/Arch_64/Arch_Amazon-Bedrock_64.png`

**Storage Layer:**
- `Arch_Storage/Arch_64/Arch_Amazon-Simple-Storage-Service_64.png`
- `Arch_Database/Arch_64/Arch_Amazon-DynamoDB_64.png`

**Monitoring Layer:**
- `Arch_Management-Governance/Arch_64/Arch_Amazon-CloudWatch_64.png`
- `Arch_Security-Identity-Compliance/Arch_64/Arch_AWS-Identity-and-Access-Management_64.png`

### Step 3: Create Layout

**Layer 1 - Frontend (Left side):**
```
┌─────────────────┐
│  Frontend Layer │
│                 │
│  [User App]     │
│   (Computer)    │
└─────────────────┘
```

**Layer 2 - API (Center-left):**
```
┌─────────────────┐
│   API Layer     │
│                 │
│  [API Gateway]  │
│   (Purple)      │
└─────────────────┘
```

**Layer 3 - Compute (Center):**
```
┌─────────────────────────────┐
│     Compute Layer           │
│                             │
│  [Lambda] [Lambda] [Lambda] │
│  Vision   Comm.    Health   │
│                             │
│  [Lambda] [Lambda]          │
│  Info     Emergency         │
└─────────────────────────────┘
```

**Layer 4 - AI Services (Center-right):**
```
┌─────────────────────────────┐
│    AI Services Layer        │
│                             │
│  [Rekognition] [Polly]      │
│  [Textract] [Transcribe]    │
│  [Bedrock]                  │
└─────────────────────────────┘
```

**Layer 5 - Storage (Right):**
```
┌─────────────────┐
│  Storage Layer  │
│                 │
│  [S3]           │
│  [DynamoDB]     │
└─────────────────┘
```

**Layer 6 - Monitoring (Bottom-right):**
```
┌─────────────────────┐
│  Monitoring Layer   │
│                     │
│  [CloudWatch]       │
│  [IAM/KMS]          │
└─────────────────────┘
```

### Step 4: Add Connections

1. Insert → Shapes → Arrow
2. Connect components:
   - User App → API Gateway
   - API Gateway → All Lambda functions
   - Lambda functions → AI Services
   - Lambda functions → Storage
   - Lambda functions → Monitoring

### Step 5: Add Labels

1. Insert → Text Box
2. Add layer titles:
   - "Frontend Layer"
   - "API Layer"
   - "Compute Layer"
   - "AI Services Layer"
   - "Storage Layer"
   - "Monitoring & Security"

3. Add service labels below each icon:
   - "Mobile/Web App"
   - "Amazon API Gateway"
   - "AWS Lambda - Vision"
   - "AWS Lambda - Communication"
   - etc.

### Step 6: Add Background Boxes

1. Insert → Shapes → Rectangle
2. Create colored boxes for each layer:
   - Frontend: Light Green (#E8F5E9)
   - API: Light Blue (#E3F2FD)
   - Compute: Light Orange (#FFF3E0)
   - AI Services: Light Purple (#F3E5F5)
   - Storage: Light Green (#E8F5E9)
   - Monitoring: Light Gray (#ECEFF1)

3. Send boxes to back: Right-click → Send to Back

### Step 7: Final Touches

1. Align all icons: Select all → Format → Align → Align Center
2. Distribute evenly: Format → Align → Distribute Horizontally
3. Group related elements: Select → Right-click → Group
4. Add title: "SakshamAI Rural - AWS Architecture"

---

## Method 2: draw.io (Free Online Tool)

### Step 1: Open draw.io

1. Go to https://app.diagrams.net/
2. Click "Create New Diagram"
3. Choose "Blank Diagram"

### Step 2: Enable AWS Shape Library

1. Click "More Shapes" (bottom-left)
2. Search for "AWS"
3. Check "AWS 19" (latest AWS icons)
4. Click "Apply"

### Step 3: Drag and Drop

1. Find AWS icons in left sidebar
2. Drag icons onto canvas:
   - API Gateway
   - Lambda (5 copies)
   - Rekognition
   - Polly
   - Textract
   - Transcribe
   - Bedrock
   - S3
   - DynamoDB
   - CloudWatch
   - IAM

### Step 4: Add Containers

1. Click "Container" in left sidebar
2. Drag containers for each layer
3. Label containers:
   - Frontend Layer
   - API Layer
   - Compute Layer
   - AI Services Layer
   - Storage Layer
   - Monitoring Layer

### Step 5: Connect Components

1. Click connector tool (top toolbar)
2. Draw arrows between components
3. Style arrows: Click arrow → Format → Line Style

### Step 6: Export

1. File → Export as → PNG
2. Choose resolution: 300 DPI
3. Check "Transparent Background"
4. Click "Export"

---

## Method 3: Lucidchart (Professional)

### Step 1: Create Account

1. Go to https://www.lucidchart.com/
2. Sign up for free account
3. Create new document

### Step 2: Use AWS Template

1. Click "Templates"
2. Search "AWS Architecture"
3. Choose "AWS Architecture Diagram"
4. Click "Use Template"

### Step 3: Customize

1. Replace template components with your services
2. Add/remove components as needed
3. Update labels and connections

### Step 4: Export

1. File → Download
2. Choose PNG or PDF
3. Select resolution
4. Download

---

## Method 4: CloudCraft (3D Diagrams)

### Step 1: Create Account

1. Go to https://www.cloudcraft.co/
2. Sign up for free account
3. Create new diagram

### Step 2: Build Architecture

1. Drag AWS services from left panel
2. Arrange in layers
3. Connect components

### Step 3: Switch to 2D View

1. Click "2D" button (top-right)
2. Adjust layout
3. Add labels

### Step 4: Export

1. Click "Export" button
2. Choose PNG or PDF
3. Download

---

## Recommended Approach for Your Presentation

**For PowerPoint Presentation:**
1. Use Method 1 (PowerPoint with AWS Icons)
2. Create diagram directly in your presentation
3. Easy to edit and update

**For High-Quality Standalone Diagram:**
1. Use Method 2 (draw.io)
2. Free and professional
3. Export as high-res PNG
4. Insert into PowerPoint

**For 3D Visualization:**
1. Use Method 4 (CloudCraft)
2. Create impressive 3D view
3. Switch to 2D for technical accuracy
4. Export both views

---

## Color Scheme (Match AWS Style)

- **Frontend**: Green (#4CAF50)
- **API**: Blue (#2196F3)
- **Compute**: Orange (#FF9800)
- **AI Services**: Purple (#9C27B0)
- **Storage**: Green (#43A047) and Purple (#5E35B1)
- **Monitoring**: Red (#F44336) and Gray (#607D8B)

---

## Tips for Professional Diagrams

1. **Consistent Sizing**: All icons same size (64x64 or 128x128)
2. **Alignment**: Use alignment tools to keep everything neat
3. **Spacing**: Equal spacing between components
4. **Labels**: Clear, concise labels below each icon
5. **Arrows**: Use consistent arrow styles
6. **Colors**: Use AWS official colors or your color scheme
7. **Legend**: Add legend explaining icons (optional)
8. **Title**: Add clear title at top

---

## Quick Reference: AWS Service Icons

| Service | Icon Color | Location in Icon Pack |
|---------|-----------|----------------------|
| API Gateway | Purple | Arch_App-Integration |
| Lambda | Orange | Arch_Compute |
| Rekognition | Pink | Arch_Machine-Learning |
| Polly | Pink | Arch_Machine-Learning |
| Textract | Pink | Arch_Machine-Learning |
| Transcribe | Pink | Arch_Machine-Learning |
| Bedrock | Pink | Arch_Machine-Learning |
| S3 | Green | Arch_Storage |
| DynamoDB | Purple | Arch_Database |
| CloudWatch | Pink | Arch_Management-Governance |
| IAM | Red | Arch_Security-Identity-Compliance |
| SNS | Pink | Arch_App-Integration |

---

## Final Diagram Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SakshamAI Rural - AWS Architecture                │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐    ┌──────────┐    ┌─────────────────────────────────┐
│ Frontend │ -> │   API    │ -> │        Compute Layer            │
│  Layer   │    │  Layer   │    │  [λ] [λ] [λ] [λ] [λ]           │
│          │    │          │    │  Vision, Comm, Health, Info, SOS│
│ [User    │    │ [API     │    └─────────────────────────────────┘
│  App]    │    │ Gateway] │              ↓         ↓
└──────────┘    └──────────┘              ↓         ↓
                                          ↓         ↓
                    ┌─────────────────────┴─────────┴──────────┐
                    │        AI Services Layer                  │
                    │  [Rekognition] [Polly] [Textract]        │
                    │  [Transcribe] [Bedrock]                  │
                    └──────────────────────────────────────────┘
                                          ↓
                    ┌─────────────────────┴──────────────────┐
                    │        Storage Layer                    │
                    │  [S3 Bucket] [DynamoDB]                │
                    └────────────────────────────────────────┘
                                          ↓
                    ┌─────────────────────┴──────────────────┐
                    │    Monitoring & Security Layer          │
                    │  [CloudWatch] [IAM/KMS] [SNS]          │
                    └────────────────────────────────────────┘
```

---

**Recommendation**: Use **draw.io** (Method 2) for the best balance of:
- Professional appearance
- Official AWS icons
- Free to use
- Easy to edit
- High-quality export

Good luck with your diagram! 🎨
