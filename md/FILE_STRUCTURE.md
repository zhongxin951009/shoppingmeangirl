# 项目文件结构

## 📂 完整目录树

```
shopping-mean-girl/
│
├── 📁 front/                          # 前端文件夹
│   ├── 📄 index.html                  # 主应用（完整版）⭐
│   ├── 📄 standalone.html             # 独立版本（推荐）⭐⭐⭐
│   ├── 📄 simple.html                 # 简化版本
│   ├── 📄 debug.html                  # 调试版本
│   ├── 📄 test.html                   # 效果演示
│   ├── 🎨 style.css                   # 样式文件
│   ├── 📜 script.js                   # 主要逻辑
│   ├── 🖼️ mean-girls.jpg              # 品牌图片
│   ├── 📖 README.md                   # 前端说明
│   └── 📖 IMAGE_SETUP.md              # 图片设置说明
│
├── 📁 server/                         # 后端文件夹（可选）
│   ├── 📜 app.js                      # Express 服务器
│   └── 📦 package.json                # 依赖配置
│
├── 📁 .vscode/                        # VS Code 配置
│   └── ⚙️ settings.json               # 编辑器设置
│
├── 🗄️ database.sql                    # 数据库结构
│
├── 📖 readme.md                       # 项目说明 ⭐
├── 📖 QUICK_START.md                  # 快速启动指南
├── 📖 TROUBLESHOOTING.md              # 故障排除指南
├── 📖 DEPLOYMENT.md                   # 部署指南
├── 📖 CHANGELOG.md                    # 更新日志
├── 📖 PROJECT_SUMMARY.md              # 项目总结
├── 📖 DEMO.md                         # 使用演示
├── 📖 CONTRIBUTING.md                 # 贡献指南
├── 📖 CHECKLIST.md                    # 检查清单
├── 📖 FILE_STRUCTURE.md               # 文件结构（本文件）
│
├── ⚙️ .env.example                    # 环境变量示例
├── ⚙️ vercel.json                     # Vercel 配置
├── 📝 .gitignore                      # Git 忽略文件
└── 📜 LICENSE                         # MIT 许可证
```

## 📄 文件说明

### 前端 HTML 文件

#### index.html ⭐
**用途：** 主应用，完整功能版本  
**特点：**
- 包含所有功能
- 需要配置 API
- 集成 Supabase 和智谱 AI
- 适合生产环境

**何时使用：**
- 需要完整功能
- 已配置 API 密钥
- 准备部署到生产环境

#### standalone.html ⭐⭐⭐ (推荐)
**用途：** 独立运行版本  
**特点：**
- 无需任何配置
- 不依赖外部库
- 功能完整
- 错误处理完善

**何时使用：**
- 首次测试
- 快速演示
- 不需要 API 功能
- 遇到问题时的备用方案

#### simple.html
**用途：** 简化版本  
**特点：**
- 最小化代码
- 使用内联事件
- 易于理解
- 适合学习

**何时使用：**
- 学习代码结构
- 理解基本逻辑
- 快速原型

#### debug.html
**用途：** 调试版本  
**特点：**
- 显示实时调试信息
- 检查元素状态
- 图片加载状态
- 帮助定位问题

**何时使用：**
- 遇到问题时
- 开发新功能
- 性能分析

#### test.html
**用途：** 效果演示  
**特点：**
- 展示设计效果
- 测试动画
- 演示样式
- 不包含完整功能

**何时使用：**
- 展示设计
- 测试动画效果
- 向他人演示

### 样式和脚本

#### style.css
**内容：**
- 全局样式重置
- 布局样式（Grid, Flexbox）
- 组件样式（卡片、按钮等）
- 动画效果
- 响应式设计
- 主题配色

**特点：**
- 所有 HTML 文件共用
- 使用 CSS3 现代特性
- 完整的响应式支持
- 粉色主题贯穿

#### script.js
**内容：**
- ConsumptionAdvisor 类
- 事件处理
- API 调用
- 数据管理
- 动画控制
- 错误处理

**特点：**
- ES6+ 语法
- 模块化设计
- 完善的注释
- 错误处理机制

#### mean-girls.jpg
**说明：**
- Mean Girls 电影剧照
- 品牌形象图片
- 建议尺寸：800x450px
- 格式：JPG
- 大小：< 200KB

### 文档文件

#### readme.md ⭐
**主要项目说明文档**
- 项目概述
- 功能特点
- 快速开始
- 技术栈
- 使用流程

