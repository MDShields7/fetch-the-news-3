INSERT INTO ftn_trivcreators
(tcr_user_id, tcr_cat_id)
VALUES
(${tcr_user_id}, ${tcr_cat_id}) RETURNING *;
