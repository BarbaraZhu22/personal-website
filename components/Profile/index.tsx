"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/hooks/useTheme";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import styles from "./Profile.module.css";

export default function Profile() {
  const { t, language } = useTranslation();
  const { colors, isDark } = useTheme();
  const greetingText = t("welcomeGreeting");
  const { text: displayedGreeting, isComplete } = useTypingEffect(greetingText, {
    speed: language === "zh" ? 80 : 100,
    delay: 300,
  });

  // Placeholder gradient background - replace with actual image path when ready
  const placeholderStyle = {
    background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}40 100%)`,
  };

  return (
    <div className={styles.profile}>
      <div className={styles.content}>
        <div className={styles.imageWrapper} style={placeholderStyle}>
          <div className={styles.catImage}>
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="catGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-foreground)"
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-secondary)"
                    stopOpacity="0.3"
                  />
                </linearGradient>
                
                {/* Cat body gradient */}
                <linearGradient id="catBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity="1" />
                  <stop offset="50%" stopColor="var(--color-secondary)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity="0.9" />
                </linearGradient>
                
                {/* Cat head gradient */}
                <linearGradient id="catHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity="1" />
                  <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity="0.95" />
                </linearGradient>
                
                {/* Ear gradient */}
                <linearGradient id="catEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.7" />
                </linearGradient>
                
                {/* Tail gradient */}
                <linearGradient id="catTailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity="1" />
                  <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity="0.9" />
                </linearGradient>
                
                {/* Eye shine gradient */}
                <radialGradient id="eyeShineGrad" cx="50%" cy="30%">
                  <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity="1" />
                  <stop offset="50%" stopColor="var(--color-secondary)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.6" />
                </radialGradient>
              </defs>
              {/* Background circle */}
              <circle
                className="background"
                cx="100"
                cy="100"
                r="100"
                fill="url(#catGrad)"
              />

              {/* Cat body */}
              <ellipse
                className="body"
                cx="100"
                cy="130"
                rx="50"
                ry="40"
                fill="url(#catBodyGrad)"
                opacity="0.9"
              />

              {/* Cat head */}
              <ellipse
                className="head"
                cx="100"
                cy="80"
                rx="35"
                ry="30"
                fill="url(#catHeadGrad)"
                opacity="0.9"
              />

              {/* Left ear */}
              <path
                className="ear"
                d="M 70 60 L 75 45 L 85 50 Z"
                fill="url(#catEarGrad)"
                opacity="0.9"
              />
              <path
                className="ear-inner"
                d="M 78 55 L 76 47 L 83 52 Z"
                fill="var(--color-primary)"
                opacity="0.7"
              />

              {/* Right ear */}
              <path
                className="ear"
                d="M 130 60 L 125 45 L 115 50 Z"
                fill="url(#catEarGrad)"
                opacity="0.9"
              />
              <path
                className="ear-inner"
                d="M 122 55 L 124 47 L 117 52 Z"
                fill="var(--color-primary)"
                opacity="0.7"
              />

              {/* Eyes */}
              <ellipse
                className="eye"
                cx="85"
                cy="75"
                rx="5"
                ry="5"
                fill="url(#eyeShineGrad)"
                opacity="0.9"
              />
              <ellipse
                className="eye"
                cx="115"
                cy="75"
                rx="5"
                ry="5"
                fill="url(#eyeShineGrad)"
                opacity="0.9"
              />
              {/* Eye highlights */}
              <ellipse cx="86" cy="74" rx="1.5" ry="1.5" fill="white" opacity="0.8" />
              <ellipse cx="116" cy="74" rx="1.5" ry="1.5" fill="white" opacity="0.8" />

              {/* Nose */}
              <path
                className="nose"
                d="M 98 85 L 102 85 L 100 88 Z"
                opacity="0.7"
              />

              {/* Mouth */}
              <path
                className="mouth"
                d="M 100 88 Q 95 92 90 90"
                stroke="var(--color-secondary)"
                strokeWidth="2"
                fill="none"
                opacity="0.8"
              />
              <path
                className="mouth"
                d="M 100 88 Q 105 92 110 90"
                stroke="var(--color-secondary)"
                strokeWidth="2"
                fill="none"
                opacity="0.8"
              />

              {/* Tail - animated */}
              <g className={styles.tail}>
                <path
                  className="tail"
                  d="M 150 120 Q 160 110 170 120 Q 165 130 155 125 Q 145 120 150 120"
                  fill="url(#catTailGrad)"
                  opacity="0.9"
                />
                <path
                  className="tail-accent"
                  d="M 155 122 Q 165 115 170 120 Q 166 127 158 124"
                  fill="var(--color-primary)"
                  opacity="0.6"
                />
              </g>

              {/* Paws */}
              <ellipse
                className="paw"
                cx="80"
                cy="160"
                rx="8"
                ry="12"
                fill="url(#catBodyGrad)"
                opacity="0.8"
              />
              <ellipse
                className="paw"
                cx="120"
                cy="160"
                rx="8"
                ry="12"
                fill="url(#catBodyGrad)"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>
        <h1
          className={`${styles.greeting} typing-effect ${
            isComplete ? "typing-complete" : ""
          } ${language === "zh" ? styles.chinese : ""}`}
          style={{
            textShadow: isDark
              ? `0 2px 20px ${colors.primary} 40`
              : `0 2px 10px ${colors.primary} 20`,
          }}
        >
          {displayedGreeting}
        </h1>
      </div>
    </div>
  );
}
