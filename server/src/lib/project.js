function buildProjectRecord({ userId, name, language }) {
  const safeName = typeof name === 'string' ? name.trim() : '';

  if (!safeName) {
    throw new Error('Tên dự án là bắt buộc');
  }

  return {
    id: `project-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    userId,
    name: safeName,
    language: language || 'Vietnamese',
    status: 'queued',
    progress: 0,
  };
}

module.exports = {
  buildProjectRecord,
};
