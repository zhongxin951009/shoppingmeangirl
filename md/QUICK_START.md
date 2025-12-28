# 快速启动指南

## 第一步：添加 Mean Girls 图片

1. 将你提供的 Mean Girls 电影剧照保存到电脑
2. 重命名为 `mean-girls.jpg`
3. 将文件放在 `front` 文件夹中

## 第二步：打开应用

### 方法1：直接打开（推荐）
直接双击打开 `front/index.html` 文件

### 方法2：使用本地服务器
```bash
cd front
python -m http.server 8000
# 然后在浏览器访问 http://localhost:8000
```

### 方法3：使用 VS Code Live Server
1. 在 VS Code 中打开项目
2. 右键点击 `front/index.html`
3. 选择 "Open with Live Server"

## 第三步：配置 API

首次使用需要配置：

1. 点击右上角的"设置"按钮
2. 填入以下信息：
   - **Supabase URL**: 你的 Supabase 项目地址
   - **Supabase Anon Key**: Supabase 匿名密钥
   - **智谱 API 密钥**: 从智谱AI获取的密钥
   - **模型名称**: 选择 GLM-4 或其他模型
3. 点击"保存配置"

## 页面效果说明

### 第一部分：品牌形象（占1/2屏幕）
- 粉色荧光字体标题 "Your Shopping Mean Girl"
- Mean Girls 图片居中显示
- 霓虹灯发光动画效果

### 第二部分：标题
- 主标题："Hey Gal, 你是怎样的美女"
- 副标题："选一下卡片让我了解你"
- 当鼠标移到这里时，第一部分会缩小到1/4

### 第三部分：选择卡片
- 左右两个区域横向排列
- 左侧：消费金额选择
- 右侧：购买驱动力选择
- 鼠标悬停时出现粉红星星动画

## 测试页面

如果想先测试效果，可以打开 `front/test.html` 查看：
- 标题荧光效果
- 卡片悬停动画
- 粉色主题演示

## 常见问题

### Q: 图片不显示？
A: 确保图片文件名为 `mean-girls.jpg` 且放在 `front` 文件夹中

### Q: 星星动画不显示？
A: 确保使用现代浏览器（Chrome、Firefox、Safari、Edge）

### Q: API 调用失败？
A: 检查网络连接和 API 密钥是否正确配置

### Q: 品牌部分不缩小？
A: 将鼠标移动到"Hey Gal"标题区域，或向下滚动页面

## 下一步

配置完成后，你可以：
1. 选择消费画像
2. 输入想购买的商品
3. 回答动机问题
4. 查看 AI 分析
5. 做出最终决策

享受使用 Your Shopping Mean Girl！💖