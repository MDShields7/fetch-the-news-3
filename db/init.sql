DROP TABLE IF EXISTS ftn_users;
DROP TABLE IF EXISTS ftn_catsets;
DROP TABLE IF EXISTS ftn_qasets;
DROP TABLE IF EXISTS ftn_trivlist;
DROP TABLE IF EXISTS ftn_catlist;
DROP TABLE IF EXISTS ftn_qacreators;
DROP TABLE IF EXISTS ftn_trivcreators;


-- 'USER SET' ONE TO ONE TABLE
CREATE TABLE ftn_users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_password VARCHAR(50) NOT NULL
);
INSERT INTO ftn_users 
(user_name, user_email, user_password)
VALUES
('admin', 'matthew.duncan.shields@gmail.com', 'abcd1234'),
('mdshields', 'matthew.duncan.shields@gmail.com', 'cooldude'),
('gillygilstrap', 'mgilstrap@toughguy.edu', 'password2');

-- 'CATEGORY SET' ONE TO ONE TABLE
CREATE TABLE ftn_catsets (
    cat_id SERIAL PRIMARY KEY,
    cat_name VARCHAR(100) NOT NULL
);
INSERT INTO ftn_catsets 
(cat_name)
VALUES
('Celebrity Gossip 2018'),
('Arts & Culture 2018'),
('Science News 2018'),
('Sports 2018'),
('Seahawks 2018');

-- 'CATEGORY QUESTION AND ANSWER SETS' ONE TO ONE TABLE
CREATE TABLE ftn_qasets (
    qa_id SERIAL PRIMARY KEY,
    qa_question VARCHAR(300) NOT NULL,
    qa_ans1 VARCHAR(100) NOT NULL,
    qa_ans2 VARCHAR(100) NOT NULL,
    qa_ans3 VARCHAR(100) NOT NULL,
    qa_ans4 VARCHAR(100) NOT NULL
);
INSERT INTO ftn_qasets 
( qa_question, qa_ans1, qa_ans2, qa_ans3, qa_ans4)
VALUES
('What SNL cast members dated Arianna Grande?', 'Pete Davidson', 'Michael Che', 'Alex Moffat', 'Colin Jost'),
('What artists'' work shredded itself upon sale at auction?', 'Banksy', 'Ai Weiwei', 'Marcel Duchamp', 'Salvador Dali'),
('The physics Nobel prize was awarded to a team of three scientists, including what woman for the first time in 55 years?', 'Donna Strickland', 'Marie Curie', 'Jane Goodall', 'Elizabeth Blackburn');

CREATE TABLE ftn_trivlist (
  tr_id SERIAL PRIMARY KEY,
  tr_user_id INTEGER,
  tr_cat_id INTEGER
);
INSERT INTO ftn_trivlist
(tr_user_id, tr_cat_id)
VALUES
(1,1),(1,2),(1,3),(2,1),(2,2),(2,3),(2,4),(3,1),(3,2),(3,3),(3,5);

CREATE TABLE ftn_catlist (
  cl_id SERIAL PRIMARY KEY,
  cl_cat_id INTEGER,
  cl_qa_id INTEGER
);
INSERT INTO ftn_catlist
(cl_cat_id, cl_qa_id)
VALUES
(1,1),(2,2),(3,3);

CREATE TABLE ftn_qacreators (
  qacr_id SERIAL PRIMARY KEY,
  qacr_user_id INTEGER,
  qacr_qa_id INTEGER
);
INSERT INTO ftn_qacreators
(qacr_user_id, qacr_qa_id)
VALUES
(1,1),(1,2),(1,3);

CREATE TABLE ftn_trivcreators (
  tcr_id SERIAL PRIMARY KEY,
  tcr_user_id INTEGER,
  tcr_cat_id INTEGER
);
INSERT INTO ftn_trivcreators
(tcr_user_id, tcr_cat_id)
VALUES
(1,1),(1,2),(1,3),(2,4),(3,5);

SELECT * FROM ftn_users;
SELECT * FROM ftn_catsets;
SELECT * FROM ftn_qasets;
SELECT * FROM ftn_trivlist;
SELECT * FROM ftn_catlist;
SELECT * FROM ftn_qacreators;
SELECT * FROM ftn_trivcreators;