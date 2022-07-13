const express = require('express')
const path = require('path')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser')
app.set('port', (process.env.PORT || 5000));
const mongoose = require('mongoose');
// body-parser
app.use(bodyParser.json())
//private key 3b396e3c-1190-4463-b9c4-2b656b52b086
// public key vwavitpt
// collections
const Users = require('./UserModel')
mongoose.connect('mongodb+srv://gaintplay:1aVXrl7ARWPWobEO@cluster0.imtuahu.mongodb.net/gaintplay',{useNewUrlParser:true},
    function(err){
        if(err){
            throw err
        }
        console.log('Database connected')
        
        io.on('connection', function(socket){

          // console.log('User Conncetion');
        
          // socket.on('connect user', function(user){
          //   console.log("Connected user ");
          //   io.emit('connect user', user);
          // });
        
          // socket.on('on typing', function(typing){
          //   console.log("Typing.... ");
          //   io.emit('on typing', typing);
          // });
        
          socket.on('chat message', function(msg){
            console.log("Message " + msg['message']);
            io.emit('chat message', msg);
          });
        });
        

})

Users.watch().on('change',(change)=>{
  console.log('Something has changed')
  io.to(change.fullDocument._id).emit('changes',change.fullDocument)
})

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

console.log("outside io");


http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/welcome', (req,res)=>{
  res.send('Hello World');
  })
