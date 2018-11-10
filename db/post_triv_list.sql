INSERT INTO ftn_trivlist
(tr_user_id, tr_cat_id)
VALUES
($1, $2) RETURNING *;