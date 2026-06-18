/* ============================================
   BS Quiz - Question Bank
   All 35 questions, total score: 100
   ============================================ */

const QUESTIONS = [
    {
        "type": "single",
        "title": "荒野乱斗中，哪位英雄的超级技能是召唤一架炮台？",
        "options": ["杰西", "潘妮", "柯尔特", "雪莉"],
        "answer": 1,
        "score": 2
    },
    {
        "type": "single",
        "title": "荒野乱斗的开发公司是？",
        "options": ["Riot Games", "Supercell", "Epic Games", "Valve"],
        "answer": 1,
        "score": 2
    },
    {
        "type": "single",
        "title": "下列哪个模式是3v3团队作战？",
        "options": ["荒野决斗", "宝石争霸", "双人荒野决斗", "首领之战"],
        "answer": 1,
        "score": 2
    },
    {
        "type": "single",
        "title": "英雄'公牛'的稀有度是？",
        "options": ["稀有", "超稀有", "史诗", "传奇"],
        "answer": 0,
        "score": 2
    },
    {
        "type": "single",
        "title": "以下哪个道具可以瞬间恢复全部生命值？",
        "options": ["能量饮料", "治疗图腾", "满血复活", "护盾"],
        "answer": 2,
        "score": 2
    },
    {
        "type": "multi",
        "title": "以下哪些是传奇稀有度的英雄？（多选）",
        "options": ["斯派克", "里昂", "琥珀", "塔拉"],
        "answer": [0, 1, 2],
        "score": 3
    },
    {
        "type": "multi",
        "title": "以下哪些是游戏中的模式？（多选）",
        "options": ["赏金猎人", "足球模式", "吃鸡模式", "跑酷模式"],
        "answer": [0, 1, 2],
        "score": 3
    },
    {
        "type": "multi",
        "title": "以下哪些英雄可以使用护盾技能？（多选）",
        "options": ["罗莎", "比比", "波克", "公牛"],
        "answer": [0, 1],
        "score": 3
    },
    {
        "type": "blank",
        "title": "荒野乱斗的英文名称是什么？",
        "answer": "Brawl Stars",
        "score": 2
    },
    {
        "type": "blank",
        "title": "英雄最高等级是多少级？",
        "answer": "11",
        "score": 2
    },
    {
        "type": "blank",
        "title": "游戏中最稀有的英雄稀有度名称是什么？",
        "answer": "传奇",
        "score": 2
    },
    {
        "type": "blank",
        "title": "Supercell公司的总部位于哪个国家？",
        "answer": "芬兰",
        "score": 2
    },
    {
        "type": "sort",
        "title": "请按稀有度从低到高排列以下英雄：",
        "items": ["公牛（稀有）", "潘妮（超稀有）", "帕姆（史诗）", "斯派克（传奇）"],
        "answer": [0, 1, 2, 3],
        "score": 5
    },
    {
        "type": "sort",
        "title": "请按推出时间从早到晚排列以下模式：",
        "items": ["宝石争霸", "赏金猎人", "乱斗足球", "热区争夺"],
        "answer": [0, 1, 2, 3],
        "score": 5
    },
    {
        "type": "single",
        "title": "英雄'雪莉'的超级技能是？",
        "options": ["超级霰弹", "冲刺", "召唤炮台", "治疗"],
        "answer": 0,
        "score": 3
    },
    {
        "type": "single",
        "title": "在'乱斗足球'模式中，进球得几分？",
        "options": ["1分", "2分", "3分", "5分"],
        "answer": 1,
        "score": 3
    },
    {
        "type": "single",
        "title": "英雄'柯尔特'使用的武器是？",
        "options": ["霰弹枪", "双枪", "狙击枪", "火箭筒"],
        "answer": 1,
        "score": 3
    },
    {
        "type": "single",
        "title": "'星光联赛'最多支持几人组队？",
        "options": ["1人", "2人", "3人", "5人"],
        "answer": 2,
        "score": 3
    },
    {
        "type": "multi",
        "title": "以下哪些是游戏中的货币？（多选）",
        "options": ["金币", "宝石", "星光点数", "钻石"],
        "answer": [0, 1, 2],
        "score": 3
    },
    {
        "type": "multi",
        "title": "以下哪些英雄的普通攻击可以穿透敌人？（多选）",
        "options": ["潘妮", "杰西", "帕姆", "波克"],
        "answer": [0, 1],
        "score": 3
    },
    {
        "type": "blank",
        "title": "游戏中的锦标赛系统叫什么名字？",
        "answer": "星光联赛",
        "score": 2
    },
    {
        "type": "blank",
        "title": "每个英雄最多可以装备几个星徽之力？",
        "answer": "2",
        "score": 2
    },
    {
        "type": "blank",
        "title": "英雄'斯派克'是什么稀有度？",
        "answer": "传奇",
        "score": 2
    },
    {
        "type": "sort",
        "title": "请按英雄生命值从低到高排列：",
        "items": ["柯尔特", "雪莉", "公牛", "弗兰肯"],
        "answer": [0, 1, 2, 3],
        "score": 5
    },
    {
        "type": "sort",
        "title": "请按杯数奖励段位从低到高排列：",
        "items": ["青铜", "白银", "黄金", "钻石"],
        "answer": [0, 1, 2, 3],
        "score": 5
    },
    {
        "type": "single",
        "title": "'荒野决斗'模式最多支持多少名玩家？",
        "options": ["6人", "8人", "10人", "12人"],
        "answer": 2,
        "score": 3
    },
    {
        "type": "single",
        "title": "英雄的最大等级需要什么道具解锁？",
        "options": ["金币", "宝石", "战力能量", "星徽之力"],
        "answer": 2,
        "score": 3
    },
    {
        "type": "single",
        "title": "以下哪位英雄是投弹手？",
        "options": ["柯尔特", "麦克", "公牛", "普里莫"],
        "answer": 1,
        "score": 3
    },
    {
        "type": "blank",
        "title": "英雄'里昂'的超级技能效果是什么？",
        "answer": "隐身",
        "score": 3
    },
    {
        "type": "blank",
        "title": "游戏中每局比赛的时间上限是多少分钟？（数字即可）",
        "answer": "5",
        "score": 3
    },
    {
        "type": "multi",
        "title": "以下哪些是坦克型英雄？（多选）",
        "options": ["公牛", "罗莎", "弗兰肯", "波克"],
        "answer": [0, 1, 2],
        "score": 3
    },
    {
        "type": "single",
        "title": "英雄'帕姆'的超级技能是？",
        "options": ["放置治疗台", "召唤炮台", "冲刺攻击", "范围轰炸"],
        "answer": 0,
        "score": 3
    },
    {
        "type": "single",
        "title": "游戏主题曲的风格是？",
        "options": ["古典", "摇滚", "西部牛仔", "电子"],
        "answer": 2,
        "score": 3
    },
    {
        "type": "blank",
        "title": "英雄'8比特'来自哪个游戏？",
        "answer": "游戏机",
        "score": 3
    },
    {
        "type": "blank",
        "title": "游戏中的吉祥物小鸡叫什么名字？",
        "answer": "佩佩",
        "score": 2
    }
];
