var chatPanel = document.getElementById("chatPanel");
var avatarBox = document.getElementById("imgAvatar");
var nameField = document.getElementById("ninjaName");
var mentorField = document.getElementById("mentorName");

var firstPhase = document.getElementById("chatFirstPhase");
var secondPhase = document.getElementById("chatSecondPhase");
var thirdPhase = document.getElementById("chatThirdPhase");
var ninjaTextChat = document.getElementById("ninjaTextChat");

var opts = {};
opts.localCamBox = document.getElementById("localCamBox");
opts.remoteCamBox = document.getElementById("remoteCamBox");
opts.screenBox = document.getElementById("localScreenBox");

var firstPhaseButton = document.getElementById("firstPhaseButton");
var firstPhaseText = document.getElementById("firstPhaseText");

var secondPhaseButton = document.getElementById("secondPhaseButton");
var shareButton = document.getElementById("shareButton");
var finishButton = document.getElementById("finishButton");

var socket = io();
var webrtc;
var tempRoom;

var lastWidth= $(window).width();
var lastHeight= $(window).height();

/*
	Function to handle the receiving of ice server info.
	This the data packet should be exactly what is returned by xirsys concerning ICE connection details. Hence, all the data will be in the data.d field.
*/

function handleIceServers_N(data) {
	console.log(data);
	console.log(data.d);
	webrtc = webrtcInit(data.d, opts);
}

function firstPhaseClick() {
	// TODO this is where to add any extra queue information on the ninja, unless that goes on the mentor side when building the queue
	socket.emit('requestHelp', {ninja: getParameterByName('user')});
	$(firstPhaseButton).hide();
	$(firstPhaseText).text('You are waiting in queue to be helped');
}

/*	Function to handle the changing of room.
	The data should include fields defining the name of the room and the name of ninja who will be joining 
*/
function handleRoomChange_N (data) {
	// TODO redundant?
	webrtc.leaveRoom();	
	console.log('Changing to room: ' + data.room);
	tempRoom = data.room;
	$(mentorField).text(data.mentor);
	$(firstPhase).hide();
	// TODO remove redunancy, emptied multiple times to prevent bugs! Didn't even work.
	$(opts.localCamBox).empty();
	$(opts.remoteCamBox).empty();
	$(opts.screenBox).empty();
	$(chatWindow).empty();

	$(secondPhase).show();
	$(ninjaTextChat).show();

	webrtc.startLocalVideo();
}

function shareButtonClick() {
	// TODO is hidefeedbackzone here just to reset follower icon position?
	hideFeedbackZone();
	if ($(shareButton).text()=='Change Shared Window'){
        webrtc.stopScreenShare();
    }
	$(shareButton).text('Change Shared Window')
    
    console.log("click button");
    // TODO is this what happens if the browser isn't given permission to share? Could give an error message here and retry
	webrtc.shareScreen(function (err) {
		if (err) {
			console.log('Share Screen Error: ',err);
			$(shareButton).text('Share Window');
		} else {
    		showFeedbackZone();
		}
	});
}

function secondPhaseClick() {
	$(firstPhase).hide();
	$(secondPhase).hide();
	$(shareButton).text('Share Window');
	$(thirdPhase).show();
	room = tempRoom;
	webrtc.testReadiness();
}

function resetToFirstPhase() {
	webrtc.stopLocalVideo();
	webrtc.stopScreenShare();
	webrtc.leaveRoom();
	// TODO remove redunancy, emptied multiple times to prevent bugs!
	$(opts.localCamBox).empty();
	$(opts.remoteCamBox).empty();
	$(opts.screenBox).empty();
	$(chatWindow).empty();
	
	hideFeedbackZone();
	$(secondPhase).hide();
	$(thirdPhase).hide();
	$(firstPhase).show();
	$(firstPhaseButton).show();
	$(ninjaTextChat).hide();
	$(firstPhaseText).text("To chat with the mentor, click on 'Chat' button");

	// FIXME TODO patch for current bug, reload page on hitting finished. Ensure ninja's name is reloaded from the server
	window.location.reload();
}

function handleMentorDisconnect (data) {
	// FIXME TODO Mentor's webcam is STILL STREAMING
	webrtc.leaveRoom();
	webrtc.stopLocalVideo();
	webrtc.stopScreenShare();
	alert("Oops! Some rogue ninja seems to have messed with something and disconnected your mentor.");
	resetToFirstPhase();
}

function finishChatClick() {
	resetToFirstPhase();
	socket.emit('leaving', {});
}

window.onbeforeunload = function(){
	if (webrtc) {
		webrtc.stopLocalVideo();
		webrtc.leaveRoom();
		webrtc.connection.disconnect();
		webrtc = null;
	}
}

