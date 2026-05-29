# AE 3D 图层动画生成器

一个功能强大的 After Effects CEP 扩展面板，用于自动创建图层的3D动画效果。

## 功能特性

### 🎯 核心功能

- ✅ **自动3D启用** - 一键为所有图层启用3D开关
- ✅ **智能深度关系** - 自动为图层设置Z轴深度关系
- ✅ **自动摄像机创建** - 生成优化的3D摄像机
- ✅ **灯光系统** - 可选的关键灯和补光
- ✅ **多种动画预设**：
  - 🔄 旋转动画（Z轴旋转）
  - ↔️ 滑动动画（3D透视效果）
  - 🔍 缩放动画（Z深度变化）
  - 〰️ 波浪动画（层级效果）

### ⚙️ 高级功能

- 🎨 自定义动画时长
- 📏 可调节的摄像机距离
- 💪 旋转强度调节
- 🎬 六种缓动函数预设
- 🌪️ 运动模糊效果
- 🎲 随机图层延迟
- 🎛️ 旋转角度微调

### 🖥️ UI界面

- 🎨 现代深色主题
- 📱 响应式设计
- ⚡ 实时参数预览
- 🔄 自动合成信息刷新
- 📊 动画进度显示

## 📥 安装说明

### ✅ 正确的CEP扩展安装位置

**Windows:**
```
C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\
```

**Mac:**
```
/Library/Application Support/Adobe/CEP/extensions/
```

### 📝 详细安装步骤

1. **克隆或下载项目**
   ```bash
   git clone https://github.com/Shiyou-Qi/ae-3d-layer-animator.git
   ```

2. **复制到CEP扩展文件夹**
   - 将整个 `ae-3d-layer-animator` 文件夹复制到上述路径
   - 正确的结构应该是：
   ```
   C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\
   └── ae-3d-layer-animator\
       ├── CSXS\manifest.xml
       ├── html\index.html
       ├── css\style.css
       ├── js\main.js
       ├── jsx\hostscript.js
       └── ...
   ```

3. **清除AE缓存（重要！）**
   - 关闭 After Effects
   - 删除缓存文件夹：
     ```
     C:\Users\[用户名]\AppData\Roaming\Adobe\CEP\
     C:\Users\[用户名]\AppData\Roaming\Adobe\Common\Media Cache\
     ```
   - 如果找不到，按 `Win+R` 输入 `%APPDATA%` 进入

4. **重启 After Effects**
   - 完全关闭所有AE进程
   - 重新打开 After Effects

5. **打开扩展**
   - 菜单 → **窗口** → **3D图层动画生成器**
   - 如果菜单中看不到，尝试重启AE或检查安装路径

## 🚀 使用指南

### 基本流程

1. **打开项目**
   - 在 After Effects 中打开或新建一个项目
   - 导入 PSD 文件或创建多个图层

2. **打开扩展面板**
   - 菜单：`窗口 → 3D图层动画生成器`

3. **配置参数**
   - **动画时长**：设置动画持续时间（0.5-60秒）
   - **摄像机距离**：调整摄像机到图层的距离（500-3000px）
   - **旋转强度**：控制旋转幅度（0.5-2.0x）
   - **X/Y轴旋转**：微调旋转角度（-45°-45°）

4. **选择动画类型**
   - 🔄 旋转动画：Z轴旋转效果
   - ↔️ 滑动动画：3D透视滑动
   - 🔍 缩放动画：Z深度缩放
   - 〰️ 波浪动画：层级波浪效果

5. **选择缓动函数**
   - 线性：匀速
   - 加速：慢到快
   - 减速：快到慢
   - 加减速：平滑过渡
   - 弹性：弹簧反弹
   - 圆形加速：圆形运动

6. **配置处理选项**
   - ☑️ 启用所有图层的3D开关
   - ☑️ 自动设置图层深度关系
   - ☑️ 自动创建摄像机
   - ☑️ 创建灯光照明
   - ☑️ 添加运动模糊
   - ☑️ 随机图层延迟

7. **应用动画**
   - 点击 **"✨ 应用动画"** 按钮
   - 等待处理完成
   - 查看时间轴中的关键帧和动画效果

### 快速提示

