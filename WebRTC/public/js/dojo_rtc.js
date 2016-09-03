//var room = 'default';
var room = 'waiting';
var lastPeer;

function setRoom(newRoom) {
	room = newRoom;
}

function showVolume(el, volume) {
		if (!el) return;
		if (volume < -45) volume = -45; // -45 to -20 is
		if (volume > -20) volume = -20; // a good range
		el.value = volume;
}

function webrtcInit(peerConnectionConfig, opts, video) {
	// Create the SimpleWebRTC object
	if (video) {
		var mediaOptions = {
			audio: true,
			video: true
		};
		var localVideoOptions = {
			muted: true,
			mirror: false,
			autoplay: true
		}
	} else {
		var mediaOptions = {
			audio: true,
			video: true  
		};
		var localVideoOptions = {
			muted: false,
			mirror: false,
			autoplay: true
		}
	}
	var webrtc = new SimpleWebRTC({
		// Holder for the local webcam
		localVideoEl: opts.localCamBox,
		remoteVideosEl: '',
		autoRequestMedia: false,
		debug: false,
		detectSpeakingEvents: true,
		autoAdjustMic: false,
		localVideo: localVideoOptions,
		media: mediaOptions,
		// Add the new peerConnectionConfig object
		peerConnectionConfig: peerConnectionConfig
	});
	
	webrtc.on('readyToCall', function() {
		if (room != 'waiting') {
			console.log('Ready to call');
			console.log('connecting to room: ' + room);
			webrtc.joinRoom(room);
		}
	});
	
	webrtc.on('videoAdded', function (video, peer) {
		var inType = peer.type;
		var container;
		if (inType == 'video') {
			container = opts.remoteCamBox;
		} else {
			container = opts.screenBox;
		}
		if (container) {
            
            if (inType != 'video') {
                // TODO what does embed-responsive-item do?
			    $(video).addClass("embed-responsive-item");
                lastPeer=webrtc.getDomId(peer);
                //newContainer.appendChild(video);
          //    }
		        //container.appendChild(newContainer);  
			    // TODO temporary workaround to avoid seeing duplicate video streams
		        $(container).empty();
            	container.appendChild(video);
                console.log('Add video');
                video.id="ninjaScreen";
                addCanvasZone();
                // TODO redundancy?
    			showFeedbackZone();
            }
            else{
            	// TODO what was the purpose of this container? Presumably to format the video?
                //var newContainer_remote = document.createElement('div');
			    // newContainer_remote.id = 'container_remote_' + webrtc.getDomId(peer);
			    $(video).addClass("embed-responsive-item");
			    video.id="mentorCam";
			    // newContainer_remote.appendChild(video);
			    // container.appendChild(newContainer_remote);
			    // TODO temporary workaround to avoid seeing duplicate video streams
		        $(container).empty();
			    container.appendChild(video);

                if ($.browser.mozilla) {
                    video.mozSrcObject = video.stream;
                }
            }
		}
	});
	
	webrtc.on('videoRemoved',function (video, peer) {
		var container;
		console.log('videoRemoved');
		console.log(video);
		if (peer) {
			var inType = peer.type;
			if (inType == 'video') {
				container = opts.remoteCamBox;
			} else {
                $('#editScreenshot').remove();
                var es=$('#editScreenshot');
                es = null;
				container = opts.screenBox;
			}
			if (container) {
                $(container).empty();
                hideFeedbackZone();
			}
		} else { // Thanks &yet for this silly case for local screen removal
			container = opts.screenBox;
			var screen = document.getElementById('localScreen');
			if (container && screen) {
				container.removeChild(screen);
				// TODO currently assumes this is the ninja screenshare crashing
                hideFeedbackZone();
			}
		}
	});

	webrtc.on('localScreenAdded', function(video) {
		if (opts.screenBox) {
			video.id = 'localScreen';
			opts.screenBox.appendChild(video);
			// scroll to bottom of page to see video, once video has loaded
			video.addEventListener('loadeddata', function() {
				$('html, body').animate({scrollTop: $(video).offset().top }, 'slow');
			}, false);
		}
	});
	
	webrtc.on('volumeChange', function (volume, treshold) {
		showVolume(document.getElementById('myVolume'), volume);
	});
	
	webrtc.on('remoteVolumeChange', function (peer, volume) {
		if (document.getElementById('ninjaVolume')) {
			showVolume(document.getElementById('ninjaVolume'), volume);
		}
	});
	
	return webrtc;
};
