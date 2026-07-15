-- Specification-aligned course maps and original starter lessons for every supported course.
-- Topic names follow the official specifications; explanations and revision material are original.

create temporary table specification_content_catalog (
  course_id uuid,
  code text,
  title text,
  slug text,
  description text,
  focus text,
  flash_front text,
  flash_back text,
  sort_order smallint,
  icon text
) on commit drop;

insert into specification_content_catalog values
-- OCR GCSE J277
('10000000-0000-0000-0000-000000000001','1.1','Systems architecture','systems-architecture','How processors, registers and embedded systems execute instructions.','Follow data through the fetch–decode–execute cycle, distinguish CPU components, and explain how clock speed, cache and cores affect performance.','What is the purpose of the CPU?','To process data and execute program instructions.',1,'🧩'),
('10000000-0000-0000-0000-000000000001','1.2','Memory and storage','memory-and-storage','Primary memory, secondary storage, data units and file sizes.','Compare RAM, ROM, virtual memory and storage technologies, then connect capacity, speed, durability and cost to a scenario.','Why is RAM described as volatile?','Its contents are lost when electrical power is removed.',2,'💾'),
('10000000-0000-0000-0000-000000000001','1.3','Computer networks, connections and protocols','networks-and-protocols','How networks are organised and how data moves reliably between devices.','Compare LANs and WANs, wired and wireless connections, topologies, packet switching, addressing and common protocols.','Why are protocols needed?','They provide agreed rules so devices can interpret and exchange data correctly.',3,'🌐'),
('10000000-0000-0000-0000-000000000001','1.4','Network security','network-security','Threats to computer systems and the controls used to reduce risk.','Recognise social engineering, malware and network attacks, then justify prevention methods such as authentication, firewalls, encryption and testing.','What is social engineering?','Manipulating people into revealing information or performing an unsafe action.',4,'🛡️'),
('10000000-0000-0000-0000-000000000001','1.5','Systems software','systems-software','The operating system and utility programs that support a computer.','Explain user, memory, peripheral and file management, then distinguish operating-system services from utilities.','What is the role of an operating system?','It manages hardware and software resources and provides services for users and applications.',5,'⚙️'),
('10000000-0000-0000-0000-000000000001','1.6','Ethical, legal, cultural and environmental impacts','impacts-of-digital-technology','How digital technology affects people, organisations and the environment.','Evaluate privacy, access, intellectual property, environmental costs and relevant legislation from more than one viewpoint.','What makes an impact question evaluative?','It weighs benefits, drawbacks, affected groups and evidence before reaching a justified conclusion.',6,'⚖️'),
('10000000-0000-0000-0000-000000000001','2.1','Algorithms','algorithms','Designing, tracing and evaluating step-by-step solutions.','Use decomposition, abstraction, flowcharts, pseudocode and trace tables, and compare searching and sorting algorithms.','What is decomposition?','Breaking a complex problem into smaller, manageable parts.',7,'🧠'),
('10000000-0000-0000-0000-000000000001','2.2','Programming fundamentals','programming-fundamentals','Core constructs used to create working programs.','Apply variables, data types, selection, iteration, strings, files, arrays, procedures and functions to solve problems.','What are the three basic programming constructs?','Sequence, selection and iteration.',8,'💻'),
('10000000-0000-0000-0000-000000000001','2.3','Producing robust programs','robust-programs','Writing programs that remain dependable with real users and data.','Use validation, authentication, defensive design, maintainable code and systematic testing with normal, boundary and invalid data.','How does validation differ from verification?','Validation checks acceptability; verification checks that data was copied or entered accurately.',9,'✅'),
('10000000-0000-0000-0000-000000000001','2.4','Boolean logic','boolean-logic','Logic gates, truth tables and Boolean expressions.','Interpret AND, OR and NOT, build truth tables and simplify or construct logic expressions for a stated condition.','When does an AND gate output 1?','Only when every input is 1.',10,'🔀'),
('10000000-0000-0000-0000-000000000001','2.5','Programming languages and IDEs','languages-and-ides','Language levels, translators and development environments.','Compare high- and low-level languages, compilers and interpreters, and explain how IDE tools support development.','How does a compiler differ from an interpreter?','A compiler translates a whole program before execution; an interpreter translates and executes step by step.',11,'🧰'),

