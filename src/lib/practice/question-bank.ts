import "server-only";
import type { ProtectedQuestion, PublicQuestion } from "@/types/practice";
import { ocrGcseQuestionBank } from "@/lib/practice/ocr-gcse-question-bank";
import { aqaGcseQuestionBank } from "@/lib/practice/aqa-gcse-question-bank";
import { ocrALevelQuestionBank } from "@/lib/practice/ocr-a-level-question-bank";

const legacyQuestionBank: ProtectedQuestion[] = [
  {
    id: "60000000-0000-0000-0000-000000000001", topicSlug: "systems-architecture", topicTitle: "Systems architecture", type: "multiple_choice", difficulty: "foundation", marks: 1, estimatedSeconds: 45,
    prompt: "Which CPU component performs arithmetic calculations and logical comparisons?",
    options: [{ id: "cu", label: "Control unit" }, { id: "alu", label: "Arithmetic logic unit" }, { id: "cache", label: "Cache" }, { id: "pc", label: "Program counter" }],
    rule: { kind: "exact", acceptable: ["alu"] }, correctAnswer: "Arithmetic logic unit (ALU)",
    explanation: "The ALU carries out calculations and logical operations. The control unit coordinates the processor.", commonMistake: "Do not confuse coordinating an operation with performing its calculation.", lessonHref: "/learn/systems-architecture/inside-the-cpu",
  },
  {
    id: "60000000-0000-0000-0000-000000000002", topicSlug: "memory-and-storage", topicTitle: "Memory and storage", type: "multiple_select", difficulty: "developing", marks: 2, estimatedSeconds: 70,
    prompt: "Select the two characteristics that normally make solid-state storage suitable for a portable computer.",
    options: [{ id: "moving", label: "It contains several moving parts" }, { id: "durable", label: "It is resistant to knocks" }, { id: "lowpower", label: "It usually uses relatively little power" }, { id: "cheapest", label: "It is always the cheapest per gigabyte" }],
    rule: { kind: "set", correct: ["durable", "lowpower"], partialCredit: true }, correctAnswer: "Resistant to knocks; relatively low power use",
    explanation: "Solid-state storage has no moving parts, making it durable, and commonly uses less power than a magnetic hard disk.", commonMistake: "Solid-state storage is not guaranteed to be the cheapest option per gigabyte.", lessonHref: "/learn/memory-and-storage/secondary-storage",
  },
  {
    id: "60000000-0000-0000-0000-000000000003", topicSlug: "memory-and-storage", topicTitle: "Memory and storage", type: "boolean", difficulty: "foundation", marks: 1, estimatedSeconds: 35,
    prompt: "True or false: ROM loses its contents when the computer is switched off.",
    options: [{ id: "true", label: "True" }, { id: "false", label: "False" }], rule: { kind: "boolean", correct: false }, correctAnswer: "False",
    explanation: "ROM is non-volatile, so its contents remain without power.", commonMistake: "RAM is volatile; ROM is non-volatile.", lessonHref: "/learn/memory-and-storage/ram-rom-and-virtual-memory",
  },
  {
    id: "60000000-0000-0000-0000-000000000004", topicSlug: "networks-and-protocols", topicTitle: "Networks and protocols", type: "fill_blank", difficulty: "foundation", marks: 1, estimatedSeconds: 45,
    prompt: "Complete the sentence: The protocol that resolves a domain name to an IP address is ____.", rule: { kind: "exact", acceptable: ["DNS", "domain name system"] }, correctAnswer: "DNS (Domain Name System)",
    explanation: "DNS looks up the IP address associated with a human-readable domain name.", commonMistake: "HTTP transfers web content; it does not perform the name lookup.", lessonHref: "/learn/networks-and-protocols/packets-and-protocols",
  },
  {
    id: "60000000-0000-0000-0000-000000000005", topicSlug: "memory-and-storage", topicTitle: "Memory and storage", type: "short_answer", difficulty: "secure", marks: 2, estimatedSeconds: 100,
    prompt: "Explain why using virtual memory can make a computer run more slowly.", rule: { kind: "rubric", points: [
      { id: "secondary", description: "Virtual memory uses secondary storage", patterns: ["secondary storage", "hard drive", "hard disk", "ssd", "storage drive"] },
      { id: "slower", description: "Secondary storage is slower than RAM or swapping creates extra transfers", patterns: ["slower than ram", "takes longer", "slow access", "moving data", "transfer between", "swapping"] },
    ] }, correctAnswer: "Virtual memory uses slower secondary storage and requires data to be moved between storage and RAM.", modelAnswer: "Virtual memory stores inactive pages on secondary storage. Accessing that storage and swapping pages is slower than accessing RAM, so programs can take longer to respond.",
    explanation: "Both where virtual memory is stored and why that is slower are needed for two marks.", commonMistake: "Saying only that the computer has run out of RAM does not explain the slowdown.", lessonHref: "/learn/memory-and-storage/ram-rom-and-virtual-memory",
  },
  {
    id: "60000000-0000-0000-0000-000000000006", topicSlug: "systems-architecture", topicTitle: "Systems architecture", type: "extended_answer", difficulty: "advanced", marks: 4, estimatedSeconds: 240,
    prompt: "A student wants a computer for video editing. Explain how clock speed, number of cores and cache size may affect CPU performance, and why the figures do not guarantee performance. [4 marks]",
    rule: { kind: "rubric", points: [
      { id: "clock", description: "Higher clock speed means more cycles or instructions can be processed per second", patterns: ["more cycles", "cycles per second", "instructions per second", "faster clock"] },
      { id: "cores", description: "More cores allow suitable tasks to be processed in parallel", patterns: ["parallel", "simultaneous", "same time", "split tasks", "multiple tasks"] },
      { id: "cache", description: "Larger cache reduces the need to access slower main memory", patterns: ["less ram access", "reduce memory access", "faster than ram", "frequently used", "close to cpu"] },
      { id: "context", description: "Performance also depends on software or processor architecture", patterns: ["depends on software", "software support", "processor architecture", "cpu architecture", "program"] },
    ], contradictions: [{ patterns: ["more cores always", "clock speed always"], feedback: "Avoid absolute claims: software must be able to use the hardware effectively." }] },
    correctAnswer: "A balanced explanation covering clock speed, parallel cores, cache and software/architecture.", modelAnswer: "A higher clock speed can complete more cycles each second. More cores can process video tasks in parallel when the editing software supports this. A larger cache keeps frequently used data close to the CPU, reducing slower RAM access. However, processor architecture and how well the software uses multiple cores also affect real performance.",
    explanation: "Each distinct, correctly explained factor earns one mark. Repeating the same performance claim does not earn another mark.", commonMistake: "Specifications are not guarantees; avoid saying one larger number always makes every program faster.", lessonHref: "/learn/systems-architecture/inside-the-cpu",
  },
  {
    id: "60000000-0000-0000-0000-000000000007", topicSlug: "systems-architecture", topicTitle: "Systems architecture", type: "ordering", difficulty: "developing", marks: 2, estimatedSeconds: 75,
    prompt: "Put the main stages of the processor cycle into the correct order.", items: [{ id: "execute", label: "Execute" }, { id: "fetch", label: "Fetch" }, { id: "decode", label: "Decode" }],
    rule: { kind: "ordering", correct: ["fetch", "decode", "execute"] }, correctAnswer: "Fetch → Decode → Execute",
    explanation: "The CPU fetches an instruction, decodes its meaning, then executes it.", commonMistake: "Decoding must happen before the CPU can carry out the instruction.", lessonHref: "/learn/systems-architecture/fetch-decode-execute",
  },
  {
    id: "60000000-0000-0000-0000-000000000008", topicSlug: "systems-architecture", topicTitle: "Systems architecture", type: "code_trace", difficulty: "secure", marks: 2, estimatedSeconds: 100,
    prompt: "What value is output by this pseudocode?",
    code: "total ← 1\nFOR count ← 1 TO 3\n    total ← total * 2\nNEXT count\nOUTPUT total",
    rule: { kind: "exact", acceptable: ["8", "8.0"] }, correctAnswer: "8",
    explanation: "The loop doubles total three times: 1 → 2 → 4 → 8.", commonMistake: "The initial value is doubled once during each of the three iterations.", lessonHref: "/learn/systems-architecture/fetch-decode-execute",
  },
  {
    id: "60000000-0000-0000-0000-000000000009", topicSlug: "memory-and-storage", topicTitle: "Memory and storage", type: "numerical", difficulty: "secure", marks: 2, estimatedSeconds: 100,
    prompt: "A file is 4 KiB. Calculate its size in bits. Use 1 KiB = 1024 bytes.", rule: { kind: "numeric", correct: 32768, tolerance: 0, unit: "bits" }, correctAnswer: "32,768 bits",
    explanation: "4 × 1024 gives 4096 bytes. Each byte contains 8 bits, so 4096 × 8 = 32,768 bits.", commonMistake: "Do not stop after converting KiB to bytes; the question asks for bits.", lessonHref: "/learn/memory-and-storage/secondary-storage",
  },
  {
    id: "60000000-0000-0000-0000-000000000010", topicSlug: "networks-and-protocols", topicTitle: "Networks and protocols", type: "matching", difficulty: "developing", marks: 3, estimatedSeconds: 100,
    prompt: "Match each protocol to its main role.", items: [{ id: "dns", label: "DNS" }, { id: "http", label: "HTTP" }, { id: "tcp", label: "TCP" }],
    targets: [{ id: "names", label: "Resolves domain names" }, { id: "web", label: "Transfers web content" }, { id: "reliable", label: "Provides reliable, ordered delivery" }],
    rule: { kind: "matching", correct: { dns: "names", http: "web", tcp: "reliable" } }, correctAnswer: "DNS → names; HTTP → web content; TCP → reliable ordered delivery",
    explanation: "These protocols cooperate in a network stack but solve different communication problems.", commonMistake: "TCP supports reliable delivery; IP handles addressing and routing.", lessonHref: "/learn/networks-and-protocols/packets-and-protocols",
  },
];

void legacyQuestionBank;

export const questionBank = [...ocrGcseQuestionBank, ...aqaGcseQuestionBank, ...ocrALevelQuestionBank];

export function questionBankForCourse(courseId: string) {
  if (courseId === "10000000-0000-0000-0000-000000000002") return aqaGcseQuestionBank;
  if (courseId === "10000000-0000-0000-0000-000000000003") return ocrALevelQuestionBank;
  return ocrGcseQuestionBank;
}

export function publicQuestions(questions = questionBank): PublicQuestion[] {
  return questions.map((question) => ({ id: question.id, topicSlug: question.topicSlug, topicTitle: question.topicTitle, type: question.type, difficulty: question.difficulty, prompt: question.prompt, marks: question.marks, estimatedSeconds: question.estimatedSeconds, options: question.options, items: question.items, targets: question.targets, code: question.code, hint: question.hint, lessonHref: question.lessonHref }));
}

export function findProtectedQuestion(id: string) { return questionBank.find((question) => question.id === id); }
