/*
******************************************************************************************
This file is for static feedback including: 
  capture sharing screen box
  initialize canvas for containing captured image
  add function buttons on canvas
******************************************************************************************
*/
// TODO have one canvas store the image and go unchanged, one canvas store the path and get cleared, combine canvases for sending to resolve slow TakeScreenshot time
var ratio;
var ctx;

/*
*********************************************
When clearing canvas, overwrite it with the original
**********************************************
*/   
function copyCanvas(source, dest) {
  // Get destination canvas context
  var context = dest.getContext('2d');
  // Copy dimensions
  dest.width = source.width;
  dest.height = source.height;
  // Copy content
  context.drawImage(source, 0, 0);
}

/*
*********************************************
when start screen sharing, edit zone which contains 
    'take screenshot' button is added under sharing window
**********************************************
*/   
function addCanvasZone(){
        var CanvasZone = document.getElementById('CanvasZone');
        if (CanvasZone==null){
           CanvasZone = document.createElement('div'); 
           CanvasZone.id="CanvasZone"; 
           console.log("Add CanvasZone");
        }   
        $('#screenBox').append(CanvasZone);
     
    }

 /*
*********************************************
adjust canvas resolution to provide high quality
    screenshot
**********************************************
*/    
function PIXEL_RATIO() {
    var ctx1 = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx1.webkitBackingStorePixelRatio ||
              ctx1.mozBackingStorePixelRatio ||
              ctx1.msBackingStorePixelRatio ||
              ctx1.oBackingStorePixelRatio ||
              ctx1.backingStorePixelRatio || 1;
    console.log("ratio:"+ dpr / bsr);
    return dpr / bsr;
}


function createHiDPICanvas(can, w, h) {
    ratio = PIXEL_RATIO(); 
    can.width = w * ratio;
    can.height = h * ratio;
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
}


/*
*********************************************
take screenshot when button is clicked
**********************************************
*/           
var screenshot=function(){
  var video = document.getElementById("ninjaScreen");
  // create canvas to hold image
  var canvasImg = document.createElement('canvas');
  canvasImg.id="canvasImg";
  // create canvas for drawing
  var canvas = document.createElement('canvas');
  canvas.id="myCanvas";

  // TODO safe to remove?
  // var w;
  // if (PIXEL_RATIO()==1){
  //    // w = 0.47 * screen.availWidth; 
  //    w = 0.24 * screen.availWidth;
  // }
  // else{
  //    w = 0.24 * screen.availWidth;
  // }
  // var h = w*(video.videoHeight/video.videoWidth);

  // Set the screenshot to be the same dimensions as the video (as displayed)
  var w = video.clientWidth;
  var h = video.clientHeight;

  //Create canvas with the device resolution.
  createHiDPICanvas(canvas, w, h);
  ctx = canvas.getContext("2d");
  ctx.mozImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  // TODO use width, height, and position of the VISIBLE video (if zoom feature is implemented)
  //draw screenshot into canvas
  ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight,0,0,canvas.width/ratio,canvas.height/ratio);

  copyCanvas(canvas, canvasImg);

  createCanvasZone(canvas,ctx,canvasImg);
  console.log(' canvas width: '+ canvas.width+" height: "+ canvas.height+" " + screen.width);
  console.log(' video width: '+ video.videoWidth+" height: "+ video.videoHeight);	
  console.log('done');
  canvas.textContent=canvas.toDataURL("img/png");
  //console.log(canvas.textContent);
  $('#takescreenShot').attr('disabled',true);
}

/*
*********************************************
add buttons (send, clear and close) to canvas
**********************************************
*/
function createCanvasZone(canvas,ctx,canvasImg){
    var BtnZone = document.createElement('div');
    BtnZone.id="canvasBtnZone";

    var clear_btn = document.createElement('input');
        clear_btn.type = "button";
        clear_btn.id = 'clearCanvas';
        clear_btn.className = "canvas_btn";
        clear_btn.value='Clear';
        clear_btn.onclick=function(){
          copyCanvas(canvasImg, canvas);
        };
        
    var close_btn = document.createElement('input');
        close_btn.type = "button";
        close_btn.className = "canvas_btn";
        close_btn.id = 'closeCanvas';
        close_btn.value='Close';
        close_btn.onclick=function() {
          $('#CanvasZone').empty();
          $('#takescreenShot').attr('disabled',false);
        };

    var send_btn = document.createElement('input');
        send_btn.type = "button";
        send_btn.id = 'sendscreenShot';
        send_btn.className = "canvas_btn";
        send_btn.value='Send screenshot';
        send_btn.onclick=function(){
          sendScreenshot()
          $('#CanvasZone').empty();
          $('#takescreenShot').attr('disabled',false);
        };
        
   
    $('#CanvasZone').append(BtnZone);
    $('#canvasBtnZone').append(clear_btn);
    $('#canvasBtnZone').append(close_btn);
    $('#canvasBtnZone').append(send_btn);
    $('#CanvasZone').append(canvas);
    
    InitThis(ratio,canvas);
}
