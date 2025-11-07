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

// Constants
const ROTATION_SPEED = 30; // degrees per second
const MOUSE_SENSITIVITY = 0.5; // degrees per pixel
const MOUSE_STOP_TIMEOUT = 500; // ms before resuming natural spinning
const FRAME_TIME = 0.016; // ~60fps
const DEG_TO_RAD = Math.PI / 180;
const CAMERA_FOV = 75;
const CAMERA_DISTANCE = 1;
const PLANE_SEGMENTS = 32;
const CLOUD_CENTER = 0.5;
const CLOUD_MAX_MOVEMENT = 0.1;

// Cloud animation constants
const CLOUD_VELOCITY = new THREE.Vector2(0.00015, 0.00012);

// Theme-specific constants (will be wrapped in { value: ... } format)
const DARK_THEME_VALUES = {
  uStarColor: new THREE.Vector3(1.0, 1.0, 1.0),
  uOpacity: 0.8,
  uStarDensity: 0.5,
  uStarSize: 30,
};

const LIGHT_THEME_VALUES = {
  uColor1: new THREE.Vector3(1.0, 0.95, 0.9),
  uNumSteps: 18,
};

// Helper function to convert hex color to THREE.Vector3 RGB values (0-1 range)
function hexToVector3(hex: string): THREE.Vector3 {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return new THREE.Vector3(r, g, b);
}

// Helper function to normalize angle to 0-360 range
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

// Helper function to update cloud boundaries
function updateCloudBoundaries(
  position: THREE.Vector2,
  velocity: THREE.Vector2
): void {
  const minX = CLOUD_CENTER - CLOUD_MAX_MOVEMENT;
  const maxX = CLOUD_CENTER + CLOUD_MAX_MOVEMENT;
  const minY = CLOUD_CENTER - CLOUD_MAX_MOVEMENT;
  const maxY = CLOUD_CENTER + CLOUD_MAX_MOVEMENT;

  if (position.x > maxX) {
    position.x = maxX;
    velocity.x *= -1;
  } else if (position.x < minX) {
    position.x = minX;
    velocity.x *= -1;
  }

  if (position.y > maxY) {
    position.y = maxY;
    velocity.y *= -1;
  } else if (position.y < minY) {
    position.y = minY;
    velocity.y *= -1;
  }
}

// Helper function to create shader uniforms
function createShaderUniforms(
  isDark: boolean,
  width: number,
  height: number,
  themeColor: THREE.Vector3,
  cloudPosition?: THREE.Vector2
): Record<string, { value: any }> {
  const baseUniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(width, height) },
  };

  if (isDark) {
    return {
      ...baseUniforms,
      uStarColor: { value: DARK_THEME_VALUES.uStarColor },
      uOpacity: { value: DARK_THEME_VALUES.uOpacity },
      uStarDensity: { value: DARK_THEME_VALUES.uStarDensity },
      uStarSize: { value: DARK_THEME_VALUES.uStarSize },
      uHaloColor: { value: themeColor },
      uNoiseSeed: { value: Math.random() * 10.0 + 1.0 },
    };
  } else {
    return {
      ...baseUniforms,
      uColor1: { value: LIGHT_THEME_VALUES.uColor1 },
      uNumSteps: { value: LIGHT_THEME_VALUES.uNumSteps },
      uColor2: { value: themeColor },
      uCloudPosition: {
        value: cloudPosition?.clone() || new THREE.Vector2(0.5, 0.5),
      },
    };
  }
}

