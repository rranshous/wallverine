# 🎩 Wallverine Publishing Guide - itch.io

This guide will help you publish Wallverine to itch.io as a browser-based interactive experience.

## 📋 Pre-Publishing Checklist

- [x] ~~Test all 16 visual effects work via voice commands~~ ✅
- [x] ~~Verify fullscreen functionality (voice + F key)~~ ✅  
- [x] ~~Test projection mode and normal mode~~ ✅
- [x] ~~Confirm voice recognition works in different browsers~~ ✅
- [x] ~~Build production version~~ ✅ `npm run publish` works!
- [ ] Create screenshots/GIFs for the store page
- [ ] Prepare game description and tags (✅ ready to copy-paste below)

## 🏗️ Building for Production

### Option 1: One-Command Publish (Recommended!)
```bash
npm run publish
```
This single command will:
1. Build the production version
2. Create a timestamped ZIP file in `releases/` folder (e.g., `wallverine-web-20250621-194253.zip`)
3. Start a preview server to test the build

### Option 2: Manual Steps
If you prefer to do it step by step:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **The build creates a `dist` folder** with:
   - `index.html` - Main entry point
   - `assets/` - Compiled JS/CSS bundles
   - All necessary files for browser deployment

3. **Create ZIP manually**:
   ```bash
   cd dist
   zip -r ../wallverine-web.zip *
   cd ..
   ```

4. **Test the build locally**:
   ```bash
   npm run preview
   ```

## 📦 Preparing for itch.io

### 1. Build & Package
If you used `npm run publish`, you already have a timestamped ZIP file in the `releases/` folder ready to upload! 🎉

The ZIP files are named with timestamps like: `wallverine-web-20250621-194253.zip`

If you built manually, create the ZIP:
```bash
cd dist
zip -r ../releases/wallverine-web-$(date +%Y%m%d-%H%M%S).zip *
cd ..
```

### 2. Prepare Visual Assets
Create these visual assets:
- **Cover image**: 630x500px (main store image)
- **Screenshots**: 1920x1080px (show different effects)
- **Banner**: 960x540px (optional header)
- **GIF**: Show voice commands in action

## 🎮 itch.io Setup Guide

### 1. Create New Project
1. Go to itch.io and click "Upload new project"
2. Fill in the basic details (see copy-paste content below)

### 2. Upload Settings
- **Kind of project**: HTML
- **Uploads**: Upload your `wallverine-web.zip`
- **This file will be played in the browser**: ✅ Check this
- **Embed options**: 
  - Viewport dimensions: 1200 x 800 (or "Fullscreen button")
  - ✅ Enable fullscreen button
  - ✅ Automatically start on page load

### 3. Pricing & Access
- **Pricing**: Free (recommended for initial release)
- **Visibility**: Public when you're ready

## 📝 Copy-Paste Content for itch.io

### Game Title
```
Wallverine - Voice-Controlled Wall Art
```

### Short Description
```
Transform any wall into a voice-controlled interactive canvas! Say "particles", "matrix", or "rainbow fire lightning" to create mesmerizing visual effects perfect for projections and presentations.
```

### Full Description
```
# 🎩 Wallverine - Voice-Controlled Wall Animation System

Transform any wall into a dynamic, interactive canvas with just your voice! Wallverine is a browser-based art installation that responds to spoken commands, creating mesmerizing visual effects perfect for presentations, parties, or pure visual delight.

## ✨ What Makes It Special

- **Pure Voice Control**: No clicking, no typing - just speak naturally
- **16 Stunning Effects**: From particle explosions to aurora waves
- **Epic Combinations**: Mix any effects - "rainbow fire lightning" or "matrix vortex plasma"
- **Layered Compositions**: Build depth with "set background to stars, add particles to foreground"
- **Projection Ready**: Instant fullscreen + hidden UI for wall projections
- **Works Anywhere**: Runs in any modern browser, no installation needed

## 🎭 Voice Commands

### Visual Effects
**Original Collection:**
- "particles" - colorful explosions
- "spiral" - hypnotic animations
- "waves" - flowing patterns
- "rainbow" - cascading colors
- "stars" - twinkling starfield
- "lightning" - electric bolts
- "geometry" - rotating shapes
- "fire" - rising flames

**New Effects:**
- "matrix" - digital rain
- "vortex" - swirling tornado
- "crystals" - growing gems
- "plasma" - energy fields
- "nebula" - cosmic clouds
- "circuit" - electric pathways
- "meteor" - shooting stars
- "aurora" - dancing lights

### Controls
- "faster" / "slower" - speed control
- "projection mode" - fullscreen + hide UI
- "clear" - reset everything
- **F key** - quick fullscreen toggle

## 🎪 Perfect For

- **Presentations**: Voice-controlled backgrounds while speaking
- **Parties**: Hands-free visual control while DJing
- **Art Installations**: Gallery-ready interactive wall art
- **Smart Homes**: Ambient wall displays that respond to voice
- **Projector Setups**: Turn any wall into dynamic art

## 🚀 How to Use

1. **Click anywhere** to enable voice recognition
2. **Say any effect name** - "particles", "matrix", "aurora"
3. **Try combinations** - "rainbow fire lightning"
4. **Go fullscreen** - say "projection mode" or press F
5. **Layer effects** - "set background to stars, add fire to foreground"

Built with TypeScript, HTML5 Canvas, and Web Speech API. Works best in Chrome/Edge with microphone access.

**Experience the magic of voice-controlled art!** 🎩✨
```

### Tags (choose 8-10)
```
interactive-art
voice-control
visual-effects
projection
browser-game
art-installation
html5
creative-tool
ambient
procedural
```

### Genre
```
Other → Interactive Art/Tool
```

## 🎨 Marketing Tips

### Screenshots to Include
1. **Main interface** - showing the control panel and effects list
2. **Particle effect** - colorful explosion in action
3. **Matrix effect** - digital rain falling
4. **Aurora effect** - beautiful dancing lights
5. **Layered composition** - showing depth with multiple effects
6. **Fullscreen mode** - clean projection view

### Description Highlights
- Emphasize the **voice control** uniqueness
- Mention **projection/presentation** use cases
- Highlight **16 different effects** + combinations
- Show **ease of use** (just click and speak)
- Mention **browser-based** (no download needed)

## 🚀 Post-Launch

### Community Engagement
- Share demo videos on social media
- Post in gamedev/interactive art communities
- Consider adding to exhibitions/art shows
- Gather feedback for new effects

### Potential Updates
- More visual effects
- Different voice command languages
- MIDI controller support
- Mobile device optimization
- Preset combinations

## 🔧 Troubleshooting

### Common Issues
- **Voice not working**: Ensure microphone permissions
- **Effects not loading**: Try refreshing the page
- **Fullscreen issues**: Use F key as backup
- **Performance**: Single effects work better than complex combinations

### Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Edge
- ⚠️ Firefox (limited voice support)
- ❌ Safari (no Web Speech API)

---

🎩 **Ready to make walls come alive with voice?**

Upload, test, and share your interactive art installation with the world!
