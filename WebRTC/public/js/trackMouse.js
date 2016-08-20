/*
******************************************************************************************
This file is for dynamic feedback including: 
  tracking the mentor's handler position 
  change the ninja's follower location
  display pointing icons
******************************************************************************************
*/

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
  var SharedScreenOffset= $('#iconPosReference').offset();
  // get screenBox size
  var MentorWidth = $('#ninjaScreen').width();
  var MentorHeight = $('#ninjaScreen').height();
  // get mouse location (relative to the screenBox)
  var ArrowCorToScreenBoxLeft = event.pageX - SharedScreenOffset.left;
  var ArrowCorToScreenBoxTop = event.pageY - SharedScreenOffset.top;

  var x = ArrowCorToScreenBoxLeft + "px";
  var y = ArrowCorToScreenBoxTop + "px";
    // move handler to mouse location
    // TODO use handle instead of jquery again?
  $('.handler').css({
       "left":x,
       "top":y,
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
// TODO change to just use ratio of handler's distance along the mentor's video
function moveFollower(data) {
	var Mx = data.MX;
	var My = data.MY;
  Mwidth = data.Mwidth;
  Mheight = data.Mheight;
  
  Nwidth = $('#localScreen').width();
  Nheight = $('#localScreen').height();
  
  var scalew = parseFloat(Nwidth/Mwidth);
  var scaleh = parseFloat(Nwidth/Mwidth);
  // modify the relative location (to localScreen) according to size ratio
  var Nx = Mx * scalew;
  var Ny = My * scaleh;
  // SizeDiff = IconSize * (1 - scale);
  
  var Nx_ab = Nx + "px";
  var Ny_ab = Ny + "px";
  $('.follower').css({
      "left":Nx_ab,
      "top":Ny_ab,
  });
}

function updatePosition(ratioX, ratioY){
  var Nx = $('#localScreen').width() * ratioX;
  var Ny = $('#localScreen').height() * ratioY;
  
  var Nx_ab = Nx + "px";
  var Ny_ab = Ny + "px";
  
  $('.follower').css({
      "left":Nx_ab,
      "top":Ny_ab,
  });
}