-- AQA GCSE 8525
('10000000-0000-0000-0000-000000000002','3.1','Fundamentals of algorithms','fundamentals-of-algorithms','Representing, tracing and comparing computational solutions.','Develop algorithms using pseudocode and flowcharts, trace them accurately, and reason about searches, sorts and efficiency.','What does a trace table show?','How variable values and outputs change as an algorithm executes.',1,'🧠'),
('10000000-0000-0000-0000-000000000002','3.2','Programming','programming','Programming concepts and techniques for reliable problem solving.','Use data types, control structures, subroutines, arrays, records, files, SQL and robust testing in a practical language.','Why are subroutines useful?','They divide a program into reusable, testable units with clear responsibilities.',2,'💻'),
('10000000-0000-0000-0000-000000000002','3.3','Fundamentals of data representation','data-representation','How numbers, text, images and sound are represented in binary.','Convert number bases, calculate storage requirements, explain character encoding and describe image, sound and compression choices.','What does colour depth control?','The number of bits per pixel and therefore the number of colours that can be represented.',3,'🔢'),
('10000000-0000-0000-0000-000000000002','3.4','Computer systems','computer-systems','Hardware, software and Boolean logic inside computer systems.','Explain CPU operation, memory and storage, classify software and use truth tables to reason about logic circuits.','What is the stored-program concept?','Instructions and data are held in memory so the processor can fetch and execute them.',4,'🖥️'),
('10000000-0000-0000-0000-000000000002','3.5','Fundamentals of computer networks','computer-networks','Network types, hardware, protocols and layered communication.','Explain wired and wireless networks, topologies, network services, addressing, protocols and the benefits of layered models.','What does DNS do?','It resolves a domain name to the corresponding IP address.',5,'🌐'),
('10000000-0000-0000-0000-000000000002','3.6','Cyber security','cyber-security','Identifying vulnerabilities, attacks and defensive controls.','Assess threats including malware, social engineering and network attacks, and justify technical and procedural protections.','What is penetration testing?','Authorised testing that attempts to find exploitable weaknesses in a system.',6,'🛡️'),
('10000000-0000-0000-0000-000000000002','3.7','Relational databases and SQL','relational-databases-and-sql','Organising related data and retrieving it with structured queries.','Identify tables, records, fields, keys and relationships, then construct SELECT queries using conditions and ordering.','What is a primary key?','A field or combination of fields that uniquely identifies each record in a table.',7,'🗃️'),
('10000000-0000-0000-0000-000000000002','3.8','Ethical, legal and environmental impacts','ethical-legal-environmental-impacts','Consequences of computing for individuals, society and the planet.','Analyse stakeholder perspectives, digital inequality, privacy, intellectual property, automation, energy use and relevant laws.','Why should an impact answer mention stakeholders?','The same technology can produce different benefits, risks and responsibilities for different groups.',8,'⚖️'),

