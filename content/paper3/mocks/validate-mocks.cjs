const fs = require('fs');
const path = require('path');

const here = __dirname;
const academicPatternPath = path.join(here, '..', 'academic', 'exam-patterns.json');
const paperFiles = ['mock-paper-3-a.json', 'mock-paper-3-b.json'];
const expectedSections = ['13','14','15','16','17','18','19','20'];
const errors = [];
const fail = (message) => errors.push(message);
const isBi = (value) => value && typeof value.en === 'string' && value.en.trim() && typeof value.vi === 'string' && value.vi.trim();
const sameSet = (a, b) => a.length === b.length && [...a].sort().every((x, i) => x === [...b].sort()[i]);

const patternDoc = JSON.parse(fs.readFileSync(academicPatternPath, 'utf8'));
const validPatterns = new Set(patternDoc.patterns.map((pattern) => pattern.id));
const report = [];

for (const file of paperFiles) {
  const doc = JSON.parse(fs.readFileSync(path.join(here, file), 'utf8'));
  if (doc.durationMinutes !== 90) fail(`${file}: durationMinutes must be 90`);
  if (doc.totalMarks !== 75) fail(`${file}: totalMarks must be 75`);
  if (doc.aoTargets?.AO1 !== 45 || doc.aoTargets?.AO2 !== 30) fail(`${file}: aoTargets must be AO1 45 / AO2 30`);
  if (!sameSet(doc.sectionIds || [], expectedSections)) fail(`${file}: declared sections must be exactly 13–20`);
  if (doc.authorship?.origin !== 'algocore-authored' || doc.authorship?.officialCambridgePaper !== false) fail(`${file}: authorship must explicitly be non-official AlgoCore material`);
  if (!isBi(doc.title) || !isBi(doc.instructions) || !isBi(doc.authorship?.notice)) fail(`${file}: paper-level bilingual fields are incomplete`);
  if (!Array.isArray(doc.questions) || !doc.questions.length) fail(`${file}: questions must be a non-empty array`);

  const ids = new Set();
  const sections = new Set();
  const aoTotals = { AO1: 0, AO2: 0 };
  let marksTotal = 0;

  for (const question of doc.questions || []) {
    const label = `${file}:${question.id || '<missing-id>'}`;
    if (!question.id || ids.has(question.id)) fail(`${label}: missing or duplicate id`);
    ids.add(question.id);
    if (!Array.isArray(question.sectionIds) || !question.sectionIds.length) fail(`${label}: sectionIds missing`);
    for (const sectionId of question.sectionIds || []) {
      sections.add(sectionId);
      if (!expectedSections.includes(sectionId)) fail(`${label}: invalid sectionId ${sectionId}`);
    }
    if (!Array.isArray(question.commandWords) || !question.commandWords.length) fail(`${label}: commandWords missing`);
    if (!['AO1','AO2'].includes(question.ao)) fail(`${label}: ao must be AO1 or AO2`);
    if (!Number.isInteger(question.marks) || question.marks < 1) fail(`${label}: marks must be a positive integer`);
    if (!isBi(question.prompt)) fail(`${label}: prompt must contain non-empty EN and VI`);
    if (question.scenario && !isBi(question.scenario)) fail(`${label}: scenario must contain non-empty EN and VI`);
    if (!isBi(question.workedSolution)) fail(`${label}: workedSolution must contain non-empty EN and VI`);
    if (!Array.isArray(question.markingPoints) || question.markingPoints.length !== question.marks) fail(`${label}: markingPoints length must equal marks`);
    const pointMarks = (question.markingPoints || []).reduce((sum, point) => {
      if (!point.id || point.mark !== 1 || !isBi(point)) fail(`${label}: each marking point needs id, mark=1, EN and VI`);
      return sum + (point.mark || 0);
    }, 0);
    if (pointMarks !== question.marks) fail(`${label}: marking-point marks must sum to question marks`);
    if (!Array.isArray(question.sourcePatternIds) || !question.sourcePatternIds.length) fail(`${label}: sourcePatternIds missing`);
    for (const patternId of question.sourcePatternIds || []) {
      if (!validPatterns.has(patternId)) fail(`${label}: unknown sourcePatternId ${patternId}`);
    }
    marksTotal += question.marks || 0;
    if (aoTotals[question.ao] !== undefined) aoTotals[question.ao] += question.marks || 0;
  }

  if (marksTotal !== doc.totalMarks) fail(`${file}: question marks total ${marksTotal}, expected ${doc.totalMarks}`);
  if (aoTotals.AO1 !== doc.aoTargets.AO1 || aoTotals.AO2 !== doc.aoTargets.AO2) fail(`${file}: calculated AO totals ${JSON.stringify(aoTotals)} do not match targets`);
  if (!sameSet([...sections], expectedSections)) fail(`${file}: questions must cover all and only Sections 13–20`);
  report.push({ file, questions: doc.questions.length, marksTotal, aoTotals, sections: [...sections].sort(), sourcePatternReferences: doc.questions.reduce((n, item) => n + item.sourcePatternIds.length, 0) });
}

const index = JSON.parse(fs.readFileSync(path.join(here, 'index.json'), 'utf8'));
if (!Array.isArray(index.papers) || index.papers.length !== 2) fail('index.json: exactly two paper summaries required');
for (const summary of index.papers || []) {
  if (!paperFiles.includes(summary.file)) fail(`index.json: unexpected paper file ${summary.file}`);
  if (summary.durationMinutes !== 90 || summary.totalMarks !== 75 || summary.aoTargets?.AO1 !== 45 || summary.aoTargets?.AO2 !== 30) fail(`index.json:${summary.id}: totals mismatch`);
}

if (errors.length) {
  console.error(JSON.stringify({ status: 'FAIL', errors, report }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: 'PASS', validPatternCount: validPatterns.size, report }, null, 2));
