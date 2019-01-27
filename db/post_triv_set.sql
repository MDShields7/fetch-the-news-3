INSERT INTO ftn_catsets
  (cat_name, qa_amount)
VALUES
  ($
{cat_name}, 0) RETURNING *;