const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { createToken, verifyToken } = require('./lib/auth');
const { buildProjectRecord } = require('./lib/project');
const { buildSubtitleBatch, buildExportPayload } = require('./lib/ai');
const { getAvailableVoices, buildVoiceoverPlan } = require('./lib/voiceover');
const { pool, testDatabaseConnection } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
let databaseReady = false;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === FRONTEND_ORIGIN || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);

    const dbCheck = await testDatabaseConnection();
    if (dbCheck.ok) {
      databaseReady = true;
      console.log('Database connection OK');
      return;
    }

    console.warn('Database not available, using in-memory fallback for demo mode:', dbCheck.error);
  } catch (error) {
    console.warn('Database not available, using in-memory fallback for demo mode:', error.message);
  }
}

const users = [
  {
    id: 'user-1',
    email: 'demo@videolocalizer.ai',
    password: '123456',
    name: 'Demo User',
  },
];

const projects = [
  {
    id: 'project-1',
    userId: 'user-1',
    name: 'Campaign Launch',
    language: 'Vietnamese',
    status: 'rendering',
    progress: 82,
  },
];

const tasks = [
  {
    id: 'task-1',
    projectId: 'project-1',
    title: 'AI subtitle sync',
    status: 'completed',
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: 'Voiceover localization',
    status: 'processing',
  },
];

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, databaseReady, message: 'VideoLocalizer API running' });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin đăng ký' });
  }

  if (databaseReady) {
    try {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rowCount > 0) {
        return res.status(409).json({ message: 'Email đã tồn tại' });
      }

      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, password],
      );

      const newUser = result.rows[0];
      const token = createToken({ id: newUser.id, email: newUser.email, role: 'user' });
      return res.status(201).json({ user: newUser, token });
    } catch (error) {
      console.error('Signup database error:', error);
      return res.status(500).json({ message: 'Không thể lưu người dùng vào cơ sở dữ liệu' });
    }
  }

  const exists = users.some((user) => user.email === email);
  if (exists) {
    return res.status(409).json({ message: 'Email đã tồn tại' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
  };

  users.push(newUser);
  const token = createToken({ id: newUser.id, email: newUser.email, role: 'user' });

  return res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
    token,
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (databaseReady) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, password_hash FROM users WHERE email = $1 AND password_hash = $2',
        [email, password],
      );

      const user = result.rows[0];
      if (!user) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      }

      const token = createToken({ id: user.id, email: user.email, role: 'user' });
      return res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (error) {
      console.error('Login database error:', error);
      return res.status(500).json({ message: 'Không thể xác thực với cơ sở dữ liệu' });
    }
  }

  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }

  const token = createToken({ id: user.id, email: user.email, role: 'user' });

  return res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

app.get('/api/projects', authMiddleware, async (req, res) => {
  if (databaseReady) {
    try {
      const result = await pool.query(
        'SELECT id, user_id AS "userId", name, language, status, progress FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id],
      );

      return res.json({ projects: result.rows });
    } catch (error) {
      console.error('Projects DB read error:', error);
      return res.status(500).json({ message: 'Không thể tải dự án từ cơ sở dữ liệu' });
    }
  }

  const userProjects = projects.filter((project) => project.userId === req.user.id);
  return res.json({ projects: userProjects });
});

app.get('/api/projects/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (databaseReady) {
    try {
      const projectResult = await pool.query(
        'SELECT id, user_id AS "userId", name, language, status, progress FROM projects WHERE id = $1 AND user_id = $2',
        [id, req.user.id],
      );

      if (projectResult.rowCount === 0) {
        return res.status(404).json({ message: 'Không tìm thấy dự án' });
      }

      const tasksResult = await pool.query(
        'SELECT id, project_id AS "projectId", title, status FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
        [id],
      );

      return res.json({
        project: projectResult.rows[0],
        tasks: tasksResult.rows,
      });
    } catch (error) {
      console.error('Project detail DB read error:', error);
      return res.status(500).json({ message: 'Không thể tải chi tiết dự án' });
    }
  }

  const project = projects.find((item) => item.id === id && item.userId === req.user.id);

  if (!project) {
    return res.status(404).json({ message: 'Không tìm thấy dự án' });
  }

  return res.json({
    project,
    tasks: tasks.filter((task) => task.projectId === id),
  });
});

