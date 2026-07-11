"use client";
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useImageSequence from '../hooks/useImageSequence';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  sequencePath?: string; // e.g., /sequence
  framePrefix?: string; // e.g., frame_
  frameCount?: number; // optional hint
}

export default function ScrollSequence({ sequencePath = '/sequence', framePrefix = 'frame_', frameCount = 300 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [totalFrames, setTotalFrames] = useState<number>(frameCount);

  const { loadInitial, loadFrame, ready, total } = useImageSequence({
    path: sequencePath,
    prefix: framePrefix,
    hintCount: frameCount,
    onProgress: (p) => setLoadedPercent(p)
  });

  useEffect(() => {
    setTotalFrames(total);
  }, [total]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    let rafId: number | null = null;
    let currentFrame = 0;
    let targetFrame = 0;

    function drawFrame(index: number) {
      const img = loadFrame(index);
      if (!img) return;
      ctx.clearRect(0, 0, width, height);
      // fit cover
      const iw = img.width;
      const ih = img.height;
      const scale = Math.max(width / iw, height / ih);
      const iwScaled = iw * scale;
      const ihScaled = ih * scale;
      const x = (width - iwScaled) / 2;
      const y = (height - ihScaled) / 2;
      ctx.drawImage(img, x, y, iwScaled, ihScaled);
    }

    function rafLoop() {
      // lerp for smooth interpolation
      currentFrame += (targetFrame - currentFrame) * 0.12;
      const idx = Math.round(currentFrame);
      drawFrame(idx);
      rafId = requestAnimationFrame(rafLoop);
    }

    // Setup GSAP ScrollTrigger pinning
    let st: ScrollTrigger | null = null;

    const initScroll = () => {
      if (totalFrames <= 0) return;
      const dur = totalFrames * 3; // height of scroll area
      st = ScrollTrigger.create({
        trigger: containerRef.current!,
        start: 'top top',
        end: `+=${dur}`,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress; // 0..1
          targetFrame = Math.min(Math.max(0, Math.floor(progress * (totalFrames - 1))), totalFrames - 1);
        }
      });
    };

    // start render loop
    rafLoop();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      if (st) st.kill();
    };
  }, [loadFrame, total]);

  useEffect(() => {
    // Start loading initial frames
    loadInitial().then(() => {
      setIsReady(true);
      setTimeout(() => {
        // small delay to ensure images cached
        try { window.dispatchEvent(new Event('siteSequenceReady')); } catch (e) {}
      }, 50);
    });
  }, [loadInitial]);

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {!isReady && (
        <div className="preloader">
          <div className="preloader-inner">
            <div className="preloader-bar" style={{ width: `${loadedPercent}%` }} />
            <div className="preloader-text">Loading {Math.round(loadedPercent)}%</div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: isReady ? 'block' : 'none' }} />
    </div>
  );
}
