import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'

export type rotationType = [number, number, number, (THREE.EulerOrder | undefined)?]

export interface cameraType {
  position: number[]
  rotation: rotationType
  target: number[]
}

export interface CameraSettings {
  fov?: number
  aspect?: number
  near?: number
  far?: number
  position?: { x: number; y: number; z: number }
  lookAt?: { x: number; y: number; z: number }
}

export interface RendererSettings {
  antialias?: boolean
  alpha?: boolean
  shadowMap?: boolean
  shadowMapType?: THREE.ShadowMapType
  clearColor?: string
}

export class ThreePlayer {
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer
  public controls!: OrbitControls
  public labelRenderer?: CSS2DRenderer
  public raycaster: THREE.Raycaster
  public mouse: THREE.Vector2
  public stopControls = false
  private animationId: number | null = null
  private isRendering = false
  private onOrbitChangeFns: (() => any)[] = []

  // Performance optimization properties
  public maxRenderDistance = 1000
  private frustumCulling = true
  private targetFPS = 60
  private frameTime = 1000 / this.targetFPS
  private lastFrameTime = 0
  private adaptiveQuality = true
  private performanceMode = 'balanced' // 'performance', 'balanced', 'quality'
  private visibleObjects = new Set<THREE.Object3D>()
  private lodLevels = new Map<THREE.Object3D, number>()

