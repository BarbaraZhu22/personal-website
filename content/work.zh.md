### title
数方编辑器
### description:
目的：将大数据量表格精准转化成三维可视化，轻松观察数据极值和整体走势
Agent 智能选择合适的统计维度，如时间、区域等有统计意义的字段
支持切割或展开某一具体维度，帮助深入观察数据细节
### detail
实例化渲染：使用 Three.js 的 InstancedMesh 技术，通过单个几何体 (BoxGeometry) 配合多个实例矩阵，高效渲染大规模柱体群
矩阵变换：为每个柱体计算独立的实例矩阵，通过矩阵缩放控制柱体高度与粗细，通过矩阵平移确定柱体位置
视觉编码：采用颜色映射方案，将数据值范围映射到预设色阶，通过实例化材质 (InstancedMaterial) 为不同柱体赋予差异化视觉表现
性能优化：通过实例化渲染减少绘制调用次数 (Draw Call)，结合实例化拾取技术实现高效的元素选择交互
### technologies:
["TypeScript", "Three.js", "GLSL"]
### image:
"/images/pic-video-cover-数方编辑器.jpg"
### video:
"/videos/v-数方编辑器.mp4"
### link:''
### islink:false

### title
3D模型编辑器
### description:
目的：让设计师与数据分析师都能一键完成复杂 3D 场景的搭建
支持上传多种 3D 模型格式，自动解析贴图、法线与材质并完成渲染适配
提供材质库与灯光模板，可通过参数化面板快速调整纹理、反射、粗糙度等属性
内置拖拽布局与层级管理，支持多模型组合、复制与对齐
支持绑定交互逻辑，在点击或选中模型时显示自定义信息面板
### detail
模型优化：在导入时进行网格精简与纹理压缩，平衡画质与运行性能
可视化调试：实时光照预览与阴影调试面板，缩短调试时间
交互系统：集成射线拾取，支持精准平移、旋转、缩放
### technologies:
["TypeScript", "Three.js", "GLSL"]
### image:
"/images/pic-video-cover-3D模型编辑器.jpg"
### video:
"/videos/v-3D模型编辑器.mp4"
### link:''
### islink:false

### title
可视化编辑器
### description:
目的：让非技术成员在短时间内搭建产品演示可视化页面
Agent 可根据自然语言指令推荐页面结构与组件布局
允许设置全局主题、排版比例与响应式断点并即时预览
支持针对单个组件的样式微调与交互动效配置
### detail
低代码编辑：基于拖拽的画布编辑，搭配属性侧栏提供精细化控制
### technologies:
["TypeScript", "Agent-Based Interaction Design"]
### image:
"/images/pic-video-cover-可视化编辑器.jpg"
### video:
"/videos/v-可视化编辑器.mp4"
### link:''
### islink:false


