import { SceneManager } from './SceneManager';
import { VoiceController } from './VoiceController';
import { 
  particleScene, spiralScene, waveScene, rainbowScene, clearScene, setAnimationSpeed,
  starsScene, lightningScene, geometryScene, fireScene,
  createDynamicCombination, parseEffectsFromCommand, parseLayerCommand
} from './scenes';

class WallverineApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sceneManager: SceneManager;
  private voiceController: VoiceController;
  private isRunning = false;
  private isFullscreen = false;
  private hudVisible = true;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    this.setupCanvas();
    this.setupFullscreenEvents();
    this.sceneManager = new SceneManager(this.ctx, this.canvas);
    
    const statusElement = document.getElementById('voiceStatus')!;
    this.voiceController = new VoiceController(statusElement, this.handleVoiceCommand.bind(this));
    
    this.setupEventListeners();
    this.start();
  }

  private setupCanvas() {
    const resizeCanvas = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  private setupEventListeners() {
    // Click anywhere to start/restart voice control
    document.addEventListener('click', () => {
      this.voiceController.start();
    });
  }

  private handleVoiceCommand(command: string) {
    console.log('🎯 Processing command:', command);
    
    // Speed control commands (handle first)
    if (command.includes('faster') || command.includes('speed up')) {
      setAnimationSpeed(4);
      console.log('🚀 SPEED BOOST!');
      return;
    } else if (command.includes('slower') || command.includes('slow down')) {
      setAnimationSpeed(0.2);
      console.log('🐌 Slowing to a crawl...');
      return;
    } else if (command.includes('normal speed')) {
      setAnimationSpeed(1);
      console.log('⚡ Normal speed restored');
      return;
    }
    
    // Clear command
    if (command.includes('clear') || command.includes('reset')) {
      this.sceneManager.setScene(clearScene);
      this.showLayerStatus(); // Update UI
      return;
    }
    
    // Fullscreen commands
    if (command.includes('fullscreen') || command.includes('full screen')) {
      this.toggleFullscreen();
      return;
    }
    
    // Projection mode - fullscreen AND hide HUD for pure visuals
    if (command.includes('projection mode') || command.includes('projection only')) {
      // Enter fullscreen first
      if (!this.isFullscreen) {
        this.toggleFullscreen();
      }
      // Hide HUD for pure projection
      if (this.hudVisible) {
        this.toggleHUD();
      }
      console.log('🎭 PROJECTION MODE: Fullscreen + HUD hidden');
      return;
    }
    
    // HUD control commands
    if (command.includes('hide hud') || command.includes('hide interface')) {
      if (this.hudVisible) this.toggleHUD();
      return;
    } else if (command.includes('show hud') || command.includes('show interface') || command.includes('show controls')) {
      if (!this.hudVisible) this.toggleHUD();
      return;
    } else if (command.includes('toggle hud') || command.includes('toggle interface')) {
      this.toggleHUD();
      return;
    }
    
    // Exit projection mode - restore HUD and exit fullscreen
    if (command.includes('exit projection') || command.includes('normal mode') || command.includes('windowed mode')) {
      // Show HUD first
      if (!this.hudVisible) {
        this.toggleHUD();
      }
      // Exit fullscreen
      if (this.isFullscreen) {
        this.toggleFullscreen();
      }
      console.log('🖥️ NORMAL MODE: HUD restored + windowed');
      return;
    }
    
    // NEW: Check for layered commands first!
    const layerInfo = parseLayerCommand(command);
    if (layerInfo.layer) {
      this.handleLayeredCommand(layerInfo);
      return;
    }
    
    // Parse effects from the command for regular scene setting
    const effects = parseEffectsFromCommand(command);
    
    if (effects.length === 0) {
      // Check for very specific single-word commands to avoid false triggers
      const cleanCommand = command.toLowerCase().trim();
      
      // Exact matches only to prevent accidental triggers
      if (cleanCommand === 'particles' || cleanCommand === 'particle') {
        this.sceneManager.setScene(particleScene);
        this.showLayerStatus();
      } else if (cleanCommand === 'spiral' || cleanCommand === 'spirals') {
        this.sceneManager.setScene(spiralScene);
        this.showLayerStatus();
      } else if (cleanCommand === 'waves' || cleanCommand === 'wave') {
        this.sceneManager.setScene(waveScene);
        this.showLayerStatus();
      } else if (cleanCommand === 'rainbow' || cleanCommand === 'rainbows') {
        this.sceneManager.setScene(rainbowScene);
        this.showLayerStatus();
      } else if (cleanCommand === 'stars' || cleanCommand === 'star') {
        this.sceneManager.setScene(starsScene);
        this.showLayerStatus();
      } else if (cleanCommand === 'lightning' || cleanCommand === 'bolt') {
        this.sceneManager.setScene(lightningScene);
        this.showLayerStatus();
      } else if (cleanCommand === 'geometry' || cleanCommand === 'shapes') {
        this.sceneManager.setScene(geometryScene);
        this.showLayerStatus();
      } else if (cleanCommand === 'fire' || cleanCommand === 'flames') {
        this.sceneManager.setScene(fireScene);
        this.showLayerStatus();
      }
      // Fun easter eggs (also exact matches)
      else if (cleanCommand === 'hello' || cleanCommand === 'hi') {
        this.sceneManager.setScene(rainbowScene);
        this.showLayerStatus();
        console.log('👋 Hello there!');
      } else if (cleanCommand === 'awesome' || cleanCommand === 'cool') {
        this.sceneManager.setScene(particleScene);
        this.showLayerStatus();
        console.log('✨ Why thank you!');
      } else {
        // FIXED: Unknown command - just log helpful info, don't change anything!
        console.log(`🤔 Didn't recognize: "${command}"`);
        console.log('💡 Try: "particles", "waves", "rainbow", "stars", "lightning", "geometry", "fire"');
        console.log('🎭 Layer commands: "set background to stars", "add particles to foreground"');
        console.log('🌟 Combos: "rainbow fire lightning", "particles and waves"');
        console.log('⚡ Controls: "faster", "slower", "normal speed", "clear"');
        // No scene change - preserve current state!
      }
    } else if (effects.length === 1) {
      // Single effect - use the individual scenes for better performance
      const effectMap: {[key: string]: any} = {
        'particle': particleScene,
        'spiral': spiralScene,
        'wave': waveScene,
        'rainbow': rainbowScene,
        'star': starsScene,
        'lightning': lightningScene,
        'geometry': geometryScene,
        'fire': fireScene
      };
      
      const scene = effectMap[effects[0]];
      if (scene) {
        this.sceneManager.setScene(scene);
        console.log(`✨ ${effects[0]} effect activated!`);
        this.showLayerStatus(); // Update UI
      }
    } else {
      // Multiple effects - create dynamic combination!
      const combinedScene = createDynamicCombination(effects);
      this.sceneManager.setScene(combinedScene);
      console.log(`🌟 EPIC COMBO: ${effects.join(' + ')}!`);
      this.showLayerStatus(); // Update UI
    }
  }

  // ENHANCED: Handle layered scene commands with better feedback
  private handleLayeredCommand(layerInfo: {
    layer?: 'background' | 'middle' | 'foreground';
    effects: string[];
    action: 'set' | 'add' | 'clear';
  }) {
    if (!layerInfo.layer) return;
    
    const effectMap: {[key: string]: any} = {
      'particle': particleScene,
      'spiral': spiralScene,
      'wave': waveScene,
      'rainbow': rainbowScene,
      'star': starsScene,
      'lightning': lightningScene,
      'geometry': geometryScene,
      'fire': fireScene
    };
    
    if (layerInfo.action === 'clear') {
      this.sceneManager.updateLayer(layerInfo.layer, null);
      console.log(`🧹 Cleared ${layerInfo.layer} layer`);
      this.showLayerStatus();
      return;
    }
    
    if (layerInfo.effects.length === 0) {
      console.log(`🤔 What effect do you want in the ${layerInfo.layer}?`);
      console.log('💡 Try: "set background to stars" or "add fire to foreground"');
      return;
    }
    
    let scene;
    if (layerInfo.effects.length === 1) {
      scene = effectMap[layerInfo.effects[0]];
    } else {
      scene = createDynamicCombination(layerInfo.effects);
    }
    
    if (scene) {
      this.sceneManager.updateLayer(layerInfo.layer, scene);
      const effectNames = layerInfo.effects.join(' + ');
      const actionText = layerInfo.action === 'add' ? 'Added to' : 'Set';
      console.log(`🎭 ${actionText} ${layerInfo.layer}: ${effectNames}`);
      
      this.showLayerStatus();
    }
  }

  // ENHANCED: Always show status, highlight when in layered mode
  private showLayerStatus() {
    const layerStatusDiv = document.getElementById('layerStatus')!;
    const backgroundDiv = document.getElementById('backgroundLayer')!;
    const middleDiv = document.getElementById('middleLayer')!;
    const foregroundDiv = document.getElementById('foregroundLayer')!;
    
    if (this.sceneManager.isInLayeredMode()) {
      layerStatusDiv.classList.add('layer-mode');
      console.log(`🎪 Layer Status: ${this.sceneManager.getCurrentSceneName()}`);
      
      // Parse current scene name to extract layer info
      const sceneName = this.sceneManager.getCurrentSceneName();
      const layers = sceneName.split(' | ');
      
      // Reset all layers
      backgroundDiv.innerHTML = 'Background: <em>none</em>';
      middleDiv.innerHTML = 'Middle: <em>none</em>';
      foregroundDiv.innerHTML = 'Foreground: <em>none</em>';
      
      // Update with current layers
      layers.forEach(layer => {
        if (layer.startsWith('bg:')) {
          backgroundDiv.innerHTML = `Background: <strong>${layer.substring(3)}</strong>`;
        } else if (layer.startsWith('mid:')) {
          middleDiv.innerHTML = `Middle: <strong>${layer.substring(4)}</strong>`;
        } else if (layer.startsWith('fg:')) {
          foregroundDiv.innerHTML = `Foreground: <strong>${layer.substring(3)}</strong>`;
        }
      });
    } else {
      // Single scene mode - show current scene
      layerStatusDiv.classList.remove('layer-mode');
      const currentScene = this.sceneManager.getCurrentSceneName();
      
      backgroundDiv.innerHTML = 'Background: <em>none</em>';
      middleDiv.innerHTML = `Current Scene: <strong>${currentScene}</strong>`;
      foregroundDiv.innerHTML = 'Foreground: <em>none</em>';
    }
  }

  private start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    // Start with a welcoming particle scene
    this.sceneManager.setScene(particleScene, false);
    
    // Initialize the status display
    this.showLayerStatus();
    
    const animate = (time: number) => {
      if (!this.isRunning) return;
      
      this.sceneManager.update(time);
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    console.log('🎩 Wallverine started! Say "particles", "spiral", "waves", or "rainbow"');
  }

  stop() {
    this.isRunning = false;
    this.voiceController.stop();
  }

  // PROJECTION FEATURES: Fullscreen and HUD controls
  private toggleFullscreen() {
    // Check actual fullscreen state from browser
    const isCurrentlyFullscreen = !!(document.fullscreenElement || 
                                     (document as any).webkitFullscreenElement || 
                                     (document as any).msFullscreenElement);
    
    if (!isCurrentlyFullscreen) {
      // Enter fullscreen
      console.log('🎬 Entering fullscreen...');
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        (document.documentElement as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      console.log('🖥️ Exiting fullscreen...');
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }

  private setupFullscreenEvents() {
    // Listen for fullscreen change events
    const fullscreenEvents = ['fullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'];
    fullscreenEvents.forEach(event => {
      document.addEventListener(event, () => {
        this.isFullscreen = !!(document.fullscreenElement || 
                               (document as any).webkitFullscreenElement || 
                               (document as any).msFullscreenElement);
        console.log(this.isFullscreen ? '📺 Entered fullscreen mode' : '🖥️ Exited fullscreen mode');
      });
    });
  }

  private toggleHUD() {
    const controls = document.getElementById('controls')!;
    const layerStatus = document.getElementById('layerStatus')!;
    
    this.hudVisible = !this.hudVisible;
    
    if (this.hudVisible) {
      controls.style.display = 'block';
      layerStatus.style.display = 'block';
      console.log('📋 HUD visible');
    } else {
      controls.style.display = 'none';
      layerStatus.style.display = 'none';
      console.log('🎭 HUD hidden - projection mode');
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WallverineApp();
});
