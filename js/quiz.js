/* ============================================
   BS Quiz - Quiz Module
   Loads questions from global QUESTIONS variable
   (injected via <script> tag, no fetch needed)
   ============================================ */

const Quiz = (() => {

    let questions = [];
    let currentIndex = 0;
    let answers = [];
    let shuffledItems = [];

    /**
     * Load questions from global QUESTIONS variable
     * @returns {Array} loaded questions
     */
    function loadQuestions() {
        if (typeof QUESTIONS === 'undefined' || !Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
            throw new Error('题库数据未加载，请确保 data/questions.js 已正确引入');
        }
        questions = [...QUESTIONS];
        return questions;
    }

    /**
     * Shuffle an array (Fisher-Yates)
     */
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /**
     * Initialize quiz with shuffled questions
     */
    function init(count) {
        if (questions.length === 0) {
            throw new Error('No questions loaded. Call loadQuestions() first.');
        }
        const shuffled = shuffle(questions);
        const selected = count ? shuffled.slice(0, Math.min(count, shuffled.length)) : shuffled;
        questions = selected;
        currentIndex = 0;
        answers = new Array(questions.length).fill(null);
        shuffledItems = new Array(questions.length).fill(null);
    }

    function getTotal() { return questions.length; }
    function getCurrentIndex() { return currentIndex; }
    function getCurrentQuestion() { return currentIndex >= questions.length ? null : questions[currentIndex]; }
    function hasNext() { return currentIndex < questions.length - 1; }
    function hasPrev() { return currentIndex > 0; }

    function next() {
        if (hasNext()) { currentIndex++; return true; }
        return false;
    }

    function prev() {
        if (hasPrev()) { currentIndex--; return true; }
        return false;
    }

    function saveAnswer(value) {
        answers[currentIndex] = { type: questions[currentIndex].type, value: value };
    }

    function getAnswer() { return answers[currentIndex]; }
    function isAnswered() { return answers[currentIndex] !== null; }
    function getAllAnswers() { return answers; }

    function calculateScore() {
        let total = 0;
        for (let i = 0; i < questions.length; i++) {
            if (answers[i] && checkAnswer(questions[i], answers[i].value)) {
                total += questions[i].score;
            }
        }
        return total;
    }

    function checkAnswer(question, userAnswer) {
        switch (question.type) {
            case 'single':
                return userAnswer === question.answer;
            case 'multi': {
                if (!Array.isArray(userAnswer)) return false;
                const correct = question.answer;
                if (userAnswer.length !== correct.length) return false;
                const sortedUser = [...userAnswer].sort();
                const sortedCorrect = [...correct].sort();
                return sortedUser.every((v, i) => v === sortedCorrect[i]);
            }
            case 'blank':
                return String(userAnswer).trim().toLowerCase() ===
                       String(question.answer).trim().toLowerCase();
            case 'sort': {
                if (!Array.isArray(userAnswer)) return false;
                return userAnswer.every((v, i) => v === question.answer[i]);
            }
            default: return false;
        }
    }

    function getShuffledSortOrder() {
        const q = getCurrentQuestion();
        if (!q || q.type !== 'sort') return null;
        if (!shuffledItems[currentIndex]) {
            shuffledItems[currentIndex] = shuffle(q.items.map((_, i) => i));
        }
        return shuffledItems[currentIndex];
    }

    function getDetailedResults() {
        return questions.map((q, i) => ({
            question: q,
            userAnswer: answers[i] ? answers[i].value : null,
            correct: answers[i] ? checkAnswer(q, answers[i].value) : false
        }));
    }

    function getSummary() {
        const total = questions.length;
        const answered = answers.filter(a => a !== null).length;
        const correct = questions.filter((q, i) =>
            answers[i] && checkAnswer(q, answers[i].value)
        ).length;
        return { total, answered, correct };
    }

    return {
        loadQuestions, init, getTotal, getCurrentIndex,
        getCurrentQuestion, hasNext, hasPrev, next, prev,
        saveAnswer, getAnswer, isAnswered, getAllAnswers,
        calculateScore, checkAnswer, getShuffledSortOrder,
        getDetailedResults, getSummary
    };

})();
