/**
 * Created by mj on 03.02.14.
 */
if (typeof require == 'function'){
  // this is for server-side logging (node)
  var nconf = require('nconf');
  nconf.env().file({file: 'settings.json'});
  var io = require('socket.io-client');
  var slog = io.connect(nconf.get("logServer"));
} else {
  // this is for client-side logging (browser), assumes socket.io to be already included
  var host = 'localhost:3333';
  var namespace = '/';
  var slog = io.connect( "http://" + host + namespace);
}

slog.on('connect', function(){
  setTimeout(function(){
    if (typeof console.ping != 'undefined') 
      console.ping('testClient');
  },500)
})
/********************************************************
 For client-side logging, instead of the above lines:
 1. Include socket.io as you would normally do in <script> tag
 2. the rest of the code should be portable - see above
 *******************************************************/

function ts(){
  return new Date( (new Date().getTime()) + 1000 * 60 * 60).toJSON().replace("T", " ").replace("Z","");
}

var logor = function(){};

logor.prototype.ping = function (name, timeout){
  if (slog.socket.connected)
    slog.emit("ping", {name:name, timeout: timeout || 0 });
};

logor.prototype.info = function LG(){

  var args = Array.prototype.slice.call(arguments, 0);
  args.push('\033[37m');
  args.unshift('\033[36m ');
  args.unshift(ts());
  _c.info.apply(null, args);
  args.pop();
  args.shift();
  args.shift();


  if (slog.socket.connected)
    slog.emit('msg', {type:'info', time:ts(), body: args.join("\t") });
  //slog.send(ts() + ' <span class="info">'  + args.join("\t") + "</span>");

};

logor.prototype.warn = function LY(){
  var args = Array.prototype.slice.call(arguments, 0);
  args.push('\033[37m');
  args.unshift('\033[33m ');
  args.unshift(ts());
  _c.warn.apply(null, args);
  args.pop();
  args.shift();
  args.shift();

  if (slog.socket.connected)
    slog.emit('msg', {type:'warn', time:ts(), body: args.join("\t") });

}

logor.prototype.log = function LG(){
  var args = Array.prototype.slice.call(arguments, 0);
  args.push('\033[37m');
  args.unshift('\033[32m ');
  args.unshift(ts());
  _c.log.apply(null, args);
  args.pop();
  args.shift();
  args.shift();
  if (slog.socket.connected)
    slog.emit('msg', {type:'log', time:ts(), body: args.join("\t") });

}

logor.prototype.error = function LR(){
  var args = Array.prototype.slice.call(arguments, 0);
  args.push('\033[37m');
  args.unshift('\033[31m ');
  args.unshift(ts());
  _c.error.apply(null, args);
  args.pop();
  args.shift();
  args.shift();
  if (slog.socket.connected)
    slog.emit('msg', {type:'error', time:ts(), body: args.join("\t") });
}

logor.prototype.pop = function(){
  var args = Array.prototype.slice.call(arguments, 0);
//  args.push('\033[37m');
//  args.unshift('\033[31m ');
  args.unshift(ts());
  _c.info.apply(null, args);
//  args.pop();
//  args.shift();
//  args.shift();
  if (slog.socket.connected)
    slog.emit('msg', {type:'pop', time:ts(), body: args.join("\t") });
}


if (typeof exports !== "undefined") {
  module.exports = logor;
} else {
  _c = {
    error : function(){},
    warn: function(){},
    info : function(){},
    log : function(){}
  }
  
  console = new logor();
  
}
