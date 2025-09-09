
# Pixel to Practice 🧠

An advanced educational platform for radiology pattern recognition using interactive constellation visualization. Master radiology through evidence-based **TECHNICAL → CLINICAL → ANATOMICAL** learning framework.

![Pixel to Practice](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4)

## 🌟 Features

### Interactive Constellation Learning
- **Immersive 3D constellation viewer** using React Flow
- **Draggable and zoomable nodes** for dynamic exploration
- **Progressive knowledge depth** with three learning levels
- **Professional medical interface** optimized for education

### Educational Framework
- **TECHNICAL**: Understanding imaging physics and acquisition
- **CLINICAL**: Clinical significance and patient management
- **ANATOMICAL**: Location-based pattern recognition

### Current Cases
1. **Gas Bubbles on SWI** - 65M post-posterior fossa surgery
2. **Trauma Gas** - 20M bike fall with skull fracture (Emergency case)
3. **Normal Brain** - 20M first episode psychosis (Reference case)

### Advanced Features
- **Multi-modality image viewer** with comparison capabilities
- **Mobile-responsive design** for learning anywhere
- **Real-time image switching** between modalities and views
- **Professional dark theme** optimized for medical imaging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation & Setup

1. **Clone and install dependencies:**
```bash
git clone <your-repo-url>
cd radiology-constellation
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Access the application:**
Open your browser to `http://localhost:5000`

## 🏗️ Project Structure

```
radiology-constellation/
├── client/src/
│   ├── components/
│   │   ├── ConstellationViewer/     # Interactive constellation UI
│   │   ├── MedicalImageViewer/      # Medical image display
│   │   ├── IntegratedImageViewer/   # Combined viewer interface
│   │   └── CaseSelector/            # Case selection interface
│   ├── data/curated-cases/          # Educational case data
│   │   ├── gasBubblesSWI.ts        # Post-surgical gas bubbles
│   │   ├── traumaGas.ts            # Emergency trauma case
│   │   └── normalBrain.ts          # Reference normal case
│   └── pages/
│       ├── dashboard.tsx           # Landing page
│       └── integrated-viewer.tsx   # Main learning interface
├── public/medical_images/           # Medical imaging assets
├── server/                         # Express backend
└── shared/                         # Shared TypeScript schemas
```

## 📚 Learning Framework

### TECHNICAL Level
- **Imaging physics** and acquisition parameters
- **Sequence characteristics** (SWI, CT, MRI)
- **Artifact recognition** and technical considerations

### CLINICAL Level
- **Patient presentation** and clinical context
- **Timeline significance** (post-operative vs trauma)
- **Management implications** and urgency assessment

### ANATOMICAL Level
- **Location-based pattern recognition**
- **Anatomical significance** of findings
- **Structure-function relationships**

## 🔧 Tech Stack

### Frontend
- **React 18.3.1** with TypeScript
- **React Flow** for constellation visualization
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **Vite** for build tooling
- **Custom medical imaging API**

### UI Components
- **Radix UI** component library
- **Lucide React** icons
- **Professional medical theme**

## 🎯 Usage Guide

### Getting Started
1. **Launch the application** and click "Start Learning"
2. **Select a case** from the available options
3. **Explore the constellation** by clicking on nodes
4. **Progress through knowledge levels** using depth controls

### Navigation
- **Constellation nodes**: Click to reveal detailed explanations
- **Knowledge depth**: Use controls to access different learning levels
- **Image viewer**: Switch between modalities and comparison views
- **Case selector**: Change between different clinical scenarios

### Learning Tips
- Start with **"Normal Brain"** for baseline understanding
- Progress to **"Gas Bubbles on SWI"** for post-operative patterns
- Challenge yourself with **"Trauma Gas"** emergency case
- Use comparison mode to understand differences between cases

## 🔬 Medical Cases Detail

### Gas Bubbles on SWI
**Patient**: 65-year-old male post-posterior fossa surgery
- **Modalities**: MRI FLAIR, T2, SWI
- **Key Learning**: Post-operative gas distribution patterns
- **Timeline**: Expected findings in immediate post-operative period

### Trauma Gas (Emergency Case)
**Patient**: 20-year-old male bike fall with skull fracture
- **Modalities**: CT Head (multiple views), CT Venogram
- **Key Learning**: Emergency recognition of venous sinus thrombosis
- **Clinical Urgency**: Immediate anticoagulation considerations

### Normal Brain (Reference)
**Patient**: 20-year-old male first episode psychosis
- **Modalities**: MRI SWI
- **Key Learning**: Normal anatomy baseline for comparison
- **Clinical Context**: Structural imaging in psychiatric evaluation

## 🚀 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
```

### Adding New Cases
1. Create case data file in `client/src/data/curated-cases/`
2. Add medical images to `public/medical_images/`
3. Update case registry in `index.ts`
4. Follow the established framework structure

### Development Guidelines
- Follow **TypeScript strict mode**
- Use **Tailwind CSS** for styling consistency
- Maintain **medical education standards**
- Ensure **mobile responsiveness**

## 📱 Deployment

### Replit Deployment
This project is optimized for Replit deployment:

1. **Push to Replit** via GitHub integration
2. **Configure run command**: `npm run dev`
3. **Set environment**: Node.js with automatic dependency installation
4. **Public access**: Available on `<repl-name>.<username>.repl.co`

### Production Build
```bash
npm run build    # Creates optimized production build
npm run start    # Serves production build
```

## 🎨 Design Philosophy

### Medical Education Focus
- **Evidence-based learning** with structured progression
- **Professional interface** suitable for medical faculty
- **Pattern recognition** through interactive visualization
- **Multi-modal learning** accommodating different learning styles

### User Experience
- **Intuitive navigation** with clear visual cues
- **Progressive disclosure** of complex medical information
- **Responsive design** for various devices and settings
- **Professional aesthetics** maintaining medical standards

## 🤝 Contributing

We welcome contributions to improve medical education:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-case`
3. **Follow coding standards** and TypeScript guidelines
4. **Test thoroughly** with medical accuracy
5. **Submit pull request** with detailed description

### Contribution Areas
- **New clinical cases** with educational value
- **UI/UX improvements** for better learning experience
- **Mobile optimization** and accessibility features
- **Educational content** and framework enhancements

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- **Documentation**: [Additional docs if available]
- **Issues**: [GitHub Issues]
- **Discussions**: [GitHub Discussions]

---

**Built with ❤️ for medical education**

*Advancing radiology education through interactive technology and evidence-based learning frameworks.*