- 🔄 点击 **"🔄 刷新信息"** 更新当前合成的详细数据
- 👁️ **"👁️ 预览"** 功能在下个版本中实现
- ↺ **"↺ 重置参数"** 恢复所有设置到默认值
- 💡 建议先创建一个新的合成来测试效果

## 🎬 动画类型详解

| 类型 | 效果 | 适用场景 |
|------|------|--------|
| 🔄 旋转 | Z轴360°旋转 | Logo、装饰、标题转场 |
| ↔️ 滑动 | 3D透视滑动 | 过渡效果、排列布局 |
| 🔍 缩放 | Z轴推进拉出 | 聚焦效果、层级关系 |
| 〰️ 波浪 | XY轴摇摆 | 动态效果、吸引注意 |

## 🔧 项目结构

```
ae-3d-layer-animator/
├── CSXS/
│   └── manifest.xml          # CEP扩展配置文件
├── html/
│   └── index.html            # UI界面（中文）
├── css/
│   └── style.css             # 完整样式（750+ 行）
├── js/
│   └── main.js               # 前端逻辑脚本
├── jsx/
│   └── hostscript.js         # After Effects脚本
├── lib/
│   └── jquery.js             # jQuery库
├── .gitignore
└── README.md                 # 本说明文档
```

## ⚙️ 技术规格

- **兼容版本**：After Effects 13.0 - 24.9
- **扩展类型**：CEP Panel (Common Extensibility Platform)
- **前端技术**：HTML5, CSS3, JavaScript
- **后端脚本**：ExtendScript (JSX)
- **支持语言**：中文、英文
- **主题**：深色主题（自适应）

## 🐛 故障排除

### 问题1：菜单中看不到扩展

**排查步骤：**
1. 检查安装路径是否正确：`C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
2. 确保文件夹名称为 `ae-3d-layer-animator`
3. 检查是否完全重启了 After Effects
4. 清除AE缓存后重启

**尝试方案：**
```
删除这些文件夹：
C:\Users\[用户名]\AppData\Roaming\Adobe\CEP\
C:\Users\[用户名]\AppData\Roaming\Adobe\Common\
然后完全重启AE
```

### 问题2：菜单有但无法打开

**排查步骤：**
1. 检查 `CSXS/manifest.xml` 格式是否正确
2. 验证 `html/index.html` 文件是否存在
3. 查看浏览器控制台是否有错误

**启用调试模式：**
```
创建文件：C:\Program Files (x86)\Common Files\Adobe\CEP\PlayerDebugMode
内容：PlayerDebugMode 1
```

### 问题3：打开后显示空白

**可能原因：**
- HTML加载路径错误
- CSS或JavaScript加载失败
- 浏览器控制台有错误

**解决方案：**
1. 启用调试模式查看控制台
2. 检查浏览器 F12 开发者工具
3. 确保所有文件编码为 UTF-8

### 问题4：脚本执行失败

**排查步骤：**
1. 确保已选择一个合成（不是项目）
2. 合成中需要有至少一个图层
3. 某些特殊图层（调整层等）可能不支持

## 🎨 自定义与扩展

### 修改UI样式
编辑 `css/style.css`：
- 更改颜色主题
- 调整窗口尺寸
- 修改字体和动画

### 添加新动画类型
编辑 `jsx/hostscript.js` 中的 `applyLayerAnimation()` 函数：
```javascript
else if (params.animationType === 'custom') {
    // 添加你的动画代码
}
```

### 增加新参数
1. 在 `html/index.html` 中添加HTML元素
2. 在 `js/main.js` 中绑定事件处理
3. 在 `jsx/hostscript.js` 中添加后端逻辑

## 📝 版本历史

### v1.0.0 (2024)
- ✨ 初始发布
- 🎬 四种动画预设
- ⚙️ 完整参数调节
- 🎨 美观的用户界面
- 📖 完整的功能文档
- 🔧 支持manifest.xml修复

## 📄 许可证

MIT License - 自由使用和修改

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 💬 反馈与支持

如有问题、建议或Bug反馈，请访问：
https://github.com/Shiyou-Qi/ae-3d-layer-animator/issues

---

**感谢使用本扩展！祝你创意无限！** 🎉✨

Made with ❤️ for After Effects creators
