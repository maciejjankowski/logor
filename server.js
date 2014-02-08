/**
 * Created by mj on 02.02.14.
 */
/**

 https://github.com/flatiron/winston
 logs.papertrailapp.com:28135
 * */


var express = require('express');
var fs = require('fs');

var nconf = require('nconf');

nconf.env().file({file: 'settings.json'});

var app = express();


app.use(express.static(__dirname + '/public'));

var server = app.listen(process.env.port || nconf.get("port") || "3210");

var io = require('socket.io').listen(server)
    .set('log level', 0)

io.of('/msg').on('connection', function(socket){

  socket.send("hello");

  socket.on("message", function (data){
    socket.broadcast.send(data);
    fs.appendFile('logs/log.txt', (new Date().toJSON().replace("T", " ").replace("Z","")) + " "+data + "\n");
  });
});

io.of('/ping' ).on('connection',function(socket){
  socket.on('ping', function(data){
    io.sockets.emit('ping', data);
    io.of('/ping').emit('ping', data);
    console.log(data.name + ' is alive');
  })
})

console.log("listening on: " + server.address().port );
