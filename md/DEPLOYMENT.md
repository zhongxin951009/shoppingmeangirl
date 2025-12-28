# 部署指南

## 📋 部署前检查清单

### 必需文件
- [x] `front/index.html` - 主应用
- [x] `front/standalone.html` - 独立版本
- [x] `front/style.css` - 样式文件
- [x] `front/script.js` - 主要逻辑
- [x] `front/mean-girls.jpg` - 品牌图片
- [x] `database.sql` - 数据库结构

### 可选文件
- [x] `front/simple.html` - 简化版本
- [x] `front/debug.html` - 调试版本
- [x] `front/test.html` - 效果演示
- [x] `server/app.js` - 后端服务器
- [x] 各种文档文件

## 🚀 部署方案

### 方案1：静态网站托管（推荐）

适用于：Vercel, Netlify, GitHub Pages, Cloudflare Pages

#### 步骤：
1. 将 `front` 文件夹作为根目录
2. 上传所有文件
3. 配置域名（可选）
4. 完成！

#### Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
cd front
vercel

# 或使用配置文件
vercel --prod
```

#### Netlify 部署
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
cd front
netlify deploy --prod --dir .
```

#### GitHub Pages
1. 创建 GitHub 仓库
2. 将代码推送到仓库
3. 在设置中启用 GitHub Pages
4. 选择 `front` 文件夹作为源

### 方案2：使用 Node.js 服务器

适用于：需要后端功能（OCR、语音识别等）

#### 步骤：
```bash
# 安装依赖
cd server
npm install

# 启动服务器
npm start

# 或使用 PM2 守护进程
npm i -g pm2
pm2 start app.js --name shopping-mean-girl
```

### 方案3：Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制前端文件
COPY front/ /app/public/

# 复制后端文件（如果需要）
COPY server/package*.json /app/
RUN npm install

COPY server/ /app/

EXPOSE 3000

CMD ["node", "app.js"]
```

```bash
# 构建镜像
docker build -t shopping-mean-girl .

# 运行容器
docker run -p 3000:3000 shopping-mean-girl
```

## 🔧 配置说明

### 环境变量

创建 `.env` 文件：

```env
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# 智谱AI配置
ZHIPU_API_KEY=your-zhipu-api-key
ZHIPU_MODEL=glm-4

# 服务器配置
PORT=3000
NODE_ENV=production
```

### 数据库设置

1. 在 Supabase 创建项目
2. 执行 `database.sql` 中的 SQL 语句
3. 配置行级安全策略（RLS）
4. 获取 API 密钥

### API 配置

用户首次访问时需要配置：
- Supabase URL
- Supabase Anon Key
- 智谱 API 密钥
- 模型名称

配置会保存在浏览器 localStorage 中。

## 📊 性能优化

### 图片优化
```bash
# 压缩 mean-girls.jpg
# 推荐使用 TinyPNG 或 ImageOptim
# 目标大小：< 200KB
```

### CSS 优化
```bash
# 压缩 CSS（可选）
npx cssnano style.css style.min.css
```

### JavaScript 优化
```bash
# 压缩 JS（可选）
npx terser script.js -o script.min.js
```

### CDN 配置
- 使用 CDN 加载 Supabase 库
- 考虑使用 CDN 托管静态资源
- 启用 Gzip/Brotli 压缩

## 🔒 安全配置

### Supabase RLS 策略

```sql
-- 限制用户只能访问自己的数据
CREATE POLICY "Users can only access their own data"
ON consumption_sessions
FOR ALL
USING (user_id = auth.uid());

-- 或使用匿名访问（开发环境）
CREATE POLICY "Allow anonymous access"
ON consumption_sessions
FOR ALL
USING (true);
```

### CORS 配置

如果使用后端服务器：

```javascript
// server/app.js
app.use(cors({
    origin: ['https://yourdomain.com'],
    credentials: true
}));
```

### HTTPS

生产环境必须使用 HTTPS：
- Vercel/Netlify 自动提供
- 自托管需要配置 SSL 证书（Let's Encrypt）

## 📱 移动端优化

### PWA 配置（可选）

创建 `manifest.json`：

```json
{
  "name": "Your Shopping Mean Girl",
  "short_name": "Mean Girl",
  "description": "理性消费决策助手",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#ff1493",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🧪 测试清单

部署后测试：

- [ ] 页面正常加载
- [ ] 图片正确显示
- [ ] 动画效果正常
- [ ] 卡片选择功能
- [ ] 响应式布局
- [ ] 移动端适配
- [ ] API 调用（如已配置）
- [ ] 数据库存储（如已配置）
- [ ] 错误处理
- [ ] 浏览器兼容性

## 📈 监控和分析

### 推荐工具

- **Google Analytics** - 用户行为分析
- **Sentry** - 错误追踪
- **Vercel Analytics** - 性能监控
- **Supabase Dashboard** - 数据库监控

### 添加 Google Analytics

```html
<!-- 在 index.html 的 <head> 中添加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 更新流程

1. 在本地测试新功能
2. 更新版本号（CHANGELOG.md）
3. 提交代码到 Git
4. 推送到远程仓库
5. 自动部署（CI/CD）或手动部署
6. 验证生产环境
7. 通知用户（如有重大更新）

## 📞 技术支持

部署遇到问题？

1. 查看 `TROUBLESHOOTING.md`
2. 检查浏览器控制台
3. 查看服务器日志
4. 联系技术支持

## 🎉 部署完成

恭喜！你的 "Your Shopping Mean Girl" 应用已成功部署！

访问地址：`https://your-domain.com`

记得分享给朋友们！💖