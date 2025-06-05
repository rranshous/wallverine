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
  animate: (ctx: CanvasRenderingContext2D, _time: number, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};

// NEW BASE EFFECTS FOR COMBINATIONS!
export const starsScene: Scene = {
  name: 'stars',
  animate: (() => {
    let stars: Array<{x: number, y: number, brightness: number, twinkle: number}> = [];
    
    // Initialize stars
    if (stars.length === 0) {
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          brightness: Math.random(),
          twinkle: Math.random() * Math.PI * 2
        });
      }
    }
    
    return (ctx: CanvasRenderingContext2D, _time: number, _canvas: HTMLCanvasElement) => {
      stars.forEach(star => {
        star.twinkle += 0.05 * animationSpeed;
        const alpha = 0.3 + Math.sin(star.twinkle) * 0.7;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1 + star.brightness, 0, Math.PI * 2);
        ctx.fill();
      });
    };
  })()
};

export const lightningScene: Scene = {
  name: 'lightning',
  animate: (() => {
    let bolts: Array<{points: Array<{x: number, y: number}>, life: number, color: string}> = [];
    let lastBolt = 0;
    
    return (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
      // Spawn lightning bolts randomly
      if (time - lastBolt > 800 / animationSpeed && Math.random() < 0.3) {
        const startX = Math.random() * canvas.width;
        const points = [{x: startX, y: 0}];
        
        // Generate jagged lightning path
        let currentX = startX;
        let currentY = 0;
        while (currentY < canvas.height) {
          currentY += 20 + Math.random() * 40;
          currentX += (Math.random() - 0.5) * 60;
          points.push({x: currentX, y: currentY});
        }
        
        bolts.push({
          points,
          life: 30,
          color: `hsl(${200 + Math.random() * 60}, 100%, 80%)`
        });
        lastBolt = time;
      }
      
      // Draw and update bolts
      bolts = bolts.filter(bolt => {
        bolt.life -= animationSpeed;
        
        if (bolt.life > 0) {
          ctx.strokeStyle = bolt.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          
          bolt.points.forEach((point, i) => {
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x + (Math.random() - 0.5) * 5, point.y);
            }
          });
          ctx.stroke();
          
          return true;
        }
        return false;
      });
    };
  })()
};

export const geometryScene: Scene = {
  name: 'geometry',
  animate: (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 6; i++) {
      const angle = (time * 0.001 * animationSpeed) + (i * Math.PI / 3);
      const size = 50 + Math.sin(time * 0.002 * animationSpeed + i) * 30;
      
      ctx.strokeStyle = `hsl(${(i * 60 + time * 0.1) % 360}, 100%, 60%)`;
      ctx.lineWidth = 2;
      
      // Draw rotating polygons
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      
      ctx.beginPath();
      const sides = 6;
      for (let j = 0; j <= sides; j++) {
        const polyAngle = (j / sides) * Math.PI * 2;
        const x = Math.cos(polyAngle) * size;
        const y = Math.sin(polyAngle) * size;
        
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }
  }
};

export const fireScene: Scene = {
  name: 'fire',
  animate: (() => {
    let flames: Array<{x: number, y: number, vx: number, vy: number, life: number, size: number}> = [];
    
    return (ctx: CanvasRenderingContext2D, _time: number, canvas: HTMLCanvasElement) => {
      // Spawn flames from bottom
      if (Math.random() < 0.4 * animationSpeed) {
        for (let i = 0; i < 3; i++) {
          flames.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: -2 - Math.random() * 3,
            life: 60 + Math.random() * 40,
            size: 5 + Math.random() * 10
          });
        }
      }
      
      // Update and draw flames
      flames = flames.filter(flame => {
        flame.x += flame.vx * animationSpeed;
        flame.y += flame.vy * animationSpeed;
        flame.life -= animationSpeed;
        flame.vy *= 0.98; // Slow down over time
        
        if (flame.life > 0) {
          const alpha = flame.life / 100;
          const heat = 1 - (flame.life / 100);
          const hue = 60 - heat * 60; // From yellow to red
          
          ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(flame.x, flame.y, flame.size, 0, Math.PI * 2);
          ctx.fill();
          
          return true;
        }
        return false;
      });
    };
  })()
};

