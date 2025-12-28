// 理性消费旁观者 Agent - 主要JavaScript文件

class ConsumptionAdvisor {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.sessionData = {
            userId: this.generateUserId(),
            sessionId: null,
            userProfile: {},
            productInfo: {},
            motivation: {},
            psychology: {},
            analysis: '',
            decision: ''
        };
        this.supabase = null;
        this.zhipuApiKey = '';
        this.usedScores = new Set(); // 存储已使用的分数
        
        this.init();
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    init() {
        this.bindEvents();
        this.loadConfig();
        this.updateProgress();
        this.initStep1Animations();
    }

    initStep1Animations() {
        const stepHeader = document.getElementById('stepHeader');
        const questionsContainer = document.getElementById('questionsContainer');
        const brandSection = document.getElementById('brandSection');
        const brandImg = document.getElementById('brandImg');

        // 检查元素是否存在
        if (!stepHeader || !questionsContainer || !brandSection) {
            console.error('页面元素未找到');
            return;
        }

        // 图片加载错误处理
        if (brandImg) {
            brandImg.onerror = function() {
                console.warn('图片加载失败，使用占位符');
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.style.cssText = `
                    width: 100%;
                    height: 300px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 16px;
                    text-align: center;
                    padding: 20px;
                `;
                placeholder.innerHTML = '请确保 mean-girls.jpg 在 front 文件夹中<br>或刷新页面重试';
                this.parentElement.appendChild(placeholder);
            };
        }

        // 监听鼠标移动到标题区域
        const handleMouseEnter = () => {
            brandSection.classList.add('shrink');
            stepHeader.classList.add('visible');
            questionsContainer.classList.add('visible');
        };

        stepHeader.addEventListener('mouseenter', handleMouseEnter);
        questionsContainer.addEventListener('mouseenter', handleMouseEnter);
        
        // 也可以在滚动时触发
        const contentContainer = document.getElementById('contentContainer');
        if (contentContainer) {
            contentContainer.addEventListener('scroll', () => {
                if (contentContainer.scrollTop > 50) {
                    handleMouseEnter();
                }
            });
        }
    }