export default function MainBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ThreePlayer | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cloudPositionRef = useRef<THREE.Vector2>(
    new THREE.Vector2(CLOUD_CENTER, CLOUD_CENTER)
  );
  const cloudVelocityRef = useRef<THREE.Vector2>(CLOUD_VELOCITY.clone());
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseControllingRef = useRef<boolean>(false); // Flag for mouse control
  const currentRotationAngleRef = useRef<number>(0); // Current rotation angle in degrees
  const lastMouseXRef = useRef<number>(0); // Last mouse X position
  const timeRef = useRef<number>(0); // Animation time reference
  const { isDark, colors } = useTheme();
  const isDarkRef = useRef<boolean>(isDark);
  const headerElementRef = useRef<HTMLElement | null>(null);

  const isEventWithinHeader = (event: MouseEvent): boolean => {
    const headerElement = headerElementRef.current;
    if (!headerElement) return false;

    const path =
      typeof event.composedPath === "function"
        ? event.composedPath()
        : undefined;

    if (Array.isArray(path) && path.includes(headerElement)) {
      return true;
    }

    const target = event.target as Node | null;
    return !!target && headerElement.contains(target);
  };

  // Helper function to resume natural spinning
  const resumeSpinning = () => {
    isMouseControllingRef.current = false;
    timeRef.current = currentRotationAngleRef.current / ROTATION_SPEED;
  };

  const stopResumeSpinning = () => {
    if (mouseMoveTimeoutRef.current) {
      clearTimeout(mouseMoveTimeoutRef.current);
    }
  };

  // Handle mouse movement for rotation control
  const handleMouseMove = (event: MouseEvent) => {
    if (!isDarkRef.current || isEventWithinHeader(event)) return;

    const deltaX = event.clientX - lastMouseXRef.current;
    currentRotationAngleRef.current += deltaX * MOUSE_SENSITIVITY;
    currentRotationAngleRef.current = normalizeAngle(
      currentRotationAngleRef.current
    );

    isMouseControllingRef.current = true;
    lastMouseXRef.current = event.clientX;

    stopResumeSpinning();

    mouseMoveTimeoutRef.current = setTimeout(() => {
      resumeSpinning();
    }, MOUSE_STOP_TIMEOUT);
  };

  // Handle mousedown - pause natural spinning
  const handleMouseDown = (event: MouseEvent) => {
    if (!isDarkRef.current || isEventWithinHeader(event)) return; // Only in dark mode

    stopResumeSpinning();

    isMouseControllingRef.current = true;
    lastMouseXRef.current = event.clientX;
  };

  // Handle mouseup - resume natural spinning
  const handleMouseUp = (event: MouseEvent) => {
    if (!isDarkRef.current) return; // Only in dark mode

    resumeSpinning();
  };

  // Initialize lastMouseXRef on first mouse move
  const handleMouseMoveInit = (event: MouseEvent) => {
    lastMouseXRef.current = event.clientX;
    window.removeEventListener("mousemove", handleMouseMoveInit);
    window.addEventListener("mousemove", handleMouseMove);
  };

  // Keep isDarkRef in sync with isDark
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    if (!containerRef.current) return;

    headerElementRef.current = document.querySelector(
      '[data-header="true"]'
    ) as HTMLElement | null;

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
        fov: CAMERA_FOV,
        aspect: width / height,
        near: 0.1,
        far: 1000,
        position: { x: 0, y: 0, z: CAMERA_DISTANCE },
        lookAt: { x: 0, y: 0, z: 0 },
      },
      {
        alpha: true,
        antialias: true,
      }
    );

    // Set controls target first (before camera position)
    player.controls.target.set(0, 0, 0);

    // Set camera position
    player.camera.position.set(0, 0, 1);
    player.camera.lookAt(0, 0, 0);

    // Create shader material based on theme
    const isDarkMode = isDarkRef.current;

    // Setup controls
    player.controls.enabled = false;
    player.stopControls = true;

    player.setSize(width, height);
    player.renderer.setClearColor(0x000000, 0);

    // Set performance mode
    player.setPerformanceMode("performance");

    playerRef.current = player;

    // Calculate plane size to match viewport exactly
    const fovRad = CAMERA_FOV * DEG_TO_RAD;
    const planeHeight = 2 * Math.tan(fovRad / 2) * CAMERA_DISTANCE;
    const planeWidth = planeHeight * (width / height);

    // Create plane geometry matching viewport size exactly
    const planeGeometry = new THREE.PlaneGeometry(
      planeWidth,
      planeHeight,
      PLANE_SEGMENTS,
      PLANE_SEGMENTS
    );

    // Convert theme color to RGB Vector3 for shader
    const themeColor = hexToVector3(colors.primary).multiplyScalar(0.8);
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: isDarkMode ? starFragmentShader : cloudFragmentShader,
      uniforms: createShaderUniforms(
        isDarkMode,
        width,
        height,
        themeColor,
        cloudPositionRef.current
      ),
      transparent: true,
      side: THREE.DoubleSide,
    });

    materialRef.current = shaderMaterial;

    // Create plane mesh
    const plane = new THREE.Mesh(planeGeometry, shaderMaterial);

    // Position plane as background (facing camera)
    plane.scale.set(1, 1, 1);
    plane.position.set(0, 0, 0);

    player.scene.add(plane);
    planeRef.current = plane;

    // Animation loop
    timeRef.current = 0;
    const animate = () => {
      timeRef.current += FRAME_TIME;

      // Update time uniform
      const material = materialRef.current;
      if (material?.uniforms?.uTime) {
        material.uniforms.uTime.value = timeRef.current;
      }

      // Rotate plane in dark mode
      if (isDarkRef.current && planeRef.current) {
        if (isMouseControllingRef.current) {
          planeRef.current.rotation.z =
            currentRotationAngleRef.current * DEG_TO_RAD;
        } else {
          const rotationZ = (timeRef.current * ROTATION_SPEED) % 360;
          currentRotationAngleRef.current = rotationZ;
          planeRef.current.rotation.z = rotationZ * DEG_TO_RAD;
        }
      }

      // Update cloud position for floating animation (only in light theme)
      if (material?.uniforms?.uCloudPosition) {
        cloudPositionRef.current.x += cloudVelocityRef.current.x;
        cloudPositionRef.current.y += cloudVelocityRef.current.y;
        updateCloudBoundaries(
          cloudPositionRef.current,
          cloudVelocityRef.current
        );
        material.uniforms.uCloudPosition.value.set(
          cloudPositionRef.current.x,
          cloudPositionRef.current.y
        );
      }

      player.renderer.render(player.scene, player.camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("mousemove", handleMouseMoveInit);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      canvas.width = newWidth;
      canvas.height = newHeight;
      player.setSize(newWidth, newHeight);

      // Recalculate plane size for new aspect ratio
      const newPlaneHeight = 2 * Math.tan(fovRad / 2) * CAMERA_DISTANCE;
      const newPlaneWidth = newPlaneHeight * (newWidth / newHeight);

      // Update plane geometry if plane exists
      if (planeRef.current) {
        planeRef.current.geometry.dispose();
        planeRef.current.geometry = new THREE.PlaneGeometry(
          newPlaneWidth,
          newPlaneHeight,
          PLANE_SEGMENTS,
          PLANE_SEGMENTS
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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleMouseMoveInit);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);

      stopResumeSpinning();

      headerElementRef.current = null;

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

  // Update shader and controls when theme changes
  useEffect(() => {
    if (!materialRef.current) return;

    const material = materialRef.current;
    const plane = planeRef.current;
    const isDarkMode = isDark;
    const themeColor = hexToVector3(colors.primary).multiplyScalar(0.8);

    // Preserve current values
    const currentTime = material.uniforms.uTime?.value || 0;
    const currentResolution =
      material.uniforms.uResolution?.value ||
      new THREE.Vector2(window.innerWidth, window.innerHeight);

    // Recover plane z
    if (!isDarkMode && plane) {
      stopResumeSpinning();
      const rotationZ = 0;
      currentRotationAngleRef.current = rotationZ;
      plane.rotation.z = 0;
    }

    // Update fragment shader
    material.fragmentShader = isDarkMode
      ? starFragmentShader
      : cloudFragmentShader;

    // Get new uniforms based on theme
    const newUniforms = createShaderUniforms(
      isDarkMode,
      currentResolution.x,
      currentResolution.y,
      themeColor,
      cloudPositionRef.current
    );

    // Update common uniforms with preserved values
    newUniforms.uTime.value = currentTime;
    newUniforms.uResolution.value = currentResolution;

    // Remove old theme-specific uniforms
    const oldUniforms = isDarkMode
      ? ["uColor1", "uColor2", "uCloudPosition", "uNumSteps"]
      : [
          "uStarColor",
          "uHaloColor",
          "uOpacity",
          "uStarDensity",
          "uStarSize",
          "uNoiseSeed",
        ];

    oldUniforms.forEach((key) => {
      delete material.uniforms[key];
    });

    // Update uniforms
    Object.assign(material.uniforms, newUniforms);

    // Recompile shader
    material.needsUpdate = true;
  }, [isDark, colors.primary]);

  return <div ref={containerRef} className={styles.mainBg}></div>;
}
