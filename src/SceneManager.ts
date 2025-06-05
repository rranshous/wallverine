export interface Scene {
  name: string;
  animate: (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => void;
  onEnter?: () => void;
  onExit?: () => void;
}

// NEW: Layered scene system for foreground/background control!
export interface LayeredScene {
  background?: Scene;
  middle?: Scene;
  foreground?: Scene;
}

export class SceneManager {
  private currentScene: Scene | null = null;
  private layeredScene: LayeredScene | null = null;
  private isLayeredMode = false;
  private transitionProgress = 0;
  private isTransitioning = false;
  private nextScene: Scene | null = null;
  private transitionDuration = 1000; // ms

  constructor(private ctx: CanvasRenderingContext2D, private canvas: HTMLCanvasElement) {}

  setScene(scene: Scene, withTransition = true) {
    this.isLayeredMode = false;
    this.layeredScene = null;
    
    if (withTransition && this.currentScene) {
      this.startTransition(scene);
    } else {
      this.currentScene?.onExit?.();
      this.currentScene = scene;
      this.currentScene.onEnter?.();
    }
  }

  // NEW: Set a layered scene with background/middle/foreground control
  setLayeredScene(layered: LayeredScene) {
    this.isLayeredMode = true;
    this.currentScene = null;
    
    // Exit previous layers
    if (this.layeredScene) {
      this.layeredScene.background?.onExit?.();
      this.layeredScene.middle?.onExit?.();
      this.layeredScene.foreground?.onExit?.();
    }
    
    this.layeredScene = layered;
    
    // Enter new layers
    this.layeredScene.background?.onEnter?.();
    this.layeredScene.middle?.onEnter?.();
    this.layeredScene.foreground?.onEnter?.();
  }

  // NEW: Update specific layers without affecting others
  updateLayer(layer: 'background' | 'middle' | 'foreground', scene: Scene | null) {
    if (!this.isLayeredMode) {
      // Switch to layered mode if not already
      this.layeredScene = {};
      this.isLayeredMode = true;
      this.currentScene = null;
    }
    
    if (this.layeredScene) {
      // Exit old scene in this layer
      if (layer === 'background' && this.layeredScene.background) {
        this.layeredScene.background.onExit?.();
      } else if (layer === 'middle' && this.layeredScene.middle) {
        this.layeredScene.middle.onExit?.();
      } else if (layer === 'foreground' && this.layeredScene.foreground) {
        this.layeredScene.foreground.onExit?.();
      }
      
      // Set new scene (handle null by removing the layer)
      if (scene === null) {
        delete this.layeredScene[layer];
      } else {
        this.layeredScene[layer] = scene;
        scene.onEnter?.();
      }
    }
  }

  private startTransition(nextScene: Scene) {
    this.nextScene = nextScene;
    this.isTransitioning = true;
    this.transitionProgress = 0;
  }

  update(time: number) {
    if (this.isTransitioning) {
      this.transitionProgress += 16; // roughly 60fps
      const progress = Math.min(this.transitionProgress / this.transitionDuration, 1);
      
      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      if (progress >= 1) {
        // Transition complete
        this.currentScene?.onExit?.();
        this.currentScene = this.nextScene;
        this.currentScene?.onEnter?.();
        this.nextScene = null;
        this.isTransitioning = false;
      } else {
        // During transition, apply fade effect
        this.ctx.globalAlpha = 1 - easeProgress;
      }
    }

    if (this.isLayeredMode && this.layeredScene) {
      // Render layered scene
      this.renderLayeredScene(time);
    } else if (this.currentScene) {
      // Render single scene
      this.currentScene.animate(this.ctx, time, this.canvas);
    }

    if (this.isTransitioning) {
      this.ctx.globalAlpha = 1; // Reset alpha for next frame
    }
  }

  private renderLayeredScene(time: number) {
    if (!this.layeredScene) return;
    
    // Clear canvas with subtle fade for better blending
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render background layer (subtle, sets the mood)
    if (this.layeredScene.background) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.6;
      this.ctx.globalCompositeOperation = 'source-over';
      this.layeredScene.background.animate(this.ctx, time, this.canvas);
      this.ctx.restore();
    }
    
    // Render middle layer with additive blending for energy
    if (this.layeredScene.middle) {
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'lighter';
      this.ctx.globalAlpha = 0.8;
      this.layeredScene.middle.animate(this.ctx, time, this.canvas);
      this.ctx.restore();
    }
    
    // Render foreground layer (most prominent, sharp details)
    if (this.layeredScene.foreground) {
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.globalAlpha = 1.0;
      this.layeredScene.foreground.animate(this.ctx, time, this.canvas);
      this.ctx.restore();
    }
    
    // Reset context
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.globalAlpha = 1;
  }

  getCurrentSceneName(): string {
    if (this.isLayeredMode && this.layeredScene) {
      const layers = [];
      if (this.layeredScene.background) layers.push(`bg:${this.layeredScene.background.name}`);
      if (this.layeredScene.middle) layers.push(`mid:${this.layeredScene.middle.name}`);
      if (this.layeredScene.foreground) layers.push(`fg:${this.layeredScene.foreground.name}`);
      return layers.join(' | ');
    }
    return this.currentScene?.name || 'none';
  }

  isInLayeredMode(): boolean {
    return this.isLayeredMode;
  }
}
