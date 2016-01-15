
	 function sendScreenshot(){
	    var canvas= document.getElementById("myCanvas");
	    if (!canvas){
		 console.log(' Canvas Null!');
	    }

		 var image = canvas.toDataURL();
		 socket.emit('screenshot', {image: image, name: getParameterByName('user'),url:"/img/mentor.png"});
		
		var img = "<img style='width:25px;' src='/img/mentor.png'>";
		var snapshot= "<img style='width:30%;' src='"+image+"'>";
		
		var input = "<p>"+img+""+snapshot +"</p>";
		$(chatWindow).append(input);
		$(message).val('');
		chatWindow.scrollTop = chatWindow.scrollHeight;
        $('#title').toggle();
        canvas.width=0;
        canvas.height=0;
        $('#screenBox').css("width","200%");
        $('#screenBox').css("height","100%");		
      }
