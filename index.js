var express = require('express');
var app = express();
var url = require('url');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var connected_users = [];

io.on('connection', function(socket){

  var id = socket.id;
  if (connected_users.length < 2 ){
    connected_users.push(id);
  }

  io.emit('new user', connected_users);

  socket.on('hi', function(targetId){
    io.emit('hi', targetId);
  });

   socket.on('hi2', function(targetId){
    io.emit('hi2', targetId);
  });


  socket.on('disconnect', function() {
    io.emit('lala', id + " disconnected");
    id_index = connected_users.indexOf(id);
    if (id_index != -1) {
      connected_users.splice(connected_users.indexOf(id), 1);
    }
  });
});

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

app.get('/*', function(req, res){
    if(chats[req.url.substring(1)]){
        res.sendFile(__dirname + '/public/chat.html');
    }else{
        res.sendFile(__dirname + '/public/404.html');
    }
});