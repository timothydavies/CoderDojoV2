//var request = require('request');
function addVideo(){
    var newContainer = document.createElement('div');
	newContainer.id = 'container_';
			//$(newContainer).addClass("video-box embed-responsive embed-responsive-4by3");
    $(newContainer).addClass("video-box");
    var video = document.createElement('video');
    video.src = 'testResource/1.mp4';
    video.autoplay = true;
	$(video).addClass("embed-responsive-item");
    
    newContainer.appendChild(video);
    var container=document.getElementById("screenBox");                
	container.appendChild(newContainer);      
            
    console.log('Add video!!!!!!!!!!!!!!!!!!!!!!!!!');
    video.id="ninjaScreen";
    addEditZone();
    showMentorFeedbackZone();
}
