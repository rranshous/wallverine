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

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    this.setupCanvas();
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

    // Keyboard shortcuts for testing
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        // Basic effects
        case '1': this.handleVoiceCommand('particles'); break;
        case '2': this.handleVoiceCommand('spiral'); break;
        case '3': this.handleVoiceCommand('waves'); break;
        case '4': this.handleVoiceCommand('rainbow'); break;
        case '5': this.handleVoiceCommand('stars'); break;
        case '6': this.handleVoiceCommand('lightning'); break;
        case '7': this.handleVoiceCommand('geometry'); break;
        case '8': this.handleVoiceCommand('fire'); break;
        
        // Combinations
        case '9': this.handleVoiceCommand('particles and waves'); break;
        case '0': this.handleVoiceCommand('rainbow fire lightning'); break;
        
        // Layer testing (hold Shift for these)
        case 'Q': this.handleVoiceCommand('set background to stars'); break;
        case 'W': this.handleVoiceCommand('add particles to foreground'); break;
        case 'E': this.handleVoiceCommand('put fire in middle'); break;
        case 'R': this.handleVoiceCommand('clear background'); break;
        case 'T': this.handleVoiceCommand('clear foreground'); break;
        case 'Y': this.handleVoiceCommand('clear middle'); break;
        
        // Controls
        case 'c': this.handleVoiceCommand('clear'); break;
        case '+': this.handleVoiceCommand('faster'); break;
        case '-': this.handleVoiceCommand('slower'); break;
        case '=': this.handleVoiceCommand('normal speed'); break;
      }
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
    
    // NEW: Check for layered commands first!
    const layerInfo = parseLayerCommand(command);
    if (layerInfo.layer) {
      this.handleLayeredCommand(layerInfo);
      return;
    }
    
    // Parse effects from the command for regular scene setting
    const effects = parseEffectsFromCommand(command);
    
    if (effects.length === 0) {
      // Try some classic single effects
      if (command.includes('particle')) {
        this.sceneManager.setScene(particleScene);
      } else if (command.includes('spiral')) {
        this.sceneManager.setScene(spiralScene);
      } else if (command.includes('wave')) {
        this.sceneManager.setScene(waveScene);
      } else if (command.includes('rainbow')) {
        this.sceneManager.setScene(rainbowScene);
      } else if (command.includes('star')) {
        this.sceneManager.setScene(starsScene);
      } else if (command.includes('lightning')) {
        this.sceneManager.setScene(lightningScene);
      } else if (command.includes('geometry')) {
        this.sceneManager.setScene(geometryScene);
      } else if (command.includes('fire')) {
        this.sceneManager.setScene(fireScene);
      }
      // Fun easter eggs
      else if (command.includes('hello') || command.includes('hi')) {
        this.sceneManager.setScene(rainbowScene);
        console.log('👋 Hello there!');
      } else if (command.includes('awesome') || command.includes('cool')) {
        this.sceneManager.setScene(particleScene);
        console.log('✨ Why thank you!');
      } else {
        console.log('🤔 Try saying effects like "particles", "waves", "rainbow", "stars", "lightning", "geometry", or "fire"');
        console.log('🎭 Layer commands: "set background to stars", "add particles to foreground", "clear background"');
        console.log('🌟 Combos: "rainbow fire lightning", "particles and waves", "stars geometry spiral"');
        console.log('⚡ Controls: "faster", "slower", "normal speed", "clear"');
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

  // ENHANCED: Show current layer composition in UI
  private showLayerStatus() {
    const layerStatusDiv = document.getElementById('layerStatus')!;
    const backgroundDiv = document.getElementById('backgroundLayer')!;
    const middleDiv = document.getElementById('middleLayer')!;
    const foregroundDiv = document.getElementById('foregroundLayer')!;
    
    if (this.sceneManager.isInLayeredMode()) {
      layerStatusDiv.classList.add('layer-active');
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
      layerStatusDiv.classList.remove('layer-active');
    }
  }

  private start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    // Start with a welcoming particle scene
    this.sceneManager.setScene(particleScene, false);
    
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WallverineApp();
});