app.get('/api/tasks', authMiddleware, async (req, res) => {
  if (databaseReady) {
    try {
      const result = await pool.query(
        'SELECT t.id, t.project_id AS "projectId", t.title, t.status FROM tasks t INNER JOIN projects p ON p.id = t.project_id WHERE p.user_id = $1 ORDER BY t.created_at DESC',
        [req.user.id],
      );
      return res.json({ tasks: result.rows });
    } catch (error) {
      console.error('Tasks DB read error:', error);
      return res.status(500).json({ message: 'Không thể tải danh sách tác vụ' });
    }
  }

  res.json({ tasks });
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const { name, language } = req.body || {};

  try {
    const project = buildProjectRecord({
      userId: req.user.id,
      name,
      language,
    });

    if (databaseReady) {
      try {
        const result = await pool.query(
          'INSERT INTO projects (user_id, name, language, status, progress) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id AS "userId", name, language, status, progress',
          [req.user.id, project.name, project.language, project.status, project.progress],
        );

        const savedProject = result.rows[0];
        return res.status(201).json({ project: savedProject });
      } catch (error) {
        console.error('Projects DB insert error:', error);
        return res.status(500).json({ message: 'Không thể lưu dự án vào cơ sở dữ liệu' });
      }
    }

    projects.push(project);
    return res.status(201).json({ project });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Tên dự án là bắt buộc' });
  }
});

app.post('/api/upload', authMiddleware, upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Không có file video được tải lên' });
  }

  if (databaseReady) {
    try {
      await pool.query(
        'INSERT INTO uploaded_files (user_id, filename, original_name, mime_type, file_size) VALUES ($1, $2, $3, $4, $5)',
        [req.user.id, req.file.filename, req.file.originalname, req.file.mimetype, req.file.size],
      );
    } catch (error) {
      console.error('Upload DB insert error:', error);
      return res.status(500).json({ message: 'Không thể lưu thông tin video vào cơ sở dữ liệu' });
    }
  }

  return res.status(201).json({
    file: {
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
    message: 'Upload video thành công',
  });
});

app.post('/api/transcription', authMiddleware, async (req, res) => {
  const { videoName, sourceLanguage, targetLanguage, sentences } = req.body || {};

  if (!videoName) {
    return res.status(400).json({ message: 'Tên video là bắt buộc' });
  }

  const sourceLines = Array.isArray(sentences) && sentences.length > 0
    ? sentences
    : [
        'Welcome to our product launch.',
        'We localize your message for every market.',
        'We are ready to bring your story to global audiences.',
      ];

  const subtitles = buildSubtitleBatch(sourceLines);

  if (databaseReady) {
    try {
      const projectResult = await pool.query(
        'SELECT id FROM projects WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [req.user.id],
      );

      const projectId = projectResult.rows?.[0]?.id;
      if (projectId) {
        await pool.query(
          'INSERT INTO tasks (project_id, title, status) VALUES ($1, $2, $3)',
          [projectId, 'AI subtitle generation', 'completed'],
        );
      }
    } catch (error) {
      console.error('Transcription task insert error:', error);
    }
  }

  return res.json({
    message: 'AI transcription đã tạo phụ đề cho video',
    subtitles,
    metadata: {
      sourceLanguage: sourceLanguage || 'English',
      targetLanguage: targetLanguage || 'Vietnamese',
      status: 'processed',
      videoName,
    },
  });
});

app.post('/api/export', authMiddleware, (req, res) => {
  const { projectName, format = 'mp4', quality = '4K' } = req.body || {};

  const exportPayload = buildExportPayload({ projectName, format, quality });

  return res.json({
    message: 'Video đã được đưa vào hàng chờ xuất bản',
    export: exportPayload,
  });
});

app.get('/api/voiceover/voices', authMiddleware, (_req, res) => {
  return res.json({ voices: getAvailableVoices() });
});

app.post('/api/voiceover', authMiddleware, async (req, res) => {
  const { text, voice = 'nhat-minh', language = 'Vietnamese' } = req.body || {};

  if (!text || !String(text).trim()) {
    return res.status(400).json({ message: 'Nội dung lồng tiếng là bắt buộc' });
  }

  const plan = buildVoiceoverPlan({ text, voice, language });

  if (process.env.OPENAI_API_KEY) {
    try {
      const voiceMap = {
        'nhat-minh': 'nova',
        'huyen-trang': 'alloy',
        'minh-anh': 'shimmer',
        'duc-huy': 'echo',
        'my-linh': 'onyx',
        alex: 'fable',
      };

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          voice: voiceMap[voice] || 'nova',
          input: text,
          response_format: 'mp3',
        }),
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const filename = `voiceover-${Date.now()}.mp3`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

        return res.json({
          message: 'AI voiceover đã được tạo thành công',
          voiceover: {
            ...plan,
            engine: 'openai-tts',
            audioUrl: `/uploads/${filename}`,
            status: 'ready',
          },
        });
      }
    } catch (error) {
      console.error('OpenAI TTS error:', error);
    }
  }

  return res.json({
    message: 'AI voiceover demo đã được lên lịch cho video',
    voiceover: {
      ...plan,
      engine: 'demo-tts',
      audioUrl: null,
      status: 'queued',
    },
  });
});

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`VideoLocalizer API running on http://localhost:${PORT}`);
  });
});
