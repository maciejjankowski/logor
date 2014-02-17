/**
 * Created by mj on 03.02.14.
 */
var nconf = require('nconf');
nconf.env().file({file: 'settings.json'});

var io = require('socket.io-client');
var slog = io.connect(nconf.get("logServer"));

/********************************************************

 For client-side logging, instead of the above lines:
 1. Include socket.io as you would normally do in <script> tag
 and:
 2.
 var slog = io.connect( "http://" + host + namespace);

 *******************************************************/
function ts(){
  return new Date( (new Date().getTime()) + 1000 * 60 * 60).toJSON().replace("T", " ").replace("Z","");
}

// ... AND rename exports to whatever you like. Say: 'L'

exports.ping = function (name, timeout){
  if (slog.socket.connected)
    slog.emit("ping", {name:name, timeout: timeout || 0 });
};

exports.info = function LG(){

  var args = Array.prototype.slice.call(arguments, 0);
  args.push('\033[37m');
  args.unshift('\033[36m ');
  args.unshift(ts());
  console.info.apply(null, args);
  args.pop();
  args.shift();
  args.shift();


  if (slog.socket.connected)
    slog.emit('msg', {type:'info', time:ts(), body: args.join("\t") });
  //slog.send(ts() + ' <span class="info">'  + args.join("\t") + "</span>");

};

exports.warn = function LY(){
  var args = Array.prototype.slice.call(arguments, 0);
  args.push('\033[37m');
  args.unshift('\033[33m ');
  args.unshift(ts());
  console.warn.apply(null, args);
  args.pop();
  args.shift();
  args.shift();

  if (slog.socket.connected)
    slog.emit('msg', {type:'warn', time:ts(), body: args.join("\t") });

}

exports.log = function LG(){
  var args = Array.prototype.slice.call(arguments, 0);
  args.push('\033[37m');
  args.unshift('\033[32m ');
  args.unshift(ts());
  console.log.apply(null, args);
  args.pop();
  args.shift();
  args.shift();
  if (slog.socket.connected)
    slog.emit('msg', {type:'log', time:ts(), body: args.join("\t") });

}



exports.error = function LR(){
  var args = Array.prototype.slice.call(arguments, 0);
  args.push('\033[37m');
  args.unshift('\033[31m ');
  args.unshift(ts());
  console.error.apply(null, args);
  args.pop();
  args.shift();
  args.shift();
  if (slog.socket.connected)
    slog.emit('msg', {type:'error', time:ts(), body: args.join("\t") });
}


