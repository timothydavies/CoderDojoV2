/*
******************************************************************************************
This file is for general feedback including: 
  bind fancybox features to sent screenshot in chat window (zoom-in feature)
  when the session is finished, hide feedback zone and reset pointing icons position
******************************************************************************************
*/

/*
*********************************************
bind fancybox features to sent screenshot in chat window (zoom-in feature)
this is mainly completed by fancybox built-in functions
**********************************************
*/
 function add_ZoomIn(){
        var addToAll = false;
        var gallery = false;
        var titlePosition = 'inside';
        $(addToAll ? 'img' : 'img.fancybox').each(function(){
            var $this = $(this);
            var title = $this.attr('title');
            var src = $this.attr('data-big') || $this.attr('src');
            var a = $('<a href="#" class="fancybox"></a>').attr('href', src).attr('title', title);
            $this.wrap(a);
        });
        if (gallery)
            $('a.fancybox').attr('rel', 'fancyboxgallery');
        $('a.fancybox').fancybox({
            titlePosition: titlePosition,
            type: 'image'
        });
 }
 
/*
*********************************************
when the session is finished, hide feedback zone and reset pointing icons position
**********************************************
*/
function hideFeedbackZone(){
    if ($('div.feedback-options').css('display')!= "none"){
        $('div.feedback-options').insertAfter('.afterscreen');
        $('div.feedback-options').css('display','none');
        $('.point-icon').css('display','none');
        reset_x = $('.point-icon-div').off().left + "px";
	    reset_y = 1.1*$('.point-icon-div').off().top +"px";
        $('.follower').css({
            "top":reset_y,
            "left":reset_x,
            });
        $('.point-icon').css('margin-top','1em');
    }
     
} 

function showMentorFeedbackZone(){
    $('div#Mentor-feedback-options').insertAfter('#CanvasZone');
    $('div#Mentor-feedback-options').css('display','block');
    reset_x = $('.point-icon-div').off().left;
	reset_y = $('.point-icon-div').off().top + 20;
    $('.handler').css({
        "top":reset_y + "px",
        "left":reset_x + "px",
        });          
}

/*
******************************************************************************************
display corresponding icon by selected radio button value
******************************************************************************************
*/
$('.icon-btn').click(function(){
    $('.point-icon').css("display","none");
    var choice = $(this).attr('value');
    $('#follower-'+choice).css("display","block");
    $('#handler-'+choice).css("display","block");
});