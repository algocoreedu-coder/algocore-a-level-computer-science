import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { lessonRoot, paper3Root, readJson } from "./lib/paper3-validation.mjs";

const write = process.argv.includes("--write");
const catalog = await readJson(path.join(paper3Root, "study-map.json"));
const topics = new Map(catalog.topics.map((topic) => [topic.id, topic]));
const files = (await readdir(lessonRoot)).filter((name) => name.endsWith(".json")).sort();

function selectCommand(topic, index) {
  if (/versus|comparison|compare|switching/i.test(`${topic.title.en} ${topic.slug}`)) return "compare";
  if (topic.learningMode === "calculation") return "calculate";
  if (topic.learningMode === "algorithm") return index % 2 ? "write" : "trace";
  if (topic.learningMode === "programming") return index % 2 ? "trace" : "write";
  if (topic.learningMode === "logic") return "explain";
  if (topic.learningMode === "process") return "describe";
  return "explain";
}

function selectTaskType(command, topic) {
  if (command === "calculate") return "calculation";
  if (command === "trace") return "trace";
  if (command === "draw") return "diagram";
  if (command === "write" || topic.learningMode === "programming" || topic.learningMode === "algorithm") return "pseudocode";
  return "constructed-response";
}

function guidance(command, title) {
  const en = {
    calculate: `Show each intermediate value for ${title.en}, keep the stated bit width or units, and state the final result.`,
    compare: `Make paired points about ${title.en}; name both sides in each point and state a meaningful difference or similarity.`,
    complete: `Use the supplied state and conventions for ${title.en}; fill every required entry and keep values consistent.`,
    define: `Give the precise meaning of the term in the context of ${title.en}; do not replace the definition with an example.`,
    describe: `State the ordered events or observable features of ${title.en}; include enough detail to show what changes.`,
    draw: `Use the required Cambridge conventions for ${title.en}; label every component and show the direction of data or control.`,
    explain: `Link cause to effect for ${title.en}; each point should say what happens and why it matters.`,
    give: `Provide the requested fact about ${title.en} directly and avoid unrelated explanation.`,
    identify: `Select the exact feature of ${title.en} supported by the evidence in the question.`,
    justify: `State a choice about ${title.en}, then support it with evidence from the stated scenario.`,
    show: `Present the working or trace for ${title.en} so the result can be followed and checked.`,
    state: `Give a concise, technically precise fact about ${title.en}.`,
    trace: `Follow ${title.en} one operation at a time; record every changed variable, pointer or structure after each step.`,
    write: `Use Cambridge-style pseudocode for ${title.en}; initialise state, handle boundary cases and make the returned result explicit.`,
  }[command];
  const vi = {
    calculate: `Trình bày từng giá trị trung gian của ${title.vi}, giữ đúng độ rộng bit hoặc đơn vị đã cho và nêu kết quả cuối.`,
    compare: `Viết các ý đối chiếu theo cặp về ${title.vi}; gọi tên cả hai phía trong mỗi ý và nêu khác biệt hoặc điểm giống có ý nghĩa.`,
    complete: `Dùng trạng thái và quy ước đã cho cho ${title.vi}; điền đủ mọi ô và giữ các giá trị nhất quán.`,
    define: `Nêu nghĩa chính xác của thuật ngữ trong ngữ cảnh ${title.vi}; không thay định nghĩa bằng ví dụ.`,
    describe: `Nêu các sự kiện theo thứ tự hoặc đặc điểm quan sát được của ${title.vi}; đủ chi tiết để thấy điều gì thay đổi.`,
    draw: `Dùng đúng quy ước Cambridge cho ${title.vi}; ghi nhãn mọi thành phần và thể hiện chiều dữ liệu hoặc điều khiển.`,
    explain: `Liên kết nguyên nhân với kết quả của ${title.vi}; mỗi ý cần nêu điều gì xảy ra và vì sao điều đó quan trọng.`,
    give: `Nêu trực tiếp dữ kiện được hỏi về ${title.vi}, không thêm phần giải thích không liên quan.`,
    identify: `Chọn đúng đặc điểm của ${title.vi} được bằng chứng trong câu hỏi hỗ trợ.`,
    justify: `Nêu lựa chọn về ${title.vi}, rồi bảo vệ lựa chọn bằng bằng chứng trong tình huống đề cho.`,
    show: `Trình bày phép tính hoặc trace của ${title.vi} để người chấm theo dõi và kiểm tra được kết quả.`,
    state: `Nêu ngắn gọn một dữ kiện chính xác về mặt kỹ thuật của ${title.vi}.`,
    trace: `Theo dõi ${title.vi} từng thao tác; ghi mọi biến, con trỏ hoặc cấu trúc thay đổi sau từng bước.`,
    write: `Dùng pseudocode theo phong cách Cambridge cho ${title.vi}; khởi tạo trạng thái, xử lý biên và nêu rõ kết quả trả về.`,
  }[command];
  return { en, vi };
}

