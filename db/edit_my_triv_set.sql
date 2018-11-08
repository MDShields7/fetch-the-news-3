UPDATE ftn_catsets
SET cat_name = $2
WHERE cat_id = $1;

SELECT * FROM ftn_catsets;