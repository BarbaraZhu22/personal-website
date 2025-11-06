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
  const [currentBgImage, setCurrentBgImage] = useState<string>(
    backgroundImages[0]
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const selectRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentBgImage(backgroundImages[randomIndex]);
    setCurrentIndex(randomIndex);
  };

  // Change background randomly when theme color changes
  useEffect(() => {
    if (random) {
      selectRandomImage();
    }
  }, [colorScheme, random]);

  // Auto-cycle through images if interval is set
  useEffect(() => {
    if (cycleInterval <= 0) return;

    const interval = setInterval(() => {
      if (random) {
        // Random selection
        const randomIndex = Math.floor(Math.random() * backgroundImages.length);
        setCurrentBgImage(backgroundImages[randomIndex]);
      } else {
        // Sequential cycling
        const nextIndex = (currentIndex + 1) % backgroundImages.length;
        setCurrentIndex(nextIndex);
        setCurrentBgImage(backgroundImages[nextIndex]);
      }
    }, cycleInterval);

    return () => clearInterval(interval);
  }, [cycleInterval, random, currentIndex]);

  return (
    <div
      className={styles.baseBg}
      style={{
        backgroundImage: `url(${currentBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
