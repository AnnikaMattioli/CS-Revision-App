import type { OcrTopicBlueprint } from "./ocr-gcse";

const fact = (question: string, answer: string, keywords: string[]) => ({ question, answer, keywords });

export const ocrALevelBlueprints: OcrTopicBlueprint[] = [
  {
    code: "1.1", slug: "processors-io-and-storage", title: "Processors, input, output and storage", icon: "🧩",
    description: "Processor architecture, instruction processing, specialist processors and storage choices.",
    units: [
      { slug: "processor-components", title: "Processor components", summary: "Trace instructions through registers, buses, the ALU and control unit.", facts: [
        fact("What is the role of the ALU?", "The arithmetic and logic unit performs arithmetic calculations, Boolean logic, comparisons and bitwise operations.", ["arithmetic", "logic", "comparisons"]),
        fact("What is the role of the control unit?", "It coordinates processor activity by decoding instructions and issuing control signals to other components.", ["decoding", "control signals", "coordinates"]),
        fact("What do the PC, MAR and MDR hold?", "The PC holds the next instruction address, the MAR holds the current memory address, and the MDR holds data moving to or from memory.", ["next instruction", "memory address", "data"]),
        fact("What do the accumulator and CIR hold?", "The accumulator stores intermediate arithmetic or logic results, while the CIR holds the current instruction being decoded and executed.", ["intermediate", "current instruction"]),
        fact("How do the address, data and control buses differ?", "The address bus identifies a location, the data bus carries data or instructions, and the control bus carries timing and command signals.", ["location", "data", "signals"]),
      ]},
      { slug: "instruction-processing", title: "Instruction processing and architecture", summary: "Explain the fetch-decode-execute cycle, pipelining and processor architectures.", facts: [
        fact("What happens during fetch?", "The PC address is copied to the MAR, memory data is copied through the MDR to the CIR, and the PC is incremented.", ["PC", "MAR", "MDR", "CIR"]),
        fact("What happens during decode and execute?", "The control unit interprets the opcode and operand, then coordinates the operation and stores any result.", ["opcode", "operand", "operation"]),
        fact("How does pipelining improve performance?", "It overlaps stages of several instructions so processor units are used more continuously and throughput increases.", ["overlaps", "throughput"]),
        fact("How do Von Neumann and Harvard architectures differ?", "Von Neumann uses shared memory and buses for instructions and data; Harvard keeps instruction and data storage or pathways separate.", ["shared", "separate", "instructions"]),
        fact("Why are contemporary processors often neither purely Von Neumann nor Harvard?", "They combine features, such as a shared main memory with separate instruction and data caches, to balance flexibility and throughput.", ["combine", "caches", "throughput"]),
      ]},
      { slug: "processor-types-performance", title: "Processor types and performance", summary: "Compare CISC, RISC, GPUs and parallel processing and evaluate performance factors.", facts: [
        fact("How do CISC and RISC instruction sets differ?", "CISC provides many complex, variable-length instructions; RISC uses fewer simple, commonly fixed-length instructions suited to pipelines.", ["complex", "simple", "fixed-length"]),
        fact("Why can RISC require more instructions for the same task?", "Each instruction performs a simpler operation, so a complex task may need a longer sequence of instructions.", ["simpler", "longer sequence"]),
        fact("Why are GPUs effective for some non-graphics tasks?", "They contain many processing units that can perform the same operation on large data sets in parallel.", ["many", "same operation", "parallel"]),
        fact("How do clock speed, cores and cache affect CPU performance?", "Clock speed affects cycles per second, cores permit suitable work in parallel, and cache reduces slower main-memory accesses.", ["cycles", "parallel", "memory"]),
        fact("Why do higher hardware specifications not guarantee faster software?", "Performance also depends on architecture, bottlenecks, instruction mix and whether the software can exploit parallel resources.", ["architecture", "bottlenecks", "software"]),
      ]},
      { slug: "input-output-storage", title: "Input, output and storage", summary: "Select devices, memory and storage technologies for an application.", facts: [
        fact("How should an input or output device be selected?", "Selection should be justified using the required accuracy, speed, environment, accessibility, reliability and cost.", ["accuracy", "environment", "cost"]),
        fact("How do RAM and ROM differ?", "RAM is volatile read/write working memory; ROM is non-volatile memory normally used for instructions that persist without power.", ["volatile", "read/write", "non-volatile"]),
        fact("What is virtual storage?", "It stores data on remote networked infrastructure and is accessed as a service rather than solely on a local device.", ["remote", "networked", "service"]),
        fact("Compare magnetic, optical and flash storage.", "Magnetic storage offers high capacity cheaply, optical media supports portable distribution, and flash is fast, durable and has no moving parts.", ["capacity", "portable", "no moving parts"]),
        fact("Why is no storage medium best for every situation?", "Capacity, access speed, durability, portability, longevity and cost create different trade-offs for each application.", ["trade-offs", "durability", "cost"]),
      ]},
    ],
  },
  {
    code: "1.2", slug: "software-development", title: "Software and software development", icon: "🧰",
    description: "Operating systems, translators, development methods and programming paradigms.",
    units: [
      { slug: "operating-systems", title: "Operating systems", summary: "Explain memory management, interrupts, scheduling and operating-system types.", facts: [
        fact("Why is an operating system required?", "It manages hardware resources, provides services and an interface, controls processes and maintains security.", ["resources", "services", "processes"]),
        fact("How do paging and segmentation differ?", "Paging divides memory into fixed-size blocks; segmentation divides a program into variable-size logical sections.", ["fixed-size", "variable-size", "logical"]),
        fact("How is an interrupt handled?", "The current state is saved, the appropriate interrupt service routine runs, and the saved process state is restored.", ["state", "ISR", "restored"]),
        fact("Compare FCFS, round robin and shortest-job scheduling.", "FCFS follows arrival order, round robin gives time slices cyclically, and shortest job prioritises the smallest predicted processing time.", ["arrival", "time slices", "shortest"]),
        fact("When is a real-time operating system needed?", "It is needed when responses must occur within guaranteed time constraints, especially in monitoring and control systems.", ["guaranteed", "time constraints", "control"]),
      ]},
      { slug: "system-services-virtualisation", title: "System services and virtualisation", summary: "Relate firmware, drivers and virtual machines to system operation.", facts: [
        fact("What does firmware such as a BIOS do?", "It initialises and tests hardware and begins the process of loading the operating system.", ["initialises", "tests", "loads"]),
        fact("Why are device drivers required?", "They translate generic operating-system requests into commands understood by a particular hardware device.", ["translate", "operating-system", "hardware"]),
        fact("What is a virtual machine?", "Software that emulates a computer or execution environment so another operating system or intermediate code can run.", ["emulates", "environment", "run"]),
        fact("Give an advantage of operating-system virtualisation.", "Several isolated systems can share one physical host, improving utilisation, testing and deployment flexibility.", ["isolated", "share", "utilisation"]),
        fact("What cost can virtualisation introduce?", "The extra abstraction consumes resources and may reduce performance compared with direct execution on hardware.", ["abstraction", "resources", "performance"]),
      ]},
      { slug: "translators-libraries", title: "Translators, libraries and utilities", summary: "Trace compilation and explain linkers, loaders, libraries and software licensing.", facts: [
        fact("How do compilers, interpreters and assemblers differ?", "A compiler translates a whole high-level program, an interpreter executes translated statements progressively, and an assembler translates assembly code.", ["whole", "progressively", "assembly"]),
        fact("What happens in lexical and syntax analysis?", "Lexical analysis groups characters into tokens; syntax analysis checks that token sequences follow the language grammar.", ["tokens", "grammar"]),
        fact("What do code generation and optimisation do?", "Code generation creates target instructions, while optimisation changes them to improve speed or resource use without changing behaviour.", ["target", "speed", "behaviour"]),
        fact("What do a linker and loader do?", "A linker combines object code with required libraries; a loader places executable code in memory and prepares it to run.", ["object code", "libraries", "memory"]),
        fact("How do open-source and closed-source software differ?", "Open-source licences make source available under stated freedoms and conditions; closed source normally restricts source access and modification.", ["source", "licence", "restricts"]),
      ]},
      { slug: "development-paradigms", title: "Development methods and paradigms", summary: "Choose a life cycle and distinguish procedural, assembly and object-oriented programming.", facts: [
        fact("When is the waterfall model suitable?", "It suits stable, well-understood requirements where documented sequential stages and formal approval are valuable.", ["stable", "sequential", "documented"]),
        fact("What is the central benefit of agile development?", "Frequent working increments and stakeholder feedback allow requirements and solutions to evolve.", ["increments", "feedback", "evolve"]),
        fact("How do spiral and rapid application development differ?", "Spiral development repeats risk-focused cycles; RAD emphasises rapid prototyping, reusable components and user feedback.", ["risk", "prototyping", "feedback"]),
        fact("What characterises procedural programming?", "A program is organised as sequences of commands and reusable procedures that operate on data.", ["commands", "procedures", "data"]),
        fact("What are encapsulation, inheritance and polymorphism?", "Encapsulation controls access to object state, inheritance derives classes from others, and polymorphism allows one interface to support different implementations.", ["access", "derives", "interface"]),
      ]},
    ],
  },
  {
    code: "1.3", slug: "exchanging-data", title: "Exchanging data", icon: "🔄",
    description: "Compression, encryption, databases, networks and web technologies.",
    units: [
      { slug: "compression-encryption-hashing", title: "Compression, encryption and hashing", summary: "Compare techniques for reducing, protecting and verifying data.", facts: [
        fact("How do lossy and lossless compression differ?", "Lossy compression permanently removes selected information; lossless compression reconstructs the original exactly.", ["removes", "reconstructs", "exactly"]),
        fact("How does run-length encoding work?", "It replaces consecutive repeated values with the value and a count, so it works best when long runs occur.", ["repeated", "count", "runs"]),
        fact("How does dictionary compression work?", "Repeated patterns are stored once in a dictionary and occurrences are replaced with shorter references.", ["patterns", "dictionary", "references"]),
        fact("How do symmetric and asymmetric encryption differ?", "Symmetric encryption uses one shared secret key; asymmetric encryption uses a mathematically related public and private key pair.", ["shared", "public", "private"]),
        fact("Why is hashing useful?", "A fixed-length digest can support password checking, indexing and integrity checks without needing to reverse the original input.", ["digest", "integrity", "one-way"]),
      ]},
      { slug: "relational-databases", title: "Relational databases", summary: "Model, normalise and query relational data while preserving integrity.", facts: [
        fact("What are primary, foreign and secondary keys?", "A primary key uniquely identifies a row, a foreign key references another table, and a secondary key supports searching without being the primary identifier.", ["uniquely", "references", "searching"]),
        fact("What does an entity-relationship model show?", "It shows entities, their attributes and the cardinality of relationships between them.", ["entities", "attributes", "cardinality"]),
        fact("What is the purpose of normalisation to third normal form?", "It reduces duplication and update anomalies by ensuring attributes depend on the key, the whole key and nothing but the key.", ["duplication", "dependencies", "anomalies"]),
        fact("What is referential integrity?", "Every foreign-key value must reference an existing permitted primary key, or be null when the design allows it.", ["foreign-key", "existing", "null"]),
        fact("What does ACID mean for transactions?", "Transactions are atomic, preserve consistency, remain isolated from concurrent work and are durable after commitment.", ["atomic", "consistent", "isolated", "durable"]),
      ]},
      { slug: "networks-internet", title: "Networks and the internet", summary: "Explain switching, layers, protocols, hardware and network security.", facts: [
        fact("Why are protocols and standards important?", "They define shared communication rules so independently developed devices and software can interoperate.", ["shared", "rules", "interoperate"]),
        fact("What is the purpose of the TCP/IP stack?", "Its layers divide internet communication into application, transport, internet and link responsibilities.", ["layers", "transport", "internet"]),
        fact("How do packet and circuit switching differ?", "Packet switching routes separate packets over shared links; circuit switching reserves a dedicated end-to-end route for a session.", ["packets", "shared", "dedicated"]),
        fact("How do client-server and peer-to-peer models differ?", "Client-server centralises services on dedicated servers; peers can request and provide resources directly.", ["centralises", "servers", "directly"]),
        fact("How do firewalls, proxies and encryption protect networks?", "Firewalls filter traffic, proxies mediate requests, and encryption makes intercepted content unreadable without a key.", ["filter", "mediate", "unreadable"]),
      ]},
      { slug: "web-technologies", title: "Web technologies", summary: "Connect HTML, CSS, JavaScript, processing location and search ranking.", facts: [
        fact("What are the distinct roles of HTML, CSS and JavaScript?", "HTML defines document structure, CSS controls presentation, and JavaScript provides programmable behaviour.", ["structure", "presentation", "behaviour"]),
        fact("How do client-side and server-side processing differ?", "Client-side code runs in the user's browser; server-side code runs on a server before or while producing a response.", ["browser", "server", "response"]),
        fact("What does a search-engine crawler do?", "It follows links and retrieves pages so their content and metadata can be analysed and added to an index.", ["links", "pages", "index"]),
        fact("What does the PageRank idea measure?", "It estimates a page's importance using links from other pages, with links from important pages contributing more weight.", ["importance", "links", "weight"]),
        fact("Why might a web application divide work between client and server?", "Client processing improves responsiveness while server processing protects central data, applies trusted rules and supports shared services.", ["responsiveness", "protects", "trusted"]),
      ]},
    ],
  },
  {
    code: "1.4", slug: "data-types-structures-and-algorithms", title: "Data types, data structures and algorithms", icon: "🗂️",
    description: "Binary representation, structured data, Boolean algebra and hardware logic.",
    units: [
      { slug: "binary-number-representation", title: "Binary number representation", summary: "Represent and calculate with integers, hexadecimal and floating-point values.", facts: [
        fact("How do sign-and-magnitude and two's complement represent negatives?", "Sign-and-magnitude reserves a sign bit; two's complement gives negative place value to the most significant bit and supports simpler arithmetic.", ["sign bit", "negative place", "arithmetic"]),
        fact("What causes integer overflow?", "A calculation produces a value outside the range representable by the fixed number of bits.", ["outside", "range", "fixed"]),
        fact("Why is hexadecimal useful?", "Each hexadecimal digit maps to four bits, making binary values shorter and easier to read accurately.", ["four bits", "shorter"]),
        fact("How is a binary floating-point number represented?", "A mantissa stores significant bits and an exponent scales the value by a power of two.", ["mantissa", "exponent", "power"]),
        fact("Why can floating-point arithmetic produce rounding errors?", "A finite mantissa cannot represent every real value exactly, so some results must be approximated.", ["finite", "exactly", "approximated"]),
      ]},
      { slug: "bitwise-text-representation", title: "Bitwise and text representation", summary: "Use masks and explain character encoding.", facts: [
        fact("What does a bitwise AND mask do?", "It can keep selected bits and clear others because only positions containing 1 in both operands remain 1.", ["keep", "clear", "both"]),
        fact("What does bitwise OR do?", "It sets any bit position where at least one operand has a 1, so a mask can force selected bits on.", ["sets", "at least one"]),
        fact("What does bitwise XOR do?", "It produces 1 where operand bits differ and can toggle selected bits using a mask.", ["differ", "toggle"]),
        fact("What do logical shifts do?", "A left shift moves bits towards higher place values and a right shift towards lower values, discarding bits that leave the representation.", ["higher", "lower", "discarding"]),
        fact("Why is Unicode more versatile than ASCII?", "Unicode defines code points for far more writing systems and symbols while including the ASCII characters.", ["code points", "writing systems", "ASCII"]),
      ]},
      { slug: "data-structures", title: "Data structures", summary: "Choose, implement and traverse linear and non-linear structures.", facts: [
        fact("How do arrays, records, lists and tuples differ?", "Arrays store indexed items, records group named fields, lists are ordered collections often variable in length, and tuples are fixed ordered groupings.", ["indexed", "fields", "ordered"]),
        fact("What defines stacks and queues?", "A stack is last-in first-out; a queue is first-in first-out.", ["LIFO", "FIFO"]),
        fact("How does a linked list store order?", "Each node stores data and a reference to another node, so items need not occupy adjacent memory locations.", ["node", "reference", "non-adjacent"]),
        fact("What distinguishes a tree, graph and binary search tree?", "A tree is hierarchical and acyclic, a graph models general vertex-edge relationships, and a BST orders smaller and larger keys in subtrees.", ["hierarchical", "vertices", "ordered"]),
        fact("How does a hash table locate data?", "A hash function maps a key to an index or bucket, with a collision strategy handling keys that map to the same location.", ["hash function", "index", "collision"]),
      ]},
      { slug: "boolean-algebra-circuits", title: "Boolean algebra and circuits", summary: "Simplify logic and explain combinational and sequential circuits.", facts: [
        fact("What do De Morgan's laws state?", "NOT(A AND B) equals NOT A OR NOT B, and NOT(A OR B) equals NOT A AND NOT B.", ["NOT", "AND", "OR"]),
        fact("Why is a Karnaugh map used?", "It groups adjacent 1 values in powers of two to derive a simpler equivalent Boolean expression.", ["adjacent", "groups", "simpler"]),
        fact("How do truth tables and logic diagrams relate?", "A truth table lists every input-output combination represented by the gates and connections in a logic diagram.", ["every", "input-output", "gates"]),
        fact("How do half and full adders differ?", "A half adder adds two bits; a full adder also accepts a carry-in, allowing units to be chained for multi-bit addition.", ["two bits", "carry-in", "chained"]),
        fact("What does a D-type flip-flop store?", "It stores one bit of state, capturing the data input on a specified clock transition and retaining it until the next update.", ["one bit", "clock", "retaining"]),
      ]},
    ],
  },
  {
    code: "1.5", slug: "legal-moral-cultural-ethical-issues", title: "Legal, moral, cultural and ethical issues", icon: "⚖️",
    description: "Applying law and stakeholder reasoning to the opportunities and risks of computing.",
    units: [
      { slug: "computing-law", title: "Computing-related law", summary: "Apply stable legal principles governing data, access, ownership and surveillance.", facts: [
        fact("What do data-protection laws require?", "Personal data must be processed lawfully, fairly, securely and only for justified purposes, with appropriate rights for individuals.", ["lawfully", "securely", "rights"]),
        fact("What does the Computer Misuse Act prohibit?", "It prohibits unauthorised access, unauthorised acts intended to impair systems, and making or supplying tools for such offences.", ["unauthorised", "impair", "tools"]),
        fact("What does copyright law protect in computing?", "It protects original software and digital works against unauthorised copying, distribution and adaptation.", ["software", "copying", "adaptation"]),
        fact("Why is investigatory-powers law relevant to computing?", "It regulates circumstances and safeguards for interception, communications data and state surveillance.", ["interception", "safeguards", "surveillance"]),
        fact("Why can legal compliance be insufficient ethically?", "Law sets enforceable boundaries, while an ethical decision may require greater fairness, transparency or avoidance of harm.", ["boundaries", "fairness", "harm"]),
      ]},
      { slug: "automation-ai-work", title: "Automation, AI and work", summary: "Evaluate benefits, harms and accountability for automated systems.", facts: [
        fact("How can automation benefit organisations and workers?", "It can improve consistency, speed and safety and remove repetitive or hazardous work.", ["consistency", "safety", "hazardous"]),
        fact("What employment risks can automation create?", "Roles may be displaced or redesigned, skills can become obsolete and benefits may be distributed unevenly.", ["displaced", "skills", "unevenly"]),
        fact("Why can automated decisions be biased?", "Biased data, proxy variables, objectives or design choices can produce systematically unfair outcomes.", ["data", "objectives", "unfair"]),
        fact("Why is explainability important?", "People affected by a decision need to understand, challenge and assign responsibility for its basis.", ["understand", "challenge", "responsibility"]),
        fact("Who may be accountable for harm caused by an AI system?", "Responsibility can be shared among developers, deployers, data providers, organisations and human decision-makers according to their control and duties.", ["shared", "control", "duties"]),
      ]},
      { slug: "privacy-censorship-communication", title: "Privacy, censorship and communication", summary: "Balance monitoring, expression, safety and access to information.", facts: [
        fact("What is a privacy trade-off in monitoring systems?", "Monitoring may improve safety or service quality but collects behavioural data that can enable intrusion, misuse or chilling effects.", ["safety", "behavioural", "intrusion"]),
        fact("Why is informed consent difficult online?", "Notices may be complex, choices may not be meaningful, and future data uses or inferences may be unclear.", ["complex", "meaningful", "future"]),
        fact("What competing values arise in internet censorship?", "Reducing harm and illegal content must be balanced against freedom of expression, access to information and abuse of control.", ["harm", "expression", "control"]),
        fact("Why are offensive communications difficult to regulate?", "Meaning depends on context and culture, platforms operate across jurisdictions, and enforcement can affect legitimate speech.", ["context", "jurisdictions", "speech"]),
        fact("How can interface design exclude users?", "Poor colour contrast, culturally narrow conventions, inaccessible layouts or unsupported character sets can block effective access.", ["contrast", "accessibility", "character sets"]),
      ]},
      { slug: "environment-ownership-culture", title: "Environment, ownership and culture", summary: "Assess environmental costs, piracy and unequal technological impacts.", facts: [
        fact("What environmental costs arise across a device's life cycle?", "Extraction, manufacture, energy use, transport and disposal consume resources and create emissions, pollution and electronic waste.", ["manufacture", "energy", "waste"]),
        fact("How can computing's environmental impact be reduced?", "Design for repair, extend device life, reuse and recycle equipment, improve efficiency and use lower-carbon energy.", ["repair", "reuse", "efficiency"]),
        fact("What interests conflict in digital piracy?", "Users may value access and sharing, while creators and distributors rely on control, attribution and income to sustain production.", ["access", "creators", "income"]),
        fact("How can digital technology affect culture?", "It can preserve and spread cultural expression but can also amplify dominant languages, values and platform norms.", ["preserve", "dominant", "norms"]),
        fact("How should an ethical exam response be structured?", "Identify stakeholders, explain benefits and harms, compare competing values, apply relevant law and reach a justified conclusion.", ["stakeholders", "values", "justified"]),
      ]},
    ],
  },
  {
    code: "2.1", slug: "computational-thinking", title: "Elements of computational thinking", icon: "🧠",
    description: "Abstraction, anticipation, procedural and logical reasoning, and concurrency.",
    units: [
      { slug: "thinking-abstractly", title: "Thinking abstractly", summary: "Create useful models by separating essential features from irrelevant detail.", facts: [
        fact("What is abstraction?", "Abstraction represents the essential features of a problem while hiding detail that is unnecessary for the current purpose.", ["essential", "hiding", "purpose"]),
        fact("Why is abstraction necessary?", "It reduces complexity so a person or program can reason about a manageable model.", ["complexity", "model"]),
        fact("Why is an abstraction not identical to reality?", "A model deliberately omits or simplifies details, so its usefulness and limitations depend on its purpose.", ["omits", "limitations", "purpose"]),
        fact("What makes an abstract model effective?", "It retains all features needed to answer the intended questions without including distracting detail.", ["needed", "intended", "detail"]),
        fact("What risk comes from over-abstraction?", "Removing relevant distinctions can make predictions inaccurate or a solution unsuitable for real cases.", ["relevant", "inaccurate", "unsuitable"]),
      ]},
      { slug: "thinking-ahead", title: "Thinking ahead", summary: "Identify interfaces, preconditions, caching opportunities and reusable components.", facts: [
        fact("Why identify inputs and outputs before designing a solution?", "They define the system boundary, required data and observable results that the solution must produce.", ["boundary", "data", "results"]),
        fact("What is a precondition?", "A condition assumed or required to be true before an operation or algorithm begins.", ["required", "before"]),
        fact("How can caching improve performance?", "Frequently needed data is stored closer to where it is used, avoiding repeated slower computation or retrieval.", ["frequently", "closer", "avoiding"]),
        fact("What drawback can caching create?", "Cached data consumes space and can become stale or inconsistent with its original source.", ["space", "stale", "inconsistent"]),
        fact("Why plan reusable program components?", "A well-defined component can be tested once, reused in several contexts and maintained independently.", ["tested", "reused", "maintained"]),
      ]},
      { slug: "procedural-logical-thinking", title: "Procedural and logical thinking", summary: "Decompose solutions, order steps and model decisions precisely.", facts: [
        fact("What is problem decomposition?", "It divides a complex problem into smaller components with clearer responsibilities and interfaces.", ["smaller", "responsibilities", "interfaces"]),
        fact("How does solution decomposition differ from problem decomposition?", "Problem decomposition identifies what must be solved; solution decomposition organises the procedures or modules that will solve it.", ["what", "procedures", "modules"]),
        fact("Why must procedural steps be ordered?", "Dependencies and state changes mean some operations require results or conditions established by earlier steps.", ["dependencies", "state", "earlier"]),
        fact("What is logical thinking in program design?", "It identifies decisions, expresses their conditions precisely and traces how each outcome changes control flow.", ["decisions", "conditions", "control flow"]),
        fact("Why are Boolean expressions central to logical thinking?", "They turn rules into testable true-or-false conditions used by selections and loops.", ["rules", "true-or-false", "loops"]),
      ]},
      { slug: "thinking-concurrently", title: "Thinking concurrently", summary: "Identify independent work and evaluate the trade-offs of concurrent processing.", facts: [
        fact("What is concurrency?", "Concurrency allows multiple tasks to make progress during overlapping periods, whether interleaved or genuinely parallel.", ["tasks", "overlapping", "parallel"]),
        fact("When can parts of a problem run concurrently?", "They can overlap when dependencies do not require one part to finish before another begins.", ["dependencies", "finish", "begins"]),
        fact("What benefit can concurrent processing provide?", "It can improve throughput, responsiveness or hardware utilisation when work can be divided effectively.", ["throughput", "responsiveness", "utilisation"]),
        fact("What costs can concurrency introduce?", "Coordination, communication and synchronisation add overhead and make behaviour harder to test and reason about.", ["synchronisation", "overhead", "test"]),
        fact("What is a race condition?", "The outcome incorrectly depends on the timing or order of concurrent access to shared state.", ["timing", "shared state", "outcome"]),
      ]},
    ],
  },
  {
    code: "2.2", slug: "problem-solving-and-programming", title: "Problem solving and programming", icon: "💻",
    description: "Programming techniques and computational methods for developing robust solutions.",
    units: [
      { slug: "programming-constructs", title: "Programming constructs and scope", summary: "Use control structures, variables and modular program units precisely.", facts: [
        fact("What are sequence, selection and iteration?", "Sequence executes steps in order, selection chooses a branch from a condition, and iteration repeats instructions.", ["order", "branch", "repeats"]),
        fact("How do definite and indefinite iteration differ?", "Definite iteration repeats a known number of times; indefinite iteration continues while or until a condition applies.", ["known", "condition"]),
        fact("How do global and local variables differ?", "A global has wider program scope, while a local exists only within its block or subroutine.", ["scope", "block", "subroutine"]),
        fact("Why is limited variable scope desirable?", "It reduces unintended coupling and name conflicts and makes modules easier to understand, test and reuse.", ["coupling", "test", "reuse"]),
        fact("How do functions and procedures differ?", "Both are named reusable subroutines, but a function conventionally returns a value while a procedure performs an action.", ["reusable", "returns", "action"]),
      ]},
      { slug: "recursion-parameters-ide", title: "Recursion, parameters and development tools", summary: "Compare recursion with iteration and use subroutines and IDE tools effectively.", facts: [
        fact("What two features must a recursive solution have?", "It needs a base case that stops recursion and a recursive step that moves the problem towards that case.", ["base case", "recursive step", "towards"]),
        fact("How can recursion and iteration solve similar problems?", "Both repeat work; recursion uses nested calls and a call stack, whereas iteration uses loop state explicitly.", ["calls", "stack", "loop"]),
        fact("How do pass-by-value and pass-by-reference differ?", "Value passes a copy, while reference gives access to the caller's original data so changes can persist.", ["copy", "original", "persist"]),
        fact("Why does modularity improve program development?", "Small units can be assigned clear roles, developed and tested independently, reused and replaced with limited impact.", ["independently", "reused", "limited"]),
        fact("How does an IDE support debugging?", "Breakpoints, stepping, watches, variable inspection and error diagnostics reveal program state and control flow.", ["breakpoints", "watches", "state"]),
      ]},
      { slug: "object-oriented-techniques", title: "Object-oriented techniques", summary: "Model solutions using classes, objects and controlled relationships.", facts: [
        fact("What is the difference between a class and an object?", "A class defines attributes and methods; an object is a particular instance with its own state.", ["defines", "instance", "state"]),
        fact("What is encapsulation?", "It bundles state with the methods that manage it and restricts direct access to internal representation.", ["bundles", "methods", "restricts"]),
        fact("What is inheritance?", "A subclass derives attributes and behaviour from a superclass and may extend or specialise them.", ["subclass", "superclass", "specialise"]),
        fact("What is polymorphism?", "A common interface can invoke different implementations depending on an object's type.", ["interface", "different", "type"]),
        fact("Why can composition be preferable to inheritance?", "Building an object from collaborating components can reduce tight class hierarchies and allow behaviours to vary independently.", ["components", "hierarchies", "independently"]),
      ]},
      { slug: "computational-methods", title: "Computational methods", summary: "Choose decomposition, heuristics, backtracking and modelling methods for a problem.", facts: [
        fact("What makes a problem amenable to computational methods?", "Its inputs, outputs and rules can be represented precisely enough for a finite automated process.", ["inputs", "rules", "finite"]),
        fact("What is divide and conquer?", "It splits a problem into smaller similar subproblems, solves them and combines their results.", ["splits", "subproblems", "combines"]),
        fact("What is backtracking?", "It builds a candidate solution, abandons a path when constraints fail and returns to try another choice.", ["candidate", "constraints", "returns"]),
        fact("What is a heuristic?", "A practical rule or estimate that guides a search towards a good solution without guaranteeing the optimum.", ["estimate", "good", "not guarantee"]),
        fact("How do data mining, performance modelling and visualisation support problem solving?", "They reveal patterns, predict system behaviour and make complex data or results easier to interpret.", ["patterns", "predict", "interpret"]),
      ]},
    ],
  },
  {
    code: "2.3", slug: "advanced-algorithms", title: "Algorithms", icon: "📈",
    description: "Algorithm design, efficiency, traversal, searching, sorting and optimisation.",
    units: [
      { slug: "analysis-complexity", title: "Analysis and complexity", summary: "Evaluate correctness, suitability and growth in time and space.", facts: [
        fact("What qualities make an algorithm suitable for a task?", "It must be correct and should meet constraints for time, memory, data characteristics, implementation and maintainability.", ["correct", "constraints", "maintainability"]),
        fact("What does Big O notation describe?", "It describes an upper-bound growth rate for time or space as input size increases, ignoring constants and lower-order terms.", ["growth", "input", "constants"]),
        fact("Order common complexities from most to least scalable.", "Constant, logarithmic, linear, polynomial and exponential growth generally scale in that order.", ["constant", "logarithmic", "exponential"]),
        fact("Why are worst-case measures useful?", "They give an upper bound on required resources and help determine whether constraints can always be met.", ["upper bound", "resources", "always"]),
        fact("Why can two algorithms with the same Big O perform differently?", "Constants, lower-order work, memory access, input distribution and implementation details still affect real execution.", ["constants", "memory", "implementation"]),
      ]},
      { slug: "searching-sorting", title: "Searching and sorting", summary: "Trace standard searches and sorts and justify a selection.", facts: [
        fact("How do linear and binary search compare?", "Linear search checks sequentially and needs no ordering; binary search repeatedly halves ordered data.", ["sequentially", "ordered", "halves"]),
        fact("How do bubble and insertion sort work?", "Bubble sort swaps adjacent inversions over passes; insertion sort places each new item into an already sorted prefix.", ["adjacent", "passes", "prefix"]),
        fact("How does merge sort work?", "It recursively divides data, then merges sorted sublists; its time complexity is typically O(n log n).", ["divides", "merges", "n log n"]),
        fact("How does quick sort work?", "It partitions values around a pivot and recursively sorts the partitions; pivot choices affect performance.", ["pivot", "partitions", "performance"]),
        fact("Why might one sorting algorithm be chosen over another?", "The choice depends on input size and order, memory limits, stability needs, worst-case behaviour and implementation cost.", ["memory", "stability", "worst-case"]),
      ]},
      { slug: "structure-algorithms", title: "Algorithms for data structures", summary: "Manipulate stacks, queues, linked lists and trees and trace traversals.", facts: [
        fact("What are the core stack and queue operations?", "A stack uses push, pop and peek; a queue uses enqueue, dequeue and front operations.", ["push", "pop", "enqueue", "dequeue"]),
        fact("How is an item inserted into a linked list?", "References are changed so a predecessor points to the new node and the new node points to its successor.", ["references", "new node", "successor"]),
        fact("How is a binary search tree searched?", "Compare the target with a node and follow the left subtree for a smaller key or right subtree for a larger key.", ["compare", "left", "right"]),
        fact("What is depth-first post-order tree traversal?", "It visits the left subtree, then the right subtree, then the node itself.", ["left", "right", "node"]),
        fact("How does breadth-first traversal work?", "It uses a queue to visit nodes level by level, adding each node's unvisited children for later processing.", ["queue", "level", "children"]),
      ]},
      { slug: "pathfinding-optimisation", title: "Pathfinding and optimisation", summary: "Trace Dijkstra's and A* and recognise their assumptions.", facts: [
        fact("How does Dijkstra's algorithm find shortest paths?", "It repeatedly finalises the unvisited vertex with smallest tentative distance and relaxes its outgoing edges.", ["tentative", "smallest", "relaxes"]),
        fact("What restriction does Dijkstra's algorithm have?", "Its standard form requires non-negative edge weights for the greedy finalisation step to remain valid.", ["non-negative", "weights", "greedy"]),
        fact("How does A* choose the next node?", "It minimises the known cost from the start plus a heuristic estimate of the remaining cost to the goal.", ["known cost", "heuristic", "goal"]),
        fact("When does A* guarantee an optimal path?", "An admissible heuristic never overestimates the remaining cost; suitable consistency conditions support efficient optimal search.", ["admissible", "overestimates", "optimal"]),
        fact("Why can optimisation problems be computationally difficult?", "The number of possible solutions may grow combinatorially, so exact exhaustive search becomes impractical for large inputs.", ["combinatorially", "exhaustive", "impractical"]),
      ]},
    ],
  },
  {
    code: "3", slug: "programming-project", title: "Programming project", icon: "🏗️",
    description: "Analysis, design, iterative development, testing and evaluation for the 70-mark project.",
    units: [
      { slug: "project-analysis", title: "Analysis of the problem", summary: "Justify a computational problem, research it and define measurable success.", facts: [
        fact("What makes a suitable programming-project problem?", "It has sufficient complexity, clear stakeholders and scope, and can be solved through a substantial programmed computational solution.", ["complexity", "stakeholders", "programmed"]),
        fact("How should computational suitability be justified?", "Explain how inputs, outputs, rules, data and processes can be represented and automated using computational methods.", ["inputs", "rules", "automated"]),
        fact("Why identify stakeholders?", "Their needs, expertise and working context determine requirements, usability and how the solution's success should be judged.", ["needs", "context", "success"]),
        fact("What should research contribute?", "It should investigate the problem and comparable solutions, then justify useful approaches, essential features and limitations.", ["comparable", "approaches", "limitations"]),
        fact("What makes a success criterion effective?", "It is specific, measurable, relevant to stakeholder needs and testable using identified evidence.", ["specific", "measurable", "testable"]),
      ]},
      { slug: "project-design", title: "Design of the solution", summary: "Decompose the system and justify algorithms, data and testing.", facts: [
        fact("How should project decomposition be evidenced?", "Break the problem into coherent modules and justify their responsibilities, interfaces and dependencies.", ["modules", "interfaces", "dependencies"]),
        fact("What makes an algorithm design complete?", "Algorithms collectively cover the required processing, show data and control flow, and connect through clear inputs and outputs.", ["processing", "control flow", "inputs"]),
        fact("Why must data structures and classes be justified?", "The design should connect their operations, relationships and constraints to the solution's actual requirements.", ["operations", "relationships", "requirements"]),
        fact("What should usability design include?", "It should address navigation, feedback, error prevention, accessibility and the abilities and context of target users.", ["feedback", "accessibility", "users"]),
        fact("What belongs in a project test plan?", "Normal, boundary, erroneous and robustness tests with inputs, expected outcomes and reasons linked to requirements.", ["boundary", "expected", "requirements"]),
      ]},
      { slug: "iterative-development", title: "Iterative development and testing", summary: "Record prototypes, decisions, tests and remedial work throughout development.", facts: [
        fact("What evidence demonstrates iterative development?", "Dated or ordered versions show working increments, decisions, feedback, testing and justified changes over time.", ["versions", "feedback", "changes"]),
        fact("Why should prototypes be annotated?", "Annotations explain what was attempted, what was learned and why the next design or implementation decision followed.", ["attempted", "learned", "why"]),
        fact("How should code evidence be selected?", "Use focused extracts that demonstrate important algorithms, structures or techniques, with commentary explaining their purpose and quality.", ["focused", "algorithms", "commentary"]),
        fact("What is testing to inform development?", "Tests are run throughout implementation to reveal faults and guide specific, recorded remedial changes.", ["throughout", "faults", "remedial"]),
        fact("Why are unexplained screenshots weak evidence?", "They show an outcome but not the reasoning, implementation decisions, test conditions or learning that produced it.", ["reasoning", "conditions", "learning"]),
      ]},
      { slug: "project-evaluation", title: "Evaluation and maintainability", summary: "Use evidence to judge success, usability, robustness and future development.", facts: [
        fact("How should final robustness be evaluated?", "Use demanding and invalid inputs to show the system handles errors, limits and unexpected use without unacceptable failure.", ["invalid", "errors", "failure"]),
        fact("Why is user feedback important in evaluation?", "Representative users provide evidence about usability and fitness for their needs that developer testing may miss.", ["representative", "usability", "needs"]),
        fact("How should success criteria be evaluated?", "Judge each criterion individually using test results and stakeholder evidence, explaining fully met, partly met or unmet outcomes.", ["each", "evidence", "outcomes"]),
        fact("What makes software maintainable?", "Clear structure, meaningful names, modularity, suitable documentation and limited coupling make future correction and change safer.", ["modularity", "documentation", "coupling"]),
        fact("What makes a future-development proposal strong?", "It identifies a specific limitation or new need and explains a technically plausible, prioritised improvement.", ["limitation", "plausible", "improvement"]),
      ]},
    ],
  },
];

export const OCR_A_LEVEL_SOURCE_NOTES = [
  "OCR H446 A Level Computer Science specification version 3.0 (2026)",
  "OCR H446 official specification-at-a-glance and assessment guidance",
  "Physics & Maths Tutor OCR A Level revision-resource topic map",
  "Craig 'n' Dave OCR A Level H446 objective map",
] as const;
