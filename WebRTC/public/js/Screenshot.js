    function addEditZone(){
    
        var editZone = document.createElement('div');
        editZone.id="editScreenshot";
        var title = document.createElement('p');
        title.innerHTML="Hightlight the screenshot";
        var newCanvas = document.createElement('canvas');
        newCanvas.id="myCanvas";
        
        
        $('#screenBox').append(editZone);
        $('#editScreenshot').append(title);
        $('#editScreenshot').append(newCanvas);
    }
        
        
	 function Screenshot(){
         
		var canvas= document.getElementById("myCanvas");    
		var ctx = canvas.getContext("2d");
        var video = document.getElementById("ninjaScreen");
        canvas.width=jQuery(window).width()*0.5;
        canvas.height=jQuery(window).height()*0.39;
        //var container= document.getElementById("screenBox");
		//var video = document.getElementById('source');
	    console.log(' video width: '+canvas.width+" height: "+canvas.height);
        //console.log(' screenbox width: '+$("#screenBox").width()+" height: "+$("#screenBox").height());
		ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight,0,0,canvas.width,canvas.height);
        //var image = canvas.toDataURL();
        //window.open('');
       
        
		$('#title').toggle();
		//document.body.appendChild(canvas);
        //$('#ninjaScreen').toggle();
        //$('#box').append(canvas);
        
        
		InitThis();
		
		console.log('done');
      }
	  
