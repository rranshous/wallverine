import { Scene } from './SceneManager';

export let animationSpeed = 1;

export function setAnimationSpeed(speed: number) {
  animationSpeed = Math.max(0.1, Math.min(3, speed));
}

// Particle system for various effects
class Particle {
  constructor(
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
    public life: number,
    public maxLife: number,
    public color: string,
    public size: number = 2
  ) {}

  update() {
    this.x += this.vx * animationSpeed;
    this.y += this.vy * animationSpeed;
    this.life -= animationSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  isDead() {
    return this.life <= 0;
  }
}

// Scene implementations
export const particleScene: Scene = {
  name: 'particles',
  animate: (() => {
    let particles: Particle[] = [];
    let lastSpawn = 0;
    
    return (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Spawn new particles
      if (time - lastSpawn > 100 / animationSpeed) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < 5; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
          
          particles.push(new Particle(
            centerX,
            centerY,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            100,
            100,
            color,
            2 + Math.random() * 4
          ));
        }
        lastSpawn = time;
      }
      
      // Update and draw particles
      particles = particles.filter(particle => {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      });
    };
  })()
};

export const spiralScene: Scene = {
  name: 'spiral',
  animate: (() => {
    let angle = 0;
    
    return (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      angle += 0.02 * animationSpeed;
      
      for (let i = 0; i < 8; i++) {
        const spiralAngle = angle + (i * Math.PI / 4);
        const radius = 50 + Math.sin(time * 0.001 * animationSpeed + i) * 100;
        const x = centerX + Math.cos(spiralAngle) * radius;
        const y = centerY + Math.sin(spiralAngle) * radius;
        
        ctx.fillStyle = `hsl(${(spiralAngle * 50 + time * 0.1) % 360}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    };
  })()
};

export const waveScene: Scene = {
  name: 'waves',
  animate: (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const waveCount = 5;
    const amplitude = 100;
    
    for (let wave = 0; wave < waveCount; wave++) {
      ctx.strokeStyle = `hsl(${(wave * 60 + time * 0.1) % 360}, 100%, 60%)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 2) {
        const y = canvas.height / 2 + 
                 Math.sin((x * 0.01 + time * 0.002 * animationSpeed + wave * 0.5)) * amplitude +
                 Math.sin((x * 0.02 + time * 0.003 * animationSpeed + wave * 1.2)) * amplitude * 0.5;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  }
};

export const rainbowScene: Scene = {
  name: 'rainbow',
  animate: (() => {
    let drops: Array<{x: number, y: number, hue: number, speed: number}> = [];
    
    return (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Spawn rainbow drops
      if (Math.random() < 0.3 * animationSpeed) {
        drops.push({
          x: Math.random() * canvas.width,
          y: -10,
          hue: Math.random() * 360,
          speed: 2 + Math.random() * 3
        });
      }
      
      // Update and draw drops
      drops = drops.filter(drop => {
        drop.y += drop.speed * animationSpeed;
        
        ctx.fillStyle = `hsl(${drop.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        return drop.y < canvas.height + 10;
      });
    };
  })()
};

export const clearScene: Scene = {
  name: 'clear',
  animate: (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};