#### QUICK_START.md
**快速启动指南**
- 三种启动方法
- 配置说明
- 页面效果说明
- 常见问题

#### TROUBLESHOOTING.md
**故障排除指南**
- 常见错误解决
- 浏览器兼容性
- 调试技巧
- 获取帮助

#### DEPLOYMENT.md
**部署指南**
- 静态部署
- 服务器部署
- Docker 部署
- 环境配置
- 安全设置

#### CHANGELOG.md
**更新日志**
- 版本历史
- 功能更新
- Bug 修复
- 计划功能

#### PROJECT_SUMMARY.md
**项目总结**
- 项目概述
- 已完成功能
- 技术栈
- 设计规范
- 开发进度

#### DEMO.md
**使用演示**
- 功能演示
- 动画效果
- 交互流程
- 录制建议

#### CONTRIBUTING.md
**贡献指南**
- 如何贡献
- 代码规范
- 提交流程
- 测试要求

#### CHECKLIST.md
**检查清单**
- 已完成项目
- 待开发功能
- 测试清单
- 发布检查

#### FILE_STRUCTURE.md
**文件结构说明（本文件）**
- 目录树
- 文件说明
- 使用建议

### 配置文件

#### database.sql
**数据库结构**
- 表定义
- 索引
- RLS 策略
- 示例数据

#### .env.example
**环境变量示例**
- Supabase 配置
- 智谱 AI 配置
- 服务器配置
- 第三方服务

#### vercel.json
**Vercel 部署配置**
- 构建设置
- 路由规则
- 函数配置

#### .gitignore
**Git 忽略文件**
- node_modules
- 环境变量
- 编辑器配置
- 临时文件

#### LICENSE
**MIT 许可证**
- 开源协议
- 使用条款

### 服务器文件

#### server/app.js
**Express 服务器**
- 路由定义
- API 接口
- 文件上传
- 错误处理

#### server/package.json
**依赖配置**
- Express
- CORS
- Multer
- 其他依赖

## 📊 文件大小参考

```
front/
├── index.html          ~15 KB
├── standalone.html     ~12 KB
├── simple.html         ~10 KB
├── debug.html          ~13 KB
├── test.html           ~8 KB
├── style.css           ~25 KB
├── script.js           ~35 KB
└── mean-girls.jpg      ~150 KB (建议)

Total: ~268 KB
```

## 🎯 使用建议

### 新手用户
1. 打开 `readme.md` 了解项目
2. 阅读 `QUICK_START.md` 快速开始
3. 打开 `front/standalone.html` 测试
4. 遇到问题查看 `TROUBLESHOOTING.md`

### 开发者
1. 阅读 `PROJECT_SUMMARY.md` 了解架构
2. 查看 `CONTRIBUTING.md` 了解规范
3. 使用 `front/debug.html` 开发调试
4. 参考 `CHECKLIST.md` 跟踪进度

### 部署人员
1. 阅读 `DEPLOYMENT.md` 部署指南
2. 配置 `database.sql` 数据库
3. 设置 `.env` 环境变量
4. 部署 `front/index.html` 到生产环境

## 🔍 快速查找

### 想要...
- **快速测试** → `front/standalone.html`
- **完整功能** → `front/index.html`
- **学习代码** → `front/simple.html`
- **调试问题** → `front/debug.html`
- **查看效果** → `front/test.html`

### 需要...
- **使用说明** → `readme.md`
- **快速开始** → `QUICK_START.md`
- **解决问题** → `TROUBLESHOOTING.md`
- **部署应用** → `DEPLOYMENT.md`
- **贡献代码** → `CONTRIBUTING.md`

## 📝 文件命名规范

### HTML 文件
- 小写字母
- 连字符分隔
- 描述性名称
- 例：`standalone.html`, `debug.html`

### 文档文件
- 大写字母
- 下划线分隔
- 全大写（除 readme.md）
- 例：`QUICK_START.md`, `DEPLOYMENT.md`

### 配置文件
- 小写字母
- 点开头（隐藏文件）
- 例：`.gitignore`, `.env.example`

## 🎉 总结

项目包含：
- **10 个 HTML 文件**（5 个在 front/）
- **2 个 CSS 文件**（1 个主要）
- **2 个 JS 文件**（1 个主要）
- **12 个文档文件**
- **6 个配置文件**
- **1 个图片文件**

总计：**33 个文件**

核心文件：**3 个**（index.html, style.css, script.js）

推荐入口：**standalone.html** ⭐⭐⭐

---

💖 **Your Shopping Mean Girl** - 文件结构清晰，易于维护！