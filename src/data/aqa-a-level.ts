import type { OcrTopicBlueprint } from "./ocr-gcse";

const fact = (row: string) => { const [question, answer, keywords] = row.split("~"); return { question, answer, keywords: keywords.split(",") }; };
const unit = (slug: string, title: string, summary: string, rows: string[]) => ({ slug, title, summary, facts: rows.map(fact) });

export const aqaALevelBlueprints: OcrTopicBlueprint[] = [
  {
    code: "4.1", slug: "fundamentals-of-programming", title: "Fundamentals of programming", icon: "💻", description: "Data, control flow, modular programming, recursion and object-oriented design.", units: [
      unit("data-control", "Data and control", "Use types, variables and control structures precisely.", [
        "Which data types does AQA A-level require?~Integer, real or float, Boolean, character, string, date/time, pointer or reference, records and arrays each define a representation, range and valid operations.~integer,date/time,pointer,records",
        "How do definite and indefinite iteration differ?~Definite iteration repeats a known number of times; indefinite iteration is controlled by a condition.~known,condition,iteration",
        "What is selection?~Selection chooses which statement block executes according to one or more Boolean conditions.~chooses,Boolean,block",
        "Why use meaningful identifiers?~They communicate purpose, reduce misunderstanding and make programs easier to maintain.~purpose,maintain,readability",
        "What is a user-defined data type?~A programmer-defined type constructed from existing types to model domain-specific values or records.~programmer,existing,model",
      ]),
      unit("operations-robustness", "Operations and robustness", "Apply operators, strings, random values and exception handling.", [
        "How do DIV and MOD differ?~DIV returns the integer quotient; MOD returns the remainder after integer division.~quotient,remainder,integer",
        "What do relational operators produce?~They compare operands and produce a Boolean true or false result.~compare,Boolean,result",
        "What are common string operations?~Length, substring extraction, concatenation and character-position operations manipulate text.~length,substring,concatenation",
        "Why use exception handling?~It catches exceptional runtime conditions so a program can recover, report or terminate safely.~runtime,recover,safely",
        "Why might a program generate random numbers?~They support simulation, testing, games, sampling and algorithms requiring unpredictable choices.~simulation,sampling,unpredictable",
      ]),
      unit("subroutines-recursion", "Subroutines and recursion", "Explain parameter passing, scope, stack frames and recursive solutions.", [
        "What is a subroutine?~A named reusable program unit that performs a defined task and can receive parameters.~named,reusable,parameters",
        "How do value and reference parameters differ?~Value passes a copy; reference permits access to and modification of the caller's original object.~copy,original,modification",
        "How do local and global variables differ?~A local has limited block or subroutine scope; a global is accessible across a wider program scope.~local,global,scope",
        "What is stored in a stack frame?~A call's return address, parameters, local variables and saved execution state are stored together.~return,parameters,state",
        "What makes recursion terminate?~A base case stops further calls and each recursive step progresses towards that case.~base case,progresses,stops",
      ]),
      unit("paradigms-oop", "Paradigms and OOP", "Compare procedural and object-oriented solutions.", [
        "What is a programming paradigm?~A general style of organising computation, data and program structure.~style,computation,structure",
        "What characterises procedural programming?~Procedures contain ordered commands that operate on data and are called to perform tasks.~procedures,commands,data",
        "What is the difference between a class and an object?~A class defines attributes and methods; an object is a particular instance with state.~defines,instance,state",
        "What is encapsulation?~It combines state with its methods and controls direct access to internal representation.~state,methods,access",
        "How do inheritance, aggregation, composition, polymorphism and overriding differ?~Inheritance derives a specialised class, aggregation links an independently existing part, composition owns a lifetime-dependent part, polymorphism uses a shared interface, and overriding replaces inherited behaviour.~inheritance,aggregation,composition,overriding",
      ]),
    ],
  },
  {
    code: "4.2", slug: "fundamentals-of-data-structures", title: "Fundamentals of data structures", icon: "🗂️", description: "Arrays, records, abstract data types, graphs, trees, hashing and dynamic structures.", units: [
      unit("arrays-records-files", "Arrays, records and files", "Represent indexed, structured and persistent collections.", [
        "What is an array?~A fixed or bounded indexed collection whose elements normally share one data type.~indexed,elements,type",
        "What is a multidimensional array?~An array addressed by two or more indices, suitable for grids, tables and higher-dimensional data.~indices,grids,tables",
        "What is a record?~A collection of named fields that may contain different data types for one entity.~fields,different,entity",
        "How do text and binary files differ?~Text files encode readable characters; binary files store values in application-defined byte formats.~characters,bytes,format",
        "What is an abstract data type?~A logical specification of values and operations independent of a particular implementation.~logical,operations,implementation",
      ]),
      unit("queues-stacks-vectors", "Queues, stacks and vectors", "Use linear abstract data types and dynamic arrays.", [
        "What defines a queue?~A queue is first-in first-out, using enqueue at the rear and dequeue at the front.~FIFO,enqueue,dequeue",
        "What defines a stack?~A stack is last-in first-out, using push, pop and peek at its top.~LIFO,push,pop",
        "How can an array implement a circular queue?~Front and rear indices wrap around the array so freed positions are reused.~indices,wrap,reused",
        "What is an AQA mathematical vector?~A vector is an ordered list of values from one field and can be added, scaled, combined convexly and used in a dot product.~ordered,field,scaled,dot product",
        "What is stack underflow?~An attempt is made to pop or inspect an item when the stack is empty.~pop,empty,error",
      ]),
      unit("graphs-trees", "Graphs and trees", "Represent relationships and hierarchical structures.", [
        "What is a graph?~A set of vertices connected by edges, which may be directed, undirected or weighted.~vertices,edges,weighted",
        "How do adjacency matrices and lists differ?~A matrix stores every possible pair; a list stores only neighbours and is efficient for sparse graphs.~matrix,neighbours,sparse",
        "What is a tree?~A connected acyclic structure with hierarchical parent-child relationships.~connected,acyclic,hierarchical",
        "What is a binary search tree?~A binary tree ordered so smaller keys are in the left subtree and larger keys in the right.~smaller,left,right",
        "What are tree depth and a leaf?~Depth measures distance from the root; a leaf is a node with no children.~root,leaf,children",
      ]),
      unit("hash-dictionary", "Hash tables and dictionaries", "Map keys to values and resolve collisions.", [
        "What does a hash function do?~It deterministically maps a key to an array index or bucket.~maps,key,index",
        "What is a hash collision?~Different keys produce the same hash location and require a resolution strategy.~different,same,resolution",
        "How does rehashing resolve collisions?~A second calculation or probing rule generates alternative locations until a permitted empty slot is found.~second,probing,empty",
        "What is a dictionary?~An abstract data type that stores key-value pairs and supports lookup, insertion and deletion by key.~key-value,lookup,deletion",
        "Why does hash-table performance depend on load factor?~Crowded tables produce more collisions, increasing average lookup and insertion work.~crowded,collisions,lookup",
      ]),
    ],
  },
  {
    code: "4.3", slug: "fundamentals-of-advanced-algorithms", title: "Fundamentals of algorithms", icon: "📈", description: "Traversal, searching, sorting, Reverse Polish notation and shortest paths.", units: [
      unit("graph-tree-traversal", "Graph and tree traversal", "Trace breadth-first and depth-first algorithms.", [
        "How does breadth-first graph traversal work?~It uses a queue to visit vertices level by level while marking discovered vertices.~queue,level,discovered",
        "How does depth-first graph traversal work?~It uses recursion or a stack to follow one path deeply before backtracking.~stack,path,backtracking",
        "Why must graph traversal mark visited vertices?~Marking prevents cycles from causing repeated processing or non-termination.~cycles,repeated,termination",
        "What is pre-order tree traversal?~Visit the root, then recursively traverse the left subtree and right subtree.~root,left,right",
        "What is post-order tree traversal?~Recursively traverse left and right subtrees before visiting the root.~left,right,root",
      ]),
      unit("reverse-polish", "Reverse Polish notation", "Convert and evaluate postfix expressions using a stack.", [
        "What is Reverse Polish notation?~A postfix notation where each operator follows its operands and parentheses are unnecessary.~postfix,operator,operands",
        "How is an RPN expression evaluated?~Push operands onto a stack; for each operator pop operands, apply it and push the result.~push,pop,result",
        "Why is operand order important for subtraction and division?~The first popped value is the right operand and the second popped is the left operand.~first,right,left",
        "How is infix converted to postfix?~Output operands while a stack holds operators according to precedence and associativity.~operands,stack,precedence",
        "Why is RPN useful to a computer?~Evaluation needs a simple stack process without parsing nested parentheses or precedence during execution.~stack,parentheses,precedence",
      ]),
      unit("search-sort", "Searching and sorting", "Apply linear, binary, tree, bubble and merge algorithms.", [
        "How does linear search work?~It checks items sequentially until the target is found or the collection ends.~sequentially,target,ends",
        "What prerequisite does binary search have?~The searchable collection must be ordered by the compared key.~ordered,key",
        "How is a binary search tree searched?~Compare with each node and follow left for a smaller key or right for a larger key.~compare,left,right",
        "How does bubble sort work?~Repeated passes compare adjacent items and swap inversions until no swaps remain.~passes,adjacent,swaps",
        "How does merge sort work?~It divides data recursively and merges sorted sublists, usually in O(n log n) time.~divides,merges,n log n",
      ]),
      unit("shortest-path", "Shortest-path optimisation", "Trace Dijkstra's algorithm and justify its use.", [
        "What does Dijkstra's algorithm calculate?~It finds shortest-path distances from one source in a graph with non-negative edge weights.~shortest,source,non-negative",
        "What is a tentative distance?~The best currently known route cost from the source to an unvisited vertex.~best,cost,unvisited",
        "What is edge relaxation?~Update a neighbour's tentative distance when routing through the current vertex gives a lower cost.~update,neighbour,lower",
        "When is a Dijkstra vertex finalised?~When it is the unvisited vertex with the smallest tentative distance.~unvisited,smallest,finalised",
        "Why does standard Dijkstra fail with negative edges?~A finalised distance could later be reduced through a negative edge, breaking the greedy assumption.~reduced,negative,greedy",
      ]),
    ],
  },
  {
    code: "4.4", slug: "theory-of-computation", title: "Theory of computation", icon: "🤖", description: "Abstraction, formal languages, complexity, computability and Turing machines.", units: [
      unit("abstraction-automation", "Abstraction and automation", "Model problems and compose automated solutions.", [
        "What is abstraction?~Removing or hiding irrelevant detail while preserving features needed for the current purpose.~irrelevant,preserving,purpose",
        "What is information hiding?~Internal representation is concealed behind a defined interface to reduce dependency and misuse.~concealed,interface,dependency",
        "What is procedural abstraction?~A named operation is used by its purpose and interface without needing its implementation details.~operation,interface,implementation",
        "What are decomposition and composition?~Decomposition splits a problem into parts; composition combines parts into a complete solution.~splits,combines,solution",
        "What is automation?~Using a machine-executable model or algorithm to perform a process with limited human intervention.~executable,process,intervention",
      ]),
      unit("regular-context-free", "Formal languages", "Use FSMs, regular expressions and BNF.", [
        "How do sets support formal language reasoning?~Membership, subset, union, intersection, difference and Cartesian product describe collections of symbols, states and ordered pairs precisely.~membership,union,intersection,Cartesian",
        "What language does a finite-state automaton accept?~The set of strings that take it from its start state to an accepting state.~strings,start,accepting",
        "What does a regular expression describe?~A regular language using symbols, alternatives, concatenation and repetition operators.~language,alternatives,repetition",
        "What is Backus-Naur Form?~A notation of production rules that defines the syntax of a context-free language.~production,syntax,context-free",
        "How do regular and context-free languages differ?~Context-free grammars can represent nested structures that finite-state regular models cannot generally recognise.~nested,grammar,finite-state",
      ]),
      unit("complexity-computability", "Complexity and computability", "Classify growth and recognise limits of algorithms.", [
        "What does Big O notation express?~An asymptotic upper growth rate for an algorithm's resource requirement as input grows.~asymptotic,growth,input",
        "Order common growth rates by scalability.~Constant, logarithmic, linear, polynomial and exponential generally become less scalable in that order.~constant,logarithmic,exponential",
        "What is a tractable problem?~A problem with an algorithm whose resource growth is polynomial or otherwise considered practically manageable.~polynomial,manageable,algorithm",
        "What is an intractable problem?~A solvable problem whose exact algorithms require impractical resources for large inputs.~solvable,impractical,large",
        "What is a non-computable problem?~No algorithm can correctly solve every valid instance of the problem.~no algorithm,every,instance",
      ]),
      unit("turing-machines", "Turing machines", "Trace a general model of computation and the halting limitation.", [
        "What components form a Turing machine?~An infinite tape, read-write head, finite state register and transition function.~tape,head,transition",
        "What does a Turing transition specify?~For a state and tape symbol it gives the symbol to write, movement direction and next state.~write,movement,next state",
        "Why is a universal Turing machine important?~It can simulate any other Turing machine from an encoded machine description and input.~simulate,encoded,input",
        "What is the halting problem?~Determining for every program-input pair whether execution eventually stops.~program,input,stops",
        "Why is the halting problem undecidable?~Assuming a universal halting decider leads to a self-referential contradiction, so no such algorithm exists.~decider,self-reference,contradiction",
      ]),
    ],
  },
  {
    code: "4.5", slug: "advanced-data-representation", title: "Fundamentals of data representation", icon: "🔢", description: "Number systems, binary arithmetic, coding, multimedia, compression and encryption.", units: [
      unit("numbers-bases-units", "Numbers, bases and units", "Classify numbers and convert representations.", [
        "How do natural, integer, rational and real numbers relate?~Naturals count, integers include negatives, rationals are fractions of integers, and reals include rational and irrational values.~natural,integer,rational,real",
        "What is a number base?~The radix determines available digits and positional place values as powers of that base.~radix,digits,powers",
        "How are binary and hexadecimal related?~Each hexadecimal digit corresponds exactly to four binary bits.~hexadecimal,four,bits",
        "How many bits are in a byte?~A byte contains eight bits; larger units represent multiples of bytes.~eight,bits,byte",
        "How do counting and measurement differ?~Counts are discrete exact quantities; measurements approximate continuous quantities to finite precision.~discrete,continuous,precision",
      ]),
      unit("binary-floating-point", "Binary and floating point", "Calculate with signed integers and normalised real values.", [
        "How does two's complement represent negatives?~The most significant bit has a negative place value, supporting one zero and direct binary arithmetic.~negative,MSB,arithmetic",
        "What is binary overflow?~A result lies outside the range representable using the allocated bits.~outside,range,bits",
        "How is floating point represented?~A signed mantissa stores significant bits and a signed exponent scales by a power of two.~mantissa,exponent,power",
        "Why are floating-point values normalised?~Normalisation gives a consistent form and maximises useful precision for the available mantissa bits.~consistent,precision,mantissa",
        "How do absolute and relative error differ?~Absolute error is the magnitude of the difference; relative error divides it by the true value's magnitude.~difference,divides,true",
      ]),
      unit("coding-error-checking", "Coding and error checking", "Represent characters and detect or correct transmission errors.", [
        "How do ASCII and Unicode differ?~ASCII defines a small character set; Unicode assigns code points across many languages and symbols.~ASCII,code points,languages",
        "What is a parity bit?~An extra bit makes the total number of 1s odd or even so some errors can be detected.~extra,odd,even",
        "How does majority voting correct errors?~Each bit is transmitted repeatedly and the most frequent received value is selected.~repeated,frequent,selected",
        "What is a checksum?~A calculated summary accompanies data and is recalculated after transmission to detect change.~summary,recalculated,detect",
        "Why can an error-detecting code miss corruption?~Some combinations of changed bits preserve the checked property or produce the same checksum.~combinations,preserve,same",
      ]),
      unit("multimedia-security", "Multimedia, compression and encryption", "Represent images and sound and protect transferred data.", [
        "How do bitmap and vector graphics differ?~Bitmaps store coloured pixels; vectors store geometric objects and transformations.~pixels,geometric,objects",
        "How do bitmap and vector graphics differ and what determines bitmap size?~Bitmaps store pixels and use width times height times colour depth bits, while vectors store geometric objects that scale without pixelation.~pixels,colour depth,geometric,scale",
        "How are analogue sound and MIDI represented?~ADC samples and quantises amplitude into binary values, while MIDI stores event messages such as note, instrument, duration and velocity rather than a waveform.~ADC,samples,MIDI,events",
        "How do lossy and lossless compression differ?~Lossy removes information permanently; lossless reconstructs the original exactly.~removes,reconstructs,exactly",
        "How do Caesar, Vernam and modern key systems differ?~Caesar shifts characters and is easily cracked; Vernam XORs a message with a random one-use equal-length key for perfect secrecy; practical systems use symmetric shared keys or asymmetric public/private pairs.~Caesar,Vernam,one-use,asymmetric",
      ]),
    ],
  },
  {
    code: "4.6", slug: "fundamentals-of-computer-systems", title: "Fundamentals of computer systems", icon: "🖥️", description: "Hardware, software, languages, translators and Boolean logic.", units: [
      unit("hardware-software", "Hardware and software", "Relate physical components to system and application software.", [
        "What is hardware?~The physical electronic and mechanical components of a computer system.~physical,components,system",
        "What is software?~Programs and associated data that provide instructions for hardware.~programs,data,instructions",
        "How do system and application software differ?~System software manages or supports the computer; applications perform user tasks.~manages,supports,user",
        "What does an operating system provide?~Resource management, process control, security, file services and user or application interfaces.~resources,processes,interfaces",
        "What is utility software?~System software performing maintenance, security, analysis or optimisation tasks.~maintenance,security,optimisation",
      ]),
      unit("language-classification", "Language classification", "Compare low-level, imperative, declarative and object-oriented languages.", [
        "What is machine code?~Binary instructions executed directly by a particular processor architecture.~binary,directly,processor",
        "What is assembly language?~A low-level mnemonic representation closely corresponding to machine instructions.~low-level,mnemonic,machine",
        "What characterises an imperative language?~Programs state a sequence of commands that update program state.~commands,sequence,state",
        "What characterises a declarative language?~Programs describe required results or relationships rather than explicit control steps.~results,relationships,not steps",
        "Why are high-level languages portable?~Their abstractions are translated for different target processors rather than encoding one instruction set directly.~abstraction,translated,target",
      ]),
      unit("translators", "Program translators", "Explain compilation, interpretation, assembly and virtual machines.", [
        "What does a compiler do?~It translates a complete source program into target code before execution.~complete,source,target",
        "What does an interpreter do?~It translates and executes source constructs progressively at runtime.~progressively,runtime,executes",
        "What does an assembler do?~It translates assembly mnemonics and operands into machine code.~mnemonics,operands,machine",
        "What is bytecode?~Intermediate portable instructions executed or further compiled by a virtual machine.~intermediate,portable,virtual machine",
        "Why can compiled code execute faster?~Translation and many optimisations occur before runtime, producing native target instructions.~optimisations,before,native",
      ]),
      unit("logic-boolean", "Logic gates and Boolean algebra", "Represent and simplify digital logic.", [
        "When does XOR output true?~XOR is true when its inputs differ.~inputs,differ",
        "What does a truth table show?~Every possible input combination and the corresponding output of an expression or circuit.~every,input,output",
        "What do De Morgan's laws state?~Negating AND produces OR of negations; negating OR produces AND of negations.~negating,AND,OR",
        "Why simplify a Boolean expression?~An equivalent simpler expression can require fewer gates, reducing cost, delay and power.~equivalent,fewer,delay",
        "How is a logic circuit derived from an expression?~Operators map to gates and nested subexpressions determine gate connections and intermediate outputs.~operators,gates,connections",
      ]),
    ],
  },
  {
    code: "4.7", slug: "computer-organisation-and-architecture", title: "Computer organisation and architecture", icon: "🧩", description: "Internal components, processors, instructions, interrupts and peripheral devices.", units: [
      unit("internal-components", "Internal components", "Explain memory, buses, processors and the stored-program concept.", [
        "What is the stored-program concept?~Instructions and data share addressable memory so programs can be fetched and modified as data.~instructions,data,memory",
        "What is the role of main memory?~It stores instructions and data currently required by executing programs.~instructions,data,executing",
        "What do address, data and control buses carry?~They carry locations, values and coordination signals respectively.~locations,values,signals",
        "What is the role of the system clock?~It provides timing pulses that synchronise processor operations.~timing,synchronise,operations",
        "How do cache and RAM differ?~Cache is smaller and faster memory close to the processor; RAM is larger main working memory.~smaller,faster,working",
      ]),
      unit("processor-cycle", "Processor and fetch-execute cycle", "Trace register transfers and control signals.", [
        "What does the program counter hold?~The address of the next instruction to fetch.~address,next,instruction",
        "What do MAR and MDR hold?~MAR holds a memory address; MDR holds data or an instruction transferred to or from memory.~address,transfer,memory",
        "What does the current instruction register hold?~The fetched instruction currently being decoded and executed.~fetched,decoded,executed",
        "What do the ALU and control unit do?~The ALU calculates and compares; the control unit decodes and coordinates operations.~calculates,decodes,coordinates",
        "What happens in the fetch-execute cycle?~Register transfers fetch an instruction, the control unit decodes it, and processor components execute it.~fetch,decode,execute",
      ]),
      unit("instructions-interrupts", "Instructions and interrupts", "Use addressing modes and explain interrupt handling.", [
        "What are opcode and operand?~The opcode identifies the operation; the operand identifies data, a register or an address.~operation,data,address",
        "How do immediate and direct addressing differ?~Immediate embeds the value; direct provides the memory address containing the value.~embeds,address,value",
        "What is indexed addressing?~An effective address is formed by combining a base address with an index value.~base,index,address",
        "What is an interrupt?~A signal requesting processor attention for an event requiring service.~signal,attention,event",
        "How is an interrupt serviced?~The processor saves state, runs an interrupt service routine, then restores state and resumes.~saves,ISR,resumes",
      ]),
      unit("performance-peripherals", "Performance and peripherals", "Evaluate processor factors and select external devices.", [
        "How do clock speed, cores and cache affect performance?~They affect cycles per second, parallel work and access to frequently used data.~cycles,parallel,data",
        "Why does more cache not guarantee proportional speedup?~Programs vary in locality and other bottlenecks may dominate execution time.~locality,bottlenecks,time",
        "How should an input device be selected?~Consider required data, accuracy, speed, environment, accessibility, reliability and cost.~accuracy,environment,cost",
        "Compare magnetic, optical and solid-state storage.~They trade capacity, price, speed, durability, portability and longevity differently.~capacity,speed,durability",
        "What is an embedded system?~A computer integrated into a larger product to perform one or a limited set of functions.~integrated,larger,limited",
      ]),
    ],
  },
  {
    code: "4.8", slug: "consequences-of-computing", title: "Consequences of uses of computing", icon: "⚖️", description: "Moral, ethical, legal, cultural and environmental impacts of computer systems.", units: [
      unit("stakeholders-ethics", "Stakeholders and ethics", "Evaluate competing perspectives and responsibilities.", [
        "Who is a stakeholder?~A person or group that affects, uses or is affected by a computing system.~person,group,affected",
        "How do moral and legal issues differ?~Moral reasoning concerns what ought to happen; law defines enforceable requirements.~ought,enforceable,requirements",
        "Why can a legal system still be unethical?~Compliance may still create unfair, opaque or harmful outcomes for stakeholders.~unfair,opaque,harmful",
        "How should an impact answer reach a conclusion?~Compare stakeholder evidence and competing values, then justify a proportionate decision.~evidence,values,justify",
        "Why is professional responsibility important?~Computing practitioners control technical decisions that can create widespread benefits or harms.~control,decisions,harms",
      ]),
      unit("privacy-ownership", "Privacy and ownership", "Balance data use, surveillance and intellectual property.", [
        "What privacy risks arise from large data collections?~They enable profiling, inference, surveillance, breaches and uses beyond original expectations.~profiling,inference,breaches",
        "What makes consent meaningful?~It must be informed, specific, freely given and revocable without unreasonable disadvantage.~informed,specific,revocable",
        "Why does copyright apply to software?~Software is an original work whose copying and distribution are controlled by its owner or licence.~copying,distribution,licence",
        "What interests conflict in software piracy?~Access and sharing conflict with creator control, attribution, security and sustainable income.~access,creator,income",
        "Why is anonymised data sometimes re-identifiable?~Combining attributes or external data can reveal unique individuals despite removed names.~combining,attributes,individuals",
      ]),
      unit("automation-fairness", "Automation and fairness", "Assess employment, bias and accountability.", [
        "How can automation benefit society?~It can improve speed, consistency, accessibility and safety and remove hazardous tasks.~consistency,accessibility,safety",
        "What harms can automation cause?~It may displace jobs, concentrate power, scale mistakes and reduce meaningful human oversight.~jobs,power,oversight",
        "How can algorithmic bias arise?~Training data, labels, proxy variables, objectives or deployment context can encode unfairness.~data,objectives,unfairness",
        "Why is explainability valuable?~Affected people can understand, challenge and attribute responsibility for important decisions.~understand,challenge,responsibility",
        "What is a human-in-the-loop control?~A person reviews or can override an automated recommendation or decision.~reviews,override,decision",
      ]),
      unit("culture-environment-access", "Culture, environment and access", "Evaluate inclusion and life-cycle impacts.", [
        "What is the digital divide?~Unequal access to devices, connectivity, skills and accessible services.~unequal,connectivity,skills",
        "How can design choices exclude users?~Interfaces may ignore disability, language, culture, connectivity limits or device constraints.~disability,language,constraints",
        "What environmental costs occur across a device life cycle?~Extraction, manufacture, energy use, transport and disposal consume resources and create pollution.~manufacture,energy,pollution",
        "How can electronic waste be reduced?~Repair, reuse, modular upgrades, longer support and responsible recycling extend useful life.~repair,reuse,recycling",
        "How can platforms influence culture?~Ranking and moderation systems shape visibility, language, norms and which communities gain attention.~ranking,visibility,norms",
      ]),
    ],
  },
  {
    code: "4.9", slug: "communication-and-networking", title: "Communication and networking", icon: "🌐", description: "Communication methods, topologies, internet operation, TCP/IP, addressing and client-server systems.", units: [
      unit("communication-networks", "Communication and networks", "Explain transmission, topologies and host relationships.", [
        "How do serial and parallel transmission differ?~Serial sends bits sequentially over fewer channels; parallel sends several bits simultaneously.~sequentially,channels,simultaneously",
        "How do synchronous and asynchronous transmission differ?~Synchronous uses shared timing; asynchronous frames data with start and stop information.~timing,start,stop",
        "What affects network performance?~Bandwidth, latency, traffic, interference, hardware and protocol overhead affect throughput and response.~bandwidth,latency,throughput",
        "How do star and mesh topologies differ?~Star connects hosts through a central device; mesh provides multiple inter-host paths.~central,multiple,paths",
        "How do client-server and peer-to-peer differ?~Client-server centralises services; peers can request and provide resources directly.~centralises,peers,directly",
      ]),
      unit("wireless-internet", "Wireless networks and the internet", "Explain radio access, routing and internet services.", [
        "How does Wi-Fi share a wireless medium?~Devices follow access rules and use radio channels while managing interference and collisions.~radio,channels,collisions",
        "What does a router do?~It forwards packets between networks using destination addresses and a routing table.~packets,destination,routing",
        "What does DNS do?~It resolves human-readable domain names to IP addresses.~domain,IP,resolves",
        "What is packet switching?~Data is divided into independently routed packets and reassembled at the destination.~divided,routed,reassembled",
        "What security risks affect internet communication?~Interception, spoofing, malware, denial of service and unauthorised access threaten systems and data.~interception,spoofing,access",
      ]),
      unit("tcp-ip-addressing", "TCP/IP and addressing", "Relate layers, protocols, IP addresses and subnetting.", [
        "Why is networking organised in layers?~Layers separate responsibilities and standardise interfaces so components can change independently.~responsibilities,interfaces,independently",
        "How do TCP and IP differ?~TCP provides reliable ordered transport; IP provides addressing and packet routing.~reliable,ordered,routing",
        "What does a subnet mask identify?~It separates the network prefix from the host portion of an IP address.~network,host,address",
        "How do public and private IP addresses differ?~Public addresses are internet-routable; private addresses are reused within local networks.~routable,reused,local",
        "What do DHCP and NAT do?~DHCP leases configuration to hosts; NAT maps private addresses and ports to public communication.~leases,private,public",
      ]),
      unit("application-client-server", "Application protocols and clients", "Explain services, ports and distributed application models.", [
        "What is an application-layer protocol?~Rules defining messages and behaviour for a network service such as web, email or name resolution.~messages,service,rules",
        "What is a port number?~A transport-layer identifier directs incoming communication to the correct application process.~identifier,application,process",
        "What is port forwarding?~A gateway maps incoming communication on a public port to a chosen internal host and port.~gateway,public,internal",
        "How do thin and thick clients differ?~Thin clients rely heavily on servers; thick clients perform more processing and storage locally.~servers,processing,locally",
        "What is an API in networked software?~A documented interface through which software requests data or services from another component.~interface,requests,services",
      ]),
    ],
  },
  {
    code: "4.10", slug: "fundamentals-of-databases", title: "Fundamentals of databases", icon: "🗃️", description: "Data modelling, relational design, normalisation, SQL and client-server databases.", units: [
      unit("conceptual-models", "Conceptual data models", "Model entities, attributes and relationships.", [
        "What is an entity?~A distinguishable real-world object or concept about which data is stored.~object,concept,data",
        "What is an attribute?~A named property describing an entity or relationship.~property,entity,relationship",
        "What does relationship cardinality express?~It states how many instances of one entity may relate to instances of another.~instances,relate,number",
        "What is an entity-relationship diagram?~A conceptual model showing entities, attributes, relationships and cardinalities.~model,entities,cardinalities",
        "Why create a conceptual model before tables?~It captures business meaning independently of implementation and exposes missing or ambiguous requirements.~meaning,independent,requirements",
      ]),
      unit("relational-design", "Relational design", "Use tables, keys and integrity constraints.", [
        "What is a relation?~A table of tuples sharing named attributes and governed by a defined schema.~table,tuples,schema",
        "What is a primary key?~A minimal attribute set that uniquely identifies each row.~minimal,uniquely,row",
        "What is a foreign key?~An attribute set referencing a candidate key in another or the same relation.~references,candidate,relation",
        "What is referential integrity?~Foreign-key values must match permitted referenced keys or be null when allowed.~foreign,match,null",
        "What are insertion, update and deletion anomalies?~Poorly structured duplicated data causes inconsistent or unintended effects when records change.~duplicated,inconsistent,change",
      ]),
      unit("normalisation-sql", "Normalisation and SQL", "Transform schemas and query relational data.", [
        "What is first normal form?~Every field contains one atomic value and repeating groups are removed.~atomic,repeating,removed",
        "What is second normal form?~It is in 1NF and every non-key attribute depends on the whole candidate key.~whole,key,depends",
        "What is third normal form?~It is in 2NF and non-key attributes do not depend transitively on a candidate key.~non-key,transitively,candidate",
        "What do SELECT, FROM and WHERE specify?~They specify returned expressions, source relations and row-selection conditions.~returned,source,conditions",
        "What does a JOIN do?~It combines related rows from relations using a matching condition.~combines,related,matching",
      ]),
      unit("database-systems", "Database systems", "Explain DBMS services, transactions and client-server access.", [
        "What does a DBMS provide?~It manages storage, queries, integrity, security, concurrency, recovery and controlled data access.~integrity,concurrency,recovery",
        "What is a database transaction?~A logical unit of work whose operations should succeed or fail together.~unit,succeed,fail",
        "Why is record locking used?~It controls concurrent access so conflicting operations do not corrupt shared data.~concurrent,conflicting,corrupt",
        "Why separate database client and server?~The server centralises trusted data management while clients provide task-specific interfaces.~centralises,trusted,interfaces",
        "What is a database view?~A named virtual relation derived from a query that can simplify or restrict access.~virtual,query,access",
      ]),
    ],
  },
  {
    code: "4.11", slug: "big-data", title: "Big Data", icon: "📊", description: "Large, rapid and varied data sets, distributed processing and data-driven consequences.", units: [
      unit("big-data-properties", "Big Data properties", "Explain volume, velocity, variety and veracity.", [
        "What is Big Data?~Data whose scale, speed or complexity requires approaches beyond conventional single-system processing.~scale,speed,complexity",
        "What is volume?~The quantity of data stored or processed.~quantity,data",
        "What is velocity?~The rate at which data is generated, transmitted and must be processed.~rate,generated,processed",
        "What is variety?~The diversity of structured, semi-structured and unstructured formats and sources.~structured,formats,sources",
        "What is veracity?~The quality, reliability and uncertainty of data and its provenance.~quality,reliability,provenance",
      ]),
      unit("sources-capture", "Sources and capture", "Assess sensors, transactions, social data and metadata.", [
        "What sources produce Big Data?~Sensors, transactions, communications, web activity, scientific instruments and connected devices.~sensors,transactions,devices",
        "What is metadata?~Data describing other data, such as origin, time, format, owner or location.~describing,origin,format",
        "Why can automatically captured data be biased?~Coverage, sensor placement, platform users and collection rules may not represent the target population.~coverage,users,population",
        "Why is provenance important?~Knowing origin and transformations helps judge trust, legality and fitness for use.~origin,transformations,trust",
        "What is data cleaning?~Detecting and correcting or removing inaccurate, inconsistent, duplicate or incomplete values.~correcting,inconsistent,incomplete",
      ]),
      unit("distributed-processing", "Distributed processing", "Scale storage and analysis across machines.", [
        "Why distribute Big Data processing?~Work and storage can be partitioned across machines for capacity, throughput and resilience.~partitioned,capacity,resilience",
        "What is parallel processing?~Multiple processing units perform parts of a computation simultaneously.~multiple,parts,simultaneously",
        "What is a distributed file system?~Files are partitioned or replicated across networked nodes while presented as one storage system.~partitioned,replicated,nodes",
        "Why replicate data?~Copies improve availability and read performance when nodes fail or are geographically separated.~availability,fail,performance",
        "What consistency challenge arises in distributed systems?~Replicas may temporarily disagree, requiring protocols and trade-offs between consistency and availability.~replicas,trade-offs,availability",
      ]),
      unit("analytics-impacts", "Analytics and consequences", "Use large-scale patterns responsibly.", [
        "What is data mining?~Applying computational methods to discover useful patterns, associations or predictive models in data.~patterns,associations,predictive",
        "Why does correlation not prove causation?~An association may result from coincidence, bias, reverse influence or an unobserved variable.~association,bias,variable",
        "How can Big Data improve decisions?~It can reveal trends, support forecasts, personalise services and detect rare events.~trends,forecasts,events",
        "What privacy risk comes from data linkage?~Combining separate data sets can infer sensitive facts or re-identify individuals.~combining,infer,re-identify",
        "Why must models be monitored after deployment?~Data and behaviour change, so accuracy, bias and unintended effects can drift over time.~change,bias,drift",
      ]),
    ],
  },
  {
    code: "4.12", slug: "functional-programming", title: "Functional programming", icon: "λ", description: "Functions, composition, partial application, recursion and list processing.", units: [
      unit("functions-types", "Functions and types", "Reason about mappings, domains and pure functions.", [
        "What is a mathematical function?~A mapping assigning each value in a domain exactly one value in a codomain.~mapping,domain,codomain",
        "What is a function type?~A description of the types of inputs a function accepts and the output it returns.~inputs,output,types",
        "What is a pure function?~Its result depends only on inputs and it causes no observable side effects.~inputs,no side effects,result",
        "Why does referential transparency help reasoning?~An expression can be replaced by its value without changing program behaviour.~replaced,value,behaviour",
        "What is a higher-order function?~A function that accepts functions as arguments or returns a function.~arguments,returns,function",
      ]),
      unit("application-composition", "Application and composition", "Apply, partially apply and compose functions.", [
        "What is function application?~Supplying an argument to a function to produce its corresponding result.~argument,function,result",
        "What is partial application?~Fixing some arguments of a multi-argument function to create a new function awaiting the rest.~fixing,new,remaining",
        "What is function composition?~Combining functions so the output of one becomes the input of another.~output,input,combining",
        "Why must composed function types be compatible?~The earlier output type must match the later function's required input type.~output,match,input",
        "What is currying?~Transforming a multi-argument function into a chain of single-argument functions.~multi,chain,single",
      ]),
      unit("functional-programs", "Functional programs", "Use recursion and immutable expressions.", [
        "How does functional programming avoid mutable state?~New values are produced by expressions instead of updating existing variables.~new,expressions,updating",
        "Why is recursion common in functional programming?~Recursive definitions naturally process inductive structures such as lists without mutable loop counters.~recursive,lists,mutable",
        "What is a recursive base case?~An input handled directly that stops further recursive application.~directly,stops,recursive",
        "What is pattern matching?~Selecting a definition by the structure or constructor of its input value.~selecting,structure,input",
        "What is lazy evaluation?~An expression is evaluated only when its value is required.~only,required,evaluated",
      ]),
      unit("list-processing", "List processing", "Construct and transform recursive lists.", [
        "What are head and tail of a list?~Head is the first element; tail is the remaining list.~first,remaining,list",
        "What does cons do?~It constructs a new list by placing one element before an existing list.~constructs,element,before",
        "What does map do?~It applies a function to every list element and returns the transformed list.~every,transformed,list",
        "What does filter do?~It returns the elements for which a predicate is true.~elements,predicate,true",
        "What does fold or reduce do?~It combines list elements into one accumulated result using a supplied function.~combines,accumulated,function",
      ]),
    ],
  },
  {
    code: "4.13", slug: "systematic-problem-solving", title: "Systematic approach to problem solving", icon: "🧭", description: "Analysis, design, implementation, testing and evaluation of software solutions.", units: [
      unit("analysis", "Analysis", "Define problems, stakeholders and measurable requirements.", [
        "What is problem analysis?~Investigating the current situation, stakeholders, data, processes, constraints and required outcomes.~stakeholders,data,constraints",
        "Why identify stakeholders?~Their needs and context determine requirements, usability and acceptance criteria.~needs,context,criteria",
        "What is a functional requirement?~A specific behaviour or service the solution must provide.~behaviour,service,must",
        "What is a non-functional requirement?~A quality or constraint such as performance, security, usability or reliability.~quality,constraint,reliability",
        "What makes an objective measurable?~A defined condition and evidence allow an observer to decide objectively whether it was achieved.~condition,evidence,achieved",
      ]),
      unit("design", "Design", "Model data, algorithms, modules and interfaces.", [
        "Why decompose a solution?~Smaller modules have clearer responsibilities and can be developed, tested and maintained independently.~modules,responsibilities,independently",
        "What is a module interface?~A documented contract specifying inputs, outputs, purpose and permitted interactions.~contract,inputs,outputs",
        "Why choose data structures during design?~Operations, scale and relationships determine structures that make the solution correct and efficient.~operations,scale,efficient",
        "What should an algorithm design communicate?~Control flow, processing, data use and exceptional cases independently of incidental syntax.~control,data,exceptions",
        "Why is prototyping iterative?~Feedback from working models exposes misunderstandings and informs repeated design refinement.~feedback,exposes,refinement",
      ]),
      unit("implementation-testing", "Implementation and testing", "Build, debug and verify a solution systematically.", [
        "What makes code maintainable?~Clear names, modularity, consistent style, documentation, low coupling and appropriate abstraction.~names,modularity,coupling",
        "What is debugging?~Locating, explaining and correcting the cause of observed incorrect behaviour.~locating,cause,correcting",
        "What are normal, boundary and erroneous tests?~They use typical valid values, limits, and invalid inputs respectively.~typical,limits,invalid",
        "Why record expected and actual results?~Their comparison provides evidence of correctness and identifies failures requiring investigation.~comparison,evidence,failures",
        "What is acceptance testing?~Intended users check whether the completed system satisfies their needs and agreed requirements.~users,needs,requirements",
      ]),
      unit("evaluation", "Evaluation", "Judge fitness, limitations and future development.", [
        "How should requirements be evaluated?~Address each requirement using test evidence and explain whether it is fully, partly or not met.~each,evidence,met",
        "Why include user feedback?~It supplies evidence about real usability and suitability that developer tests may miss.~usability,suitability,miss",
        "What is a limitation?~A specific constraint or weakness that prevents the solution meeting a need fully or efficiently.~constraint,weakness,need",
        "How should future improvements be proposed?~Link a technically feasible change to evidence of a limitation or new stakeholder need.~feasible,evidence,need",
        "What makes an evaluation reasoned?~Claims are supported by evidence, balanced against criteria and developed into justified conclusions.~evidence,criteria,conclusions",
      ]),
    ],
  },
  {
    code: "4.14", slug: "non-exam-assessment-project", title: "Non-exam assessment project", icon: "🏗️", description: "A 75-mark independent programmed solution with concise supporting documentation.", units: [
      unit("nea-analysis-design", "NEA analysis and design", "Choose an A-level problem and plan a justified solution.", [
        "What makes an AQA NEA problem suitable?~It requires a substantial programmed solution, sufficient technical skill and scope for independent decisions.~programmed,technical,independent",
        "What earns analysis credit?~A well-defined problem, relevant research, justified objectives, users, requirements and measurable criteria.~research,objectives,criteria",
        "Why should objectives be measurable?~Testing and evaluation need observable evidence to decide whether the solution succeeds.~testing,evidence,succeeds",
        "What should documented design contain?~Justified data structures, algorithms, modules, interfaces and user-interface decisions that form a complete plan.~structures,algorithms,interfaces",
        "Why can the project design evolve?~Iterative development may reveal better approaches, but changes and their reasons should be evidenced.~iterative,changes,evidenced",
      ]),
      unit("technical-solution", "Technical solution", "Demonstrate completeness and demanding programming techniques.", [
        "How many AQA NEA marks reward the technical solution?~The technical solution receives 42 of the 75 marks, emphasising working programmed achievement.~42,75,programmed",
        "What is completeness of solution?~The implemented product provides the intended core functionality and solves the stated problem effectively.~implemented,functionality,solves",
        "What makes a technique technically demanding?~Its complexity, appropriateness and correct integration demonstrate A-level programming skill rather than superficial use.~complexity,appropriate,integration",
        "Why should code evidence be selective and annotated?~Focused extracts demonstrate important techniques while commentary explains their purpose and quality.~focused,techniques,commentary",
        "Why is independently written code important?~Assessment must reflect the student's own authenticated programming decisions and understanding.~own,authenticated,understanding",
      ]),
      unit("nea-testing", "NEA testing", "Provide systematic evidence of correctness and robustness.", [
        "How many marks reward AQA NEA testing?~Testing receives 8 of the 75 available marks.~8,75,testing",
        "What should a test record include?~Purpose, input, expected result, actual result, pass status and any corrective action.~purpose,expected,actual",
        "Why test boundary and erroneous data?~They expose faults at limits and show invalid input is handled robustly.~limits,invalid,robustly",
        "What is iterative testing evidence?~Tests performed during development show how failures led to diagnosed and justified code changes.~development,failures,changes",
        "Why is representative user testing useful?~It checks realistic workflows, usability and requirements under conditions meaningful to stakeholders.~realistic,usability,stakeholders",
      ]),
      unit("nea-evaluation", "NEA evaluation and evidence", "Evaluate concisely against objectives and technical outcomes.", [
        "How many marks reward AQA NEA evaluation?~Evaluation receives 4 of the 75 available marks.~4,75,evaluation",
        "How should objectives be evaluated?~Each is judged using test and user evidence, with clear discussion of success and remaining limitations.~each,evidence,limitations",
        "What makes a project report effective?~Concise, well-organised evidence makes the student's reasoning, development and technical achievement easy to verify.~concise,evidence,verify",
        "Why are unexplained screenshots weak evidence?~They show appearance but not reasoning, code quality, test conditions or independent understanding.~appearance,reasoning,understanding",
        "What must happen before submission?~The work must be authenticated, securely retained and submitted under current AQA NEA administration requirements.~authenticated,securely,current",
      ]),
    ],
  },
];

export const AQA_A_LEVEL_SOURCE_NOTES = ["AQA 7517 specification", "AQA official assessment guidance", "PMT AQA A-level resources", "Craig 'n' Dave AQA 7517 objective map"] as const;
