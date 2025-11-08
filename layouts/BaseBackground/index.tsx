"use client";

import React, { useState, useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import styles from "./BaseBackground.module.css";

// Background images array - served from public folder
const backgroundImages = [
  "/images/pic-bg-1.jpg",
  "/images/pic-bg-2.jpg",
  "/images/pic-bg-3.jpg",
  "/images/pic-bg-4.jpg",
  "/images/pic-bg-5.jpg",
];

interface BaseBackgroundProps {
  /** Interval in milliseconds to change background image. Set to 0 to disable auto-cycling */
  cycleInterval?: number;
  /** Whether to randomly select images or cycle sequentially */
  random?: boolean;
}

export default function BaseBackground({
  cycleInterval = 0,
  random = true,
}: BaseBackgroundProps) {
  const colorScheme = useThemeStore((state) => state.colorScheme);

  // Random selection will happen in useEffect on client side only
  const [currentBgImage, setCurrentBgImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDeferred, setIsDeferred] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const w = window as Window & typeof globalThis;

    const schedule = (callback: IdleRequestCallback): number => {
      if (typeof w.requestIdleCallback === "function") {
        return w.requestIdleCallback(callback);
      }

      const start = Date.now();

      return window.setTimeout(() => {
        callback({
          didTimeout: false,
          timeRemaining: () =>
            Math.max(0, 50 - (Date.now() - start)),
        });
      }, 200);
    };

    const cancel = (handle: number) => {
      if (typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };

    const handle = schedule(() => setIsDeferred(true));

    return () => {
      cancel(handle);
    };
  }, []);

  const selectRandomImage = React.useCallback(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentIndex(randomIndex);
    setCurrentBgImage(backgroundImages[randomIndex]);
  }, []);

  const selectImageAtIndex = React.useCallback((index: number) => {
    const normalizedIndex =
      ((index % backgroundImages.length) + backgroundImages.length) %
      backgroundImages.length;
    setCurrentIndex(normalizedIndex);
    setCurrentBgImage(backgroundImages[normalizedIndex]);
  }, []);

  const selectNextSequentialImage = React.useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % backgroundImages.length;
      setCurrentBgImage(backgroundImages[nextIndex]);
      return nextIndex;
    });
  }, []);

  // Change background randomly when theme color changes
  useEffect(() => {
    if (!isDeferred) return;

    if (random) {
      selectRandomImage();
    } else {
      selectImageAtIndex(currentIndex);
    }
  }, [colorScheme, random, isDeferred, selectRandomImage, selectImageAtIndex, currentIndex]);

  // Auto-cycle through images if interval is set
  useEffect(() => {
    if (!isDeferred || cycleInterval <= 0) return;

    const interval = window.setInterval(() => {
      if (random) {
        selectRandomImage();
      } else {
        selectNextSequentialImage();
      }
    }, cycleInterval);

    return () => window.clearInterval(interval);
  }, [cycleInterval, random, isDeferred, selectRandomImage, selectNextSequentialImage]);

  return (
    <div
      className={styles.baseBg}
      style={{
        ...(currentBgImage
          ? { backgroundImage: `url(${currentBgImage})` }
          : {}),
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