function languageFor(slug, code) {
  if (/assembly|addressing-mode/.test(slug) || /\b(LDM|LDD|LDI|LDX|STO|JMP|CMP|ADD|SUB|AND|OR|XOR)\b/.test(code)) return ["assembly", "Cambridge 9618 assembly language"];
  if (/declarative/.test(slug)) return ["declarative", "AlgoCore declarative rule model"];
  if (/\b(def |print\(|except\b|elif\b|None\b|self\.)/.test(code)) return ["python", "Python 3"];
  if (/^\s*[\[{][\s\S]*[\]}]\s*$/.test(code)) return ["model", "AlgoCore model state"];
  return ["pseudocode", "Cambridge-style pseudocode"];
}

const changes = [];
for (const [lessonIndex, name] of files.entries()) {
  const filePath = path.join(lessonRoot, name);
  const lesson = JSON.parse(await readFile(filePath, "utf8"));
  const topic = topics.get(lesson.topicId);
  if (!topic) throw new Error(`${name}: topic ${lesson.topicId} is not in study-map.json`);
  const needsCheckpointBalancing = !lesson.examPractice;
  const command = lesson.recognition.commandWords?.[0]?.command ?? selectCommand(topic, lessonIndex);
  if (!lesson.recognition.commandWords?.length) {
    lesson.recognition.commandWords = [{ command, guidance: guidance(command, lesson.title) }];
  }

  if (!lesson.examPractice) {
    const markingPoints = lesson.recall.answerPoints.slice(0, 6);
    const sourceIds = lesson.sources.filter((source) => source.kind === "syllabus" || source.kind === "book").slice(0, 3).map((source) => source.id);
    lesson.examPractice = {
      id: `${lesson.slug}-exam-practice`,
      origin: "algocore-authored",
      commandWord: command,
      taskType: selectTaskType(command, topic),
      marks: Math.max(2, Math.min(6, markingPoints.length)),
      prompt: lesson.recall.prompt,
      answerGuidance: [guidance(command, lesson.title), ...lesson.recognition.method.slice(0, 2)],
      markingPoints,
      sourceIds,
    };
  }

  for (const block of lesson.theory) {
    if (typeof block.code === "string" && block.code.trim() && (!block.codeLanguage || !block.codeDialect)) {
      const [codeLanguage, codeDialect] = languageFor(lesson.slug, block.code);
      block.codeLanguage ??= codeLanguage;
      block.codeDialect ??= codeDialect;
    }
  }
  for (const step of lesson.workedExample.steps) {
    if (typeof step.code === "string" && step.code.trim() && (!step.codeLanguage || !step.codeDialect)) {
      const [codeLanguage, codeDialect] = languageFor(lesson.slug, step.code);
      step.codeLanguage ??= codeLanguage;
      step.codeDialect ??= codeDialect;
    }
  }

  if (needsCheckpointBalancing) {
    for (const [checkpointIndex, checkpoint] of lesson.checkpoints.entries()) {
      const shift = (lessonIndex + checkpointIndex) % checkpoint.choices.length;
      if (shift) checkpoint.choices = [...checkpoint.choices.slice(shift), ...checkpoint.choices.slice(0, shift)];
    }
  }
  lesson.version = "2026.2";

  const formatted = `${JSON.stringify(lesson, null, 2)}\n`;
  changes.push(name);
  if (write) await writeFile(filePath, formatted, "utf8");
}

console.log(`${write ? "Updated" : "Would update"} ${changes.length} Paper 3 lessons.`);
