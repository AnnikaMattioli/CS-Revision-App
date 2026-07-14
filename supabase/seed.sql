insert into public.qualifications (id, level, name, sort_order) values
  ('00000000-0000-0000-0000-000000000001', 'GCSE', 'GCSE', 1),
  ('00000000-0000-0000-0000-000000000002', 'A_LEVEL', 'A-level', 2)
on conflict do nothing;

insert into public.exam_boards (id, code, name) values
  ('00000000-0000-0000-0000-000000000011', 'OCR', 'OCR'),
  ('00000000-0000-0000-0000-000000000012', 'AQA', 'AQA')
on conflict do nothing;

insert into public.courses (id, qualification_id, exam_board_id, slug, title, description, accent_colour, published) values
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000011','ocr-gcse-computer-science','OCR GCSE Computer Science','Representative course shell; specification content is not yet complete.','#7357ee',true),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000012','aqa-gcse-computer-science','AQA GCSE Computer Science','Representative course shell; specification content is not yet complete.','#4285f4',true),
  ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000011','ocr-a-level-computer-science','OCR A-level Computer Science','Representative course shell; specification content is not yet complete.','#22b8a7',true),
  ('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000012','aqa-a-level-computer-science','AQA A-level Computer Science','Representative course shell; specification content is not yet complete.','#ff6f61',true)
on conflict do nothing;
