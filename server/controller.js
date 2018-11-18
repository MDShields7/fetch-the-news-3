module.exports = {
  getTrivSet: (req, res) => {
    req.app.get('db').get_triv_set()
    .then(set => {res.json(set)})
    .catch(error => {
        console.log('error in getTrivSet', error);
    res.status(500).json({message: 'GetTrivSet error'})
    })
  },
  getMyTrivSet: (req, res) => {
    const{userId} = req.query;
    // console.log(userId);
    req.app.get('db').get_my_triv_set({userId:userId})
    .then(set => {res.json(set)})
    .catch(error => {
        console.log('error in getTrivSet', error);
    res.status(500).json({message: 'GetTrivSet error'})
    })
  },
  getMyTrivCreated: (req, res) => {
    const{userId} = req.query;
    // console.log(userId);
    req.app.get('db').get_my_triv_created({userId:userId})
    .then(set => {res.json(set)})
    .catch(error => {
        console.log('error in getTrivSet', error);
    res.status(500).json({message: 'GetTrivSet error'})
    })
  },
  getTrivQASet: (req, res) => {
    const{catId} = req.query;
    console.log(catId);
    req.app.get('db').get_triv_qa({cat_id:catId})
    .then(set => {res.send(set)})
    .catch(error => {
      console.log('error in getTrivQA', error);
  res.status(500).json({message: 'GetTrivQA error'})
  })
  },
  postTrivSet: (req, res) => {
    console.log('this is the controller post trivia set')
    const dbInstance = req.app.get('db');
    dbInstance.post_triv_set({
      cat_name: req.body.trivSetName
    })    
    .then(set => {res.json(set);
    console.log('set is ', set)})
    .catch(error => {
        console.log('error in postTrivSet', error);
    res.status(500).json({message: 'postTrivSet error'})
    })
  },
  postTrivCreator: (req, res) => {
    const dbInstance = req.app.get('db');
    const {tcr_user_id, tcr_cat_id}=req.body;
    console.log('this is the controller post triv creator', tcr_user_id, tcr_cat_id)
    dbInstance.post_triv_creator({
      tcr_user_id: tcr_user_id,
      tcr_cat_id: tcr_cat_id
    })
    .then(list => {res.json(list);
      console.log('creator response is ', list)})
      .catch(error => {
          console.log('error in postTrivCreator', error);
      res.status(500).json({message: 'postTrivCreator error'})
      })
  },
  postTrivList: (req, res) => {
    const dbInstance = req.app.get('db');
    const {tr_user_id, tr_cat_id}=req.body;
    console.log('this is the controller post triv list', tr_user_id, tr_cat_id)
    dbInstance.post_triv_list({
      tr_user_id: tr_user_id, 
      tr_cat_id: tr_cat_id 
    })
    .then(list => {res.json(list);
      console.log('trivlist response is ', list)})
      .catch(error => {
          console.log('error in postTrivList', error);
      res.status(500).json({message: 'postTrivList error'})
      })
  },
  editMyTrivSet: (req,res) => {
    const dbInstance = req.app.get('db');
    const {id}=req.params;
    const {catName}=req.body;
    dbInstance.edit_my_triv_set( [id, catName] )
    .then(list => {res.json(list);
      console.log('creator response is ', list)})
      .catch(error => {
          console.log('error in postTrivCreator', error);
      res.status(500).json({message: 'editMyTrivCreator error'})
      })
  },
  deleteTrivSet: (req,res) => {
    const dbInstance = req.app.get('db');
    const {id, userid}=req.params;
    // console.log('controller editMyTrivSet, req', req)
    console.log('controller deleteMyTrivSet, req.params', id)
    console.log('controller deleteMyTrivSet, req.params', userid)
    dbInstance.delete_triv_set( [id, userid] )
    .then(list => {res.json(list);
      console.log('creator response is ', list)})
      .catch(error => {
          console.log('error in postTrivCreator', error);
      res.status(500).json({message: 'editMyTrivCreator error'})
      })
  }


}
