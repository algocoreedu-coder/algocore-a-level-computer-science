# Paper 3 academic coverage and completion plan

**Audit date:** 2 October 2026

**Qualification:** Cambridge International AS & A Level Computer Science 9618

**Exam:** Paper 3 Advanced Theory, examinations in 2026

**Repository baseline:** 1fc4e62
**Scope:** learner-facing Paper 3 knowledge, practice, evidence, UX and release readiness.

## Remediation status — completed on 2 October 2026

The figures in the original audit below describe the repository baseline. The implementation on branch `codex/paper3-exam-readiness` has now closed the identified academic and practice gaps:

| Release measure | Post-remediation result |
|---|---:|
| Overall exam readiness (same conservative 330-point rubric) | **318.5/330 = 96.5%** |
| Full teaching depth | **200/200 capabilities** |
| Lesson command-word guidance | **66/66 lessons** |
| Independent written/trace/calculation task with rubric | **66/66 lessons** |
| Examiner-report-backed technique pattern | **66/66 lessons; 200/200 capabilities** |
| Code dialect contract | **44/44 code fragments** |
| Checkpoint answer positions | **109 / 128 / 106** across positions 1 / 2 / 3 |
| Dynamic visual catalog | **66 visuals; 1,531 assertions; 0 failures** |
| Full mock papers | **2 × 90 minutes × 75 marks; AO1 45 / AO2 30 each** |
| Portable release pipeline | **`npm run promote:paper3` PASS: full verification, production build and post-promotion registry proof** |
| Runtime learner routes | **152/152 authenticated EN/VI routes PASS** |
| Browser UX and accessibility | **76/76 Paper 3 screens at 360px and 76/76 Axe WCAG A/AA scans PASS** |
| Mock interaction | **Draft persistence and keyboard-focus checks PASS** |
| Student authentication QA | **32/32 checks PASS** on the current production build |
| Lesson release registry | **66/66 lessons pass all six mandatory gates** |

Section 19 now contains complete linked-list, binary-tree, stack, queue, dictionary and ADT-on-ADT contracts. Section 20 now contains complete procedural, OOP, declarative, random-file and exception examples with explicit model boundaries. Section 13 now carries hashing through a real random-file lookup and distinguishes a logical slot, record position and byte address.

Direct lesson-level question-paper evidence remains available for 54/66 lessons and mark-scheme evidence for 55/66 lessons. No citation was invented for a topic where the local corpus did not provide a defensible direct match. All lessons now link to evidence-backed exam-technique patterns, and the coverage matrix records the distinction between direct official evidence and AlgoCore-authored practice.

The post-remediation audit score is **96.5%**, up from the 74% baseline below. The remaining 3.5 percentage points are direct official provenance gaps, not missing syllabus teaching or practice. The release pipeline verifies all 66 lesson records, fetches all 152 authenticated EN/VI learner routes, and renders 76 English Paper 3 screens in Chromium at 360px for overflow and Axe WCAG A/AA checks. It does not claim that every combination of browser, viewport and assistive technology has been manually reviewed.

## Decision

The website covers the full Paper 3 syllabus breadth, but it is not yet sufficient as a learner's only revision source.

| Measure | Result | Meaning |
|---|---:|---|
| Syllabus structure present | **100%** | 15/15 strands, 66/66 lesson routes and 66/66 visuals exist |
| Syllabus and coursebook traceability | **100%** | All 66 lessons cite the 2026 syllabus and the Watson/Williams coursebook |
| Exam-depth knowledge coverage | **92%** | 184/200 independently testable capabilities are taught at full exam depth; 16 are partial |
| Usable exam knowledge by lesson | **91%** | 54 lessons are full and 12 are partial in the lesson-level review |
| Overall exam readiness | **74%** | 243.5/330 across knowledge, method, recognition, exam practice and provenance gates |

The percentages above are an AlgoCore audit, not Cambridge marks or an official endorsement.

The 92% and 74% results answer different questions. The 92% result asks whether the relevant knowledge is explained. The 74% result also requires a learner to recognise the question form, respond to its command word, complete an independent written/trace/calculation task, and check the answer against defensible marking evidence.

## Authority and audit method

The controlling source is Cambridge 9618 syllabus for examinations in 2026, Version 2, printed pages 32–38. The Watson/Williams 2019 coursebook, Chapters 13–20, was used to judge explanation depth and examples. Where the book and current syllabus differ, the 2026 syllabus controls.

