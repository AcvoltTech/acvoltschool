-- Reorder courses: Clases en Vivo (welcome) first, then main courses, then intro courses
UPDATE acvolt_courses SET sort_order = 1 WHERE id = 4;  -- Clases en Vivo (bienvenida)
UPDATE acvolt_courses SET sort_order = 2 WHERE id = 5;  -- Especialidad en AC
UPDATE acvolt_courses SET sort_order = 3 WHERE id = 6;  -- Electricidad para AC
UPDATE acvolt_courses SET sort_order = 4 WHERE id = 7;  -- Controles Automáticos
UPDATE acvolt_courses SET sort_order = 5 WHERE id = 1;  -- EPA Certificate
UPDATE acvolt_courses SET sort_order = 6 WHERE id = 2;  -- Heat Pumps
UPDATE acvolt_courses SET sort_order = 7 WHERE id = 3;  -- Mini Splits
