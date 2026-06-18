/* ============================================
   BS Quiz - Crypto Module
   Challenge code generation using SHA-256
   ============================================ */

const Crypto = (() => {

    async function sha256(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function hexToBase64(hex) {
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) {
            bytes.push(parseInt(hex.substr(i, 2), 16));
        }
        return btoa(String.fromCharCode(...bytes));
    }

    async function generateChallengeCode(nickname, score, shared) {
        const raw = `${nickname}|${score}|${shared}|${CONFIG.salt}`;
        const hash = await sha256(raw);
        const base64 = hexToBase64(hash);
        const len = CONFIG.codeLength || 10;
        return base64.replace(/[^A-Za-z0-9]/g, '').substring(0, len);
    }

    async function verifyChallengeCode(nickname, code) {
        for (let score = 0; score <= 100; score++) {
            for (const shared of [false, true]) {
                const generated = await generateChallengeCode(nickname, score, shared);
                if (generated === code) {
                    return { score, shared, weight: calculateWeight(score, shared) };
                }
            }
        }
        return null;
    }

    function calculateWeight(score, shared) {
        if (shared) return Math.floor(score * (1 + CONFIG.shareBonus));
        return score;
    }

    return { generateChallengeCode, verifyChallengeCode, calculateWeight, sha256 };

})();
