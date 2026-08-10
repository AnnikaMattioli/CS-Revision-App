import type { OcrTopicBlueprint } from "./ocr-gcse";

const fact = (question: string, answer: string, keywords: string[]) => ({ question, answer, keywords });

export const aqaGcseBlueprints: OcrTopicBlueprint[] = [
  {
    code: "3.1", slug: "fundamentals-of-algorithms", title: "Fundamentals of algorithms", icon: "🧠",
    description: "Representing, tracing and comparing computational solutions.",
    units: [
      { slug: "representing-algorithms", title: "Representing algorithms", summary: "Use decomposition, abstraction, pseudocode and flowcharts to express solutions.", facts: [
        fact("What is an algorithm?", "A finite sequence of unambiguous steps that solves a problem.", ["finite", "unambiguous", "problem"]),
        fact("What is decomposition?", "Breaking a complex problem into smaller, more manageable subproblems.", ["smaller", "subproblems"]),
        fact("What is abstraction?", "Removing unnecessary detail so attention remains on the information relevant to a solution.", ["unnecessary detail", "relevant"]),
        fact("What is pseudocode?", "A structured, language-independent way of describing an algorithm.", ["structured", "language-independent"]),
        fact("What does a flowchart show?", "It uses standard symbols and directed arrows to show operations, decisions and control flow.", ["symbols", "arrows", "control flow"]),
      ]},
      { slug: "tracing-and-efficiency", title: "Tracing and efficiency", summary: "Trace values, identify purpose and compare algorithms by time requirements.", facts: [
        fact("What does a trace table record?", "It records how variables, conditions and outputs change while an algorithm executes.", ["variables", "outputs", "executes"]),
        fact("Why are dry runs useful?", "A dry run follows an algorithm manually to check its logic and expected results.", ["manually", "logic", "results"]),
        fact("What is time efficiency?", "Time efficiency describes how the running time or number of operations grows with the input.", ["running time", "operations", "input"]),
        fact("How can an algorithm be explained using inputs, processing and outputs?", "Identify the data supplied, the operations performed on it and the information produced.", ["inputs", "processing", "outputs"]),
        fact("Why can two correct algorithms have different usefulness?", "They may require different amounts of processing time, memory or implementation effort.", ["time", "memory", "implementation"]),
      ]},
      { slug: "searching", title: "Searching algorithms", summary: "Trace linear and binary searches and select the appropriate method.", facts: [
        fact("How does a linear search work?", "It checks each item in sequence until the target is found or the collection ends.", ["each item", "sequence", "target"]),
        fact("What prerequisite does binary search have?", "The searchable data must already be ordered.", ["ordered"]),
        fact("How does binary search work?", "It compares the target with the middle item and repeatedly discards the half that cannot contain it.", ["middle", "half", "discards"]),
        fact("When is linear search appropriate?", "It is suitable for small or unordered collections and requires no preparation by sorting.", ["small", "unordered"]),
        fact("Why is binary search generally faster on large ordered data?", "Each comparison removes about half of the remaining search area.", ["half", "search area"]),
      ]},
      { slug: "sorting", title: "Sorting algorithms", summary: "Trace bubble and merge sorts and compare their approaches.", facts: [
        fact("How does bubble sort work?", "It repeatedly compares adjacent items and swaps those that are in the wrong order.", ["adjacent", "swaps", "repeatedly"]),
        fact("How do bubble sort and merge sort differ?", "Bubble sort repeatedly swaps adjacent items, while merge sort divides the data then merges ordered parts.", ["adjacent", "divides", "merges"]),
        fact("How does merge sort work?", "It divides the data into smaller parts, sorts them, then merges the sorted parts.", ["divides", "sorts", "merges"]),
        fact("What indicates a bubble-sort pass made no swaps?", "The data is already in order and the algorithm can stop.", ["in order", "stop"]),
        fact("Why is merge sort generally more time-efficient for large lists?", "It repeatedly divides the problem, whereas bubble sort may need many passes and adjacent comparisons.", ["divides", "passes", "comparisons"]),
      ]},
    ],
  },
  {
    code: "3.5", slug: "computer-networks", title: "Fundamentals of computer networks", icon: "🌐",
    description: "Network purposes, types, performance, hardware, addressing, packet switching and layers.",
    units: [
      { slug: "network-purpose-types", title: "Network purpose and types", summary: "Explain why devices are networked and compare local and wide-area networks.", facts: [
        fact("What is a computer network?", "Two or more connected devices that can communicate and share data or resources.", ["connected", "communicate", "share"]),
        fact("What is a LAN?", "A local area network covers a limited geographical area and is usually managed by one organisation.", ["limited", "one organisation"]),
        fact("What is a WAN?", "A wide area network connects devices or LANs across a large geographical area, often using third-party infrastructure.", ["large", "third-party"]),
        fact("What is a PAN?", "A personal area network connects devices over a very short range; AQA requires Bluetooth as the example.", ["personal", "short range", "Bluetooth"]),
        fact("What are key benefits and drawbacks of networks?", "Networks enable resource sharing and communication but require management, security and infrastructure.", ["sharing", "management", "security"]),
      ]},
      { slug: "performance-and-hardware", title: "Wired and wireless networks", summary: "Select copper, fibre or wireless connections and justify their trade-offs.", facts: [
        fact("How do wired and wireless networks differ?", "Wired devices communicate through cables, while wireless devices transmit data using electromagnetic signals through the air.", ["cables", "signals", "air"]),
        fact("What are advantages of wired networking?", "Wired links are often more reliable, secure and consistent, with less interference than wireless links.", ["reliable", "secure", "interference"]),
        fact("What are advantages of wireless networking?", "Wireless links provide mobility and convenient connection without installing a cable to every device.", ["mobility", "convenient", "cable"]),
        fact("When is fibre-optic cable appropriate?", "Fibre provides high-capacity transmission over long distances and resists electromagnetic interference, but can cost more to install.", ["high-capacity", "distance", "interference"]),
        fact("When is copper cable appropriate?", "Copper is widely available and often cheaper for short local links, but is more affected by interference and signal loss.", ["cheaper", "short", "signal loss"]),
      ]},
      { slug: "models-and-services", title: "Protocols and the TCP/IP model", summary: "Place common protocols in the four TCP/IP layers and explain each layer's responsibility.", facts: [
        fact("What is a network protocol?", "An agreed set of rules that lets devices format, transmit and interpret data consistently.", ["agreed", "rules", "devices"]),
        fact("What are the four TCP/IP layers?", "Application, transport, internet and link.", ["application", "transport", "internet", "link"]),
        fact("What does the application layer do?", "It provides network services to applications; HTTP, HTTPS, SMTP and IMAP operate here.", ["applications", "HTTP", "SMTP"]),
        fact("What does the transport layer do?", "It establishes host-to-host communication and uses TCP to support reliable delivery.", ["host-to-host", "TCP", "reliable"]),
        fact("What do the internet and link layers do?", "The internet layer addresses and routes IP packets, while the link layer operates network hardware and device drivers.", ["addresses", "routes", "hardware"]),
      ]},
      { slug: "packets-addressing-layers", title: "Packets, addressing and layers", summary: "Explain packet switching, addressing and why communication is organised in layers.", facts: [
        fact("What is packet switching?", "Data is divided into addressed packets that may travel independently and are reassembled at the destination.", ["divided", "packets", "reassembled"]),
        fact("Which methods secure an AQA network?", "Authentication, encryption, firewalls and MAC-address filtering work together to reduce unauthorised access and data exposure.", ["authentication", "encryption", "firewall", "MAC"]),
        fact("What is the purpose of an IP address?", "It identifies a device's network location so packets can be routed towards it.", ["identifies", "location", "routed"]),
        fact("What is a MAC address?", "A hardware address associated with a network interface and used for local delivery.", ["hardware", "interface", "local"]),
        fact("Why is network communication organised into layers?", "Layers divide a complex process into standard responsibilities that can be developed or changed independently.", ["divide", "standard", "independently"]),
      ]},
    ],
  },
  {
    code: "3.6", slug: "cyber-security", title: "Cyber security", icon: "🛡️",
    description: "Threats to networks, computers, programs and data, plus methods used to reduce risk.",
    units: [
      { slug: "security-fundamentals", title: "Cyber-security fundamentals", summary: "Understand cyber security, vulnerable systems and specified sources of risk.", facts: [
        fact("What is cyber security?", "The processes, practices and technologies used to protect networks, computers, programs and data from attack, damage or unauthorised access.", ["protect", "attack", "unauthorised"]),
        fact("Why is removable media a cyber-security threat?", "It can introduce malware or allow sensitive data to be copied, lost or stolen.", ["malware", "copied", "stolen"]),
        fact("Why is unpatched software a threat?", "Attackers can exploit publicly known vulnerabilities that an available update would have corrected.", ["exploit", "vulnerabilities", "update"]),
        fact("Why are misconfigured access rights a threat?", "Users may receive permissions beyond their role and access or alter data without authorisation.", ["permissions", "role", "unauthorised"]),
        fact("What is penetration testing?", "Authorised testers attempt to access resources using attack techniques so weaknesses can be found and corrected.", ["authorised", "access", "weaknesses"]),
      ]},
      { slug: "people-and-password-threats", title: "People and password threats", summary: "Recognise social engineering, pharming and insecure access controls.", facts: [
        fact("What is social engineering?", "Manipulating people into disclosing information or performing an unsafe action.", ["manipulating", "people", "unsafe"]),
        fact("How do phishing and blagging differ?", "Phishing uses a fraudulent message or link, while blagging invents a believable scenario to persuade a target to reveal information or act.", ["fraudulent message", "scenario", "reveal"]),
        fact("What is pharming?", "Redirecting users from a genuine destination to a fraudulent website, often by corrupting name-resolution information.", ["redirecting", "fraudulent"]),
        fact("Why are default or weak passwords dangerous?", "Attackers can guess or discover them more easily and gain unauthorised access.", ["guess", "unauthorised"]),
        fact("What is shouldering or shoulder surfing?", "Observing somebody's private information, such as a password or PIN, as they enter or view it.", ["observing", "password", "PIN"]),
      ]},
      { slug: "malware-and-attacks", title: "Malware and technical attacks", summary: "Distinguish viruses, Trojans and spyware and choose suitable protection.", facts: [
        fact("What is malware?", "Software intentionally designed to damage, disrupt, spy on or gain unauthorised access to systems.", ["software", "damage", "unauthorised"]),
        fact("How does a virus spread?", "It attaches to a host file or program and replicates when that infected host is executed.", ["host", "replicates", "executed"]),
        fact("What does a Trojan do?", "A Trojan disguises malicious code as legitimate or desirable software so a user installs or runs it.", ["disguises", "legitimate", "runs"]),
        fact("What does spyware do?", "Spyware secretly monitors activity or collects information and sends it to an unauthorised party.", ["secretly", "collects", "unauthorised"]),
        fact("How can malware be prevented or detected?", "Use current anti-malware, install trusted software, scan removable media and apply automatic security updates.", ["anti-malware", "trusted", "updates"]),
      ]},
      { slug: "prevention-and-detection", title: "Identity checks and penetration testing", summary: "Apply AQA's specified authentication measures and distinguish internal from external testing.", facts: [
        fact("How do biometric measures authenticate a user?", "They compare a measured physical or behavioural characteristic, such as a fingerprint, with an enrolled template.", ["physical", "fingerprint", "template"]),
        fact("How do password systems reduce unauthorised access?", "They require a secret credential and should enforce strong unique passwords plus restricted attempts.", ["secret", "strong", "attempts"]),
        fact("What is the purpose of CAPTCHA?", "CAPTCHA tests whether an interaction is likely to come from a human rather than an automated program.", ["human", "automated", "program"]),
        fact("How can email confirmation help verify identity?", "A time-limited link or code sent to a controlled email account confirms access to that account.", ["link", "code", "account"]),
        fact("How do internal and external penetration tests differ?", "An internal test starts with system knowledge or credentials to simulate an insider; an external test starts without them.", ["credentials", "insider", "without"]),
      ]},
    ],
  },
  {
    code: "3.7", slug: "relational-databases-and-sql", title: "Relational databases and SQL", icon: "🗃️",
    description: "Tables, fields, records, keys, relationships and structured queries.",
    units: [
      { slug: "database-foundations", title: "Database foundations", summary: "Distinguish data from information and organise structured data into tables.", facts: [
        fact("What is a database?", "An organised collection of data that can be stored, searched and updated systematically.", ["organised", "data", "updated"]),
        fact("What makes a database relational?", "Data is organised into related tables connected by matching primary-key and foreign-key values.", ["tables", "primary key", "foreign key"]),
        fact("What is a table in a relational database?", "A collection of related records organised into rows and fields.", ["records", "rows", "fields"]),
        fact("What is a field?", "A named attribute or item of data stored for every applicable record.", ["named", "attribute"]),
        fact("What is a record?", "A complete set of related field values describing one instance or entity.", ["field values", "one", "entity"]),
      ]},
      { slug: "keys-and-relationships", title: "Keys and relationships", summary: "Use primary and foreign keys to identify and connect records.", facts: [
        fact("What is a primary key?", "A field or combination of fields whose value uniquely identifies each record in a table.", ["uniquely", "record"]),
        fact("What is a foreign key?", "A field that stores a matching primary-key value from another table to create a relationship.", ["primary key", "another table", "relationship"]),
        fact("Why must primary-key values be unique?", "Each value must identify exactly one record without ambiguity.", ["one record", "ambiguity"]),
        fact("What is a one-to-many relationship?", "One record in a table can relate to several records in another table, while each of those relates back to one.", ["one", "several"]),
        fact("Why are related tables useful?", "They reduce unnecessary duplication and allow consistent data to be combined when needed.", ["duplication", "consistent", "combined"]),
      ]},
      { slug: "selecting-data", title: "Selecting data with SQL", summary: "Construct SELECT queries with fields, tables and conditions.", facts: [
        fact("What does SELECT specify in SQL?", "SELECT specifies which fields should appear in the query result.", ["fields", "result"]),
        fact("What does FROM specify in SQL?", "FROM specifies the table or tables from which data is retrieved.", ["table", "retrieved"]),
        fact("What does WHERE do in SQL?", "WHERE filters records so only those satisfying a condition are returned.", ["filters", "condition"]),
        fact("What does an asterisk mean after SELECT?", "It requests all fields from the selected table or joined result.", ["all fields"]),
        fact("How are text values normally written in an SQL condition?", "Text literals are enclosed in quotation marks so they are distinguished from field names.", ["text", "quotation marks", "field names"]),
      ]},
      { slug: "combining-and-changing-data", title: "Combining and changing data", summary: "Order, combine, insert, update and delete relational data safely.", facts: [
        fact("What does ORDER BY do?", "It sorts query results by one or more selected fields in ascending or descending order.", ["sorts", "ascending", "descending"]),
        fact("Why is a join used?", "A join combines related records from multiple tables using matching key values.", ["combines", "tables", "keys"]),
        fact("What does INSERT add to a database?", "INSERT adds a new record with specified field values.", ["new record", "values"]),
        fact("What does UPDATE do?", "UPDATE changes field values in records, normally restricted by a condition.", ["changes", "values", "condition"]),
        fact("Why is a WHERE condition crucial with UPDATE or DELETE?", "Without an appropriate condition, every record in the table may be changed or removed.", ["every record", "changed", "removed"]),
      ]},
    ],
  },
  {
    code: "3.8", slug: "ethical-legal-environmental-impacts", title: "Ethical, legal and environmental impacts", icon: "⚖️",
    description: "How digital technology affects privacy, society, ownership, access and the environment.",
    units: [
      { slug: "ethical-and-stakeholder-impacts", title: "Ethical and stakeholder impacts", summary: "Evaluate benefits, risks and responsibilities for affected groups.", facts: [
        fact("What makes an issue ethical?", "It involves judgements about right, wrong, fairness or responsibility rather than only what the law allows.", ["fairness", "responsibility", "law"]),
        fact("What is a stakeholder?", "A person, group or organisation affected by or able to influence a system or decision.", ["affected", "influence"]),
        fact("Why should an impact answer consider several stakeholders?", "The same technology can create different benefits, harms and responsibilities for different groups.", ["different", "benefits", "harms"]),
        fact("How can automation benefit organisations and users?", "It can increase speed, consistency, safety, availability and productivity.", ["speed", "safety", "productivity"]),
        fact("How can automation disadvantage people?", "It may remove or change jobs, require retraining and concentrate decisions in automated systems.", ["jobs", "retraining", "decisions"]),
      ]},
      { slug: "privacy-and-data", title: "Privacy and personal data", summary: "Balance useful data processing against consent, surveillance, accuracy and security.", facts: [
        fact("What is personal data?", "Information relating to an identified or identifiable living person.", ["identified", "living person"]),
        fact("How can collecting personal data benefit people?", "It can personalise services, improve decisions, support research and help prevent fraud.", ["personalise", "research", "fraud"]),
        fact("What privacy risks arise from data collection?", "Data may be inaccurate, excessive, insecure, reused unexpectedly or shared without valid authority.", ["inaccurate", "insecure", "shared"]),
        fact("Why does informed consent matter?", "People should understand what data is collected, why it is used and what meaningful choices they have.", ["understand", "why", "choices"]),
        fact("How can organisations reduce privacy risk?", "They can minimise collection, control access, secure data, keep it accurate and delete it when no longer needed.", ["minimise", "access", "delete"]),
      ]},
      { slug: "law-and-ownership", title: "Law and ownership", summary: "Apply data-protection, computer-misuse and copyright principles to scenarios.", facts: [
        fact("What is the purpose of data-protection law?", "It governs the fair, lawful and secure processing of personal data and gives individuals rights.", ["lawful", "secure", "rights"]),
        fact("What does computer-misuse law address?", "It prohibits unauthorised access and unauthorised acts intended to impair systems or data.", ["unauthorised", "impair"]),
        fact("What does copyright protect?", "It gives creators legal control over copying, distributing and adapting their original work, including software.", ["creators", "copying", "software"]),
        fact("Why must software licence terms be followed?", "A licence defines the legal permissions and restrictions for installing, using, modifying or sharing software.", ["permissions", "restrictions", "sharing"]),
        fact("Why can an action be legal but unethical?", "Law sets enforceable minimum rules, while ethical responsibility may demand greater fairness or care.", ["minimum", "responsibility", "fairness"]),
      ]},
      { slug: "access-and-environment", title: "Access and environmental impacts", summary: "Explain the digital divide and reduce the life-cycle costs of computing.", facts: [
        fact("What is the digital divide?", "The gap between people with effective access to digital devices, connectivity and skills and those without it.", ["gap", "access", "skills"]),
        fact("How can the digital divide affect people?", "It can restrict access to education, work, services, communication and participation.", ["education", "work", "services"]),
        fact("How does manufacturing devices affect the environment?", "It consumes energy and raw materials and can cause emissions, pollution and habitat damage.", ["energy", "materials", "pollution"]),
        fact("What is electronic waste?", "Discarded electrical or electronic equipment containing valuable and potentially hazardous materials.", ["discarded", "hazardous"]),
        fact("How can computing's environmental impact be reduced?", "Extend device life, repair and reuse equipment, recycle responsibly, improve efficiency and use lower-carbon energy.", ["repair", "recycle", "efficiency"]),
      ]},
    ],
  },
  {
    code: "3.2", slug: "programming", title: "Programming", icon: "💻",
    description: "Data types, control structures, subroutines, data structures and robust programs.",
    units: [
      { slug: "data-and-control", title: "Data types and control structures", summary: "Use variables, constants, selection and definite or indefinite iteration.", facts: [
        fact("What are variable declaration and assignment?", "Declaration creates a named variable with a data type; assignment stores or replaces its value.", ["declaration", "data type", "assignment"]),
        fact("What is a constant?", "A named value that is not changed while the program runs.", ["named", "not changed"]),
        fact("Name the common primitive data types.", "Integer, real, Boolean, character and string are common primitive data types.", ["integer", "Boolean", "string"]),
        fact("What is selection?", "Selection chooses which instructions execute according to a condition.", ["chooses", "condition"]),
        fact("How do definite and indefinite iteration differ?", "Definite iteration repeats a known number of times; indefinite iteration repeats until or while a condition applies.", ["known number", "condition"]),
      ]},
      { slug: "operations-and-strings", title: "Operations and string handling", summary: "Apply arithmetic, relational, Boolean and string operations precisely.", facts: [
        fact("How do DIV and MOD differ?", "DIV returns the integer quotient; MOD returns the remainder after integer division.", ["quotient", "remainder"]),
        fact("What is a relational operator?", "An operator such as equal to or greater than that compares values and produces a Boolean result.", ["compares", "Boolean"]),
        fact("What do NOT, AND and OR do in a condition?", "NOT inverts a Boolean, AND requires both conditions, and OR requires at least one.", ["inverts", "both", "at least one"]),
        fact("Which string-handling operations must AQA students use?", "Length, position, substring, concatenation, character-code conversion and string-number conversions.", ["substring", "concatenation", "conversion"]),
        fact("Why is random-number generation useful?", "It allows programs to vary behaviour, choose unpredictable values or simulate chance.", ["vary", "unpredictable", "chance"]),
      ]},
      { slug: "structures-and-subroutines", title: "Data structures and subroutines", summary: "Use arrays, records, files, procedures and functions to organise solutions.", facts: [
        fact("What is an array?", "A data structure that stores multiple values under one name, accessed using an index.", ["multiple values", "index"]),
        fact("How does a record differ from an array?", "A record groups related fields that may have different data types; an array normally stores items of one type.", ["fields", "different types", "one type"]),
        fact("What is a subroutine?", "A named block of code that performs a task and can be called from elsewhere in a program.", ["named block", "called"]),
        fact("How do parameters and return values move data?", "Parameters pass data into a subroutine, while a return value passes a result back to its caller.", ["into", "result", "caller"]),
        fact("Why are local variables useful?", "They exist within a subroutine, reduce unintended interference and make modules easier to reason about.", ["subroutine", "interference", "modules"]),
      ]},
      { slug: "robust-secure-programming", title: "Robust and secure programming", summary: "Validate, authenticate, test and correct programs systematically.", facts: [
        fact("What is validation?", "Validation checks whether entered data is sensible and meets defined rules.", ["sensible", "rules"]),
        fact("What is authentication?", "Authentication checks that a user or system is who it claims to be.", ["checks", "identity"]),
        fact("How do syntax and logic errors differ?", "A syntax error breaks language rules; a logic error lets a program run but produce an incorrect result.", ["language rules", "runs", "incorrect"]),
        fact("What are normal, boundary and erroneous test data?", "Normal data is typical valid input, boundary data tests limits, and erroneous data should be rejected.", ["typical", "limits", "rejected"]),
        fact("Why should expected and actual test results be recorded?", "Comparing them provides evidence of correctness and identifies cases that need debugging.", ["evidence", "correctness", "debugging"]),
      ]},
    ],
  },
  {
    code: "3.3", slug: "data-representation", title: "Fundamentals of data representation", icon: "🔢",
    description: "Number bases, binary arithmetic, character, image and sound representation, and compression.",
    units: [
      { slug: "number-bases", title: "Number bases and conversion", summary: "Represent values in binary, decimal and hexadecimal and convert between them.", facts: [
        fact("Why do computers represent data in binary?", "Digital circuits reliably distinguish two states, represented as 0 and 1.", ["two states", "0", "1"]),
        fact("Why is hexadecimal useful?", "It represents long binary patterns compactly, with one hexadecimal digit corresponding to four bits.", ["compactly", "four bits"]),
        fact("How is binary converted to decimal?", "Add the place values for every binary position containing a 1.", ["place values", "1"]),
        fact("How is binary converted to hexadecimal?", "Split the binary value into groups of four bits and convert each group to one hexadecimal digit.", ["groups of four", "digit"]),
        fact("What decimal range can eight unsigned bits represent?", "Eight unsigned bits represent values from 0 to 255 inclusive.", ["0", "255"]),
      ]},
      { slug: "units-and-binary-arithmetic", title: "Units and binary arithmetic", summary: "Compare data units and calculate binary addition and shifts.", facts: [
        fact("How many bits are in a byte?", "A byte contains eight bits.", ["eight"]),
        fact("State the decimal storage prefixes used by AQA.", "1 kB is 1,000 bytes, then MB, GB and TB each represent 1,000 of the previous unit.", ["1,000", "kB", "TB"]),
        fact("How is binary addition performed?", "Add from right to left using 0 + 0 = 0, 0 + 1 = 1 and 1 + 1 = 10, carrying into the next column.", ["right to left", "carrying", "10"]),
        fact("What does a left binary shift do to a positive integer?", "Each place shifted left multiplies the value by two if no overflow occurs.", ["multiplies", "two", "overflow"]),
        fact("What does a right binary shift do to a positive integer?", "Each place shifted right performs integer division by two and discards shifted-out bits.", ["division", "two", "discards"]),
      ]},
      { slug: "text-and-images", title: "Text and image representation", summary: "Explain character sets, pixels, resolution, colour depth and file-size trade-offs.", facts: [
        fact("What is a character set?", "A defined collection that assigns each character a unique numeric code.", ["character", "numeric code"]),
        fact("Why can Unicode represent more characters than ASCII?", "Unicode uses a much larger set of code points covering many languages and symbols.", ["larger", "languages", "symbols"]),
        fact("How is a bitmap image represented?", "It is stored as a grid of pixels, with a binary value representing each pixel's colour.", ["grid", "pixels", "colour"]),
        fact("What is image resolution?", "Resolution is the number of pixels used to represent an image, commonly expressed as width by height.", ["pixels", "width", "height"]),
        fact("How is uncompressed bitmap file size calculated?", "Multiply image width in pixels by height in pixels by colour depth; divide bits by eight for bytes.", ["width", "height", "colour depth"]),
      ]},
      { slug: "sound-and-compression", title: "Sound and compression", summary: "Calculate sampled sound sizes and apply Huffman coding and run-length encoding.", facts: [
        fact("How is analogue sound represented digitally?", "The sound wave's amplitude is measured at regular intervals and each sample is stored as a binary value.", ["amplitude", "intervals", "binary"]),
        fact("How is uncompressed sound file size calculated?", "Multiply sampling rate by sample resolution by duration in seconds to obtain the size in bits.", ["sampling rate", "sample resolution", "duration"]),
        fact("How does Huffman coding compress data?", "It assigns shorter prefix-free codes to more frequent symbols and longer codes to less frequent symbols using a Huffman tree.", ["shorter", "frequent", "tree"]),
        fact("How is a Huffman tree used to decode data?", "Follow each bit from the root along the labelled branches until a symbol leaf is reached, then restart at the root.", ["root", "branches", "leaf"]),
        fact("How does run-length encoding compress data?", "RLE replaces consecutive repeated values with frequency-and-data pairs, so it works best when long runs occur.", ["consecutive", "frequency", "runs"]),
      ]},
    ],
  },
  {
    code: "3.4", slug: "computer-systems", title: "Computer systems", icon: "🖥️",
    description: "Hardware, Boolean logic, software, translators, processor architecture, memory and storage.",
    units: [
      { slug: "hardware-and-logic", title: "Hardware and Boolean logic", summary: "Relate hardware to software and work with NOT, AND, OR and XOR.", facts: [
        fact("What is hardware?", "The physical components of a computer system.", ["physical", "components"]),
        fact("What is software?", "Programs and data that provide instructions for computer hardware.", ["programs", "instructions", "hardware"]),
        fact("When does an XOR gate output 1?", "XOR outputs 1 when its two inputs are different.", ["different"]),
        fact("What does a truth table show?", "It lists the output of a Boolean expression or circuit for every possible input combination.", ["output", "every", "combination"]),
        fact("How is a combined logic circuit evaluated?", "Work from inputs to output one gate at a time, recording intermediate results.", ["one gate", "intermediate"]),
      ]},
      { slug: "software-and-operating-systems", title: "Software and operating systems", summary: "Classify software and explain operating-system and utility functions.", facts: [
        fact("How do system and application software differ?", "System software manages resources and supports the computer; application software performs end-user tasks.", ["manages", "end-user"]),
        fact("What does an operating system manage?", "It manages processors, memory, input/output devices, applications and security.", ["processors", "memory", "security"]),
        fact("Why are device drivers needed?", "They allow the operating system to communicate with and control particular hardware devices.", ["operating system", "hardware"]),
        fact("What is utility software?", "Software that performs maintenance, security or optimisation tasks for a computer system.", ["maintenance", "security", "optimisation"]),
        fact("Give examples of utility functions.", "Examples include backup, compression, encryption, anti-malware and storage-management tools.", ["backup", "encryption", "anti-malware"]),
      ]},
      { slug: "languages-and-translators", title: "Languages and translators", summary: "Compare language levels, machine code, assembly, compilers, interpreters and assemblers.", facts: [
        fact("Why are high-level languages widely used?", "Their readable abstractions, libraries and portability make programs easier to develop and maintain.", ["readable", "libraries", "portability"]),
        fact("What is machine code?", "Binary instructions executed directly by a particular processor or processor family.", ["binary", "processor", "directly"]),
        fact("What is assembly language?", "A low-level language using mnemonics with a close correspondence to machine instructions.", ["low-level", "mnemonics", "machine"]),
        fact("How do a compiler and interpreter differ?", "A compiler translates a complete program before execution; an interpreter processes source statements as the program runs.", ["complete", "before", "statements"]),
        fact("What does an assembler do?", "It translates assembly-language instructions into machine code.", ["assembly", "machine code"]),
      ]},
      { slug: "architecture-memory-storage", title: "Architecture, memory and storage", summary: "Explain CPU operation, memory, secondary storage and embedded systems.", facts: [
        fact("What do the ALU and control unit do?", "The ALU performs calculations and logic; the control unit coordinates and decodes instructions.", ["calculations", "coordinates", "decodes"]),
        fact("What happens in the fetch-decode-execute cycle?", "The CPU fetches an instruction from memory, decodes it, then carries it out.", ["fetches", "decodes", "carries out"]),
        fact("How can clock speed, cores and cache affect performance?", "They influence cycles per second, parallel processing and access to frequently used data respectively.", ["cycles", "parallel", "frequently used"]),
        fact("How do RAM, ROM and secondary storage differ?", "RAM is volatile working memory, ROM is non-volatile fixed memory, and secondary storage retains programs and files long term.", ["volatile", "non-volatile", "long term"]),
        fact("What is an embedded system?", "A computer built into a larger device to perform a dedicated function.", ["larger device", "dedicated"]),
      ]},
    ],
  },
];

export const AQA_GCSE_SOURCE_NOTES = [
  "AQA 8525 specification content shared by the 2026 and 2027 specifications",
  "AQA 8525 official summary of 2027 content changes",
  "Physics & Maths Tutor AQA GCSE revision-resource topic map",
  "Craig 'n' Dave AQA GCSE 8525 objective map",
] as const;
