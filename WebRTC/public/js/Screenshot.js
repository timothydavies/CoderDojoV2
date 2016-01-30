       var canvas = document.createElement('canvas');
        /*canvas.id="myCanvas";
        canvas.width=jQuery(window).width()*0.5;
        canvas.height=jQuery(window).height()*0.45; */
        var w=jQuery(window).width()*0.25;
        var h=jQuery(window).height()*0.225;
        createHiDPICanvas(canvas, w, h);
        canvas.id="myCanvas";
        //Create canvas with the device resolution.
        
        var ctx = canvas.getContext("2d");
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
    
function addEditZone(){
    
        var editZone = document.createElement('div');
        editZone.id="editScreenshot";
        var title = document.createElement('p');
        title.innerHTML="Hightlight the screenshot";
      
        
        $('#screenBox').append(editZone);
        console.log("Add editzone");
        $('#editScreenshot').append(title);
        console.log("Add title");
        $('#editScreenshot').append(canvas);
        console.log("Add canvas");
        
        //alert("You can use static feedback now!");
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
    can.width = w * ratio;
    can.height = h * ratio;
/*    can.style.width = w + "px";
    can.style.height = h + "px";*/

    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
}




        
        
	 function Screenshot(){

        var video = document.getElementById("ninjaScreen");

        ctx.drawImage(video ,0,0,video.videoWidth,video.videoHeight,0,0,canvas.width,canvas.height);
	    //ctx.drawImage(video ,0,0,canvas.width,canvas.height);
        console.log(' video width: '+ video.videoWidth+" height: "+ video.videoHeight);
       
        if ($('#title').css('display')!='none'){
            $('#title').toggle();
        }
		
		//document.body.appendChild(canvas);
        //$('#ninjaScreen').toggle();
        //$('#box').append(canvas);
        
        
		InitThis(ratio);
		
		console.log('done');
      }
	  
