"use client";

import { useState } from "react";
import { Button, Card } from "@/components";
import { contactContent } from "@/content";
import styles from "./page.module.css";

export default function Contact() {
  const [duplicatedMethodIds, setDuplicatedMethodIds] = useState<string[]>([]);

  const handleDuplicateValue = async (value: string, id: string) => {
    try {
      const sanitizedValue = value.replace(/\s+/g, "");

      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(sanitizedValue);
      }

      setDuplicatedMethodIds((current) =>
        current.includes(id) ? current : [...current, id]
      );
    } catch (error) {
      console.error("Failed to duplicate contact value", error);
    }
  };

  return (
    <div className={`container ${styles.container} page-enter`}>
      <div className={styles.header}>
        <h1 className={styles.title}>{contactContent.title}</h1>
        <p className={styles.subtitle}>{contactContent.subtitle}</p>
      </div>

      <div className={styles.content}>
        {contactContent.methods.map((method) => {
          return (
            <Card
              key={method.id}
              className={`${styles.contactCard} hover-lift transition-all`}
            >
              <div className={styles.contactInfo}>
                <h2 className={styles.sectionTitle}>{method.title}</h2>
                <p className={styles.description}>{method.description}</p>
                <div className={styles.valueRow}>
                  <p
                    className={`${styles.primaryLink} hover-color transition-colors`}
                  >
                    {method.value}
                  </p>
                  <Button
                    type="button"
                    className={`${styles.duplicateButton} hover-lift transition-all`}
                    onClick={() => handleDuplicateValue(method.value, method.id)}
                    aria-label={`Duplicate ${method.title} contact value`}
                    disabled={duplicatedMethodIds.includes(method.id)}
                  >
                    {duplicatedMethodIds.includes(method.id)
                      ? "Duplicated"
                      : "Duplicate"}
                  </Button>
                </div>
                {method.details?.length ? (
                  <ul className={styles.detailsList}>
                    {method.details.map((detail) => (
                      <li key={detail} className={styles.detailsItem}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>

      {contactContent.note ? (
        <p className={styles.note}>{contactContent.note}</p>
      ) : null}
    </div>
  );
}
