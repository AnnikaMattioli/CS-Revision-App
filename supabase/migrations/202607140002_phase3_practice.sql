-- Phase 3: secure practice-set ownership and representative original questions.

create policy "owners create practice sets" on public.practice_sets for insert with check(owner_id=auth.uid());
create policy "owners read practice sets" on public.practice_sets for select using(owner_id=auth.uid());
create policy "owners add set questions" on public.practice_set_questions for insert with check(exists(select 1 from public.practice_sets p where p.id=practice_set_id and p.owner_id=auth.uid()));
create policy "owners read set questions" on public.practice_set_questions for select using(exists(select 1 from public.practice_sets p where p.id=practice_set_id and p.owner_id=auth.uid()));

drop policy "attempt answers via own attempt" on public.attempt_answers;
create policy "read own attempt answers" on public.attempt_answers for select using(
  exists(select 1 from public.attempts a where a.id=attempt_id and a.user_id=auth.uid())
);
create policy "create answers for open set" on public.attempt_answers for insert with check(
  exists(
    select 1 from public.attempts a
    join public.practice_set_questions psq on psq.practice_set_id=a.practice_set_id and psq.question_id=public.attempt_answers.question_id
    where a.id=public.attempt_answers.attempt_id and a.user_id=auth.uid() and a.status='in_progress'
  )
);
create policy "update answers for open set" on public.attempt_answers for update using(
  exists(select 1 from public.attempts a where a.id=attempt_id and a.user_id=auth.uid() and a.status='in_progress')
) with check(
  exists(
    select 1 from public.attempts a
    join public.practice_set_questions psq on psq.practice_set_id=a.practice_set_id and psq.question_id=public.attempt_answers.question_id
    where a.id=public.attempt_answers.attempt_id and a.user_id=auth.uid() and a.status='in_progress'
  )
);

