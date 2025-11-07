"use client";

import { useState } from "react";
import { useTheme } from "@/hooks";
import { useLanguageStore, Language } from "@/store";
import { t } from "@/lib/i18n";
import { colorSchemes, ColorScheme } from "@/lib/theme";
import styles from "./TopBar.module.css";

const languageNames: Record<Language, string> = {
  en: "EN",
  zh: "中文",
  es: "ES",
  fr: "FR",
};

export default function TopBar() {
  const { mode, colorScheme, setMode, setColorScheme } = useTheme();
  const { language, setLanguage } = useLanguageStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const modes: ("light" | "dark")[] = ["light", "dark"];
  const modeIcons = {
    light: "☀️",
    dark: "🌙",
  };

  return (
    <div
      className={`${styles.topBar}  ${
        isExpanded ? styles.expanded : styles.collapsed
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
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

        {/* Color Picker - Hidden when collapsed */}
        <div
          className={`${styles.colorPicker} ${
            isExpanded ? styles.show : styles.hide
          }`}
        >
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