-- OCR A-level H446
('10000000-0000-0000-0000-000000000003','1.1','Processors, input, output and storage','processors-io-and-storage','Contemporary processor design and the devices connected to computer systems.','Analyse CPU architecture, instruction processing, processor types, input and output devices, and storage choices.','What is pipelining?','Overlapping stages of instruction processing to improve processor throughput.',1,'🧩'),
('10000000-0000-0000-0000-000000000003','1.2','Software and software development','software-development','Systems software, applications, languages and development methods.','Compare operating-system functions, translators, programming paradigms, software life cycles, testing and development tools.','What is an assembly-language opcode?','A mnemonic that represents a machine-level operation.',2,'🧰'),
('10000000-0000-0000-0000-000000000003','1.3','Exchanging data','exchanging-data','How data is represented, transmitted, protected and shared.','Explain compression, encryption, hashing, databases, networks, web technologies and the standards that support data exchange.','Why is hashing normally one-way?','A hash is designed to create a fixed digest without providing a practical method to reconstruct the original input.',3,'🔄'),
('10000000-0000-0000-0000-000000000003','1.4','Data types, data structures and algorithms','data-types-structures-and-algorithms','Representations and structures used to store and process information.','Work with primitive types, binary arithmetic, arrays, records, lists, stacks, queues, trees, graphs and Boolean algebra.','What property defines a stack?','Last in, first out: the most recently added item is removed first.',4,'🗂️'),
('10000000-0000-0000-0000-000000000003','1.5','Legal, moral, cultural and ethical issues','legal-moral-cultural-ethical-issues','Responsibilities and consequences arising from computer systems.','Apply legislation and ethical reasoning to privacy, ownership, access, automation, surveillance and environmental questions.','How is an ethical issue different from a legal issue?','Law defines enforceable rules; ethics considers what ought to be done, including situations not settled by law.',5,'⚖️'),
('10000000-0000-0000-0000-000000000003','2.1','Elements of computational thinking','computational-thinking','Ways of thinking that make complex problems computable.','Use abstraction, decomposition, logical reasoning, anticipation and concurrent thinking to model and organise solutions.','What is abstraction?','Removing irrelevant detail so attention stays on the features needed to solve the problem.',6,'🧠'),
('10000000-0000-0000-0000-000000000003','2.2','Problem solving and programming','problem-solving-and-programming','Techniques for turning requirements into correct programs.','Select suitable data structures, use reusable program units, apply object-oriented ideas and test solutions systematically.','What is encapsulation?','Keeping data and the operations on it together while controlling direct access to internal state.',7,'💻'),
('10000000-0000-0000-0000-000000000003','2.3','Algorithms','advanced-algorithms','Analysing and implementing algorithms at A-level depth.','Trace and compare searching, sorting, graph traversal, path-finding and optimisation algorithms using complexity-aware reasoning.','What does Big O notation communicate?','How an algorithm’s time or space requirement grows as the input size increases.',8,'📈'),