// TODO rework these functions
function resizeWindow(width, height) {
	// Find current position of follower
	var arrowOldX = $('.follower').first().offset().left - $('#localScreen').offset().left;
	var arrowOldY = $('.follower').first().offset().top - $('#localScreen').offset().top;
	var rx = arrowOldX * 1.0 / $('#localScreen').width();
	var ry = arrowOldY * 1.0 / $('#localScreen').height();

	window.resizeTo(width, height);
	// window.scrollTo(0,document.body.scrollHeight);
	updatePosition(rx,ry);
}

// TODO resizeScreenshare(ratio)
function resizeScreenshare() {
	var localScreen = document.getElementById("localScreen");
	var localScreenBox = document.getElementById("localScreenBox");
	var iconPosRef = document.getElementById("iconPosReference");

    // allow video to double in size, and shift it left 50%, so as to hide half the screen.
	localScreen.style.maxWidth = "200%";
	var dist = localScreen.clientWidth / 2;

	localScreen.style.left = - dist + "px";
	iconPosRef.style.left = - dist + "px";
	localScreenBox.style.left = dist + "px";

	$('html, body').animate({scrollTop: $(localScreen).offset().top }, 'slow');
}

$('#enlargeButton').on('click',function(){
	// Move window to far left of screen
    window.moveTo(0,0);
	// Make window fill half the screen
	var w = Math.max(screen.width / 2,window.outerWidth);
	// TODO screen.availHeight seemingly doesn't work for linux.
	var h = screen.availHeight;

    resizeWindow(w,h);
    // TODO find appropriate wait time to resize window.
    window.setTimeout(resizeScreenshare,50);
});

$('#shrinkButton').on('click',function(){
	var w = Math.min(320, window.outerWidth);
	var h = window.outerHeight;

	var localScreen = document.getElementById("localScreen");
	var localscreenbox = document.getElementById("localScreenBox");
	var iconPosRef = document.getElementById("iconPosReference");
	
	localScreen.style.maxWidth = "100%";
	document.getElementById("localScreen").style.width = "auto";

	localScreen.style.left = "0";
	iconPosRef.style.left = "0";
	localScreenBox.style.left = "0";

    resizeWindow(w,h);
	// Move window to far left of screen
    window.moveTo(0,0);
});

// Expand screenshot
$('#chatWindow').on('click','img.fancybox',function(){
	lastWidth = $(window).width();
	lastHeight = $(window).height();
	var largeWidth = Math.max(lastWidth,900);
	var largeWidth = screen.availHeight;
    resizeWindow(largeWidth,largeHeight);
});

// Close screenshot
$('body').on('click','#fancybox-close',function(){
    resizeWindow(lastWidth,lastHeight);
});

$('#ninjaBroadcast').on('click',function(){
    var url = "Broadcast";
			 var w = window.open(url, "_blank", "status=no, menubar=yes, titlebar=yes, toolbar=yes, location=no, width=500, height=620, scrollbars=yes", false);
             
			return w?false:true;
});

/*
	Function to hide or show arrow to reflect the mentor's setting
	TODO make disabled checkbox look different
*/
function toggleArrow(data) {
    $('.point-icon').toggle(data.showArrow);
    $('.icon-btn').prop("checked",data.showArrow);
    console.log("Mentor toggled arrow " + data);
}

socket.on('iceServers', handleIceServers_N);
firstPhaseButton.onclick = firstPhaseClick;
socket.on('changeRoom', handleRoomChange_N);
shareButton.onclick = shareButtonClick;
secondPhaseButton.onclick = secondPhaseClick;
socket.on('otherDisconnect', handleMentorDisconnect);
finishButton.onclick = finishChatClick;
socket.on('RTPointing', moveFollower);
socket.on('test_addVideo', addVideo);
socket.on('toggleArrow', toggleArrow);

$.ajax({
	dataType: "json",
	error: function(jqXHR, textStatus, errorThrow) {
		alert(textStatus);
	},
	success: function(data, textStatus, jqXHR) {
		$(nameField).text(data.pseudonym);
		socket.emit('iceRequest',{ninja : data.pseudonym});
	},
	type: "GET",
	url: "/users/signed_in"
});


//$('#collapseTwo').collapse("hide");
//socket.emit('iceRequest', {ninja : getParameterByName('user')});

//Change of Socket


var toBroadcast = document.getElementById('toBroadcast');

if (toBroadcast) toBroadcast.onclick = toBroadcastClick;

function toBroadcastClick(){  
    socket.emit('sendUserIdentity',{client:'ninja'});
}
$(firstPhase).show();

$(nameField).text(getParameterByName('user'));


