INSERT INTO ftn_users
  (user_name, user_email, user_password)
VALUES
  ( ${user_name}, ${user_email}, ${user_password}) RETURNING *;
