/**
 * Created by mj on 16.02.14.
 * TODO: zangularować
 */
var socket = io.connect(location.protocol + "//" + location.host);//http://cbping.azurewebsites.net/
socket.on('connect', function(socket){
  console.info("connected");
});

socket.on('msg', function (data) {
//  console.log('msg', data)
  showMessage(data);
});

socket.on('ping', function(data){
  isOk(data.name);
  clearTimeout( notOkArr[data.name] );
  clearTimeout( idleArr[data.name] );

  idleArr[data.name] = setTimeout(function(){
    idle(data.name);
  }, 333);

  notOkArr[data.name] = setTimeout(function(){
    notOk(data.name);
  }, data.timeout || sessionStorage.getItem("idle") || notOkTimeout);

});


function showMessage(data){
  var f = $("#out" );
  var msgs = f.html().split("\n" );

  if ( msgs.length > 200){
    msgs.pop();
  }

  var msg = data.time + ' <span class="' + data.type + '" data-source="'+ data.name +'">' +"["+ data.name +"] "+  data.body + '</span>';
  msgs.unshift(msg);

  f.html( msgs.join("\n") );
} // showMessage


var notOkArr = [];
var notOkTimeout = 15*60*1000; // 15 minut

var idleArr = [];

function idle(el){
  var f = document.querySelector( "#" + el );
  f.setAttribute('class', 'idle');
} // idle


function notOk(el){
  var f = document.querySelector( "#" + el );
  f.setAttribute('class', 'not-ok');
  try{
    if (!sessionStorage.getItem("mute"))
      document.querySelector("#hlaps").play();
  } catch(e){
    console.error('hlaps')
  }

} // notOk

function isOk(el){

  var f = document.querySelector( "#" + el );
  if (!f){
    $('#pings').append('<span id="' + el + '">'+ el +'</span>');
  }

  $( "#" + el ).attr('class', 'ok');
} // isOk

$( document ).ready(function() {
  $("#unmute" ).toggle();

  $("#mute").on('click', function(){
    sessionStorage.setItem("mute",1);
    $("#unmute" ).toggle();
    $("#mute" ).toggle();
  });

  $("#unmute").on('click', function(){
    sessionStorage.setItem("mute","");
    $("#unmute" ).toggle();
    $("#mute" ).toggle();
  });

});


