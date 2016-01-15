window.onload = function(){   
//var target= document.getElementById("follower");
var handle= document.getElementById("myHandle");
var socket = io();

//console.log("handle: "+handle.id);

trackMouse(handle);


function trackMouse(handle) {

  handle.onmousedown = function(event) {
    console.log("before element:"+handle.style.left+" "+handle.style.top);
    console.log("event:"+ event.pageX +" y:"+ event.pageY);
    document.onmousemove = function(event) {
    
	  var x=event.pageX-15;
	  var y=event.pageY-250;
 	  handle.style.left=x + "px";
	  handle.style.top=y + "px"; 
    console.log("element:"+handle.style.left+" "+handle.style.top);
    console.log("x:"+ x +" y:"+ y);
	  //socket.emit('RTPointing',{ pX: x,pY: y});
	  //var url='./moveCursor.js';
	  //$('#myContent').load(url + ' #dmyContent'); 
    }

    document.onmouseup = function() {
      document.onmousemove = null;
      document.onmouseup = null;
    }

    return false;
  }
}

 

 // socket.on('RTPointing', function(data) {
 	  /* target.style.scrollX= event.pageX;
	  target.style.scrollY= event.pageY; 
      handle.style.left=data.pX + "px";
	  handle.style.top=data.pY + "px";
      target.style.left = data.pX + "px";
      target.style.top = data.pY + "px"; */ 
	//  console.log('mouseX:'+data.pX+' mouseY:'+data.pY);

 //}
}