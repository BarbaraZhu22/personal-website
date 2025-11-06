"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ThreePlayer } from "@/lib/player";
import { useTheme } from "@/hooks/useTheme";
import styles from "./MainBackground.module.css";
import {
  vertexShader,
  cloudFragmentShader,
  starFragmentShader,
} from "./useShader";

// Helper function to convert hex color to THREE.Vector3 RGB values (0-1 range)
function hexToVector3(hex: string): THREE.Vector3 {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Parse RGB values
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  return new THREE.Vector3(r, g, b);
}

export default function MainBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ThreePlayer | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cloudPositionRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5)); // Start at center
  const cloudVelocityRef = useRef<THREE.Vector2>(
    new THREE.Vector2(0.00015, 0.00012)
  ); // Slow floating speed

  const { isDark, colors } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const canvas = document.createElement("canvas");

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    container.appendChild(canvas);

    // Initialize ThreePlayer
    const player = new ThreePlayer(
      canvas,
      {
        fov: 75,
        aspect: width / height,
        near: 0.1,
        far: 1000,
        position: { x: 0, y: 0, z: 1 },
        lookAt: { x: 0, y: 0, z: 0 },
      },
      {
        alpha: true,
        antialias: true,
      }
    );

    player.controls.enabled = false;
    player.stopControls = true;
    // Set camera position
    player.camera.position.set(0, 0, 1);
    player.camera.lookAt(0, 0, 0);

    player.setSize(width, height);
    player.renderer.setClearColor(0x000000, 0);

    // Set performance mode
    player.setPerformanceMode("performance");

    playerRef.current = player;

    // Calculate plane size to match viewport exactly
    const distance = 1; // Camera distance from plane
    const fov = 75 * (Math.PI / 180); // Convert to radians
    const planeHeight = 2 * Math.tan(fov / 2) * distance;
    const planeWidth = planeHeight * (width / height);

    // Create plane geometry matching viewport size exactly
    const planeGeometry = new THREE.PlaneGeometry(
      planeWidth,
      planeHeight,
      32,
      32
    );

    // Create shader material based on theme
    const isDarkMode = isDark;
    // Convert theme color to RGB Vector3 for shader
    const themeColor2 = hexToVector3(colors.primary);
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: isDarkMode ? starFragmentShader : cloudFragmentShader,
      uniforms: isDarkMode
        ? {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(width, height) },
            uStarColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
            uOpacity: { value: 0.8 },
            uStarDensity: { value: 15.0 },
          }
        : {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(width, height) },
            uColor1: { value: new THREE.Vector3(0.85, 0.55, 0.2) }, // Bright cloud color
            uColor2: { value: themeColor2 }, // Shadow cloud color - uses theme color
            uCloudPosition: { value: cloudPositionRef.current.clone() }, // Cloud position
            uNumSteps: { value: 33 }, // Number of color steps
          },
      transparent: true,
      side: THREE.DoubleSide,
    });

    materialRef.current = shaderMaterial;

    // Create plane mesh
    const plane = new THREE.Mesh(planeGeometry, shaderMaterial);

    // Position plane as background (facing camera)
    // Rotate degrees around Y axis for 3D effect

    // Scale up to compensate for rotation (cos(45°) = √2/2 ≈ 0.707)
    // We need to scale by 1/cos(45°) ≈ 1.414 to maintain full screen coverage
    plane.scale.set(1, 1, 1);
    plane.position.set(0, 0, 0);

    player.scene.add(plane);
    planeRef.current = plane;

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.016; // ~60fps

      if (shaderMaterial.uniforms.uTime) {
        shaderMaterial.uniforms.uTime.value = time;
      }

      // Update cloud position for floating animation (only in light theme)
      if (shaderMaterial.uniforms.uCloudPosition) {
        // Update position
        cloudPositionRef.current.x += cloudVelocityRef.current.x;
        cloudPositionRef.current.y += cloudVelocityRef.current.y;

        // Boundary detection and bounce back
        // Cloud size is 0.8 (80% of plane), so it can only move 10% in each direction
        // Center starts at 0.5, so it can move from 0.4 to 0.6 (±0.1 from center)
        const centerX = 0.5;
        const centerY = 0.5;
        const maxMovement = 0.1; // 10% movement allowed

        // Bounce back when hitting boundaries
        if (cloudPositionRef.current.x > centerX + maxMovement) {
          cloudPositionRef.current.x = centerX + maxMovement;
          cloudVelocityRef.current.x *= -1; // Reverse direction
        } else if (cloudPositionRef.current.x < centerX - maxMovement) {
          cloudPositionRef.current.x = centerX - maxMovement;
          cloudVelocityRef.current.x *= -1; // Reverse direction
        }

        if (cloudPositionRef.current.y > centerY + maxMovement) {
          cloudPositionRef.current.y = centerY + maxMovement;
          cloudVelocityRef.current.y *= -1; // Reverse direction
        } else if (cloudPositionRef.current.y < centerY - maxMovement) {
          cloudPositionRef.current.y = centerY - maxMovement;
          cloudVelocityRef.current.y *= -1; // Reverse direction
        }

        // Update uniform
        shaderMaterial.uniforms.uCloudPosition.value.set(
          cloudPositionRef.current.x,
          cloudPositionRef.current.y
        );
      }

      player.renderer.render(player.scene, player.camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      canvas.width = newWidth;
      canvas.height = newHeight;
      player.setSize(newWidth, newHeight);

      // Recalculate plane size for new aspect ratio
      const newPlaneHeight = 2 * Math.tan(fov / 2) * distance;
      const newPlaneWidth = newPlaneHeight * (newWidth / newHeight);

      // Update plane geometry if plane exists
      if (planeRef.current) {
        planeRef.current.geometry.dispose();
        planeRef.current.geometry = new THREE.PlaneGeometry(
          newPlaneWidth,
          newPlaneHeight,
          32,
          32
        );
      }

      if (shaderMaterial.uniforms.uResolution) {
        shaderMaterial.uniforms.uResolution.value.set(newWidth, newHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      player.stopRender();
      player.dispose();
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []); // Initialize once

  // Update shader when theme changes
  useEffect(() => {
    if (!materialRef.current || !playerRef.current) return;

    const material = materialRef.current;
    const isDarkMode = isDark;
    // Convert theme color to RGB Vector3 for shader and fade by 20%
    const themeColor2 = hexToVector3(colors.primary).multiplyScalar(0.8);

    // Store current time value
    const currentTime = material.uniforms.uTime?.value || 0;
    const currentResolution =
      material.uniforms.uResolution?.value ||
      new THREE.Vector2(window.innerWidth, window.innerHeight);

    // Update fragment shader
    material.fragmentShader = isDarkMode
      ? starFragmentShader
      : cloudFragmentShader;

    // Update uniforms - preserve existing values where possible
    if (isDarkMode) {
      // Update or create dark theme uniforms
      if (material.uniforms.uTime) {
        material.uniforms.uTime.value = currentTime;
      } else {
        material.uniforms.uTime = { value: currentTime };
      }

      if (material.uniforms.uResolution) {
        material.uniforms.uResolution.value = currentResolution;
      } else {
        material.uniforms.uResolution = { value: currentResolution };
      }

      material.uniforms.uStarColor = {
        value: new THREE.Vector3(1.0, 1.0, 1.0),
      };
      material.uniforms.uOpacity = { value: 0.8 };
      material.uniforms.uStarDensity = { value: 15.0 };

      // Remove light theme uniforms if they exist
      delete material.uniforms.uColor1;
      delete material.uniforms.uColor2;
      delete material.uniforms.uCloudPosition;
      delete material.uniforms.uNumSteps;
    } else {
      // Update or create light theme uniforms
      if (material.uniforms.uTime) {
        material.uniforms.uTime.value = currentTime;
      } else {
        material.uniforms.uTime = { value: currentTime };
      }

      if (material.uniforms.uResolution) {
        material.uniforms.uResolution.value = currentResolution;
      } else {
        material.uniforms.uResolution = { value: currentResolution };
      }

      material.uniforms.uColor1 = { value: new THREE.Vector3(1.0, 0.95, 0.9) }; // Bright cloud color
      material.uniforms.uColor2 = { value: themeColor2 }; // Shadow cloud color - uses theme color
      material.uniforms.uCloudPosition = {
        value: cloudPositionRef.current.clone(),
      }; // Cloud position
      material.uniforms.uNumSteps = { value: 18 }; // Number of color steps

      // Remove dark theme uniforms if they exist
      delete material.uniforms.uStarColor;
      delete material.uniforms.uStarDensity;
    }

    // Recompile shader
    material.needsUpdate = true;
  }, [isDark, colors.primary]);

  return <div ref={containerRef} className={styles.mainBg}></div>;
}
