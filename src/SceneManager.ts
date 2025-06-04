export interface Scene {
  name: string;
  animate: (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => void;
  onEnter?: () => void;
  onExit?: () => void;
}

export class SceneManager {
  private currentScene: Scene | null = null;
  private transitionProgress = 0;
  private isTransitioning = false;
  private nextScene: Scene | null = null;
  private transitionDuration = 1000; // ms

  constructor(private ctx: CanvasRenderingContext2D, private canvas: HTMLCanvasElement) {}

  setScene(scene: Scene, withTransition = true) {
    if (withTransition && this.currentScene) {
      this.startTransition(scene);
    } else {
      this.currentScene?.onExit?.();
      this.currentScene = scene;
      this.currentScene.onEnter?.();
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

    if (this.currentScene) {
      this.currentScene.animate(this.ctx, time, this.canvas);
    }

    if (this.isTransitioning) {
      this.ctx.globalAlpha = 1; // Reset alpha for next frame
    }
  }

  getCurrentSceneName(): string {
    return this.currentScene?.name || 'none';
  }
}
