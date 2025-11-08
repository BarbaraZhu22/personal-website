"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import styles from "./VideoModal.module.css";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  videoSrc?: string | null;
  title?: string;
}

export default function VideoModal({
  open,
  onClose,
  videoSrc,
  title,
}: VideoModalProps) {
  const HEADER_HEIGHT = 72;
  const [isMounted, setIsMounted] = useState(false);
  const titleId = useId();
  const [layout, setLayout] = useState({
    dialogMaxHeight: 0,
    videoHeight: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!isMounted || !open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isMounted, onClose, open]);

  const hasTitle = Boolean((title ?? "").trim());
  const headerHeight = hasTitle ? HEADER_HEIGHT : 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    const updateLayout = () => {
      const dialogMaxHeight = Math.min(window.innerHeight * 0.85, 720);
      const videoHeight = Math.max(dialogMaxHeight - headerHeight, 240);
      setLayout({
        dialogMaxHeight,
        videoHeight,
      });
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, [open, headerHeight]);

  const dialogStyle = useMemo(() => {
    if (!layout.dialogMaxHeight) {
      return undefined;
    }

    const style: CSSProperties & Record<string, string> = {
      "--video-modal-max-height": `${layout.dialogMaxHeight}px`,
      "--video-modal-video-height": `${layout.videoHeight}px`,
    };

    if (headerHeight) {
      style["--video-modal-header-height"] = `${headerHeight}px`;
    }

    return style;
  }, [headerHeight, layout.dialogMaxHeight, layout.videoHeight]);

  if (!isMounted || !open || !videoSrc) {
    return null;
  }

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={hasTitle ? titleId : undefined}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.dialog} style={dialogStyle}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close video"
          >
            <span>×</span>
          </button>

          {hasTitle ? (
            <div id={titleId} className={styles.title}>
              {title}
            </div>
          ) : null}
        </div>
        <video
          key={videoSrc}
          className={styles.video}
          src={videoSrc}
          controls
          autoPlay
          playsInline
          muted
        />
      </div>
    </div>,
    document.body
  );
}
