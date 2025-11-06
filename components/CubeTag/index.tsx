"use client";

import { useEffect, useRef } from "react";
import styles from "./CubeTag.module.css";

interface CubeTagProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function CubeTag({
  children,
  className = "",
  title,
}: CubeTagProps) {
  const text = typeof children === "string" ? children : String(children);
  const containerRef = useRef<HTMLDivElement>(null);

  // const rotations = {
  //   front: "rotateY(0deg) rotateX(0deg)",
  //   right: "rotateY(-90deg) rotateX(0deg)",
  //   top: "rotateY(0deg) rotateX(-90deg)",
  // };

  useEffect(() => {
    const updateCubeDepth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const depth = width / 2; // Half of container width
        containerRef.current.style.setProperty("--cube-depth", `${depth}px`);
      }
    };

    updateCubeDepth();
    window.addEventListener("resize", updateCubeDepth);
    return () => window.removeEventListener("resize", updateCubeDepth);
  }, []);

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <div className={styles.cube}>
        <div className={`${styles.face} ${styles.faceFront}`}>{text}</div>
        <div className={`${styles.face} ${styles.faceRight}`}>{text}</div>
        <div className={`${styles.face} ${styles.faceTop}`}>{text}</div>
      </div>
    </div>
  );
}
