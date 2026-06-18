const CONFIG = {
    // ============ 活动信息 ============
    title: "荒野乱斗知识挑战",
    subtitle: "挑战你的游戏知识，赢取奖励",
    startTime: "2026-06-18",
    endTime: "2026-06-22",

    // 活动状态文字
    statusText: "活动进行中",
    enableTimeCheck: true,

    // ============ 答题设置 ============
    questionCount: 0,
    shuffleQuestions: true,
    totalScore: 100,

    // ============ 分享设置 ============
    shareText: "我完成了荒野乱斗知识挑战！你也来试试吧！",
    qrUrl: "https://xxx.github.io/BS-Quiz/",
    shareBonus: 0.2,

    // ============ 挑战码设置 ============
    salt: "BS2026",
    codeLength: 10,

    // ============ 管理员设置 ============
    adminPassword: "",
    maxParticipants: 500,

    // ============ 界面设置 ============
    logoEmoji: "🏆",
    primaryColor: "#FF6B35",
    accentColor: "#FFD700",
    bgDark: "#1a1a2e",
    showConfetti: true,
    showTimer: false,

    // ============ 语言/文案 ============
    lang: {
        nicknameLabel: "输入昵称",
        nicknamePlaceholder: "中文2-4字 或 英文4-8字母",
        nicknameHint: "中文昵称2-4个字 · 英文昵称4-8个字母",
        nicknameError: "请输入2-4个中文字符 或 4-8个英文字母",
        startBtn: "开始挑战 ⚡",
        prevBtn: "← 上一题",
        nextBtn: "下一题 →",
        submitBtn: "提交答卷 ✓",
        resultTitle: "挑战完成！",
        shareBtn: "生成分享卡片 →",
        shareCardTitle: "分享卡片",
        generateBtn: "📸 生成图片",
        skipBtn: "跳过 →",
        shareBonusHint: "💎 保存分享卡片可提升中奖概率 +20%",
        finishTitle: "挑战完成！",
        challengeCodeLabel: "你的挑战码",
        copyCodeBtn: "📋 复制挑战码",
        copyCodeDone: "已复制！",
        footerSave: "请妥善保存挑战码 · 每人限参与一次 · 管理员可通过挑战码验证成绩",
        footerPrefix: "BS Quiz · 活动时间",
        loadingError: "题库加载失败，请刷新页面重试",
        notStarted: "活动尚未开始",
        ended: "活动已结束",
        scoreUnit: "分"
    }
};
