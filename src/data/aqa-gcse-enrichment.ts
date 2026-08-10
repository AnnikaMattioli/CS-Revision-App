export type AqaGcseUnitEnrichment = {
  workedExample: string;
  misconception: string;
  examTip: string;
  code?: string;
};

export const AQA_GCSE_ENRICHMENT: Record<string, AqaGcseUnitEnrichment> = {
  "representing-algorithms": {
    workedExample: "For a cinema-booking algorithm, decompose seat selection, payment and confirmation; abstract away seat colour; then identify customer choices as inputs and the booking reference as output.",
    misconception: "An algorithm is the finite method for solving a problem, while a program is one implementation of that algorithm in executable code.",
    examTip: "Follow the requested representation exactly: AQA may ask for pseudocode, program code or a flowchart, and the wrong form can lose access to marks.",
    code: "price = 0\nage = USERINPUT\nIF age < 16 THEN\n    price = 6\nELSE\n    price = 10\nENDIF\nOUTPUT price",
  },
  "tracing-and-efficiency": {
    workedExample: "A trace table for total = total + value records every new total and condition result, exposing the first step where an incorrect loop produces the wrong output.",
    misconception: "For AQA GCSE, algorithm efficiency questions compare time or number of operations informally; formal Big-O analysis and space-efficiency calculations are not required.",
    examTip: "When determining purpose, describe the overall input-to-output transformation, not a line-by-line translation of the code.",
  },
  searching: {
    workedExample: "Binary search for 31 in [4, 12, 18, 31, 45] checks the middle value 18, discards the lower half and then finds 31; this only works because the list is ordered.",
    misconception: "Linear search does not require sorted data, while binary search does; sorting first may cost more time than it saves for a single small search.",
    examTip: "For a trace, state each item or midpoint checked and which part remains, then justify the algorithm choice using list size and ordering.",
  },
  sorting: {
    workedExample: "Bubble sorting [5, 2, 4] compares and swaps adjacent values to reach [2, 4, 5]; merge sort instead divides the list into smaller lists and merges them in order.",
    misconception: "Insertion sort is not part of AQA 8525's assessed sorting requirement; students compare the mechanics and time efficiency of bubble and merge sort.",
    examTip: "Show the list after each complete pass or merge stage and stop bubble sort early only when a full pass makes no swaps.",
  },
  "network-purpose-types": {
    workedExample: "Bluetooth headphones and a phone form a PAN, a school-site network is a LAN, and links between offices across the country form a WAN.",
    misconception: "Network type is not decided by device count: PAN, LAN and WAN refer mainly to range, ownership and infrastructure.",
    examTip: "A network evaluation needs both a benefit and a developed drawback, such as shared files improving collaboration but increasing security and management requirements.",
  },
  "performance-and-hardware": {
    workedExample: "A fixed desktop lab may use copper Ethernet for low-cost reliable links, while fibre suits a long high-capacity building connection and Wi-Fi supports mobile tablets.",
    misconception: "Wireless is not automatically slower in every situation and fibre is not automatically the best choice; cost, range, interference, mobility and installation determine suitability.",
    examTip: "Name a connection property and its scenario consequence: fibre resists electromagnetic interference, so nearby electrical equipment is less likely to corrupt transmissions.",
  },
  "models-and-services": {
    workedExample: "A browser uses HTTP or HTTPS at the application layer, TCP manages reliable host communication at transport, IP routes at internet, and the NIC operates at link.",
    misconception: "The layers describe responsibilities, not four separate physical networks; protocols at different layers cooperate during one communication.",
    examTip: "Memorise the order application, transport, internet, link and attach at least one accurate function or protocol to each layer.",
  },
  "packets-addressing-layers": {
    workedExample: "A firewall blocks traffic against its rules, encryption protects intercepted contents, authentication checks the user and MAC filtering permits or blocks a network adapter's address.",
    misconception: "A MAC filter is an access control, not encryption, and MAC addresses can be imitated; several controls should therefore work together.",
    examTip: "For security questions, match each control to the threat and explain how it reduces either likelihood or impact.",
  },
  "security-fundamentals": {
    workedExample: "An unpatched laptop can be exploited through a known flaw, while an infected USB drive can introduce malware even when the internet connection is protected.",
    misconception: "Cyber security includes processes and user behaviour as well as technical tools; a secure firewall cannot correct excessive access permissions or unsafe removable media.",
    examTip: "Use the chain source of weakness, exploitation method, asset affected and resulting consequence.",
  },
  "people-and-password-threats": {
    workedExample: "A caller invents an IT-support story to blag a password, a phishing email links to a fake login, and a pharming attack redirects a correctly typed address to a fraudulent site.",
    misconception: "Phishing sends a deceptive communication, pharming redirects traffic, and shouldering involves direct observation; do not use the terms interchangeably.",
    examTip: "Describe what the attacker does and how the victim is manipulated before suggesting a matching prevention such as checking addresses or user training.",
  },
  "malware-and-attacks": {
    workedExample: "A Trojan appears to be a useful download, spyware secretly collects activity, and a virus attaches to a host that spreads it when executed.",
    misconception: "A Trojan is defined by disguise and does not need to self-replicate; a virus replicates through an infected host.",
    examTip: "AQA names virus, Trojan and spyware, so give the distinctive mechanism and one suitable prevention for the named type.",
  },
  "prevention-and-detection": {
    workedExample: "A mobile banking app may combine a password, fingerprint, CAPTCHA and email confirmation; an internal penetration test then checks what a credentialed insider could reach.",
    misconception: "Biometrics compare a captured characteristic with a stored template; they are not secret in the same way as a password and need secure handling.",
    examTip: "Distinguish test perspectives: internal testers start with knowledge or credentials, whereas external testers simulate an attacker without them.",
  },
  "database-foundations": {
    workedExample: "A Students table stores one record per student and fields such as StudentID, Name and TutorGroup, with data types restricting the kind of value each field accepts.",
    misconception: "A relational database is not simply a spreadsheet with several tabs; keys create defined relationships and help reduce redundancy and inconsistency.",
    examTip: "Use AQA's terms table, record, field, data type, primary key and foreign key precisely in any database description.",
  },
  "keys-and-relationships": {
    workedExample: "StudentID uniquely identifies a Students record; the same value stored as a foreign key in Loans connects many loan records to one student without repeating the student's details.",
    misconception: "A foreign key does not have to be unique because many records may relate to the same primary-key record.",
    examTip: "When choosing a primary key, justify that it is unique, present for every record and stable rather than merely convenient.",
  },
  "selecting-data": {
    workedExample: "SELECT Name, Score FROM Students WHERE Score >= 70 ORDER BY Score DESC returns two fields for qualifying records, highest score first.",
    misconception: "SELECT chooses fields, WHERE filters records and ORDER BY sorts the returned rows; each clause has a different job.",
    examTip: "Copy field and table names exactly, quote text values, leave numbers unquoted and check whether ASC or DESC is required.",
    code: "SELECT Name, Score\nFROM Students\nWHERE Score >= 70\nORDER BY Score DESC",
  },
  "combining-and-changing-data": {
    workedExample: "UPDATE Students SET TutorGroup = '10B' WHERE StudentID = 42 changes one intended record; omitting WHERE could change every row.",
    misconception: "AQA can require SELECT queries using up to two tables, but an UPDATE or DELETE must still be restricted carefully with a condition.",
    examTip: "Before accepting a data-changing query, read it as a sentence and identify exactly which records its WHERE condition selects.",
    code: "INSERT INTO Students (StudentID, Name)\nVALUES (42, 'Ada')\n\nDELETE FROM Students\nWHERE StudentID = 42",
  },
  "ethical-and-stakeholder-impacts": {
    workedExample: "An autonomous vehicle may reduce human driving errors but creates questions about responsibility, employment, safety decisions and unequal access for different stakeholders.",
    misconception: "An ethical issue is not automatically illegal; legal compliance may still leave concerns about fairness, transparency or harm.",
    examTip: "AQA extended responses reward developed context: consider citizens, organisations and government before reaching a justified conclusion.",
  },
  "privacy-and-data": {
    workedExample: "A wearable health device can personalise monitoring, but inaccurate or leaked readings could affect insurance, employment or personal safety.",
    misconception: "Consent is not meaningful if the person cannot understand the purpose or make a genuine choice, and consent does not remove the need for security or accuracy.",
    examTip: "Balance a specific benefit of processing against a privacy risk, then propose a proportionate safeguard rather than claiming all collection should stop.",
  },
  "law-and-ownership": {
    workedExample: "Copying proprietary code without permission may breach copyright, while accessing a server without authorisation is a computer-misuse issue even if nothing is deleted.",
    misconception: "Copyright, computer misuse and data protection address different conduct; name the legal principle that fits the scenario rather than listing every law.",
    examTip: "AQA asks for current legal impacts, so apply the rule to the facts and explain the consequence for a stakeholder.",
  },
  "access-and-environment": {
    workedExample: "Cloud and mobile services can widen access, but device production uses raw materials and energy while discarded electronics may contain hazardous substances.",
    misconception: "Cloud storage still relies on physical data centres and storage hardware, so it changes where environmental costs occur rather than eliminating them.",
    examTip: "Develop the whole lifecycle: manufacture, energy during use, repair or reuse, and responsible recycling at end of life.",
  },
  "data-and-control": {
    workedExample: "A program declares integer score, assigns a user input, uses nested selection to choose a grade and repeats for each student with definite iteration.",
    misconception: "Declaration creates the variable and type, while assignment stores a value; selection chooses a path and iteration repeats instructions.",
    examTip: "Use meaningful identifiers and make every nested IF or loop boundary visually clear in program answers.",
    code: "DECLARE score : INTEGER\nscore = USERINPUT\nIF score >= 70 THEN\n    OUTPUT 'Distinction'\nELSE\n    OUTPUT 'Review'\nENDIF",
  },
  "operations-and-strings": {
    workedExample: "17 DIV 5 gives 3 and 17 MOD 5 gives 2; a substring can extract part of a username before concatenation adds a domain.",
    misconception: "DIV gives an integer quotient and MOD gives the remainder; neither is the same as real division.",
    examTip: "Trace operator precedence and data types, especially when converting between strings and numbers or combining Boolean conditions.",
  },
  "structures-and-subroutines": {
    workedExample: "A two-dimensional array can store a score grid, a record can group one player's mixed-type details, and calculateMean(scores) can return a result using local variables.",
    misconception: "An array normally stores one type under indexes; a record groups named fields that may use different types.",
    examTip: "Explain structured programming through modular subroutines, clear interfaces, parameters, return values and local-variable scope.",
    code: "FUNCTION calculateMean(scores)\n    DECLARE total : INTEGER\n    total = 0\n    FOR score IN scores\n        total = total + score\n    ENDFOR\n    RETURN total / LEN(scores)\nENDFUNCTION",
  },
  "robust-secure-programming": {
    workedExample: "For a valid range 1 to 10, normal data could be 6 and boundary data should include 0, 1, 10 and 11; text input can test an erroneous type.",
    misconception: "Validation checks whether input follows rules and does not prove it is true; authentication checks an identity claim.",
    examTip: "Give the test value, its category, why it was chosen and its expected result, then compare actual results and refine the program.",
  },
  "number-bases": {
    workedExample: "Binary 10110110 is decimal 182 and hexadecimal B6 because the nibbles 1011 and 0110 correspond to B and 6.",
    misconception: "Hexadecimal is a compact human notation for bit patterns; the computer does not need to convert all stored binary into text-like hexadecimal internally.",
    examTip: "For values 0-255, show binary place values or split into two nibbles and check that the final hexadecimal digits lie between 0 and F.",
  },
  "units-and-binary-arithmetic": {
    workedExample: "Adding 00101101 and 00010111 from right to left gives 01000100; shifting it right once gives 00100010, integer division by two.",
    misconception: "AQA's prefixes are decimal: 1 kB = 1,000 bytes. Do not silently substitute 1,024 unless the question explicitly provides a binary unit.",
    examTip: "Keep every carry visible in addition, preserve the stated bit width during shifts and state the power-of-two effect.",
  },
  "text-and-images": {
    workedExample: "A 320 × 200 bitmap at 4-bit colour depth needs 320 × 200 × 4 = 256,000 bits or 32,000 bytes before compression.",
    misconception: "Image size means pixel dimensions, while file size means storage required; increasing colour depth changes bits per pixel rather than pixel count.",
    examTip: "Write W × H × D, calculate in bits and divide by 8 only if bytes are requested; AQA can also ask you to convert simple bitmaps to binary.",
  },
  "sound-and-compression": {
    workedExample: "A 10-second recording at 8,000 Hz and 8-bit resolution needs 640,000 bits; RLE suits long repeated runs, while Huffman gives frequent symbols shorter codes.",
    misconception: "Huffman codes must be prefix-free so decoding is unambiguous, while RLE records frequency/data pairs and can increase size when values rarely repeat.",
    examTip: "For Huffman, show the route through the tree and calculate compressed bits from frequency × code length; for RLE, preserve the exact order of runs.",
  },
  "hardware-and-logic": {
    workedExample: "For A=1 and B=0, A XOR B is 1 but A AND B is 0; a three-input circuit needs eight truth-table rows.",
    misconception: "XOR is true when two inputs differ, while inclusive OR is also true when both inputs are 1.",
    examTip: "Label intermediate gates and complete their truth-table columns before calculating the final expression or drawing the circuit.",
  },
  "software-and-operating-systems": {
    workedExample: "While a game runs, the OS schedules processor time, allocates memory, controls I/O through drivers and enforces user security; backup software is a utility.",
    misconception: "The operating system is system software, whereas an application performs an end-user task; a utility provides maintenance, security or optimisation.",
    examTip: "Name the resource managed and the service provided rather than writing only that the OS ‘controls the computer’.",
  },
  "languages-and-translators": {
    workedExample: "An assembler maps each assembly instruction to machine code, a compiler translates a complete high-level program, and an interpreter executes through its own machine-code routines.",
    misconception: "For AQA, an interpreter does not directly produce a saved machine-code program; it invokes appropriate routines while processing source statements.",
    examTip: "Compare readability, portability, development, hardware control and execution, then select the translator that fits the scenario.",
  },
  "architecture-memory-storage": {
    workedExample: "The control unit fetches and decodes an instruction over buses, the ALU executes calculations and registers hold immediate values; cache reduces slower main-memory access.",
    misconception: "Registers and cache are distinct fast memories, RAM is volatile main memory, ROM is non-volatile, and secondary or cloud storage retains files long term.",
    examTip: "Focus on component roles, buses, performance factors, memory types, magnetic and solid-state storage, cloud trade-offs and embedded systems.",
  },
};

export function getAqaGcseEnrichment(unitSlug: string) {
  const enrichment = AQA_GCSE_ENRICHMENT[unitSlug];
  if (!enrichment) throw new Error(`Missing AQA GCSE enrichment for ${unitSlug}`);
  return enrichment;
}
