/*
******************************************************************************************
This file is for highlight on captured screenshot including: 
  trigger drawing function by capturing mouse event 
  draw red line according to pressed mouse movement
  clear drawing on canvas
******************************************************************************************
*/


var mousePressed = false;
var lastX, lastY;
var ctx;
var ratio;

/*
*********************************************
track mouse event to trigger drawing function
**********************************************
*/
function InitThis(window_ratio,canvas) {
  
    ctx=canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ratio=window_ratio;
    
      // start drawing when mouse is pressed down
    $(myCanvas).mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });
      // draw line based on pressed mouse movement
    $(myCanvas).mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });
      // stop drawing when mouse is released
    $(myCanvas).mouseup(function (e) {
        mousePressed = false;
    });
    $(myCanvas).mouseleave(function (e) {
        mousePressed = false;
    });
}


/*
*********************************************
draw red line on canvas
**********************************************
*/
function Draw(x1, y1, isDown) {
    var x;
    var y;
    if (isDown) {
        x=x1/ratio;
        y=y1/ratio;
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x; lastY = y;
}