-- AQA A-level 7517
('10000000-0000-0000-0000-000000000004','4.1','Fundamentals of programming','fundamentals-of-programming','Programming constructs, data types and structured program design.','Apply assignment, selection, iteration, subroutines, recursion, exception handling and object-oriented concepts precisely.','What is a base case in recursion?','A condition that stops further recursive calls and allows the calls to return.',1,'💻'),
('10000000-0000-0000-0000-000000000004','4.2','Fundamentals of data structures','fundamentals-of-data-structures','Structures for organising data and supporting efficient operations.','Choose and manipulate arrays, records, queues, stacks, graphs, trees, hash tables, dictionaries and vectors.','Why is a hash table useful?','It can provide very fast average lookup by mapping a key to a storage location.',2,'🗂️'),
('10000000-0000-0000-0000-000000000004','4.3','Fundamentals of algorithms','fundamentals-of-advanced-algorithms','Correctness, efficiency, searching, sorting and graph algorithms.','Trace algorithms, justify design choices, compare time complexity and apply standard searches, sorts and traversals.','What is binary search’s prerequisite?','The searchable collection must be ordered.',3,'📈'),
('10000000-0000-0000-0000-000000000004','4.4','Theory of computation','theory-of-computation','Models of computation, formal languages and problem complexity.','Reason with abstraction, regular expressions, finite-state machines, Turing machines, classification of algorithms and limits of computability.','What does a finite-state machine model?','A system with a finite set of states and transitions determined by inputs.',4,'🤖'),
('10000000-0000-0000-0000-000000000004','4.5','Fundamentals of data representation','advanced-data-representation','Binary representation of numbers, characters, images and sound.','Perform base conversions and binary arithmetic, represent real numbers, explain encodings and calculate multimedia storage.','What trade-off comes with a higher sampling rate?','More accurate sound representation but a larger file size.',5,'🔢'),
('10000000-0000-0000-0000-000000000004','4.6','Fundamentals of computer systems','fundamentals-of-computer-systems','Hardware, software, logic and classification of computer systems.','Connect hardware and software layers, explain Boolean logic and classify programming languages, translators and system software.','What is system software?','Software that manages the computer or provides a platform and services for application software.',6,'🖥️'),
('10000000-0000-0000-0000-000000000004','4.7','Computer organisation and architecture','computer-organisation-and-architecture','Internal processor organisation, instruction sets and performance.','Trace register transfers, compare architectures, understand machine instructions and evaluate processor-performance factors.','What does the program counter hold?','The address of the next instruction to be fetched.',7,'🧩'),
('10000000-0000-0000-0000-000000000004','4.8','Consequences of uses of computing','consequences-of-computing','Ethical, legal and societal effects of computing decisions.','Evaluate systems through stakeholder, privacy, ownership, bias, accessibility and environmental perspectives.','Why can algorithmic bias occur?','Biased data, objectives or design choices can produce systematically unfair outcomes.',8,'⚖️'),
('10000000-0000-0000-0000-000000000004','4.9','Communication and networking','communication-and-networking','Network architecture, communication methods and internet operation.','Explain physical networks, protocols, addressing, routing, client-server systems, APIs and security across network layers.','What is the purpose of a network protocol?','To define shared rules for formatting, transmitting and interpreting communication.',9,'🌐'),
('10000000-0000-0000-0000-000000000004','4.10','Fundamentals of databases','fundamentals-of-databases','Relational modelling, normalisation, SQL and database management.','Model entities and relationships, normalise data, write SQL and explain transactions, integrity and concurrent access.','Why is normalisation used?','To reduce unnecessary duplication and prevent anomalies when data is inserted, updated or deleted.',10,'🗃️'),
('10000000-0000-0000-0000-000000000004','4.11','Big Data','big-data','Techniques and challenges associated with very large data sets.','Explain volume, velocity and variety, distributed processing, data mining and the limitations and consequences of large-scale analysis.','What are the three commonly cited properties of Big Data?','Volume, velocity and variety.',11,'📊'),
('10000000-0000-0000-0000-000000000004','4.12','Functional programming','functional-programming','A declarative approach based on functions and immutable values.','Use function application, composition, mapping, filtering, reduction and recursion, and compare functional and imperative styles.','What is a pure function?','A function whose result depends only on its inputs and which causes no observable side effects.',12,'λ'),
('10000000-0000-0000-0000-000000000004','4.13','Systematic approach to problem solving','systematic-problem-solving','A disciplined process for developing substantial solutions.','Move from investigation and modelling through design, implementation, testing and evaluation with clear evidence and iteration.','Why should test outcomes be recorded?','They provide evidence of behaviour, expose faults and support a reasoned evaluation against requirements.',13,'🧭'),
('10000000-0000-0000-0000-000000000004','4.14','Non-exam assessment project','non-exam-assessment-project','Planning, developing and evaluating an independent programmed solution.','Choose a suitable problem, document analysis and design decisions, develop iteratively, test rigorously and evaluate against measurable objectives.','What makes a project objective useful?','It is specific and testable, so the final solution can be evaluated against clear evidence.',14,'🏗️');

update public.courses set description = case id
  when '10000000-0000-0000-0000-000000000001' then 'OCR J277 GCSE Computer Science, organised around the complete specification topic map.'
  when '10000000-0000-0000-0000-000000000002' then 'AQA 8525 GCSE Computer Science, organised around the complete specification topic map.'
  when '10000000-0000-0000-0000-000000000003' then 'OCR H446 A-level Computer Science, organised around the complete theory specification.'
  when '10000000-0000-0000-0000-000000000004' then 'AQA 7517 A-level Computer Science, including theory and project guidance.'
  else description end
