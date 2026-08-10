export type OcrALevelUnitEnrichment = {
  workedExample: string;
  misconception: string;
  examTip: string;
  code?: string;
};

export const OCR_A_LEVEL_ENRICHMENT: Record<string, OcrALevelUnitEnrichment> = {
  "processor-components": {
    workedExample: "For LDA 42, the PC address moves to the MAR, memory returns the instruction through the MDR to the CIR, the CU decodes LDA and the operand 42 identifies the address whose value is loaded into the accumulator.",
    misconception: "The MDR holds data or instructions currently crossing the memory interface; it is not another name for the address held in the MAR.",
    examTip: "Trace every register transfer in order and state what the bus carries; OCR commonly rewards the correct register plus the change in its contents.",
  },
  "instruction-processing": {
    workedExample: "A three-stage pipeline can fetch instruction 3 while decoding instruction 2 and executing instruction 1, increasing throughput, although a branch may force prefetched instructions to be flushed.",
    misconception: "Pipelining does not make one instruction complete in less time; it increases the number completed per unit time once the pipeline is full.",
    examTip: "When comparing architectures, link separate or shared instruction/data pathways to simultaneous access, cost, complexity and the Von Neumann bottleneck.",
  },
  "processor-types-performance": {
    workedExample: "A GPU suits applying the same matrix operation to thousands of image pixels, but a branch-heavy sequential control task may gain little because its work cannot be divided efficiently.",
    misconception: "Doubling cores does not automatically halve execution time: serial sections, communication and scheduling overhead limit the speed-up.",
    examTip: "Avoid claiming one processor is universally faster; identify the workload, then connect instruction complexity or parallelism to performance and power use.",
  },
  "input-output-storage": {
    workedExample: "An outdoor wildlife sensor favours low-power solid-state storage because it has no moving parts, whereas an archive may favour optical media for distribution or magnetic storage for low cost per gigabyte.",
    misconception: "Virtual storage is remote network storage; virtual memory is an operating-system technique that uses secondary storage when RAM is insufficient.",
    examTip: "Make a recommendation only after comparing capacity, access speed, durability, portability, reliability, power and cost in the stated context.",
  },
  "operating-systems": {
    workedExample: "Round robin rotates processes through time slices; shortest remaining time can pre-empt a long process when a shorter one arrives; a multilevel feedback queue changes priority using observed process behaviour.",
    misconception: "An RTOS is defined by predictable deadline-bound responses, not simply by being fast, and shortest-job scheduling can starve long processes.",
    examTip: "For scheduling, trace the ready queue and calculate completion or waiting order; for OS types, distinguish distributed, embedded, multitasking, multi-user and real-time requirements.",
  },
  "system-services-virtualisation": {
    workedExample: "A Java virtual machine executes bytecode on different host systems, while a hypervisor can isolate a Linux server and a Windows server on the same physical machine.",
    misconception: "A virtual machine can emulate an instruction-execution environment or a complete computer; it is not limited to cloud-hosted operating systems.",
    examTip: "Separate the roles: firmware starts and checks hardware, a driver translates device requests, and a VM provides an emulated execution environment.",
  },
  "translators-libraries": {
    workedExample: "The lexer converts total=price+2 into tokens, the parser checks grammar, code generation produces target instructions, optimisation removes avoidable work, the linker resolves library references and the loader places the executable in memory.",
    misconception: "A compiler can report many errors after analysing a source program, whereas an interpreter does not necessarily translate and save a standalone executable.",
    examTip: "Name the representation entering and leaving each stage—characters, tokens, syntax tree or intermediate form, object code, executable and memory image.",
  },
  "development-paradigms": {
    workedExample: "A safety-critical system with stable requirements may use documented waterfall stages; an uncertain user interface benefits from RAD prototypes; spiral development revisits objectives while explicitly analysing risk.",
    misconception: "Agile is not development without planning or documentation, and assembly addressing modes describe how an operand is obtained rather than different opcodes.",
    examTip: "Know immediate, direct, indirect and indexed addressing and be able to trace simple LMC code as well as compare waterfall, agile, XP, spiral and RAD.",
    code: "        INP\n        STA VALUE\n        LDA VALUE\n        ADD ONE\n        OUT\n        HLT\nVALUE   DAT 0\nONE     DAT 1",
  },
  "compression-encryption-hashing": {
    workedExample: "RLE turns AAAAABB into 5A2B, but may enlarge ABCDE; a salted password hash stores a digest for comparison, while asymmetric encryption can exchange a secret later used by faster symmetric encryption.",
    misconception: "Hashing is designed to be one-way and is not encryption; compression reduces representation size but does not itself provide confidentiality.",
    examTip: "Choose a technique from its purpose: exact reconstruction, acceptable quality loss, confidentiality, integrity checking, password verification or indexing.",
  },
  "relational-databases": {
    workedExample: "Students(StudentID, Name) and Loans(LoanID, StudentID, DueDate) form a one-to-many relationship; StudentID is a foreign key in Loans and a transaction can lock a record while preserving ACID properties.",
    misconception: "A database index speeds retrieval by storing an additional searchable structure, but costs storage and makes inserts or updates more expensive.",
    examTip: "Be ready to normalise to 3NF, draw cardinality, enforce referential integrity and interpret or modify SELECT, INSERT, UPDATE and DELETE statements.",
    code: "SELECT Students.Name, Loans.DueDate\nFROM Students, Loans\nWHERE Students.StudentID = Loans.StudentID\nAND Loans.DueDate < CURRENT_DATE;",
  },
  "networks-internet": {
    workedExample: "A browser asks DNS for an IP address, sends HTTPS data through application, transport, internet and link layers, and routers forward packets between networks while switches use addresses within a LAN.",
    misconception: "A switch connects devices within a network and a router connects networks; DNS resolves names but does not carry the requested web page.",
    examTip: "Connect hardware and protocols into one journey, then evaluate threats and controls such as firewalls, proxies and encryption at the point they act.",
  },
  "web-technologies": {
    workedExample: "A browser validates a form quickly with JavaScript, sends accepted data to server-side code for trusted processing, and receives HTML whose structure is styled by CSS.",
    misconception: "PageRank estimates importance from the link graph; it is not simply a count of keywords or page visits and links do not all carry equal weight.",
    examTip: "For client/server processing, discuss responsiveness, bandwidth, compatibility, trust, data access, security and server load rather than only location.",
    code: "<button id=\"check\">Check</button>\n<script>\n  document.querySelector('#check').onclick = () => alert('Checked');\n</script>",
  },
  "binary-number-representation": {
    workedExample: "In 8-bit two's complement, -18 is 11101110 and adding 00010110 gives 00000100, while a normalised floating representation keeps the first significant bits at the start of the mantissa and adjusts the exponent.",
    misconception: "A carry out is not always signed overflow; signed overflow occurs when two values of the same sign produce a result with the opposite sign.",
    examTip: "Keep the stated bit widths, show carries and shifts, and distinguish range controlled mainly by the exponent from precision controlled by the mantissa.",
  },
  "bitwise-text-representation": {
    workedExample: "Using mask 00001111 with AND extracts the low nibble, OR 10000000 forces the top bit on, XOR toggles selected flags and a logical left shift by two multiplies an unsigned value by four if no significant bits are lost.",
    misconception: "A logical shift inserts zeros; do not assume a right shift preserves a negative sign unless the question explicitly describes an arithmetic shift.",
    examTip: "Write operands vertically, calculate each bit independently and state whether the mask extracts, sets, clears or toggles bits.",
  },
  "data-structures": {
    workedExample: "A hash table calculates a bucket from a key and resolves a collision by chaining or probing; a linked-list insertion redirects references without shifting every later item.",
    misconception: "A binary tree allows at most two children, but only a binary search tree also maintains an ordering rule for efficient directed search.",
    examTip: "Trace creation, traversal, insertion and deletion as well as definitions; show every pointer, top/front index or collision update after each operation.",
  },
  "boolean-algebra-circuits": {
    workedExample: "NOT(A AND B) becomes NOT A OR NOT B by De Morgan's law; a Karnaugh group of four adjacent 1s removes variables that change within the group.",
    misconception: "Karnaugh-map adjacency wraps across opposite edges, groups must contain powers of two, and overlapping groups are allowed when they simplify the expression.",
    examTip: "Label intermediate outputs in a circuit, derive the Boolean expression, build the full truth table and then simplify one justified algebraic step at a time.",
  },
  "computing-law": {
    workedExample: "An employee who deliberately accesses a restricted account may breach computer-misuse rules; copying its proprietary source code raises a separate copyright issue; processing customer data adds data-protection duties.",
    misconception: "The same scenario can engage more than one law, but ethical harm and illegality are not synonyms and must be evaluated separately.",
    examTip: "Apply the rule to the facts, identify the affected stakeholder and explain the consequence instead of merely naming legislation.",
  },
  "automation-ai-work": {
    workedExample: "An automated hiring model may process applications consistently and quickly, but historic training data can reproduce discrimination and an opaque rejection makes challenge or accountability difficult.",
    misconception: "Removing a human from the final click does not remove human responsibility for data selection, objectives, deployment and oversight.",
    examTip: "Develop both sides through stakeholders, then propose a control such as human review, auditing, explainability or appeal and reach a contextual judgement.",
  },
  "privacy-censorship-communication": {
    workedExample: "School monitoring may protect pupils and investigate misuse, yet collecting every message can intrude on privacy, chill legitimate expression and create a high-impact data set if breached.",
    misconception: "Consent alone does not make any monitoring ethical; necessity, proportionality, transparency, security and meaningful alternatives still matter.",
    examTip: "A strong extended response compares safety and rights, considers implementation safeguards and explains why the final balance fits the scenario.",
  },
  "environment-ownership-culture": {
    workedExample: "Streaming widens access to culture but consumes data-centre and network energy; short device replacement cycles add extraction and e-waste costs that repairable design and reuse can reduce.",
    misconception: "Digital services have physical infrastructure and environmental costs even when the user owns no local copy or storage medium.",
    examTip: "Cover a technology's whole life cycle and at least two stakeholder perspectives before making a qualified conclusion.",
  },
  "thinking-abstractly": {
    workedExample: "A route planner models roads as weighted edges and junctions as vertices, retaining distance or time while ignoring building colour because it does not affect the requested route.",
    misconception: "Abstraction is purposeful simplification, not merely removing as much information as possible; omitted relevant detail makes the model invalid for its task.",
    examTip: "State what is retained, what is omitted and why each choice supports the model's intended decision or output.",
  },
  "thinking-ahead": {
    workedExample: "Before designing a timetable search, define dates and constraints as inputs, matching journeys as outputs, valid-date preconditions, cached station data and a reusable fare component.",
    misconception: "Cached data can reduce latency but may be stale; reuse also requires a stable interface rather than copying code into several places.",
    examTip: "Turn a scenario into a contract: inputs, outputs, preconditions, reusable components and the benefit or drawback of any cache.",
  },
  "procedural-logical-thinking": {
    workedExample: "A booking problem decomposes into availability, payment and confirmation; procedural thinking orders them, while logical thinking expresses when payment is permitted and how failure changes the route.",
    misconception: "Decomposition identifies manageable components, while abstraction decides which details each model exposes; they often cooperate but are not the same process.",
    examTip: "Show dependencies between sub-procedures and write decision conditions precisely enough that every possible flow is determined.",
  },
  "thinking-concurrently": {
    workedExample: "A game can update independent non-player characters concurrently, but simultaneous writes to a shared score need synchronisation or the final value may depend on timing.",
    misconception: "Concurrent tasks overlap in time but need not run simultaneously; parallel execution requires hardware that genuinely performs work at the same instant.",
    examTip: "Identify independent sections, shared state and coordination costs before claiming a speed or responsiveness benefit.",
  },
  "programming-constructs": {
    workedExample: "A function with local total and count variables can iterate through an array and return a mean; keeping these values local prevents an unrelated module changing them unexpectedly.",
    misconception: "A function's return value is distinct from output shown to the user, and assignment changes state whereas equality comparison asks a Boolean question.",
    examTip: "Trace scope, conditions and loop boundaries carefully, using OCR pseudocode conventions consistently in code-writing answers.",
    code: "function mean(values)\n    total = 0\n    for each value in values\n        total = total + value\n    next value\n    return total / values.length\nendfunction",
  },
  "recursion-parameters-ide": {
    workedExample: "factorial(4) waits for factorial(3), factorial(2) and factorial(1); the base case returns 1 and the call stack unwinds to produce 24.",
    misconception: "A recursive call must move toward a reachable base case; merely including an IF statement does not prevent infinite recursion or stack exhaustion.",
    examTip: "Trace each call and return on a separate line, and state whether parameter mutation persists under by-value or by-reference semantics.",
    code: "function factorial(n)\n    if n = 0 then\n        return 1\n    endif\n    return n * factorial(n - 1)\nendfunction",
  },
  "object-oriented-techniques": {
    workedExample: "Account encapsulates a private balance and exposes deposit(); SavingsAccount inherits common account behaviour and overrides calculateInterest(), so a collection of Accounts can invoke the appropriate method polymorphically.",
    misconception: "A class is a definition and an object is an instance; inheritance models an is-a relationship while composition models has-a collaboration.",
    examTip: "In a design answer identify classes, attributes, methods and relationships, then explain how encapsulation, inheritance or polymorphism improves the solution.",
  },
  "computational-methods": {
    workedExample: "A maze solver decomposes the grid representation from route search, uses backtracking to abandon dead ends, and may use a distance heuristic to explore promising positions first.",
    misconception: "A heuristic guides work and may find a good answer quickly, but unless its conditions are established it does not guarantee the optimal answer.",
    examTip: "Choose among backtracking, data mining, heuristics, performance modelling, pipelining and visualisation by connecting the method to the problem feature it exploits.",
  },
  "analysis-complexity": {
    workedExample: "Binary search performs about log2(n) comparisons on ordered data, while linear search can inspect n items; for one tiny unsorted list, however, sorting first may outweigh the theoretical gain.",
    misconception: "Big O describes growth as input size increases, not an exact runtime in seconds, and two algorithms in the same class can still differ substantially in practice.",
    examTip: "State time and space separately, identify the case being analysed and connect input characteristics and constraints to your final choice.",
  },
  "searching-sorting": {
    workedExample: "Merge sort divides [7,2,5,1] to single items and merges them as [2,7], [1,5], then [1,2,5,7]; quick sort instead partitions values around a chosen pivot.",
    misconception: "Binary search requires ordered data, and quick sort's typical efficiency does not remove its poor worst case when pivots create highly unbalanced partitions.",
    examTip: "Show the complete state after each pass, insertion, partition or merge and justify suitability using ordering, size, memory, stability and worst-case behaviour.",
  },
  "structure-algorithms": {
    workedExample: "Breadth-first traversal enqueues children level by level; post-order depth-first traversal recursively visits left, right, node, which is useful when deleting a tree from its leaves upward.",
    misconception: "Depth-first post-order is specifically left subtree, right subtree, node for OCR; it is not interchangeable with pre-order or in-order traversal.",
    examTip: "Maintain an explicit stack, queue or pointer table while tracing and record its contents after each operation, not only the final traversal.",
  },
  "pathfinding-optimisation": {
    workedExample: "Dijkstra selects the unvisited vertex with the smallest tentative distance and relaxes neighbours; A* adds an admissible estimate to the known path cost so it can prioritise promising routes.",
    misconception: "Dijkstra's greedy finalisation assumes non-negative edges, while A* optimality depends on a suitable heuristic rather than simply using any estimate.",
    examTip: "For each iteration show the chosen node, tentative-distance updates, predecessor and visited set, then reconstruct the path rather than reporting only its length.",
  },
  "project-analysis": {
    workedExample: "A clinic-booking project identifies receptionists and patients, researches comparable systems, justifies automation, defines hardware constraints and turns needs into measurable criteria such as completing a valid booking within 60 seconds.",
    misconception: "A feature list is not analysis: top-band evidence justifies computational suitability, stakeholder needs, research-derived choices, limitations and measurable success criteria.",
    examTip: "Tie every proposed requirement and success criterion to named research or stakeholder evidence and make the test method explicit.",
  },
  "project-design": {
    workedExample: "A booking solution decomposes authentication, availability and persistence; designs algorithms and class relationships; specifies validation; and pairs each requirement with normal, boundary and erroneous test data.",
    misconception: "Screenshots of an interface do not by themselves describe a complete solution; algorithms, data structures, classes, validation, usability and test design all require justification.",
    examTip: "Make the design detailed enough for another competent programmer to implement and keep traceability from each requirement to design and test evidence.",
  },
  "iterative-development": {
    workedExample: "Iteration 3 adds conflict detection, records the algorithm and code extract, runs a clashing-booking test, diagnoses the failed boundary comparison, corrects it and reruns the test successfully.",
    misconception: "A chronological screenshot diary is weak unless each iteration explains the decision, implementation, test result and remedial action.",
    examTip: "Select evidence that proves technical complexity and reasoning; annotate code and tests rather than pasting entire files or unexplained screenshots.",
  },
  "project-evaluation": {
    workedExample: "The final evaluation cross-references test 18 and receptionist feedback to judge criterion C4 partly met, explains the remaining concurrency limitation and proposes transaction locking as a technically plausible improvement.",
    misconception: "Saying the program works is not evaluation; conclusions need test and user evidence, comparison with every success criterion, limitations, maintainability and realistic development.",
    examTip: "Use the 20-mark weighting: evaluate robustness and usability in depth, show the final product clearly and develop maintenance and improvement reasoning.",
  },
};

export function getOcrALevelEnrichment(unitSlug: string) {
  const enrichment = OCR_A_LEVEL_ENRICHMENT[unitSlug];
  if (!enrichment) throw new Error(`Missing OCR A-level enrichment for ${unitSlug}`);
  return enrichment;
}
