DELETE FROM ftn_trivcreators 
WHERE (tr_user_id = $2 AND tr_cat_id = $1);

SELECT * FROM ftn_trivlist;