-- Public prompt JSON deliberately excludes rules, explanations and correct answers.
insert into public.questions (id, subtopic_id, type, difficulty, prompt, marks, status) values
('60000000-0000-0000-0000-000000000001','21000000-0000-0000-0000-000000000001','multiple_choice','foundation',$${"id":"60000000-0000-0000-0000-000000000001","topicSlug":"systems-architecture","topicTitle":"Systems architecture","type":"multiple_choice","difficulty":"foundation","prompt":"Which CPU component performs arithmetic calculations and logical comparisons?","marks":1,"estimatedSeconds":45,"options":[{"id":"cu","label":"Control unit"},{"id":"alu","label":"Arithmetic logic unit"},{"id":"cache","label":"Cache"},{"id":"pc","label":"Program counter"}],"lessonHref":"/learn/systems-architecture/inside-the-cpu"}$$::jsonb,1,'published'),
('60000000-0000-0000-0000-000000000002','21000000-0000-0000-0000-000000000002','multiple_select','standard',$${"id":"60000000-0000-0000-0000-000000000002","topicSlug":"memory-and-storage","topicTitle":"Memory and storage","type":"multiple_select","difficulty":"developing","prompt":"Select the two characteristics that normally make solid-state storage suitable for a portable computer.","marks":2,"estimatedSeconds":70,"options":[{"id":"moving","label":"It contains several moving parts"},{"id":"durable","label":"It is resistant to knocks"},{"id":"lowpower","label":"It usually uses relatively little power"},{"id":"cheapest","label":"It is always the cheapest per gigabyte"}],"lessonHref":"/learn/memory-and-storage/secondary-storage"}$$::jsonb,2,'published'),
('60000000-0000-0000-0000-000000000003','21000000-0000-0000-0000-000000000002','boolean','foundation',$${"id":"60000000-0000-0000-0000-000000000003","topicSlug":"memory-and-storage","topicTitle":"Memory and storage","type":"boolean","difficulty":"foundation","prompt":"True or false: ROM loses its contents when the computer is switched off.","marks":1,"estimatedSeconds":35,"options":[{"id":"true","label":"True"},{"id":"false","label":"False"}],"lessonHref":"/learn/memory-and-storage/ram-rom-and-virtual-memory"}$$::jsonb,1,'published'),
('60000000-0000-0000-0000-000000000004','21000000-0000-0000-0000-000000000003','fill_blank','foundation',$${"id":"60000000-0000-0000-0000-000000000004","topicSlug":"networks-and-protocols","topicTitle":"Networks and protocols","type":"fill_blank","difficulty":"foundation","prompt":"Complete the sentence: The protocol that resolves a domain name to an IP address is ____.","marks":1,"estimatedSeconds":45,"lessonHref":"/learn/networks-and-protocols/packets-and-protocols"}$$::jsonb,1,'published'),
('60000000-0000-0000-0000-000000000005','21000000-0000-0000-0000-000000000002','short_answer','standard',$${"id":"60000000-0000-0000-0000-000000000005","topicSlug":"memory-and-storage","topicTitle":"Memory and storage","type":"short_answer","difficulty":"secure","prompt":"Explain why using virtual memory can make a computer run more slowly.","marks":2,"estimatedSeconds":100,"lessonHref":"/learn/memory-and-storage/ram-rom-and-virtual-memory"}$$::jsonb,2,'published'),
('60000000-0000-0000-0000-000000000006','21000000-0000-0000-0000-000000000001','extended_answer','stretch',$${"id":"60000000-0000-0000-0000-000000000006","topicSlug":"systems-architecture","topicTitle":"Systems architecture","type":"extended_answer","difficulty":"advanced","prompt":"A student wants a computer for video editing. Explain how clock speed, number of cores and cache size may affect CPU performance, and why the figures do not guarantee performance. [4 marks]","marks":4,"estimatedSeconds":240,"lessonHref":"/learn/systems-architecture/inside-the-cpu"}$$::jsonb,4,'published'),
('60000000-0000-0000-0000-000000000007','21000000-0000-0000-0000-000000000001','ordering','standard',$${"id":"60000000-0000-0000-0000-000000000007","topicSlug":"systems-architecture","topicTitle":"Systems architecture","type":"ordering","difficulty":"developing","prompt":"Put the main stages of the processor cycle into the correct order.","marks":2,"estimatedSeconds":75,"items":[{"id":"execute","label":"Execute"},{"id":"fetch","label":"Fetch"},{"id":"decode","label":"Decode"}],"lessonHref":"/learn/systems-architecture/fetch-decode-execute"}$$::jsonb,2,'published'),
('60000000-0000-0000-0000-000000000008','21000000-0000-0000-0000-000000000001','short_answer','standard',$${"id":"60000000-0000-0000-0000-000000000008","topicSlug":"systems-architecture","topicTitle":"Systems architecture","type":"code_trace","difficulty":"secure","prompt":"What value is output by this pseudocode?","marks":2,"estimatedSeconds":100,"code":"total ← 1\nFOR count ← 1 TO 3\n    total ← total * 2\nNEXT count\nOUTPUT total","lessonHref":"/learn/systems-architecture/fetch-decode-execute"}$$::jsonb,2,'published'),
('60000000-0000-0000-0000-000000000009','21000000-0000-0000-0000-000000000002','short_answer','standard',$${"id":"60000000-0000-0000-0000-000000000009","topicSlug":"memory-and-storage","topicTitle":"Memory and storage","type":"numerical","difficulty":"secure","prompt":"A file is 4 KiB. Calculate its size in bits. Use 1 KiB = 1024 bytes.","marks":2,"estimatedSeconds":100,"lessonHref":"/learn/memory-and-storage/secondary-storage"}$$::jsonb,2,'published'),
('60000000-0000-0000-0000-000000000010','21000000-0000-0000-0000-000000000003','matching','standard',$${"id":"60000000-0000-0000-0000-000000000010","topicSlug":"networks-and-protocols","topicTitle":"Networks and protocols","type":"matching","difficulty":"developing","prompt":"Match each protocol to its main role.","marks":3,"estimatedSeconds":100,"items":[{"id":"dns","label":"DNS"},{"id":"http","label":"HTTP"},{"id":"tcp","label":"TCP"}],"targets":[{"id":"names","label":"Resolves domain names"},{"id":"web","label":"Transfers web content"},{"id":"reliable","label":"Provides reliable, ordered delivery"}],"lessonHref":"/learn/networks-and-protocols/packets-and-protocols"}$$::jsonb,3,'published')
on conflict (id) do update set prompt=excluded.prompt, marks=excluded.marks, status='published', updated_at=now();

