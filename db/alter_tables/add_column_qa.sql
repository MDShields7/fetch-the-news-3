SELECT * FROM ftn_catsets;

ALTER TABLE ftn_catsets
ADD qa_amount INT;

UPDATE ftn_catsets
SET qa_amount = 2
WHERE cat_id = 1;
UPDATE ftn_catsets
SET qa_amount = 1
WHERE cat_id = 2;
UPDATE ftn_catsets
SET qa_amount = 1
WHERE cat_id = 3;
UPDATE ftn_catsets
SET qa_amount = 0
WHERE cat_id = 4;
UPDATE ftn_catsets
SET qa_amount = 0
WHERE cat_id = 5;

SELECT * FROM ftn_catsets;

ALTER TABLE ftn_catsets
ALTER COLUMN qa_amount SET NOT NULL;
