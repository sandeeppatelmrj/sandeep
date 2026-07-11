"use client";
import { useCallback, useRef, useState } from 'react';

interface Options {
  path: string; // /sequence
  prefix?: string; // frame_
  hintCount?: number;
  onProgress?: (p: number) => void;
}

export default function useImageSequence({ path, prefix = 'frame_', hintCount = 300, onProgress }: Options) {
  const cache = useRef<Map<number, HTMLImageElement>>(new Map());
  const totalRef = useRef<number>(hintCount);
  const loadingRef = useRef<number>(0);
  const aborted = useRef(false);

  const pad = (n: number, width = 4) => n.toString().padStart(width, '0');

  // Try to load a single frame synchronously (from cache if available)
  const loadFrame = useCallback((index: number): HTMLImageElement | null => {
    if (cache.current.has(index)) return cache.current.get(index)!;
    const img = new Image();
    img.src = `${path}/${prefix}${pad(index + 1)}.png`;
    img.onload = () => {
      cache.current.set(index, img);
    };
    img.onerror = () => {
      // mark as missing; if near end reduce total
      if (index + 1 > totalRef.current && totalRef.current === hintCount) {
        totalRef.current = index; // heuristically reduce
      }
    };
    return null;
  }, [path, prefix, hintCount]);

  // Preload initial subset plus first frame
  const loadInitial = useCallback(async () => {
    aborted.current = false;
    // Load first frame
    const first = new Image();
    first.src = `${path}/${prefix}${pad(1)}.png`;
    await new Promise((res) => { first.onload = res; first.onerror = res; });
    cache.current.set(0, first);
    loadingRef.current = 1;
    if (onProgress) onProgress((loadingRef.current / totalRef.current) * 100);

    // Greedy detection loop (but bounded)
    const maxTry = Math.max(1000, hintCount + 50);
    let detected = hintCount;
    for (let i = 2; i <= maxTry && !aborted.current; i++) {
      // attempt load but await only occasionally to avoid blocking
      const img = new Image();
      img.src = `${path}/${prefix}${pad(i)}.png`;
      await new Promise((res) => { img.onload = res; img.onerror = res; });
      if (img.complete && img.naturalWidth > 0) {
        cache.current.set(i - 1, img);
        loadingRef.current++;
        detected = i;
        if (onProgress) onProgress((loadingRef.current / detected) * 100);
        // continue; we'll try to detect until we hit consecutive misses
      } else {
        // first miss -> assume end
        detected = i - 1;
        break;
      }
    }
    totalRef.current = detected;
    if (onProgress) onProgress(100);
    return true;
  }, [path, prefix, hintCount, onProgress]);

  // Lazy loader to ensure frame available when drawing
  const ensureFrame = useCallback(async (index: number) => {
    if (cache.current.has(index)) return cache.current.get(index)!;
    if (index < 0) index = 0;
    const img = new Image();
    img.src = `${path}/${prefix}${pad(index + 1)}.png`;
    await new Promise((res) => { img.onload = res; img.onerror = res; });
    if (img.complete && img.naturalWidth > 0) {
      cache.current.set(index, img);
      return img;
    }
    return null;
  }, [path, prefix]);

  const getTotal = () => totalRef.current;

  // Expose a function used by canvas to synchronously request cached Image
  const getCached = useCallback((index: number) => {
    return cache.current.get(index) || null;
  }, []);

  return {
    loadInitial,
    ensureFrame,
    loadFrame: getCached,
    ready: false,
    total: getTotal(),
  };
}