    bindEvents() {
        // 设置面板
        document.getElementById('settingsBtn').addEventListener('click', () => {
            document.getElementById('settingsPanel').classList.add('active');
        });

        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            document.getElementById('settingsPanel').classList.remove('active');
        });

        document.getElementById('saveConfigBtn').addEventListener('click', () => {
            this.saveConfig();
        });

        // 步骤1: 消费画像
        this.bindStep1Events();
        
        // 步骤2: 商品信息
        this.bindStep2Events();
        
        // 步骤3-6: 动态绑定
        this.bindNavigationEvents();
    }

    bindStep1Events() {
        const budgetOptions = document.querySelectorAll('#budgetOptions .option-card');
        const driverOptions = document.querySelectorAll('#driverOptions .option-card');
        const nextBtn = document.getElementById('step1NextBtn');
        const driverSection = document.getElementById('driverSection');
        const scrollIndicator = document.getElementById('scrollIndicator');

        budgetOptions.forEach(card => {
            card.addEventListener('click', () => {
                budgetOptions.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.sessionData.userProfile.budgetRange = card.dataset.value;
                
                // 启用第二个问题并自动滚动
                this.enableSecondQuestion();
                this.checkStep1Complete();
            });
        });

        driverOptions.forEach(card => {
            card.addEventListener('click', () => {
                driverOptions.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.sessionData.userProfile.purchaseDriver = card.dataset.value;
                this.checkStep1Complete();
            });
        });

        nextBtn.addEventListener('click', () => {
            this.nextStep();
        });

        // 点击箭头滚动到问题区域
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const questionsContainer = document.getElementById('questionsContainer');
                if (questionsContainer) {
                    questionsContainer.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    enableSecondQuestion() {
        const driverSection = document.getElementById('driverSection');
        const scrollIndicator = document.getElementById('scrollIndicator');
        
        if (driverSection) {
            // 启用第二个问题
            driverSection.style.opacity = '1';
            driverSection.style.pointerEvents = 'auto';
            driverSection.style.transform = 'translateY(0)';
            
            // 隐藏箭头指示器
            if (scrollIndicator) {
                scrollIndicator.classList.add('hidden');
            }
            
            // 平滑滚动到第二个问题
            setTimeout(() => {
                driverSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }
    }

    bindStep2Events() {
        const productName = document.getElementById('productName');
        const productPrice = document.getElementById('productPrice');
        const nextBtn = document.getElementById('step2NextBtn');
        const prevBtn = document.getElementById('step2PrevBtn');
        const voiceBtn = document.getElementById('voiceInputBtn');
        const imageBtn = document.getElementById('imageInputBtn');
        const imageInput = document.getElementById('imageInput');
        const productPriceSection = document.getElementById('productPriceSection');

        // 商品名称输入 - 移除自动跳转逻辑
        productName.addEventListener('input', () => {
            this.sessionData.productInfo.name = productName.value.trim();
            this.checkStep2Complete();
        });

        // 价格输入
        productPrice.addEventListener('input', () => {
            this.sessionData.productInfo.price = parseFloat(productPrice.value) || 0;
            this.checkStep2Complete();
        });

        nextBtn.addEventListener('click', async () => {
            // 启动第三步的loading阶段
            await this.startStep3Analysis();
        });

        prevBtn.addEventListener('click', () => {
            this.prevStep();
        });

        voiceBtn.addEventListener('click', () => {
            this.startVoiceInput();
        });

        imageBtn.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.processImage(e.target.files[0]);
            }
        });
    }

    enablePriceInput() {
        const productPriceSection = document.getElementById('productPriceSection');
        
        if (productPriceSection) {
            // 启用价格输入部分
            productPriceSection.style.opacity = '1';
            productPriceSection.style.pointerEvents = 'auto';
            productPriceSection.style.transform = 'translateY(0)';
            
            // 平滑滚动到价格输入
            setTimeout(() => {
                productPriceSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // 自动聚焦到价格输入框
                const productPrice = document.getElementById('productPrice');
                if (productPrice) {
                    productPrice.focus();
                }
            }, 300);
        }
    }

    bindNavigationEvents() {
        // 步骤3
        document.getElementById('step3PrevBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('step3NextBtn').addEventListener('click', async () => {
            // 启动第四步的结果分析
            await this.startStep4Analysis();
        });

        // 步骤4
        document.getElementById('step4PrevBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        
        // 决策按钮
        document.getElementById('listenBtn').addEventListener('click', () => this.handleDecision('listen'));
        document.getElementById('chopBtn').addEventListener('click', () => this.handleDecision('chop'));
        document.getElementById('calmBtn').addEventListener('click', () => this.handleDecision('calm'));
    }

    // 第三步分析流程
    async startStep3Analysis() {
        // 切换到第三步
        this.nextStep();
        
        // 显示loading阶段
        this.showStep3Loading();
        
        // 调用AI生成动机卡片
        try {
            await this.generateMotivationCards();
            // 2秒后显示分析结果
            setTimeout(() => {
                this.showStep3Analysis();
            }, 2000);
        } catch (error) {
            console.error('生成动机卡片失败:', error);
            // 显示默认卡片
            setTimeout(() => {
                this.showDefaultMotivationCards();
                this.showStep3Analysis();
            }, 2000);
        }
    }

    showStep3Loading() {
        document.getElementById('step3Loading').style.display = 'flex';
        document.getElementById('step3Analysis').style.display = 'none';
    }

    showStep3Analysis() {
        document.getElementById('step3Loading').style.display = 'none';
        document.getElementById('step3Analysis').style.display = 'block';
    }

    async generateMotivationCards() {
        const { name, price } = this.sessionData.productInfo;
        const { budgetRange, purchaseDriver } = this.sessionData.userProfile;
        
        const prompt = `用户想购买"${name}"，价格${price}元。用户消费能力：${budgetRange}，购买驱动力：${purchaseDriver}。

请以"Mean Girl"的语气风格，根据这个具体商品的特性，生成3-5个购买动机选项。每个选项必须：
1. 一个相关的emoji（要符合商品特性）
2. 一个15字以内的理由阐述，要有态度、直接、不做作，符合Mean Girl风格
3. 一个简短的回应词（如"我懂"、"可以"、"行行行"、"没错"、"对的"）

重要：必须根据商品的具体特性来生成，不要用通用的理由。

示例参考：
用户输入："北海道冬天去玩能穿的白色雪地靴"
- 🔥 保暖性好 jio不冷 → 我懂
- 👑 公主美丽动人只要好看就行 → 可以  
- 🛡️ 防滑可别让我摔个大屁墩影响形象 → 行行行

请直接返回JSON格式：
{
  "motivations": [
    {
      "emoji": "🔥",
      "text": "具体的商品相关理由",
      "response": "回应词"
    }
  ]
}`;

        const response = await this.callZhipuAPI(prompt, true); // 期望JSON格式
        const data = this.parseMotivationResponse(response);
        
        this.renderMotivationCards(data.motivations);
    }

    parseMotivationResponse(response) {
        try {
            // 清理可能的多余内容
            let cleanResponse = response.trim();
            
            // 尝试提取JSON部分
            const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanResponse = jsonMatch[0];
            }
            
            const parsed = JSON.parse(cleanResponse);
            
            // 验证数据结构
            if (parsed.motivations && Array.isArray(parsed.motivations)) {
                return parsed;
            } else {
                throw new Error('Invalid data structure');
            }
        } catch (error) {
            console.error('解析动机回应失败:', error);
            console.log('原始回应:', response);
            return this.getDefaultMotivations();
        }
    }

    getDefaultMotivations() {
        const { name } = this.sessionData.productInfo;
        
        return {
            motivations: [
                {
                    emoji: "💖",
                    text: "就是喜欢想要拥有",
                    response: "我懂"
                },
                {
                    emoji: "✨",
                    text: "提升生活品质很重要",
                    response: "可以"
                },
                {
                    emoji: "👑",
                    text: "好看就是硬道理",
                    response: "没错"
                },
                {
                    emoji: "🎯",
                    text: "实用性强值得入手",
                    response: "行行行"
                },
                {
                    emoji: "🔥",
                    text: "别人都有我也要有",
                    response: "对的"
                }
            ]
        };
    }

    showDefaultMotivationCards() {
        const defaultData = this.getDefaultMotivations();
        this.renderMotivationCards(defaultData.motivations);
    }

    renderMotivationCards(motivations) {
        const container = document.getElementById('motivationCards');
        container.innerHTML = '';
        
        motivations.forEach((motivation, index) => {
            const card = document.createElement('div');
            card.className = 'motivation-card';
            card.dataset.index = index;
            card.innerHTML = `
                <div class="motivation-card-emoji">${motivation.emoji}</div>
                <div class="motivation-card-text">${motivation.text}</div>
                <div class="motivation-card-response">${motivation.response}</div>
            `;
            
            card.addEventListener('click', () => {
                this.selectMotivationCard(card, motivation);
            });
            
            container.appendChild(card);
        });
    }

    selectMotivationCard(cardElement, motivation) {
        // 移除其他卡片的选中状态
        document.querySelectorAll('.motivation-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 选中当前卡片
        cardElement.classList.add('selected');
        
        // 保存选择
        this.sessionData.motivation = {
            emoji: motivation.emoji,
            text: motivation.text,
            response: motivation.response
        };
        
        // 启用下一步按钮
        document.getElementById('step3NextBtn').disabled = false;
        
        console.log('选择了动机:', motivation);
    }

    // 第四步结果分析流程
    async startStep4Analysis() {
        // 切换到第四步
        this.nextStep();
        
        // 显示loading阶段
        this.showStep4Loading();
        
        try {
            // 计算没用等级
            const uselessScore = this.calculateUselessScore();
            
            // 生成省钱等式
            const moneyEquation = await this.generateMoneyEquation();
            
            // 生成毒舌点评
            const review = await this.generateReview(uselessScore);
            
            // 3秒后显示结果
            setTimeout(() => {
                this.showStep4Result(uselessScore, moneyEquation, review);
            }, 3000);
            
        } catch (error) {
            console.error('生成结果失败:', error);
            // 显示默认结果
            setTimeout(() => {
                this.showDefaultResult();
            }, 3000);
        }
    }

    showStep4Loading() {
        document.getElementById('step4Loading').style.display = 'flex';
        document.getElementById('step4Result').style.display = 'none';
    }

    showStep4Result(uselessScore, moneyEquation, review) {
        document.getElementById('step4Loading').style.display = 'none';
        document.getElementById('step4Result').style.display = 'block';
        
        // 显示没用等级
        this.animateUselessScore(uselessScore);
        
        // 显示省钱等式
        document.getElementById('savedAmount').textContent = `¥${this.sessionData.productInfo.price}`;
        document.getElementById('alternativeUse').textContent = moneyEquation;
        
        // 显示点评
        document.getElementById('reviewContent').innerHTML = `<p>${review}</p>`;
    }

    // 计算没用等级的核心算法
    calculateUselessScore() {
        const { budgetRange, purchaseDriver } = this.sessionData.userProfile;
        const { name, price } = this.sessionData.productInfo;
        const { text: motivationText } = this.sessionData.motivation;
        
        let score = 50; // 基础分数
        
        // 第1个加权指标：消费水平 vs 商品价格
        const budgetScore = this.calculateBudgetScore(budgetRange, price);
        
        // 第2个加权指标：消费原则 vs 商品类型
        const principleScore = this.calculatePrincipleScore(purchaseDriver, name, motivationText);
        
        // 综合计算（权重可调整）
        score = Math.round(budgetScore * 0.6 + principleScore * 0.4);
        
        // 确保分数在0-100范围内
        score = Math.max(0, Math.min(100, score));
        
        // 防重复逻辑：如果分数已使用过，进行微调
        let finalScore = score;
        let attempts = 0;
        while (this.usedScores.has(finalScore) && attempts < 20) {
            // 在原分数基础上随机微调 ±5
            const adjustment = Math.floor(Math.random() * 11) - 5; // -5 到 +5
            finalScore = Math.max(0, Math.min(100, score + adjustment));
            attempts++;
        }
        
        // 如果20次尝试后仍重复，使用随机数
        if (this.usedScores.has(finalScore)) {
            do {
                finalScore = Math.floor(Math.random() * 101); // 0-100
            } while (this.usedScores.has(finalScore));
        }
        
        // 记录使用过的分数
        this.usedScores.add(finalScore);
        
        // 如果已记录超过20个分数，清空最早的记录
        if (this.usedScores.size > 20) {
            const scoresArray = Array.from(this.usedScores);
            this.usedScores.clear();
            // 保留最近的15个分数
            scoresArray.slice(-15).forEach(s => this.usedScores.add(s));
        }
        
        console.log('没用等级计算:', {
            budgetScore,
            principleScore,
            originalScore: score,
            finalScore: finalScore,
            usedScores: Array.from(this.usedScores)
        });
        
        return finalScore;
    }

    calculateBudgetScore(budgetRange, price) {
        // 预算范围映射到数值
        const budgetMap = {
            'low': 500,        // 1000元以下
            'medium-low': 2000, // 1000-3000元
            'medium': 5500,     // 3000-8000元
            'medium-high': 11500, // 8000-15000元
            'high': 20000       // 15000元以上
        };
        
        const budget = budgetMap[budgetRange] || 2000;
        const ratio = price / budget;
        
        let score;
        if (ratio <= 0.1) {
            score = 10; // 非常好：商品价格很低
        } else if (ratio <= 0.3) {
            score = 25; // 还不错：价格合理
        } else if (ratio <= 0.7) {
            score = 45; // 符合预期：价格适中
        } else if (ratio <= 1.2) {
            score = 70; // 不太好：价格偏高
        } else if (ratio <= 3.0) {
            score = 85; // 差劲：价格很高
        } else {
            score = 95; // 差到离谱：价格离谱
        }
        
        return score;
    }

    calculatePrincipleScore(purchaseDriver, productName, motivationText) {
        // 分析商品类型和购买原则的匹配度
        const productLower = productName.toLowerCase();
        const motivationLower = motivationText.toLowerCase();
        
        let score = 50; // 默认分数
        
        // 正面匹配（降低没用等级）
        if (purchaseDriver === 'practical') {
            if (productLower.includes('内衣') || productLower.includes('保暖') || 
                productLower.includes('工具') || productLower.includes('实用') ||
                motivationLower.includes('实用') || motivationLower.includes('保暖')) {
                score = 20; // 很匹配
            }
        } else if (purchaseDriver === 'emotional') {
            if (productLower.includes('花瓶') || productLower.includes('装饰') || 
                productLower.includes('美丽') || productLower.includes('好看') ||
                motivationLower.includes('好看') || motivationLower.includes('美丽')) {
                score = 25; // 比较匹配
            }
        } else if (purchaseDriver === 'identity') {
            if (productLower.includes('奢侈') || productLower.includes('品牌') || 
                productLower.includes('貂皮') || productLower.includes('大衣') ||
                motivationLower.includes('身份') || motivationLower.includes('地位')) {
                score = 30; // 匹配身份需求
            }
        }
        
        // 负面匹配（提高没用等级）
        if (purchaseDriver === 'security' || purchaseDriver === 'practical') {
            if (productLower.includes('lv') || productLower.includes('爱马仕') || 
                productLower.includes('奢侈品') || productLower.includes('包包')) {
                score = 80; // 很不匹配
            }
        }
        
        if (purchaseDriver === 'emotional') {
            if (productLower.includes('五金') || productLower.includes('配件') || 
                productLower.includes('工具')) {
                score = 75; // 情绪价值和工具不匹配
            }
        }
        
        return score;
    }

    async generateMoneyEquation() {
        const price = this.sessionData.productInfo.price;
        
        const prompt = `用户想花${price}元买东西。请生成一个搞笑且假正经的"省钱等式"，说明这笔钱可以买什么更有意义的东西。

要求：
1. 语言风格搞笑、假正经
2. 内容要实用、朴实、日常、自我提升、学习、理财相关
3. 越具体越好，要有生活气息
4. 一句话，不超过30字

示例：
- 1顿和家人团聚的海底捞火锅
- 清明节小长假从北京去日本的机票路费  
- 1本对你人生可能产生改变的哲理书籍

请直接返回一句话描述，不要JSON格式，不要其他符号。`;

        try {
            const response = await this.callZhipuAPI(prompt);
            // 清理可能的JSON格式或多余符号
            let cleanResponse = response.trim();
            cleanResponse = cleanResponse.replace(/^["']|["']$/g, ''); // 移除首尾引号
            cleanResponse = cleanResponse.replace(/^[=\-\s]+/, ''); // 移除开头的等号、横线、空格
            return cleanResponse;
        } catch (error) {
            console.error('生成省钱等式失败:', error);
            return this.getDefaultMoneyEquation(price);
        }
    }

    getDefaultMoneyEquation(price) {
        if (price < 50) {
            return '2本提升自我修养的经典好书';
        } else if (price < 200) {
            return '1个月的健身房会员卡让你变更美';
        } else if (price < 1000) {
            return '1次和朋友的深度聚餐增进感情';
        } else if (price < 5000) {
            return '1趟说走就走的周末短途旅行';
        } else {
            return '1个技能培训课程投资未来的自己';
        }
    }

    async generateReview(uselessScore) {
        const { name, price } = this.sessionData.productInfo;
        const { budgetRange, purchaseDriver } = this.sessionData.userProfile;
        const { text: motivationText } = this.sessionData.motivation;
        
        const prompt = `用户想买"${name}"，价格${price}元，消费能力${budgetRange}，购买驱动力${purchaseDriver}，动机是"${motivationText}"。没用等级评分是${uselessScore}分。

请写一段100-150字的毒舌点评，语言风格要：
1. 非常毒舌但不恶毒
2. 直接犀利，一针见血
3. 有Mean Girl的态度
4. 核心目的是劝用户不要买
5. 要有具体的分析，不要空泛的说教

语气参考："亲爱的，你真的觉得...吗？醒醒吧！"

请直接返回点评内容，不要JSON格式，不要引号，不要其他符号。`;

        try {
            const response = await this.callZhipuAPI(prompt);
            // 清理可能的JSON格式或多余符号
            let cleanResponse = response.trim();
            cleanResponse = cleanResponse.replace(/^["']|["']$/g, ''); // 移除首尾引号
            cleanResponse = cleanResponse.replace(/^\{.*?".*?":\s*["']?/, ''); // 移除JSON开头
            cleanResponse = cleanResponse.replace(/["']?\s*\}$/, ''); // 移除JSON结尾
            return cleanResponse;
        } catch (error) {
            console.error('生成点评失败:', error);
            return this.getDefaultReview(uselessScore);
        }
    }

    getDefaultReview(uselessScore) {
        if (uselessScore >= 80) {
            return '亲爱的，你的钱包在哭泣！这个没用等级已经爆表了。与其买这个华而不实的东西，不如把钱存起来或者投资自己。相信我，一个月后你就会忘记这个东西的存在，但你的银行账户会永远记得这笔"智商税"。清醒一点，你值得更好的选择！';
        } else if (uselessScore >= 60) {
            return '说实话，这个购买决定有点冲动哦。虽然不是完全没用，但性价比真的不高。你的钱可以花在更有意义的地方，比如提升自己或者和家人朋友共度美好时光。冷静想想，这真的是你现在最需要的吗？';
        } else if (uselessScore >= 40) {
            return '这个选择还算理性，但还是建议你再想想。虽然不算太冲动，但也不是必需品。如果真的很想要，不如等等看有没有更好的时机或者更优惠的价格。理性消费，从现在开始！';
        } else {
            return '不错哦，这个选择还算明智！虽然我的职责是劝你冷静，但这次你的决定确实比较理性。如果真的需要，那就去买吧。但记住，理性消费永远是王道，不要让这次的"通过"成为下次冲动的借口！';
        }
    }

    showDefaultResult() {
        const defaultScore = 75;
        const defaultEquation = '1次有意义的自我投资机会';
        const defaultReview = '亲爱的，虽然系统出了点小问题，但我的建议永远不变：冷静消费，理性选择。你的钱包和未来的自己都会感谢你的！';
        
        this.showStep4Result(defaultScore, defaultEquation, defaultReview);
    }

    animateUselessScore(targetScore) {
        const scoreElement = document.getElementById('uselessScore');
        const fillElement = document.getElementById('scoreFill');
        
        let currentScore = 0;
        const increment = targetScore / 50; // 50步动画
        
        const animation = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(animation);
            }
            
            scoreElement.textContent = Math.round(currentScore);
            fillElement.style.width = `${currentScore}%`;
        }, 40); // 每40ms更新一次
    }

    handleDecision(decision) {
        const decisions = {
            'listen': '听劝',
            'chop': '剁手', 
            'calm': '冷静期'
        };
        
        this.sessionData.finalDecision = decision;
        
        // 保存决策到数据库
        this.saveDecision();
        
        // 显示反馈
        const message = `你选择了"${decisions[decision]}"！\n\n感谢使用 Your Shopping Mean Girl！\n希望这次分析对你有帮助 💖`;
        
        setTimeout(() => {
            alert(message);
        }, 500);
        
        console.log('最终决策:', decision);

        // 步骤3回应阶段
        document.getElementById('step3ResponsePrevBtn').addEventListener('click', () => {
            this.showStep3Analysis();
        });
        document.getElementById('step3ResponseNextBtn').addEventListener('click', async () => {
            await this.generateStep4Options();
            this.nextStep();
        });

        // 步骤4
        document.getElementById('step4PrevBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('step4NextBtn').addEventListener('click', async () => {
            await this.generateAnalysis();
            this.nextStep();
        });

        // 步骤5
        document.getElementById('step5PrevBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('step5NextBtn').addEventListener('click', () => this.nextStep());

        // 步骤6
        document.getElementById('step6PrevBtn').addEventListener('click', () => this.prevStep());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    }

    checkStep1Complete() {
        const nextBtn = document.getElementById('step1NextBtn');
        const isComplete = this.sessionData.userProfile.budgetRange && 
                          this.sessionData.userProfile.purchaseDriver;
        nextBtn.disabled = !isComplete;
    }

    checkStep2Complete() {
        const nextBtn = document.getElementById('step2NextBtn');
        const isComplete = this.sessionData.productInfo.name && 
                          this.sessionData.productInfo.price > 0;
        nextBtn.disabled = !isComplete;
    }

    async generateStep3Options() {
        this.showLoading(true);
        
        try {
            const prompt = this.buildStep3Prompt();
            const response = await this.callZhipuAPI(prompt);
            const options = this.parseOptionsFromResponse(response);
            
            this.renderStep3Options(options);
        } catch (error) {
            console.error('生成步骤3选项失败:', error);
            this.renderDefaultStep3Options();
        }
        
        this.showLoading(false);
    }

    buildStep3Prompt() {
        const { budgetRange, purchaseDriver } = this.sessionData.userProfile;
        const { name, price } = this.sessionData.productInfo;
        
        return `用户想购买"${name}"，价格${price}元。用户消费能力：${budgetRange}，购买驱动力：${purchaseDriver}。

请生成5个"为什么现在想买"的选项，聚焦触发购买的原因，体现情绪、处境、比较或时间压力。

要求：
1. 每个选项15字以内
2. 贴合用户画像
3. 不讨论商品本身
4. JSON格式返回：{"options": [{"value": "reason1", "text": "选项文字", "icon": "emoji"}]}`;
    }

    async generateStep4Options() {
        this.showLoading(true);
        
        try {
            const prompt = this.buildStep4Prompt();
            const response = await this.callZhipuAPI(prompt);
            const options = this.parseOptionsFromResponse(response);
            
            this.renderStep4Options(options);
        } catch (error) {
            console.error('生成步骤4选项失败:', error);
            this.renderDefaultStep4Options();
        }
        
        this.showLoading(false);
    }

    buildStep4Prompt() {
        const { budgetRange, purchaseDriver } = this.sessionData.userProfile;
        const { name, price } = this.sessionData.productInfo;
        const motivation = this.sessionData.motivation.selected;
        
        return `用户想购买"${name}"（${price}元），消费能力：${budgetRange}，驱动力：${purchaseDriver}，触发原因：${motivation}。

请生成5个"内心深处的声音"选项，以心里话方式呈现，指向心理层面的内在需求或逃避。

要求：
1. 每个选项18字以内
2. 允许轻微戳破感，但不攻击
3. 表达不同的内在需求
4. JSON格式返回：{"options": [{"value": "psychology1", "text": "选项文字", "icon": "emoji"}]}`;
    }

    async generateAnalysis() {
        this.showLoading(true);
        
        try {
            const prompt = this.buildAnalysisPrompt();
            const response = await this.callZhipuAPI(prompt);
            const analysis = this.parseAnalysisFromResponse(response);
            
            this.sessionData.analysis = analysis;
            this.renderAnalysis(analysis);
            
            // 保存到数据库
            await this.saveSessionData();
        } catch (error) {
            console.error('生成分析失败:', error);
            this.renderDefaultAnalysis();
        }
        
        this.showLoading(false);
    }

    buildAnalysisPrompt() {
        const { budgetRange, purchaseDriver } = this.sessionData.userProfile;
        const { name, price } = this.sessionData.productInfo;
        const motivation = this.sessionData.motivation.selected;
        const psychology = this.sessionData.psychology.selected;
        
        return `用户信息：
- 商品：${name}（${price}元）
- 消费能力：${budgetRange}
- 驱动力：${purchaseDriver}
- 触发原因：${motivation}
- 心理状态：${psychology}

请生成理性分析，包含三部分：

A. 关于这件商品（否定性分析，强调不能解决核心心理需求）
B. 价格的生活等价换算（至少3个维度：饮食/出行/体验/社交）
C. 关于你现在的状态（分析心理状态，引入未来视角）

要求：
1. 冷静、理解、克制的语气
2. 不下结论、不命令
3. JSON格式返回：{"product": "商品分析", "price": "价格换算", "state": "状态分析"}`;
    }

    async callZhipuAPI(prompt, expectJson = false) {
        if (!this.zhipuApiKey) {
            throw new Error('未配置智谱API密钥');
        }

        const systemContent = expectJson 
            ? '你是一个理性消费旁观者，帮助用户冷静分析购买决策。当需要返回JSON格式时，请确保返回有效的JSON格式。'
            : '你是一个理性消费旁观者，帮助用户冷静分析购买决策。请直接返回所需内容，不要使用JSON格式，不要添加引号或其他符号。';

        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.zhipuApiKey}`
            },
            body: JSON.stringify({
                model: 'glm-4',
                messages: [
                    {
                        role: 'system',
                        content: systemContent
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    parseOptionsFromResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return parsed.options || [];
        } catch (error) {
            console.error('解析选项失败:', error);
            return [];
        }
    }

    parseAnalysisFromResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return {
                product: parsed.product || '商品分析内容',
                price: parsed.price || '价格换算内容',
                state: parsed.state || '状态分析内容'
            };
        } catch (error) {
            console.error('解析分析失败:', error);
            return {
                product: '这件商品可能无法真正解决你当前的核心需求。',
                price: '这笔钱可以用于其他更有意义的体验。',
                state: '你可能正在寻求某种心理满足，这是正常的短期情绪。'
            };
        }
    }

    renderStep3Options(options) {
        const container = document.getElementById('motivationOptions');
        container.innerHTML = '';
        
        const defaultOptions = [
            { value: 'discount', text: '看到了限时优惠', icon: '🏷️' },
            { value: 'comparison', text: '朋友有了我也想要', icon: '👥' },
            { value: 'mood', text: '心情不好想买点什么', icon: '😔' },
            { value: 'upgrade', text: '觉得该升级换代了', icon: '⬆️' },
            { value: 'impulse', text: '突然就很想要', icon: '⚡' }
        ];
        
        const optionsToRender = options.length > 0 ? options : defaultOptions;
        
        optionsToRender.forEach(option => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.dataset.value = option.value;
            card.innerHTML = `
                <div class="card-icon">${option.icon}</div>
                <div class="card-text">${option.text}</div>
            `;
            
            card.addEventListener('click', () => {
                document.querySelectorAll('#motivationOptions .option-card').forEach(c => 
                    c.classList.remove('selected'));
                card.classList.add('selected');
                this.sessionData.motivation.selected = option.value;
                this.sessionData.motivation.text = option.text;
                document.getElementById('step3NextBtn').disabled = false;
            });
            
            container.appendChild(card);
        });
    }

    renderStep4Options(options) {
        const container = document.getElementById('psychologyOptions');
        container.innerHTML = '';
        
        const defaultOptions = [
            { value: 'validation', text: '我需要证明自己值得拥有好东西', icon: '✨' },
            { value: 'escape', text: '买了它我就能暂时忘记烦恼', icon: '🌈' },
            { value: 'control', text: '至少在消费上我能做主', icon: '🎯' },
            { value: 'belonging', text: '我不想被落下或显得寒酸', icon: '👥' },
            { value: 'future', text: '万一以后涨价或买不到了', icon: '⏰' }
        ];
        
        const optionsToRender = options.length > 0 ? options : defaultOptions;
        
        optionsToRender.forEach(option => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.dataset.value = option.value;
            card.innerHTML = `
                <div class="card-icon">${option.icon}</div>
                <div class="card-text">${option.text}</div>
            `;
            
            card.addEventListener('click', () => {
                document.querySelectorAll('#psychologyOptions .option-card').forEach(c => 
                    c.classList.remove('selected'));
                card.classList.add('selected');
                this.sessionData.psychology.selected = option.value;
                this.sessionData.psychology.text = option.text;
                document.getElementById('step4NextBtn').disabled = false;
            });
            
            container.appendChild(card);
        });
    }

    renderAnalysis(analysis) {
        const container = document.getElementById('analysisContent');
        container.innerHTML = `
            <div class="analysis-section">
                <h3>关于这件商品</h3>
                <p>${analysis.product}</p>
            </div>
            <div class="analysis-section">
                <h3>价格的生活等价</h3>
                <p>${analysis.price}</p>
            </div>
            <div class="analysis-section">
                <h3>关于你现在的状态</h3>
                <p>${analysis.state}</p>
            </div>
        `;
    }

    renderDefaultStep3Options() {
        this.renderStep3Options([]);
    }

    renderDefaultStep4Options() {
        this.renderStep4Options([]);
    }

    renderDefaultAnalysis() {
        const analysis = {
            product: '这件商品可能无法真正解决你当前面临的核心问题。购买它更多是一种心理安慰，而非实际需求的满足。',
            price: `这${this.sessionData.productInfo.price}元，大致可以：享用20次精致晚餐，或者看40场电影，或者来一次短途旅行，或者和朋友聚餐10次。`,
            state: '你可能正在经历某种情绪波动或生活压力，希望通过购买来获得短暂的满足感。这是很正常的心理反应，但几天或几周后，这种感觉通常会消退。'
        };
        this.renderAnalysis(analysis);
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // 隐藏当前步骤
            const currentStepElement = document.getElementById(`step${this.currentStep}`);
            currentStepElement.classList.remove('active');
            
            // 如果离开第一步，重置第一步的特殊状态
            if (this.currentStep === 1) {
                const brandSection = document.getElementById('brandSection');
                const stepHeader = document.getElementById('stepHeader');
                const questionsContainer = document.getElementById('questionsContainer');
                
                if (brandSection) brandSection.classList.remove('shrink');
                if (stepHeader) stepHeader.classList.remove('visible');
                if (questionsContainer) questionsContainer.classList.remove('visible');
            }
            
            // 切换到下一步
            this.currentStep++;
            const nextStepElement = document.getElementById(`step${this.currentStep}`);
            nextStepElement.classList.add('active');
            
            this.updateProgress();
            
            // 特殊处理
            if (this.currentStep === 6) {
                this.bindDecisionEvents();
            }
            
            console.log(`切换到步骤 ${this.currentStep}`);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            // 隐藏当前步骤
            const currentStepElement = document.getElementById(`step${this.currentStep}`);
            currentStepElement.classList.remove('active');
            
            // 切换到上一步
            this.currentStep--;
            const prevStepElement = document.getElementById(`step${this.currentStep}`);
            prevStepElement.classList.add('active');
            
            // 如果回到第一步，需要重新初始化动画
            if (this.currentStep === 1) {
                setTimeout(() => {
                    this.initStep1Animations();
                }, 100);
            }
            
            this.updateProgress();
            
            console.log(`返回到步骤 ${this.currentStep}`);
        }
    }

    bindDecisionEvents() {
        const decisionCards = document.querySelectorAll('.decision-card');
        
        decisionCards.forEach(card => {
            card.addEventListener('click', async () => {
                decisionCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                
                this.sessionData.decision = card.dataset.value;
                await this.saveDecision();
                
                // 显示完成消息
                setTimeout(() => {
                    alert('感谢使用理性消费旁观者！希望这次分析对你有帮助。');
                }, 500);
            });
        });
    }

    updateProgress() {
        // 进度指示器已移除，此函数保留用于兼容性
        // 可以在这里添加其他进度相关的逻辑
        console.log(`当前步骤: ${this.currentStep}/${this.totalSteps}`);
    }

    restart() {
        this.currentStep = 1;
        this.sessionData = {
            userId: this.generateUserId(),
            sessionId: null,
            userProfile: {},
            productInfo: {},
            motivation: {},
            psychology: {},
            analysis: '',
            decision: ''
        };
        
        // 重置所有步骤
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('step1').classList.add('active');
        
        // 重置所有选择
        document.querySelectorAll('.option-card, .decision-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 重置输入
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        
        // 重置按钮状态
        document.getElementById('step1NextBtn').disabled = true;
        document.getElementById('step2NextBtn').disabled = true;
        document.getElementById('step3NextBtn').disabled = true;
        document.getElementById('step4NextBtn').disabled = true;
        
        // 重置第二个问题状态
        const driverSection = document.getElementById('driverSection');
        const scrollIndicator = document.getElementById('scrollIndicator');
        
        if (driverSection) {
            driverSection.style.opacity = '0.3';
            driverSection.style.pointerEvents = 'none';
        }
        
        if (scrollIndicator) {
            scrollIndicator.classList.remove('hidden');
        }
        
        // 重新初始化第一步动画
        setTimeout(() => {
            this.initStep1Animations();
        }, 100);
        
        this.updateProgress();
    }

    startVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'zh-CN';
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onstart = () => {
                document.getElementById('voiceInputBtn').textContent = '正在听...';
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('productName').value = transcript;
                this.sessionData.productInfo.name = transcript;
                this.checkStep2Complete();
            };
            
            recognition.onerror = (event) => {
                console.error('语音识别错误:', event.error);
                alert('语音识别失败，请重试');
            };
            
            recognition.onend = () => {
                document.getElementById('voiceInputBtn').innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    语音输入
                `;
            };
            
            recognition.start();
        } else {
            alert('您的浏览器不支持语音识别功能');
        }
    }

    async processImage(file) {
        // 这里可以集成OCR服务来识别图片中的商品信息
        // 暂时显示提示
        alert('图片识别功能开发中，请手动输入商品信息');
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    loadConfig() {
        const config = localStorage.getItem('consumptionAdvisorConfig');
        if (config) {
            const parsed = JSON.parse(config);
            this.zhipuApiKey = parsed.zhipuApiKey || '';
            
            if (parsed.supabaseUrl && parsed.supabaseKey) {
                this.initSupabase(parsed.supabaseUrl, parsed.supabaseKey);
            }
        }
    }

    saveConfig() {
        const supabaseUrl = document.getElementById('supabaseUrl').value.trim();
        const supabaseKey = document.getElementById('supabaseKey').value.trim();
        const zhipuApiKey = document.getElementById('zhipuApiKey').value.trim();
        const modelName = document.getElementById('modelName').value;

        if (!supabaseUrl || !supabaseKey || !zhipuApiKey) {
            alert('请填写完整的配置信息');
            return;
        }

        const config = {
            supabaseUrl,
            supabaseKey,
            zhipuApiKey,
            modelName
        };

        localStorage.setItem('consumptionAdvisorConfig', JSON.stringify(config));
        this.zhipuApiKey = zhipuApiKey;
        
        this.initSupabase(supabaseUrl, supabaseKey);
        
        document.getElementById('settingsPanel').classList.remove('active');
        alert('配置保存成功！');
    }

    initSupabase(url, key) {
        try {
            this.supabase = supabase.createClient(url, key);
        } catch (error) {
            console.error('初始化Supabase失败:', error);
        }
    }

    async saveSessionData() {
        if (!this.supabase) return;

        try {
            const { data, error } = await this.supabase
                .from('consumption_sessions')
                .insert([{
                    user_id: this.sessionData.userId,
                    session_data: this.sessionData,
                    current_step: this.currentStep,
                    product_name: this.sessionData.productInfo.name,
                    product_price: this.sessionData.productInfo.price,
                    user_profile: this.sessionData.userProfile,
                    purchase_motivation: this.sessionData.motivation,
                    psychological_analysis: this.sessionData.psychology
                }])
                .select();

            if (error) throw error;
            
            if (data && data[0]) {
                this.sessionData.sessionId = data[0].id;
            }
        } catch (error) {
            console.error('保存会话数据失败:', error);
        }
    }

    async saveDecision() {
        if (!this.supabase || !this.sessionData.sessionId) return;

        try {
            const { error } = await this.supabase
                .from('decision_records')
                .insert([{
                    session_id: this.sessionData.sessionId,
                    final_choice: this.sessionData.decision,
                    analysis_content: JSON.stringify(this.sessionData.analysis)
                }]);

            if (error) throw error;
        } catch (error) {
            console.error('保存决策记录失败:', error);
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new ConsumptionAdvisor();
});