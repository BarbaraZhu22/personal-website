declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera } from 'three'
  
  export class OrbitControls {
    constructor(object: Camera, domElement?: HTMLElement)
    object: Camera
    domElement: HTMLElement | HTMLDocument
    enabled: boolean
    target: import('three').Vector3
    minDistance: number
    maxDistance: number
    minZoom: number
    maxZoom: number
    minPolarAngle: number
    maxPolarAngle: number
    minAzimuthAngle: number
    maxAzimuthAngle: number
    enableDamping: boolean
    dampingFactor: number
    enableZoom: boolean
    zoomSpeed: number
    enableRotate: boolean
    rotateSpeed: number
    enablePan: boolean
    panSpeed: number
    screenSpacePanning: boolean
    keyPanSpeed: number
    autoRotate: boolean
    autoRotateSpeed: number
    enableKeys: boolean
    keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string }
    mouseButtons: {
      LEFT: number | null
      MIDDLE: number | null
      RIGHT: number | null
    }
    touches: { ONE: number | null; TWO: number | null }
    update(): boolean
    reset(): void
    dispose(): void
    addEventListener(type: string, listener: (...args: any[]) => void): void
    removeEventListener(type: string, listener: (...args: any[]) => void): void
    dispatchEvent(event: { type: string }): void
    getPolarAngle(): number
    getAzimuthalAngle(): number
    getDistance(): number
    listenToKeyEvents(domElement: HTMLElement | Window): void
    stopListenToKeyEvents(): void
    saveState(): void
    getCenter(target: import('three').Vector3): import('three').Vector3
    copy(state: OrbitControls): void
  }
}

declare module 'three/examples/jsm/renderers/CSS2DRenderer' {
  import { Camera, Scene, Object3D } from 'three'
  
  export class CSS2DObject extends Object3D {
    constructor(element: HTMLElement)
    element: HTMLElement
    onBeforeRender: (renderer: CSS2DRenderer, scene: Scene, camera: Camera) => void
    onAfterRender: (renderer: CSS2DRenderer, scene: Scene, camera: Camera) => void
  }
  
  export class CSS2DRenderer {
    constructor()
    domElement: HTMLElement
    setSize(width: number, height: number): void
    render(scene: Scene, camera: Camera): void
  }
}

