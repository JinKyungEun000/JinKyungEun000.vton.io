"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // 개발용
// ── uploads 폴더 경로를 프로젝트 루트 기준으로 지정 ──
const uploadDir = path_1.default.join(process.cwd(), 'uploads');
// 폴더가 없으면 만들기
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir);
// ── 1) multer 디스크 저장소 ── 
const storage = multer_1.default.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${unique}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        cb(null, /jpeg|jpg|png/i.test(file.mimetype));
    },
});
// ── 2) 업로드 라우트 ──
app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: '잘못된 파일' });
        return;
    }
    const localPath = path_1.default.join(uploadDir, req.file.filename);
    /* ── 여기서 Python 서비스 호출 ────────────────── */
    try {
        const pyRes = await axios_1.default.post('http://localhost:5000/process', {
            path: localPath,
        });
        const resultUrlFromPy = pyRes.data.resultUrl; // FastAPI가 준 가공 결과 URL
        res.json({
            uploadUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
            resultUrl: resultUrlFromPy,
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Python 처리 실패' });
    }
});
// ── 3) 정적 서비스 ──
app.use('/uploads', express_1.default.static(uploadDir));
// ── 4) 서버 시작 ──
app.listen(4000, () => console.log('API 서버 실행: http://localhost:4000'));
