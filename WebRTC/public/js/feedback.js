
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
 
 
 $("#fancybox-img").load(function() {
  // Handler for .load() called.
    var ratio=$('img.fancybox').width()/$('img.fancybox').height();
    var ZoomInHeight=500;
    var ZoomInWidth=ZoomInHeight*ratio;
     $("#fancybox-img").css({
                             'width':ZoomInWidth,
                             'height':ZoomInHeight,
                             'speedIn':'300',
                             'speedOut':'300'});
     alert("fancybox loaded!");
 });
 
 
 $(document).bind('DOMNodeInserted', function(e) {     
    if (e.target.id == 'fancybox-img') {
/*        alert("fancybox loaded!");
       //element with #someID was inserted.
       var ratio=$('img.fancybox').width()/$('img.fancybox').height();
    var ZoomInHeight=500;
    var ZoomInWidth=ZoomInHeight*ratio;
     $("#fancybox-img").css({
                             'width':ZoomInWidth,
                             'height':ZoomInHeight,
                             'speedIn':'300',
                             'speedOut':'300'});*/
    
    }
});