where id in (select distinct course_id from specification_content_catalog);

insert into public.specification_sections (course_id, code, title, description, sort_order, status)
select course_id, code, title, description, sort_order, 'published'::public.content_status
from specification_content_catalog
on conflict (course_id, code) do update set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order,
  status = 'published';

-- Correct the representative OCR GCSE topics that were originally grouped under 1.1.
update public.topics t
set specification_section_id = s.id
from public.specification_sections current_section,
     public.specification_sections s
where t.specification_section_id = current_section.id
  and current_section.course_id = '10000000-0000-0000-0000-000000000001'
  and s.course_id = current_section.course_id
  and ((t.slug = 'memory-and-storage' and s.code = '1.2')
    or (t.slug = 'networks-and-protocols' and s.code = '1.3'));

insert into public.topics (specification_section_id, slug, title, description, icon, estimated_minutes, learning_objectives, sort_order, status)
select s.id, c.slug, c.title, c.description, c.icon, 35,
  array['Explain the core ideas in ' || c.title, 'Apply the ideas to unfamiliar examples', 'Use precise terminology in exam answers'],
  1, 'published'::public.content_status
from specification_content_catalog c
join public.specification_sections s on s.course_id = c.course_id and s.code = c.code
on conflict (specification_section_id, slug) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  estimated_minutes = excluded.estimated_minutes,
  learning_objectives = excluded.learning_objectives,
  status = 'published';

insert into public.subtopics (topic_id, slug, title, description, sort_order, status)
select t.id, 'topic-overview', c.title || ' overview', c.focus, 0, 'published'::public.content_status
from specification_content_catalog c
join public.specification_sections s on s.course_id = c.course_id and s.code = c.code
join public.topics t on t.specification_section_id = s.id and t.slug = c.slug
on conflict (topic_id, slug) do update set
  title = excluded.title,
  description = excluded.description,
  status = 'published';

insert into public.lessons (subtopic_id, slug, title, summary, estimated_minutes, sort_order, status)
select st.id, 'start-here', 'Start here: ' || c.title, c.description, 8, 0, 'published'::public.content_status
from specification_content_catalog c
join public.specification_sections s on s.course_id = c.course_id and s.code = c.code
join public.topics t on t.specification_section_id = s.id and t.slug = c.slug
join public.subtopics st on st.topic_id = t.id and st.slug = 'topic-overview'
on conflict (subtopic_id, slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  status = 'published';

insert into public.lesson_sections (lesson_id, heading, body, sort_order)
select l.id, 'Your route through this topic',
  jsonb_build_object(
    'paragraphs', jsonb_build_array(c.description, c.focus),
    'callout', jsonb_build_object('type', 'tip', 'title', 'Active revision', 'text', 'After reading, close the page and explain the key idea from memory. Then use the flashcard to check the precision of your answer.')
  ), 1
from specification_content_catalog c
join public.specification_sections s on s.course_id = c.course_id and s.code = c.code
join public.topics t on t.specification_section_id = s.id and t.slug = c.slug
join public.subtopics st on st.topic_id = t.id and st.slug = 'topic-overview'
join public.lessons l on l.subtopic_id = st.id and l.slug = 'start-here'
where not exists (
  select 1 from public.lesson_sections ls
  where ls.lesson_id = l.id and ls.heading = 'Your route through this topic'
);

insert into public.flashcards (subtopic_id, front, back, hint, sort_order, status)
select st.id, c.flash_front, c.flash_back, 'Say the answer before revealing it.', 0, 'published'::public.content_status
from specification_content_catalog c
join public.specification_sections s on s.course_id = c.course_id and s.code = c.code
join public.topics t on t.specification_section_id = s.id and t.slug = c.slug
join public.subtopics st on st.topic_id = t.id and st.slug = 'topic-overview'
where not exists (
  select 1 from public.flashcards f
  where f.subtopic_id = st.id and f.front = c.flash_front
);
