"use client";

import { useState, useEffect } from "react";
import { useThemeStore } from "@/store";
import { useLanguageStore, Language } from "@/store";
import { t } from "@/lib/i18n";
import { colorSchemes, ColorScheme, ThemeMode } from "@/lib/themes";
import styles from "./TopBar.module.css";

const languageNames: Record<Language, string> = {
  en: "EN",
  zh: "中文",
  es: "ES",
  fr: "FR",
};

export default function TopBar() {
  const { mode, colorScheme, setMode, setColorScheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const [isVisible, setIsVisible] = useState(true);

  const modes: ("light" | "dark")[] = ["light", "dark"];
  const modeIcons = {
    light: "☀️",
    dark: "🌙",
  };

  useEffect(() => {
    // Show on mount
    setIsVisible(true);

    // Handle scroll - hide on scroll down, show on scroll up
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        // Near top, always show
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    // Only hide if scrolled down past 100px
    if (window.scrollY > 100) {
      setIsVisible(false);
    }
  };

  return (
    <div
      className={`${styles.topBar} ${
        isVisible ? styles.visible : styles.hidden
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.container}>
        {/* Theme Mode Toggle */}
        <div className={styles.modeToggle}>
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`${styles.modeButton} ${
                mode === m ? styles.active : ""
              }`}
              title={t(m, language)}
              aria-label={`Set theme to ${t(m, language)}`}
            >
              {modeIcons[m]}
            </button>
          ))}
        </div>

        {/* Color Picker */}
        <div className={styles.colorPicker}>
          {Object.entries(colorSchemes).map(([key, scheme]) => {
            const isActive = key === colorScheme;
            return (
              <button
                key={key}
                onClick={() => setColorScheme(key as ColorScheme)}
                className={`${styles.colorButton} ${
                  isActive ? styles.active : ""
                }`}
                style={{
                  backgroundColor: scheme.light,
                }}
                title={scheme.name}
                aria-label={`Select ${scheme.name} color theme`}
              />
            );
          })}
        </div>

        {/* Language Toggle */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className={styles.languageSelect}
          aria-label="Select language"
        >
          {Object.entries(languageNames).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
