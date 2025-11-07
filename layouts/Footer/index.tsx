"use client";

import { useLanguageStore } from "@/store";
import { t } from "@/lib/i18n";
import styles from "./Footer.module.css";
import Link from "next/link";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { language } = useLanguageStore();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <p className={styles.copyright}>
            © {currentYear} {t("myName", language) || "Frontend Developer"}.{" "}
            {t("rightsReserved", language) || "All rights reserved."}
          </p>
          <div className={styles.links}>
            <Link
              href="/contact"
              className={`${styles.link} hover-color transition-colors`}
            >
              {t("contact", language)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
