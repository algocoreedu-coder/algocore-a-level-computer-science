import Link from "next/link";
import { ArrowUpRight, Braces, Cpu, MemoryStick } from "lucide-react";
import type { Locale } from "@/app/lib/paper3/catalog";
import { paper3Href } from "./shared";
import styles from "./ChapterAdvancedOverview.module.css";

const branches = [
  { icon: Cpu, title: { en: "Control shared resources", vi: "Điều phối tài nguyên dùng chung" }, question: { en: "Which process runs, waits or moves when an event occurs?", vi: "Tiến trình nào chạy, chờ hoặc chuyển trạng thái khi có sự kiện?" }, topics: [
    ["resources-processes-and-states", "Model process states", "Mô hình hóa trạng thái tiến trình"], ["scheduling-choices", "Compare scheduling choices", "So sánh các cách lập lịch"], ["kernel-interrupts-and-scheduling", "Connect interrupts to the kernel", "Nối ngắt với hoạt động của kernel"], ["paging-segmentation-and-virtual-memory", "Map logical to physical memory", "Ánh xạ bộ nhớ logic sang vật lý"], ["replacement-and-thrashing", "Diagnose replacement and thrashing", "Chẩn đoán thay trang và thrashing"],
  ] },
  { icon: Braces, title: { en: "Translate source into action", vi: "Dịch mã nguồn thành hành động" }, question: { en: "How does source text become a valid executable sequence?", vi: "Văn bản nguồn trở thành chuỗi thực thi hợp lệ như thế nào?" }, topics: [
    ["interpreter-versus-compiler", "Choose interpreter or compiler", "Chọn interpreter hay compiler"], ["compilation-stages", "Trace each compilation stage", "Theo dõi từng giai đoạn biên dịch"], ["bnf-and-syntax-diagrams", "Validate syntax with grammar", "Kiểm tra cú pháp bằng văn phạm"], ["rpn-and-the-stack", "Evaluate RPN with a stack", "Tính RPN bằng stack"],
  ] },
] as const;

export function Chapter16Overview({ locale }: { readonly locale: Locale }) {
  const vi = locale === "vi";
  return <section className={styles.overview} aria-labelledby="chapter16-overview-title">
    <div className={styles.heading}><div><span>{vi ? "LỘ TRÌNH ÔN THI" : "EXAM LEARNING ROUTE"}</span><h2 id="chapter16-overview-title">{vi ? "Ai kiểm soát máy tính, và chương trình được chuẩn bị để chạy ra sao?" : "Who controls the machine, and how is a program prepared to run?"}</h2></div><p>{vi ? "Đi theo state thay vì học thuộc danh sách: xác định tài nguyên và sự kiện, theo dõi state thay đổi, rồi giải thích quyết định của hệ điều hành hoặc translator bằng đúng thuật ngữ." : "Follow state instead of memorising lists: identify the resource and event, trace the state change, then explain the operating-system or translator decision using precise terms."}</p></div>
    <div className={styles.branches} data-count={branches.length}>{branches.map((branch) => <article className={styles.branch} key={branch.title.en}><header><div><branch.icon size={22} aria-hidden="true" /><span>{vi ? "NHÁNH TƯ DUY" : "THINKING BRANCH"}</span></div><h3>{branch.title[locale]}</h3><p>{branch.question[locale]}</p></header><ol className={styles.route}>{branch.topics.map(([slug,en,viTitle], index) => <li key={slug}><Link href={paper3Href(`/paper-3/topics/${slug}`, locale)}><span className={styles.step}>{index + 1}</span><strong>{vi ? viTitle : en}</strong><ArrowUpRight size={16} aria-hidden="true" /></Link></li>)}</ol></article>)}</div>
    <aside className={styles.prerequisite}><MemoryStick size={22} aria-hidden="true" /><div><strong>{vi ? "Kiến thức cần gọi lại" : "Prerequisite checkpoint"}</strong><p>{vi ? "Nhớ vai trò CPU, RAM, secondary storage, interrupt và stack. Khi trả lời, luôn nêu trigger → state/translation action → consequence." : "Recall CPU, RAM, secondary storage, interrupts and stacks. In an exam answer, connect trigger → state or translation action → consequence."}</p></div></aside>
  </section>;
}
