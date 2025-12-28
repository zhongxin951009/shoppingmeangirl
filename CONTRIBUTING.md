# 贡献指南

感谢你对 **Your Shopping Mean Girl** 项目的关注！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告 Bug
1. 检查 [Issues](../../issues) 确认问题未被报告
2. 创建新 Issue，包含：
   - 清晰的标题
   - 详细的问题描述
   - 复现步骤
   - 预期行为 vs 实际行为
   - 截图或 GIF（如适用）
   - 浏览器和操作系统信息

### 提出新功能
1. 在 Issues 中描述你的想法
2. 说明功能的使用场景
3. 等待维护者反馈
4. 获得批准后开始开发

### 提交代码
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 代码规范

### HTML
```html
<!-- 使用语义化标签 -->
<section class="step-content">
  <header class="step-header">
    <h2>标题</h2>
  </header>
</section>

<!-- 保持缩进一致（2空格） -->
<!-- 属性使用双引号 -->
<!-- 自闭合标签不加斜杠 -->
```

### CSS
```css
/* 使用有意义的类名 */
.option-card {
  /* 属性按字母排序 */
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px 20px;
  transition: all 0.3s ease;
}

/* 使用注释分隔不同部分 */
/* 避免使用 !important */
/* 优先使用 class 而非 id */
```

### JavaScript
```javascript
// 使用 ES6+ 语法
class MyClass {
  constructor() {
    this.property = 'value';
  }

  // 使用驼峰命名
  myMethod() {
    // 使用 const/let，避免 var
    const result = this.calculate();
    return result;
  }
}

// 添加注释说明复杂逻辑
// 使用有意义的变量名
// 保持函数简短（< 50行）
```

## 🎨 设计规范

### 颜色
- 主色：`#ff1493` (粉红)
- 辅色：`#ff69b4` (浅粉)
- 背景：`#667eea` → `#764ba2` (渐变)
- 文字：`#ffffff` (白色)

### 间距
- 小：8px, 12px
- 中：16px, 20px
- 大：30px, 40px

### 圆角
- 小：8px
- 中：12px, 16px
- 大：20px

### 动画
- 快速：0.2s - 0.3s
- 标准：0.3s - 0.5s
- 慢速：0.5s - 1s

## 🧪 测试要求

### 浏览器测试
- [ ] Chrome (最新版)
- [ ] Firefox (最新版)
- [ ] Safari (最新版)
- [ ] Edge (最新版)
- [ ] 移动端浏览器

### 功能测试
- [ ] 所有交互正常工作
- [ ] 动画流畅无卡顿
- [ ] 响应式布局正确
- [ ] 错误处理正常
- [ ] 无控制台错误

### 性能测试
- [ ] 页面加载时间 < 3秒
- [ ] 动画帧率 > 30fps
- [ ] 图片大小优化
- [ ] 无内存泄漏

## 📚 文档要求

### 代码注释
```javascript
/**
 * 生成步骤3的选项
 * @param {Object} userProfile - 用户画像数据
 * @param {Object} productInfo - 商品信息
 * @returns {Promise<Array>} 选项数组
 */
async function generateStep3Options(userProfile, productInfo) {
  // 实现...
}
```

### README 更新
- 添加新功能时更新 README.md
- 包含使用示例
- 更新功能列表

### CHANGELOG 更新
- 记录所有重要更改
- 使用统一格式
- 包含版本号和日期

## 🔍 Pull Request 检查清单

提交 PR 前请确认：

- [ ] 代码符合项目规范
- [ ] 通过所有测试
- [ ] 更新了相关文档
- [ ] 添加了必要的注释
- [ ] 没有引入新的警告或错误
- [ ] 提交信息清晰明确
- [ ] 分支基于最新的 main 分支

## 📋 提交信息规范

使用以下格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

### 示例
```
feat(step1): 添加粉红星星动画

- 实现卡片悬停时的星星效果
- 添加旋转和缩放动画
- 优化动画性能

Closes #123
```

## 🎯 开发流程

### 1. 设置开发环境
```bash
# 克隆仓库
git clone https://github.com/yourusername/shopping-mean-girl.git
cd shopping-mean-girl

# 安装依赖（如需要后端）
cd server
npm install

# 启动开发服务器
npm run dev
```

### 2. 创建功能分支
```bash
git checkout -b feature/my-new-feature
```

### 3. 开发和测试
```bash
# 在浏览器中测试
# 打开 front/debug.html 查看调试信息
```

### 4. 提交更改
```bash
git add .
git commit -m "feat: add my new feature"
```

### 5. 推送和创建 PR
```bash
git push origin feature/my-new-feature
# 在 GitHub 上创建 Pull Request
```

## 🐛 调试技巧

### 使用调试版本
```bash
# 打开 debug.html 查看实时信息
open front/debug.html
```

### 浏览器开发者工具
```javascript
// 添加断点
debugger;

// 输出日志
console.log('Debug info:', data);
console.table(array);
console.time('operation');
// ... code ...
console.timeEnd('operation');
```

### 常见问题
1. **图片不显示** - 检查文件路径和名称
2. **动画卡顿** - 使用 CSS transform 而非 position
3. **API 调用失败** - 检查 CORS 和网络请求
4. **样式不生效** - 检查 CSS 选择器优先级

## 💡 最佳实践

### 性能
- 使用 CSS 动画而非 JavaScript
- 避免频繁的 DOM 操作
- 使用事件委托
- 图片懒加载

### 可访问性
- 使用语义化 HTML
- 添加 ARIA 标签
- 确保键盘可访问
- 提供替代文本

### 安全
- 验证所有用户输入
- 使用 HTTPS
- 不在前端存储敏感信息
- 防止 XSS 攻击

### 可维护性
- 保持函数简短
- 使用有意义的命名
- 添加适当的注释
- 避免重复代码

## 🎓 学习资源

### 推荐阅读
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)
- [Web.dev](https://web.dev/)

### 相关技术
- CSS Grid & Flexbox
- CSS 动画和过渡
- ES6+ JavaScript
- Fetch API
- LocalStorage API

## 📞 获取帮助

### 联系方式
- GitHub Issues: [项目 Issues](../../issues)
- 讨论区: [GitHub Discussions](../../discussions)
- 邮箱: [your-email@example.com]

### 响应时间
- Bug 报告: 1-2 工作日
- 功能请求: 3-5 工作日
- Pull Request: 2-3 工作日

## 🎉 贡献者

感谢所有为项目做出贡献的人！

<!-- 这里会自动生成贡献者列表 -->

## 📜 行为准则

### 我们的承诺
- 尊重所有贡献者
- 接受建设性批评
- 关注对社区最有利的事情
- 对他人表现出同理心

### 不可接受的行为
- 使用性化的语言或图像
- 人身攻击或侮辱性评论
- 公开或私下骚扰
- 未经许可发布他人信息

## 📄 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

---

再次感谢你的贡献！让我们一起让 **Your Shopping Mean Girl** 变得更好！💖