// NEW EFFECTS - Doubling the collection!

export const matrixScene: Scene = {
  name: 'matrix',
  animate: (() => {
    let drops: Array<{x: number, y: number, speed: number, chars: string[]}> = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    
    // Initialize matrix drops
    if (drops.length === 0) {
      for (let i = 0; i < 50; i++) {
        drops.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight - window.innerHeight,
          speed: 2 + Math.random() * 4,
          chars: Array.from({length: 20}, () => chars[Math.floor(Math.random() * chars.length)])
        });
      }
    }
    
    return (ctx: CanvasRenderingContext2D, _time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '16px monospace';
      
      drops.forEach(drop => {
        drop.y += drop.speed * animationSpeed;
        
        drop.chars.forEach((char, i) => {
          const y = drop.y + i * 20;
          const alpha = Math.max(0, 1 - (i / drop.chars.length));
          ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
          ctx.fillText(char, drop.x, y);
        });
        
        // Reset when off screen
        if (drop.y > canvas.height + drop.chars.length * 20) {
          drop.y = -drop.chars.length * 20;
          drop.x = Math.random() * canvas.width;
          // Occasionally change characters
          if (Math.random() < 0.1) {
            drop.chars = drop.chars.map(() => chars[Math.floor(Math.random() * chars.length)]);
          }
        }
      });
    };
  })()
};

export const vortexScene: Scene = {
  name: 'vortex',
  animate: (() => {
    let particles: Array<{angle: number, radius: number, speed: number, color: string}> = [];
    
    return (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Spawn particles at the edge
      if (Math.random() < 0.3 * animationSpeed) {
        particles.push({
          angle: Math.random() * Math.PI * 2,
          radius: Math.max(canvas.width, canvas.height) * 0.6,
          speed: 2 + Math.random() * 3,
          color: `hsl(${240 + Math.random() * 120}, 100%, ${50 + Math.random() * 30}%)`
        });
      }
      
      // Update and draw particles
      particles = particles.filter(particle => {
        particle.angle += 0.02 * animationSpeed;
        particle.radius -= particle.speed * animationSpeed;
        
        if (particle.radius > 5) {
          const x = centerX + Math.cos(particle.angle) * particle.radius;
          const y = centerY + Math.sin(particle.angle) * particle.radius;
          
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
          
          // Add trailing effect
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          const prevX = centerX + Math.cos(particle.angle - 0.1) * (particle.radius + 5);
          const prevY = centerY + Math.sin(particle.angle - 0.1) * (particle.radius + 5);
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
          
          return true;
        }
        return false;
      });
    };
  })()
};

export const crystalsScene: Scene = {
  name: 'crystals',
  animate: (() => {
    let crystals: Array<{x: number, y: number, size: number, growth: number, color: string, sides: number}> = [];
    
    return (ctx: CanvasRenderingContext2D, _time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Spawn new crystals
      if (Math.random() < 0.05 * animationSpeed && crystals.length < 20) {
        crystals.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 5,
          growth: 0.5 + Math.random() * 1.5,
          color: `hsl(${180 + Math.random() * 60}, 80%, 60%)`,
          sides: 6 + Math.floor(Math.random() * 3)
        });
      }
      
      // Draw and grow crystals
      crystals = crystals.filter(crystal => {
        crystal.size += crystal.growth * animationSpeed;
        
        if (crystal.size < 80) {
          ctx.strokeStyle = crystal.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          // Draw crystal as polygon
          for (let i = 0; i <= crystal.sides; i++) {
            const angle = (i / crystal.sides) * Math.PI * 2;
            const x = crystal.x + Math.cos(angle) * crystal.size;
            const y = crystal.y + Math.sin(angle) * crystal.size;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
          
          // Inner crystal
          ctx.beginPath();
          for (let i = 0; i <= crystal.sides; i++) {
            const angle = (i / crystal.sides) * Math.PI * 2;
            const x = crystal.x + Math.cos(angle) * crystal.size * 0.5;
            const y = crystal.y + Math.sin(angle) * crystal.size * 0.5;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
          
          return true;
        }
        return false;
      });
    };
  })()
};

