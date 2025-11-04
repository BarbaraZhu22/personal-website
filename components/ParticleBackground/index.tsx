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

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<ThreePlayer | null>(null)
  const particlesRef = useRef<{
    background: Particle[]
    flee: Particle[]
    follow: Particle[]
  }>({
    background: [],
    flee: [],
    follow: [],
  })
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const mouseWorldRef = useRef<THREE.Vector3>(new THREE.Vector3())
  const lastMouseMoveRef = useRef<number>(0)
  const animationFrameIdRef = useRef<number | null>(null)

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

    // Create beautiful colors palette
    const colors = [
      0xff6b6b, // Red
      0x4ecdc4, // Cyan
      0x45b7d1, // Blue
      0x96ceb4, // Mint
      0xfeca57, // Yellow
      0xff9ff3, // Pink
      0x54a0ff, // Bright Blue
      0x5f27cd, // Purple
    ]

    // Group 1: Big background particles (low z-index, beautiful colors)
    const backgroundGroup = new THREE.Group()
    backgroundGroup.name = 'background'
    const backgroundParticles: Particle[] = []
    
    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.SphereGeometry(0.4, 12, 12)
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)])
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
      })
      const mesh = new THREE.Mesh(geometry, material)
      
      // Spread particles behind (further from camera)
      mesh.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        Math.random() * 15 + 10 // z between 10 and 25
      )
      
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.005
      )
      
      backgroundGroup.add(mesh)
      backgroundParticles.push({
        mesh,
        velocity,
        basePosition: mesh.position.clone(),
      })
    }

    // Group 2: Big particles that flee from mouse
    const fleeGroup = new THREE.Group()
    fleeGroup.name = 'flee'
    const fleeParticles: Particle[] = []
    
    for (let i = 0; i < 30; i++) {
      const geometry = new THREE.SphereGeometry(0.35, 12, 12)
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)])
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
      })
      const mesh = new THREE.Mesh(geometry, material)
      
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        Math.random() * 8 + 5 // z between 5 and 13
      )
      
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01
      )
      
      fleeGroup.add(mesh)
      fleeParticles.push({
        mesh,
        velocity,
        basePosition: mesh.position.clone(),
      })
    }

    // Group 3: Tiny particles that follow mouse
    const followGroup = new THREE.Group()
    followGroup.name = 'follow'
    const followParticles: Particle[] = []
    
    for (let i = 0; i < 100; i++) {
      const geometry = new THREE.SphereGeometry(0.08, 8, 8)
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)])
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.7,
      })
      const mesh = new THREE.Mesh(geometry, material)
      
      mesh.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
        Math.random() * 5 // z between 0 and 5
      )
      
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.02
      )
      
      followGroup.add(mesh)
      followParticles.push({
        mesh,
        velocity,
        basePosition: mesh.position.clone(),
      })
    }

    // Add groups to scene
    player.scene.add(backgroundGroup)
    player.scene.add(fleeGroup)
    player.scene.add(followGroup)

    particlesRef.current = {
      background: backgroundParticles,
      flee: fleeParticles,
      follow: followParticles,
    }


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

      // Update background particles (slow random movement)
      particlesRef.current.background.forEach((particle) => {
        // Slow random movement
        particle.velocity.x += (Math.random() - 0.5) * 0.0005
        particle.velocity.y += (Math.random() - 0.5) * 0.0005
        particle.velocity.z += (Math.random() - 0.5) * 0.0003
        
        // Apply damping
        particle.velocity.multiplyScalar(0.98)
        
        // Update position
        particle.mesh.position.add(particle.velocity)
        
        // Boundary check and wrap around
        const range = 20
        if (Math.abs(particle.mesh.position.x) > range) {
          particle.mesh.position.x = (Math.random() - 0.5) * range * 2
        }
        if (Math.abs(particle.mesh.position.y) > range) {
          particle.mesh.position.y = (Math.random() - 0.5) * range * 2
        }
        if (particle.mesh.position.z < 10 || particle.mesh.position.z > 25) {
          particle.mesh.position.z = Math.random() * 15 + 10
        }
      })

      // Update flee particles
      particlesRef.current.flee.forEach((particle) => {
        if (hasRecentMouseMove) {
          // Calculate distance from mouse
          const distance = particle.mesh.position.distanceTo(mouseWorldRef.current)
          
          if (distance < 5) {
            // Flee from mouse
            const fleeDirection = particle.mesh.position.clone().sub(mouseWorldRef.current).normalize()
            const fleeStrength = (5 - distance) / 5 // Stronger when closer
            particle.velocity.add(fleeDirection.multiplyScalar(fleeStrength * 0.05))
          }
        }
        
        // Random movement
        particle.velocity.x += (Math.random() - 0.5) * 0.001
        particle.velocity.y += (Math.random() - 0.5) * 0.001
        particle.velocity.z += (Math.random() - 0.5) * 0.001
        
        // Apply damping
        particle.velocity.multiplyScalar(0.97)
        
        // Update position
        particle.mesh.position.add(particle.velocity)
        
        // Boundary check
        const range = 18
        if (Math.abs(particle.mesh.position.x) > range) {
          particle.velocity.x *= -0.5
          particle.mesh.position.x = Math.sign(particle.mesh.position.x) * range
        }
        if (Math.abs(particle.mesh.position.y) > range) {
          particle.velocity.y *= -0.5
          particle.mesh.position.y = Math.sign(particle.mesh.position.y) * range
        }
        if (particle.mesh.position.z < 5 || particle.mesh.position.z > 13) {
          particle.velocity.z *= -0.5
          particle.mesh.position.z = Math.max(5, Math.min(13, particle.mesh.position.z))
        }
      })

      // Update follow particles
      particlesRef.current.follow.forEach((particle) => {
        if (hasRecentMouseMove) {
          // Align with mouse movement
          const direction = mouseWorldRef.current.clone().sub(particle.mesh.position).normalize()
          particle.velocity.lerp(direction.multiplyScalar(0.1), 0.1)
        } else {
          // Random movement when no mouse
          particle.velocity.x += (Math.random() - 0.5) * 0.002
          particle.velocity.y += (Math.random() - 0.5) * 0.002
          particle.velocity.z += (Math.random() - 0.5) * 0.001
        }
        
        // Apply damping
        particle.velocity.multiplyScalar(0.95)
        
        // Update position
        particle.mesh.position.add(particle.velocity)
        
        // Boundary check
        const range = 16
        if (Math.abs(particle.mesh.position.x) > range) {
          particle.mesh.position.x = (Math.random() - 0.5) * range * 2
        }
        if (Math.abs(particle.mesh.position.y) > range) {
          particle.mesh.position.y = (Math.random() - 0.5) * range * 2
        }
        if (particle.mesh.position.z < 0 || particle.mesh.position.z > 5) {
          particle.mesh.position.z = Math.random() * 5
        }
      })

      // Render the scene
      player.renderer.render(player.scene, player.camera)
      
      animationFrameIdRef.current = requestAnimationFrame(animate)
    }

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove)

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
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
  }, [])

  return <div ref={containerRef} className={styles.container} />
}