  constructor(canvas: HTMLCanvasElement, cameraSettings: CameraSettings = {}, rendererSettings: RendererSettings = {}) {
    // Initialize scene
    this.scene = new THREE.Scene()

    // Initialize camera
    const aspect = cameraSettings.aspect || canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(
      cameraSettings.fov || 75,
      aspect,
      cameraSettings.near || 0.1,
      cameraSettings.far || 1000,
    )

    // Set camera position
    this.camera.position.set(
      cameraSettings.position?.x || 0,
      cameraSettings.position?.y || 5,
      cameraSettings.position?.z || 10,
    )

    if (cameraSettings.lookAt) {
      this.camera.lookAt(cameraSettings.lookAt.x, cameraSettings.lookAt.y, cameraSettings.lookAt.z)
    }

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: rendererSettings.antialias !== false,
      alpha: rendererSettings.alpha !== false,
    })

    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    // Use modern outputColorSpace API (Three.js r152+)
    // Fallback to deprecated outputEncoding for older versions
    if ('outputColorSpace' in this.renderer) {
      this.renderer.outputColorSpace = 'srgb'
    } else {
      // @ts-ignore - deprecated API
      this.renderer.outputEncoding = THREE.sRGBEncoding
    }
    this.renderer.localClippingEnabled = true

    // Shadow map settings
    if (rendererSettings.shadowMap !== false) {
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = rendererSettings.shadowMapType || THREE.PCFSoftShadowMap
    }

    // Clear color
    if (rendererSettings.clearColor) {
      this.renderer.setClearColor(rendererSettings.clearColor)
    }

    // helpers for interaction
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    // Initialize OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.addEventListener('change', () => {
      if (this.stopControls) return
      if (this.onOrbitChangeFns && this.onOrbitChangeFns.length) {
        for (let i = 0; i < this.onOrbitChangeFns.length; i++) {
          const fn = this.onOrbitChangeFns[i]
          if (typeof fn === 'function') fn()
        }
      }

      // render on-demand while also supporting continuous loop via startRender()
      if (!this.isRendering) this.animate()
    })

    // Handle window resize
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }

  public updatePerformance() {
    // Update visibility and LOD when camera view changes
    if (this.frustumCulling) {
      this.updateVisibilityForAllObjects()
    }
    if (this.adaptiveQuality) {
      this.updateLODForAllObjects()
    }
  }

  public getScene(): THREE.Scene {
    return this.scene
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer
  }

  public getControls(): OrbitControls {
    return this.controls
  }

  public setCamera(camera: THREE.PerspectiveCamera): void {
    this.camera = camera
  }

  // Register a callback on OrbitControls change
  public onOrbitChange(fn: () => any): void {
    if (typeof fn !== 'function') return
    if (this.onOrbitChangeFns.includes(fn)) return
    this.onOrbitChangeFns.push(fn)
  }

  public add(object: THREE.Object3D): void {
    this.scene.add(object)
    this.updateObjectVisibility(object)
  }

  public remove(object: THREE.Object3D): void {
    this.scene.remove(object)
    this.visibleObjects.delete(object)
    this.lodLevels.delete(object)
  }

  // Performance optimization methods
  public setPerformanceMode(mode: 'performance' | 'balanced' | 'quality'): void {
    this.performanceMode = mode
    switch (mode) {
      case 'performance':
        this.targetFPS = 30
        this.maxRenderDistance = 500
        this.frustumCulling = true
        this.adaptiveQuality = true
        break
      case 'balanced':
        this.targetFPS = 60
        this.maxRenderDistance = 1000
        this.frustumCulling = true
        this.adaptiveQuality = true
        break
      case 'quality':
        this.targetFPS = 60
        this.maxRenderDistance = 2000
        this.frustumCulling = false
        this.adaptiveQuality = false
        break
    }
    this.frameTime = 1000 / this.targetFPS
  }

  public setMaxRenderDistance(distance: number): void {
    this.maxRenderDistance = distance
  }

  public enableFrustumCulling(enabled: boolean): void {
    this.frustumCulling = enabled
  }

  // Frustum culling implementation
  private updateObjectVisibility(object: THREE.Object3D): void {
    if (!this.frustumCulling) {
      this.visibleObjects.add(object)
      return
    }

    const frustum = new THREE.Frustum()
    const matrix = new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(matrix)

    const isVisible = this.isObjectInFrustum(object, frustum)
    if (isVisible) {
      this.visibleObjects.add(object)
    } else {
      this.visibleObjects.delete(object)
    }
  }

  private isObjectInFrustum(object: THREE.Object3D, frustum: THREE.Frustum): boolean {
    // Get world position to handle parent-child relationships correctly
    const worldPosition = new THREE.Vector3()
    object.getWorldPosition(worldPosition)

    // Check distance first
    const distance = this.camera.position.distanceTo(worldPosition)
    if (distance > this.maxRenderDistance) {
      return false
    }

    // Check if object has a bounding box
    if (object instanceof THREE.Mesh && object.geometry.boundingBox) {
      const box = object.geometry.boundingBox.clone()
      box.applyMatrix4(object.matrixWorld)
      return frustum.intersectsBox(box)
    }

    // Fallback: check world position
    return frustum.containsPoint(worldPosition)
  }

  // Level of Detail (LOD) implementation
  public setLODLevel(object: THREE.Object3D, level: number): void {
    this.lodLevels.set(object, level)
  }

  private updateLOD(object: THREE.Object3D): void {
    if (!this.adaptiveQuality) return

    // Get world position to handle parent-child relationships correctly
    const worldPosition = new THREE.Vector3()
    object.getWorldPosition(worldPosition)

    const distance = this.camera.position.distanceTo(worldPosition)
    const maxDistance = this.maxRenderDistance

    // Only update LOD if distance changed significantly (throttling)
    const currentLODLevel = this.lodLevels.get(object)
    const newLODLevel = Math.floor((distance / maxDistance) * 3) // 0, 1, 2

    if (currentLODLevel === newLODLevel) return // Skip if no change

    this.lodLevels.set(object, newLODLevel)

    if (object instanceof THREE.Mesh) {
      // Adjust visibility based on LOD level
      if (newLODLevel >= 2) {
        // Hide very distant objects
        object.visible = distance < maxDistance * 0.7
      } else if (newLODLevel === 1) {
        // Show but with reduced quality (could reduce geometry detail here)
        object.visible = true
        // Future: could swap to lower detail geometry
      } else {
        // Full quality for close objects
        object.visible = true
      }
    }
  }

  private updateLODForAllObjects(): void {
    if (!this.adaptiveQuality) return

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
        this.updateLOD(object)
      }
    })
  }

  private updateVisibilityForAllObjects(): void {
    if (!this.frustumCulling) return

    const frustum = new THREE.Frustum()
    const matrix = new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(matrix)

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
        const isVisible = this.isObjectInFrustum(object, frustum)
        object.visible = isVisible

        if (isVisible) {
          this.visibleObjects.add(object)
        } else {
          this.visibleObjects.delete(object)
        }
      }
    })
  }

  // Batch operations for better performance
  public addBatch(objects: THREE.Object3D[]): void {
    objects.forEach((obj) => this.scene.add(obj))
    // Update visibility for new objects immediately
    if (this.frustumCulling) {
      this.updateBatchVisibility(objects)
    }
  }

  public removeBatch(objects: THREE.Object3D[]): void {
    objects.forEach((obj) => {
      this.scene.remove(obj)
      this.visibleObjects.delete(obj)
      this.lodLevels.delete(obj)
    })
  }

  private updateBatchVisibility(objects: THREE.Object3D[]): void {
    if (!this.frustumCulling) {
      objects.forEach((obj) => this.visibleObjects.add(obj))
      return
    }

    const frustum = new THREE.Frustum()
    const matrix = new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(matrix)

    objects.forEach((obj) => {
      const isVisible = this.isObjectInFrustum(obj, frustum)
      if (isVisible) {
        this.visibleObjects.add(obj)
      } else {
        this.visibleObjects.delete(obj)
      }
    })
  }

  public startRender(): void {
    if (!this.isRendering) {
      this.isRendering = true
      this.render()
    }
  }

  public stopRender(): void {
    this.isRendering = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  public play(): void {
    this.startRender()
  }

  public stop(): void {
    this.stopRender()
    this.animate()
  }

  public animate(): void {
    this.renderer.render(this.scene, this.camera)
    this.labelRenderer?.render(this.scene, this.camera)
  }

  private render(): void {
    if (!this.isRendering) return

    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastFrameTime

    // Frame rate limiting
    if (deltaTime < this.frameTime) {
      this.animationId = requestAnimationFrame(() => this.render())
      return
    }

    this.lastFrameTime = currentTime
    this.animationId = requestAnimationFrame(() => this.render())

    // Update controls if available
    if (this.controls) this.controls.update()

    // Render the scene
    this.renderer.render(this.scene, this.camera)
    this.labelRenderer?.render(this.scene, this.camera)
  }

  private handleResize(): void {
    const canvas = this.renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // Update camera aspect ratio
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    // Update renderer size
    this.renderer.setSize(width, height)
    const context = this.renderer.getContext()
    this.renderer.setViewport(0, 0, context.drawingBufferWidth, context.drawingBufferHeight)
  }

  // Explicitly set render size (useful when not relying on canvas CSS sizing)
  public setSize(width: number, height: number): void {
    if (this.camera) {
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }
    if (this.renderer) {
      this.renderer.setSize(width, height)
      const context = this.renderer.getContext()
      this.renderer.setViewport(0, 0, context.drawingBufferWidth, context.drawingBufferHeight)
    }
    if (this.labelRenderer) this.labelRenderer.setSize(width, height)
  }

  // Initialize CSS2DRenderer for labels
  public initLabel(container: HTMLElement): void {
    this.labelRenderer = new CSS2DRenderer()
    // use current canvas client rect for sizing
    const { clientWidth, clientHeight } = this.renderer.domElement
    this.labelRenderer.setSize(clientWidth, clientHeight)
    this.labelRenderer.domElement.className = 'label-box'
    container.appendChild(this.labelRenderer.domElement)
  }

  // Raycast helpers
  public findInteract(coord: { x: number; y: number }, objects: THREE.Object3D[]): THREE.Intersection[] {
    this.mouse.set(coord.x, coord.y)
    this.raycaster.setFromCamera(this.mouse, this.camera)
    return this.raycaster.intersectObjects(objects, true)
  }

  // Camera state helpers (compatible with legacy Player)
  public saveCamera(): cameraType {
    const rotationArray = this.camera.rotation.toArray() as rotationType
    return {
      position: this.camera.position.toArray(),
      rotation: rotationArray,
      target: this.controls?.target.toArray() ?? [0, 0, 0],
    }
  }

  public applySavedCamera(state: cameraType): void {
    this.setCameraState(state)
  }

  public setCameraState(state: cameraType): void {
    if (state.position) this.camera.position.fromArray(state.position)
    if (state.rotation) this.camera.rotation.fromArray(state.rotation)
    if (state.target && this.controls) this.controls.target.fromArray(state.target)
  }

  // Camera control methods
  public viewX(): void {
    this.camera.position.set(10, 0, 0)
    this.camera.lookAt(0, 0, 0)
    this.controls?.target.set(0, 0, 0)
  }

  public viewY(): void {
    this.camera.position.set(0, 10, 0)
    this.camera.lookAt(0, 0, 0)
    this.controls?.target.set(0, 0, 0)
  }

  public viewZ(): void {
    this.camera.position.set(0, 0, 10)
    this.camera.lookAt(0, 0, 0)
    this.controls?.target.set(0, 0, 0)
  }

  public zoomIn(): void {
    this.camera.zoom = Math.min(10, this.camera.zoom + 0.1)
    this.camera.updateProjectionMatrix()
  }

  public zoomOut(): void {
    this.camera.zoom = Math.max(0.1, this.camera.zoom - 0.1)
    this.camera.updateProjectionMatrix()
  }

  public dispose(): void {
    this.stopRender()
    window.removeEventListener('resize', this.handleResize)

    // Dispose of renderer
    this.renderer.dispose()

    // Clear performance tracking
    this.visibleObjects.clear()
    this.lodLevels.clear()

    // Clear scene
    while (this.scene.children.length > 0) {
      const object = this.scene.children[0]
      this.scene.remove(object)
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    }
  }
}

// Utility functions for camera setup
export const setCamera = (
  camera: THREE.PerspectiveCamera,
  position: { x: number; y: number; z: number },
  lookAt?: { x: number; y: number; z: number },
): void => {
  camera.position.set(position.x, position.y, position.z)
  if (lookAt) {
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z)
  }
}

export const createOrbitControls = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): any => {
  return new OrbitControls(camera, renderer.domElement)
}

export const createBasicLighting = (scene: THREE.Scene): void => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
  scene.add(ambientLight)

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 10, 5)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  scene.add(directionalLight)
}
