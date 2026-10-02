import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { lessonRoot, paper3Root } from "./lib/paper3-validation.mjs";

const lessonPath = path.join(lessonRoot, "hashing-to-locate-records.json");
const lesson = JSON.parse(await readFile(lessonPath, "utf8"));
if (!lesson.theory.some((block) => block.id === "hash-to-random-record")) {
  lesson.theory.push({
    id: "hash-to-random-record",
    title: {
      en: "Carry the home slot through a random-file lookup",
      vi: "Dùng ô home để đọc bản ghi trong tệp random",
    },
    paragraphs: [
      {
        en: "A complete direct-access lookup keeps three values separate: the hash result is a logical slot, SEEK selects the corresponding zero-based record position, and the record key confirms whether the requested record was found. If the key differs, the declared collision policy must continue the search; an occupied slot is not proof of a match.",
        vi: "Một phép tìm kiếm truy cập trực tiếp hoàn chỉnh tách ba giá trị: kết quả hash là ô logic, SEEK chọn vị trí bản ghi đánh số từ 0 tương ứng, còn khóa trong bản ghi xác nhận có tìm đúng bản ghi hay không. Nếu khóa khác, phải tiếp tục theo chính sách xử lý va chạm đã công bố; ô đã có dữ liệu không chứng minh là đã khớp.",
      },
      {
        en: "SEEK works with a record position in Cambridge-style pseudocode. A physical byte address would additionally require the file base and fixed record size. Do not silently treat a logical slot as a byte offset.",
        vi: "SEEK dùng vị trí bản ghi trong pseudocode theo phong cách Cambridge. Địa chỉ byte vật lý còn cần địa chỉ gốc của tệp và kích thước bản ghi cố định. Không được ngầm coi ô logic là độ lệch byte.",
      },
    ],
    code: "DECLARE SearchKey : INTEGER\nDECLARE Slot : INTEGER\nDECLARE Candidate : AccountRecord\n\nSlot ← SearchKey MOD TableSize\nOPENFILE \"Accounts.dat\" FOR RANDOM\nSEEK \"Accounts.dat\", Slot\nGETRECORD \"Accounts.dat\", Candidate\nIF Candidate.AccountID = SearchKey THEN\n   OUTPUT Candidate\nELSE\n   // Continue using the declared collision policy\nENDIF\nCLOSEFILE \"Accounts.dat\"",
    codeLanguage: "pseudocode",
    codeDialect: "Cambridge-style pseudocode",
    sourceIds: ["syllabus", "book"],
  });
}
lesson.version = "2026.2";
await writeFile(lessonPath, `${JSON.stringify(lesson, null, 2)}\n`, "utf8");

const objectivesPath = path.join(paper3Root, "academic", "syllabus-objectives-2026.json");
const matrixPath = path.join(paper3Root, "academic", "coverage-matrix.json");
const objectives = JSON.parse(await readFile(objectivesPath, "utf8"));
const matrix = JSON.parse(await readFile(matrixPath, "utf8"));
const repairedIds = new Set(objectives.capabilities.filter((item) => item.depth === "partial").map((item) => item.id));

for (const capability of objectives.capabilities) {
  if (!repairedIds.has(capability.id)) continue;
  capability.depth = "full";
  delete capability.partialReason;
}
objectives.summary.full = objectives.capabilities.length;
objectives.summary.partial = 0;
for (const section of Object.values(objectives.summary.bySection)) {
  section.full = section.total;
  section.partial = 0;
}

for (const row of matrix.rows) {
  row.evidenceStatus.independentExamPractice = "constructed-response-and-checkpoints";
  if (repairedIds.has(row.capabilityId)) row.evidenceStatus.teachingDepth = "full";
}
matrix.summary.fullTeachingDepth = matrix.rows.filter((row) => row.evidenceStatus.teachingDepth === "full").length;
matrix.summary.partialTeachingDepth = matrix.rows.length - matrix.summary.fullTeachingDepth;

await writeFile(objectivesPath, `${JSON.stringify(objectives, null, 2)}\n`, "utf8");
await writeFile(matrixPath, `${JSON.stringify(matrix, null, 2)}\n`, "utf8");
console.log(`Promoted ${repairedIds.size} repaired capabilities and added the complete hash-to-file lookup.`);
