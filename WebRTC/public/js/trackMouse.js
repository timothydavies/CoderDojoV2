/*
******************************************************************************************
This file is for dynamic feedback including: 
  tracking the mentor's handler position 
  change the ninja's follower location
  display pointing icons
******************************************************************************************
*/

var handle= document.getElementById("handler");

var socket = io();
var IconSize = $('.handler').width();
var Mwidth;
var Mheight;
var Nwidth;
var Nheight;
/*
*********************************************
track mouse event and change handler location
**********************************************
*/
$('.handler').mousedown(function() {
      
      document.onmousemove = function(event) {
          // get the absolute location (according to document) of screenBox on mentor side
      var SharedScreenOffset= $('#ninjaScreen').offset();
      
          // get screenBox size
      var MentorWidth = $('#ninjaScreen').width();
      var MentorHeight = $('#ninjaScreen').height();
	     // get mouse location (relative to the screenBox)
      var ArrowCorToScreenBoxLeft = event.pageX - SharedScreenOffset.left;
      var ArrowCorToScreenBoxTop = event.pageY - SharedScreenOffset.top;

      var x = ArrowCorToScreenBoxLeft  + "px";
	  var y = ArrowCorToScreenBoxTop  + "px";
        // move handler to mouse location
 	  $('.handler').css({
           "left":x,
           "top":y,
           "margin":0
       });
	  
      
      
        // send out socket with the data of handler location and screenBox size 
	  socket.emit('RTPointing',{ MX: ArrowCorToScreenBoxLeft,
                                 MY: ArrowCorToScreenBoxTop,
                                 Mwidth: MentorWidth,
                                 Mheight: MentorHeight});      
    }
});
document.onmouseup = function() {
      document.onmousemove = function(event){};
      return;
    //}
}

/*
******************************************************************************************
ninja receives socket and changes follower location according to the data
******************************************************************************************
*/
function moveFollower(data) {
	var Mx = data.MX;
	var My = data.MY;
    Mwidth = data.Mwidth;
    Mheight = data.Mheight;
    
    var NinjaScreen = $('#localScreen').offset();
    Nwidth = $('#localScreen').width();
    Nheight = $('#localScreen').height();
    
    var scale = parseFloat(Nwidth/Mwidth);
      // modify the relative location (to localScreen) according to size ratio
    var Nx = Mx * parseFloat(Nwidth/Mwidth);
    var Ny = My * parseFloat(Nheight/Mheight);
    if ( scale!= 1){
        SizeDiff = IconSize * (1 - scale);
    }
    
    
    var Nx_ab = Nx + NinjaScreen.left - SizeDiff + "px";
    var Ny_ab = Ny + NinjaScreen.top  + "px";
    $('.follower').css({
        "left":Nx_ab,
        "top":Ny_ab,
        "margin":0,
    });
}

function updatePosition(disX, disY,ratio){
    
    var NinjaScreen = $('#localScreen').offset();
    var Nx = disX * ratio;
    var Ny = disY * ratio;
    var scale = parseFloat(Nwidth/Mwidth);
    SizeDiff = 0;
    if (scale !=1 ){
       SizeDiff = IconSize * (1 - scale); 
    }
    
    
    var Nx_ab = Nx + NinjaScreen.left - SizeDiff + "px";
    var Ny_ab = Ny + NinjaScreen.top + "px";
    
    $('.follower').css({
        "left":Nx_ab,
        "top":Ny_ab,
        "margin":0,
    });
}
