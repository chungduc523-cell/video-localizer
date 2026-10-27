const test = require('node:test');
const assert = require('node:assert/strict');
const { buildProjectRecord } = require('../src/lib/project');

test('buildProjectRecord creates valid project payload', () => {
  const project = buildProjectRecord({
    userId: 'user-42',
    name: '  Product Launch  ',
    language: 'English',
  });

  assert.equal(project.userId, 'user-42');
  assert.equal(project.name, 'Product Launch');
  assert.equal(project.language, 'English');
  assert.equal(project.status, 'queued');
  assert.equal(project.progress, 0);
});

test('buildProjectRecord rejects missing name', () => {
  assert.throws(
    () => buildProjectRecord({ userId: 'user-1', name: '   ', language: 'Vietnamese' }),
    /Tên dự án/, 
  );
});
