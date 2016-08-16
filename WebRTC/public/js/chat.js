var chatWindow = document.getElementById("chatWindow");
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

setLogBtn(false);
setOvrBtn(true);

// TODO screenshots to chat window
function renderMessage(imgURI,text) {
	var image = "<img style='width:25px' src='" + imgURI + "'>";
	var display = "<p>"+image+text + "</p>";
	$(chatWindow).append(display);
	$(message).val('');
	// TODO sets chat log scroll bar to the bottom?
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
		// TODO calls getImageURL() twice, once to send, once to render on user's end
		socket.emit('pm', {message: msg, name: getParameterByName('user'), url: getImageURL()});
		renderMessage(getImageURL(),msg);
	}
	return false;
}

$(chatForm).submit(submit.onclick);

socket.on('pm', function(data) {
	renderMessage(data.url, data.message);
});


socket.on('screenshot', function(data) {
	var img = "<img style='width:25px;' src='"+data.url+"'>";
	var screenshot = "<img class= 'fancybox' style='width:25%;' src='"+data.image+"'>";
	var input = "<p>"+img + screenshot + "</p>";
	$(chatWindow).append(input);
	chatWindow.scrollTop = chatWindow.scrollHeight;
    add_ZoomIn();
});

// Check the state of the chat overlay/log buttons to determine the height of the chat window
function correctOverlayHeight() {
	if ($(ovrBtn).attr("value")==="F") {
		if ($(logBtn).attr("value")==="F") {
			$(chatOverlay).css("height","250px");
		} else {
			$(chatOverlay).css("height","100px");
		}
	} else {
		$(chatOverlay).css("height","0");
	}
}
// show or hide the chat log
$(logBtn).click(function(){
	if ($(logBtn).attr("value")==="T") {
		$(chatWindow).show();
		setLogBtn(false);
	} else {
		$(chatWindow).hide();
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
