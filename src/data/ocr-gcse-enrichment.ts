export type OcrUnitEnrichment = {
  workedExample: string;
  misconception: string;
  examTip: string;
  code?: string;
};

export const OCR_GCSE_ENRICHMENT: Record<string, OcrUnitEnrichment> = {
  "cpu-purpose-components": {
    workedExample: "When a game compares a score with a high score, the ALU performs the comparison, the control unit coordinates the instruction and registers hold the values currently being processed.",
    misconception: "Cache is not the same as a general-purpose register: both are fast and inside or close to the CPU, but registers hold the immediate operands and results for current instructions.",
    examTip: "For a component question, name the component, state its job and connect that job to processing an instruction.",
  },
  "fetch-decode-execute": {
    workedExample: "During fetch, the PC address is copied to the MAR, memory returns the instruction into the MDR, and the PC advances; the CU decodes it before it is executed.",
    misconception: "The PC stores an address, not the instruction itself; the current instruction travels through the MDR and is decoded by the control unit.",
    examTip: "Learn the direction of every transfer. OCR often awards separate marks for the named register and the data or address it stores.",
  },
  "cpu-performance": {
    workedExample: "Increasing cache can speed up repeated access to instructions in a loop because fewer requests need slower RAM, but the benefit depends on whether the required data is cached.",
    misconception: "More GHz or more cores does not guarantee the same percentage performance increase because architecture and the software workload also matter.",
    examTip: "Use cautious language such as ‘can improve’ and always explain the mechanism, not merely that the computer becomes faster.",
  },
  "embedded-systems": {
    workedExample: "A washing-machine controller reads sensors, controls the motor and follows one dedicated program, so it needs fewer resources than a general-purpose laptop.",
    misconception: "An embedded system is defined by being built into a larger product for a dedicated purpose, not simply by being small.",
    examTip: "Apply each characteristic to the device in the question: cost, power, reliability and real-time response are common scenario links.",
  },
  "primary-memory": {
    workedExample: "Opening a large image places its program instructions and working data in RAM; if RAM fills, pages may move to much slower virtual memory on secondary storage.",
    misconception: "ROM is not completely impossible to change in every real device; at GCSE, focus on it being non-volatile and normally holding startup firmware.",
    examTip: "In comparisons, write paired points: RAM is volatile whereas ROM is non-volatile; RAM holds current work whereas ROM holds startup instructions.",
  },
  "secondary-storage": {
    workedExample: "An action camera suits solid-state storage because it is portable, low-power and resistant to shock, while magnetic tape may suit cheap high-capacity archival backups.",
    misconception: "‘Best storage’ has no universal answer. A valid choice must be justified against the scenario's capacity, speed, durability, portability, reliability and cost.",
    examTip: "Give a property and its consequence: ‘no moving parts, so drops are less likely to cause mechanical damage’ earns more than ‘SSD is durable’.",
  },
  "units-and-calculations": {
    workedExample: "A 100 × 50 pixel image at 8-bit colour depth needs 100 × 50 × 8 = 40,000 bits, which is 5,000 bytes before metadata or compression.",
    misconception: "Do not mix bits and bytes: divide bits by 8 before converting bytes into KB, and use OCR's decimal 1,000-based units unless told otherwise.",
    examTip: "Write the formula, substitute with units, calculate, then convert units last so method marks remain visible.",
  },
  "data-representation-compression": {
    workedExample: "Binary 10110110 splits into 1011 and 0110, giving hexadecimal B6; adding 1 to 11111111 in 8 bits produces a ninth bit, so overflow occurs.",
    misconception: "A higher-resolution image has more pixels, while a higher colour depth provides more possible colours per pixel; both increase uncompressed size for different reasons.",
    examTip: "For shifts, state the direction, power-of-two effect and overflow or lost-bit limitation; for compression, link the method to acceptable quality loss.",
  },
  "network-types": {
    workedExample: "A school-site network is a LAN because it covers a limited area and is managed by one organisation; linking schools across a country creates a WAN using external infrastructure.",
    misconception: "The Internet is not owned by one organisation and a WAN is not defined simply by having many computers; geographical reach and infrastructure matter.",
    examTip: "When explaining performance, link the factor to throughput or delay: more simultaneous users share available bandwidth, so transfer time can increase.",
  },
  "topologies-and-models": {
    workedExample: "In a star, one broken device cable isolates that device, but a failed central switch can stop all communication; a mesh offers alternative routes at greater cost and complexity.",
    misconception: "Client-server and star describe different things: one is a network management model and the other is a physical or logical connection layout.",
    examTip: "A balanced comparison needs a benefit and a cost connected to the named organisation, not a memorised list with no scenario link.",
  },
  "connections-hardware": {
    workedExample: "A switch uses a destination MAC address to deliver a frame within the LAN, while a router uses an IP address to forward a packet towards another network.",
    misconception: "A wireless access point provides wireless access to a network; a router's defining role is forwarding between networks, although home devices often combine both jobs.",
    examTip: "Distinguish addresses precisely: MAC identifies a network interface locally, whereas IP supports logical addressing and routing across networks.",
  },
  "protocols-and-layers": {
    workedExample: "Entering a domain causes DNS to find an IP address; HTTPS transfers the web data securely, while TCP orders and checks the packets and IP routes them.",
    misconception: "SMTP sends email; POP normally downloads messages to a client, whereas IMAP synchronises messages and folders with the server.",
    examTip: "Do not expand an acronym alone. State the protocol's actual job and, where relevant, why that job is useful.",
  },
  "malware-and-attacks": {
    workedExample: "A Trojan may appear to be a game installer but secretly steals credentials; unlike a virus, its defining feature is disguise rather than attachment to a host file.",
    misconception: "Malware types and attack methods can overlap, but a virus, Trojan, denial of service and brute-force attack each has a distinct mechanism.",
    examTip: "Describe the chain ‘method → system effect → user or organisation consequence’ for developed security answers.",
  },
  "people-and-data-attacks": {
    workedExample: "A fake school-login email creates urgency, links to a copied page and captures credentials; staff training and checking the domain could interrupt the attack.",
    misconception: "Phishing is a form of social engineering, while SQL injection targets an application's unsafe database input handling.",
    examTip: "Match a prevention to the threat. Encryption protects intercepted data but does not by itself stop a user revealing a password to a phisher.",
  },
  "prevention": {
    workedExample: "If stolen credentials pass a password check, a separate phone-generated code can still block access; access levels then limit damage if an account is compromised.",
    misconception: "Hashing passwords, encrypting stored data and encrypting data in transit solve related but different security problems.",
    examTip: "Explain why the control reduces likelihood or impact, and acknowledge that no single control removes all risk.",
  },
  "finding-vulnerabilities": {
    workedExample: "An authorised penetration tester probes a test server, records an exploitable input flaw and reports it so developers can patch it before criminals discover it.",
    misconception: "Penetration testing is authorised and scoped; attempting the same access without permission may break the Computer Misuse Act.",
    examTip: "Use ‘defence in depth’ accurately: independent controls provide another barrier if one layer fails.",
  },
  "operating-system-purpose": {
    workedExample: "When a user saves a drawing, the application asks the operating system to display the interface, allocate memory, access the storage device and create the file.",
    misconception: "The operating system is systems software, not the same as the applications that run on top of it.",
    examTip: "For an OS function, describe what resource is managed and the service this provides to users or applications.",
  },
  "resource-management": {
    workedExample: "While music plays and a document is edited, the OS schedules CPU time, allocates separate memory and sends output through device drivers.",
    misconception: "Multitasking does not necessarily mean one CPU core executes every process at exactly the same instant; rapid scheduling can create the appearance of concurrency.",
    examTip: "Name drivers when explaining peripherals: they translate between the OS's standard requests and device-specific commands.",
  },
  "file-management": {
    workedExample: "A path such as /students/ada/report.txt identifies a location and filename, while permissions can allow Ada to edit it but classmates only to read it.",
    misconception: "A file extension suggests format and associated software; merely renaming an extension does not convert the underlying file data.",
    examTip: "Use concrete operations—create, copy, move, rename, delete, organise and set permissions—rather than saying only ‘manages files’.",
  },
  "utilities": {
    workedExample: "Defragmentation places fragmented magnetic-disk blocks together so the read head moves less; this benefit does not apply to solid-state access.",
    misconception: "Compression reduces size, encryption protects confidentiality and backup creates a recovery copy; these utilities are not interchangeable.",
    examTip: "Tie each utility to its mechanism and outcome, and remember that repeated SSD defragmentation adds unnecessary writes.",
  },
  "ethical-cultural": {
    workedExample: "Automated checkout can shorten queues and reduce costs but may remove some jobs and disadvantage customers who need assistance, so stakeholders experience different effects.",
    misconception: "Ethical is not a synonym for legal: an action may comply with law yet still be unfair, opaque or harmful.",
    examTip: "For 8-mark discussion, develop both sides, use the scenario, compare stakeholders and finish with a justified judgement.",
  },
  "privacy-and-environment": {
    workedExample: "A health app can personalise advice from collected data, but a breach could expose sensitive details; limiting collection and securing storage reduce the risk.",
    misconception: "Cloud services still use physical data centres, electricity, cooling equipment and hardware, so they do not remove environmental impact.",
    examTip: "Develop consequences beyond the first effect—for example, raw-material extraction can damage habitats and discarded devices can release hazardous substances.",
  },
  "legislation": {
    workedExample: "Guessing another user's password to view files is unauthorised access under the Computer Misuse Act, even if no file is changed or deleted.",
    misconception: "The Data Protection Act concerns personal data; copyright protects creative works, and the Computer Misuse Act addresses unauthorised computer access and impairment.",
    examTip: "Name the Act, identify the prohibited or controlled action and apply it to the exact facts in the scenario.",
  },
  "software-licences-evaluation": {
    workedExample: "A school may value proprietary support and compatibility, while open-source code may allow customisation and inspection; budget and staff expertise determine the better fit.",
    misconception: "Open-source does not automatically mean free of every restriction, and proprietary software is not automatically more secure.",
    examTip: "A justified conclusion should state which option is preferable for this scenario and why its most important benefit outweighs the drawback.",
  },
  "computational-thinking": {
    workedExample: "For a route-planning app, decomposition separates maps, route calculation and interface; abstraction keeps relevant roads and weights while hiding visual detail.",
    misconception: "Abstraction removes irrelevant detail from a model; decomposition splits the overall problem into manageable parts.",
    examTip: "Apply each technique to the named problem instead of giving only a dictionary definition.",
  },
  "designing-algorithms": {
    workedExample: "For a ticket calculator, inputs are age and quantity, processing selects prices and multiplies them, and output is the total cost.",
    misconception: "Pseudocode is structured and unambiguous but is not tied to one executable programming language; a flowchart shows the same logic visually.",
    examTip: "Trace every branch and loop against the requirements, including edge cases, before judging that an algorithm is correct.",
    code: "age = input(\"Enter age\")\nif age < 16 then\n    output(\"Child ticket\")\nelse\n    output(\"Adult ticket\")\nendif",
  },
  "tracing-errors": {
    workedExample: "If total starts at 0 and a loop adds 2 three times, a trace table records 0, 2, 4 and 6, making an incorrect loop bound visible.",
    misconception: "A syntax error breaks language rules; a logic error can run successfully but produce the wrong output.",
    examTip: "Create one column for every variable, condition and output, then update values in execution order rather than guessing the final result.",
  },
  "search-sort": {
    workedExample: "Binary search for 42 in [8, 17, 42, 61, 90] checks 42 first; on unsorted data the discard-half decision would not be reliable.",
    misconception: "Binary search requires sorted data, while merge sort itself divides and merges data; these are different algorithms with different purposes.",
    examTip: "When tracing a sort, show the state of the list after each pass or insertion and follow the named algorithm exactly.",
    code: "found = false\nindex = 0\nwhile index < items.length and found == false\n    if items[index] == target then\n        found = true\n    else\n        index = index + 1\n    endif\nendwhile",
  },
  "constructs-operators": {
    workedExample: "A program can use sequence to input a mark, selection to choose a grade and iteration to repeat this for every student; 17 DIV 5 is 3 and 17 MOD 5 is 2.",
    misconception: "Selection chooses a path once a condition is tested; iteration repeats a block while or until its control rule is met.",
    examTip: "Dry-run conditions carefully, especially AND versus OR and the exact number of loop iterations.",
    code: "for count = 1 to 5\n    mark = input(\"Mark\")\n    if mark >= 50 then\n        output(\"Pass\")\n    else\n        output(\"Review\")\n    endif\nnext count",
  },
  "variables-data-types": {
    workedExample: "Use an integer for numberOfStudents, a real for averageMark, a Boolean for hasSubmitted, a character for grade and a string for studentName.",
    misconception: "A character contains one symbol even if that symbol is a digit; an integer contains a numeric value that arithmetic can use.",
    examTip: "Choose the narrowest appropriate type and justify it using the values the variable must store.",
  },
  "strings-files-data": {
    workedExample: "A two-dimensional array can hold rows of scores, while a record can group one student's string name, integer score and Boolean attendance status.",
    misconception: "An array normally contains values of one type under indexed positions; a record groups named fields that may have different types.",
    examTip: "For file algorithms, include the full lifecycle: open in the correct mode, read or write, then close the file.",
    code: "file = open(\"scores.txt\")\nline = file.readLine()\nwhile line != \"\"\n    output(line)\n    line = file.readLine()\nendwhile\nfile.close()",
  },
  "subprograms-sql-random": {
    workedExample: "SELECT name FROM Students WHERE score >= 70 returns only the name field for records meeting the score condition.",
    misconception: "A parameter is the named input in a subprogram definition; an argument is the value supplied when it is called, although GCSE questions may use the terms less strictly.",
    examTip: "State scope precisely and trace arrays passed into or returned from subprograms; do not assume every variable is global.",
    code: "function mean(scores)\n    total = 0\n    for score in scores\n        total = total + score\n    next score\n    return total / scores.length\nendfunction",
  },
  "defensive-design": {
    workedExample: "A login limits repeated attempts, validates input, shows a non-specific failure message and records suspicious activity without revealing whether an account exists.",
    misconception: "Defensive design covers accidental misuse as well as deliberate attacks; useful feedback should help legitimate users without leaking sensitive detail.",
    examTip: "Explain the anticipated misuse, the defensive feature and how the feature makes failure safer.",
  },
  "validation": {
    workedExample: "For an exam mark from 0 to 80, −1 and 81 are invalid, 0 and 80 are boundary values, and 47 is normal valid data.",
    misconception: "Validation checks whether data follows rules; verification checks whether it was entered or copied accurately, and valid data can still be factually wrong.",
    examTip: "Choose test values just below, at and just above each boundary and state the expected accept/reject result.",
  },
  "maintainability": {
    workedExample: "Replacing repeated tax calculations with calculateTax(income) creates one named, testable location to correct when the rule changes.",
    misconception: "Comments are most useful for purpose and non-obvious decisions; comments that merely translate every simple line can make code harder to maintain.",
    examTip: "Connect each technique to future change: clear identifiers, indentation and modular subprograms reduce the time and risk of modification.",
  },
  "testing": {
    workedExample: "For a permitted age of 13–18, a plan could use 15 as normal, 13 and 18 as boundaries, 12 and 19 as invalid, and text as erroneous data.",
    misconception: "Invalid data breaks the value rules, whereas erroneous data is the wrong type or format and may not be processable at all.",
    examTip: "A complete test plan includes reason, test data, expected result, actual result and pass/fail, followed by retesting after fixes.",
  },
  "boolean-values": {
    workedExample: "Three Boolean inputs require 2³ = 8 truth-table rows, ordered systematically so no input combination is omitted.",
    misconception: "Truth-table rows count input combinations, not gates: n independent binary inputs always produce 2ⁿ rows.",
    examTip: "List inputs in a consistent binary pattern, calculate intermediate columns, then calculate the final output.",
  },
  "and-or": {
    workedExample: "For A=1 and B=0, A AND B is 0 but A OR B is 1; inclusive OR is also 1 when both inputs are 1.",
    misconception: "Boolean OR is inclusive unless the question explicitly gives an exclusive-OR gate, which is outside the core AND/OR/NOT requirement.",
    examTip: "Use the exact rule—AND needs all inputs true, OR needs at least one—rather than relying on the gate's visual shape.",
  },
  "not": {
    workedExample: "If doorClosed is 0, NOT doorClosed is 1, so an alarm condition can activate when the door is not closed.",
    misconception: "NOT has one input and reverses it; the small output circle indicates inversion rather than an extra input.",
    examTip: "Apply NOT before combining its result with other gates unless brackets or the circuit specify a different structure.",
  },
  "combined-logic": {
    workedExample: "For output = (A AND B) OR NOT C, calculate A AND B and NOT C in separate columns before the final OR column.",
    misconception: "Do not jump directly from inputs to the final answer in a multi-gate circuit; an incorrect intermediate value corrupts every later stage.",
    examTip: "Label intermediate wires. This creates visible method and makes both a circuit and its truth table easier to check.",
  },
  "language-levels": {
    workedExample: "A high-level program can often be translated for different processors, while processor-specific low-level instructions offer direct control but reduce portability.",
    misconception: "High level does not mean ‘more powerful’ and low level does not mean ‘old’; the distinction is the amount of abstraction from hardware.",
    examTip: "Compare development time, readability, portability, hardware control and performance in the context given.",
  },
  "machine-code-translation": {
    workedExample: "A CPU can execute only the binary operation codes in its instruction set, so human-readable source must be translated into matching machine code.",
    misconception: "Source code and machine code are both program representations, but only compatible machine code executes directly on the processor.",
    examTip: "The current OCR J277 specification requires why translators are needed and compiler/interpreter comparison; assembler detail is not required.",
  },
  "compiler-interpreter": {
    workedExample: "A compiled game can be distributed as an executable and run quickly without its source translator, while interpreted code supports immediate line-by-line testing.",
    misconception: "A compiler translates the whole program before execution; an interpreter translates and executes statements as the program runs.",
    examTip: "Give matched advantages and disadvantages tied to translation time, execution speed, error reporting, portability and source distribution.",
  },
  "ide": {
    workedExample: "A breakpoint before a faulty loop lets the programmer step through iterations and inspect the counter until its value diverges from the expected trace.",
    misconception: "An IDE is a collection of integrated development tools; it is not itself a programming language.",
    examTip: "Name the facility and its benefit: syntax highlighting helps spot language structure, while diagnostics identify an error and its location.",
  },
};

export function getOcrGcseEnrichment(unitSlug: string) {
  const enrichment = OCR_GCSE_ENRICHMENT[unitSlug];
  if (!enrichment) throw new Error(`Missing OCR GCSE enrichment for ${unitSlug}`);
  return enrichment;
}
