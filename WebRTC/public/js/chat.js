var chatWindow = document.getElementById("chatWindow");
var recentChat = document.getElementById("recentChat");
var message = document.getElementById("message");
var chatForm = document.getElementById("chatForm");
var submit = document.getElementById("submit");
var user_type = document.getElementById("user_type");
var logIcon = document.getElementById("logIcon");
/* Buttons and functions to set true/false. 
	When True, clicking will show or expand elements.
*/
var logBtn = document.getElementById("logBtn"),
	setLogBtn = function(bool) {
		if (bool) {
			$(logIcon).removeClass("glyphicon-chevron-down");
			$(logIcon).addClass("glyphicon-chevron-up");
			$(logBtn).attr("value","T");
			// TODO add a class to style a pressed button
			// $(logBtn).removeClass("btn-pressed");
		} else {
			$(logIcon).removeClass("glyphicon-chevron-up");
			$(logIcon).addClass("glyphicon-chevron-down");
			$(logBtn).attr("value","F");
		}
	};
var ovrBtn = document.getElementById('ovrBtn'),
	setOvrBtn = function(bool) {
		if(bool) {
			$(ovrBtn).attr("value","T");
		} else {
			$(ovrBtn).attr("value","F");
		}
	};
// Handler for the recentChat box timeout
var msgTimeout;

setLogBtn(false);
setOvrBtn(true);

// from http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
// Prompts the user to copy some text
function copyToClipboard(text) {
  prompt("Copy to clipboard: Ctrl+C, Enter",text);
}

// Resume deleting recent messages if the input box loses focus
$(message).focusout(function(){
	clearTimeout(msgTimeout);
	msgTimeout = setTimeout(removeMessage, 4000);
});

// Removes the oldest message from recent chat
function removeMessage() {
	clearTimeout(msgTimeout);
	var msgs = recentChat.innerHTML;
	// Delete oldest message if input box is not focused and history is not empty
	if (!($(message).is(':focus') || msgs == '')) {
		msgs = msgs.replace(/<p>((.|\n)*?)<\/p>/m,'');
		recentChat.innerHTML = msgs;
		if (msgs == '') $(recentChat).hide();
		msgTimeout = setTimeout(removeMessage, 1000);
	}
}

function addRecentMessage(message) {
	if (!$(chatWindow).is(':visible') || $(chatOverlay).height() == 0) {
		// If overflowing, remove last message
		if(recentChat.scrollHeight > $(recentChat).height()) removeMessage();
		clearTimeout(msgTimeout);
		// Display the new message
		$(recentChat).show();
		$(recentChat).append(message);
		recentChat.scrollTop = recentChat.scrollHeight;
		// set a timer for message deletion
		msgTimeout = setTimeout(removeMessage, 4000);
	}
}

function renderMessage(imgURI,text) {
	var image = "<img style='width:25px' src='" + imgURI + "'>";
	// TODO Neater/more powerful alternative, give the paragraph a unique ID and access its properties with jquery or javascript
	var clipboard = "<i class='glyphicon glyphicon-copy' style='width:25px;cursor:pointer;' onclick='copyToClipboard(\""+text+"\")'></i>";
	var display = "<p>"+image+" "+clipboard+" "+text + "</p>";
	$(chatWindow).append(display);
	addRecentMessage(display);
	$(message).val('');
	chatWindow.scrollTop = chatWindow.scrollHeight;
}

// TODO currently hardcoded avatars
function getImageURL() {
	if($(user_type).text()=="Mentor")
		return "/img/mentor.png";
	else
		return "/img/ninja.png";
}

submit.onclick = function() {
	var msg = $(message).val();
	if (msg.length > 0) {
		// TODO calls getImageURL() twice, once to send, once to render on user's end?
		socket.emit('pm', {message: msg, name: getParameterByName('user'), url: getImageURL()});
		msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		renderMessage(getImageURL(),msg);
	}
	return false;
}

$(chatForm).submit(submit.onclick);

socket.on('pm', function(data) {
	// prevent html injection
	dataUrl = data.url.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	dataMessage = data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	renderMessage(dataUrl, dataMessage);
});


socket.on('screenshot', function(data) {
	// prevent html injection
	dataUrl = data.url.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	dataImage = data.image.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	var img = "<img style='width:25px;' src='"+dataUrl+"'>";
	var screenshot = "<img class= 'fancybox' style='width:25%;' src='"+dataImage+"'>";
	var input = "<p>"+img + screenshot + "</p>";
	$(chatWindow).append(input);
	addRecentMessage(input);
	chatWindow.scrollTop = chatWindow.scrollHeight;
    add_ZoomIn();
});

function sendScreenshot(){
    var canvas= document.getElementById("myCanvas");
    if (!canvas){
	 console.log(' Canvas Null!');
    }
	var image = canvas.toDataURL("img/png");
    
      // inform server to broadcast message
	socket.emit('screenshot', {image: image, name: getParameterByName('user'),url:"/img/mentor.png"});
	
      // append image to chat window
	var img = "<img style='width:25px;' src='/img/mentor.png'>";
	var snapshot= "<img style='width:30%;' class='fancybox' src='"+image+"'>";		
	var input = "<p>"+img+""+snapshot +"</p>";
	$(chatWindow).append(input);
	addRecentMessage(input);
	$(message).val('');
	chatWindow.scrollTop = chatWindow.scrollHeight;
    add_ZoomIn();
    var canvasZone= document.getElementById("canvasBtnZone");
	canvasZone.remove();
}

// Check the state of the chat overlay/log buttons to determine the height of the chat window
function correctOverlayHeight() {
	if ($(ovrBtn).attr("value")==="F") {
		if ($(logBtn).attr("value")==="F") {
			$(chatOverlay).css("height","15em");
			$(chatWindow).show();
			$(recentChat).hide();
			recentChat.innerHTML='';
		} else {
			$(chatOverlay).css("height","3em");
			$(chatWindow).hide();
			if (recentChat.innerHTML != '') $(recentChat).show();
		}
		$(message).focus();
	} else {
		$(chatOverlay).css("height","0");
		$(chatWindow).hide();
		if (recentChat.innerHTML != '') $(recentChat).show();
		$(message).blur();
	}
}
// show or hide the chat log
$(logBtn).click(function(){
	if ($(logBtn).attr("value")==="T") {
		setLogBtn(false);
	} else {
		setLogBtn(true);
	}
	correctOverlayHeight();
});
// show or hide the chat overlay
$(ovrBtn).click(function(){
	if ($(ovrBtn).attr("value")==="T") {
		setOvrBtn(false);
	} else {
		setOvrBtn(true);
	}
	correctOverlayHeight();
});

$(document).keydown(function(e) {
	if ($(ovrBtn).is(':visible')) {
		if (e.which == 13) {	// if enter
			if (!($('input').is(':focus') || $('button').is(':focus'))) {
				// if no inputs have focus, show the chat
				setOvrBtn(false);
				correctOverlayHeight();
			} else if ($(message).is(':focus') && $(message).val().length == 0) {
				// if message is empty, enter hides the chat
				setOvrBtn(true);
				correctOverlayHeight();
			}
		} else if (e.which == 27) {
			// esc hides the chat if message has focus
			if ($(message).is(':focus')) {
				setOvrBtn(true);
				correctOverlayHeight();
			} else {
				document.activeElement.blur();
			}
		}
	}

});