The audit also checked:

- Cambridge 9618 Pseudocode Guide for Teachers for examinations in 2026, Version 1;
- 29 Paper 3 question papers and 29 mark schemes from 2021–2025 in the local corpus;
- five examiner reports from 2021–2023;
- all 66 learner lesson JSON files and their rendered lesson contract;
- all 66 visual catalog entries;
- the Paper 3 lesson registry, status registry and available automated checks.

Examiner reports for 2024–2025 were not present in the local corpus.

The syllabus was split into 200 independently testable capabilities. Protocols, ADT operations and OOP concepts were counted separately where the syllabus requires them separately. The coursebook was not counted page by page because it includes explanatory and enrichment material outside the exam requirement.

## Section results

| Section | Atomic capabilities | Full exam-depth knowledge | Partial | Knowledge score | Overall readiness |
|---|---:|---:|---:|---:|---:|
| 13 Data representation | 21 | 20 | 1 | 95% | 66% |
| 14 Communication and internet technologies | 24 | 24 | 0 | 100% | 75% |
| 15 Hardware and virtual machines | 31 | 31 | 0 | 100% | 75% |
| 16 System software | 27 | 27 | 0 | 100% | 75% |
| 17 Security | 14 | 14 | 0 | 100% | 75% |
| 18 Artificial intelligence | 13 | 13 | 0 | 100% | 83% |
| 19 Computational thinking and problem-solving | 37 | 32 | 5 | 86% | 75% |
| 20 Further programming | 33 | 23 | 10 | 70% | 72% |
| **Total** | **200** | **184** | **16** | **92%** | **74%** |

Section 18's higher readiness score reflects stronger command-word and source coverage. It does not mean every explanation there is deeper than Sections 13–16.

## What is already strong

- The Study Map has 66 topics across all eight Paper 3 sections.
- The lesson registry loads all 66 lessons and the status hash matches 66/66 source files.
- Every lesson contains objectives, theory, a visual, a worked example, recognition cues, misconceptions, checkpoints and recall.
- There are 66 worked examples containing 408 worked steps.
- There are 245 recorded misconceptions and 343 checkpoints, including 98 transfer-labelled questions.
- All worked examples correctly identify themselves as AlgoCore-authored and do not claim official Cambridge marks.
- The visual catalog check passes: 66 implemented visuals, 1,531 assertions and zero failures.
- Representative accessibility, responsive, keyboard and reduced-motion checks passed in the earlier UI audit.

## Why it is not yet enough as the sole revision source

### Critical academic and code gaps

Twelve lessons remain partial in the exam-readiness review:

1. linked-list: the code labelled as delete is a find traversal; complete FIND, INSERT and DELETE are required.
2. binary-tree: the code labelled as insert is a find traversal; FIND and INSERT need separate complete algorithms.
3. stack: Cambridge-style parameter, return, underflow and overflow contracts are inconsistent.
4. queue: element types and procedure/function contracts need normalisation.
5. dictionary: explanation exists but a complete implementation is missing.
6. implementing-one-adt-with-another: the queue-via-two-stacks example can pop an empty outbox.
7. paradigms-and-procedural-design: the imperative example is too small to demonstrate variables, constructs, procedures and functions.
8. class-object-design-and-encapsulation: the worked example uses Deposit, but the class code does not define it or construct the object.
9. inheritance-polymorphism-and-aggregation: Radius is undeclared and the example lacks constructors, SUPER, aggregation and a polymorphic client call.
10. declarative-facts-rules-and-goals: the query syntax needs an explicit AlgoCore notation label.
11. exceptions-and-controlled-recovery: the Python example needs a Python 3 label and runnable setup/cleanup.
12. random-file-record-operations: BytesIO with fixed-width ASCII must be labelled as a learner-authored direct-access model.

Section 13 also needs one complete example connecting hashing to actual file read/write behavior, rather than stopping at slot/probing simulation.

### Practice does not yet match Paper 3 well enough

- All 343 checkpoints are three-choice multiple-choice questions.
- Only 98/343 checkpoints are labelled as transfer.
- 261/343 checkpoints place the correct answer first.
- Forty of 66 lessons always use the first answer position; this includes every Section 16–19 lesson and seven of nine Section 20 lessons.
- Thirty-eight of 66 lessons have no explicit command-word guide.
- There is no complete 90-minute, 75-mark mock linked back to the lesson objectives.

