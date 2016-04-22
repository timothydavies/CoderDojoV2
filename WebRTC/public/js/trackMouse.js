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

      var x=ArrowCorToScreenBoxLeft - $('.handler').width()/2 + "px";
	  var y=ArrowCorToScreenBoxTop + $('.handler').height()/2 + "px";
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
    var Mwidth = data.Mwidth;
    var Mheight = data.Mheight;
    
    var NinjaScreen = $('#localScreen').offset();
    var Nwidth = $('#localScreen').width();
    var Nheight = $('#localScreen').height();
    
    
      // modify the relative location (to localScreen) according to size ratio
    var Nx = Mx * parseFloat(Nwidth/Mwidth);
    var Ny = My * parseFloat(Nheight/Mheight);

    var Nx_ab = Nx + NinjaScreen.left - $('.follower').width()/2 + "px";
    var Ny_ab = Ny + NinjaScreen.top - $('.follower').height()/2 + "px";
    $('.follower').css({
        "left":Nx_ab,
        "top":Ny_ab,
        "margin":0
    });
}

function updatePosition(disX, disY,ratio){
    
    var NinjaScreen = $('#localScreen').offset();
    var Nx = disX * ratio;
    var Ny = disY * ratio;
    console.log('x:'+Nx+'y: '+Ny);
    var Nx_ab = Nx + NinjaScreen.left + "px";
    var Ny_ab = Ny + NinjaScreen.top + "px";
    
    $('.follower').css({
        "left":Nx_ab,
        "top":Ny_ab,
        "margin":0
    });
}
/*
******************************************************************************************
display corresponding icon by selected radio button value
******************************************************************************************
*/
$('.icon-btn').click(function(){
    $('.point-icon').css("display","none");
    var choice = $(this).attr('value');
    $('#follower-'+choice).css("display","block");
    $('#handler-'+choice).css("display","block");
});