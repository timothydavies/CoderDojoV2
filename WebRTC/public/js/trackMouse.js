
//var target= document.getElementById("follower");
var handle= document.getElementById("handler");

var socket = io();

//console.log("handle: "+handle.id);

$('body').on('mousedown','#handler',function() {
      //console.log('mouse down');
      document.onmousemove = function(event) {

	  var x=(event.pageX-20)+"px";
	  var y=(event.pageY-20)+"px";
 	  $('#handler').css({
           "left":x,
           "top":y
       });
	  
      var SharedScreenOffset= $('#ninjaScreen').offset();
      var MentorWidth = $('#ninjaScreen').width();
      var MentorHeight = $('#ninjaScreen').height();
      var ArrowCorTocreenLeft = event.pageX-20-SharedScreenOffset.left;
      var ArrowCorTocreenTop = event.pageY-20-SharedScreenOffset.top
      //console.log("x:"+ x +" y:"+ y);
	  socket.emit('RTPointing',{ MX: ArrowCorTocreenLeft,
                                 MY: ArrowCorTocreenTop,
                                 Mwidth: MentorWidth,
                                 Mheight: MentorHeight});      
    }
});
document.onmouseup = function() {
      document.onmousemove = function(event){};
      return;
    //}
}

socket.on('RTPointing', function(data) {
	var Mx = data.MX;
	var My = data.MY;
    var Mwidth = data.Mwidth;
    //var Mheight = data.Mheight;
    
    var NinjaScreen = $('#localScreen').offset();
    var Nwidth = $('#localScreen').width();
    var Nx = Mx * (Nwidth/Mwidth);
    var Ny = My * (Nwidth/Mwidth);
    var Nx_ab = Nx+NinjaScreen.left-10+"px";
    var Ny_ab = Ny+NinjaScreen.top-30+"px";
    $('#follower').css({
        "left":Nx_ab,
        "top":Ny_ab
    });
});

function addHandler(){
    var arrow = document.createElement('img');
    arrow.id="handler";
    arrow.src="/img/arrow.svg";
    $('body').append(arrow);
}