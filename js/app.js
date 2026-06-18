/* ============================================
   BS Quiz - Main App Module
   Handles UI, page flow, share card, and orchestration
   All text/display driven by CONFIG
   ============================================ */

const App = (() => {

    let nickname = '';
    let score = 0;
    let shared = false;
    let challengeCode = '';
    let totalQuestions = 0;
    let els = {};

    function cacheDom() {
        els = {
            pageNickname: document.getElementById('page-nickname'),
            pageQuiz: document.getElementById('page-quiz'),
            pageResult: document.getElementById('page-result'),
            pageShare: document.getElementById('page-share'),
            pageFinish: document.getElementById('page-finish'),
            nicknameInput: document.getElementById('nickname-input'),
            nicknameError: document.getElementById('nickname-error'),
            btnStart: document.getElementById('btn-start'),
            quizProgressText: document.getElementById('quiz-progress-text'),
            quizProgressFill: document.getElementById('quiz-progress-fill'),
            quizCard: document.getElementById('quiz-card'),
            btnPrev: document.getElementById('btn-prev'),
            btnNext: document.getElementById('btn-next'),
            btnSubmit: document.getElementById('btn-submit'),
            resultNickname: document.getElementById('result-nickname'),
            resultScore: document.getElementById('result-score'),
            btnGoShare: document.getElementById('btn-go-share'),
            shareNickname: document.getElementById('share-nickname'),
            shareScore: document.getElementById('share-score'),
            sharePreview: document.getElementById('share-preview'),
            shareImage: document.getElementById('share-image'),
            btnGenerateImage: document.getElementById('btn-generate-image'),
            btnSkipShare: document.getElementById('btn-skip-share'),
            finishNickname: document.getElementById('finish-nickname'),
            finishScore: document.getElementById('finish-score'),
            finishChallengeCode: document.getElementById('finish-challenge-code'),
            finishShared: document.getElementById('finish-shared'),
            btnCopyCode: document.getElementById('btn-copy-code'),
            shareCanvas: document.getElementById('shareCanvas'),
            qrCanvas: document.getElementById('qr-canvas')
        };
    }

    function applyConfigToUI() {
        const L = CONFIG.lang;
        document.title = CONFIG.title;

        const pageTitleEl = document.getElementById('page-title');
        if (pageTitleEl) pageTitleEl.textContent = CONFIG.title;

        const headerLogo = document.getElementById('header-logo');
        if (headerLogo) headerLogo.textContent = CONFIG.logoEmoji;

        const headerTitle = document.getElementById('header-title');
        if (headerTitle) headerTitle.textContent = CONFIG.title;

        const headerSubtitle = document.getElementById('header-subtitle');
        if (headerSubtitle) headerSubtitle.textContent = CONFIG.subtitle;

        const headerStatus = document.getElementById('header-status');
        if (headerStatus && CONFIG.enableTimeCheck) {
            const now = new Date();
            const start = new Date(CONFIG.startTime);
            const end = new Date(CONFIG.endTime + 'T23:59:59');
            if (now < start) {
                headerStatus.style.display = 'block';
                headerStatus.textContent = CONFIG.lang.notStarted;
                headerStatus.style.color = 'var(--accent)';
            } else if (now > end) {
                headerStatus.style.display = 'block';
                headerStatus.textContent = CONFIG.lang.ended;
                headerStatus.style.color = 'var(--danger)';
            }
        }

        const el = (id, text) => { const e = document.getElementById(id); if (e) e.textContent = text; };
        el('nickname-card-title', L.nicknameLabel);
        el('nickname-label', L.nicknameLabel);
        el('nickname-hint', L.nicknameHint);
        el('btn-start', L.startBtn);
        el('btn-prev', L.prevBtn);
        el('btn-next', L.nextBtn);
        el('btn-submit', L.submitBtn);
        el('result-page-title', L.resultTitle);
        el('result-score-unit', L.scoreUnit);
        el('btn-go-share', L.shareBtn);
        el('share-page-title', L.shareCardTitle);
        el('share-score-unit', L.scoreUnit);
        el('share-bonus-hint', L.shareBonusHint);
        el('btn-generate-image', L.generateBtn);
        el('btn-skip-share', L.skipBtn);
        el('finish-page-title', L.finishTitle);
        el('finish-score-unit', L.scoreUnit);
        el('challenge-code-label', L.challengeCodeLabel);
        el('btn-copy-code', L.copyCodeBtn);
        el('finish-footer', L.footerSave);

        const nickInput = document.getElementById('nickname-input');
        if (nickInput) nickInput.placeholder = L.nicknamePlaceholder;

        const footerInfo = document.getElementById('footer-info');
        if (footerInfo) footerInfo.textContent = `${L.footerPrefix} ${CONFIG.startTime} - ${CONFIG.endTime}`;
    }

    function showPage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        if (page) { page.classList.add('active', 'fade-in'); }
    }

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type || 'info'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function validateNickname(name) {
        const trimmed = name.trim();
        if (/^[\u4e00-\u9fa5]{2,4}$/.test(trimmed)) return { valid: true, nickname: trimmed };
        if (/^[A-Za-z]{4,8}$/.test(trimmed)) return { valid: true, nickname: trimmed };
        return { valid: false, nickname: trimmed };
    }

    function launchConfetti() {
        if (!CONFIG.showConfetti) return;
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);
        const colors = ['#FF6B35', '#FFD700', '#00B4D8', '#2ecc71', '#e74c3c', '#9b59b6'];
        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
            piece.style.animationDelay = Math.random() * 0.5 + 's';
            piece.style.width = (Math.random() * 8 + 6) + 'px';
            piece.style.height = (Math.random() * 8 + 6) + 'px';
            container.appendChild(piece);
        }
        setTimeout(() => container.remove(), 3500);
    }

    // ========== Question Rendering ==========

    function renderQuestion() {
        const q = Quiz.getCurrentQuestion();
        if (!q) return;
        const savedAnswer = Quiz.getAnswer();
        const typeLabels = { single: '单选题', multi: '多选题', blank: '填空题', sort: '排序题' };
        const typeClass = `badge-${q.type}`;

        let html = `<span class="question-type-badge ${typeClass}">${typeLabels[q.type]} · ${q.score}分</span>
            <div class="question-text">${q.title}</div>`;

        switch (q.type) {
            case 'single': html += renderSingleOptions(q, savedAnswer); break;
            case 'multi': html += renderMultiOptions(q, savedAnswer); break;
            case 'blank': html += renderBlankInput(q, savedAnswer); break;
            case 'sort': html += renderSortItems(q, savedAnswer); break;
        }
        els.quizCard.innerHTML = html;
        attachQuizEvents(q);
        updateNavButtons();
    }

    function renderSingleOptions(q, saved) {
        return `<ul class="options-list">${q.options.map((opt, i) => `
            <li class="option-item${saved && saved.value === i ? ' selected' : ''}" data-value="${i}">
                <span class="option-radio"></span><span class="option-label">${opt}</span>
            </li>`).join('')}</ul>`;
    }

    function renderMultiOptions(q, saved) {
        const selected = saved ? saved.value : [];
        return `<ul class="options-list">${q.options.map((opt, i) => `
            <li class="option-item${selected.includes(i) ? ' selected' : ''}" data-value="${i}">
                <span class="option-checkbox"></span><span class="option-label">${opt}</span>
            </li>`).join('')}</ul>`;
    }

    function renderBlankInput(q, saved) {
        return `<input type="text" class="blank-input" id="blank-answer" placeholder="请输入答案..."
            value="${escapeHtml(saved ? saved.value : '')}" autocomplete="off">`;
    }

    function renderSortItems(q, saved) {
        const order = Quiz.getShuffledSortOrder();
        const displayOrder = (saved ? saved.value : null) || order;
        return `<ul class="sort-list" id="sort-list">${displayOrder.map((origIndex, displayPos) => `
            <li class="sort-item" draggable="true" data-original-index="${origIndex}">
                <span class="sort-handle">⋮⋮</span>
                <span class="sort-number">${displayPos + 1}</span>
                <span class="sort-text">${q.items[origIndex]}</span>
            </li>`).join('')}</ul>`;
    }

    function attachQuizEvents(q) {
        if (q.type === 'single') {
            els.quizCard.querySelectorAll('.option-item').forEach(item => {
                item.addEventListener('click', () => {
                    const val = parseInt(item.dataset.value);
                    els.quizCard.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
                    item.classList.add('selected');
                    Quiz.saveAnswer(val);
                    updateNavButtons();
                });
            });
        }
        if (q.type === 'multi') {
            els.quizCard.querySelectorAll('.option-item').forEach(item => {
                item.addEventListener('click', () => {
                    const val = parseInt(item.dataset.value);
                    item.classList.toggle('selected');
                    const sel = [...els.quizCard.querySelectorAll('.option-item.selected')].map(el => parseInt(el.dataset.value));
                    Quiz.saveAnswer(sel.length > 0 ? sel : null);
                    updateNavButtons();
                });
            });
        }
        if (q.type === 'blank') {
            const input = els.quizCard.querySelector('#blank-answer');
            if (input) {
                input.addEventListener('input', () => { Quiz.saveAnswer(input.value || null); updateNavButtons(); });
                input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && Quiz.hasNext()) { e.preventDefault(); goNext(); } });
            }
        }
        if (q.type === 'sort') {
            const sortList = els.quizCard.querySelector('#sort-list');
            if (!sortList) return;
            let dragged = null;
            sortList.querySelectorAll('.sort-item').forEach(item => {
                item.addEventListener('dragstart', e => { dragged = item; item.style.opacity = '0.5'; e.dataTransfer.effectAllowed = 'move'; });
                item.addEventListener('dragend', () => { item.style.opacity = '1'; dragged = null; updateSortNumbers(sortList); saveSortAnswer(sortList); updateNavButtons(); });
                item.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
                item.addEventListener('drop', e => {
                    e.preventDefault();
                    if (dragged && dragged !== item) {
                        const items = [...sortList.children];
                        const di = items.indexOf(dragged), ti = items.indexOf(item);
                        sortList.insertBefore(dragged, di < ti ? item.nextSibling : item);
                        updateSortNumbers(sortList); saveSortAnswer(sortList); updateNavButtons();
                    }
                });
            });
        }
    }

    function updateSortNumbers(sl) { sl.querySelectorAll('.sort-item').forEach((it, i) => { it.querySelector('.sort-number').textContent = i + 1; }); }
    function saveSortAnswer(sl) { Quiz.saveAnswer([...sl.querySelectorAll('.sort-item')].map(it => parseInt(it.dataset.originalIndex))); }

    function updateNavButtons() {
        els.btnPrev.style.display = Quiz.hasPrev() ? '' : 'none';
        els.btnSubmit.style.display = Quiz.hasNext() ? 'none' : '';
        if (Quiz.hasNext()) els.btnNext.textContent = CONFIG.lang.nextBtn;
        const idx = Quiz.getCurrentIndex(), total = Quiz.getTotal();
        els.quizProgressText.textContent = `第 ${idx + 1} / ${total} 题`;
        els.quizProgressFill.style.width = `${((idx + 1) / total) * 100}%`;
    }

    function goNext() { if (Quiz.hasNext()) { Quiz.next(); renderQuestion(); } }
    function goPrev() { if (Quiz.hasPrev()) { Quiz.prev(); renderQuestion(); } }

    function escapeHtml(str) {
        const div = document.createElement('div'); div.textContent = str || ''; return div.innerHTML;
    }

    // ========== Share Card Generation ==========

    function generateShareImage() {
        return new Promise((resolve) => {
            const canvas = els.shareCanvas, ctx = canvas.getContext('2d');
            const w = 600, h = 850;
            canvas.width = w; canvas.height = h;

            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#1a1a2e'); bgGrad.addColorStop(0.5, '#16213e'); bgGrad.addColorStop(1, '#0f3460');
            ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, w, h);

            ctx.globalAlpha = 0.08;
            ctx.fillStyle = '#FF6B35'; ctx.beginPath(); ctx.arc(500, 100, 200, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(100, 650, 150, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#00B4D8'; ctx.beginPath(); ctx.arc(450, 700, 120, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;

            const accentGrad = ctx.createLinearGradient(0, 0, w, 0);
            accentGrad.addColorStop(0, '#FF6B35'); accentGrad.addColorStop(0.5, '#FFD700'); accentGrad.addColorStop(1, '#FF6B35');
            ctx.fillStyle = accentGrad; ctx.fillRect(0, 0, w, 4);

            ctx.fillStyle = '#FFD700'; ctx.font = 'bold 36px "PingFang SC", "Microsoft YaHei", sans-serif';
            ctx.textAlign = 'center'; ctx.fillText(CONFIG.title, w / 2, 100);
            ctx.fillStyle = '#8892a4'; ctx.font = '18px "PingFang SC", "Microsoft YaHei", sans-serif';
            ctx.fillText(CONFIG.subtitle, w / 2, 140);

            ctx.strokeStyle = 'rgba(255,215,0,0.3)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(100, 180); ctx.lineTo(500, 180); ctx.stroke();

            ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 2;
            roundRect(ctx, 60, 220, 480, 280, 20); ctx.fill(); ctx.stroke();

            ctx.fillStyle = 'rgba(255,107,53,0.15)'; ctx.beginPath(); ctx.arc(w / 2, 300, 50, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FF6B35'; ctx.font = '40px sans-serif'; ctx.fillText(CONFIG.logoEmoji, w / 2, 315);

            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 30px "PingFang SC", "Microsoft YaHei", sans-serif';
            ctx.fillText(nickname, w / 2, 380);

            const scoreGrad = ctx.createLinearGradient(0, 400, 0, 460);
            scoreGrad.addColorStop(0, '#FFD700'); scoreGrad.addColorStop(1, '#FF6B35');
            ctx.fillStyle = scoreGrad; ctx.font = 'bold 64px sans-serif'; ctx.fillText(score.toString(), w / 2, 455);
            ctx.fillStyle = '#8892a4'; ctx.font = '16px "PingFang SC", "Microsoft YaHei", sans-serif';
            ctx.fillText(CONFIG.lang.scoreUnit, w / 2 + 60, 455);

            ctx.fillStyle = '#e0e0e0'; ctx.font = '20px "PingFang SC", "Microsoft YaHei", sans-serif';
            ctx.fillText('我完成挑战啦！', w / 2, 550);
            ctx.fillStyle = '#FFD700'; ctx.font = '18px "PingFang SC", "Microsoft YaHei", sans-serif';
            ctx.fillText(CONFIG.shareText, w / 2, 585);

            // Draw QR code
            const qrCanvas = els.qrCanvas;
            QRCodeGen.drawToCanvas(qrCanvas, CONFIG.qrUrl, 120);
            ctx.drawImage(qrCanvas, w / 2 - 60, 620, 120, 120);
            ctx.fillStyle = '#8892a4'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('扫码参与挑战', w / 2, 755);

            ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif';
            ctx.fillText('BS Quiz - Brawl Stars Knowledge Challenge', w / 2, 820);

            canvas.toBlob((blob) => { resolve(URL.createObjectURL(blob)); }, 'image/png');
        });
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r); ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
    }

    // ========== Flow Control ==========

    function init() {
        cacheDom();
        applyConfigToUI();

        // Load questions from global QUESTIONS (injected via <script>)
        try {
            Quiz.loadQuestions();
        } catch (err) {
            console.error('Question load error:', err);
            showToast(CONFIG.lang.loadingError, 'error');
            return;
        }

        setupEvents();
        showPage(els.pageNickname);
    }

    function setupEvents() {
        els.nicknameInput.addEventListener('input', () => {
            const result = validateNickname(els.nicknameInput.value);
            if (!result.valid && els.nicknameInput.value.length > 0) {
                els.nicknameError.textContent = CONFIG.lang.nicknameError;
                els.btnStart.disabled = true;
            } else {
                els.nicknameError.textContent = '';
                els.btnStart.disabled = !result.valid;
            }
        });
        els.nicknameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !els.btnStart.disabled) startQuiz();
        });
        els.btnStart.addEventListener('click', startQuiz);
        els.btnPrev.addEventListener('click', goPrev);
        els.btnNext.addEventListener('click', goNext);
        els.btnSubmit.addEventListener('click', submitQuiz);

        els.btnGoShare.addEventListener('click', () => {
            els.shareNickname.textContent = nickname;
            els.shareScore.textContent = score;
            showPage(els.pageShare);
        });

        els.btnGenerateImage.addEventListener('click', async () => {
            shared = true;
            const imageUrl = await generateShareImage();
            els.shareImage.src = imageUrl;
            els.sharePreview.style.display = 'block';
            const a = document.createElement('a');
            a.href = imageUrl; a.download = `BS_Challenge_${nickname}.png`; a.click();
            setTimeout(() => showFinish(), 1500);
        });

        els.btnSkipShare.addEventListener('click', () => { shared = false; showFinish(); });
        els.btnCopyCode.addEventListener('click', copyChallengeCode);
        els.finishChallengeCode.addEventListener('click', copyChallengeCode);
    }

    function startQuiz() {
        const result = validateNickname(els.nicknameInput.value);
        if (!result.valid) {
            els.nicknameError.textContent = '请输入有效的昵称';
            els.nicknameInput.classList.add('shake');
            setTimeout(() => els.nicknameInput.classList.remove('shake'), 400);
            return;
        }
        nickname = result.nickname;
        Quiz.init(CONFIG.questionCount);
        totalQuestions = Quiz.getTotal();
        showPage(els.pageQuiz);
        renderQuestion();
    }

    function submitQuiz() {
        const q = Quiz.getCurrentQuestion();
        if (q && q.type === 'sort') {
            const sortList = els.quizCard.querySelector('#sort-list');
            if (sortList) saveSortAnswer(sortList);
        }
        score = Quiz.calculateScore();
        els.resultNickname.textContent = nickname;
        els.resultScore.textContent = score;
        showPage(els.pageResult);
        launchConfetti();
    }

    async function showFinish() {
        challengeCode = await Crypto.generateChallengeCode(nickname, score, shared);
        els.finishNickname.textContent = nickname;
        els.finishScore.textContent = score;
        els.finishChallengeCode.textContent = challengeCode;
        els.finishShared.textContent = shared ? '已分享 (+20% 抽奖权重加成)' : '未分享';
        showPage(els.pageFinish);
    }

    async function copyChallengeCode() {
        try {
            await navigator.clipboard.writeText(challengeCode);
            showToast('挑战码已复制！请妥善保存', 'success');
        } catch (e) {
            // Fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = challengeCode;
            ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('挑战码已复制！请妥善保存', 'success');
        }
    }

    function resetQuiz() {
        nickname = ''; score = 0; shared = false; challengeCode = '';
        els.nicknameInput.value = ''; els.nicknameError.textContent = '';
        els.btnStart.disabled = true;
        els.sharePreview.style.display = 'none'; els.shareImage.src = '';
        showPage(els.pageNickname);
    }

    function updateCopyButtonText() {
        if (els.btnCopyCode) {
            els.btnCopyCode.textContent = '📋 复制挑战码';
        }
    }

    return { init, copyChallengeCode };

})();

document.addEventListener('DOMContentLoaded', () => App.init());
