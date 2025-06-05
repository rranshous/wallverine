# 🎩 Wallverine
### *Voice-Controlled Wall Animation System*

Transform any wall into a dynamic, interactive canvas with voice commands! Wallverine projects mesmerizing visual effects that respond to your spoken words, creating an immersive experience perfect for presentations, parties, or pure visual delight.

## ✨ What is Wallverine?

Wallverine is a browser-based application that turns your projector setup into a voice-controlled art installation. Say "particles" and watch colorful bursts fill your wall. Command "set background to stars, add fire to foreground" and witness layered compositions come to life with sophisticated depth and blending.

Built with TypeScript, HTML5 Canvas, and the Web Speech API, Wallverine runs entirely in your browser - no backend required!

## 🚀 Quick Start

### Prerequisites
- Node.js (16+ recommended)
- A modern browser with Web Speech API support (Chrome, Edge)
- Optional: Projector for wall projection

### Installation & Setup

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd wallverine
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:5173`
   - Click anywhere to enable voice control
   - Start commanding your wall!

## 🎭 Voice Commands

### Basic Effects
- `"particles"` - Colorful particle explosions
- `"spiral"` - Hypnotic spiral animations  
- `"waves"` - Flowing wave patterns
- `"rainbow"` - Cascading color drops
- `"stars"` - Twinkling starfield
- `"lightning"` - Electric bolt effects
- `"geometry"` - Rotating geometric shapes
- `"fire"` - Rising flame effects

### Epic Combinations
Combine any effects for magical results:
- `"particles and waves"` 🎆🌊
- `"rainbow fire lightning"` 🌈🔥⚡
- `"stars geometry spiral"` ⭐📐🌀

### Layered Compositions
Build sophisticated depth with 3-layer control:

**Setting Layers:**
- `"set background to stars"`
- `"add particles to foreground"`
- `"put fire in the middle"`

**Managing Layers:**
- `"clear background"`
- `"clear foreground"`
- `"clear middle"`

**Natural Language:**
- `"overlay lightning on top"`
- `"place waves behind everything"`
- `"remove the background"`

### Speed Control
- `"faster"` - 4x speed boost for energy
- `"slower"` - 0.2x speed for dramatic effect  
- `"normal speed"` - Reset to default
- `"clear"` - Reset everything

## 🎪 Understanding Scene Modes

### Single Scene Mode
Traditional mode where one effect controls the entire canvas:
```
Status: Current Scene: particles
```

### Layered Scene Mode  
Advanced composition with 3D-like depth:
```
🎭 Scene Status: (Golden border indicates layered mode)
Background: stars     (60% opacity, mood setting)
Middle: fire         (Additive blending, energy glow)  
Foreground: particles (Full opacity, sharp details)
```

The layered system creates incredible visual depth through sophisticated blending modes and opacity control.

## ⌨️ Keyboard Shortcuts (Testing)

**Basic Effects:**
- `1-8` - Individual effects
- `9` - Particles + Waves combo
- `0` - Rainbow + Fire + Lightning combo

**Layer Control:**
- `Q` - Set background to stars
- `W` - Add particles to foreground  
- `E` - Put fire in middle
- `R/T/Y` - Clear background/foreground/middle

**Controls:**
- `C` - Clear all
- `+/-` - Speed control
- `=` - Normal speed

## 🏗️ Architecture

### Core Components

- **`main.ts`** - Application controller and voice command processing
- **`SceneManager.ts`** - Scene lifecycle and layered composition system
- **`scenes.ts`** - Visual effects library and natural language parsing
- **`VoiceController.ts`** - Web Speech API wrapper

### Scene System
Each visual effect is a `Scene` with an `animate` function. The `SceneManager` handles:
- Single scene rendering
- Layered composition with proper blending
- Smooth transitions between modes
- Performance optimization

### Voice Processing Pipeline
1. **Speech Recognition** - Web Speech API captures voice
2. **Command Parsing** - Natural language processing extracts intent
3. **Effect Resolution** - Maps commands to scene configurations  
4. **Scene Management** - Applies changes with visual feedback

## 🎨 Creating New Effects

Add new visual effects by implementing the `Scene` interface:

```typescript
export const myCustomScene: Scene = {
  name: 'my-effect',
  animate: (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
    // Your animation logic here
    // Use global `animationSpeed` variable for speed control
  },
  onEnter?: () => console.log('Effect started'),
  onExit?: () => console.log('Effect ended')
};
```

Then register it in the effect maps in `main.ts`.

## 🌟 Advanced Usage

### GitHub Codespaces
Perfect for cloud development and instant deployment:
1. Open in Codespaces
2. Port 5173 auto-forwards
3. Share the URL for remote wall control

### Projection Setup
- Use second monitor/projector as display
- Keep browser controls on primary screen  
- Full-screen the canvas for immersive experience

### Performance Tips
- Single effects perform better than combinations
- Layered mode uses more GPU resources
- Adjust animation complexity based on hardware

## 🤝 Contributing

We welcome contributions! Areas for enhancement:
- New visual effects
- Additional voice command patterns
- Performance optimizations
- Mobile device support
- MIDI controller integration

## 📜 License

MIT License - Build amazing things!

## 🎭 Credits

Created with passion for interactive art and the magic of voice-controlled creativity.

*"Any sufficiently advanced wall art is indistinguishable from magic."* ✨

---

*Tips hat* 🎩 Ready to make your walls come alive?