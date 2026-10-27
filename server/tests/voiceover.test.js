const test = require('node:test');
const assert = require('node:assert/strict');

const { buildVoiceoverPlan, getAvailableVoices } = require('../src/lib/voiceover');

test('buildVoiceoverPlan produces a ready-to-dub audio plan', () => {
  const plan = buildVoiceoverPlan({
    text: 'Chúng tôi đã sẵn sàng để mở rộng ra thị trường toàn cầu.',
    voice: 'nhat-minh',
    language: 'Vietnamese',
  });

  assert.equal(plan.voiceId, 'nhat-minh');
  assert.equal(plan.language, 'Vietnamese');
  assert.equal(plan.status, 'queued');
  assert.ok(plan.durationSeconds > 0);
});

test('getAvailableVoices exposes multiple AI voice presets', () => {
  const voices = getAvailableVoices();
  assert.ok(Array.isArray(voices));
  assert.ok(voices.length >= 4);
  assert.equal(voices[0].id, 'nhat-minh');
});
