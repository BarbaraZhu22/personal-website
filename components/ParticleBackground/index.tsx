'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ThreePlayer } from '@/lib/player'
import styles from './ParticleBackground.module.css'

interface Particle {
  mesh: THREE.Mesh
  velocity: THREE.Vector3
  basePosition: THREE.Vector3
}

export interface ParticleBackgroundProps {
  materialType?: 'basic' | 'standard' | 'phong'
  particleDensity?: number
  particleSize?: number
  mouseAlign?: boolean
  colorRange?: [number, number, number][] // Array of RGB color tuples
  autoRotate?: boolean
  zIndex?: number
}

const DEFAULT_COLORS: [number, number, number][] = [
  [255, 107, 107], // Red
  [78, 205, 196],  // Cyan
  [69, 183, 209],  // Blue
  [150, 206, 180], // Mint
  [254, 202, 87],  // Yellow
  [255, 159, 243], // Pink
  [84, 160, 255],  // Bright Blue
  [95, 39, 205],   // Purple
]

export default function ParticleBackground({
  materialType = 'basic',
  particleDensity = 50,
  particleSize = 0.4,
  mouseAlign = false,
  colorRange = DEFAULT_COLORS,
  autoRotate = false,
  zIndex = 1000,
}: ParticleBackgroundProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<ThreePlayer | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const groupRef = useRef<THREE.Group | null>(null)
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const mouseWorldRef = useRef<THREE.Vector3>(new THREE.Vector3())
  const lastMouseMoveRef = useRef<number>(0)
  const animationFrameIdRef = useRef<number | null>(null)
  const rotationRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const canvas = document.createElement('canvas')
    
    // Set explicit canvas dimensions
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight
    canvas.width = width
    canvas.height = height
    
    container.appendChild(canvas)

    // Initialize ThreePlayer
    const player = new ThreePlayer(canvas, {
      fov: 75,
      aspect: width / height,
      near: 0.1,
      far: 100,
      position: { x: 0, y: 0, z: 10 },
      lookAt: { x: 0, y: 0, z: 0 },
    }, {
      alpha: true,
      antialias: true,
    })

    // Disable OrbitControls for background
    player.controls.enabled = false
    player.stopControls = true

    // Set camera to look straight ahead
    player.camera.position.set(0, 0, 10)
    player.camera.lookAt(0, 0, 0)
    
    // Ensure renderer size matches canvas
    player.setSize(width, height)
    
    // Clear with transparent background
    player.renderer.setClearColor(0x000000, 0)

    playerRef.current = player

    // Add lighting for Standard and Phong materials
    if (materialType === 'standard' || materialType === 'phong') {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      player.scene.add(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(10, 10, 5)
      player.scene.add(directionalLight)
    }

    // Helper function to create material based on materialType
    const createMaterial = (color: THREE.Color): THREE.Material => {
      switch (materialType) {
        case 'standard':
          return new THREE.MeshStandardMaterial({
            color,
            transparent: true,
            opacity: 0.6,
            metalness: 0.3,
            roughness: 0.4,
          })
        case 'phong':
          return new THREE.MeshPhongMaterial({
            color,
            transparent: true,
            opacity: 0.6,
            shininess: 100,
          })
        case 'basic':
        default:
          return new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.6,
          })
      }
    }

    // Convert colorRange to THREE.Color array
    const colors = colorRange.map(([r, g, b]) => 
      new THREE.Color(r / 255, g / 255, b / 255)
    )

    // Create a single particle group
    const particleGroup = new THREE.Group()
    particleGroup.name = 'particles'
    const particles: Particle[] = []
    
    // Determine z-position range based on mode
    const zRange = mouseAlign ? [0, 5] : [10, 25]
    const spreadRange = mouseAlign ? 18 : 25
    
    for (let i = 0; i < particleDensity; i++) {
      const geometry = new THREE.SphereGeometry(particleSize, 12, 12)
      const color = colors[Math.floor(Math.random() * colors.length)]
      const material = createMaterial(color)
      const mesh = new THREE.Mesh(geometry, material)
      
      // Position particles
      mesh.position.set(
        (Math.random() - 0.5) * spreadRange,
        (Math.random() - 0.5) * spreadRange,
        Math.random() * (zRange[1] - zRange[0]) + zRange[0]
      )
      
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.005
      )
      
      particleGroup.add(mesh)
      particles.push({
        mesh,
        velocity,
        basePosition: mesh.position.clone(),
      })
    }

    // Add group to scene
    player.scene.add(particleGroup)
    groupRef.current = particleGroup
    particlesRef.current = particles


    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // Convert mouse position to world coordinates in the z=0 plane
      const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5)
      vector.unproject(player.camera)
      const dir = vector.sub(player.camera.position).normalize()
      const distance = (0 - player.camera.position.z) / dir.z
      mouseWorldRef.current = player.camera.position.clone().add(dir.multiplyScalar(distance))
      
      lastMouseMoveRef.current = Date.now()
    }
    
    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth || window.innerWidth
      const newHeight = container.clientHeight || window.innerHeight
      canvas.width = newWidth
      canvas.height = newHeight
      player.setSize(newWidth, newHeight)
    }
    
    window.addEventListener('resize', handleResize)

    // Custom animation loop that updates particles
    const animate = () => {
      const time = Date.now()
      const timeSinceMouseMove = time - lastMouseMoveRef.current
      const hasRecentMouseMove = timeSinceMouseMove < 1000 // 1 second threshold

      // Auto-rotate the group if enabled
      if (autoRotate && groupRef.current) {
        rotationRef.current.y += 0.0005
        rotationRef.current.x += 0.0003
        groupRef.current.rotation.set(
          rotationRef.current.x,
          rotationRef.current.y,
          rotationRef.current.z
        )
      }

      // Update particles
      particlesRef.current.forEach((particle) => {
        // Mouse alignment behavior
        if (mouseAlign && hasRecentMouseMove) {
          // Align with mouse movement
          const direction = mouseWorldRef.current.clone().sub(particle.mesh.position).normalize()
          particle.velocity.lerp(direction.multiplyScalar(0.1), 0.1)
        } else {
          // Random movement
          particle.velocity.x += (Math.random() - 0.5) * 0.0005
          particle.velocity.y += (Math.random() - 0.5) * 0.0005
          particle.velocity.z += (Math.random() - 0.5) * 0.0003
        }
        
        // Apply damping
        const damping = mouseAlign ? 0.95 : 0.98
        particle.velocity.multiplyScalar(damping)
        
        // Update position
        particle.mesh.position.add(particle.velocity)
        
        // Boundary check and wrap around
        const range = mouseAlign ? 16 : 20
        const [zMin, zMax] = mouseAlign ? [0, 5] : [10, 25]
        
        if (Math.abs(particle.mesh.position.x) > range) {
          particle.mesh.position.x = (Math.random() - 0.5) * range * 2
        }
        if (Math.abs(particle.mesh.position.y) > range) {
          particle.mesh.position.y = (Math.random() - 0.5) * range * 2
        }
        if (particle.mesh.position.z < zMin || particle.mesh.position.z > zMax) {
          particle.mesh.position.z = Math.random() * (zMax - zMin) + zMin
        }
      })

      // Render the scene
      player.renderer.render(player.scene, player.camera)
      
      animationFrameIdRef.current = requestAnimationFrame(animate)
    }

    // Add event listeners (only if mouseAlign is enabled)
    if (mouseAlign) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (mouseAlign) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
      window.removeEventListener('resize', handleResize)
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
      player.stopRender()
      player.dispose()
      if (container.contains(canvas)) {
        container.removeChild(canvas)
      }
    }
  }, [materialType, particleDensity, particleSize, mouseAlign, colorRange, autoRotate])

  return (
    <div 
      ref={containerRef} 
      className={styles.container}
      style={{ zIndex }}
    />
  )
}

