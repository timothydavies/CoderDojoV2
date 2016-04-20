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
      var ArrowCorToScreenBoxLeft = event.pageX - 20 - SharedScreenOffset.left;
      var ArrowCorToScreenBoxTop = event.pageY - SharedScreenOffset.top
      
      var x=ArrowCorToScreenBoxLeft+"px";
	  var y=ArrowCorToScreenBoxTop+"px";
        // move handler to mouse location
 	  $('.handler').css({
           "left":x,
           "top":y
       });
	  
      
      
        // send out socket with the data of handler location and screenBox size 
	  socket.emit('RTPointing',{ MX: ArrowCorToScreenBoxLeft+20,
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
    console.log("ninja move:");
	var Mx = data.MX;
	var My = data.MY;
    var Mwidth = data.Mwidth;
    
    var NinjaScreen = $('#localScreen').offset();
    var Nwidth = $('#localScreen').width();
    
      // modify the relative location (to localScreen) according to size ratio
    var Nx = Mx * (Nwidth/Mwidth);
    var Ny = My * (Nwidth/Mwidth);
    var diff = 20;
    var Nx_ab = Nx - diff + NinjaScreen.left + "px";
    var Ny_ab = Ny - diff*1.2 + NinjaScreen.top + "px";
    console.log(Nx_ab+" "+Ny_ab);
    $('.follower').css({
        "left":Nx_ab,
        "top":Ny_ab
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