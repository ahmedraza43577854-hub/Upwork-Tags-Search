'use client';

import { useEffect, useRef } from 'react';

type Intensity = 'small' | 'medium' | 'large';

interface ConfettiBurstProps {
  trigger: number;
  intensity?: Intensity;
}

// Richer, slightly jewel-toned palette
const COLORS = [
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF',
  '#FF9F1C', '#00C2A8', '#FF5DA2', '#FFFFFF',
];

const PARTICLE_COUNTS: Record<Intensity, number> = {
  small: 45,
  medium: 90,
  large: 160,
};

type Shape = 'rect' | 'circle' | 'ribbon';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  shape: Shape;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  gravity: number;
  drag: number;
  opacity: number;
  delay: number;
}

export default function ConfettiBurst({ trigger, intensity = 'medium' }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (trigger === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const w = window.innerWidth;
    const h = window.innerHeight;

    const count = PARTICLE_COUNTS[intensity];
    const shapes: Shape[] = ['rect', 'circle', 'ribbon'];

    const particles: Particle[] = Array.from({ length: count }, () => {
      const angle = (Math.random() - 0.5) * Math.PI * 0.9 - Math.PI / 2; // upward cone
      const speed = 9 + Math.random() * 9;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      return {
        x: w / 2 + (Math.random() - 0.5) * 160,
        y: h * 0.4 + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size:
          shape === 'ribbon'
            ? Math.random() * 6 + 10
            : Math.random() * 6 + 5,
        shape,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.08 + Math.random() * 0.08,
        gravity: 0.28 + Math.random() * 0.14,
        drag: 0.985 + Math.random() * 0.01,
        opacity: 1,
        delay: Math.random() * 6,
      };
    });

    let frame = 0;
    const maxFrames = intensity === 'small' ? 90 : intensity === 'medium' ? 110 : 135;
    let animationId = 0;

    function drawParticle(p: Particle) {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      // sine-based flutter: squash horizontally to fake a 3D flip
      const flip = Math.cos(p.wobble);
      ctx.scale(flip, 1);

      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'ribbon') {
        const rw = p.size;
        const rh = p.size / 3.2;
        const r = rh / 2;
        ctx.beginPath();
        ctx.moveTo(-rw / 2 + r, -rh / 2);
        ctx.lineTo(rw / 2 - r, -rh / 2);
        ctx.quadraticCurveTo(rw / 2, -rh / 2, rw / 2, 0);
        ctx.quadraticCurveTo(rw / 2, rh / 2, rw / 2 - r, rh / 2);
        ctx.lineTo(-rw / 2 + r, rh / 2);
        ctx.quadraticCurveTo(-rw / 2, rh / 2, -rw / 2, 0);
        ctx.quadraticCurveTo(-rw / 2, -rh / 2, -rw / 2 + r, -rh / 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 3.5, p.size, p.size / 1.75);
      }

      ctx.restore();
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame += 1;

      particles.forEach((p) => {
        if (frame < p.delay) return;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        if (frame > maxFrames * 0.55) {
          p.opacity = Math.max(0, p.opacity - 0.022);
        }

        drawParticle(p);
      });

      if (frame < maxFrames) {
        animationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animationId = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [trigger, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden="true"
    />
  );
}