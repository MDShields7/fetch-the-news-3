SELECT qa_id, qa_question, qa_ans1, qa_ans2, qa_ans3, qa_ans4
FROM ftn_catsets cs
JOIN ftn_catlist cl
ON cs.cat_id = cl.cl_cat_id
JOIN ftn_qasets qa
ON cl.cl_qa_id = qa.qa_id
WHERE cs.cat_id = ${cat_id};
