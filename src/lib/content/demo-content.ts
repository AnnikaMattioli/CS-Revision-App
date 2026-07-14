import type { CourseContent } from "@/types/content";

export const demoCourse: CourseContent = {
  id: "10000000-0000-0000-0000-000000000001",
  slug: "ocr-gcse-computer-science",
  title: "OCR GCSE Computer Science",
  description: "A representative learning path covering core computer systems and computational thinking. This is original sample content, not a complete specification.",
  qualification: "GCSE",
  examBoard: "OCR",
  topics: [
    {
      id: "20000000-0000-0000-0000-000000000001",
      slug: "systems-architecture",
      code: "1.1",
      title: "Systems architecture",
      description: "Discover how the CPU carries out instructions and how its components work together.",
      icon: "🧩",
      colour: "var(--violet)",
      estimatedMinutes: 35,
      learningObjectives: [
        "Describe the purpose of the CPU and its main components",
        "Explain the fetch–decode–execute cycle",
        "Compare factors that affect CPU performance",
      ],
      mastery: 72,
      subtopicTitle: "The central processing unit",
      lessons: [
        {
          id: "30000000-0000-0000-0000-000000000001",
          slug: "inside-the-cpu",
          title: "Inside the CPU",
          summary: "Meet the control unit, ALU, cache and registers.",
          estimatedMinutes: 9,
          sections: [
            {
              id: "cpu-1",
              heading: "The computer's instruction engine",
              body: [
                "The central processing unit (CPU) executes the instructions that make programs work. It repeatedly collects an instruction, works out what it means and carries it out.",
                "A CPU is made from several specialised components. Each has a clear job, but they cooperate at very high speed.",
              ],
              callout: { type: "definition", title: "CPU", text: "The component that processes data and executes program instructions." },
            },
            {
              id: "cpu-2",
              heading: "Control unit and ALU",
              body: [
                "The control unit coordinates the CPU. It sends control signals, manages the flow of data and decodes each instruction.",
                "The arithmetic logic unit (ALU) performs calculations such as addition and logical comparisons such as greater than, equal to and AND.",
              ],
              callout: { type: "tip", title: "Keep the jobs distinct", text: "The control unit organises; the ALU calculates and compares." },
            },
            {
              id: "cpu-3",
              heading: "Registers and cache",
              body: [
                "Registers are tiny, extremely fast storage locations inside the CPU. Named registers hold the current instruction, its address and intermediate data.",
                "Cache stores frequently used instructions and data close to the CPU. Accessing cache is faster than fetching the same data from main memory.",
              ],
            },
          ],
        },
        {
          id: "30000000-0000-0000-0000-000000000002",
          slug: "fetch-decode-execute",
          title: "Fetch, decode, execute",
          summary: "Follow one instruction through the processor cycle.",
          estimatedMinutes: 11,
          sections: [
            {
              id: "fde-1",
              heading: "1. Fetch",
              body: [
                "The program counter (PC) stores the address of the next instruction. That address is copied to the memory address register (MAR).",
                "The instruction at that address is copied from memory into the memory data register (MDR), then into the current instruction register (CIR). The PC is incremented ready for the next cycle.",
              ],
            },
            {
              id: "fde-2",
              heading: "2. Decode",
              body: ["The control unit interprets the instruction in the CIR. It identifies the operation and any data or address that the operation needs."],
            },
            {
              id: "fde-3",
              heading: "3. Execute",
              body: ["The instruction is carried out. This might involve an ALU calculation, moving data, testing a condition or changing the program counter."],
              callout: { type: "warning", title: "Common mix-up", text: "The cycle processes instructions, not entire programs in one go." },
            },
          ],
        },
      ],
      flashcards: [
        { id: "40000000-0000-0000-0000-000000000001", front: "What does the control unit do?", back: "It coordinates CPU operations, decodes instructions and sends control signals.", hint: "Think organisation, not calculation." },
        { id: "40000000-0000-0000-0000-000000000002", front: "Which register holds the address of the next instruction?", back: "The program counter (PC)." },
        { id: "40000000-0000-0000-0000-000000000003", front: "Why can cache improve performance?", back: "It keeps frequently used data and instructions close to the CPU, so they can be accessed faster than main memory." },
      ],
      workedSolutions: [
        {
          id: "50000000-0000-0000-0000-000000000001",
          slug: "comparing-cpu-performance",
          title: "Comparing CPU performance",
          prompt: "Computer A has four 2.8 GHz cores and 4 MB of cache. Computer B has two 3.2 GHz cores and 12 MB of cache. Explain why the specifications alone do not prove which computer will run every program faster. [4 marks]",
          topicSlug: "systems-architecture",
          topicTitle: "Systems architecture",
          steps: [
            { title: "Identify relevant factors", explanation: "Clock speed, core count and cache size can all affect performance.", working: "A: more cores · B: faster clock + larger cache" },
            { title: "Explain the trade-off", explanation: "More cores help software that can divide work into parallel tasks. A higher clock speed can mean more cycles per second, while a larger cache can reduce slower memory accesses." },
            { title: "Add the missing context", explanation: "Programs use hardware differently. Performance also depends on processor design, the instructions being executed and whether the software supports multiple cores." },
          ],
          finalAnswer: "Computer A may perform better on programs that split work across four cores. Computer B completes more clock cycles per second and its larger cache may reduce main-memory access. However, programs use cores and cache differently, and processor architecture also matters, so these figures cannot prove one computer is always faster.",
        },
      ],
    },
    {
      id: "20000000-0000-0000-0000-000000000002",
      slug: "memory-and-storage",
      code: "1.2",
      title: "Memory and storage",
      description: "Compare primary memory, secondary storage and the units used to measure data.",
      icon: "💾",
      colour: "var(--blue)",
      estimatedMinutes: 42,
      learningObjectives: [
        "Compare RAM and ROM",
        "Explain why virtual memory is used",
        "Select suitable storage for a given situation",
      ],
      mastery: 54,
      subtopicTitle: "Memory and secondary storage",
      lessons: [
        {
          id: "30000000-0000-0000-0000-000000000003",
          slug: "ram-rom-and-virtual-memory",
          title: "RAM, ROM and virtual memory",
          summary: "Understand the different roles of primary memory.",
          estimatedMinutes: 12,
          sections: [
            { id: "mem-1", heading: "RAM", body: ["Random access memory stores programs and data that are currently in use. It is volatile: its contents are lost when power is removed.", "More RAM lets a computer keep more active programs and data available without relying as heavily on slower secondary storage."], callout: { type: "definition", title: "Volatile", text: "Data is lost when the power is switched off." } },
            { id: "mem-2", heading: "ROM", body: ["Read-only memory is non-volatile. It commonly stores startup instructions or firmware that must remain available when the device is switched off.", "Despite its name, some modern forms of ROM can be updated using a controlled process." ] },
            { id: "mem-3", heading: "Virtual memory", body: ["When RAM is full, the operating system can use part of secondary storage as virtual memory. Inactive pages are moved out of RAM to create space.", "Secondary storage is much slower than RAM, so excessive virtual-memory use can make a system feel unresponsive."], callout: { type: "warning", title: "Not extra RAM", text: "Virtual memory provides extra capacity, but not RAM-level speed." } },
          ],
        },
        {
          id: "30000000-0000-0000-0000-000000000004",
          slug: "secondary-storage",
          title: "Secondary storage",
          summary: "Choose between magnetic, optical and solid-state storage.",
          estimatedMinutes: 13,
          sections: [
            { id: "store-1", heading: "Why secondary storage?", body: ["Secondary storage keeps programs and files when power is removed. It normally offers much greater capacity than primary memory at a lower cost per gigabyte." ] },
            { id: "store-2", heading: "Three technologies", body: ["Magnetic storage, such as a hard disk, offers high capacity at low cost but contains moving parts.", "Optical discs are portable and useful for distribution or archiving, but have lower capacity and slower access.", "Solid-state storage has no moving parts, is fast, quiet and durable, but can cost more per gigabyte." ] },
            { id: "store-3", heading: "Making a justified choice", body: ["A strong recommendation connects the situation to several characteristics: capacity, speed, portability, durability, reliability and cost.", "Avoid saying one technology is simply 'best'. The best choice depends on the user's needs."], callout: { type: "tip", title: "Exam technique", text: "Name the requirement, name the feature, then explain the connection." } },
          ],
        },
      ],
      flashcards: [
        { id: "40000000-0000-0000-0000-000000000004", front: "What is the key difference between RAM and ROM?", back: "RAM is volatile working memory; ROM is non-volatile and stores instructions that should persist." },
        { id: "40000000-0000-0000-0000-000000000005", front: "Why does heavy virtual-memory use slow a computer?", back: "It moves pages between RAM and slower secondary storage, creating extra read/write activity." },
        { id: "40000000-0000-0000-0000-000000000006", front: "Give two advantages of solid-state storage.", back: "Any two of: fast access, no moving parts, quiet, low power use, lightweight or durable." },
      ],
      workedSolutions: [
        {
          id: "50000000-0000-0000-0000-000000000002", slug: "choosing-portable-storage", title: "Choosing portable storage",
          prompt: "A wildlife photographer needs storage for thousands of large images while working outdoors. Recommend a storage technology and justify your choice. [3 marks]",
          topicSlug: "memory-and-storage", topicTitle: "Memory and storage",
          steps: [
            { title: "Extract the needs", explanation: "The device needs high capacity for large files and durability for outdoor use." },
            { title: "Choose a technology", explanation: "Solid-state storage is a suitable choice because it is available in high capacities and has no fragile moving parts." },
            { title: "Link features to context", explanation: "Explain why each feature matters to this photographer rather than listing generic advantages." },
          ],
          finalAnswer: "Use a high-capacity solid-state drive. It can store thousands of large image files and has no moving parts, making it more resistant to knocks while the photographer works outdoors. Its fast transfer speed also helps when saving or reviewing many large photographs.",
        },
      ],
    },
    {
      id: "20000000-0000-0000-0000-000000000003",
      slug: "networks-and-protocols",
      code: "1.3",
      title: "Networks and protocols",
      description: "Explore network types, topologies, packet switching and the rules that keep communication reliable.",
      icon: "🌐",
      colour: "var(--teal)",
      estimatedMinutes: 38,
      learningObjectives: ["Distinguish LANs and WANs", "Describe packet switching", "Explain the roles of common protocols"],
      mastery: 34,
      subtopicTitle: "Connections and communication",
      lessons: [
        {
          id: "30000000-0000-0000-0000-000000000005", slug: "network-foundations", title: "Network foundations", summary: "Connect devices, compare network scales and understand topologies.", estimatedMinutes: 10,
          sections: [
            { id: "net-1", heading: "LANs and WANs", body: ["A local area network covers a small geographical area and is usually owned or managed by one organisation. A wide area network connects networks across a larger area and often uses infrastructure owned by telecommunications providers."], callout: { type: "definition", title: "Network", text: "Two or more connected devices that can communicate and share resources." } },
            { id: "net-2", heading: "Wired and wireless", body: ["Ethernet connections are typically reliable, secure and fast. Wireless connections provide mobility and are easier to extend, but signal strength and interference affect performance." ] },
            { id: "net-3", heading: "Star topology", body: ["In a star network, each device has its own connection to a central switch. One failed cable normally affects only one device, but a failed central switch can disrupt the whole network." ] },
          ],
        },
        {
          id: "30000000-0000-0000-0000-000000000006", slug: "packets-and-protocols", title: "Packets and protocols", summary: "See how data crosses a network and arrives in the right form.", estimatedMinutes: 12,
          sections: [
            { id: "protocol-1", heading: "Packet switching", body: ["Large messages are divided into packets. Each packet contains payload data plus control information such as source, destination and sequence number.", "Packets may take different routes. The receiver reorders them and can request missing data." ] },
            { id: "protocol-2", heading: "Why protocols matter", body: ["A protocol is an agreed set of rules for communication. Without shared rules, devices would disagree about the meaning, order or format of data."], callout: { type: "definition", title: "Protocol", text: "A standard set of rules that devices follow when communicating." } },
            { id: "protocol-3", heading: "Common examples", body: ["TCP checks reliable delivery and ordering. IP handles addressing and routing. HTTP and HTTPS transfer web content, while HTTPS adds encryption and authentication. DNS converts domain names into IP addresses."], callout: { type: "tip", title: "TCP/IP is a suite", text: "TCP and IP cooperate but have different responsibilities." } },
          ],
        },
      ],
      flashcards: [
        { id: "40000000-0000-0000-0000-000000000007", front: "What is stored in a packet header?", back: "Control data such as source and destination addresses, a sequence number and error-checking information." },
        { id: "40000000-0000-0000-0000-000000000008", front: "What is the role of DNS?", back: "It resolves human-readable domain names to IP addresses." },
        { id: "40000000-0000-0000-0000-000000000009", front: "How does HTTPS differ from HTTP?", back: "HTTPS encrypts the connection and authenticates the server using TLS." },
      ],
      workedSolutions: [
        {
          id: "50000000-0000-0000-0000-000000000003", slug: "explaining-packet-switching", title: "Explaining packet switching",
          prompt: "Explain how a large file is transferred across the internet using packet switching. [4 marks]", topicSlug: "networks-and-protocols", topicTitle: "Networks and protocols",
          steps: [
            { title: "Start with division", explanation: "The file is divided into smaller packets. Each receives a header containing addressing and ordering data." },
            { title: "Describe the journey", explanation: "Routers forward packets towards the destination. Packets may travel along different routes depending on availability." },
            { title: "Finish at the receiver", explanation: "Sequence numbers let the receiver restore the correct order. Missing or corrupt packets can be requested again." },
          ],
          finalAnswer: "The file is split into packets, each with destination and sequence information in its header. Routers forward the packets, and different packets may take different available routes. At the destination, sequence numbers are used to reassemble the file in the correct order. Missing or damaged packets are retransmitted.",
        },
      ],
    },
  ],
};

export function findTopic(slug: string) {
  return demoCourse.topics.find((topic) => topic.slug === slug);
}

export function findLesson(topicSlug: string, lessonSlug: string) {
  return findTopic(topicSlug)?.lessons.find((lesson) => lesson.slug === lessonSlug);
}

export function allWorkedSolutions() {
  return demoCourse.topics.flatMap((topic) => topic.workedSolutions);
}
