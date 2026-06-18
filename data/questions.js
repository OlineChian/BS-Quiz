/* ============================================
   BS Quiz - Question Bank
   All 35 questions, total score: 100
   ============================================ */

const QUESTIONS = [
    {
        "type": "single",
        "title": "荒野乱斗中，哪位英雄的超级技能是召唤一架舰炮？",
        "options": ["潘妮", "杰西", "帕姆", "雪莉"],
        "answer": 0,
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
        "options": ["单人荒野决斗", "乱斗竞技场", "车轮擂台赛", "夺杯飞逃"],
        "answer": 1,
        "score": 2
    },
    {
        "type": "single",
        "title": "英雄'格尔'的稀有度是？",
        "options": ["超稀有", "史诗", "神话", "传奇"],
        "answer": 1,
        "score": 2
    },
    {
        "type": "single",
        "title": "以下哪些队伍不曾代表中国大陆参加全球总决赛？",
        "options": ["Nova", "TIG", "TOC", "BC*"],
        "answer": 3,
        "score": 2
    },
    {
        "type": "multi",
        "title": "以下哪些内容曾经存在于游戏内？（多选）",
        "options": ["专精点数", "流彩点数", "绿色毒雾", "星光点数"],
        "answer": [0, 2, 3],
        "score": 3
    },
    {
        "type": "multi",
        "title": "以下哪些是游戏中的模式？（多选）",
        "options": ["赏金猎人", "乱斗篮球", "跑得快", "跑酷模式"],
        "answer": [0, 1, 2],
        "score": 3
    },
    {
        "type": "multi",
        "title": "以下哪些英雄可以使用治疗类随身妙具？（多选）",
        "options": ["罗莎", "比比", "波克", "公牛"],
        "answer": [1, 2, 3],
        "score": 3
    },
    {
        "type": "blank",
        "title": "荒野乱斗的英文名称是什么？（每个单词首字母大写并带空格）",
        "answer": "Brawl Stars",
        "score": 2
    },
    {
        "type": "blank",
        "title": "英雄最高等级是多少级？（阿拉伯数字）",
        "answer": "11",
        "score": 2
    },
    {
        "type": "blank",
        "title": "游戏中最高的英雄稀有度是什么？",
        "answer": "超凡",
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
        "items": ["爆破麦克", "艾尔·普里莫", "帕姆", "塔拉"],
        "answer": [1, 0, 2, 3],
        "score": 5
    },
    {
        "type": "sort",
        "title": "请按推出时间从早到晚排列以下英雄：",
        "items": ["莫提斯", "阿方", "桩", "博尔特"],
        "answer": [0, 1, 2, 3],
        "score": 5
    },
    {
        "type": "single",
        "title": "英雄'雪莉'的超级技能是？",
        "options": ["大口径霰弹枪", "超级霰弹枪", "双管霰弹", "超级霰弹"],
        "answer": 3,
        "score": 3
    },
    {
        "type": "single",
        "title": "在'乱斗篮球'模式中，进球最多得几分？",
        "options": ["1分", "2分", "3分", "5分"],
        "answer": 2,
        "score": 3
    },
    {
        "type": "single",
        "title": "英雄'公牛'使用的武器是？",
        "options": ["霰弹枪", "左轮手枪", "双管猎枪", "火箭筒"],
        "answer": 2,
        "score": 3
    },
    {
        "type": "single",
        "title": "游戏最多支持几人组队？",
        "options": ["1人", "2人", "3人", "5人"],
        "answer": 3,
        "score": 3
    },
    {
        "type": "multi",
        "title": "以下哪些是游戏中的货币？（多选）",
        "options": ["金币", "宝石", "星光点数", "钻石"],
        "answer": [0, 1],
        "score": 3
    },
    {
        "type": "multi",
        "title": "以下哪些英雄的普通攻击可以穿透敌人？（多选）",
        "options": ["丝塔诺娃", "西里乌斯", "蜜娜", "娜吉亚"],
        "answer": [0, 2, 3],
        "score": 3
    },
    {
        "type": "blank",
        "title": "游戏中闪闪币购物系统叫什么名字？",
        "answer": "奇物商店",
        "score": 2
    },
    {
        "type": "blank",
        "title": "神话英雄需要多少英雄券解锁？",
        "answer": "1900",
        "score": 2
    },
    {
        "type": "blank",
        "title": "英雄'迪克'达到1000奖杯获得的头衔是什么？（不含标点符号）",
        "answer": "我有头否",
        "score": 2
    },
    {
        "type": "sort",
        "title": "请按英雄生命值从低到高排列：",
        "items": ["迪克", "雪莉", "公牛", "弗兰肯"],
        "answer": [0, 1, 2, 3],
        "score": 5
    },
    {
        "type": "sort",
        "title": "请按排位赛段位从低到高排列：",
        "items": ["青铜", "白银", "黄金", "钻石"],
        "answer": [0, 1, 2, 3],
        "score": 5
    },
    {
        "type": "single",
        "title": "单个模式最多支持多少名玩家同时游玩？",
        "options": ["6人", "8人", "10人", "12人"],
        "answer": 3,
        "score": 3
    },
    {
        "type": "single",
        "title": "荒野乱斗国服正式上线于哪一年？",
        "options": ["2018年", "2019年", "2020年", "2021年"],
        "answer": 2,
        "score": 3
    },
    {
        "type": "single",
        "title": "以下哪位英雄是控场型？",
        "options": ["小罗", "塔拉", "娜吉亚", "珍妮特"],
        "answer": 0,
        "score": 3
    },
    {
        "type": "blank",
        "title": "英雄'里昂'的超级技能效果是什么？（两个字）",
        "answer": "隐身",
        "score": 3
    },
    {
        "type": "blank",
        "title": "巅峰通行证共有多少级？（阿拉伯数字）",
        "answer": "100",
        "score": 3
    },
    {
        "type": "multi",
        "title": "每日胜场出现过那些奖励？（多选）",
        "options": ["极限充能星妙惊喜", "甜心宝箱", "超级宝箱", "荣誉宝箱"],
        "answer": [0, 1, 2],
        "score": 3
    },
    {
        "type": "single",
        "title": "星徽之力增益挂饰的价格是多少宝石？",
        "options": ["149", "159", "179", "199"],
        "answer": 2,
        "score": 3
    },
    {
        "type": "single",
        "title": "以下哪一项不是星妙乐园的区域？",
        "options": ["小镇广场", "水上天地 ", "西部牛仔", "明日世界"],
        "answer": 2,
        "score": 3
    },
    {
        "type": "blank",
        "title": "国服曾经的联合运营商是？（两个字）",
        "answer": "游族",
        "score": 3
    },
    {
        "type": "blank",
        "title": "第一张乱斗金券对应的主题季名称是？",
        "answer": "塔拉的巴扎",
        "score": 2
    }
];
