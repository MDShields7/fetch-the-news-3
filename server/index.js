const express = require('express');
const massive = require('massive');
const bodyParser = require('body-parser');
const controller = require('./controller');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server)
require('dotenv').config();

app.use(bodyParser.json());
app.use( express.static( `${__dirname}/../build` ) );

massive(process.env.CONNECTION_STRING).then (database => {
  app.set('db', database);
}).catch(error => {
  console.log('error with massive', error)
})

// RESTFUL METHODS
app.get('/api/TrivSet', controller.getTrivSet) //FUNCTIONS
app.get('/api/MyTrivSet', controller.getMyTrivSet) //FUNCTIONS
app.get('/api/MyTrivSetCreated', controller.getMyTrivCreated) 
app.get('/api/TrivQASet', controller.getTrivQASet)
//FUNCTIONS
app.put(`/api/EditMyTrivSet/:id`, controller.editMyTrivSet) //FUNCTIONS
app.delete(`/api/DeleteTrivSet/:id/:userid`, controller.deleteTrivSet) //FUNCTIONS
app.post('/api/TrivList', controller.postTrivList) //FUNCTIONS
app.post('/api/TrivSet', controller.postTrivSet) //FUNCTIONS
app.post('/api/TrivCreator', controller.postTrivCreator) //FUNCTIONS

// SOCKETS
io.sockets.on('connection', (socket) => {
  
  socket.on('user join', (userJoin) => {
    socket.emit('user join for host')
  })
  socket.on('disconnect', () => {

  })
})


const path = require('path')
// app.get('*', (req, res)=>{
//   res.sendFile(path.join(__dirname, '../build/index.html'));
// })

const PORT = 4001 || process.env.CONNECTION_STRING;
app.listen(PORT, ()=> console.log(`Server listening on port PORT`))