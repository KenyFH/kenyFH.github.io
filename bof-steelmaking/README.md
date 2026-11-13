# 转炉炼钢 · 三维工艺与物流演示

在线地址：https://kenyfh.github.io/bof-steelmaking/

本目录为可直接由 GitHub Pages 提供服务的静态网页，使用本地 Three.js，不依赖外部三维模型服务。需要支持 WebGL 的现代浏览器。

## 新版内容

17 个作业步骤、226 秒教学动画。新增铁水罐车与废钢料槽车进场、加料天车挂钩起升、桥架行走、小车横移、副钩倾翻、空槽与空罐回运落车摘钩、钢包车就位及转运、浇铸天车吊包与浇铸支架落座、钢包底注连铸。

操作平台包括连接的格栅钢平台、梁柱支撑与斜撑、双跑楼梯、中间休息平台、护栏及踢脚构件、操作室及控制台；新增“操作平台”观察视角。炉体倾转和物料吊运区域保持示意开口。

右侧说明分为：工艺与调度、温度与反应、物料与设计。展示氧化脱碳、脱硅锰与脱磷、脱氧、传热及凝固的原理说明和参考链接。

用量以目标100 t液态钢为统一示例：铁水90 t、废钢20 t、供氧5500 Nm³、石灰5 t、白云石质造渣料2 t；这些是教学设计假设，不是完成元素、热量和质量衡算后的配料单。文献范围、设计假设与换算值分别标注。铁水1350°C、终点1650°C和连铸过热度算例均不作为所有钢种统一控制值。

## 交互

播放/暂停、重播、0.5/1/2倍速、进度拖动、17步跳转、点击设备查看、旋转缩放、全景/聚焦转炉/操作平台、设备标注与剖面切换、全屏。时间轴支持横向滚动，手机浏览也可用。

## 文件

- app.js：场景与播放。
- logistics.js：车辆、两台天车、吊具及按时间确定的运输路径。
- platform.js：操作平台、楼梯和支撑结构。
- process.js / process-core.js：运输冶炼工序解说与时间安排。
- science.js：温度、反应、物料参数、口径及引用。
- vendor/：Three.js 与 OrbitControls，许可见 LICENSE.three.txt。

## 验证与边界

实际 Chrome 检查17步跳转、播放暂停、说明页签、物料参数行数、1600×1000桌面、390×844手机无水平溢出。逐段核对三类物料在相邻工序边界的位置连续，未发现物料瞬移；独立浏览器渲染未发现页面脚本错误。对比检查了场景色彩、三维模型、完整平台结构、两类天车及吊索、17步时间轴和手机说明区。

天车通行高度、路径、容量、平台净空及生产节拍均为原理示意，未作工程碰撞校核或起重机选型。现场分工和互锁按实际车间制度执行。精炼路线按钢种选择，检测只演示合格路径。

## 主要参考

- 欧盟JRC，Iron and Steel Production BREF（2012），第7章：https://bureau-industrial-transformation.jrc.ec.europa.eu/sites/default/files/2019-11/IS_Adopted_03_2012.pdf
- IIT Kanpur / NPTEL，Converter Steelmaking Practice：https://archive.nptel.ac.in/content/storage2/courses/113104059/lecture12/12_3.htm
- NPTEL，Material Balance：https://archive.nptel.ac.in/content/storage2/courses/113104059/lecture11/11_5.html
- NPTEL，Dephosphorization：https://archive.nptel.ac.in/content/storage2/courses/113104059/lecture8/8_5.htm
- Konecranes，Metals industry material handling：https://www.konecranes.com/sites/default/files/2022-10/Metals_smallbook_EN_web_2022.pdf

## 自动镜头与炉内反应增强

默认自动聚焦到当前工序区域，平滑追踪运输物料、炉内吹炼、出钢及连铸。拖动、缩放或选择固定观察视角会临时接管镜头，下一工序恢复；关闭“自动聚焦”可一直自由观察。尊重系统减少动态效果设置。

吹炼时展示变形熔池、氧流冲击凹坑、熔池气泡、泡沫渣起伏、金属液滴与向烟罩逸出的烟气。反应随降枪、吹炼、提枪启停，暂停及进度定位会固定在对应反应状态。效果为教学增强，不是 CFD 计算或反应强度测量。
