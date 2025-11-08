### title
Éditeur DataCube
### description:
Objectif : Transformer de vastes tableaux de données en visualisations 3D précises pour repérer les extrêmes et les tendances globales
Un agent suggère automatiquement des dimensions statistiques pertinentes comme le temps ou la région
Permet de segmenter ou d'étendre n'importe quelle dimension pour explorer des insights détaillés
### detail
Rendu instancié : Construit avec InstancedMesh de Three.js pour afficher de grands ensembles de colonnes à partir d'une seule BoxGeometry
Transformations matricielles : Calcule une matrice par instance ; les mises à l'échelle contrôlent hauteur et largeur tandis que les translations positionnent chaque colonne
Encodage visuel : Mappe les plages de données sur une échelle de couleurs prédéfinie et applique InstancedMaterial pour des retours visuels différenciés
Optimisations des performances : Réduit les draw calls grâce à l'instanciation et s'appuie sur la sélection par instance pour une interaction fluide
### technologies:
["TypeScript", "Three.js", "GLSL"]
### image:
"/images/pic-video-cover-数方编辑器.jpg"
### video:
"/videos/v-数方编辑器.mp4"
### link:''
### islink:false

### title
Éditeur de Modèles 3D
### description:
Objectif : Permettre aux designers et analystes de composer des scènes 3D complexes en un clic
Accepte plusieurs formats de modèles 3D, analyse automatiquement textures, normales et matériaux pour un rendu immédiat
Inclut une bibliothèque de matériaux et des préréglages d’éclairage avec panneau paramétrique pour des ajustements rapides
Propose disposition par glisser-déposer, gestion hiérarchique, regroupement, duplication et alignement de modèles
Prend en charge la liaison de logiques d'interaction pour afficher des panneaux d'information personnalisés au clic ou à la sélection
### detail
Optimisation des modèles : Simplifie les maillages et compresse les textures à l'import pour équilibrer qualité et performances
Débogage visuel : Offre un aperçu de l'éclairage en temps réel et des panneaux de réglage des ombres pour accélérer les itérations
Système d'interaction : Intègre le ray casting avec des poignées précises de translation, rotation et mise à l'échelle
### technologies:
["TypeScript", "Three.js", "GLSL"]
### image:
"/images/pic-video-cover-3D模型编辑器.jpg"
### video:
"/videos/v-3D模型编辑器.mp4"
### link:''
### islink:false

### title
Constructeur de Visualisations
### description:
Objectif : Permettre aux équipes non techniques de créer des tableaux de bord de démonstration en quelques minutes
Un agent suggère structures de page et disposition des composants à partir d'instructions en langage naturel
Thèmes globaux, échelles typographiques et points de rupture responsives configurables avec aperçu instantané
Autorise les ajustements fins par composant et la configuration d'animations interactives
### detail
Édition low-code : Éditeur par glisser-déposer associé à un panneau de propriétés pour un contrôle précis
### technologies:
["TypeScript", "Agent-Based Interaction Design"]
### image:
"/images/pic-video-cover-可视化编辑器.jpg"
### video:
"/videos/v-可视化编辑器.mp4"
### link:''
### islink:false


