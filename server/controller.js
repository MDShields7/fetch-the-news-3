const bcrypt = require('bcrypt');
const pwSaltRounds = 11;

module.exports = {
  getUsers: (req, res) => {
    const dbInstance = req.app.get('db');
    dbInstance.get_users()
      .then(userList => {
        res.json(userList);
      })
      .catch(error => {
        res.status(500).json({ message: 'getUsers error:', error })
      })
  },
  registerUser: (req, res) => {
    const dbInstance = req.app.get('db');
    const { user_name, user_email, user_password } = req.body;
    bcrypt.hash(user_password, pwSaltRounds)
      .then(hash_pw => {
        dbInstance.register_user({
          user_name: user_name,
          user_email: user_email,
          user_password: hash_pw
        })
          .then(user => {
            res.json(user);
          })
          .catch(error => {
            res.status(500).json({ message: 'registerUser error' })
          })
      })
  },
  loginUser: (req, res) => {
    const dbInstance = req.app.get('db');
    const { user_name, user_password } = req.body;
    dbInstance.find_user({ user_name: user_name }).then(users => {
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
  },
  getTrivSet: (req, res) => {
    console.log(req);
    req.app.get('db').get_triv_set()
      .then(set => { res.json(set) })
      .catch(error => {
        res.status(500).json({ message: 'GetTrivSet error' })
      })
  },
  getMyTrivSet: (req, res) => {
    const { userId } = req.query;
    req.app.get('db').get_my_triv_set({ userId: userId })
      .then(set => { res.json(set) })
      .catch(error => {
        res.status(500).json({ message: 'GetTrivSet error' })
      })
  },
  getMyTrivCreated: (req, res) => {
    const { userId } = req.query;
    req.app.get('db').get_my_triv_created({ userId: userId })
      .then(set => { res.json(set) })
      .catch(error => {
        res.status(500).json({ message: 'GetTrivSet error' })
      })
  },
  postTrivSet: (req, res) => {
    const dbInstance = req.app.get('db');
    dbInstance.post_triv_set({
      cat_name: req.body.trivSetName
    })
      .then(set => {
        res.json(set);
      })
      .catch(error => {
        res.status(500).json({ message: 'postTrivSet error' })
      })
  },
  postTrivCreator: (req, res) => {
    const dbInstance = req.app.get('db');
    const { tcr_user_id, tcr_cat_id } = req.body;
    dbInstance.post_triv_creator({
      tcr_user_id: tcr_user_id,
      tcr_cat_id: tcr_cat_id
    })
      .then(list => {
        res.json(list);
      })
      .catch(error => {
        res.status(500).json({ message: 'postTrivCreator error' })
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
  deleteTrivCreator: (req, res) => {
    const dbInstance = req.app.get('db');
    const { id, userid } = req.params;
    dbInstance.delete_triv_set([id, userid])
      .then(list => {
        res.json(list);
      })
      .catch(error => {
        res.status(500).json({ message: 'editMyTrivCreator error' })
      })
  },
  postTrivList: (req, res) => {
    const dbInstance = req.app.get('db');
    const { tr_user_id, tr_cat_id } = req.body;
    dbInstance.post_triv_list({
      tr_user_id: tr_user_id,
      tr_cat_id: tr_cat_id
    })
      .then(list => {
        res.json(list);
      })
      .catch(error => {
        res.status(500).json({ message: 'postTrivList error' })
      })
  },
  removeTrivList: (req, res) => {
    const dbInstance = req.app.get('db');
    const { catId, userId } = req.params;
    dbInstance.delete_triv_list([catId, userId])
      .then(list => {
        res.json(list);
      })
      .catch(error => {
        res.status(500).json({ message: 'editMyTrivCreator error' })
      })
  },
  getTrivQASet: (req, res) => {
    const { catId } = req.query;
    req.app.get('db').get_triv_qa({ cat_id: catId })
      .then(set => { res.send(set) })
      .catch(error => {
        res.status(500).json({ message: 'GetTrivQA error' })
      })
  }
}
