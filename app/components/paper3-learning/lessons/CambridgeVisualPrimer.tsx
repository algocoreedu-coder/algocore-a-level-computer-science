import { ArrowRight, BookOpen, Eye, MousePointerClick } from "lucide-react";
import type { Locale, Localized } from "@/app/lib/paper3/catalog";
import type { VisualKind } from "@/app/lib/paper3/lesson-types";
import styles from "./CambridgeVisualPrimer.module.css";

type Lane = {
  readonly title: Localized;
  readonly nodes: readonly Localized[];
};

type Guide = {
  readonly section: "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20";
  readonly reference: Localized;
  readonly modelBoundary?: Localized;
  readonly lanes: readonly Lane[];
  readonly focus: readonly [Localized, Localized, Localized];
  readonly correction?: Localized;
};

const L = (en: string, vi: string): Localized => ({ en, vi });
const lane = (titleEn: string, titleVi: string, nodes: readonly [string, string][]): Lane => ({
  title: L(titleEn, titleVi),
  nodes: nodes.map(([en, vi]) => L(en, vi)),
});

const guides: Partial<Record<VisualKind, Guide>> = {
  enumeration: {
    section: "13",
    reference: L("Syllabus 13.1, p.32; coursebook Chapter 13, printed pp.304-305; examples independently checked", "Syllabus 13.1, trang 32; sách Chương 13, trang in 304-305; ví dụ được kiểm tra độc lập"),
    modelBoundary: L("A finite domain of named status constants. Definition, variable declaration and assignment are separate; an invalid assignment keeps the previous valid value. Displayed code follows Cambridge pseudocode conventions, not a Python interpreter.", "Miền hữu hạn gồm các hằng trạng thái có tên. Định nghĩa type, khai báo biến và phép gán là ba bước riêng; phép gán không hợp lệ giữ nguyên giá trị hợp lệ trước đó. Code hiển thị theo quy ước Cambridge pseudocode, không phải Python interpreter."),
    lanes: [
      lane("Build and use the type", "Tạo và dùng type", [["Define the named domain", "Định nghĩa miền tên"], ["Declare one typed variable", "Khai báo một biến có type"], ["Choose a declared member", "Chọn member đã khai báo"], ["Assign that one member", "Gán đúng một member"]]),
      lane("Guard the boundary", "Bảo vệ ranh giới", [["Test candidate against the domain", "Đối chiếu giá trị với miền"], ["Accept a declared constant", "Chấp nhận hằng đã khai báo"], ["Reject any other value", "Từ chối giá trị ngoài miền"], ["Preserve the last valid state", "Giữ state hợp lệ gần nhất"]]),
    ],
    focus: [L("Separate type definition, variable declaration and assignment in the current frame.", "Tách type definition, variable declaration và assignment trong frame hiện tại."), L("Predict whether the candidate is one of the declared members before revealing the assignment.", "Dự đoán candidate có thuộc các member đã khai báo trước khi mở kết quả gán."), L("Check that the variable stores one enum member, not the whole list or a string with the same spelling.", "Kiểm tra biến lưu một enum member, không phải cả danh sách hoặc string trùng cách viết.")],
    correction: L("An enum is a non-composite user-defined type in this syllabus model. The constant Active and the string \"Active\" have different types.", "Enum là user-defined type không composite trong mô hình syllabus này. Hằng Active và string \"Active\" có type khác nhau."),
  },
  pointers: {
    section: "13",
    reference: L("Syllabus 13.1, p.32; coursebook Chapter 13, printed pp.305-306; examples independently checked", "Syllabus 13.1, trang 32; sách Chương 13, trang in 305-306; ví dụ được kiểm tra độc lập"),
    modelBoundary: L("P references INTEGER data; addresses 100 and 104 are illustrative. Pointer address and target value are separate state. Dereferencing no valid target is rejected rather than read as zero.", "P tham chiếu dữ liệu INTEGER; địa chỉ 100 và 104 chỉ để minh họa. Địa chỉ trong pointer và giá trị tại target là hai state riêng. Dereference khi không có target hợp lệ bị từ chối, không được đọc thành 0."),
    lanes: [
      lane("Follow a reference", "Lần theo tham chiếu", [["Read pointer P", "Đọc pointer P"], ["Locate its target address", "Tìm địa chỉ target"], ["Follow the reference", "Đi theo tham chiếu"], ["Read or update target data", "Đọc hoặc cập nhật dữ liệu target"]]),
      lane("Check before dereferencing", "Kiểm tra trước khi dereference", [["Does P name a valid target?", "P có target hợp lệ không?"], ["Yes: access the typed cell", "Có: truy cập ô đúng type"], ["No: reject the access", "Không: từ chối truy cập"], ["Keep memory unchanged", "Giữ memory không đổi"]]),
    ],
    focus: [L("Track the pointer address and the target value in separate boxes.", "Theo dõi địa chỉ pointer và giá trị target trong hai ô riêng."), L("Predict which memory cell is reached before revealing the dereference.", "Dự đoán ô nhớ được truy cập trước khi mở bước dereference."), L("After a target update, verify that P still stores the address while only the referenced data changes.", "Sau khi cập nhật target, xác minh P vẫn giữ địa chỉ còn chỉ dữ liệu được tham chiếu thay đổi.")],
    correction: L("P does not become 45 when its target contains 45. P keeps an address; dereferencing P obtains the value. No target is also different from a valid target containing zero.", "P không trở thành 45 khi target chứa 45. P vẫn giữ địa chỉ; dereference P mới lấy giá trị. Không có target cũng khác một target hợp lệ đang chứa 0."),
  },
  sets: {
    section: "13",
    reference: L("Syllabus 13.1, p.32; coursebook Chapter 13, printed pp.305 and 307; examples independently checked", "Syllabus 13.1, trang 32; sách Chương 13, trang in 305 và 307; ví dụ được kiểm tra độc lập"),
    modelBoundary: L("The selectable universe is A, B, C, D and each element is a character. Alphabetical order is only a display convention. Empty sets and FALSE membership results are valid outcomes.", "Universe có thể chọn là A, B, C, D và mỗi phần tử là một character. Thứ tự alphabet chỉ là quy ước hiển thị. Empty set và kết quả membership FALSE đều hợp lệ."),
    lanes: [
      lane("Construct set results", "Tạo kết quả tập hợp", [["Read members of S and T", "Đọc member của S và T"], ["Test each distinct element", "Xét từng phần tử khác nhau"], ["Apply union or intersection rule", "Áp dụng quy tắc union hoặc intersection"], ["Build the result without duplicates", "Tạo kết quả không duplicate"]]),
      lane("Test membership", "Kiểm tra membership", [["Choose one element", "Chọn một phần tử"], ["Inspect membership, not position", "Xét membership, không xét vị trí"], ["Return TRUE or FALSE", "Trả TRUE hoặc FALSE"]]),
    ],
    focus: [L("Read which operation is active: union, intersection or membership.", "Đọc đúng operation đang chạy: union, intersection hay membership."), L("Predict inclusion for one element before revealing the complete result.", "Dự đoán một phần tử có được lấy hay không trước khi mở toàn bộ kết quả."), L("Check membership only: display order and repeated input occurrences do not change the set.", "Chỉ kiểm tra membership: thứ tự hiển thị và phần tử lặp trong input không làm đổi set.")],
    correction: L("A shared member appears once in a union. An empty intersection is the set ∅; FALSE is the Boolean result of a membership test.", "Member chung chỉ xuất hiện một lần trong union. Intersection rỗng là set ∅; FALSE là kết quả Boolean của membership test."),
  },
  records: {
    section: "13",
    reference: L("Syllabus 13.1, p.32; coursebook Chapter 13, printed p.307; examples independently checked", "Syllabus 13.1, trang 32; sách Chương 13, trang in 307; ví dụ được kiểm tra độc lập"),
    modelBoundary: L("Students uses indices 1 and 2. StudentID and Score are INTEGER; Name is STRING. A valid update changes only the selected field in the selected record.", "Students dùng index 1 và 2. StudentID và Score là INTEGER; Name là STRING. Một cập nhật hợp lệ chỉ thay đổi field được chọn trong record được chọn."),
    lanes: [
      lane("From schema to one field", "Từ schema tới một field", [["Define the record fields and types", "Định nghĩa field và type của record"], ["Create separate record instances", "Tạo các record instance riêng"], ["Select one array index", "Chọn một array index"], ["Select one named field", "Chọn một field theo tên"]]),
      lane("Apply a typed update", "Cập nhật đúng type", [["Check the field type", "Kiểm tra type của field"], ["Validate the new value", "Validate giá trị mới"], ["Update the selected field", "Cập nhật field đã chọn"], ["Verify all neighbours are unchanged", "Xác minh các phần còn lại không đổi"]]),
    ],
    focus: [L("Identify the record instance and field before looking at the new value.", "Xác định record instance và field trước khi xét giá trị mới."), L("Predict whether the value matches that field's declared type.", "Dự đoán giá trị có khớp type đã khai báo của field đó không."), L("Compare before and after views to prove that no other field or record changed.", "So sánh trước và sau để chứng minh không field hay record nào khác bị đổi.")],
    correction: L("A record may combine fields of different types. Updating a field of one instance does not change the type definition or every other instance.", "Record có thể kết hợp field thuộc nhiều type. Cập nhật field của một instance không làm đổi type definition hoặc mọi instance khác."),
  },
  "file-organisation": {
    section: "13",
    reference: L("Syllabus 13.2, p.32; coursebook Chapter 13, printed pp.308-310; examples independently checked", "Syllabus 13.2, trang 32; sách Chương 13, trang in 308-310; ví dụ được kiểm tra độc lập"),
    modelBoundary: L("Unique keys arrive as 25, 12, 31, 18. Sequential organisation keeps ascending key order. The random layout uses key MOD 7 with linear probing; slots 0..6 are logical locations, not byte addresses.", "Các key duy nhất đến theo thứ tự 25, 12, 31, 18. Sequential organisation giữ thứ tự key tăng dần. Random layout dùng key MOD 7 với linear probing; slot 0..6 là vị trí logic, không phải byte address."),
    lanes: [
      lane("Choose the organisation", "Chọn cách tổ chức", [["Arrival order: serial", "Thứ tự đến: serial"], ["Ascending key order: sequential", "Key tăng dần: sequential"], ["Calculated slot: random", "Slot được tính: random"]]),
      lane("Choose an access path", "Chọn đường truy cập", [["Serial: scan every needed record", "Serial: quét các record cần thiết"], ["Sequential: scan or use an index", "Sequential: quét hoặc dùng index"], ["Random: calculate then resolve collision", "Random: tính vị trí rồi xử lý collision"], ["Compare the full key", "So sánh full key"]]),
    ],
    focus: [L("Name how records are physically organised before naming the access method.", "Gọi tên cách record được tổ chức trước khi gọi tên access method."), L("Trace the supplied key through the matching scan, index or calculation.", "Trace key đã cho qua phép quét, index hoặc phép tính tương ứng."), L("Justify the choice from ordering and lookup evidence instead of the word 'random'.", "Giải thích lựa chọn từ bằng chứng về thứ tự và lookup thay vì chỉ dựa vào từ 'random'.")],
    correction: L("Random organisation uses a repeatable location rule; it is not a shuffle. Sequential organisation can still support direct access when an index supplies the location.", "Random organisation dùng quy tắc vị trí lặp lại được, không phải shuffle. Sequential organisation vẫn có thể hỗ trợ direct access khi index cung cấp vị trí."),
  },
  hashing: {
    section: "13",
    reference: L("Syllabus 13.2, p.32; coursebook Chapter 13, printed pp.310-311; examples independently checked", "Syllabus 13.2, trang 32; sách Chương 13, trang in 310-311; ví dụ được kiểm tra độc lập"),
    modelBoundary: L("h(k) = k MOD 7 over nonnegative integer keys and logical slots 0..6. This visual does not convert slots into byte offsets. A matching hash is not proof of a matching record key.", "h(k) = k MOD 7 với key integer không âm và slot logic 0..6. Visual này không đổi slot thành byte offset. Hash trùng chưa chứng minh record key trùng."),
    lanes: [
      lane("Calculate the home slot", "Tính home slot", [["Read full key k", "Đọc full key k"], ["Divide k by 7", "Chia k cho 7"], ["Take the remainder", "Lấy remainder"], ["Use it as home slot h(k)", "Dùng làm home slot h(k)"]]),
      lane("Verify a lookup", "Xác minh lookup", [["Inspect the home slot", "Xem home slot"], ["Read the stored full key", "Đọc full key đã lưu"], ["Compare keys", "So sánh key"], ["Match or invoke collision policy", "Match hoặc gọi collision policy"]]),
    ],
    focus: [L("Write the quotient and remainder so MOD cannot be confused with division.", "Ghi quotient và remainder để không nhầm MOD với phép chia."), L("Predict the home slot before revealing the table lookup.", "Dự đoán home slot trước khi mở table lookup."), L("Confirm identity with the full stored key, not with the slot number alone.", "Xác nhận identity bằng full key đã lưu, không chỉ bằng slot number.")],
    correction: L("MOD returns the remainder. Different keys can have the same remainder, so equal hashes do not mean equal keys.", "MOD trả về remainder. Các key khác nhau có thể có cùng remainder, vì vậy hash bằng nhau không có nghĩa key bằng nhau."),
  },
  collisions: {
    section: "13",
    reference: L("Syllabus 13.2, p.32; coursebook Chapter 13, printed p.311; examples independently checked", "Syllabus 13.2, trang 32; sách Chương 13, trang in 311; ví dụ được kiểm tra độc lập"),
    modelBoundary: L("Seven slots 0..6; h(k) = k MOD 7; next = (i + 1) MOD 7. There is no deletion. Duplicate insertion is rejected. A probe stops at a match, a never-used empty slot or after seven inspected slots.", "Có bảy slot 0..6; h(k) = k MOD 7; next = (i + 1) MOD 7. Không có deletion. Duplicate insertion bị từ chối. Probe dừng khi match, gặp slot trống chưa từng dùng hoặc sau khi xét đủ bảy slot."),
    lanes: [
      lane("Insert with linear probing", "Insert bằng linear probing", [["Calculate the home slot", "Tính home slot"], ["Inspect occupant's full key", "Xem full key đang chiếm chỗ"], ["Reject duplicate or probe next", "Từ chối duplicate hoặc probe tiếp"], ["Wrap with MOD 7 if needed", "Wrap bằng MOD 7 nếu cần"], ["Insert at first valid empty slot", "Insert vào slot trống hợp lệ đầu tiên"]]),
      lane("Retrieve safely", "Retrieve an toàn", [["Start again at the home slot", "Bắt đầu lại tại home slot"], ["Compare the full key", "So sánh full key"], ["Continue the same probe sequence", "Tiếp tục đúng probe sequence"], ["Stop on match, never-used empty or full cycle", "Dừng khi match, empty chưa dùng hoặc đủ một vòng"]]),
    ],
    focus: [L("Keep the key's home slot separate from its final storage slot.", "Tách home slot của key khỏi final storage slot."), L("Predict the next inspected slot, including wrap-around, before stepping.", "Dự đoán slot được xét tiếp theo, kể cả wrap-around, trước khi chạy bước."), L("At every occupied slot compare the full key before deciding to stop or continue.", "Tại mỗi slot đã chiếm, so sánh full key trước khi quyết định dừng hay đi tiếp.")],
    correction: L("A collision does not overwrite the existing record. A key stored after probing keeps its original home slot; the later slot is only its final storage location.", "Collision không ghi đè record hiện có. Key được lưu sau probing vẫn giữ home slot ban đầu; slot phía sau chỉ là final storage location."),
  },
  "floating-conversion": {
    section: "13",
    reference: L("Syllabus 13.3, p.33; coursebook Chapter 13.3, printed pp.313-320 (PDF pp.329-336); examples independently checked", "Syllabus 13.3, trang 33; sách Chương 13.3, trang in 313-320 (PDF trang 329-336); ví dụ được kiểm tra độc lập"),
    modelBoundary: L("M is an 8-bit two's-complement fraction with the point after the sign; E is a 4-bit two's-complement integer. Only the displayed exact examples are encoded; arbitrary decimal input is not silently rounded. Nonzero normalised M begins 01 or 10; zero is 00000000 / 0000.", "M là fraction two's-complement 8 bit với dấu chấm sau sign; E là integer two's-complement 4 bit. Chỉ các ví dụ exact đang hiển thị được encode; decimal input tùy ý không bị âm thầm làm tròn. M normalised khác 0 bắt đầu 01 hoặc 10; zero là 00000000 / 0000."),
    lanes: [
      lane("Encode an exact value", "Encode giá trị exact", [["Convert magnitude to binary", "Đổi magnitude sang binary"], ["Choose E to position the point", "Chọn E để đặt binary point"], ["Form M at the declared width", "Tạo M theo width đã cho"], ["For a negative M: invert and add one", "Nếu M âm: invert rồi add one"], ["Check 01 / 10 normalisation", "Kiểm tra normalisation 01 / 10"]]),
      lane("Decode to verify", "Decode để xác minh", [["Evaluate signed M weights", "Tính các signed weight của M"], ["Decode signed exponent E", "Decode exponent E có dấu"], ["Calculate M × 2^E", "Tính M × 2^E"], ["Compare with the exact input", "So với exact input"]]),
    ],
    focus: [L("Lock the binary-point position and bit widths before assigning weights.", "Khóa vị trí binary point và bit width trước khi gán weight."), L("Predict the sign and exponent independently before revealing the bit patterns.", "Dự đoán sign và exponent riêng biệt trước khi mở bit pattern."), L("Decode the completed M and E; leading 01 or 10 checks normalisation, not the entire answer.", "Decode M và E hoàn chỉnh; leading 01 hoặc 10 chỉ kiểm tra normalisation, không chứng minh toàn bộ đáp án.")],
    correction: L("The mantissa determines the sign; a negative value does not require a negative exponent. Negating M uses two's complement across all mantissa bits, not a sign-bit flip.", "Mantissa quyết định dấu; giá trị âm không bắt buộc exponent âm. Đổi dấu M dùng two's complement trên toàn bộ bit mantissa, không chỉ flip sign bit."),
  },
  normalisation: {
    section: "13",
    reference: L("Syllabus 13.3, p.33; coursebook Chapter 13, printed pp.321-323; examples independently checked", "Syllabus 13.3, trang 33; sách Chương 13, trang in 321-323; ví dụ được kiểm tra độc lập"),
    modelBoundary: L("M8/E4, both two's complement, with M's point after the sign. For nonzero M, shift while the first two bits match only if E - 1 remains in -8..7. Zero is separate; a blocked shift preserves the original state.", "M8/E4, cả hai dùng two's complement, binary point của M nằm sau sign. Với M khác 0, shift khi hai bit đầu giống nhau chỉ khi E - 1 vẫn thuộc -8..7. Zero được xử lý riêng; shift bị chặn giữ nguyên state ban đầu."),
    lanes: [
      lane("Normalise without changing value", "Normalise mà không đổi giá trị", [["Exclude the zero case", "Tách trường hợp zero"], ["Inspect the first two M bits", "Xem hai bit đầu của M"], ["If equal, shift M left", "Nếu giống nhau, shift M sang trái"], ["Decrease E by one", "Giảm E một"], ["Repeat until M begins 01 or 10", "Lặp tới khi M bắt đầu 01 hoặc 10"]]),
      lane("Verify the invariant", "Xác minh invariant", [["Decode value before", "Decode giá trị trước"], ["Check exponent remains in range", "Kiểm tra exponent còn trong range"], ["Decode value after", "Decode giá trị sau"], ["Confirm both values are equal", "Xác nhận hai giá trị bằng nhau"]]),
    ],
    focus: [L("Read the first two mantissa bits and identify positive 01, negative 10 or a shift candidate.", "Đọc hai bit đầu của mantissa và nhận diện positive 01, negative 10 hoặc trường hợp cần shift."), L("Predict the paired state change: M shifts left while E decreases by one.", "Dự đoán thay đổi state theo cặp: M shift trái còn E giảm một."), L("Decode before and after to prove the represented value is preserved.", "Decode trước và sau để chứng minh giá trị được biểu diễn không đổi.")],
    correction: L("A left shift doubles M, so E must decrease to keep M × 2^E unchanged. Normalisation preserves the stored value; it cannot restore precision already lost.", "Shift trái làm M tăng gấp đôi nên E phải giảm để giữ M × 2^E không đổi. Normalisation giữ giá trị đã lưu; nó không thể khôi phục precision đã mất."),
  },
  "precision-range": {
    section: "13",
    reference: L("Syllabus 13.3, p.33; coursebook Chapter 13, printed pp.323-324; examples independently checked", "Syllabus 13.3, trang 33; sách Chương 13, trang in 323-324; ví dụ được kiểm tra độc lập"),
    modelBoundary: L("Each compared allocation totals 12 bits and uses two's complement for M and E. Spacing is compared at E = 0 on a local zoomed number line. Limits use normalised nonzero M; zero is represented separately.", "Mỗi cách phân bổ được so sánh có tổng 12 bit và dùng two's complement cho M và E. Spacing được so tại E = 0 trên number line phóng to cục bộ. Các limit dùng M normalised khác 0; zero được biểu diễn riêng."),
    lanes: [
      lane("Read the bit allocation", "Đọc cách phân bổ bit", [["Fix the 12-bit total", "Cố định tổng 12 bit"], ["Count mantissa bits", "Đếm mantissa bit"], ["Derive local step size", "Suy ra local step size"], ["Judge precision at fixed E", "Đánh giá precision tại E cố định"]]),
      lane("Read the limits", "Đọc các giới hạn", [["Count exponent bits", "Đếm exponent bit"], ["Derive signed E range", "Suy ra signed E range"], ["Combine normalised M endpoints with E", "Kết hợp endpoint M normalised với E"], ["Judge representable range", "Đánh giá representable range"]]),
    ],
    focus: [L("Keep mantissa width and exponent width in separate columns.", "Giữ mantissa width và exponent width ở hai cột riêng."), L("Predict which allocation gives finer spacing at the same exponent.", "Dự đoán cách phân bổ nào cho spacing mịn hơn tại cùng exponent."), L("Derive positive and negative limits separately because two's-complement endpoints are not symmetric.", "Suy ra positive và negative limit riêng vì endpoint two's-complement không đối xứng.")],
    correction: L("More mantissa bits improve local precision; more exponent bits extend scale range. Zero is not the smallest positive value, and +1 is excluded where M includes -1.", "Nhiều mantissa bit cải thiện local precision; nhiều exponent bit mở rộng scale range. Zero không phải giá trị dương nhỏ nhất, và +1 bị loại trong khi M chứa -1."),
  },
  "rounding-errors": {
    section: "13",
    reference: L("Syllabus 13.3, p.33; coursebook Chapter 13, printed pp.320-321 and 324-325; examples independently checked", "Syllabus 13.3, trang 33; sách Chương 13, trang in 320-321 và 324-325; ví dụ được kiểm tra độc lập"),
    modelBoundary: L("13.375 uses M6/E4; 0.1 and range examples use M8/E4. Truncation is toward zero; nearest ties go away from zero in this teaching model. Error = stored - exact. Range cases state mathematical limits rather than inventing a machine exception policy.", "13.375 dùng M6/E4; 0.1 và các ví dụ range dùng M8/E4. Truncation hướng về zero; tie khi chọn nearest đi xa zero trong mô hình dạy học này. Error = stored - exact. Các trường hợp range nêu mathematical limit thay vì tự đặt machine exception policy."),
    lanes: [
      lane("Approximate a value", "Xấp xỉ một giá trị", [["Write the exact binary value", "Viết exact binary value"], ["Locate neighbouring representable values", "Tìm hai giá trị biểu diễn được lân cận"], ["Apply truncation or nearest rule", "Áp dụng truncation hoặc nearest rule"], ["Store the selected value", "Lưu giá trị đã chọn"], ["Calculate stored - exact", "Tính stored - exact"]]),
      lane("Classify a range failure", "Phân loại lỗi range", [["Derive maximum and least nonzero magnitudes", "Suy ra magnitude lớn nhất và nhỏ nhất khác 0"], ["Compare the exact magnitude", "So sánh exact magnitude"], ["Too large: overflow", "Quá lớn: overflow"], ["Too small and nonzero: underflow", "Quá nhỏ nhưng khác 0: underflow"]]),
    ],
    focus: [L("Mark the exact value and its representable neighbours before choosing a stored value.", "Đánh dấu exact value và các giá trị biểu diễn được lân cận trước khi chọn stored value."), L("Predict the result using the declared rounding rule, including its direction for negatives.", "Dự đoán kết quả theo rounding rule đã khai báo, kể cả hướng làm tròn với số âm."), L("Separate approximation error from overflow and underflow, then verify the signed error calculation.", "Tách approximation error khỏi overflow và underflow, rồi kiểm tra phép tính signed error.")],
    correction: L("Formatting a decimal display does not remove the stored binary error. Underflow concerns a nonzero magnitude below the representable range; it does not mean a negative result.", "Định dạng decimal trên màn hình không loại bỏ binary error đã lưu. Underflow là magnitude khác 0 nhỏ hơn representable range; nó không có nghĩa kết quả âm."),
  },
  "paradigm-procedural": {
    section: "20", reference: L("Syllabus 20.1 and coursebook printed pp.498-505", "Syllabus 20.1 và sách trang in 498-505"),
    lanes: [lane("Recognise the representation", "Nhận diện cách biểu đạt", [["Machine operations", "Thao tác máy"], ["Ordered state changes", "Thay đổi state có thứ tự"], ["Objects own state", "Object sở hữu state"], ["Facts, rules, goals", "Facts, rules, goals"]]), lane("Trace a routine", "Trace một routine", [["Bind parameters", "Gắn parameters"], ["Run construct", "Chạy construct"], ["Return or side effect", "Return hoặc side effect"], ["Resume caller", "Tiếp tục caller"]])],
    focus: [L("Use evidence about how the solution is expressed.", "Dùng bằng chứng về cách lời giải được biểu đạt."), L("Track parameters, local state and the call stack.", "Theo dõi parameters, local state và call stack."), L("Keep procedure side effects separate from function return values.", "Tách side effect của procedure khỏi return value của function.")],
  },
  "addressing-modes": {
    section: "20", reference: L("Coursebook addressing support printed pp.121-129; Section 20.1", "Phần addressing của sách trang in 121-129; Section 20.1"),
    lanes: [lane("Resolve before reading", "Resolve trước khi đọc", [["Operand field", "Trường operand"], ["PC / IX / pointer", "PC / IX / pointer"], ["Effective address", "Địa chỉ hiệu dụng"], ["Final value or branch target", "Giá trị cuối hoặc branch target"]])],
    focus: [L("Lock the supplied PC timing convention.", "Khóa quy ước thời điểm PC đã cho."), L("Separate effective address from the value stored there.", "Tách effective address khỏi giá trị lưu tại đó."), L("Show both lookups for indirect mode.", "Hiển thị cả hai lần lookup của indirect mode.")],
  },
  "assembly-workbench": {
    section: "20", reference: L("Section 20.1 and the displayed S20-ASM-COURSEBOOK-1 instruction set", "Section 20.1 và instruction set S20-ASM-COURSEBOOK-1 hiển thị trên trang"),
    lanes: [lane("One instruction", "Một instruction", [["Fetch at PC", "Fetch tại PC"], ["Resolve operand", "Resolve operand"], ["Apply opcode", "Áp dụng opcode"], ["Record next PC", "Ghi PC kế tiếp"]]), lane("Construction", "Xây dựng instruction", [["State the required effect", "Nêu hiệu ứng cần đạt"], ["Choose supplied opcode", "Chọn opcode được cung cấp"], ["Check addressing syntax", "Kiểm tra cú pháp addressing"]])],
    focus: [L("Use only the displayed instruction set.", "Chỉ dùng instruction set đang hiển thị."), L("Update only the state defined by the opcode.", "Chỉ cập nhật state do opcode quy định."), L("Stop after END or a typed invalid instruction.", "Dừng sau END hoặc instruction sai có kiểu.")],
  },
  "oop-encapsulation": {
    section: "20", reference: L("Cambridge Pseudocode Guide 2026 pp.28-29", "Cambridge Pseudocode Guide 2026 trang 28-29"),
    lanes: [lane("Blueprint to receiver", "Từ blueprint tới receiver", [["Class definition", "Định nghĩa class"], ["Separate instances", "Các instance riêng"], ["Public method boundary", "Boundary của public method"], ["Validated private update", "Cập nhật private có validation"]])],
    focus: [L("Name the receiver object.", "Nêu receiver object."), L("Prove that other instances keep their state.", "Chứng minh các instance khác giữ nguyên state."), L("Do not confuse encapsulation with encryption.", "Không nhầm encapsulation với encryption.")],
  },
  "oop-relationships": {
    section: "20", reference: L("Syllabus 20.1: inheritance, polymorphism and aggregation", "Syllabus 20.1: inheritance, polymorphism và aggregation"),
    lanes: [lane("Choose the relationship", "Chọn quan hệ", [["is-a: inheritance", "is-a: inheritance"], ["has-a: aggregation", "has-a: aggregation"]]), lane("Dispatch", "Dispatch", [["Actual object type", "Kiểu object thực tế"], ["Find override", "Tìm override"], ["Otherwise inherit", "Nếu không thì kế thừa"], ["Run on receiver", "Chạy trên receiver"]])],
    focus: [L("Test the scenario with is-a or has-a wording.", "Kiểm tra scenario bằng is-a hoặc has-a."), L("Use the actual object type for the reviewed dispatch model.", "Dùng kiểu object thực tế cho mô hình dispatch đã duyệt."), L("Reject inheritance when the subtype claim is false.", "Từ chối inheritance khi khẳng định subtype sai.")],
  },
  "declarative-inference": {
    section: "20", reference: L("Syllabus 20.1 and audited Paper 3 facts/rules/goals notation", "Syllabus 20.1 và notation facts/rules/goals đã audit từ Paper 3"),
    lanes: [lane("Prove what must be true", "Chứng minh điều phải đúng", [["Submit goal", "Gửi goal"], ["Match fact or rule conclusion", "Khớp fact hoặc rule conclusion"], ["Bind variables", "Gắn variables"], ["Discharge conditions", "Chứng minh conditions"], ["Satisfied / unsatisfied", "Satisfied / unsatisfied"]])],
    focus: [L("Treat rules as logical conditions, not ordered commands.", "Xem rules là điều kiện logic, không phải commands có thứ tự."), L("Keep bindings consistent along one proof.", "Giữ bindings nhất quán trong một proof."), L("Show the evidence chain for the result.", "Hiển thị chuỗi bằng chứng cho kết quả.")],
  },
  "sequential-files": {
    section: "20", reference: L("Cambridge Pseudocode Guide 2026 pp.25-26", "Cambridge Pseudocode Guide 2026 trang 25-26"),
    lanes: [lane("Text-file workflow", "Luồng text file", [["OPENFILE mode", "Mode của OPENFILE"], ["Test EOF before read", "Kiểm tra EOF trước khi đọc"], ["Read / process / write", "Đọc / xử lý / ghi"], ["CLOSEFILE", "CLOSEFILE"]])],
    focus: [L("State the effect of READ, WRITE or APPEND.", "Nêu hiệu ứng của READ, WRITE hoặc APPEND."), L("Track the pointer and EOF separately.", "Theo dõi pointer và EOF riêng."), L("Reject operations on a closed handle.", "Từ chối thao tác trên handle đã đóng.")],
  },
  "random-files": {
    section: "20", reference: L("Cambridge Pseudocode Guide 2026 pp.26-27", "Cambridge Pseudocode Guide 2026 trang 26-27"),
    lanes: [lane("Target one record", "Nhắm tới một record", [["Declare numbering/layout", "Khai báo numbering/layout"], ["Calculate slot or byte offset", "Tính slot hoặc byte offset"], ["SEEK", "SEEK"], ["GETRECORD / PUTRECORD", "GETRECORD / PUTRECORD"], ["Preserve neighbours", "Giữ nguyên record bên cạnh"]])],
    focus: [L("Random means direct target access, not random numbers.", "Random nghĩa là truy cập trực tiếp mục tiêu, không phải số ngẫu nhiên."), L("Use the declared record base and size.", "Dùng record base và size đã khai báo."), L("Compare changed and unchanged slots.", "So sánh slot đã đổi và không đổi.")],
  },
  "exception-flow": {
    section: "20", reference: L("Syllabus 20.2; Python 3 fixture declared as S20-EXC-PYTHON-1", "Syllabus 20.2; fixture Python 3 S20-EXC-PYTHON-1"),
    lanes: [lane("Control transfer", "Chuyển control", [["Enter try", "Vào try"], ["Risky operation", "Thao tác rủi ro"], ["Raise typed exception", "Raise exception có kiểu"], ["Skip remaining try lines", "Bỏ qua các dòng try còn lại"], ["Match handler or propagate", "Khớp handler hoặc propagate"], ["Cleanup / final outcome", "Cleanup / kết quả cuối"]])],
    focus: [L("Identify the exception type first.", "Xác định exception type trước."), L("Run only a matching handler.", "Chỉ chạy handler khớp."), L("Keep ordinary validation and syntax errors distinct.", "Phân biệt validation thông thường và syntax error.")],
  },
  "tcp-ip-stack": {
    section: "14",
    reference: L("Coursebook Figure 14.1 and printed pp.329-334", "Sách: Hình 14.1 và trang in 329-334"),
    lanes: [
      lane("Sender: move down the stack", "Máy gửi: đi xuống các tầng", [["Application request", "Yêu cầu ứng dụng"], ["Transport segment", "Segment tầng Transport"], ["Internet packet", "Packet tầng Internet"], ["Link frame", "Frame tầng Link"]]),
      lane("Receiver: remove control information upwards", "Máy nhận: gỡ thông tin điều khiển khi đi lên", [["Link frame", "Frame tầng Link"], ["Internet packet", "Packet tầng Internet"], ["Transport segment", "Segment tầng Transport"], ["Application data", "Dữ liệu ứng dụng"]]),
    ],
    focus: [L("Find the active host and layer.", "Xác định host và tầng đang hoạt động."), L("Predict whether one wrapper is added or removed.", "Dự đoán một lớp bọc sẽ được thêm hay gỡ."), L("Check that the inner request stays the same.", "Kiểm tra yêu cầu bên trong vẫn giữ nguyên.")],
  },
  "application-protocols": {
    section: "14",
    reference: L("Coursebook printed pp.330-333: protocol purposes", "Sách trang in 330-333: mục đích các giao thức"),
    lanes: [
      lane("Match the requested action", "Ghép hành động được yêu cầu", [["Web request", "Yêu cầu web"], ["HTTP", "HTTP"], ["Web server response", "Phản hồi máy chủ web"]]),
      lane("Email", "Thư điện tử", [["Send mail", "Gửi thư"], ["SMTP", "SMTP"], ["Read/manage: IMAP or retrieve: POP3", "Đọc/quản lý: IMAP hoặc tải về: POP3"]]),
      lane("Files and peers", "Tệp và các peer", [["Client-server file transfer", "Truyền tệp client-server"], ["FTP", "FTP"], ["Peer-to-peer pieces", "Các phần tệp peer-to-peer"], ["BitTorrent", "BitTorrent"]]),
    ],
    focus: [L("Underline the action verb in the task.", "Gạch chân động từ chỉ hành động trong đề."), L("Choose the protocol whose purpose performs that action.", "Chọn giao thức có mục đích thực hiện hành động đó."), L("Reject the nearest alternative by naming its different purpose.", "Loại phương án gần đúng bằng cách nêu mục đích khác của nó.")],
  },
  bittorrent: {
    section: "14",
    reference: L("Coursebook printed pp.333-336: peers, tracker and pieces", "Sách trang in 333-336: peer, tracker và các phần tệp"),
    lanes: [
      lane("Discovery", "Khám phá peer", [["Descriptor", "Tệp mô tả"], ["Tracker identifies peers", "Tracker cung cấp thông tin peer"], ["Peer connections", "Kết nối giữa các peer"]]),
      lane("Piece transfer", "Truyền các phần tệp", [["Eligible peer owns piece", "Peer nguồn có phần tệp"], ["Copy piece", "Sao chép phần tệp"], ["Receiver verifies piece", "Máy nhận kiểm tra phần tệp"], ["Complete file after all pieces", "Đủ tệp sau khi có mọi phần"]]),
    ],
    focus: [L("Read who owns each piece before the step.", "Đọc peer nào đang giữ từng phần trước bước chạy."), L("Predict one valid source and the receiver's new inventory.", "Dự đoán một nguồn hợp lệ và tập phần mới của máy nhận."), L("Remember that the source keeps its copy.", "Nhớ rằng nguồn vẫn giữ bản sao của mình.")],
  },
  "packet-routing": {
    section: "14",
    reference: L("Coursebook printed pp.338-342: packet header, routes and reassembly", "Sách trang in 338-342: header packet, định tuyến và ghép lại"),
    lanes: [
      lane("Each packet", "Mỗi packet", [["Read destination", "Đọc địa chỉ đích"], ["Look up route", "Tra bảng định tuyến"], ["Choose next hop", "Chọn next hop"], ["Forward", "Chuyển tiếp"]]),
      lane("At the receiver", "Tại máy nhận", [["Packets may arrive by different routes", "Packet có thể đến theo tuyến khác nhau"], ["Use ordering information", "Dùng thông tin thứ tự"], ["Reassemble message", "Ghép lại thông điệp"]]),
    ],
    focus: [L("Follow one packet identity at a time.", "Theo dõi từng định danh packet."), L("Use the supplied table, not a guessed shortest route.", "Dùng bảng đã cho, không tự đoán tuyến ngắn nhất."), L("Reassemble only after every required packet arrives.", "Chỉ ghép khi đủ mọi packet cần thiết.")],
  },
  "switching-methods": {
    section: "14",
    reference: L("Coursebook printed pp.337-345: circuit and packet switching", "Sách trang in 337-345: chuyển mạch kênh và chuyển mạch gói"),
    lanes: [
      lane("Circuit switching", "Chuyển mạch kênh", [["Set up dedicated path", "Thiết lập đường dành riêng"], ["Reserve capacity", "Dành riêng dung lượng"], ["Transfer continuously", "Truyền liên tục"], ["Release path", "Giải phóng đường"]]),
      lane("Packet switching", "Chuyển mạch gói", [["Split and label", "Chia và gắn nhãn"], ["Share links", "Chia sẻ liên kết"], ["Route packets", "Định tuyến packet"], ["Reassemble", "Ghép lại"]]),
    ],
    focus: [L("Compare the same demand under both methods.", "So sánh cùng một nhu cầu ở cả hai phương pháp."), L("Separate reserved capacity from capacity currently in use.", "Phân biệt dung lượng dành riêng với dung lượng đang dùng."), L("Choose from the stated constraints, not from a universal 'faster' claim.", "Chọn theo ràng buộc đã nêu, không dựa vào khẳng định 'luôn nhanh hơn'.")],
  },
  "risc-cisc": {
    section: "15",
    reference: L("Coursebook printed pp.347-349: RISC/CISC characteristics and pipeline context", "Sách trang in 347-349: đặc điểm RISC/CISC và bối cảnh pipeline"),
    lanes: [
      lane("RISC-style teaching sequence", "Chuỗi minh họa kiểu RISC", [["LOAD X", "LOAD X"], ["LOAD Y", "LOAD Y"], ["ADD registers", "ADD các thanh ghi"], ["STORE Z", "STORE Z"]]),
      lane("CISC-style teaching sequence", "Chuỗi minh họa kiểu CISC", [["Read memory operands", "Đọc toán hạng bộ nhớ"], ["One symbolic complex instruction", "Một lệnh phức hợp tượng trưng"], ["Write Z", "Ghi Z"]]),
    ],
    focus: [L("Track memory and registers in separate boxes.", "Theo dõi riêng bộ nhớ và thanh ghi."), L("Predict which location changes at the next step.", "Dự đoán vị trí nào đổi ở bước tiếp theo."), L("Compare instruction profiles, not measured speed.", "So sánh kiểu tập lệnh, không coi là tốc độ đo thực tế.")],
  },
  "pipeline-registers-interrupts": {
    section: "15",
    reference: L("Coursebook printed pp.349-350: five-stage pipeline", "Sách trang in 349-350: pipeline năm giai đoạn"),
    lanes: [
      lane("One instruction", "Một lệnh", [["IF", "IF - nạp lệnh"], ["ID", "ID - giải mã"], ["OF", "OF - lấy toán hạng"], ["IE", "IE - thực thi"], ["WB", "WB - ghi kết quả"]]),
      lane("Interrupt boundary in this model", "Ranh giới ngắt trong mô hình", [["Commit older instruction", "Hoàn tất lệnh cũ"], ["Save architectural state", "Lưu trạng thái kiến trúc"], ["Flush younger work", "Hủy các lệnh trẻ hơn"], ["Restore and refetch", "Khôi phục và nạp lại"]]),
    ],
    focus: [L("Read one clock column vertically.", "Đọc một cột nhịp theo chiều dọc."), L("Then follow one instruction horizontally.", "Sau đó theo một lệnh theo chiều ngang."), L("On interrupt, distinguish committed from flushed instructions.", "Khi có ngắt, phân biệt lệnh đã commit với lệnh bị hủy.")],
  },
  "flynn-parallelism": {
    section: "15",
    reference: L("Coursebook printed pp.350-353: processor organisations and parallel work", "Sách trang in 350-353: tổ chức bộ xử lý và công việc song song"),
    lanes: [
      lane("Classify by streams", "Phân loại theo luồng", [["Count instruction streams", "Đếm luồng lệnh"], ["Count data streams", "Đếm luồng dữ liệu"], ["Name SISD/SIMD/MISD/MIMD", "Gọi tên SISD/SIMD/MISD/MIMD"]]),
      lane("Judge a parallel task", "Đánh giá tác vụ song song", [["Split independent work", "Chia phần việc độc lập"], ["Run lanes", "Chạy các nhánh"], ["Communicate or combine", "Trao đổi hoặc gộp"], ["Account for coordination", "Tính chi phí phối hợp"]]),
    ],
    focus: [L("Count streams before counting processors.", "Đếm luồng trước khi đếm bộ xử lý."), L("Read what each lane does to its data.", "Đọc mỗi nhánh làm gì với dữ liệu."), L("Look for dependencies and the final combine step.", "Tìm phụ thuộc và bước gộp cuối.")],
  },
  "virtual-machines": {
    section: "15",
    reference: L("Coursebook Section 16.2, printed pp.392-394; syllabus places VMs in 15.1", "Sách mục 16.2, trang in 392-394; syllabus xếp VM ở 15.1"),
    lanes: [
      lane("Hosted VM layers used in the book", "Các lớp hosted VM dùng trong sách", [["Guest application", "Ứng dụng guest"], ["Guest OS", "Guest OS"], ["Virtualisation layer", "Lớp ảo hóa"], ["Host OS", "Host OS"], ["Physical resources", "Tài nguyên vật lý"]]),
      lane("Resource decision", "Quyết định tài nguyên", [["Requested RAM", "RAM được yêu cầu"], ["Running guests", "Các guest đang chạy"], ["Reserve", "Phần dự phòng"], ["Accept or reject", "Chấp nhận hoặc từ chối"]]),
    ],
    focus: [L("Trace a request down through the layers.", "Theo một yêu cầu đi xuống qua các lớp."), L("Keep guest resources separate from the physical total.", "Tách tài nguyên guest khỏi tổng tài nguyên vật lý."), L("Check capacity before starting or resizing a guest.", "Kiểm tra dung lượng trước khi chạy hoặc đổi kích thước guest.")],
  },
  "logic-circuit": {
    section: "15",
    reference: L("Coursebook printed pp.354-357: circuit, truth table and Boolean expression", "Sách trang in 354-357: mạch, bảng chân trị và biểu thức Boolean"),
    lanes: [
      lane("Translate the same function", "Biểu diễn cùng một hàm", [["Input row", "Hàng đầu vào"], ["Gate outputs", "Đầu ra từng cổng"], ["Final Y", "Đầu ra Y"], ["Truth-table row", "Hàng bảng chân trị"], ["SOP term when Y=1", "Tích SOP khi Y=1"]]),
    ],
    focus: [L("Follow named wires in gate order.", "Theo các dây có tên theo thứ tự cổng."), L("Record one complete input combination per row.", "Ghi một tổ hợp đầu vào đầy đủ cho mỗi hàng."), L("For SOP, include exactly the rows where Y=1.", "Với SOP, chỉ lấy đúng các hàng Y=1.")],
  },
  adders: {
    section: "15",
    reference: L("Coursebook printed pp.357-358: half and full adders", "Sách trang in 357-358: half adder và full adder"),
    lanes: [
      lane("Half adder", "Half adder", [["A, B", "A, B"], ["XOR gives S", "XOR tạo S"], ["AND gives C", "AND tạo C"]]),
      lane("Full adder", "Full adder", [["A, B, Cin", "A, B, Cin"], ["Two partial sums", "Hai tổng từng phần"], ["Combine carries", "Gộp các carry"], ["S and Cout", "S và Cout"]]),
    ],
    focus: [L("Name every input bit, including Cin.", "Gọi tên mọi bit đầu vào, gồm Cin."), L("Predict each intermediate wire before the final outputs.", "Dự đoán từng dây trung gian trước đầu ra cuối."), L("Verify numerically with A+B+Cin = 2Cout+S.", "Kiểm tra bằng A+B+Cin = 2Cout+S.")],
  },
  "sr-jk-flip-flops": {
    section: "15",
    reference: L("Coursebook Figures 15.15-15.17 and Table 15.6, printed pp.359-361", "Sách Hình 15.15-15.17 và Bảng 15.6, trang in 359-361"),
    lanes: [
      lane("Active-high NOR SR", "SR dùng NOR tích cực mức cao", [["S, R plus previous Q", "S, R cùng Q trước"], ["Cross-coupled NOR gates", "Hai cổng NOR hồi tiếp chéo"], ["Q and Q-bar", "Q và Q-bar"], ["Hold, set, reset or invalid", "Giữ, set, reset hoặc invalid"]]),
      lane("Edge-triggered JK", "JK kích theo cạnh", [["J, K plus previous Q", "J, K cùng Q trước"], ["Wait for active edge", "Chờ cạnh kích hoạt"], ["Hold/set/reset/toggle", "Giữ/set/reset/đảo"]]),
    ],
    focus: [L("Read the declared gate and clock convention first.", "Đọc quy ước cổng và clock trước."), L("Use the previous Q when the rule requires it.", "Dùng Q trước đó khi quy tắc yêu cầu."), L("Treat SR=11 as invalid, not as a remembered bit.", "Xem SR=11 là invalid, không coi là bit được nhớ.")],
    correction: L("The coursebook prose around SR set/reset is inconsistent; this visual follows the actual cross-coupled NOR circuit and Table 15.6.", "Phần diễn giải set/reset SR trong sách có chỗ không nhất quán; visual dùng đúng mạch NOR hồi tiếp chéo và Bảng 15.6."),
  },
  "boolean-simplification": {
    section: "15",
    reference: L("Coursebook printed pp.360-363: Boolean laws and equivalence", "Sách trang in 360-363: luật Boolean và tính tương đương"),
    lanes: [
      lane("A valid simplification", "Một phép rút gọn hợp lệ", [["Original expression", "Biểu thức ban đầu"], ["Apply one named law", "Áp dụng một luật có tên"], ["New expression", "Biểu thức mới"], ["Compare every truth row", "So mọi hàng chân trị"], ["Equivalent", "Tương đương"]]),
    ],
    focus: [L("Change only the sub-expression justified by the named law.", "Chỉ đổi biểu thức con được luật đang dùng cho phép."), L("Predict the next line before advancing.", "Dự đoán dòng tiếp theo trước khi chuyển bước."), L("Require all truth rows to match.", "Yêu cầu mọi hàng chân trị đều trùng.")],
  },
  "karnaugh-map": {
    section: "15",
    reference: L("Coursebook printed pp.364-369: Gray order and K-map grouping", "Sách trang in 364-369: thứ tự Gray và nhóm K-map"),
    lanes: [
      lane("From function to term", "Từ hàm tới hạng tử", [["Place 1s in Gray order", "Đặt các ô 1 theo thứ tự Gray"], ["Group adjacent 1s", "Nhóm các ô 1 liền kề"], ["Use groups of 1,2,4,8...", "Dùng nhóm 1,2,4,8..."], ["Keep only constant literals", "Chỉ giữ literal không đổi"], ["OR the terms", "OR các hạng tử"]]),
    ],
    focus: [L("Check edge wrapping before rejecting a group.", "Kiểm tra nối mép trước khi loại một nhóm."), L("Reject diagonals and non-power-of-two sizes.", "Loại nhóm chéo và kích thước không phải lũy thừa hai."), L("Verify that every required 1 is covered.", "Kiểm tra mọi ô 1 cần thiết đều được phủ.")],
    correction: L("The coursebook incorrectly permits a six-cell group in one rule. Valid rectangular groups have size 2^k.", "Sách có một quy tắc cho phép nhóm sáu ô, nhưng điều này sai. Nhóm chữ nhật hợp lệ phải có kích thước 2^k."),
  },
  "process-states": {
    section: "16",
    reference: L("Coursebook printed pp.377-379: process states and transitions", "Sách trang in 377-379: trạng thái và chuyển trạng thái tiến trình"),
    lanes: [
      lane("Main state path", "Luồng trạng thái chính", [["READY", "READY"], ["Scheduler dispatches", "Scheduler chọn chạy"], ["RUNNING", "RUNNING"], ["Process requests I/O", "Tiến trình yêu cầu I/O"], ["BLOCKED", "BLOCKED"]]),
      lane("Return paths", "Các đường quay lại", [["Timer/preemption: RUNNING", "Timer/preemption: RUNNING"], ["READY", "READY"], ["I/O completes: BLOCKED", "I/O hoàn tất: BLOCKED"], ["READY", "READY"]]),
    ],
    focus: [L("Locate each process token before the event.", "Xác định token của từng tiến trình trước sự kiện."), L("Name the event and its required starting state.", "Gọi tên sự kiện và trạng thái bắt đầu cần có."), L("Move only the affected process; I/O completion ends in READY.", "Chỉ di chuyển tiến trình bị tác động; I/O hoàn tất đưa về READY.")],
    correction: L("A preempted or quantum-expired runnable process returns to READY. It does not become BLOCKED.", "Tiến trình đang chạy bị preempt hoặc hết quantum quay về READY, không chuyển sang BLOCKED."),
  },
  "cpu-scheduling": {
    section: "16",
    reference: L("Coursebook printed pp.376-381: scheduling policies and traces", "Sách trang in 376-381: chính sách lập lịch và trace"),
    lanes: [
      lane("At each decision boundary", "Tại mỗi ranh giới quyết định", [["Admit arrivals", "Nhận tiến trình mới đến"], ["Read remaining bursts", "Đọc burst còn lại"], ["Apply policy", "Áp dụng chính sách"], ["Choose one process", "Chọn một tiến trình"], ["Advance time", "Tiến thời gian"]]),
      lane("After the trace", "Sau khi trace", [["Completion times", "Thời điểm hoàn tất"], ["Waiting/turnaround/response", "Waiting/turnaround/response"], ["Compare policies", "So sánh chính sách"]]),
    ],
    focus: [L("Start with arrivals and bursts, not the completed Gantt chart.", "Bắt đầu từ arrival và burst, không nhìn trước Gantt hoàn chỉnh."), L("Predict the selected process at the next boundary.", "Dự đoán tiến trình được chọn ở ranh giới tiếp theo."), L("Then reveal the interval and update remaining work.", "Sau đó mở khoảng chạy và cập nhật công việc còn lại.")],
    correction: L("SRT compares current remaining time. A preempted process remains READY; the visual corrects contrary examples in the book.", "SRT so sánh thời gian còn lại hiện tại. Tiến trình bị preempt vẫn READY; visual sửa các ví dụ trái với quy tắc này trong sách."),
  },
  "kernel-interrupts": {
    section: "16",
    reference: L("Coursebook printed pp.374-379: kernel, interrupts and context switching", "Sách trang in 374-379: kernel, ngắt và chuyển ngữ cảnh"),
    lanes: [
      lane("Interrupt handling", "Xử lý ngắt", [["Application running", "Ứng dụng đang chạy"], ["Save PC/registers", "Lưu PC/thanh ghi"], ["Run kernel handler", "Chạy handler của kernel"], ["Update ready/blocked queues", "Cập nhật hàng Ready/Blocked"], ["Schedule", "Lập lịch"], ["Restore selected context", "Khôi phục context được chọn"]]),
    ],
    focus: [L("Identify the interrupt source.", "Xác định nguồn ngắt."), L("Track whose context is saved and whose is selected.", "Theo dõi context của ai được lưu và ai được chọn."), L("Check the exact PC/register values restored at the end.", "Kiểm tra đúng PC/thanh ghi được khôi phục ở cuối.")],
  },
  "memory-addressing": {
    section: "16",
    reference: L("Coursebook printed pp.382-388: paging, segmentation and virtual memory", "Sách trang in 382-388: paging, segmentation và bộ nhớ ảo"),
    lanes: [
      lane("Paging", "Paging", [["Logical address", "Địa chỉ logic"], ["Page + offset", "Page + offset"], ["Page-table lookup", "Tra bảng trang"], ["Frame + offset", "Frame + offset"], ["Physical address", "Địa chỉ vật lý"]]),
      lane("Segmentation", "Segmentation", [["Segment + offset", "Segment + offset"], ["Look up base and limit", "Tra base và limit"], ["Check offset < limit", "Kiểm tra offset < limit"], ["base + offset", "base + offset"]]),
    ],
    focus: [L("Split the logical address before looking at physical memory.", "Tách địa chỉ logic trước khi nhìn bộ nhớ vật lý."), L("Validate present/bounds before calculating.", "Kiểm tra present/giới hạn trước khi tính."), L("A page fault has no physical answer until loading and retry.", "Page fault chưa có địa chỉ vật lý cho tới khi nạp và thử lại.")],
    correction: L("For segmentation, the segment number indexes the table; the physical address is base + offset after the bounds check.", "Với segmentation, số segment dùng để tra bảng; địa chỉ vật lý là base + offset sau khi kiểm tra giới hạn."),
  },
  "page-replacement": {
    section: "16",
    reference: L("Coursebook printed pp.388-389: replacement policies and thrashing", "Sách trang in 388-389: thay thế trang và thrashing"),
    lanes: [
      lane("For each reference", "Với mỗi tham chiếu", [["Is page resident?", "Trang đã ở RAM?"], ["Hit: update policy history", "Hit: cập nhật lịch sử chính sách"], ["Fault: use free frame or choose victim", "Fault: dùng frame trống hoặc chọn nạn nhân"], ["Load page", "Nạp trang"], ["Update FIFO/LRU order", "Cập nhật thứ tự FIFO/LRU"]]),
    ],
    focus: [L("Keep frame contents separate from policy order.", "Tách nội dung frame khỏi thứ tự chính sách."), L("Predict the victim before resolving the fault.", "Dự đoán trang bị thay trước khi xử lý fault."), L("Judge thrashing from sustained paging pressure, not one fault.", "Đánh giá thrashing từ áp lực paging kéo dài, không từ một fault.")],
  },
  "translation-workflows": {
    section: "16",
    reference: L("Coursebook printed pp.394-395: interpreter versus compiler", "Sách trang in 394-395: interpreter và compiler"),
    lanes: [
      lane("Interpreter", "Interpreter", [["Read next statement", "Đọc câu lệnh tiếp"], ["Translate/check it", "Dịch/kiểm tra câu lệnh"], ["Execute now", "Thực thi ngay"], ["Continue until error or end", "Tiếp tục tới lỗi hoặc hết chương trình"]]),
      lane("Compiler", "Compiler", [["Read whole source", "Đọc toàn bộ mã nguồn"], ["Analyse/translate", "Phân tích/dịch"], ["Create artifact if successful", "Tạo sản phẩm nếu thành công"], ["Execute later", "Thực thi sau"]]),
    ],
    focus: [L("Use the same source program for both workflows.", "Dùng cùng mã nguồn cho cả hai workflow."), L("Separate translation from execution.", "Tách hoạt động dịch khỏi thực thi."), L("With an error, check which earlier outputs can exist.", "Khi có lỗi, kiểm tra đầu ra trước đó nào có thể tồn tại.")],
  },
  "compilation-pipeline": {
    section: "16",
    reference: L("Coursebook printed pp.395-398: compilation stages", "Sách trang in 395-398: các giai đoạn biên dịch"),
    lanes: [
      lane("Required conceptual stages", "Các giai đoạn khái niệm cần biết", [["Source characters", "Ký tự mã nguồn"], ["Lexical analysis → tokens", "Phân tích từ vựng → token"], ["Syntax analysis → structure", "Phân tích cú pháp → cấu trúc"], ["Code generation", "Sinh mã"], ["Optimisation", "Tối ưu hóa"]]),
    ],
    focus: [L("Watch the representation change at each stage.", "Quan sát dạng biểu diễn đổi ở mỗi giai đoạn."), L("Locate the first stage that can detect the supplied error.", "Xác định giai đoạn đầu tiên có thể phát hiện lỗi đã cho."), L("Do not invent later code or output after a failed stage.", "Không tạo mã hay đầu ra giả sau giai đoạn thất bại.")],
  },
  "bnf-explorer": {
    section: "16",
    reference: L("Coursebook printed pp.398-400: syntax diagrams and BNF", "Sách trang in 398-400: sơ đồ cú pháp và BNF"),
    lanes: [
      lane("Recognise a complete string", "Nhận dạng toàn bộ chuỗi", [["Start non-terminal", "Non-terminal bắt đầu"], ["Choose one production", "Chọn một production"], ["Match terminals left to right", "Khớp terminal từ trái sang phải"], ["Repeat/choose as grammar allows", "Lặp/chọn theo văn phạm"], ["Accept only when input is exhausted", "Chỉ chấp nhận khi đã dùng hết input"]]),
    ],
    focus: [L("Read adjacent symbols as sequence.", "Đọc các ký hiệu liền nhau là nối tiếp."), L("Read | as a choice between alternatives.", "Đọc | là lựa chọn giữa các phương án."), L("Track both the derivation and the unconsumed suffix.", "Theo dõi cả dẫn xuất và hậu tố chưa dùng.")],
    correction: L("The book prints <letter> | <digit> for 'letter followed by digit'. The correct sequence is <letter><digit>; | means choice.", "Sách in <letter> | <digit> cho 'chữ cái theo sau bởi chữ số'. Dạng nối tiếp đúng là <letter><digit>; | nghĩa là lựa chọn."),
  },
  "rpn-stack": {
    section: "16",
    reference: L("Coursebook printed pp.400-401: RPN and stack evaluation", "Sách trang in 400-401: RPN và tính bằng stack"),
    lanes: [
      lane("Evaluate one token", "Xử lý một token", [["Read left to right", "Đọc từ trái sang phải"], ["Number: push", "Số: push"], ["Operator: pop RIGHT", "Toán tử: pop RIGHT"], ["Pop LEFT", "Pop LEFT"], ["Calculate LEFT op RIGHT", "Tính LEFT op RIGHT"], ["Push result", "Push kết quả"]]),
    ],
    focus: [L("Keep the bottom and top of stack visible.", "Luôn xác định đáy và đỉnh stack."), L("For subtraction/division, name RIGHT before LEFT.", "Với trừ/chia, gọi RIGHT trước rồi LEFT."), L("A valid final result leaves exactly one stack item.", "Kết quả hợp lệ phải để lại đúng một phần tử trên stack.")],
  },
  "key-ownership": {
    section: "17",
    reference: L("Coursebook Chapter 17 and syllabus 17.1: encryption and key ownership", "Sách Chương 17 và syllabus 17.1: mã hóa và quyền sở hữu khóa"),
    lanes: [
      lane("Confidential message", "Thông điệp bí mật", [["Sender", "Người gửi"], ["Recipient public key / shared secret", "Khóa công khai người nhận / khóa chung"], ["Cipher text", "Bản mã"], ["Recipient decrypts", "Người nhận giải mã"]]),
      lane("Verified public message", "Thông điệp công khai được xác minh", [["Sender private-key signature", "Chữ ký bằng khóa riêng người gửi"], ["Readable message + signature", "Thông điệp đọc được + chữ ký"], ["Sender public-key verification", "Kiểm bằng khóa công khai người gửi"]]),
    ],
    focus: [L("Name the required security goal.", "Gọi tên mục tiêu bảo mật."), L("Write the owner of every candidate key.", "Ghi chủ sở hữu của từng khóa ứng viên."), L("Check the exact outcome: read or verify.", "Kiểm tra đúng kết quả: đọc hay xác minh.")],
  },
  "quantum-key-distribution": {
    section: "17",
    reference: L("Coursebook Chapter 17 and syllabus 17.1: quantum cryptography", "Sách Chương 17 và syllabus 17.1: mật mã lượng tử"),
    lanes: [
      lane("Quantum channel", "Kênh lượng tử", [["Alice prepares", "Alice chuẩn bị"], ["Eve may measure/resend", "Eve có thể đo/gửi lại"], ["Bob measures", "Bob đo"]]),
      lane("Classical comparison", "So sánh qua kênh cổ điển", [["Compare bases", "So sánh cơ sở"], ["Keep matching positions", "Giữ vị trí khớp"], ["Reveal a sample", "Công bố một mẫu"], ["Accept or abort", "Chấp nhận hoặc hủy"]]),
    ],
    focus: [L("Track which positions survive basis comparison.", "Theo dõi vị trí còn lại sau so sánh cơ sở."), L("Inspect only the declared public sample.", "Chỉ kiểm tra mẫu công khai đã nêu."), L("Treat detection as statistical evidence, not certainty.", "Xem phát hiện là bằng chứng thống kê, không phải chắc chắn tuyệt đối.")],
  },
  "tls-session": {
    section: "17",
    reference: L("Coursebook Chapter 17 and syllabus 17.1: SSL/TLS client-server use", "Sách Chương 17 và syllabus 17.1: sử dụng SSL/TLS client-server"),
    lanes: [
      lane("Set up trust and keys", "Thiết lập niềm tin và khóa", [["Client connects", "Client kết nối"], ["Server certificate", "Chứng thư server"], ["Client validates", "Client kiểm tra"], ["Session keys established", "Thiết lập khóa phiên"]]),
      lane("Protected session", "Phiên được bảo vệ", [["Application data", "Dữ liệu ứng dụng"], ["Protect in transit", "Bảo vệ khi truyền"], ["Receive inside session", "Nhận trong phiên"]]),
    ],
    focus: [L("Identify whether a client-server transfer exists.", "Xác định có truyền client-server hay không."), L("Do not mark application data protected before session setup.", "Không đánh dấu dữ liệu ứng dụng được bảo vệ trước khi thiết lập phiên."), L("State what TLS does and does not guarantee.", "Nêu điều TLS bảo đảm và không bảo đảm.")],
  },
  "certificate-signature": {
    section: "17",
    reference: L("Coursebook Chapter 17 and syllabus 17.1: certificates and signatures", "Sách Chương 17 và syllabus 17.1: chứng thư và chữ ký"),
    lanes: [
      lane("Acquire a certificate", "Xin cấp chứng thư", [["Identity + public-key request", "Yêu cầu danh tính + khóa công khai"], ["CA checks", "CA kiểm tra"], ["CA issues binding", "CA cấp liên kết"]]),
      lane("Sign and verify", "Ký và kiểm chứng", [["Digest message", "Tóm lược thông điệp"], ["Sender private operation", "Phép dùng khóa riêng người gửi"], ["Deliver message + signature", "Gửi thông điệp + chữ ký"], ["Certified public-key check", "Kiểm bằng khóa công khai trong chứng thư"]]),
    ],
    focus: [L("Keep certificate, signature and message separate.", "Tách riêng chứng thư, chữ ký và thông điệp."), L("Check the key owner before verification.", "Kiểm tra chủ sở hữu khóa trước khi xác minh."), L("Report authenticity/integrity separately from confidentiality.", "Nêu xác thực/toàn vẹn riêng với bí mật.")],
  },
  "dijkstra-search": {
    section: "18",
    reference: L("Coursebook Chapter 18.1, printed pp.425-429: graphs and Dijkstra search", "Sách Chương 18.1, trang in 425-429: đồ thị và tìm kiếm Dijkstra"),
    lanes: [
      lane("Trace one decision", "Trace một quyết định", [["Select smallest tentative distance", "Chọn khoảng cách tạm thời nhỏ nhất"], ["Test an edge", "Xét một cạnh"], ["Keep only a strictly lower cost", "Chỉ giữ chi phí thấp hơn nghiêm ngặt"], ["Store predecessor", "Lưu predecessor"]]),
      lane("Finish the route", "Hoàn tất tuyến", [["Settle nodes", "Chốt các nút"], ["Reach goal", "Tới đích"], ["Follow predecessors backwards", "Theo predecessor ngược lại"], ["Verify total weight", "Kiểm tra tổng trọng số"]]),
    ],
    focus: [L("Read weights as edge costs, not edge counts.", "Đọc trọng số là chi phí cạnh, không phải số cạnh."), L("Predict the next smallest tentative distance.", "Dự đoán khoảng cách tạm thời nhỏ nhất tiếp theo."), L("Check the predecessor chain against the final cost.", "Đối chiếu chuỗi predecessor với chi phí cuối.")],
  },
  "astar-search": {
    section: "18",
    reference: L("Coursebook Chapter 18.1, printed pp.429-434: A* and heuristic search", "Sách Chương 18.1, trang in 429-434: A* và tìm kiếm heuristic"),
    lanes: [
      lane("Score a candidate", "Tính điểm ứng viên", [["g: cost already paid", "g: chi phí đã đi"], ["h: estimate to goal", "h: ước lượng tới đích"], ["f = g + h", "f = g + h"], ["Select smallest f", "Chọn f nhỏ nhất"]]),
      lane("Check the boundary", "Kiểm tra giới hạn", [["Update with lower g", "Cập nhật bằng g thấp hơn"], ["Use declared tie rule", "Dùng quy tắc phá hòa"], ["Reconstruct with predecessors", "Dựng lại bằng predecessor"], ["State heuristic assumptions", "Nêu giả định heuristic"]]),
    ],
    focus: [L("Keep g, h and f in separate columns.", "Giữ g, h và f ở các cột riêng."), L("Predict from f, while updating routes from g.", "Dự đoán theo f, còn cập nhật tuyến theo g."), L("Claim optimality only under the reviewed heuristic conditions.", "Chỉ tuyên bố tối ưu theo điều kiện heuristic đã duyệt.")],
  },
  "learning-categories": {
    section: "18",
    reference: L("Coursebook Chapter 18.2, printed pp.434-440: machine-learning categories", "Sách Chương 18.2, trang in 434-440: các hình thức học máy"),
    lanes: [
      lane("Inspect the evidence", "Xét dữ kiện", [["Known target for each example?", "Có mục tiêu cho từng ví dụ?"], ["No per-example target?", "Không có mục tiêu từng ví dụ?"], ["Actions with reward or penalty?", "Hành động có thưởng hoặc phạt?"]]),
      lane("Name the category", "Gọi tên hình thức", [["Supervised", "Có giám sát"], ["Unsupervised", "Không giám sát"], ["Reinforcement", "Tăng cường"]]),
    ],
    focus: [L("Ignore distracting application nouns.", "Bỏ qua danh từ ứng dụng gây nhiễu."), L("Identify the target or feedback signal.", "Nhận diện mục tiêu hoặc tín hiệu phản hồi."), L("Justify the category with the supplied evidence.", "Giải thích hình thức bằng dữ kiện đã cho.")],
  },
  "neural-network": {
    section: "18",
    reference: L("Coursebook Chapter 18.2, printed pp.440-444: neural networks and deep learning", "Sách Chương 18.2, trang in 440-444: mạng neuron và deep learning"),
    lanes: [
      lane("Forward inference", "Suy luận xuôi", [["Input values", "Giá trị đầu vào"], ["Weighted connections", "Liên kết có trọng số"], ["Hidden activations", "Kích hoạt tầng ẩn"], ["Output prediction", "Dự đoán đầu ra"]]),
      lane("Depth", "Độ sâu", [["Shallow: one hidden stage", "Nông: một tầng ẩn"], ["Deep: multiple hidden stages", "Sâu: nhiều tầng ẩn"], ["Same fixed weights during inference", "Cùng trọng số cố định khi inference"]]),
    ],
    focus: [L("Track one value through every layer.", "Theo một giá trị qua từng tầng."), L("Predict the output before revealing it.", "Dự đoán đầu ra trước khi mở."), L("Separate forward inference from weight training.", "Tách inference xuôi khỏi huấn luyện trọng số.")],
  },
  backpropagation: {
    section: "18",
    reference: L("Coursebook Chapter 18.2, printed pp.444-445: backpropagation of errors", "Sách Chương 18.2, trang in 444-445: lan truyền ngược sai số"),
    lanes: [
      lane("Forward pass", "Lượt xuôi", [["Input", "Đầu vào"], ["Current weight", "Trọng số hiện tại"], ["Prediction", "Dự đoán"], ["Compare with target", "So với mục tiêu"]]),
      lane("Training correction", "Hiệu chỉnh khi huấn luyện", [["Calculate error", "Tính sai số"], ["Send correction backwards", "Truyền hiệu chỉnh ngược"], ["Adjust weight", "Điều chỉnh trọng số"], ["Run forward again", "Chạy xuôi lại"]]),
    ],
    focus: [L("Record the declared error convention.", "Ghi quy ước sai số đã công bố."), L("Calculate the correction from the shown values.", "Tính hiệu chỉnh từ các giá trị đang hiển thị."), L("Compare verified before and after errors only.", "Chỉ so sai số trước và sau đã kiểm chứng.")],
  },
  regression: {
    section: "18",
    reference: L("Coursebook Chapter 18.2, printed p.445: regression and continuous prediction", "Sách Chương 18.2, trang in 445: hồi quy và dự đoán liên tục"),
    lanes: [
      lane("Fit", "Khớp", [["Input-target pairs", "Cặp đầu vào-mục tiêu"], ["Fit a numeric relationship", "Khớp quan hệ số"], ["Inspect residuals", "Xem residual"]]),
      lane("Predict", "Dự đoán", [["Choose a new x", "Chọn x mới"], ["Substitute in the equation", "Thay vào phương trình"], ["Return continuous y", "Trả về y liên tục"], ["State interpolation or extrapolation", "Nêu nội suy hoặc ngoại suy"]]),
    ],
    focus: [L("Identify a continuous target.", "Nhận diện mục tiêu liên tục."), L("Predict from the displayed fitted equation.", "Dự đoán từ phương trình khớp đang hiển thị."), L("Treat fit as association, not automatic causation.", "Xem độ khớp là liên hệ, không tự động là nhân quả.")],
  },
  "linear-search": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.451-454: linear search", "Sách Chương 19, trang in 451-454: linear search"),
    lanes: [
      lane("Scan the valid range", "Quét miền hợp lệ", [["Start at index 0", "Bắt đầu tại index 0"], ["Compare current item", "So sánh phần tử hiện tại"], ["Return first match", "Trả match đầu tiên"], ["Return -1 after exhaustion", "Trả -1 sau khi hết miền"]]),
      lane("Keep the trace aligned", "Giữ trace đồng bộ", [["Current index", "Index hiện tại"], ["Checked prefix", "Prefix đã xét"], ["Comparison count", "Số phép so sánh"], ["Found or missing", "Found hoặc missing"]]),
    ],
    focus: [L("Declare the index base and valid bounds.", "Khai báo index base và cận hợp lệ."), L("Compare before incrementing.", "So sánh trước khi tăng."), L("Claim missing only after every valid item is ruled out.", "Chỉ kết luận missing sau khi loại mọi phần tử hợp lệ.")],
  },
  "binary-search": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.454-457: binary search", "Sách Chương 19, trang in 454-457: binary search"),
    lanes: [
      lane("Prove the precondition", "Xác nhận precondition", [["Values are sorted", "Giá trị đã sorted"], ["Low and High are inclusive", "Low và High là inclusive"], ["Mid uses DIV 2", "Mid dùng DIV 2"]]),
      lane("Shrink the window", "Thu hẹp cửa sổ", [["Compare Data[Mid]", "So sánh Data[Mid]"], ["Return on equality", "Trả khi bằng"], ["Exclude Mid and one half", "Loại Mid và một nửa"], ["Stop when Low > High", "Dừng khi Low > High"]]),
    ],
    focus: [L("Reject unsorted input before tracing.", "Chặn input unsorted trước khi trace."), L("Write Low, Mid and High on every row.", "Ghi Low, Mid và High ở mọi dòng."), L("Check that each inequality makes strict progress.", "Kiểm tra mỗi bất đẳng thức tạo tiến triển nghiêm ngặt.")],
  },
  "bubble-sort": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.457-461: bubble sort", "Sách Chương 19, trang in 457-461: bubble sort"),
    lanes: [
      lane("One comparison", "Một phép so sánh", [["Choose adjacent pair", "Chọn cặp kề nhau"], ["Compare left and right", "So sánh trái và phải"], ["Swap only if out of order", "Chỉ swap khi sai thứ tự"]]),
      lane("One pass", "Một pass", [["Continue to pass boundary", "Tiếp tục tới biên pass"], ["Largest live value reaches right", "Giá trị lớn nhất còn lại tới bên phải"], ["Shrink completed boundary", "Thu hẹp biên completed"], ["Early exit only after no-swap pass", "Chỉ early exit sau pass không swap"]]),
    ],
    focus: [L("Mark the adjacent pair before changing values.", "Đánh dấu cặp kề trước khi đổi giá trị."), L("Update the completed region only after a whole pass.", "Chỉ cập nhật vùng completed sau một pass đầy đủ."), L("Count comparisons separately from swaps.", "Đếm comparisons tách khỏi swaps.")],
  },
  "insertion-sort": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.461-465: insertion sort", "Sách Chương 19, trang in 461-465: insertion sort"),
    lanes: [
      lane("Protect the key", "Bảo vệ key", [["Mark sorted prefix", "Đánh dấu sorted prefix"], ["Save current key", "Lưu key hiện tại"], ["Create a temporary gap", "Tạo gap tạm thời"]]),
      lane("Shift then insert", "Shift rồi insert", [["Compare prefix value", "So sánh giá trị prefix"], ["Shift larger values right", "Dịch giá trị lớn hơn sang phải"], ["Insert saved key", "Chèn key đã lưu"], ["Extend sorted prefix", "Mở rộng sorted prefix"]]),
    ],
    focus: [L("Save the key before the first shift.", "Lưu key trước lần shift đầu."), L("Show each shift instead of teleporting the item.", "Hiển thị từng shift thay vì dịch chuyển tức thời."), L("Recheck the sorted-prefix invariant after insertion.", "Kiểm tra lại invariant sorted-prefix sau insertion.")],
  },
  "stack-adt": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.465-470: stack ADT", "Sách Chương 19, trang in 465-470: stack ADT"),
    lanes: [
      lane("LIFO interface", "Interface LIFO", [["PUSH inserts at Top", "PUSH chèn tại Top"], ["PEEK reads Top", "PEEK đọc Top"], ["POP removes Top", "POP xóa Top"]]),
      lane("Array convention", "Quy ước mảng", [["Empty: Top = -1", "Empty: Top = -1"], ["Full: Top = Capacity - 1", "Full: Top = Capacity - 1"], ["Guard before access", "Kiểm tra trước khi truy cập"], ["Update Top consistently", "Cập nhật Top nhất quán"]]),
    ],
    focus: [L("Lock the Top convention before tracing.", "Khóa quy ước Top trước khi trace."), L("Predict the returned value as well as the cells.", "Dự đoán cả giá trị trả về và các ô."), L("Preserve state on underflow or overflow.", "Giữ nguyên state khi underflow hoặc overflow.")],
  },
  "queue-adt": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.470-474: queue ADT", "Sách Chương 19, trang in 470-474: queue ADT"),
    lanes: [
      lane("FIFO interface", "Interface FIFO", [["ENQUEUE at Rear", "ENQUEUE tại Rear"], ["DEQUEUE at Front", "DEQUEUE tại Front"], ["Return oldest item", "Trả phần tử cũ nhất"]]),
      lane("Circular-array convention", "Quy ước mảng vòng", [["Front = next removal", "Front = vị trí lấy tiếp"], ["Rear = next insertion", "Rear = vị trí chèn tiếp"], ["Advance MOD Capacity", "Tăng theo MOD Capacity"], ["Count distinguishes empty/full", "Count phân biệt empty/full"]]),
    ],
    focus: [L("State whether the queue is linear or circular.", "Nêu queue là linear hay circular."), L("Track Front, Rear and Count together.", "Theo dõi Front, Rear và Count cùng nhau."), L("Check FIFO logical order after wrap-around.", "Kiểm tra thứ tự FIFO sau wrap-around.")],
  },
  "linked-list": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.474-482: linked lists", "Sách Chương 19, trang in 474-482: linked list"),
    lanes: [
      lane("Traverse", "Duyệt", [["Start at Head", "Bắt đầu tại Head"], ["Compare node Data", "So sánh Data của node"], ["Save Previous", "Lưu Previous"], ["Follow Next to NULL", "Theo Next tới NULL"]]),
      lane("Update safely", "Cập nhật an toàn", [["Save successor first", "Lưu successor trước"], ["Relink predecessor or Head", "Nối lại predecessor hoặc Head"], ["Clear or allocate node", "Xóa hoặc cấp phát node"], ["Recheck reachability", "Kiểm tra lại reachability"]]),
    ],
    focus: [L("Draw addresses and links before changing them.", "Vẽ address và link trước khi đổi."), L("Never overwrite the only link to the remaining list.", "Không ghi đè link duy nhất tới phần list còn lại."), L("Verify that every reachable node still leads to NULL.", "Xác minh mọi node reachable vẫn dẫn tới NULL.")],
  },
  "binary-tree": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.482-486: binary trees", "Sách Chương 19, trang in 482-486: binary tree"),
    lanes: [
      lane("Find in a BST", "Tìm trong BST", [["Start at Root", "Bắt đầu tại Root"], ["Compare with current node", "So sánh với node hiện tại"], ["Smaller goes left", "Nhỏ hơn đi trái"], ["Larger goes right", "Lớn hơn đi phải"]]),
      lane("Insert", "Chèn", [["Stop at missing child", "Dừng tại child trống"], ["Create one leaf", "Tạo một leaf"], ["Preserve ordering", "Giữ ordering"], ["Apply duplicate policy", "Áp dụng duplicate policy"]]),
    ],
    focus: [L("Write the ordering and duplicate rule first.", "Ghi ordering và quy tắc duplicate trước."), L("Record the exact traversal path.", "Ghi chính xác traversal path."), L("Keep deletion outside this core lesson.", "Giữ deletion ngoài core lesson này.")],
  },
  dictionary: {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.486-489: dictionary ADT", "Sách Chương 19, trang in 486-489: dictionary ADT"),
    lanes: [
      lane("External operations", "Thao tác bên ngoài", [["LOOKUP by key", "LOOKUP bằng key"], ["INSERT a new key", "INSERT key mới"], ["UPDATE an existing key", "UPDATE key đã có"], ["Report a missing key", "Báo missing key"]]),
      lane("Invariant", "Invariant", [["Keys are unique", "Key là unique"], ["Values may repeat", "Value có thể trùng"], ["Key is not an array index", "Key không phải array index"], ["Representation is selected explicitly", "Representation được chọn rõ"]]),
    ],
    focus: [L("Identify the key before the value.", "Xác định key trước value."), L("Distinguish insert from update.", "Phân biệt insert với update."), L("Do not assume hashing unless the task specifies it.", "Không giả định hashing nếu đề không nêu.")],
  },
  "adt-implementation": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.465-489: ADT interfaces and representations", "Sách Chương 19, trang in 465-489: interface và representation của ADT"),
    lanes: [
      lane("External contract", "Contract bên ngoài", [["Name the ADT operation", "Gọi tên thao tác ADT"], ["State observable result", "Nêu kết quả quan sát được"], ["Preserve interface behavior", "Giữ behavior của interface"]]),
      lane("Internal mapping", "Ánh xạ bên trong", [["Choose built-in type or ADT", "Chọn built-in type hoặc ADT"], ["Map to internal operations", "Ánh xạ sang thao tác nội bộ"], ["Maintain representation invariant", "Giữ representation invariant"], ["State edge case and cost", "Nêu edge case và cost"]]),
    ],
    focus: [L("Separate what a user requests from how it is stored.", "Tách yêu cầu bên ngoài khỏi cách lưu bên trong."), L("Trace every internal operation in order.", "Trace từng thao tác nội bộ theo thứ tự."), L("Check that observable behavior is unchanged.", "Kiểm tra behavior quan sát được không đổi.")],
  },
  "complexity-comparator": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.489-491: time, space and Big O", "Sách Chương 19, trang in 489-491: time, space và Big O"),
    lanes: [
      lane("Define the comparison", "Xác định phép so sánh", [["Same task", "Cùng task"], ["Input size n", "Input size n"], ["Same assumptions", "Cùng assumptions"], ["Choose time or extra space", "Chọn time hoặc extra space"]]),
      lane("Interpret growth", "Diễn giải growth", [["Count reviewed operations", "Đếm thao tác đã duyệt"], ["Compare several n values", "So sánh nhiều giá trị n"], ["Name Big O class", "Gọi tên Big O"], ["Separate exact count from class", "Tách exact count khỏi class"]]),
    ],
    focus: [L("State n and the measured operation.", "Nêu n và thao tác được đo."), L("Compare algorithms that solve the same task.", "So sánh algorithm giải cùng task."), L("Do not describe Big O as seconds.", "Không mô tả Big O là số giây.")],
  },
  "recursion-trace": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.491-494: recursive algorithms", "Sách Chương 19, trang in 491-494: thuật toán đệ quy"),
    lanes: [
      lane("Wind", "Wind", [["Enter call with argument", "Vào call với argument"], ["Test base case", "Kiểm tra base case"], ["Reduce the subproblem", "Thu nhỏ subproblem"], ["Call again", "Call lại"]]),
      lane("Return", "Return", [["Base returns first value", "Base trả giá trị đầu"], ["Caller receives child result", "Caller nhận child result"], ["Combine and return", "Combine rồi return"], ["Reach final result", "Tới kết quả cuối"]]),
    ],
    focus: [L("Prove that the base case is reachable.", "Chứng minh base case reachable."), L("Write call order before return order.", "Ghi call order trước return order."), L("Block a recursive case that does not make progress.", "Chặn recursive case không tạo progress.")],
  },
  "call-stack-unwinding": {
    section: "19",
    reference: L("Coursebook Chapter 19, printed pp.491 and 494: call frames and unwinding", "Sách Chương 19, trang in 491 và 494: call frame và unwinding"),
    lanes: [
      lane("Push separate frames", "Push các frame riêng", [["Function and argument", "Function và argument"], ["Local variables", "Local variable"], ["Resume point", "Resume point"], ["Top frame is active", "Top frame đang active"]]),
      lane("Unwind LIFO", "Unwind LIFO", [["Base frame returns", "Base frame return"], ["Pop the top frame", "Pop top frame"], ["Pass result to caller", "Truyền result cho caller"], ["Resume and combine", "Resume rồi combine"]]),
    ],
    focus: [L("Give each invocation its own frame.", "Cho mỗi invocation một frame riêng."), L("Keep call tree, stack and output expression distinct.", "Giữ call tree, stack và output expression tách biệt."), L("Check that unwind order reverses call order.", "Kiểm tra unwind order ngược call order.")],
  },
};

