import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import axios from 'axios'; 

const app = express();
app.use(cors());
app.use(express.json());

// uploads 폴더 경로
const uploadDir = path.join(process.cwd(), 'uploads');
// ⭐ outputs 폴더 경로 추가
const outputDir = path.join(process.cwd(), 'outputs');

// 폴더가 없으면 만들기
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir); // ⭐ 추가

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, /jpeg|jpg|png/i.test(file.mimetype));
  },
});

// 업로드 라우트
app.post('/api/upload', upload.single('file'), (req, res): void => {
  if (!req.file) {
    res.status(400).json({ error: '잘못된 파일' });
    return;
  }

  res.json({
    uploadUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  });
});

// fit 라우트 - 경로 수정
app.post('/api/fit', async (req, res): Promise<void> => {
  console.log('=== FIT 요청 시작 ===');
  console.log('받은 요청:', req.body);
  
  const { userUrl, clothUrl } = req.body as { userUrl: string; clothUrl: string };
  if (!userUrl || !clothUrl) {
    res.status(400).json({ error: 'URL 누락' });
    return;
  }

  try {
    // ⭐ Python 서버가 기대하는 절대 경로로 변경
    const baseDir = "/home/user/web-workspace/JinKyungEun000.vton.io/server/uploads";
    
    const userFileName = path.basename(userUrl);
    const clothFileName = path.basename(clothUrl);
    
    const userPath = path.join(baseDir, userFileName);
    const clothPath = path.join(baseDir, clothFileName);
    
    console.log('Python 서버로 전송할 경로:');
    console.log('userPath:', userPath);
    console.log('clothPath:', clothPath);

    // Python 서버로 요청
    const pyRes = await axios.post('http://localhost:5000/process', {
      userPath,
      clothPath,
    }, {
      timeout: 30000 // 30초 타임아웃
    });

    console.log('Python 서버 응답:', pyRes.data);
    const { resultUrl } = pyRes.data as { resultUrl: string };
    
    // ⭐ Python에서 반환된 URL을 Node.js 서버 URL로 변경
    const fileName = path.basename(resultUrl);
    const nodeResultUrl = `${req.protocol}://${req.get('host')}/outputs/${fileName}`;
    
    console.log('클라이언트로 반환할 URL:', nodeResultUrl);
    res.json({ resultUrl: nodeResultUrl });
    
  } catch (err: unknown) {
    console.error('=== FIT 요청 오류 ===');
    console.error('상세 오류:', err);
    
    if (axios.isAxiosError(err)) {
      console.error('Axios 오류 응답:', err.response?.data);
      console.error('Axios 오류 상태:', err.response?.status);
      console.error('Axios 오류 메시지:', err.message);
    }
    
    res.status(500).json({ 
      error: 'Python 처리 실패',
      details: axios.isAxiosError(err) ? err.response?.data : String(err)
    });
  }
});

// ⭐ 정적 파일 서비스 - outputs 폴더 추가
app.use('/uploads', express.static(uploadDir));
app.use('/outputs', express.static(outputDir)); // ⭐ 추가

// 서버 시작
app.listen(4000, () => {
  console.log('API 서버 실행: http://localhost:4000');
  console.log('uploads 폴더:', uploadDir);
  console.log('outputs 폴더:', outputDir);
});