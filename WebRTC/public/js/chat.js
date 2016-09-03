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
var msgId = 0;

setLogBtn(false);
setOvrBtn(true);

// Resume deleting recent messages if the input box loses focus
$(message).focusout(function(){
	clearTimeout(msgTimeout);
	msgTimeout = setTimeout(messageTimeout, 8000);
});

// Removes the oldest message from recent chat
function removeMessage() {
	var msgs = recentChat.innerHTML;
	// Delete oldest message if input box is not focused and history is not empty
	msgs = msgs.replace(/<p((.|\n)*?)<\/p>/m,'');
	recentChat.innerHTML = msgs;
	if (msgs == '') $(recentChat).hide();
}

function messageTimeout() {
	clearTimeout(msgTimeout);
	var msgs = recentChat.innerHTML;
	// Delete oldest message if input box is not focused and history is not empty
	if (!($(message).is(':focus') || msgs == '')) {
		removeMessage();
		msgTimeout = setTimeout(messageTimeout, 2000);
	}
}

function addRecentMessage(message) {
	clearTimeout(msgTimeout);
	// Add only if recentchat is to be displayed
	if (!$(chatWindow).is(':visible') || $(chatOverlay).height() == 0) {
		// If overflowing, remove last message
		if(recentChat.scrollHeight > $(recentChat).height()) removeMessage();
		// Display the new message
		$(recentChat).show();
		$(recentChat).append(message);
		recentChat.scrollTop = recentChat.scrollHeight;
		// set a timer for message deletion
		msgTimeout = setTimeout(messageTimeout, 8000);
	}
}

// adapted from http://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
function copyToClipboard(curId) {
	var text = document.getElementById('msgT' + curId).innerHTML;
	// Create hidden textarea to copy from
    var textarea = document.createElement("textarea");
    textarea.style.position = "fixed";
    textarea.style.left="-9999px";
    textarea.style.top="0";
    document.body.appendChild(textarea);
    textarea.textContent = text;
    // Focus the text to copy
    textarea.select();
    // Copy selection
    var succeed;
    try {
    	succeed = document.execCommand("copy");
    } catch(e) {
    	succeed = false;
    }
    document.body.removeChild(textarea);
}

function renderMessage(imgURI,text) {
	var avatar = new Image;
	avatar.src = imgURI;
	$(avatar).css("width","25px")
	// TODO avoid duplicating text
	var clipboard = document.createElement('span');
	$(clipboard).addClass("glyphicon glyphicon-copy");
	$(clipboard).css({
		"font-size": "large",
		"cursor": "pointer",
		"padding": "0 0.5em 0 0.5em"
	});

	var curId = msgId;
	clipboard.addEventListener('click', function(event) {
  		copyToClipboard(curId);
  		$(message).focus();
	});

	var input = document.createElement("p");
	var inputText = document.createElement("span");
	inputText.innerHTML = text;
	input.id = "msgP" + curId;
	inputText.id = "msgT" + curId;
	$(input).append(avatar);
	$(input).append(clipboard);
	$(input).append(inputText);
	$(chatWindow).append(input);

	var tmpInput = $(input).clone(true, true);
	$(tmpInput).prop("id","tmpMsgP" + curId)
	$(tmpInput).find("#msgT" + curId).prop("id","tmpMsgP" + curId);
	// TODO make addRecentMessage and chatwindow each call this function to avoid this kind of messy code duplication
	$(tmpInput).find(".glyphicon-copy")[0].addEventListener('click', function(event) {
  		copyToClipboard(curId);
  		if($(chatOverlay).height() != 0) $(message).focus();
	});
	addRecentMessage(tmpInput);
	chatWindow.scrollTop = chatWindow.scrollHeight;
	msgId = msgId + 1;
}

// TODO currently hardcoded avatars
function getImageURL() {
	if($(user_type).text()=="Mentor")
		return "/img/mentor.png";
	else
		return "/img/ninja.png";
}

function submitMessage() {
	var msg = $(message).val();
	if (msg.length > 0) {
		msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		socket.emit('pm', {message: msg, name: getParameterByName('user'), url: getImageURL()});
		renderMessage(getImageURL(),msg);
		$(message).val('');
		correctOverlayHeight();
	}
}

submit.onclick = submitMessage;

socket.on('pm', function(data) {
	renderMessage(data.url, data.message);
});


socket.on('screenshot', function(data) {
	var avatar = new Image;
	avatar.src = data.url;
	$(avatar).css("width","25px")

	var screenshot = new Image;
	screenshot.src = data.image;
	// TODO replace fancybox with a clickable (but not dragable) image, expanding within the chat window when clicked.
	$(screenshot).addClass("fancybox");
	$(screenshot).css("width", "25%");

	var input = document.createElement("p");
	$(input).append(avatar);
	$(input).append(screenshot);

	$(chatWindow).append(input);
	addRecentMessage($(input).clone(true));
	chatWindow.scrollTop = chatWindow.scrollHeight;
    add_ZoomIn();
});

function sendScreenshot(){
    var canvas= document.getElementById("myCanvas");
    if (!canvas){
		console.log(' Canvas Null!');
		return;
	}
	// TODO screenshot quality bug test, seems to work
	// TODO use low quality as thumbnail, high quality as expanded image?
	// var image = canvas.toDataURL("img/png");
    var image = canvas.toDataURL("image/jpeg", 0.5);

    // inform server to broadcast message
	socket.emit('screenshot', {image: image, name: getParameterByName('user'),url:"/img/mentor.png"});
	
    // append image to chat window
    var avatar = new Image;
    avatar.src = '/img/mentor.png';
    $(avatar).css("width", "25px");
	var screenshot = new Image;
	screenshot.src = image;
	$(screenshot).css("width", "30%");
	// TODO replace fancybox with a clickable (but not dragable) image, expanding within the chat window when clicked.
	$(screenshot).addClass("fancybox");

	var input = document.createElement("p");
	$(input).append(avatar);
	$(input).append(screenshot);
	
	$(chatWindow).append(input);
	addRecentMessage($(input).clone(true));
	chatWindow.scrollTop = chatWindow.scrollHeight;
    
    add_ZoomIn();
    var canvasZone = document.getElementById("canvasBtnZone");
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
			$(chatOverlay).css("height","4em");
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

// Resize message box to match content
function resizeMessage() {
	var h1 = $(message).height();
	$(message).height(0);
	$(message).height(message.scrollHeight);
	var h2 = $(message).height();
	var ho = $(chatOverlay).height() + h2 - h1;
	if (h1 != h2 && ho > 50) {
		$(chatOverlay).height(ho);
	}

}

$(message).keyup(function() {
	resizeMessage();
});

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

// TODO clean this function
$(document).keydown(function(e) {
	if ($(ovrBtn).is(':visible')) {
		if (e.which == 13) {	// if enter
			if (!e.shiftKey && !e.ctrlKey && $(message).is(':focus') && $(message).val().length != 0) {
				// if just the enter key was pressed, send the message
				submitMessage();
				return false;
			} else if ($(message).is(':focus') && $(message).val().length == 0) {
				// if message is empty, enter hides the chat
				setOvrBtn(true);
				correctOverlayHeight();
				return false;
			} else if (!($('input').is(':focus') || $(message).is(':focus') || $('button').is(':focus')) || $('#log').is(':focus')) {
				// if no inputs have focus, show the chat
				setOvrBtn(false);
				correctOverlayHeight();
				message.select();
				return false;
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
