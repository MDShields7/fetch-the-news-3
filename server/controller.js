const bcrypt = require('bcrypt');
const pwSaltRounds = 11;
// const session = require('express-session');

module.exports = {
  getTrivSet: (req, res) => {
    req.app.get('db').get_triv_set()
      .then(set => { res.json(set) })
      .catch(error => {
        console.log('error in getTrivSet', error);
        res.status(500).json({ message: 'GetTrivSet error' })
      })
  },
  getMyTrivSet: (req, res) => {
    const { userId } = req.query;
    req.app.get('db').get_my_triv_set({ userId: userId })
      .then(set => { res.json(set) })
      .catch(error => {
        console.log('error in getTrivSet', error);
        res.status(500).json({ message: 'GetTrivSet error' })
      })
  },
  getMyTrivCreated: (req, res) => {
    const { userId } = req.query;
    req.app.get('db').get_my_triv_created({ userId: userId })
      .then(set => { res.json(set) })
      .catch(error => {
        console.log('error in getTrivSet', error);
        res.status(500).json({ message: 'GetTrivSet error' })
      })
  },
  getTrivQASet: (req, res) => {
    const { catId } = req.query;
    console.log(catId);
    req.app.get('db').get_triv_qa({ cat_id: catId })
      .then(set => { res.send(set) })
      .catch(error => {
        console.log('error in getTrivQA', error);
        res.status(500).json({ message: 'GetTrivQA error' })
      })
  },
  postTrivSet: (req, res) => {
    console.log('this is the controller post trivia set')
    const dbInstance = req.app.get('db');
    dbInstance.post_triv_set({
      cat_name: req.body.trivSetName
    })
      .then(set => {
        res.json(set);
        console.log('set is ', set)
      })
      .catch(error => {
        console.log('error in postTrivSet', error);
        res.status(500).json({ message: 'postTrivSet error' })
      })
  },
  postTrivCreator: (req, res) => {
    const dbInstance = req.app.get('db');
    const { tcr_user_id, tcr_cat_id } = req.body;
    console.log('this is the controller post triv creator', tcr_user_id, tcr_cat_id)
    dbInstance.post_triv_creator({
      tcr_user_id: tcr_user_id,
      tcr_cat_id: tcr_cat_id
    })
      .then(list => {
        res.json(list);
        console.log('creator response is ', list)
      })
      .catch(error => {
        console.log('error in postTrivCreator', error);
        res.status(500).json({ message: 'postTrivCreator error' })
      })
  },
  postTrivList: (req, res) => {
    const dbInstance = req.app.get('db');
    const { tr_user_id, tr_cat_id } = req.body;
    console.log('this is the controller post triv list', tr_user_id, tr_cat_id)
    dbInstance.post_triv_list({
      tr_user_id: tr_user_id,
      tr_cat_id: tr_cat_id
    })
      .then(list => {
        res.json(list);
        console.log('trivlist response is ', list)
      })
      .catch(error => {
        console.log('error in postTrivList', error);
        res.status(500).json({ message: 'postTrivList error' })
      })
  },
  editMyTrivSet: (req, res) => {
    const dbInstance = req.app.get('db');
    const { id } = req.params;
    const { catName } = req.body;
    dbInstance.edit_my_triv_set([id, catName])
      .then(list => {
        res.json(list);
        console.log('creator response is ', list)
      })
      .catch(error => {
        console.log('error in postTrivCreator', error);
        res.status(500).json({ message: 'editMyTrivCreator error' })
      })
  },
  deleteTrivSet: (req, res) => {
    const dbInstance = req.app.get('db');
    const { id, userid } = req.params;
    // console.log('controller editMyTrivSet, req', req)
    console.log('controller deleteMyTrivSet, req.params', id)
    console.log('controller deleteMyTrivSet, req.params', userid)
    dbInstance.delete_triv_set([id, userid])
      .then(list => {
        res.json(list);
        console.log('creator response is ', list)
      })
      .catch(error => {
        console.log('error in postTrivCreator', error);
        res.status(500).json({ message: 'editMyTrivCreator error' })
      })
  },
  getUsers: (req, res) => {
    const dbInstance = req.app.get('db');
    dbInstance.get_users()
      .then(userList => {
        res.json(userList);
        console.log('getUser response is ', userList)
      })
      .catch(error => {
        console.log('error in registerUser', error);
        res.status(500).json({ message: 'getUsers error:', error })
      })
  },
  registerUser: async (req, res) => {
    const dbInstance = req.app.get('db');
    const { user_name, user_email, user_password } = req.body;
    console.log('this is the controller register user', user_name, user_email, user_password)
    // await module.exports.checkUser(user_name)
    bcrypt.hash(user_password, pwSaltRounds)
      .then(hash_pw => {
        console.log('hashed pw is:', hash_pw, 'length', hash_pw.length)
        dbInstance.register_user({
          user_name: user_name,
          user_email: user_email,
          user_password: hash_pw
        })
          .then(user => {
            res.json(user);
            console.log('registerUser response is ', user)
          })
          .catch(error => {
            console.log('error in registerUser', error);
            res.status(500).json({ message: 'registerUser error' })
          })
      })
  },
  loginUser: (req, res) => {
    const dbInstance = req.app.get('db');
    const { user_name, user_password } = req.body;
    console.log('controller, loginUser starting', user_name, user_password)
    dbInstance.find_user({ user_name: user_name }).then(users => {
      console.log('user found:', users[0])
      if (users.length) {
        bcrypt.compare(user_password, users[0].user_password).then(passwordsMatch => {
          if (passwordsMatch) {
            req.session.user = { user_id: users[0].user_id, user_name: users[0].user_name };
            res.json({ user: req.session.user });
          } else {
            res.status(403).json({ message: 'Wrong password' })
          }
        })
      } else {
        res.status(403).json({ message: "That user is not registered" })
      }
    });
  },
  logoutUser: (req, res) => {
    req.session.destroy();
    res.status(200).send();
  }
}
