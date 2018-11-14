INSERT INTO ftn_trivlist
(tr_user_id, tr_cat_id)
VALUES
(${tr_user_id}, ${tr_cat_id}) RETURNING *;