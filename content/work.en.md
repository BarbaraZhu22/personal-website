### title
DataCube Editor
### description:
Goal: Transform large-scale tabular data into precise 3D visualizations to spot extremes and overall trends with confidence
An agent automatically recommends meaningful statistical dimensions such as time or region
Supports slicing or expanding any specific dimension to explore granular insights
### detail
Instanced rendering: Built with Three.js InstancedMesh to render massive pillar sets efficiently from a single BoxGeometry
Matrix transforms: Computes an instance matrix per pillar; scales control height and thickness while translations position each pillar
Visual encoding: Maps data ranges to a predefined color scale and applies InstancedMaterial for differentiated visual feedback
Performance optimizations: Minimizes draw calls through instancing and pairs with instance-level picking for responsive selection
### technologies:
["TypeScript", "Three.js", "GLSL"]
### image:
"/images/pic-video-cover-数方编辑器.jpg"
### video:
"/videos/v-数方编辑器.mp4"
### link:''
### islink:false

### title
3D Model Editor
### description:
Goal: Empower designers and analysts to assemble complex 3D scenes in one click
Accepts multiple 3D model formats, auto-parses textures, normals, and materials for rendering-ready assets
Includes a material library and lighting presets with a parametric panel for quick adjustments
Provides drag-and-drop layout, hierarchy management, multi-model grouping, duplication, and alignment
Supports binding interaction logic to display custom info panels on click or selection
### detail
Model optimization: Simplifies meshes and compresses textures on import to balance fidelity and performance
Visualization debugging: Offers real-time lighting previews and shadow tuning panels to reduce iteration time
Interaction system: Integrates ray casting with precise translate, rotate, and scale handles
### technologies:
["TypeScript", "Three.js", "GLSL"]
### image:
"/images/pic-video-cover-3D模型编辑器.jpg"
### video:
"/videos/v-3D模型编辑器.mp4"
### link:''
### islink:false

### title
Visualization Builder
### description:
Goal: Let non-technical teammates assemble product demo dashboards in minutes
Agent suggests page structures and component layouts from natural language prompts
Configurable global themes, typography scales, and responsive breakpoints with instant preview
Supports per-component style refinements and interactive animation settings
### detail
Low-code editing: Drag-and-drop canvas editing paired with a property sidebar for precise control
### technologies:
["TypeScript", "Agent-Based Interaction Design"]
### image:
"/images/pic-video-cover-可视化编辑器.jpg"
### video:
"/videos/v-可视化编辑器.mp4"
### link:''
### islink:false


