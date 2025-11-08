### title
Editor DataCube
### description:
Objetivo: Transformar datos tabulares masivos en visualizaciones 3D precisas para detectar extremos y tendencias con confianza
Un agente recomienda automáticamente dimensiones estadísticas relevantes como tiempo o región
Permite segmentar o ampliar cualquier dimensión específica para explorar insights detallados
### detail
Renderizado instanciado: Construido con Three.js InstancedMesh para renderizar conjuntos masivos de columnas con una sola BoxGeometry
Transformaciones matriciales: Calcula una matriz por instancia; las escalas controlan altura y grosor mientras las traslaciones posicionan cada columna
Codificación visual: Asigna rangos de datos a una escala de color predefinida y aplica InstancedMaterial para señales visuales diferenciadas
Optimizaciones de rendimiento: Reduce las draw calls mediante instanciado y combina selección por instancia para respuestas fluidas
### technologies:
["TypeScript", "Three.js", "GLSL"]
### image:
"/images/pic-video-cover-数方编辑器.jpg"
### video:
"/videos/v-数方编辑器.mp4"
### link:''
### islink:false

### title
Editor de Modelos 3D
### description:
Objetivo: Permitir que diseñadoras y analistas armen escenas 3D complejas con un solo clic
Acepta múltiples formatos de modelos 3D y analiza texturas, normales y materiales para dejarlos listos para renderizar
Incluye biblioteca de materiales y presets de iluminación con panel paramétrico para ajustes rápidos
Ofrece diseño por arrastrar y soltar, gestión jerárquica, agrupación, duplicación y alineación de modelos
Admite vincular lógica de interacción para mostrar paneles de información personalizados al hacer clic o seleccionar
### detail
Optimización de modelos: Simplifica mallas y comprime texturas al importar para equilibrar fidelidad y rendimiento
Depuración visual: Proporciona previsualización de iluminación en tiempo real y paneles para ajustar sombras y acelerar iteraciones
Sistema de interacción: Integra ray casting con controles precisos de traslado, rotación y escala
### technologies:
["TypeScript", "Three.js", "GLSL"]
### image:
"/images/pic-video-cover-3D模型编辑器.jpg"
### video:
"/videos/v-3D模型编辑器.mp4"
### link:''
### islink:false

### title
Constructor de Visualizaciones
### description:
Objetivo: Permitir que el equipo no técnico construya dashboards de demostración en minutos
Un agente sugiere estructuras de página y disposición de componentes a partir de indicaciones en lenguaje natural
Temas globales, escalas tipográficas y puntos de quiebre responsivos configurables con vista previa instantánea
Permite ajustes finos por componente y configuración de animaciones interactivas
### detail
Edición low-code: Lienzo de arrastrar y soltar acompañado de panel de propiedades para control detallado
### technologies:
["TypeScript", "Agent-Based Interaction Design"]
### image:
"/images/pic-video-cover-可视化编辑器.jpg"
### video:
"/videos/v-可视化编辑器.mp4"
### link:''
### islink:false


