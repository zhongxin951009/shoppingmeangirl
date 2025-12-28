// 理性消费旁观者 Agent - 后端服务器（可选）
// 主要用于处理一些需要服务端的功能，如图片OCR、语音转文字等

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../front')));

// 文件上传配置
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// 路由

// 主页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 图片OCR接口（示例，需要集成实际的OCR服务）
app.post('/api/ocr', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '未上传图片' });
        }

        // 这里应该集成实际的OCR服务，如百度OCR、腾讯OCR等
        // 示例返回
        const mockResult = {
            productName: '示例商品名称',
            price: 999.00,
            confidence: 0.85
        };

        res.json({
            success: true,
            data: mockResult
        });
    } catch (error) {
        console.error('OCR处理失败:', error);
        res.status(500).json({ error: 'OCR处理失败' });
    }
});

// 语音转文字接口（示例）
app.post('/api/speech-to-text', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '未上传音频文件' });
        }

        // 这里应该集成实际的语音识别服务
        // 示例返回
        const mockResult = {
            text: '示例识别文字',
            confidence: 0.90
        };

        res.json({
            success: true,
            data: mockResult
        });
    } catch (error) {
        console.error('语音识别失败:', error);
        res.status(500).json({ error: '语音识别失败' });
    }
});

// 智谱API代理接口（可选，用于避免CORS问题）
app.post('/api/zhipu-proxy', async (req, res) => {
    try {
        const { apiKey, messages, model = 'glm-4' } = req.body;

        if (!apiKey || !messages) {
            return res.status(400).json({ error: '缺少必要参数' });
        }

        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('智谱API代理失败:', error);
        res.status(500).json({ error: '智谱API调用失败' });
    }
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ error: '接口不存在' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`理性消费旁观者服务器运行在端口 ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}`);
});

module.exports = app;