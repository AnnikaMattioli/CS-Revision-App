export type OcrFact = {
  question: string;
  answer: string;
  keywords: string[];
};

export type OcrUnit = {
  slug: string;
  title: string;
  summary: string;
  facts: OcrFact[];
};

export type OcrTopicBlueprint = {
  code: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  units: OcrUnit[];
};

const fact = (question: string, answer: string, keywords: string[]): OcrFact => ({ question, answer, keywords });

export const ocrGcseBlueprints: OcrTopicBlueprint[] = [
  {
    code: "1.1", slug: "systems-architecture", title: "Systems architecture", icon: "🧩",
    description: "The CPU, Von Neumann architecture, performance factors and embedded systems.",
    units: [
      { slug: "cpu-purpose-components", title: "CPU purpose and components", summary: "Understand the processor and the jobs performed by its core components.", facts: [
        fact("What is the purpose of the CPU?", "The CPU processes data and executes the instructions that make programs run.", ["processes data", "executes instructions"]),
        fact("What does the control unit do?", "The control unit coordinates CPU activity, decodes instructions and sends control signals.", ["coordinates", "decodes", "control signals"]),
        fact("What does the ALU do?", "The arithmetic logic unit performs arithmetic calculations and logical comparisons.", ["arithmetic", "logical"]),
        fact("What is a register?", "A register is a very small, very fast storage location inside the CPU.", ["small", "fast", "CPU"]),
        fact("Why does the CPU use cache?", "Cache stores frequently used data and instructions close to the CPU so they can be accessed faster than RAM.", ["frequently used", "faster", "RAM"]),
      ]},
      { slug: "fetch-decode-execute", title: "Fetch-decode-execute and registers", summary: "Follow an instruction through the processor cycle and identify every named register.", facts: [
        fact("What are the three main stages of the processor cycle?", "Fetch, decode and execute.", ["fetch", "decode", "execute"]),
        fact("What does the program counter store?", "The program counter stores the address of the next instruction to be fetched.", ["address", "next instruction"]),
        fact("What does the memory address register store?", "The MAR stores the address in memory currently being accessed.", ["address", "memory"]),
        fact("What does the memory data register store?", "The MDR stores data or an instruction being transferred to or from memory.", ["data", "instruction", "memory"]),
        fact("What does the accumulator store?", "The accumulator stores intermediate results produced by the ALU.", ["intermediate", "results", "ALU"]),
      ]},
      { slug: "cpu-performance", title: "CPU performance", summary: "Explain how clock speed, cache and cores influence performance without making absolute claims.", facts: [
        fact("How can a higher clock speed improve performance?", "It allows the CPU to complete more processing cycles each second.", ["cycles", "second"]),
        fact("How can more CPU cores improve performance?", "More cores can execute suitable tasks simultaneously when software supports parallel processing.", ["simultaneously", "parallel", "software"]),
        fact("How can a larger cache improve performance?", "It can reduce the time spent retrieving frequently used data and instructions from slower RAM.", ["frequently used", "slower RAM"]),
        fact("Why does a higher clock speed not guarantee a faster computer?", "Performance also depends on processor design, cores, cache and the instructions or software being used.", ["depends", "processor", "software"]),
        fact("Why might doubling the number of cores not double performance?", "Some programs cannot divide all of their work into tasks that run in parallel.", ["programs", "parallel"]),
      ]},
      { slug: "embedded-systems", title: "Embedded systems", summary: "Recognise computers built into larger devices and explain their characteristics.", facts: [
        fact("What is an embedded system?", "A computer system built into a larger device to perform a dedicated function.", ["larger device", "dedicated"]),
        fact("Give two common characteristics of embedded systems.", "They are designed for a specific task and often have limited processing power, memory or storage.", ["specific task", "limited"]),
        fact("Why are embedded systems often designed for low power use?", "Many operate continuously or from batteries, so lower power reduces energy use and extends battery life.", ["battery", "energy"]),
        fact("Give three examples of embedded systems.", "Examples include a washing-machine controller, car engine-management system and smart thermostat.", ["washing", "car", "thermostat"]),
        fact("Why can reliability be especially important in an embedded system?", "A failure may stop the larger device working or create a safety risk.", ["failure", "safety"]),
      ]},
    ],
  },
  {
    code: "1.2", slug: "memory-and-storage", title: "Memory and storage", icon: "💾",
    description: "Primary memory, secondary storage, units, binary data and compression.",
    units: [
      { slug: "primary-memory", title: "Primary memory", summary: "Compare RAM, ROM, cache and virtual memory.", facts: [
        fact("Why does a computer need primary memory?", "Primary memory holds instructions and data that the CPU needs while a program is running.", ["instructions", "data", "CPU"]),
        fact("What is RAM used for?", "RAM stores programs and data currently in use and is volatile.", ["currently", "volatile"]),
        fact("What is ROM used for?", "ROM stores non-volatile instructions such as firmware needed to start a device.", ["non-volatile", "firmware", "start"]),
        fact("How does RAM differ from ROM?", "RAM is volatile working memory that can be changed easily; ROM is non-volatile and normally stores fixed instructions.", ["volatile", "non-volatile"]),
        fact("What is virtual memory?", "Virtual memory is part of secondary storage used temporarily when RAM is full.", ["secondary storage", "RAM", "full"]),
      ]},
      { slug: "secondary-storage", title: "Secondary storage", summary: "Select optical, magnetic or solid-state storage for a scenario.", facts: [
        fact("Why is secondary storage needed?", "It stores programs and files when the power is off and usually provides high capacity.", ["power", "capacity"]),
        fact("How does magnetic storage work at GCSE level?", "It stores data by magnetising areas of a disk or tape.", ["magnetising", "disk", "tape"]),
        fact("How does optical storage work at GCSE level?", "A laser reads or writes patterns on the surface of an optical disc.", ["laser", "disc"]),
        fact("What are key advantages of solid-state storage?", "It is fast, quiet, durable, portable and uses relatively little power because it has no moving parts.", ["fast", "durable", "no moving parts"]),
        fact("Which factors should be compared when choosing storage?", "Capacity, speed, portability, durability, reliability and cost.", ["capacity", "speed", "cost"]),
      ]},
      { slug: "units-and-calculations", title: "Units and file-size calculations", summary: "Move between storage units and calculate text, image and sound file sizes.", facts: [
        fact("How many bits are in a nibble and a byte?", "A nibble contains 4 bits and a byte contains 8 bits.", ["4", "8"]),
        fact("State the OCR decimal storage-unit sequence.", "1 KB is 1,000 bytes; 1 MB is 1,000 KB; then GB, TB and PB, each 1,000 of the previous unit.", ["1,000", "KB", "MB"]),
        fact("How is uncompressed image file size calculated?", "Colour depth multiplied by image width in pixels multiplied by image height in pixels.", ["colour depth", "width", "height"]),
        fact("How is uncompressed sound file size calculated?", "Sample rate multiplied by duration in seconds multiplied by bit depth.", ["sample rate", "duration", "bit depth"]),
        fact("How is uncompressed text file size calculated?", "Bits per character multiplied by the number of characters.", ["bits per character", "characters"]),
      ]},
      { slug: "data-representation-compression", title: "Data representation and compression", summary: "Represent numbers, text, images and sound, then compare compression methods.", facts: [
        fact("How can an 8-bit value be converted between binary, denary and hexadecimal?", "Use place values to convert binary and denary, and split the byte into two 4-bit nibbles to convert each hexadecimal digit.", ["place values", "nibbles", "hexadecimal"]),
        fact("What does a left binary shift normally do to a positive integer?", "Each place shifted left multiplies the value by two, if overflow does not occur.", ["multiplies", "two", "overflow"]),
        fact("How are characters represented by a computer?", "A character set assigns each character a numeric binary code, such as ASCII or Unicode.", ["character set", "binary", "ASCII"]),
        fact("How are images and sound represented digitally?", "Images store binary pixel colours plus metadata; sound stores amplitude samples whose accuracy depends on sample rate and bit depth.", ["pixels", "metadata", "samples"]),
        fact("How do lossy and lossless compression differ?", "Lossy compression permanently removes some data; lossless compression recreates the original data exactly.", ["permanently", "original", "exactly"]),
      ]},
    ],
  },
  {
    code: "1.3", slug: "networks-and-protocols", title: "Computer networks, connections and protocols", icon: "🌐",
    description: "Network types, topologies, hardware, addressing, protocols and layers.",
    units: [
      { slug: "network-types", title: "Network types and performance", summary: "Compare LANs and WANs and explain the factors affecting network performance.", facts: [
        fact("What is a LAN?", "A local area network covers a small geographical area and is usually owned by one organisation.", ["small", "owned"]),
        fact("What is a WAN?", "A wide area network covers a large geographical area and often uses third-party infrastructure.", ["large", "third-party"]),
        fact("Give two benefits of networking computers.", "Users can share files, hardware, internet access and centralised services or backups.", ["share", "files"]),
        fact("Which factors affect network performance?", "Bandwidth, number of users, transmission medium, hardware and interference can affect performance.", ["bandwidth", "users", "interference"]),
        fact("What is bandwidth?", "Bandwidth is the maximum amount of data that can be transmitted in a given time.", ["maximum", "data", "time"]),
      ]},
      { slug: "topologies-and-models", title: "Topologies and network models", summary: "Explain star and mesh topologies and compare client-server with peer-to-peer.", facts: [
        fact("How is a star network arranged?", "Every device has its own connection to a central switch or hub.", ["central", "switch"]),
        fact("Give one advantage and one disadvantage of a star topology.", "A cable failure usually affects one device, but failure of the central device can stop the network.", ["one device", "central"]),
        fact("How is a mesh network arranged?", "Devices have multiple connections, providing more than one possible route for data.", ["multiple", "routes"]),
        fact("What is a client-server network?", "Clients request services or resources managed centrally by one or more servers.", ["clients", "central", "servers"]),
        fact("What is a peer-to-peer network?", "Devices communicate and share resources directly without a dedicated central server.", ["directly", "without", "server"]),
      ]},
      { slug: "connections-hardware", title: "Connections and network hardware", summary: "Understand wired, wireless and hardware components used to build networks.", facts: [
        fact("Compare wired and wireless connections.", "Wired links are often faster and more reliable; wireless links provide mobility but can suffer interference.", ["reliable", "mobility", "interference"]),
        fact("What does a network interface controller do?", "A NIC allows a device to connect to and communicate over a network.", ["connect", "network"]),
        fact("What does a switch do?", "A switch forwards frames to the intended device within a LAN using MAC addresses.", ["forwards", "LAN", "MAC"]),
        fact("What does a router do?", "A router forwards packets between different networks using IP addresses.", ["packets", "networks", "IP"]),
        fact("What does a wireless access point do?", "It allows wireless devices to connect to a wired network.", ["wireless", "wired network"]),
      ]},
      { slug: "protocols-and-layers", title: "Protocols, packets and layers", summary: "Explain addressing, packet switching and the roles of common protocols.", facts: [
        fact("Why are network protocols needed?", "Protocols provide agreed rules so different devices can exchange and interpret data correctly.", ["agreed rules", "devices"]),
        fact("What is packet switching?", "Data is split into addressed packets that may take different routes and are reassembled at the destination.", ["split", "routes", "reassembled"]),
        fact("What are the roles of TCP and IP?", "TCP supports reliable ordered delivery; IP provides addressing and routing between networks.", ["reliable", "addressing", "routing"]),
        fact("State the roles of HTTP, HTTPS, FTP, SMTP, POP, IMAP and DNS.", "They support web transfer, secure web transfer, file transfer, sending email, downloading email, synchronising email and domain-name lookup respectively.", ["web", "file", "email", "domain"]),
        fact("Why are network protocols organised into layers?", "Layers divide communication into manageable parts, support standards and allow a layer to change independently.", ["manageable", "standards", "independently"]),
      ]},
    ],
  },
  {
    code: "1.4", slug: "network-security", title: "Network security", icon: "🛡️",
    description: "Threats, vulnerabilities and the controls used to protect systems and networks.",
    units: [
      { slug: "malware-and-attacks", title: "Malware and technical attacks", summary: "Recognise common malware and network attacks.", facts: [
        fact("What is malware?", "Malware is software intentionally designed to damage, disrupt or gain unauthorised access to a system.", ["software", "damage", "unauthorised"]),
        fact("What does a computer virus do?", "A virus attaches to files or programs and replicates when the infected host is run.", ["attaches", "replicates"]),
        fact("What does a Trojan do?", "A Trojan disguises itself as legitimate software while performing a malicious action.", ["disguises", "malicious"]),
        fact("What is a denial-of-service attack?", "It overwhelms a service with traffic or requests so legitimate users cannot access it.", ["overwhelms", "legitimate"]),
        fact("What is a brute-force attack?", "An attacker repeatedly tries possible passwords or keys until one works.", ["repeatedly", "passwords"]),
      ]},
      { slug: "people-and-data-attacks", title: "Social engineering and data interception", summary: "Understand threats that exploit users or communications.", facts: [
        fact("What is social engineering?", "Manipulating a person into revealing information or carrying out an unsafe action.", ["manipulating", "person"]),
        fact("What is phishing?", "A fraudulent message tries to trick a user into revealing data or opening a malicious link or attachment.", ["fraudulent", "trick", "link"]),
        fact("What is shoulder surfing?", "Observing someone entering private information such as a password or PIN.", ["observing", "password"]),
        fact("What is data interception?", "Capturing data while it is travelling across a network.", ["capturing", "travelling"]),
        fact("What is SQL injection?", "Malicious SQL is entered into an input to read or change a poorly protected database.", ["SQL", "input", "database"]),
      ]},
      { slug: "prevention", title: "Preventing attacks", summary: "Select authentication, encryption, firewalls and physical controls for a scenario.", facts: [
        fact("How does a firewall protect a network?", "It monitors network traffic and blocks connections that break configured rules.", ["traffic", "blocks", "rules"]),
        fact("Why is encryption useful?", "Encryption turns plaintext into ciphertext so intercepted data is unreadable without the key.", ["plaintext", "ciphertext", "key"]),
        fact("What is two-factor authentication?", "It requires evidence from two different authentication categories, such as a password and a phone code.", ["two", "password", "code"]),
        fact("How do access levels improve security?", "Users receive only the permissions needed for their role, reducing unauthorised access and damage.", ["permissions", "role"]),
        fact("Why are software updates important for security?", "Updates can patch known vulnerabilities before attackers exploit them.", ["patch", "vulnerabilities"]),
      ]},
      { slug: "finding-vulnerabilities", title: "Finding vulnerabilities", summary: "Explain testing and monitoring used to identify weaknesses.", facts: [
        fact("What is penetration testing?", "Authorised testers attempt to find and exploit vulnerabilities so they can be fixed.", ["authorised", "vulnerabilities", "fixed"]),
        fact("What is network forensics?", "Collecting and analysing network activity to investigate an incident or attack.", ["collecting", "analysing", "network"]),
        fact("Why should organisations review user access regularly?", "Accounts and permissions may no longer be needed and could otherwise be misused.", ["accounts", "permissions", "misused"]),
        fact("How can user training reduce security risk?", "It helps users recognise threats and follow safe procedures instead of being manipulated.", ["recognise", "safe"]),
        fact("Why is security best provided by several controls?", "Defence in depth means another control may still protect the system if one control fails.", ["several", "fails"]),
      ]},
    ],
  },
  {
    code: "1.5", slug: "systems-software", title: "Systems software", icon: "⚙️",
    description: "Operating-system functions and utility software.",
    units: [
      { slug: "operating-system-purpose", title: "Operating-system purpose", summary: "Understand why computer systems need an operating system.", facts: [
        fact("What is systems software?", "Software that manages computer hardware or provides a platform and services for applications.", ["manages", "hardware", "applications"]),
        fact("What is an operating system?", "Core systems software that manages resources and provides an interface between users, applications and hardware.", ["resources", "interface", "hardware"]),
        fact("Why do applications rely on an operating system?", "The operating system provides standard services for files, memory, devices and user interaction.", ["services", "files", "devices"]),
        fact("What is a user interface?", "A user interface is the method by which a person interacts with a computer system.", ["interacts", "computer"]),
        fact("Compare graphical and command-line interfaces.", "A GUI uses visual controls and is easier for many users; a CLI uses typed commands and offers precise efficient control to trained users.", ["visual", "commands"]),
      ]},
      { slug: "resource-management", title: "Resource management", summary: "Explain how the operating system manages memory, processes and peripherals.", facts: [
        fact("How does an operating system manage memory?", "It allocates RAM to processes, tracks its use and prevents processes interfering with each other.", ["allocates", "RAM", "processes"]),
        fact("How does an operating system manage processes?", "It schedules processor time and supports multitasking between running programs.", ["schedules", "multitasking"]),
        fact("How does an operating system manage peripherals?", "It communicates with devices through drivers and coordinates their input and output.", ["drivers", "input", "output"]),
        fact("What is a device driver?", "Software that lets the operating system communicate with and control a particular hardware device.", ["communicate", "hardware"]),
        fact("How does an operating system manage users?", "It authenticates users and applies accounts, permissions and personalised settings.", ["authenticates", "permissions"]),
      ]},
      { slug: "file-management", title: "File management", summary: "Organise stored data and control access to it.", facts: [
        fact("What file-management services does an operating system provide?", "It supports creating, naming, copying, moving, deleting and organising files and folders.", ["creating", "moving", "folders"]),
        fact("What is a file path?", "A file path identifies a file's location within the folder structure.", ["location", "folder"]),
        fact("Why are file permissions used?", "They control which users may read, write or execute a file.", ["users", "read", "write"]),
        fact("Why are file extensions useful?", "They indicate a file's format and help the operating system choose suitable software.", ["format", "software"]),
        fact("Why should filenames and folders be organised clearly?", "Clear organisation makes files easier to locate, manage and back up.", ["locate", "back up"]),
      ]},
      { slug: "utilities", title: "Utility software", summary: "Explain the purposes of encryption, defragmentation and compression utilities.", facts: [
        fact("What is utility software?", "Systems software that performs a maintenance, security or optimisation task.", ["maintenance", "security"]),
        fact("What does encryption software do?", "It converts data into ciphertext that requires the correct key to read.", ["ciphertext", "key"]),
        fact("What does a defragmentation utility do?", "It rearranges parts of files on a magnetic disk into contiguous blocks to improve access speed.", ["magnetic", "contiguous", "speed"]),
        fact("Why is defragmentation not normally needed for an SSD?", "An SSD has no moving read head, and unnecessary writes can reduce its lifespan.", ["no moving", "writes", "lifespan"]),
        fact("What does data-compression software do?", "It reduces file size so files need less storage or transmission time.", ["reduces", "storage", "transmission"]),
      ]},
    ],
  },
  {
    code: "1.6", slug: "impacts-of-digital-technology", title: "Ethical, legal, cultural and environmental impacts", icon: "⚖️",
    description: "Stakeholder impacts, privacy, legislation, licences and environmental consequences.",
    units: [
      { slug: "ethical-cultural", title: "Ethical and cultural impacts", summary: "Evaluate how technology affects different people and communities.", facts: [
        fact("What makes an issue ethical?", "It concerns judgements about right, wrong, fairness or responsibility rather than only what is legal.", ["right", "fairness", "responsibility"]),
        fact("What is the digital divide?", "The gap between people who have effective access to digital technology and skills and those who do not.", ["gap", "access", "skills"]),
        fact("How can automation benefit society?", "It can improve speed, consistency, safety and productivity, especially for repetitive or dangerous work.", ["speed", "safety", "productivity"]),
        fact("How can automation harm some stakeholders?", "It can displace jobs, require retraining or concentrate decisions and power in fewer organisations.", ["jobs", "retraining"]),
        fact("Why should impact answers consider stakeholders?", "The same technology can create different benefits, risks and responsibilities for different groups.", ["different", "groups"]),
      ]},
      { slug: "privacy-and-environment", title: "Privacy and environmental impacts", summary: "Balance data use against privacy and examine technology's environmental cost.", facts: [
        fact("How can collecting personal data benefit users?", "It can personalise services, support research, prevent fraud or improve decisions.", ["personalise", "research"]),
        fact("What privacy risks come from collecting personal data?", "Data may be inaccurate, misused, shared without valid consent or exposed in a breach.", ["misused", "consent", "breach"]),
        fact("How does manufacturing digital devices affect the environment?", "It consumes energy and raw materials and can cause pollution and habitat damage.", ["energy", "materials", "pollution"]),
        fact("What is electronic waste?", "Discarded electrical or electronic equipment that may contain valuable and hazardous materials.", ["discarded", "hazardous"]),
        fact("How can organisations reduce computing's environmental impact?", "They can extend device life, repair and recycle equipment, use efficient systems and source renewable energy.", ["repair", "recycle", "efficient"]),
      ]},
      { slug: "legislation", title: "Computer-related legislation", summary: "Apply the Data Protection, Computer Misuse and Copyright laws to scenarios.", facts: [
        fact("What is the purpose of the Data Protection Act 2018?", "It controls how personal data is collected, processed, stored and protected and gives individuals data rights.", ["personal data", "protected", "rights"]),
        fact("What does the Computer Misuse Act 1990 prohibit?", "It prohibits unauthorised access to computer material and unauthorised acts intended to impair systems or data.", ["unauthorised access", "impair"]),
        fact("What does the Copyright, Designs and Patents Act 1988 protect?", "It protects creators' work, including software, against unauthorised copying and distribution.", ["creators", "software", "copying"]),
        fact("Why must organisations follow software licences?", "A licence sets the legal terms under which software may be installed, used, modified or shared.", ["legal terms", "used", "shared"]),
        fact("Why can an action be legal but still unethical?", "Law provides minimum enforceable rules, while ethical judgement may demand greater fairness or care.", ["law", "minimum", "fairness"]),
      ]},
      { slug: "software-licences-evaluation", title: "Software licences and evaluation", summary: "Compare open-source and proprietary licences and build balanced conclusions.", facts: [
        fact("What is open-source software?", "Software whose source code is available under a licence that permits inspection and usually modification.", ["source code", "modification"]),
        fact("What is proprietary software?", "Software controlled by an owner and normally supplied without permission to view or modify its source code.", ["owner", "without", "source code"]),
        fact("Give one benefit and one drawback of open-source software.", "It can be modified and independently reviewed, but support or compatibility may vary.", ["modified", "support"]),
        fact("Give one benefit and one drawback of proprietary software.", "It may provide formal support and polished integration, but can cost more and create vendor dependence.", ["support", "cost", "vendor"]),
        fact("How should an extended impact answer be concluded?", "Reach a justified judgement based on the scenario, stakeholders and the relative importance of benefits and drawbacks.", ["judgement", "stakeholders", "benefits"]),
      ]},
    ],
  },
  {
    code: "2.1", slug: "algorithms", title: "Algorithms", icon: "🧠",
    description: "Computational thinking, algorithm design, trace tables, searching and sorting.",
    units: [
      { slug: "computational-thinking", title: "Computational thinking", summary: "Use abstraction, decomposition and algorithmic thinking to frame problems.", facts: [
        fact("What is decomposition?", "Breaking a complex problem into smaller, more manageable parts.", ["smaller", "parts"]),
        fact("What is abstraction?", "Removing or hiding unnecessary detail so attention stays on relevant features.", ["unnecessary", "relevant"]),
        fact("What is algorithmic thinking?", "Developing a clear sequence of steps that solves a problem.", ["sequence", "steps"]),
        fact("Why is decomposition useful?", "Smaller parts can be understood, developed, tested and reused more easily.", ["smaller", "tested", "reused"]),
        fact("Why is abstraction useful?", "It reduces complexity and makes a model or solution easier to reason about.", ["reduces", "complexity"]),
      ]},
      { slug: "designing-algorithms", title: "Designing algorithms", summary: "Identify inputs, processes and outputs and represent solutions clearly.", facts: [
        fact("What are the input, process and output of an algorithm?", "Input is data supplied, process is the operations performed, and output is the resulting information.", ["input", "operations", "output"]),
        fact("What does a structure diagram show?", "It shows how a problem is decomposed into linked subproblems or modules.", ["decomposed", "modules"]),
        fact("What is pseudocode?", "A language-independent, structured way of expressing an algorithm.", ["language-independent", "algorithm"]),
        fact("What is a flowchart?", "A diagram using standard symbols and arrows to represent algorithm steps and control flow.", ["symbols", "arrows", "control"]),
        fact("Why should an algorithm be refined?", "Refinement removes errors, improves clarity or efficiency and ensures requirements are met.", ["errors", "clarity", "requirements"]),
      ]},
      { slug: "tracing-errors", title: "Tracing and correcting algorithms", summary: "Use trace tables to expose syntax and logic errors.", facts: [
        fact("What does a trace table record?", "It records how variables, conditions and outputs change as an algorithm executes.", ["variables", "outputs", "executes"]),
        fact("What is a syntax error?", "Code breaks the grammar rules of the programming language and cannot be translated or run correctly.", ["grammar", "language"]),
        fact("What is a logic error?", "The program runs but produces an incorrect result or behaviour.", ["runs", "incorrect"]),
        fact("How can a trace table help find a logic error?", "It reveals the exact step at which a value or control decision becomes incorrect.", ["step", "value", "incorrect"]),
        fact("What is nested control flow?", "A selection or iteration structure placed inside another control structure.", ["inside", "selection", "iteration"]),
      ]},
      { slug: "search-sort", title: "Searching and sorting", summary: "Trace linear and binary searches plus bubble, insertion and merge sorts.", facts: [
        fact("How does linear search work?", "It checks items one at a time until the target is found or the list ends.", ["one at a time", "target"]),
        fact("What prerequisite does binary search have?", "The data must be in sorted order.", ["sorted"]),
        fact("How does binary search reduce the search area?", "It compares the middle item and discards the half that cannot contain the target.", ["middle", "half"]),
        fact("How does bubble sort work?", "It repeatedly compares adjacent items and swaps those in the wrong order.", ["adjacent", "swaps"]),
        fact("How do insertion sort and merge sort differ?", "Insertion sort builds a sorted section one item at a time; merge sort divides data then merges sorted parts.", ["sorted section", "divides", "merges"]),
      ]},
    ],
  },
  {
    code: "2.2", slug: "programming-fundamentals", title: "Programming fundamentals", icon: "💻",
    description: "Programming constructs, data types, strings, files, arrays, records, SQL and subprograms.",
    units: [
      { slug: "constructs-operators", title: "Constructs and operators", summary: "Use sequence, selection, iteration and common operators.", facts: [
        fact("What is sequence in programming?", "Instructions execute one after another in the order written.", ["order", "written"]),
        fact("What is selection?", "A condition chooses which path of instructions will execute.", ["condition", "path"]),
        fact("What is iteration?", "A loop repeats instructions either a fixed number of times or while a condition applies.", ["loop", "repeats", "condition"]),
        fact("What do DIV and MOD return?", "DIV returns the whole-number quotient and MOD returns the remainder.", ["quotient", "remainder"]),
        fact("What do AND, OR and NOT do in conditions?", "AND requires both conditions, OR requires at least one, and NOT reverses a Boolean value.", ["both", "one", "reverses"]),
      ]},
      { slug: "variables-data-types", title: "Variables and data types", summary: "Store values using appropriate identifiers and types.", facts: [
        fact("How does a variable differ from a constant?", "A variable's value may change while a constant's value should not change during execution.", ["change", "not change"]),
        fact("What is assignment?", "Assignment stores the result of an expression in a variable.", ["stores", "variable"]),
        fact("When should integer and real data types be used?", "Integer stores whole numbers; real stores numbers that may have a fractional part.", ["whole", "fractional"]),
        fact("How do Boolean, character and string types differ?", "Boolean stores true or false, character stores one symbol, and string stores a sequence of characters.", ["true", "one", "sequence"]),
        fact("What is casting?", "Casting converts a value temporarily from one data type to another.", ["converts", "type"]),
      ]},
      { slug: "strings-files-data", title: "Strings, files and data structures", summary: "Manipulate text and store collections or persistent data.", facts: [
        fact("What is string concatenation?", "Joining two or more strings end to end.", ["joining", "strings"]),
        fact("What is string slicing?", "Selecting a specified section of characters from a string.", ["section", "characters"]),
        fact("State the basic file-handling operations.", "Open, read, write and close.", ["open", "read", "write", "close"]),
        fact("How do 1D and 2D arrays differ?", "A 1D array is a single indexed list; a 2D array uses rows and columns.", ["list", "rows", "columns"]),
        fact("What is a record?", "A record groups related fields, which may have different data types, about one item.", ["fields", "different", "one item"]),
      ]},
      { slug: "subprograms-sql-random", title: "Subprograms, SQL and random numbers", summary: "Structure programs and retrieve stored data.", facts: [
        fact("How does a function differ from a procedure?", "A function returns a value; a procedure performs a task and need not return a value.", ["returns", "task"]),
        fact("Why are parameters useful?", "They pass data into a subprogram so the same code can work with different values.", ["pass", "subprogram", "different"]),
        fact("How do local and global variables differ?", "A local variable is available within its subprogram; a global variable is accessible across wider parts of the program.", ["subprogram", "wider"]),
        fact("What do SELECT, FROM and WHERE do in SQL?", "SELECT chooses fields, FROM chooses the table, and WHERE filters records using a condition.", ["fields", "table", "filters"]),
        fact("Why are random numbers used in programs?", "They support unpredictable choices in games, simulations, sampling and test data.", ["unpredictable", "games", "simulations"]),
      ]},
    ],
  },
  {
    code: "2.3", slug: "robust-programs", title: "Producing robust programs", icon: "✅",
    description: "Defensive design, validation, maintainability and systematic testing.",
    units: [
      { slug: "defensive-design", title: "Defensive design", summary: "Anticipate misuse and protect program access.", facts: [
        fact("What is defensive design?", "Designing a program to cope safely with likely misuse, invalid input and unexpected situations.", ["safely", "misuse", "invalid"]),
        fact("Why should programmers anticipate misuse?", "Users may make mistakes or deliberately provide unexpected input that could cause incorrect or unsafe behaviour.", ["mistakes", "unexpected"]),
        fact("What is authentication?", "Checking evidence to confirm the identity of a user or system.", ["confirm", "identity"]),
        fact("How can meaningful error messages improve robustness?", "They explain what went wrong and help the user correct the input without exposing sensitive details.", ["explain", "correct", "sensitive"]),
        fact("Why should a program fail safely?", "It should protect data and avoid dangerous or misleading behaviour when an error occurs.", ["protect", "avoid", "error"]),
      ]},
      { slug: "validation", title: "Input validation", summary: "Select validation checks that reject unsuitable data.", facts: [
        fact("What is validation?", "Checking that input is sensible and follows stated rules; it does not prove the data is true.", ["sensible", "rules", "not prove"]),
        fact("What does a range check do?", "It checks that a numeric value lies between permitted limits.", ["between", "limits"]),
        fact("What do length and presence checks do?", "A length check controls the number of characters; a presence check ensures data was entered.", ["characters", "entered"]),
        fact("What does a format check do?", "It checks that input follows a required pattern, such as a date or email structure.", ["pattern", "structure"]),
        fact("What does a type check do?", "It checks that input can be treated as the required data type.", ["required", "data type"]),
      ]},
      { slug: "maintainability", title: "Maintainability", summary: "Write code that another programmer can understand and change.", facts: [
        fact("What makes code maintainable?", "Clear identifiers, comments, indentation, modular structure and avoiding unnecessary repetition.", ["identifiers", "comments", "modular"]),
        fact("Why are meaningful identifiers useful?", "They communicate the purpose of variables and subprograms without needing to trace every use.", ["purpose", "variables"]),
        fact("When are comments useful?", "Comments explain purpose, assumptions or non-obvious decisions rather than restating simple code.", ["purpose", "decisions"]),
        fact("Why should code be modular?", "Small focused subprograms are easier to understand, test, reuse and change.", ["subprograms", "test", "reuse"]),
        fact("Why should duplicated code be reduced?", "A single reusable implementation is easier to update consistently and has fewer places for faults.", ["reusable", "update", "faults"]),
      ]},
      { slug: "testing", title: "Testing", summary: "Plan test data and use iterative and final testing.", facts: [
        fact("How do normal, boundary, invalid and erroneous test data differ?", "Normal data is typical and valid, boundary data is at an allowed limit, invalid data breaks a value rule, and erroneous data has the wrong type or format.", ["typical", "limit", "invalid", "erroneous"]),
        fact("What is iterative testing?", "Testing repeatedly during development as components and features are created.", ["during", "development"]),
        fact("What is final or terminal testing?", "Testing the completed program against its requirements before release or acceptance.", ["completed", "requirements"]),
        fact("What should a test plan record?", "Test data, reason for the test, expected result, actual result and pass or fail outcome.", ["expected", "actual", "outcome"]),
        fact("Why should failed tests be repeated after a fix?", "Retesting confirms the fault is fixed and checks that the change has not introduced another problem.", ["confirms", "fixed", "another"]),
      ]},
    ],
  },
  {
    code: "2.4", slug: "boolean-logic", title: "Boolean logic", icon: "🔀",
    description: "AND, OR and NOT gates, truth tables, expressions and combined circuits.",
    units: [
      { slug: "boolean-values", title: "Boolean values and expressions", summary: "Represent two-state conditions and evaluate simple expressions.", facts: [
        fact("What values can a Boolean have?", "A Boolean has one of two values: true or false, often represented by 1 and 0.", ["true", "false", "1", "0"]),
        fact("What is a Boolean expression?", "An expression that evaluates to true or false.", ["evaluates", "true", "false"]),
        fact("How are logic gates related to Boolean expressions?", "Each gate performs a Boolean operation on one or more binary inputs.", ["operation", "binary", "inputs"]),
        fact("Why are truth tables useful?", "They show the output for every possible combination of input values.", ["every", "combination", "output"]),
        fact("How many rows are needed for a truth table with n inputs?", "A truth table with n inputs needs 2 to the power n rows.", ["2", "power", "n"]),
      ]},
      { slug: "and-or", title: "AND and OR", summary: "Apply the two common two-input gates.", facts: [
        fact("When does an AND gate output 1?", "Only when all of its inputs are 1.", ["all", "1"]),
        fact("When does an OR gate output 1?", "When at least one of its inputs is 1.", ["at least one", "1"]),
        fact("What is the Boolean notation for AND?", "AND may be written as a dot, multiplication sign or the word AND.", ["dot", "AND"]),
        fact("What is the Boolean notation for OR?", "OR may be written as a plus sign or the word OR.", ["plus", "OR"]),
        fact("How does OR differ from everyday exclusive use of 'or'?", "Boolean OR is inclusive: it is true when either input or both inputs are true.", ["inclusive", "both"]),
      ]},
      { slug: "not", title: "NOT", summary: "Invert a Boolean signal and read NOT notation.", facts: [
        fact("What does a NOT gate do?", "It inverts one input: 1 becomes 0 and 0 becomes 1.", ["inverts", "1", "0"]),
        fact("How is NOT shown in a logic diagram?", "A NOT gate is a triangle with a small circle at its output.", ["triangle", "circle"]),
        fact("How can NOT be written in a Boolean expression?", "It may use the word NOT, an overline or another specified negation symbol.", ["NOT", "overline"]),
        fact("What is double negation?", "Applying NOT twice returns the original Boolean value.", ["twice", "original"]),
        fact("Why might NOT be used in a control system?", "It can activate an output when a condition is false, such as when a door is not closed.", ["false", "condition"]),
      ]},
      { slug: "combined-logic", title: "Combined logic", summary: "Build and trace multi-gate circuits and their truth tables.", facts: [
        fact("How should a combined logic circuit be evaluated?", "Work from inputs to output one gate at a time, recording intermediate values.", ["one gate", "intermediate"]),
        fact("Why do brackets matter in Boolean expressions?", "They show which operation must be evaluated first.", ["operation", "first"]),
        fact("How can a Boolean expression be converted into a circuit?", "Create a gate for each operation and connect outputs according to the expression's structure.", ["gate", "connect", "structure"]),
        fact("How can a circuit be converted into a Boolean expression?", "Label intermediate outputs and combine each gate's operation from left to right.", ["label", "intermediate", "operation"]),
        fact("How can a truth table check a circuit?", "Evaluate both for every input combination and confirm their outputs match.", ["every", "outputs", "match"]),
      ]},
    ],
  },
  {
    code: "2.5", slug: "languages-and-ides", title: "Programming languages and IDEs", icon: "🧰",
    description: "Language levels, translators and integrated development environments.",
    units: [
      { slug: "language-levels", title: "High- and low-level languages", summary: "Compare abstraction, portability and hardware control.", facts: [
        fact("What is a high-level language?", "A language with human-readable constructs that abstracts many hardware details.", ["human-readable", "abstracts"]),
        fact("What is a low-level language?", "A language close to machine instructions, such as assembly or machine code.", ["machine", "assembly"]),
        fact("Why are high-level languages usually easier to develop with?", "Their readable constructs, libraries and portability reduce the detail programmers must manage.", ["readable", "libraries", "portability"]),
        fact("Why might a low-level language be chosen?", "It can provide precise hardware control, efficient code or access to processor-specific features.", ["hardware control", "efficient", "processor"]),
        fact("How do high- and low-level languages differ in portability?", "High-level source is usually portable between processor types after translation, while low-level instructions are tied closely to a processor's instruction set.", ["portable", "processor", "instruction set"]),
      ]},
      { slug: "machine-code-translation", title: "Machine code and translation", summary: "Explain why source code must be translated for a processor.", facts: [
        fact("What is machine code?", "Binary instructions that a particular processor can execute directly.", ["binary", "processor", "directly"]),
        fact("Why must most source code be translated?", "The CPU executes machine code rather than human-readable high-level source code.", ["CPU", "machine code", "source"]),
        fact("What is the purpose of a translator?", "A translator converts source code into a form the computer can execute, normally machine code.", ["source code", "execute", "machine code"]),
        fact("Why is machine code processor-specific?", "Different processor instruction sets use different binary operation codes and formats.", ["instruction sets", "binary"]),
        fact("What is source code?", "The original program text written by a programmer in a programming language.", ["program text", "programmer"]),
      ]},
      { slug: "compiler-interpreter", title: "Compilers and interpreters", summary: "Compare whole-program translation with line-by-line execution.", facts: [
        fact("How does a compiler work?", "It translates the whole source program into executable machine code before the program runs.", ["whole", "before", "machine code"]),
        fact("How does an interpreter work?", "It translates and executes source code one instruction or statement at a time.", ["one", "at a time"]),
        fact("Give one advantage of compiling a program.", "The compiled program can run without the compiler and is usually faster after translation.", ["run", "faster"]),
        fact("Give one advantage of interpreting a program.", "Errors can be reported as execution reaches them, supporting interactive development and testing.", ["errors", "execution", "testing"]),
        fact("Why does distributing compiled code help protect source code?", "Users can receive executable machine code without receiving the original human-readable source.", ["executable", "without", "source"]),
      ]},
      { slug: "ide", title: "Integrated development environments", summary: "Use IDE tools to write, translate, test and debug programs.", facts: [
        fact("What is an IDE?", "Software that combines tools for writing, translating, running and debugging programs.", ["writing", "running", "debugging"]),
        fact("How does an editor in an IDE help?", "It provides features such as syntax highlighting, indentation and automatic completion.", ["syntax", "indentation", "completion"]),
        fact("What does a debugger do?", "It lets a programmer pause execution, step through code and inspect variables.", ["pause", "step", "variables"]),
        fact("What is a breakpoint?", "A chosen point where a debugger pauses program execution.", ["point", "pauses"]),
        fact("How do translators and error diagnostics in an IDE help?", "They convert source code and identify syntax or runtime problems with useful locations and messages.", ["convert", "errors", "messages"]),
      ]},
    ],
  },
];

export const OCR_GCSE_SOURCE_NOTES = [
  "Cambridge OCR J277 specification version 3.1 (2026)",
  "OCR J277 assessment and specification-at-a-glance pages",
  "Physics & Maths Tutor OCR GCSE topic map and revision-resource index",
  "Craig 'n' Dave OCR GCSE J277 learning-objective map",
] as const;
