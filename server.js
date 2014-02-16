/**
 * Created by mj on 02.02.14.

 https://github.com/flatiron/winston
 logs.papertrailapp.com:28135

 TODO: http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
 https://github.com/btford/angular-socket-io
 http://stackoverflow.com/questions/14389049/how-to-use-angularjs-with-socket-io
 * */
{
var express = require('express');
var fs = require('fs');

var nconf = require('nconf');

nconf.env().file({file: 'settings.json'});

var app = express();


app.use(express.static(__dirname + '/public'));

var server = app.listen(process.env.port || nconf.get("port") || "3210");

var io = require('socket.io').listen(server)
    .set('log level', 0)
}
function ts(){
  return new Date( (new Date().getTime()) + 1000 * 60 * 60).toJSON().replace("T", " ").replace("Z",""); // czy będzie działał po zmianie czasu?
}


io.on('connection',function(socket){

  socket.emit('msg', {time: ts(), body:'hello', name:'SERVER'});

  socket.on('ping', function(data) {

    socket.set('name', data.name);

    if (!data.timeout){
      socket.get('notOkTimeout', function(err, timeout){
        data.timeout = timeout || nconf.get('default_timeout') || 15 * 60e3;
        io.sockets.emit('ping', data);
      });
    }
    else {
      io.sockets.emit('ping', data);
      socket.set('notOkTimeout', data.timeout);
    }

//    console.log(data.name + ' is alive');
  });

  socket.on('msg', function(data){

//    console.log('msg rcvd');

    socket.get('name', function(err, name){
//      console.log(name, " is sending a message");
      data.name = name;
      socket.broadcast.send(data);
      socket.broadcast.emit('msg', data); // powinno być raczej emit
    });

// TODO : logowanie do bazy? i może nawet pobieranie paczek ze wszystkimi logami o danej nazwie
//    fs.appendFile('logs/log.txt', (new Date().toJSON().replace("T", " ").replace("Z","")) + " "+data + "\n");
  });

});
// ------------ NEW CODE ----------------------

console.log("listening on: " + server.address().port );





































