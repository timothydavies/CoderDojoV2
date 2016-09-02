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
// TODO this function's bools are hardcoded?
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
when the session is finished, hide feedback zone and reset pointing icons position and the checkbox
**********************************************
*/
function hideFeedbackZone(){
    $('.feedback-options').css('display','none');

    $('.point-icon').css({
        "display":"none",
        "top":"100%",
        "left":"-1em",
    });
    $('.icon-btn').prop('checked',false);
}

function showFeedbackZone(){
    $('.feedback-options').css('display','block');
    // TODO redundant?
    $('.point-icon').css({
        "display":"none",
        "top":"100%",
        "left":"-1em",
    });
    $('.icon-btn').prop('checked',false);
}

