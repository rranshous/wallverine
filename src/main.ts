import { SceneManager } from './SceneManager';
import { VoiceController } from './VoiceController';
import { 
  particleScene, spiralScene, waveScene, rainbowScene, clearScene, setAnimationSpeed,
  rainbowWaveScene, particleSpiralScene, spiralWaveScene, rainbowParticleScene
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
        case '1': this.handleVoiceCommand('particles'); break;
        case '2': this.handleVoiceCommand('spiral'); break;
        case '3': this.handleVoiceCommand('waves'); break;
        case '4': this.handleVoiceCommand('rainbow'); break;
        case '5': this.handleVoiceCommand('rainbow waves'); break;
        case '6': this.handleVoiceCommand('particle spiral'); break;
        case '7': this.handleVoiceCommand('spiral waves'); break;
        case '8': this.handleVoiceCommand('rainbow particles'); break;
        case 'c': this.handleVoiceCommand('clear'); break;
        case '+': this.handleVoiceCommand('faster'); break;
        case '-': this.handleVoiceCommand('slower'); break;
      }
    });
  }

  private handleVoiceCommand(command: string) {
    console.log('🎯 Processing command:', command);
    
    // Check for combined scene commands first!
    if (command.includes('rainbow') && command.includes('wave')) {
      this.sceneManager.setScene(rainbowWaveScene);
      console.log('🌈🌊 Rainbow waves combined!');
      return;
    } else if (command.includes('particle') && command.includes('spiral')) {
      this.sceneManager.setScene(particleSpiralScene);
      console.log('🎆🌀 Particle spiral fusion!');
      return;
    } else if (command.includes('spiral') && command.includes('wave')) {
      this.sceneManager.setScene(spiralWaveScene);
      console.log('🌀🌊 Spiral wave dance!');
      return;
    } else if (command.includes('rainbow') && command.includes('particle')) {
      this.sceneManager.setScene(rainbowParticleScene);
      console.log('🌈🎆 Rainbow particle explosion!');
      return;
    }
    
    // Single scene commands
    if (command.includes('particle')) {
      this.sceneManager.setScene(particleScene);
    } else if (command.includes('spiral')) {
      this.sceneManager.setScene(spiralScene);
    } else if (command.includes('wave')) {
      this.sceneManager.setScene(waveScene);
    } else if (command.includes('rainbow')) {
      this.sceneManager.setScene(rainbowScene);
    } else if (command.includes('clear') || command.includes('reset')) {
      this.sceneManager.setScene(clearScene);
    }
    
    // Speed control commands
    else if (command.includes('faster') || command.includes('speed up')) {
      setAnimationSpeed(4); // Much more dramatic!
      console.log('🚀 SPEED BOOST!');
    } else if (command.includes('slower') || command.includes('slow down')) {
      setAnimationSpeed(0.2); // Really slow it down
      console.log('🐌 Slowing to a crawl...');
    } else if (command.includes('normal speed')) {
      setAnimationSpeed(1);
      console.log('⚡ Normal speed restored');
    }
    
    // Fun easter eggs
    else if (command.includes('hello') || command.includes('hi')) {
      this.sceneManager.setScene(rainbowScene);
      console.log('👋 Hello there!');
    } else if (command.includes('awesome') || command.includes('cool')) {
      this.sceneManager.setScene(particleScene);
      console.log('✨ Why thank you!');
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
