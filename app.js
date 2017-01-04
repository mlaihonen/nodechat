var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(3000, function(){
  console.log('listening on port 3000');
});

var kayttajat = new Map();

io.sockets.on('connection', function(socket){

  socket.id = (Math.random() * 100) + 1;
  var kayttaja = new UusiKayttaja(socket.id);
  kayttajat.set(socket.id, kayttaja);
  console.log(kayttajat.get(socket.id));

  socket.on('chat message', function(data){
    var x = {
      message: data.message,
      color: kayttajat.get(socket.id).color
    }
    console.log(x.message);
    io.sockets.emit('chat message', x);
  });

    socket.on('disconnect', function(){
    console.log('socketyhteys katkaistu');
  });
});

// socket.on('sendMsgToServer',function(data){
//         var playerName = ("" + socket.id).slice(2,7);
//         for(var i in SOCKET_LIST){
//             SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
//         }
//     });


var UusiKayttaja = function(id) {
  var kayttaja = {
    color:id
  }
  return kayttaja;
}
// //"#"+((1<<24)*Math.random()|0).toString(16)
// function getRandomColor(id) {
//   var letters = id;
//   var color = '#';
//   for (var i = 0; i < 6; i++ ) {
//       color += letters[Math.floor(Math.random().toString() * 16)];
//   }
//   console.log("heii "+ color);
//   return color;
// }