insert into public.question_answer_rules (id, question_id, rule_type, rule, feedback) values
('61000000-0000-0000-0000-000000000001','60000000-0000-0000-0000-000000000001','exact',$${"kind":"exact","acceptable":["alu"]}$$::jsonb,'The ALU performs calculations and logical comparisons.'),
('61000000-0000-0000-0000-000000000002','60000000-0000-0000-0000-000000000002','set',$${"kind":"set","correct":["durable","lowpower"],"partialCredit":true}$$::jsonb,'Solid-state storage has no moving parts and commonly uses relatively little power.'),
('61000000-0000-0000-0000-000000000003','60000000-0000-0000-0000-000000000003','boolean',$${"kind":"boolean","correct":false}$$::jsonb,'ROM is non-volatile.'),
('61000000-0000-0000-0000-000000000004','60000000-0000-0000-0000-000000000004','exact',$${"kind":"exact","acceptable":["DNS","domain name system"]}$$::jsonb,'DNS resolves domain names.'),
('61000000-0000-0000-0000-000000000005','60000000-0000-0000-0000-000000000005','rubric',$${"kind":"rubric","points":[{"id":"secondary","description":"Virtual memory uses secondary storage","patterns":["secondary storage","hard drive","hard disk","ssd","storage drive"]},{"id":"slower","description":"Secondary storage is slower than RAM or swapping creates extra transfers","patterns":["slower than ram","takes longer","slow access","moving data","transfer between","swapping"]}]}$$::jsonb,'Award one mark for each distinct concept.'),
('61000000-0000-0000-0000-000000000006','60000000-0000-0000-0000-000000000006','rubric',$${"kind":"rubric","points":[{"id":"clock","description":"Higher clock speed means more cycles or instructions per second","patterns":["more cycles","cycles per second","instructions per second","faster clock"]},{"id":"cores","description":"More cores allow suitable tasks to run in parallel","patterns":["parallel","simultaneous","same time","split tasks","multiple tasks"]},{"id":"cache","description":"Cache reduces slower main-memory access","patterns":["less ram access","reduce memory access","faster than ram","frequently used","close to cpu"]},{"id":"context","description":"Performance also depends on software or architecture","patterns":["depends on software","software support","processor architecture","cpu architecture","program"]}]}$$::jsonb,'Award each distinct explained factor once.'),
('61000000-0000-0000-0000-000000000007','60000000-0000-0000-0000-000000000007','ordering',$${"kind":"ordering","correct":["fetch","decode","execute"]}$$::jsonb,'Fetch, decode, then execute.'),
('61000000-0000-0000-0000-000000000008','60000000-0000-0000-0000-000000000008','exact',$${"kind":"exact","acceptable":["8","8.0"]}$$::jsonb,'The value is doubled three times.'),
('61000000-0000-0000-0000-000000000009','60000000-0000-0000-0000-000000000009','numeric',$${"kind":"numeric","correct":32768,"tolerance":0,"unit":"bits"}$$::jsonb,'4 × 1024 × 8 = 32,768 bits.'),
('61000000-0000-0000-0000-000000000010','60000000-0000-0000-0000-000000000010','matching',$${"kind":"matching","correct":{"dns":"names","http":"web","tcp":"reliable"}}$$::jsonb,'Each protocol has a distinct role.')
on conflict (id) do update set rule=excluded.rule, feedback=excluded.feedback, updated_at=now();

insert into public.question_rubrics (id, question_id, guidance) values
('62000000-0000-0000-0000-000000000005','60000000-0000-0000-0000-000000000005','Award concepts, not exact phrasing.'),
('62000000-0000-0000-0000-000000000006','60000000-0000-0000-0000-000000000006','Award each explained performance factor once.')
on conflict (question_id) do update set guidance=excluded.guidance, updated_at=now();

insert into public.question_rubric_points (id, rubric_id, description, marks, acceptable_terms, sort_order) values
('63000000-0000-0000-0000-000000000001','62000000-0000-0000-0000-000000000005','Uses secondary storage',1,array['secondary storage','hard disk','SSD'],1),
('63000000-0000-0000-0000-000000000002','62000000-0000-0000-0000-000000000005','Explains slower access or swapping',1,array['slower than RAM','swapping','moving data'],2),
('63000000-0000-0000-0000-000000000003','62000000-0000-0000-0000-000000000006','Explains clock speed',1,array['cycles per second'],1),
('63000000-0000-0000-0000-000000000004','62000000-0000-0000-0000-000000000006','Explains parallel cores',1,array['parallel','simultaneous'],2),
('63000000-0000-0000-0000-000000000005','62000000-0000-0000-0000-000000000006','Explains cache benefit',1,array['frequently used','reduce RAM access'],3),
('63000000-0000-0000-0000-000000000006','62000000-0000-0000-0000-000000000006','Recognises software or architecture context',1,array['software','architecture'],4)
on conflict (id) do update set description=excluded.description, acceptable_terms=excluded.acceptable_terms;

-- PostgreSQL makes new enum values available after this migration commits.
alter type public.question_type add value if not exists 'numerical';
alter type public.question_type add value if not exists 'code_trace';
