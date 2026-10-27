const VOICES = [
  { id: 'nhat-minh', name: 'Nhất Minh', gender: 'male', language: 'Vietnamese', tone: 'warm', quality: 'studio' },
  { id: 'huyen-trang', name: 'Huyền Trang', gender: 'female', language: 'Vietnamese', tone: 'soft', quality: 'studio' },
  { id: 'minh-anh', name: 'Minh Anh', gender: 'female', language: 'Vietnamese', tone: 'clear', quality: 'broadcast' },
  { id: 'duc-huy', name: 'Đức Huy', gender: 'male', language: 'Vietnamese', tone: 'confident', quality: 'broadcast' },
  { id: 'my-linh', name: 'Mỹ Linh', gender: 'female', language: 'English', tone: 'neutral', quality: 'global' },
  { id: 'alex', name: 'Alex', gender: 'male', language: 'English', tone: 'professional', quality: 'global' },
];

function getAvailableVoices() {
  return VOICES.map((voice) => ({ ...voice }));
}

function normalizeVoiceId(voiceId) {
  const value = typeof voiceId === 'string' ? voiceId.trim() : '';
  return value || 'nhat-minh';
}

function buildVoiceoverPlan({ text, voice, language = 'Vietnamese' }) {
  const safeText = typeof text === 'string' ? text.trim() : '';
  const chosenVoice = getAvailableVoices().find((item) => item.id === normalizeVoiceId(voice)) || getAvailableVoices()[0];
  const words = safeText ? safeText.split(/\s+/).filter(Boolean).length : 0;
  const durationSeconds = Math.max(3, Math.ceil(words / 2.2));

  return {
    voiceId: chosenVoice.id,
    voiceName: chosenVoice.name,
    language,
    text: safeText || 'Chúng tôi đã sẵn sàng để lồng tiếng cho video của bạn.',
    status: 'queued',
    durationSeconds,
    quality: chosenVoice.quality,
    tone: chosenVoice.tone,
    createdAt: new Date().toISOString(),
    engine: process.env.OPENAI_API_KEY ? 'openai-tts' : 'demo-tts',
  };
}

module.exports = {
  VOICES,
  getAvailableVoices,
  buildVoiceoverPlan,
};
