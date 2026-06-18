/* ============================================
   BS Quiz - Admin Module
   Challenge code verification, batch import,
   weighted lottery, CSV export
   ============================================ */

const Admin = (() => {

    const STORAGE_KEY = 'bs_quiz_participants';
    let participants = [];
    let els = {};

    function cacheDom() {
        els = {
            verifyNickname: document.getElementById('admin-verify-nickname'),
            verifyCode: document.getElementById('admin-verify-code'),
            btnVerify: document.getElementById('btn-verify'),
            verifyResult: document.getElementById('verify-result'),
            batchInput: document.getElementById('batch-input'),
            btnBatchImport: document.getElementById('btn-batch-import'),
            batchProgress: document.getElementById('batch-progress'),
            batchResultDetail: document.getElementById('batch-result-detail'),
            lotteryCount: document.getElementById('lottery-count'),
            btnLottery: document.getElementById('btn-lottery'),
            lotteryResult: document.getElementById('lottery-result'),
            participantsList: document.getElementById('participants-list'),
            participantCount: document.getElementById('participant-count'),
            btnClearData: document.getElementById('btn-clear-data'),
            btnAddTest: document.getElementById('btn-add-test'),
            btnExportCsv: document.getElementById('btn-export-csv')
        };
    }

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type || 'info'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function loadParticipants() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            participants = data ? JSON.parse(data) : [];
        } catch { participants = []; }
        renderParticipants();
    }

    function saveParticipants() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
    }

    function addParticipant(nickname, score, shared, code) {
        const existing = participants.findIndex(p => p.nickname === nickname);
        const entry = {
            nickname, score, shared, code,
            weight: Crypto.calculateWeight(score, shared),
            timestamp: new Date().toISOString()
        };
        if (existing >= 0) {
            if (score > participants[existing].score) {
                participants[existing] = entry;
            } else {
                participants[existing].code = code;
                return false;
            }
        } else {
            if (CONFIG.maxParticipants && participants.length >= CONFIG.maxParticipants) return false;
            participants.push(entry);
        }
        return true;
    }

    // ========== Single Verification ==========

    async function verifyCode() {
        const nickname = els.verifyNickname.value.trim();
        const code = els.verifyCode.value.trim();
        if (!nickname || !code) { showToast('请输入昵称和挑战码', 'error'); return; }

        els.btnVerify.disabled = true;
        els.btnVerify.textContent = '验证中...';
        els.verifyResult.innerHTML = '';

        try {
            const result = await Crypto.verifyChallengeCode(nickname, code);
            if (result) {
                els.verifyResult.innerHTML = `
                    <div class="result-box">
                        <div class="result-row"><span class="result-label">昵称</span><span class="result-value">${escapeHtml(nickname)}</span></div>
                        <div class="result-row"><span class="result-label">成绩</span><span class="result-value">${result.score} 分</span></div>
                        <div class="result-row"><span class="result-label">分享</span><span class="result-value">${result.shared ? '是 ✅' : '否'}</span></div>
                        <div class="result-row"><span class="result-label">权重</span><span class="result-value">${result.weight}</span></div>
                    </div>`;
                addParticipant(nickname, result.score, result.shared, code);
                saveParticipants();
                renderParticipants();
                showToast('验证成功！已添加到参与者列表', 'success');
            } else {
                els.verifyResult.innerHTML = '<div class="result-box" style="border:1px solid var(--danger);"><p style="color:var(--danger);text-align:center;">❌ 验证失败：挑战码无效</p></div>';
                showToast('挑战码验证失败', 'error');
            }
        } catch (err) {
            showToast('验证过程出错：' + err.message, 'error');
        }
        els.btnVerify.disabled = false;
        els.btnVerify.textContent = '🔍 验证';
    }

    // ========== Batch Import ==========

    function parseBatchLine(line) {
        const trimmed = line.trim();
        if (!trimmed) return null;
        const separators = ['|', '\t', ',', '  ', ' '];
        for (const sep of separators) {
            const idx = trimmed.indexOf(sep);
            if (idx > 0) {
                const nickname = trimmed.substring(0, idx).trim();
                const code = trimmed.substring(idx + sep.length).trim();
                if (nickname && code) return { nickname, code };
            }
        }
        return null;
    }

    async function batchImport() {
        const raw = els.batchInput.value.trim();
        if (!raw) { showToast('请粘贴挑战码列表', 'error'); return; }

        const lines = raw.split(/[\r\n]+/).filter(l => l.trim());
        els.btnBatchImport.disabled = true;
        els.btnBatchImport.textContent = '导入中...';
        els.batchProgress.textContent = '';
        els.batchResultDetail.innerHTML = '';

        let successCount = 0, failCount = 0, skipCount = 0;
        const details = [];

        for (let i = 0; i < lines.length; i++) {
            const parsed = parseBatchLine(lines[i]);
            if (!parsed) {
                failCount++;
                details.push(`<span class="fail">✗ 第${i + 1}行：格式错误</span>`);
                continue;
            }
            const { nickname, code } = parsed;
            els.batchProgress.textContent = `正在验证 ${i + 1}/${lines.length}：${nickname}...`;

            try {
                const result = await Crypto.verifyChallengeCode(nickname, code);
                if (result) {
                    const added = addParticipant(nickname, result.score, result.shared, code);
                    if (added) {
                        successCount++;
                        details.push(`<span class="ok">✓ ${nickname}：${result.score}分 权重${result.weight}</span>`);
                    } else {
                        skipCount++;
                        details.push(`<span>→ ${nickname}：已存在且分数更高，跳过</span>`);
                    }
                } else {
                    failCount++;
                    details.push(`<span class="fail">✗ ${nickname}：挑战码无效</span>`);
                }
            } catch (err) {
                failCount++;
                details.push(`<span class="fail">✗ ${nickname}：验证出错</span>`);
            }

            if (i % 5 === 0) await new Promise(r => setTimeout(r, 10));
        }

        saveParticipants();
        renderParticipants();

        els.batchProgress.textContent = `完成！成功 ${successCount}，失败 ${failCount}，跳过 ${skipCount}`;
        els.batchResultDetail.innerHTML = details.join('<br>');
        els.btnBatchImport.disabled = false;
        els.btnBatchImport.textContent = '📥 批量验证导入';

        showToast(`批量导入完成：成功 ${successCount} 人`, successCount > 0 ? 'success' : 'error');
    }

    // ========== Weighted Lottery ==========

    function runLottery() {
        const count = parseInt(els.lotteryCount.value) || 0;
        if (count <= 0) { showToast('请输入有效的抽奖人数', 'error'); return; }
        if (participants.length === 0) { showToast('没有参与者，请先导入数据', 'error'); return; }
        if (count > participants.length) { showToast(`参与者不足！当前只有 ${participants.length} 人`, 'error'); return; }

        const eligible = participants.filter(p => p.weight > 0);
        if (eligible.length < count) {
            showToast(`有效参与者不足！需要权重>0的参与者至少 ${count} 人`, 'error');
            return;
        }

        const winners = [];
        const pool = [...eligible];
        for (let round = 0; round < count; round++) {
            const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
            if (totalWeight <= 0) break;
            let rand = Math.random() * totalWeight;
            let selected = null, selectedIndex = -1;
            for (let i = 0; i < pool.length; i++) {
                rand -= pool[i].weight;
                if (rand <= 0) { selected = pool[i]; selectedIndex = i; break; }
            }
            if (!selected) { selected = pool[pool.length - 1]; selectedIndex = pool.length - 1; }
            winners.push(selected);
            pool.splice(selectedIndex, 1);
        }

        els.lotteryResult.innerHTML = `
            <div class="card-title">🎉 中奖结果</div>
            <ul class="winners-list">
                ${winners.map((w, i) => `
                    <li class="winner-item" style="animation-delay:${i * 0.15}s;">
                        <span class="winner-rank">${i + 1}</span>
                        <span class="winner-name">${escapeHtml(w.nickname)}</span>
                        <span class="winner-score">${w.score}分 · 权重${w.weight}</span>
                    </li>`).join('')}
            </ul>`;
    }

    // ========== Participants List ==========

    function renderParticipants() {
        els.participantCount.textContent = participants.length;
        if (participants.length === 0) {
            els.participantsList.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">暂无参与者数据</p>';
            return;
        }
        const sorted = [...participants].sort((a, b) => b.weight - a.weight);
        els.participantsList.innerHTML = `
            <table class="participants-table">
                <thead><tr><th>#</th><th>昵称</th><th>成绩</th><th>分享</th><th>权重</th><th>时间</th></tr></thead>
                <tbody>${sorted.map((p, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${escapeHtml(p.nickname)}</td>
                        <td>${p.score}</td>
                        <td class="${p.shared ? 'participant-shared' : 'participant-noshare'}">${p.shared ? '是' : '否'}</td>
                        <td style="color:var(--secondary);font-weight:600;">${p.weight}</td>
                        <td style="font-size:0.7rem;color:var(--text-muted);">${p.timestamp ? p.timestamp.substring(0,10) : '-'}</td>
                    </tr>`).join('')}</tbody>
            </table>`;
    }

    // ========== CSV Export ==========

    function exportCSV() {
        if (participants.length === 0) { showToast('没有数据可导出', 'error'); return; }
        const header = '昵称,成绩,分享,权重,挑战码,时间';
        const rows = participants.map(p =>
            `${p.nickname},${p.score},${p.shared ? '是' : '否'},${p.weight},${p.code},${p.timestamp || ''}`
        );
        const BOM = '\uFEFF';
        const csv = BOM + header + '\n' + rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BS_参与者列表_${new Date().toISOString().substring(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('CSV 已导出', 'success');
    }

    // ========== Test Data ==========

    async function addTestData() {
        const testPlayers = [
            { nickname: '水边皮卡', score: 92, shared: true },
            { nickname: 'Spike', score: 78, shared: false },
            { nickname: '小明', score: 85, shared: true },
            { nickname: 'Brawl', score: 65, shared: false },
            { nickname: '大西瓜', score: 95, shared: true },
            { nickname: 'CrowKing', score: 72, shared: true },
            { nickname: '荒野猎人', score: 88, shared: false },
            { nickname: 'StarBoi', score: 55, shared: false },
        ];
        for (const p of testPlayers) {
            const code = await Crypto.generateChallengeCode(p.nickname, p.score, p.shared);
            addParticipant(p.nickname, p.score, p.shared, code);
        }
        saveParticipants();
        renderParticipants();
        showToast(`已添加 ${testPlayers.length} 名测试参与者`, 'success');
    }

    function clearData() {
        if (confirm('确定要清除所有参与者数据吗？此操作不可撤销！')) {
            participants = [];
            saveParticipants();
            renderParticipants();
            els.lotteryResult.innerHTML = '';
            els.verifyResult.innerHTML = '';
            els.batchProgress.textContent = '';
            els.batchResultDetail.innerHTML = '';
            showToast('数据已清除', 'info');
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function setupEvents() {
        els.btnVerify.addEventListener('click', verifyCode);
        els.verifyCode.addEventListener('keydown', (e) => { if (e.key === 'Enter') verifyCode(); });
        els.btnBatchImport.addEventListener('click', batchImport);
        els.btnLottery.addEventListener('click', runLottery);
        els.btnClearData.addEventListener('click', clearData);
        els.btnAddTest.addEventListener('click', addTestData);
        els.btnExportCsv.addEventListener('click', exportCSV);

        els.lotteryCount.addEventListener('input', () => {
            const val = parseInt(els.lotteryCount.value);
            if (val < 1) els.lotteryCount.value = 1;
            if (val > participants.length && participants.length > 0) els.lotteryCount.value = participants.length;
        });
    }

    function init() {
        cacheDom();
        setupEvents();
        loadParticipants();
    }

    return { init };

})();

document.addEventListener('DOMContentLoaded', () => Admin.init());
