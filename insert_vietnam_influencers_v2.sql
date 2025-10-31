-- 베트남 인플루언서 데이터 삽입 (수정 버전)
-- JSON 형식을 안전하게 처리하기 위해 E'' 이스케이프 문자열 사용

-- 먼저 기존 데이터 확인
SELECT COUNT(*) as current_count FROM vietnam_influencers;

-- 데이터 삽입
INSERT INTO vietnam_influencers (name, city, niches, languages, platforms, display_order)
VALUES
  ('nanavivuvu', NULL, ARRAY['Fashion', 'Vlog'], ARRAY['Vietnamese'],
   '[{"platform": "TikTok", "handle": "nanavivuvu", "followers": 0, "url": "https://www.tiktok.com/@nanavivuvu"}]'::jsonb, 1),

  ('Tamii 따미', NULL, ARRAY['Vlog', 'Place review'], ARRAY['Vietnamese'],
   '[{"platform": "TikTok", "handle": "tamtrann251", "followers": 0, "url": "https://www.tiktok.com/@tamtrann251"}]'::jsonb, 2),

  ('gjiang.g', NULL, ARRAY['Vlog', 'Review'], ARRAY['Vietnamese'],
   '[{"platform": "TikTok", "handle": "gjiang.g", "followers": 0, "url": "https://www.tiktok.com/@gjiang.g"}]'::jsonb, 3),

  ('Dolri.nn', NULL, ARRAY['Review'], ARRAY['Vietnamese'],
   '[{"platform": "TikTok", "handle": "dolri.nn", "followers": 0, "url": "https://www.tiktok.com/@dolri.nn"}]'::jsonb, 4),

  ('dtthao.anh', NULL, ARRAY['Vlog', 'Review', 'Fashion'], ARRAY['Vietnamese'],
   '[{"platform": "TikTok", "handle": "dtthao.anh", "followers": 0, "url": "https://www.tiktok.com/@dtthao.anh"}]'::jsonb, 5),

  ('giadinhgauto', NULL, ARRAY['Vlog', 'Food review'], ARRAY['Vietnamese'],
   '[{"platform": "TikTok", "handle": "giadinhgauto", "followers": 0, "url": "https://www.tiktok.com/@giadinhgauto"}]'::jsonb, 6),

  ('Phanh Daily', NULL, ARRAY['Livestream', 'Model', 'Lifestyle'], ARRAY['Vietnamese'],
   '[{"platform": "TikTok", "handle": "ph.anhhvu", "followers": 0, "url": "https://www.tiktok.com/@ph.anhhvu"}]'::jsonb, 7),

  ('Phí Nguyễn Thùy Linh', NULL, ARRAY['Lifestyle'], ARRAY['Vietnamese'],
   '[{"platform": "TikTok", "handle": "mcphilinh", "followers": 0, "url": "https://www.tiktok.com/@mcphilinh"}]'::jsonb, 8),

  ('Hoàng Duyên', NULL, ARRAY['Lifestyle'], ARRAY['Vietnamese'],
   '[{"platform": "TikTok", "handle": "hoangduyen0406", "followers": 0, "url": "https://www.tiktok.com/@hoangduyen0406"}]'::jsonb, 9),

  ('Tú Anh Đặng', NULL, ARRAY['Review'], ARRAY['Vietnamese'],
   '[{"platform": "TikTok", "handle": "tutho0112", "followers": 0, "url": "https://www.tiktok.com/@tutho0112"}]'::jsonb, 10);

-- 샘플 10개만 먼저 실행해서 테스트
-- 성공하면 아래에 나머지 데이터를 추가하세요

-- 삽입 결과 확인
SELECT COUNT(*) as new_count FROM vietnam_influencers;
SELECT name, niches, platforms FROM vietnam_influencers ORDER BY display_order DESC LIMIT 10;
