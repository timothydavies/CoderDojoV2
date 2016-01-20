    function addEditZone(){
    
        var editZone = document.createElement('div');
        editZone.id="editScreenshot";
        var title = document.createElement('p');
        title.innerHTML="Hightlight the screenshot";
        var newCanvas = document.createElement('canvas');
        newCanvas.id="myCanvas";
        newCanvas.width=jQuery(window).width()*0.5;
        newCanvas.height=jQuery(window).height()*0.45;       
        
        $('#screenBox').append(editZone);
        console.log("Add editzone");
        $('#editScreenshot').append(title);
        console.log("Add title");
        $('#editScreenshot').append(newCanvas);
        console.log("Add canvas");
        
        //alert("You can use static feedback now!");
    }
        
        
	 function Screenshot(){
         
		var canvas= document.getElementById("myCanvas");    
		var ctx = canvas.getContext("2d");
        var video = document.getElementById("ninjaScreen");
        canvas.width=jQuery(window).width()*0.5;
        canvas.height=jQuery(window).height()*0.48;
        //var container= document.getElementById("screenBox");
		//var video = document.getElementById('source');
  
	    console.log(' video width: '+canvas.width+" height: "+canvas.height);
        //console.log(' screenbox width: '+$("#screenBox").width()+" height: "+$("#screenBox").height());
		ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight,0,0,parseInt(canvas.width)+0.5,parseInt(canvas.height)+0.5);
        //var image = canvas.toDataURL();
        //window.open('');
       
        if ($('#title').css('display')!='none'){
            $('#title').toggle();
        }
		
		//document.body.appendChild(canvas);
        //$('#ninjaScreen').toggle();
        //$('#box').append(canvas);
        
        
		InitThis();
		
		console.log('done');
      }
	  
