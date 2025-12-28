-- 理性消费旁观者 Agent 数据库结构
-- 使用 Supabase PostgreSQL

-- 用户配置表
CREATE TABLE user_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    api_url TEXT NOT NULL,
    api_key TEXT NOT NULL,
    model_name TEXT NOT NULL DEFAULT 'glm-4',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 消费会话表
CREATE TABLE consumption_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_data JSONB NOT NULL DEFAULT '{}',
    current_step INTEGER NOT NULL DEFAULT 1,
    product_name TEXT,
    product_price DECIMAL(10,2),
    user_profile JSONB DEFAULT '{}',
    purchase_motivation JSONB DEFAULT '{}',
    psychological_analysis JSONB DEFAULT '{}',
    final_decision TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 消费画像选择表
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES consumption_sessions(id) ON DELETE CASCADE,
    monthly_budget_range TEXT NOT NULL, -- 'low', 'medium', 'high'
    purchase_driver TEXT NOT NULL, -- 用户选择的购买驱动力
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 购买动机分析表
CREATE TABLE purchase_motivations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES consumption_sessions(id) ON DELETE CASCADE,
    trigger_reason TEXT NOT NULL,
    psychological_type TEXT, -- 'rational', 'emotional', 'identity', 'anxiety', 'fatigue'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 决策记录表
CREATE TABLE decision_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES consumption_sessions(id) ON DELETE CASCADE,
    final_choice TEXT NOT NULL, -- 'buy', 'wait_48h', 'not_buy'
    analysis_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_user_configs_user_id ON user_configs(user_id);
CREATE INDEX idx_consumption_sessions_user_id ON consumption_sessions(user_id);
CREATE INDEX idx_consumption_sessions_created_at ON consumption_sessions(created_at);
CREATE INDEX idx_user_profiles_session_id ON user_profiles(session_id);
CREATE INDEX idx_purchase_motivations_session_id ON purchase_motivations(session_id);
CREATE INDEX idx_decision_records_session_id ON decision_records(session_id);

-- 启用行级安全策略 (RLS)
ALTER TABLE user_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumption_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_motivations ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_records ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略（允许所有操作，实际项目中应该根据用户身份限制）
CREATE POLICY "Allow all operations on user_configs" ON user_configs FOR ALL USING (true);
CREATE POLICY "Allow all operations on consumption_sessions" ON consumption_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_profiles" ON user_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on purchase_motivations" ON purchase_motivations FOR ALL USING (true);
CREATE POLICY "Allow all operations on decision_records" ON decision_records FOR ALL USING (true);