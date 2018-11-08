SELECT *
FROM ftn_users u
JOIN ftn_trivlist tl
ON u.user_id = tl.tr_user_id
JOIN ftn_catsets cs 
ON tl.tr_cat_id = cs.cat_id
WHERE user_id = ${userId};