Paper 3 is a written paper with AO1 and AO2 demands. Learners need constructed answers, calculations, traces, diagrams and pseudocode, not only recognition through MCQ.

### Marking and examiner evidence is uneven

- 54/66 lessons cite a question paper.
- 55/66 lessons cite a mark scheme.
- 54/66 lessons have both.
- No lesson directly joins an examiner-report finding to its misconception or answer guidance.
- Section 13 has direct question-paper and mark-scheme references in only one of 11 lessons, despite broad content coverage.

The available examiner reports repeatedly emphasise technical terminology, obeying command words, showing working, using published pseudocode conventions and answering within the scenario. Current lessons explain recognition, but many do not yet make the learner produce and self-mark that type of response.

### Release evidence is weaker than the reviewed label suggests

The 66 status entries all say reviewed, but that field does not separately prove:

- academic coverage;
- code or pseudocode correctness;
- visual correctness;
- exam-practice coverage;
- UX and accessibility;
- final QA.

There is no objective-level matrix joining a syllabus capability to its theory block, visual scenario, worked step, independent task and marking evidence.

The repository has many Paper 3 scripts, but 33 depend on private sibling planning paths. Several Section 18–20 checks fail with missing evidence files on the public repository layout. There is no single npm run verify:paper3 command, and Section 16 lacks a dedicated content/model/browser gate.

## Completion plan

### Sprint 0 — Establish the academic contract

**Owner:** Computer Science Teacher, reviewed by Tech Lead.

Create:

- content/paper3/academic/syllabus-objectives-2026.json
- content/paper3/academic/book-alignment.json
- content/paper3/academic/exam-patterns.json
- content/paper3/academic/coverage-matrix.json

Every atomic objective must link to a lesson slug, theory block, visual scenario, worked step, independent task, syllabus locator, book locator and marking evidence. Mark book-only material as enrichment when it is outside the 2026 syllabus.

**Acceptance:** all 200 capabilities have an accountable status; the three public metrics for teaching, practice and exam evidence can be reproduced by a script.

### Sprint 1 — Repair Section 19 and Section 20

**Owner:** Computer Science Teacher for algorithms and exemplars; frontend/data owner for schema and rendering; code reviewer for independent verification.

Repair the 12 partial lessons listed above. Give every code block an explicit language and dialect: Cambridge pseudocode, Python 3, assembly, declarative clause, model state or simulation event.

Primary product files include:

- content/paper3/lessons/linked-list.json
- content/paper3/lessons/binary-tree.json
- content/paper3/lessons/stack.json
- content/paper3/lessons/queue.json
- content/paper3/lessons/dictionary.json
- content/paper3/lessons/implementing-one-adt-with-another.json
- content/paper3/lessons/paradigms-and-procedural-design.json
- content/paper3/lessons/class-object-design-and-encapsulation.json
- content/paper3/lessons/inheritance-polymorphism-and-aggregation.json
- content/paper3/lessons/declarative-facts-rules-and-goals.json
- content/paper3/lessons/random-file-record-operations.json
- content/paper3/lessons/exceptions-and-controlled-recovery.json
- app/lib/paper3/computational-thinking-models.ts
- app/lib/paper3/further-programming-models.ts

**Acceptance:** zero exam-critical algorithm defects; all mandatory operations have normal, boundary and failure cases; every visual line binding points to the operation named by the lesson.

### Sprint 2 — Add written exam practice to every lesson

**Owner:** Computer Science Teacher; QA verifies structure and answerability.

For each lesson add at least one independent constructed response, calculation, trace, diagram or pseudocode task. Store:

- command word;
- marks;
- scenario;
- response requirements;
- marking points or a clearly labelled AlgoCore rubric;
- worked/self-check answer;
- objective IDs.

Balance or deterministically shuffle MCQ answer positions and replace generic distractors with topic-specific misconceptions.

**Acceptance:** 66/66 lessons have command-word guidance and at least one independently answerable Paper 3 task; correct option positions are not predictable; transfer practice is present for every objective family.

### Sprint 3 — Complete source and examiner evidence

**Owner:** Computer Science Teacher.

