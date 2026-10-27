const test = require('node:test');
const assert = require('node:assert/strict');

const { buildSubtitleBatch, buildExportPayload } = require('../src/lib/ai');

test('buildSubtitleBatch creates localized caption entries from source text', () => {
  const subtitles = buildSubtitleBatch([
    'Welcome to our product launch.',
    'We localize your message for every market.',
  ]);

  assert.equal(subtitles.length, 2);
  assert.equal(subtitles[0].source.includes('Welcome'), true);
  assert.equal(subtitles[0].target.includes('Chào mừng'), true);
  assert.equal(subtitles[1].target.includes('Chúng tôi'), true);
});

test('buildExportPayload creates export metadata for the project', () => {
  const payload = buildExportPayload({ projectName: 'Campaign Launch', format: 'mp4', quality: '4K' });

  assert.equal(payload.projectName, 'Campaign Launch');
  assert.equal(payload.format, 'mp4');
  assert.equal(payload.status, 'queued');
  assert.equal(payload.quality, '4K');
  assert.match(payload.filename, /Campaign-Launch.*\.mp4/);
  assert.match(payload.outputSize, /GB|MB|KB/);
});
