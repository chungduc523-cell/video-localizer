const test = require('node:test');
const assert = require('node:assert/strict');

const { createToken, verifyToken } = require('../src/lib/auth');

test('createToken and verifyToken should round-trip user payload', () => {
  const payload = { id: 'user-1', email: 'demo@example.com', role: 'user' };
  const token = createToken(payload);
  const decoded = verifyToken(token);

  assert.equal(decoded.id, payload.id);
  assert.equal(decoded.email, payload.email);
  assert.equal(decoded.role, payload.role);
});