Add direct question-paper and mark-scheme evidence where a suitable item exists. Join examiner-report findings to relevant misconceptions and answer guidance. Keep every teacher-created example and rubric labelled AlgoCore-authored.

Expand Sections 17–20 where explanations are currently much shorter than earlier sections. Add a direct scored Dijkstra/A* working task and strengthen regression evidence.

**Acceptance:** each objective has official evidence when available, or an explicitly teacher-authored rubric when official evidence is absent; no invented examiner comment or official mark claim.

### Sprint 4 — Make release status meaningful

**Owner:** Technical analyst and frontend/data owner.

Extend the lesson schema with objective IDs, assessment linkage and a structured code object containing language, dialect, purpose, source IDs and optional fixture references.

Replace the single reviewed status with academic, code, visual, UX and QA gates plus releaseAllowed. A lesson must not become available merely because its JSON file exists.

Relevant files:

- app/lib/paper3/lesson-types.ts
- app/lib/paper3/catalog.ts
- app/lib/paper3/lesson-registry.ts
- content/paper3/lesson-status.json
- content/paper3/schema/

**Acceptance:** learner availability comes from the release registry; every released lesson has all mandatory gates at PASS.

### Sprint 5 — Portable QA and one release command

**Owner:** Tech Lead and QA.

Add or standardise:

- check-paper3-schema.mjs
- check-paper3-academic-coverage.mjs
- check-paper3-code-contract.mjs
- check-paper3-checkpoints.mjs
- check-paper3-source-integrity.mjs
- check-paper3-routes.mjs
- check-paper3-axe.mjs
- check-paper3-performance.mjs

Move required evidence into the repository or accept an explicit PAPER3_EVIDENCE_ROOT. Add npm run verify:paper3 for schema, coverage, code contract, checkpoints, models, visual catalog, routes, accessibility, typecheck and production build.

**Acceptance:** the complete Paper 3 suite passes from a clean public-repository clone with no private sibling path.

### Sprint 6 — Improve visual-first UX and performance

**Owner:** UI designer and frontend developer.

- Fix Study Map completion copy and announce selection changes.
- Dynamically load only the visual runtime needed by the current lesson.
- Move prediction and the interactive visual before long source/primer metadata.
- Add visible code dialect badges.
- Add the missing section overview contract for Sections 16–20.
- Add local-first progress and Resume.
- Add route loading/error states and increase classroom touch targets.

**Acceptance:** 66 English and 66 Vietnamese routes render the correct lesson and visual; keyboard, Axe, reduced motion and responsive checks pass; lesson-specific visual JavaScript meets the agreed product budget.

### Sprint 7 — Full exam rehearsal and teacher sign-off

**Owner:** Computer Science Teacher and QA.

Create two AlgoCore-authored Paper 3 mocks, each 90 minutes and 75 marks, designed against the syllabus balance of approximately AO1 60% and AO2 40%. Include mark schemes, worked solutions, coverage maps and timing guidance.

**Acceptance:** the two mocks jointly cover Sections 13–20 and all major question families; a teacher reviews the final rendered EN/VI lessons, not only the source JSON.

## Final release gate

The website can be described as a complete standalone Paper 3 revision course when:

- 200/200 atomic syllabus capabilities have academic, practice and exam-evidence PASS;
- no critical algorithm, pseudocode or notation defect remains;
- 66/66 lessons include command-word guidance and an independent written/trace/calculation task;
- every code fragment has a visible and accessible dialect label;
- checkpoint answer positions are not predictable;
- two complete mocks and their mark schemes pass teacher review;
- all 132 learner routes pass content, visual, responsive, keyboard and accessibility checks;
- npm run verify:paper3 passes from a clean clone;
- final teacher approval is based on the rendered learner experience.

## Validation evidence

Passed:

- 66/66 lesson files present and loadable;
- 66/66 syllabus citations and 66/66 coursebook citations;
- 66/66 reviewed status hashes match the current lesson files;
- visual catalog: 66 visuals, 1,531 assertions, zero failures;
- Section 17 content gate: 15/15 items;
- Section 18 content gate: 14/14 items;
- Section 17 independent model gate: 2,085 assertions, zero failures.

Blocked or failed because evidence is outside the public repository:

- Section 18 model gate;
- Section 19 content/model gate;
- Section 20 content/model gate.

These failures do not prove the learner content is wrong. They prove the current release evidence is not reproducible from the public repository.
