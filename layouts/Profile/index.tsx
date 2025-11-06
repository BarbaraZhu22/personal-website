"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/hooks/useTheme";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import styles from "./Profile.module.css";
import { useMemo } from "react";
import Image from "next/image";

export default function Profile() {
  const { t, language } = useTranslation();
  const { colors, isDark } = useTheme();
  const greetingText = t("welcomeGreeting");
  const { text: displayedGreeting, isComplete } = useTypingEffect(
    greetingText,
    {
      speed: language === "zh" ? 80 : 100,
      delay: 300,
    }
  );

  // Profile descriptions for circular text
  const descriptions = useMemo(
    () => [
      t("profileFrontend"),
      t("profileExperience"),
      t("profile3D"),
      t("profileTypeScript"),
    ],
    [t, language]
  );

  // Placeholder gradient background - replace with actual image path when ready
  const placeholderStyle = {
    background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}40 100%)`,
  };

  return (
    <div className={styles.profile}>
      <div className={styles.content}>
        <div className={styles.flipCardContainer}>
          {/* Circular text wrapper */}
          <div className={styles.circularTextWrapper}>
            <svg
              className={styles.circularTextSvg}
              viewBox="0 0 300 300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Larger radius circle to prevent text overlap */}
                <path
                  id="circlePath"
                  d="M 150, 150 m -130, 0 a 130,130 0 1,1 260,0 a 130,130 0 1,1 -260,0"
                />
              </defs>
              {descriptions.map((text, index) => {
                // Calculate offset with proper spacing to prevent overlap
                // Reserve space for each item: (100% / count) - spacing
                const itemCount = descriptions.length;
                const spacingPercent = 3; // 3% spacing between items
                const availableSpace = 100 - spacingPercent * itemCount;
                const itemSpace = availableSpace / itemCount;
                const offset = index * (itemSpace + spacingPercent);
                return (
                  <text
                    key={index}
                    className={styles.circularText}
                    style={{
                      fill: colors.primary,
                      fontSize: "11px",
                      fontWeight: "600",
                    }}
                  >
                    <textPath href="#circlePath" startOffset={`${offset}%`}>
                      {text}
                    </textPath>
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Flip card */}
          <div className={styles.flipCard}>
            <div className={styles.flipCardInner}>
              {/* Front side - Cat SVG */}
              <div className={styles.flipCardFront} style={placeholderStyle}>
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
                          stopColor="var(--color-foreground)"
                          stopOpacity="0.3"
                        />
                      </linearGradient>
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
                      fill="var(--color-foreground)"
                    />

                    {/* Cat head */}
                    <ellipse
                      className="head"
                      cx="100"
                      cy="80"
                      rx="35"
                      ry="30"
                      fill="var(--color-foreground)"
                    />

                    {/* Left ear */}
                    <path
                      className="ear"
                      d="M 70 60 L 75 45 L 85 50 Z"
                      fill="var(--color-foreground)"
                    />
                    <path
                      className="ear-inner"
                      d="M 78 55 L 76 47 L 83 52 Z"
                      fill="var(--color-primary)"
                    />

                    {/* Right ear */}
                    <path
                      className="ear"
                      d="M 130 60 L 125 45 L 115 50 Z"
                      fill="var(--color-foreground)"
                    />
                    <path
                      className="ear-inner"
                      d="M 122 55 L 124 47 L 117 52 Z"
                      fill="var(--color-primary)"
                    />

                    {/* Eyes */}
                    <ellipse
                      className="eye"
                      cx="85"
                      cy="75"
                      rx="5"
                      ry="5"
                      fill="var(--color-primary)"
                    />
                    <ellipse
                      className="eye"
                      cx="115"
                      cy="75"
                      rx="5"
                      ry="5"
                      fill="var(--color-primary)"
                    />
                    {/* Eye highlights */}
                    <ellipse
                      cx="86"
                      cy="74"
                      rx="1.5"
                      ry="1.5"
                      fill="white"
                      opacity="0.8"
                    />
                    <ellipse
                      cx="116"
                      cy="74"
                      rx="1.5"
                      ry="1.5"
                      fill="white"
                      opacity="0.8"
                    />

                    {/* Nose */}
                    <path
                      className="nose"
                      d="M 98 85 L 102 85 L 100 88 Z"
                      fill="var(--color-background)"
                      opacity="0.7"
                    />

                    {/* Mouth */}
                    <path
                      className="mouth"
                      d="M 100 88 Q 95 92 90 90"
                      stroke="var(--color-primary)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      className="mouth"
                      d="M 100 88 Q 105 92 110 90"
                      stroke="var(--color-primary)"
                      strokeWidth="2"
                      fill="none"
                    />

                    {/* Tail - animated */}
                    <g className={styles.tail}>
                      <path
                        className="tail"
                        d="M 150 120 Q 160 110 170 120 Q 165 130 155 125 Q 145 120 150 120"
                        fill="var(--color-foreground)"
                      />
                      <path
                        className="tail-accent"
                        d="M 155 122 Q 165 115 170 120 Q 166 127 158 124"
                        fill="var(--color-primary)"
                      />
                    </g>

                    {/* Paws */}
                    <ellipse
                      className="paw"
                      cx="80"
                      cy="160"
                      rx="8"
                      ry="12"
                      fill="var(--color-foreground)"
                    />
                    <ellipse
                      className="paw"
                      cx="120"
                      cy="160"
                      rx="8"
                      ry="12"
                      fill="var(--color-foreground)"
                    />
                  </svg>
                </div>
              </div>

              {/* Back side - Personal picture */}
              <div
                className={styles.flipCardBack}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)`,
                }}
              >
                <div className={styles.personalPic}>
                  <Image
                    src="/images/pic-person-profile.jpg"
                    alt="Personal"
                    fill
                    sizes="(max-width: 768px) 180px, 200px"
                    priority
                    className={styles.personalPicImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <h1
          className={`${styles.greeting} typing-effect ${
            isComplete ? "typing-complete" : ""
          } ${language === "zh" ? styles.chinese : ""}`}
        >
          {displayedGreeting}
        </h1>
      </div>
    </div>
  );
}