export function CambridgeVisualPrimer({ kind, locale }: { readonly kind: VisualKind; readonly locale: Locale }) {
  const guide = guides[kind];
  if (!guide) return null;

  return <details className={styles.primer} data-cambridge-primer={kind}>
    <summary className={styles.summary}>
      <span className={styles.summaryTitle}><BookOpen size={19} aria-hidden="true" /><span id={`visual-primer-${kind}`}>{locale === "vi" ? "Mở sơ đồ khái niệm và giới hạn mô hình" : "Open the concept map and model boundaries"}</span></span>
      <span className={styles.sectionBadge}>Cambridge 9618 · Section {guide.section}</span>
    </summary>
    <div className={styles.primerContent} aria-labelledby={`visual-primer-${kind}`}>
    <header className={styles.header}>
      <p>{guide.reference[locale]} · {locale === "vi" ? "AlgoCore dựng lại theo khái niệm, không sao chép hình sách." : "Concept-aligned AlgoCore redraw; it is not a copy of the book artwork."}</p>
      {guide.modelBoundary && <p><strong>{locale === "vi" ? "Giới hạn mô hình: " : "Model boundary: "}</strong>{guide.modelBoundary[locale]}</p>}
    </header>

    <figure className={styles.diagram} aria-label={locale === "vi" ? "Sơ đồ khái niệm cần đọc trước mô phỏng" : "Concept diagram to read before the simulation"}>
      {guide.lanes.map((item, laneIndex) => <div className={styles.lane} key={laneIndex}>
        <figcaption>{item.title[locale]}</figcaption>
        <div className={styles.rail}>
          {item.nodes.map((node, index) => <div className={styles.railItem} key={index}>
            <span className={styles.node}>{node[locale]}</span>
            {index < item.nodes.length - 1 && <ArrowRight className={styles.arrow} size={18} aria-hidden="true" />}
          </div>)}
        </div>
      </div>)}
    </figure>

    <div className={styles.readingSteps}>
      <div><Eye size={18} aria-hidden="true" /><span><b>1</b>{guide.focus[0][locale]}</span></div>
      <div><MousePointerClick size={18} aria-hidden="true" /><span><b>2</b>{guide.focus[1][locale]}</span></div>
      <div><ArrowRight size={18} aria-hidden="true" /><span><b>3</b>{guide.focus[2][locale]}</span></div>
    </div>

    {guide.correction && <aside className={styles.correction}><strong>{locale === "vi" ? "Ghi chú đối chiếu sách" : "Coursebook cross-check"}</strong><p>{guide.correction[locale]}</p></aside>}
    </div>
  </details>;
}
