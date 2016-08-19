
var opts = {localCamBox:null, screenBox:null};
opts.localCamBox = document.getElementById("localCamBox");
opts.screenBox = document.getElementById("screenBox");

var helpQueue = document.getElementById("helpQueue");
var nameField = document.getElementById("nameField");

var firstPhase = document.getElementById("firstPhase");
var firstPhaseText = document.getElementById("firstPhaseText");

var fullScreenButton = document.getElementById("screenFull");

var mentorAvatar = document.getElementById("mentorAvatar");

var socket = io();
var webrtc;

$(firstPhase).show();
$('.secondPhase').hide();
$('#collapseTwo').hide();
checkNotification();

signOut.onclick = function() {
	jQuery.post('/sign_out', {}, function() {
		window.close();
	});
}

// TODO apply to ninja as well, on webcam and screenshare. Ideally, the toolbar will still be useable, allowing cursor, text chat, and screenshots
fullScreenButton.onclick = function() {
	var myVideo = opts.screenBox.getElementsByTagName('video');
	if (myVideo) {
		console.log(myVideo);
		var elem = myVideo[0];
		if (elem.requestFullscreen) {
		  elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
		  elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
		  elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
		  elem.webkitRequestFullscreen();
		}
	}
}

/*
	This function renders the ninja queue that this mentor is handling.
	At the moment, this is a simple array of names. This should change in a future iteration to include ids for those ninjas for guaranteed unique identification
*/
function renderBody(queue) {
	var div = helpQueue;
	// TODO jquery.empty() faster?
	div.innerHTML = '';
	if (queue) {
		$(firstPhaseText).text("There are " + queue.length + " ninjas waiting for help");
		queue.forEach(function(entry) {
			var b = document.createElement("div");
			$(b).addClass("btn btn-default btn-block input-sm");
			$(b).text(entry.name);
			b.onclick = function() {
				socket.emit('answerRequest', {ninja: entry});
				$(firstPhase).hide();
				$('.secondPhase').show();
				// TODO redundant?
          		$('#takescreenShot').attr('disabled',false);
			}
			div.appendChild(b);
            notifyMe();
		});
	}
}

/* 	Function to handle new queue data.
	The argument should be an object with the entire new queue located in the data.queue field 
*/
function handleQueueUpdate(data) {
	console.log(data);
	renderBody(data.queue);
}

/*	Function to handle the changing of room.
	The data should include fields defining the name of the room and the name of ninja who will be joining 
*/
function handleRoomChange_M(data) {
	console.log('Changing to room: ' + data.room);
	setRoom(data.room);
	$('#ninjaName').text(data.ninja);
	// TODO remove redunancy, emptied multiple times to prevent bugs!
	$(opts.localCamBox).empty();
	$(opts.screenBox).empty();
	$(chatWindow).empty();
	
	webrtc.startLocalVideo();
}

/*
	Function to handle the receiving of ice server info.
	This the data packet should be exactly what is returned by xirsys concerning ICE connection details. Hence, all the data will be in the data.d field.
*/
function handleIceServers_M(data) {
	//console.log(data);
	//console.log(data.d);
	webrtc = webrtcInit(data.d, opts, true);
	//console.log(webrtc);
}

/*
	This function should handle the event of the ninja disconnecting from the system during a session.
*/
function handleNinjaDisconnect(data) {
	webrtc.leaveRoom();
	webrtc.stopLocalVideo();

	// TODO remove redunancy, emptied multiple times to prevent bugs!
	$(opts.localCamBox).empty();
	$(opts.screenBox).empty();
	$(chatWindow).empty();

	alert("The ninja you were communicating with left");
	hideFeedbackZone();
	$('.secondPhase').hide();
	$(firstPhase).show();
}

function handleBadAvatar(){
	mentorAvatar.onerror = "";
	mentorAvatar.src= "/img/mentor.png";
	return true;
}

document.onunload = function(){
	if (webrtc) {
		webrtc.stopLocalVideo();
		webrtc.leaveRoom();
		webrtc.connection.disconnect();
		webrtc = null;
	}
}


socket.on('queueUpdate', handleQueueUpdate);
socket.on('changeRoom', handleRoomChange_M);
socket.on('iceServers', handleIceServers_M);
socket.on('otherDisconnect', handleNinjaDisconnect);
socket.on('test_addVideo', addVideo);
socket.on('test_highlight', highlight);



$.ajax({
	dataType: "json",
	error: function(jqXHR, textStatus, errorThrow) {
		//TODO terrible error message
		alert('AHHHH');
	},
	success: function(data, textStatus, jqXHR) {
		$(nameField).text(data.firstName);
		socket.emit('iceRequest',{mentor : data.firstName});
	},
	type: "GET",
	url: "/users/signed_in"
});


//$('#collapseTwo').collapse('hide');
//socket.emit('iceRequest', {mentor : getParameterByName('user')});
/*
mentorAvatar.onclick = function(){
    addVideo();
}
*/