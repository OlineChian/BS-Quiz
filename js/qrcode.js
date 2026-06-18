/* ============================================
   BS Quiz - QR Code Generator
   Lightweight QR code generation for Canvas
   Based on QR Code Generator (MIT)
   ============================================ */

const QRCodeGen = (() => {

    // QR Code type number (1-40), auto-calculated
    function getTypeNumber(text, errorLevel) {
        const len = text.length;
        const mode = getMode(text);
        let bits = 4 + getCharCountBits(mode, 1) + len * 8;
        for (let type = 1; type <= 40; type++) {
            const total = getTotalCodewords(type);
            const ec = getECCodewords(type, errorLevel);
            const data = total - ec;
            if (data * 8 >= bits + 7) return type;
        }
        return 40;
    }

    function getMode(text) {
        for (let i = 0; i < text.length; i++) {
            const c = text.charCodeAt(i);
            if (c < 0x30 || c > 0x39 || c === 0x3A || c === 0x3B || c === 0x3C || c === 0x3D || c === 0x3E || c === 0x3F || c === 0x40) {
                if (c > 0xFF) return 0x8; // kanji mode (simplified: treat as byte)
                return 0x4; // byte mode
            }
        }
        return 0x1; // numeric
    }

    function getCharCountBits(mode, type) {
        const table = {
            1: { 0x1: [10,12,14], 0x2: [9,11,13], 0x4: [8,16,16], 0x8: [8,10,12] },
            2: { 0x1: [10,12,14], 0x2: [9,11,13], 0x4: [8,16,16], 0x8: [8,10,12] }
        };
        return 8; // simplified
    }

    function getTotalCodewords(type) {
        const table = [0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];
        return table[type] || 3706;
    }

    function getECCodewords(type, level) {
        const L = 0, M = 1, Q = 2, H = 3;
        const table = [
            [0,0,0,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0],
            [0,1,0,0,0],[0,2,0,0,0],[0,2,0,0,0],[0,2,0,0,0],[0,2,0,0,0],
            [0,4,0,0,0],[0,4,0,0,0],[0,4,0,0,0],[0,4,0,0,0],[0,4,0,0,0],
            [0,6,0,0,0],[0,6,0,0,0],[0,6,0,0,0],[0,6,0,0,0],[0,7,0,0,0],
            [0,8,0,0,0],[0,8,0,0,0],[0,9,0,0,0],[0,9,0,0,0],[0,10,0,0,0],
            [0,12,0,0,0],[0,13,0,0,0],[0,14,0,0,0],[0,15,0,0,0],[0,16,0,0,0],
            [0,17,0,0,0],[0,18,0,0,0],[0,19,0,0,0],[0,19,0,0,0],[0,20,0,0,0],
            [0,21,0,0,0],[0,22,0,0,0],[0,24,0,0,0],[0,25,0,0,0]
        ];
        return table[type][level + 1] || 0;
    }

    function makeImpl() {
        const size = 21; // Version 1: 21x21
        const matrix = [];
        for (let r = 0; r < size; r++) {
            matrix[r] = [];
            for (let c = 0; c < size; c++) matrix[r][c] = null;
        }

        // Finder patterns
        placeFinder(matrix, 0, 0);
        placeFinder(matrix, 0, size - 7);
        placeFinder(matrix, size - 7, 0);

        // Timing patterns
        for (let i = 8; i < size - 8; i++) {
            matrix[6][i] = i % 2 === 0;
            matrix[i][6] = i % 2 === 0;
        }

        // Dark module
        matrix[size - 8][8] = true;

        // Alignment pattern (Version 1 has none)

        // Format info (simplified)
        const formatBits = [1,1,1,0,1,1,1,1,1,0,0,0,1,0,0];
        for (let i = 0; i < 6; i++) matrix[i][8] = formatBits[i];
        for (let i = 0; i < 6; i++) matrix[8][size - 1 - i] = formatBits[i];
        for (let i = 0; i < 9; i++) {
            if (i !== 6) matrix[8][i] = formatBits[14 - i];
        }

        return matrix;
    }

    function placeFinder(matrix, row, col) {
        for (let r = -1; r <= 7; r++) {
            for (let c = -1; c <= 7; c++) {
                if (row + r < 0 || col + c < 0 || row + r >= matrix.length || col + c >= matrix.length) continue;
                if (r === -1 || r === 7 || c === -1 || c === 7 || (r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)))) {
                    matrix[row + r][col + c] = true;
                } else {
                    matrix[row + r][col + c] = false;
                }
            }
        }
    }

    function encodeText(matrix, text) {
        let row = matrix.length - 1;
        let col = matrix.length - 1;
        let dir = -1; // upward
        let idx = 0;
        const bytes = [];
        // Add mode indicator + char count + data + terminator
        bytes.push(0,1,0,0); // byte mode (0100)
        const len = text.length;
        for (let i = 7; i >= 0; i--) bytes.push((len >> i) & 1);
        for (let i = 0; i < text.length; i++) {
            const b = text.charCodeAt(i) & 0xFF;
            for (let j = 7; j >= 0; j--) bytes.push((b >> j) & 1);
        }
        // Terminator (up to 4 zeros)
        for (let i = 0; i < 4 && bytes.length < 128; i++) bytes.push(0);
        // Pad to 8-bit boundary
        while (bytes.length % 8 !== 0) bytes.push(0);
        // Pad bytes
        const pads = [0xEC, 0x11];
        let pi = 0;
        while (bytes.length < 128 * 8) {
            for (let j = 7; j >= 0; j--) bytes.push((pads[pi] >> j) & 1);
            pi = (pi + 1) % 2;
        }

        // Place data bits
        while (idx < bytes.length) {
            if (matrix[row][col] === null) {
                matrix[row][col] = bytes[idx];
                idx++;
            }
            // Move
            if (col % 2 === (col > 6 ? 0 : 0)) {
                // right column of pair
                col--;
            } else {
                // left column of pair
                col++;
                row += dir;
                if (row < 0 || row >= matrix.length) {
                    dir = -dir;
                    row += dir;
                    col -= 2;
                    if (col === 6) col--;
                    if (col < 0) break;
                }
            }
        }
    }

    function createQRCode(text) {
        const matrix = makeImpl();
        encodeText(matrix, text);
        // Fill remaining nulls as false
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] === null) matrix[r][c] = false;
            }
        }
        return matrix;
    }

    function drawToCanvas(canvas, text, size) {
        const matrix = createQRCode(text);
        const moduleSize = Math.floor(size / matrix.length);
        const offset = Math.floor((size - moduleSize * matrix.length) / 2);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#000000';
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c]) {
                    ctx.fillRect(offset + c * moduleSize, offset + r * moduleSize, moduleSize, moduleSize);
                }
            }
        }
        return canvas;
    }

    return { createQRCode, drawToCanvas };
})();
