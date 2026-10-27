function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function translateText(source) {
  const normalized = String(source || '').trim();

  if (!normalized) {
    return 'Không có văn bản để dịch.';
  }

  const lower = normalized.toLowerCase();

  if (lower.includes('welcome')) {
    return 'Chào mừng đến với buổi ra mắt sản phẩm của chúng tôi.';
  }

  if (lower.includes('we localize')) {
    return 'Chúng tôi bản địa hóa thông điệp của bạn cho mọi thị trường.';
  }

  if (lower.includes('ready')) {
    return 'Chúng tôi đã sẵn sàng để mang thông điệp của bạn tới toàn cầu.';
  }

  if (lower.includes('launch')) {
    return 'Chúng tôi đang ra mắt sản phẩm trên toàn cầu.';
  }

  if (lower.includes('video')) {
    return 'Video này đã được chuẩn bị cho người xem ở nhiều quốc gia.';
  }

  return `Bản dịch tiếng Việt: ${normalized}`;
}

function buildSubtitleBatch(sourceLines) {
  const lines = Array.isArray(sourceLines) ? sourceLines.filter(Boolean) : [];

  if (lines.length === 0) {
    return [
      {
        start: '00:00',
        end: '00:05',
        source: 'Welcome to our video localization workflow.',
        target: 'Chào mừng đến với quy trình bản địa hóa video của chúng tôi.',
      },
    ];
  }

  return lines.map((line, index) => {
    const source = String(line).trim();
    const start = formatTime(index * 6);
    const end = formatTime(index * 6 + 5);

    return {
      start,
      end,
      source,
      target: translateText(source),
    };
  });
}

function buildExportPayload({ projectName, format = 'mp4', quality = '4K' }) {
  const safeProjectName = String(projectName || 'Untitled Project')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled-project';

  const outputSizeMap = {
    '4K': '4.8 GB',
    '1080p': '2.1 GB',
    '720p': '980 MB',
  };

  return {
    projectName: projectName || 'Untitled Project',
    format,
    quality,
    status: 'queued',
    createdAt: new Date().toISOString(),
    jobId: `job-${Date.now()}`,
    filename: `${safeProjectName}-${Date.now()}.${String(format).toLowerCase()}`,
    outputSize: outputSizeMap[quality] || '1.2 GB',
  };
}

module.exports = {
  buildSubtitleBatch,
  buildExportPayload,
};