export const plasmaScene: Scene = {
  name: 'plasma',
  animate: (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    const t = time * 0.001 * animationSpeed;
    
    for (let x = 0; x < canvas.width; x += 2) {
      for (let y = 0; y < canvas.height; y += 2) {
        const plasma = Math.sin(x * 0.02 + t) + 
                      Math.sin(y * 0.02 + t) + 
                      Math.sin((x + y) * 0.02 + t) + 
                      Math.sin(Math.sqrt(x*x + y*y) * 0.02 + t);
        
        const intensity = Math.floor((plasma + 4) * 32);
        const index = (y * canvas.width + x) * 4;
        
        // Create plasma colors
        data[index] = Math.sin(intensity * 0.1) * 127 + 128;     // Red
        data[index + 1] = Math.sin(intensity * 0.1 + 2) * 127 + 128; // Green  
        data[index + 2] = Math.sin(intensity * 0.1 + 4) * 127 + 128; // Blue
        data[index + 3] = 255; // Alpha
        
        // Fill 2x2 block for performance
        if (x + 1 < canvas.width) {
          const rightIndex = (y * canvas.width + x + 1) * 4;
          data[rightIndex] = data[index];
          data[rightIndex + 1] = data[index + 1];
          data[rightIndex + 2] = data[index + 2];
          data[rightIndex + 3] = 255;
        }
        if (y + 1 < canvas.height) {
          const bottomIndex = ((y + 1) * canvas.width + x) * 4;
          data[bottomIndex] = data[index];
          data[bottomIndex + 1] = data[index + 1];
          data[bottomIndex + 2] = data[index + 2];
          data[bottomIndex + 3] = 255;
          
          if (x + 1 < canvas.width) {
            const diagIndex = ((y + 1) * canvas.width + x + 1) * 4;
            data[diagIndex] = data[index];
            data[diagIndex + 1] = data[index + 1];
            data[diagIndex + 2] = data[index + 2];
            data[diagIndex + 3] = 255;
          }
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
};

export const nebulaScene: Scene = {
  name: 'nebula',
  animate: (() => {
    let clouds: Array<{x: number, y: number, radius: number, color: string, drift: {x: number, y: number}}> = [];
    
    return (ctx: CanvasRenderingContext2D, _time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Spawn nebula clouds
      if (Math.random() < 0.02 * animationSpeed && clouds.length < 15) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 50 + Math.random() * 100,
          color: `hsl(${Math.random() * 60 + 250}, 60%, 40%)`, // Purple to blue
          drift: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
          }
        });
      }
      
      // Draw nebula clouds with gradients
      clouds.forEach(cloud => {
        cloud.x += cloud.drift.x * animationSpeed;
        cloud.y += cloud.drift.y * animationSpeed;
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, cloud.radius
        );
        gradient.addColorStop(0, cloud.color.replace('40%', '30%'));
        gradient.addColorStop(0.5, cloud.color.replace('40%', '15%'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Wrap around screen
        if (cloud.x < -cloud.radius) cloud.x = canvas.width + cloud.radius;
        if (cloud.x > canvas.width + cloud.radius) cloud.x = -cloud.radius;
        if (cloud.y < -cloud.radius) cloud.y = canvas.height + cloud.radius;
        if (cloud.y > canvas.height + cloud.radius) cloud.y = -cloud.radius;
      });
    };
  })()
};

export const circuitScene: Scene = {
  name: 'circuit',
  animate: (() => {
    let circuits: Array<{
      startX: number, startY: number, endX: number, endY: number,
      progress: number, speed: number, color: string
    }> = [];
    let nodes: Array<{x: number, y: number, pulse: number}> = [];
    
    // Initialize circuit nodes
    if (nodes.length === 0) {
      for (let i = 0; i < 20; i++) {
        nodes.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }
    
    return (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Spawn new circuits
      if (Math.random() < 0.1 * animationSpeed) {
        const start = nodes[Math.floor(Math.random() * nodes.length)];
        const end = nodes[Math.floor(Math.random() * nodes.length)];
        
        if (start !== end) {
          circuits.push({
            startX: start.x,
            startY: start.y,
            endX: end.x,
            endY: end.y,
            progress: 0,
            speed: 0.02 + Math.random() * 0.03,
            color: `hsl(${180 + Math.random() * 60}, 100%, 60%)`
          });
        }
      }
      
      // Draw circuit nodes
      nodes.forEach(node => {
        node.pulse += 0.1 * animationSpeed;
        const intensity = Math.sin(node.pulse) * 0.5 + 0.5;
        
        ctx.fillStyle = `rgba(0, 255, 255, ${intensity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw and animate circuits
      circuits = circuits.filter(circuit => {
        circuit.progress += circuit.speed * animationSpeed;
        
        if (circuit.progress <= 1) {
          const currentX = circuit.startX + (circuit.endX - circuit.startX) * circuit.progress;
          const currentY = circuit.startY + (circuit.endY - circuit.startY) * circuit.progress;
          
          ctx.strokeStyle = circuit.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(circuit.startX, circuit.startY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
          
          // Electric effect at the moving end
          ctx.fillStyle = circuit.color;
          ctx.beginPath();
          ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
          ctx.fill();
          
          return true;
        }
        return false;
      });
    };
  })()
};

export const meteorScene: Scene = {
  name: 'meteor',
  animate: (() => {
    let meteors: Array<{
      x: number, y: number, vx: number, vy: number,
      trail: Array<{x: number, y: number}>, color: string, size: number
    }> = [];
    
    return (ctx: CanvasRenderingContext2D, _time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Spawn meteors
      if (Math.random() < 0.05 * animationSpeed) {
        meteors.push({
          x: Math.random() * canvas.width,
          y: -50,
          vx: (Math.random() - 0.5) * 4,
          vy: 3 + Math.random() * 5,
          trail: [],
          color: `hsl(${Math.random() * 60 + 20}, 100%, 70%)`, // Orange to yellow
          size: 2 + Math.random() * 4
        });
      }
      
      // Update and draw meteors
      meteors = meteors.filter(meteor => {
        // Update position
        meteor.x += meteor.vx * animationSpeed;
        meteor.y += meteor.vy * animationSpeed;
        
        // Add to trail
        meteor.trail.push({x: meteor.x, y: meteor.y});
        if (meteor.trail.length > 15) {
          meteor.trail.shift();
        }
        
        // Draw trail
        meteor.trail.forEach((point, i) => {
          const alpha = i / meteor.trail.length;
          ctx.fillStyle = meteor.color.replace('70%', `${alpha * 70}%`);
          ctx.beginPath();
          ctx.arc(point.x, point.y, meteor.size * alpha, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw meteor head
        ctx.fillStyle = meteor.color;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright core
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        return meteor.y < canvas.height + 50;
      });
    };
  })()
};

export const auroraScene: Scene = {
  name: 'aurora',
  animate: (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const t = time * 0.001 * animationSpeed;
    
    // Draw multiple aurora layers
    for (let layer = 0; layer < 4; layer++) {
      const hue = 120 + layer * 60 + Math.sin(t + layer) * 30; // Green to purple spectrum
      const amplitude = 50 + layer * 20;
      const frequency = 0.005 + layer * 0.001;
      const yOffset = canvas.height * 0.3 + layer * 30;
      
      // Create gradient for aurora effect
      const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, yOffset + amplitude);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 60%, 0.6)`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      // Draw wavy aurora shape
      let firstPoint = true;
      for (let x = 0; x <= canvas.width; x += 5) {
        const wave1 = Math.sin(x * frequency + t + layer * 0.5) * amplitude;
        const wave2 = Math.sin(x * frequency * 2 + t * 1.2 + layer) * amplitude * 0.3;
        const y1 = yOffset + wave1 + wave2;
        const y2 = yOffset - wave1 - wave2 + amplitude * 2;
        
        if (firstPoint) {
          ctx.moveTo(x, y1);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y1);
        }
      }
      
      // Close the path
      for (let x = canvas.width; x >= 0; x -= 5) {
        const wave1 = Math.sin(x * frequency + t + layer * 0.5) * amplitude;
        const wave2 = Math.sin(x * frequency * 2 + t * 1.2 + layer) * amplitude * 0.3;
        const y2 = yOffset - wave1 - wave2 + amplitude * 2;
        ctx.lineTo(x, y2);
      }
      
      ctx.closePath();
      ctx.fill();
    }
  }
};

// Dynamic scene combiner that blends multiple effects!
export function createDynamicCombination(effectNames: string[]): Scene {
  const effectMap: {[key: string]: Scene} = {
    'particle': particleScene,
    'particles': particleScene,
    'spiral': spiralScene,
    'wave': waveScene,
    'waves': waveScene,
    'rainbow': rainbowScene,
    'star': starsScene,
    'stars': starsScene,
    'lightning': lightningScene,
    'geometry': geometryScene,
    'fire': fireScene
  };
  
  const selectedEffects = effectNames
    .map(name => effectMap[name.toLowerCase()])
    .filter(effect => effect !== undefined);
  
  if (selectedEffects.length === 0) {
    return clearScene;
  }
  
  return {
    name: `combo-${effectNames.join('-')}`,
    animate: (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
      // Semi-transparent background for blending
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Render each effect with additive blending
      ctx.globalCompositeOperation = 'lighter';
      
      selectedEffects.forEach((effect, index) => {
        ctx.save();
        ctx.globalAlpha = 0.8 / selectedEffects.length; // Scale alpha by number of effects
        
        // Create temp canvas for this effect
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d')!;
        
        // Render effect
        effect.animate(tempCtx, time, tempCanvas);
        
        // Draw with slight offset for depth
        const offsetX = Math.sin(time * 0.001 + index) * 10;
        const offsetY = Math.cos(time * 0.001 + index) * 10;
        ctx.drawImage(tempCanvas, offsetX, offsetY);
        
        ctx.restore();
      });
      
      // Reset blend mode
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    },
    onEnter: () => {
      console.log(`🎭 Dynamic combo: ${effectNames.join(' + ')}`);
    }
  };
}

// Command parser that extracts effect names from natural language
export function parseEffectsFromCommand(command: string): string[] {
  const effects: string[] = [];
  const lowerCommand = command.toLowerCase();
  
  // Define effect keywords - EXPANDED with all 16 effects
  const effectKeywords = [
    // Original 8 effects
    ['particle', 'particles'],
    ['spiral', 'spirals'],
    ['wave', 'waves'],
    ['rainbow', 'rainbows'],
    ['star', 'stars'],
    ['lightning', 'bolt', 'electric'],
    ['geometry', 'geometric', 'shapes'],
    ['fire', 'flames', 'burning'],
    // NEW 8 effects
    ['matrix', 'digital', 'code', 'rain'],
    ['vortex', 'swirl', 'whirlpool', 'tornado'],
    ['crystal', 'crystals', 'gem', 'gems'],
    ['plasma', 'energy', 'field'],
    ['nebula', 'cloud', 'space', 'cosmic'],
    ['circuit', 'circuits', 'electric', 'board'],
    ['meteor', 'meteors', 'shooting', 'comet'],
    ['aurora', 'northern', 'lights', 'borealis']
  ];
  
  effectKeywords.forEach(keywords => {
    if (keywords.some(keyword => lowerCommand.includes(keyword))) {
      effects.push(keywords[0]); // Use the primary name
    }
  });
  
  return effects;
}

// ENHANCED: Layer command parser with natural language support
export function parseLayerCommand(command: string): {
  layer?: 'background' | 'middle' | 'foreground';
  effects: string[];
  action: 'set' | 'add' | 'clear';
} {
  const lowerCommand = command.toLowerCase();
  
  // Determine layer with more natural phrases
  let layer: 'background' | 'middle' | 'foreground' | undefined;
  if (lowerCommand.includes('background') || lowerCommand.includes('behind') || 
      lowerCommand.includes('back') || lowerCommand.includes('bg')) {
    layer = 'background';
  } else if (lowerCommand.includes('foreground') || lowerCommand.includes('front') || 
             lowerCommand.includes('top') || lowerCommand.includes('fg') ||
             lowerCommand.includes('over') || lowerCommand.includes('above')) {
    layer = 'foreground';
  } else if (lowerCommand.includes('middle') || lowerCommand.includes('mid') ||
             lowerCommand.includes('center') || lowerCommand.includes('between')) {
    layer = 'middle';
  }
  
  // Determine action with more natural phrases
  let action: 'set' | 'add' | 'clear' = 'set';
  if (lowerCommand.includes('add') || lowerCommand.includes('put') ||
      lowerCommand.includes('place') || lowerCommand.includes('overlay') ||
      lowerCommand.includes('on top') || lowerCommand.includes('layer')) {
    action = 'add';
  } else if (lowerCommand.includes('clear') || lowerCommand.includes('remove') ||
             lowerCommand.includes('delete') || lowerCommand.includes('empty') ||
             lowerCommand.includes('clean')) {
    action = 'clear';
  } else if (lowerCommand.includes('set') || lowerCommand.includes('make') ||
             lowerCommand.includes('change') || lowerCommand.includes('to')) {
    action = 'set';
  }
  
  // Parse effects
  const effects = parseEffectsFromCommand(command);
  
  return { layer, effects, action };
}

// Specialized combined scenes that actually work well together!
export const rainbowWaveScene: Scene = {
  name: 'rainbow-waves',
  animate: (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const waveCount = 5;
    const amplitude = 100;
    
    for (let wave = 0; wave < waveCount; wave++) {
      // Create rainbow-colored waves that shift through the spectrum
      const hue = (wave * 60 + time * 0.1) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.lineWidth = 4;
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

export const particleSpiralScene: Scene = {
  name: 'particle-spiral',
  animate: (() => {
    let particles: Particle[] = [];
    let lastSpawn = 0;
    let spiralAngle = 0;
    
    return (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      spiralAngle += 0.02 * animationSpeed;
      
      // Spawn particles in spiral pattern
      if (time - lastSpawn > 50 / animationSpeed) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < 3; i++) {
          const angle = spiralAngle + (i * Math.PI * 2 / 3);
          const radius = 100;
          const spawnX = centerX + Math.cos(angle) * radius;
          const spawnY = centerY + Math.sin(angle) * radius;
          
          // Particles explode outward from spiral points
          for (let j = 0; j < 3; j++) {
            const particleAngle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            const color = `hsl(${(angle * 50 + time * 0.1) % 360}, 100%, 60%)`;
            
            particles.push(new Particle(
              spawnX,
              spawnY,
              Math.cos(particleAngle) * speed,
              Math.sin(particleAngle) * speed,
              80,
              80,
              color,
              2 + Math.random() * 3
            ));
          }
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

export const spiralWaveScene: Scene = {
  name: 'spiral-waves',
  animate: (() => {
    let spiralAngle = 0;
    
    return (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      spiralAngle += 0.02 * animationSpeed;
      
      // Draw waves that spiral outward
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let ring = 1; ring < 8; ring++) {
        ctx.strokeStyle = `hsl(${(ring * 45 + time * 0.1) % 360}, 100%, 60%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const numPoints = 64;
        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const waveOffset = Math.sin(angle * 4 + spiralAngle + ring * 0.5) * 20;
          const radius = ring * 30 + waveOffset;
          
          const x = centerX + Math.cos(angle + spiralAngle * 0.5) * radius;
          const y = centerY + Math.sin(angle + spiralAngle * 0.5) * radius;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }
    };
  })()
};

export const rainbowParticleScene: Scene = {
  name: 'rainbow-particles',
  animate: (() => {
    let particles: Particle[] = [];
    let lastSpawn = 0;
    
    return (ctx: CanvasRenderingContext2D, time: number, canvas: HTMLCanvasElement) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Spawn rainbow particles in bursts
      if (time - lastSpawn > 80 / animationSpeed) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Create a burst of rainbow particles
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          const hue = (i / 12) * 360; // Perfect rainbow distribution
          
          particles.push(new Particle(
            centerX + Math.random() * 100 - 50,
            centerY + Math.random() * 100 - 50,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            120,
            120,
            `hsl(${hue}, 100%, 60%)`,
            3 + Math.random() * 4
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
