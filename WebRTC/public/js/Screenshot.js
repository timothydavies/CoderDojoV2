
    
function addEditZone(){
    
        var editZone = document.createElement('div');
        editZone.id="editScreenshot";
/*        var title = document.createElement('p');
        title.innerHTML="Hightlight the screenshot";*/
      
        
        $('#screenBox').append(editZone);
        console.log("Add editzone");
 /*       $('#editScreenshot').append(title);
        console.log("Add title");*/
        //$('#editScreenshot').append(canvas);
        //console.log("Add canvas");
        
        //alert("You can use static feedback now!");
    }
    
function addScreenShotButton(){
    var take_btn = document.createElement('input');
    take_btn.type = "button";
    take_btn.id = 'takescreenShot';
    take_btn.value='Take screenshot';
    take_btn.onclick=function(){Screenshot()};
    

    
    var buttonZone = document.createElement('div');
    buttonZone.id="ButtonZone";
    
    $('#screenBox div').append(buttonZone);
    console.log("Add btnn zone");
    $('#ButtonZone').append(take_btn);
    console.log("Add take screenshot button");

    
}
    
function PIXEL_RATIO() {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;
    console.log("ratio:"+ dpr / bsr);
    return dpr / bsr;
}

var ratio;
function createHiDPICanvas(can, w, h) {
    ratio = PIXEL_RATIO(); 
    //ratio=1;
    can.width = w * ratio;
    can.height = h * ratio;
/*    can.style.width = w + "px";
    can.style.height = h + "px";*/

    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
}


        
        
	 function Screenshot(){

        var video = document.getElementById("ninjaScreen");
        
        var canvas = document.createElement('canvas');
        /*canvas.id="myCanvas";
        canvas.width=jQuery(window).width()*0.5;
        canvas.height=jQuery(window).height()*0.45; */
        var w=jQuery(window).width()*0.37;
        var h=w*(video.videoHeight/video.videoWidth);
        createHiDPICanvas(canvas, w, h);
        canvas.id="myCanvas";
        //Create canvas with the device resolution.
        
        var ctx = canvas.getContext("2d");
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        
        createEditZone(canvas,ctx);
        
        ctx.drawImage(video ,0,0,video.videoWidth,video.videoHeight,0,0,canvas.width/2,canvas.height/2);
	    //ctx.drawImage(video ,0,0,canvas.width,canvas.height);
        console.log(' video width: '+ video.videoWidth+" height: "+ video.videoHeight);
		
		//document.body.appendChild(canvas);
        //$('#ninjaScreen').toggle();
        //$('#box').append(canvas);
        
        
		
		
		console.log('done');
      }

function createEditZone(canvas,ctx){
    
    var canvasZone = document.createElement('div');
    canvasZone.id="canvasZone";
    
    var clear_btn = document.createElement('input');
        clear_btn.type = "button";
        clear_btn.id = 'clearCanvas';
        clear_btn.value='Clear';
        clear_btn.onclick=function(){clearArea(ctx)};
        
    var close_btn = document.createElement('input');
        close_btn.type = "button";
        close_btn.id = 'closeCanvas';
        close_btn.value='Close';
        close_btn.onclick=function(){canvasZone.remove();};
    

    
    var send_btn = document.createElement('input');
        send_btn.type = "button";
        send_btn.id = 'sendscreenShot';
        send_btn.value='Send screenshot';
        send_btn.onclick=function(){sendScreenshot()};
        
    $('#editScreenshot').append(canvasZone);
    $('#canvasZone').append(clear_btn);
    $('#canvasZone').append(close_btn);    
    $('#canvasZone').append(canvas);
    $('#canvasZone').append(send_btn);
    
    InitThis(ratio,ctx);
}	  
