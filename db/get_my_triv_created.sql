SELECT *
FROM ftn_users u
JOIN ftn_trivcreators tcr
ON u.user_id = tcr.tcr_user_id
JOIN ftn_catsets cat 
ON tcr.tcr_cat_id = cat.cat_id
WHERE u.user_id = ${userId};