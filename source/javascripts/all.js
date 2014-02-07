(function(e){"use strict";e.jribbble={};var t=function(t,s){e.ajax({type:"GET",url:"http://api.dribbble.com"+t,data:s[1]||{},dataType:"jsonp",success:function(e){e===undefined?s[0]({error:!0}):s[0](e)}})},s={getShotById:"/shots/$/",getReboundsOfShot:"/shots/$/rebounds/",getShotsByList:"/shots/$/",getShotsByPlayerId:"/players/$/shots/",getShotsThatPlayerFollows:"/players/$/shots/following/",getPlayerById:"/players/$/",getPlayerFollowers:"/players/$/followers/",getPlayerFollowing:"/players/$/following/",getPlayerDraftees:"/players/$/draftees/",getCommentsOfShot:"/shots/$/comments/",getShotsThatPlayerLikes:"/players/$/shots/likes/"},o=function(e){return function(){var s=[].slice.call(arguments),o=e.replace("$",s.shift());t(o,s)}};for(var r in s)e.jribbble[r]=o(s[r])})(jQuery,window,document);

$(document).bind('keydown',function(e){
  if (e.keyCode == 37) { 
    location.href = $('.arrows-left').attr('href');
  }
  else if (e.keyCode == 39) { 
    location.href = $('.arrows-right').attr('href');
  }
});

/*!
 * Play GIF
 * 
 * by Jesse Young
 *
 * a jQuery plugin to play GIF animations on mouseover (or any other event).
 * 
 * Examples:
 *    $('img[src$=".gif"]').playGIF();             // default is mouseover
 *    $('img[src$=".gif"]').playGIF({on:'click'}); // play animation on click
 */


;var PLAYGIF_DISABLE_FLAG;
(function($) {

  $.fn.playGIF = function(options) {
    var settings = $.extend({
      'on': 'mouseenter',  // event to play animation
      'off': 'mouseleave',  // event to stop animation
      'autoResize': false,  // canvas dimensions adapt to container
      'enable': true,
      'circleColor': '22B573',
      'removeAnchor': true // sometimes writers link the GIF to itself, causing it to open in a new window.
    }, options);

    // Look for flag in global scope
    if (typeof PLAYGIF_DISABLE_FLAG !== 'undefined') {
      settings.enable = !PLAYGIF_DISABLE_FLAG;
    }

    // Draw "GIF" circle on top of image
    var drawGIFOverlay = function(context, x, y) {
      x = Math.floor(x);
      y = Math.floor(y);
      // circle
      var radius = 35;
      context.fillStyle = '#' + settings.circleColor;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI*2, true);
      context.closePath();
      context.fill();

      // text
      context.fillStyle = '#ffffff';
      context.font = "15px 'Open Sans'";
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText("PLAY", x, y);
    };

    return this.each(function() {
      if (settings.enable === false) { return }

      var $gif = $(this);

      // Skip if it's not a GIF
      if (!$gif.is('img') || !/\.gif$/i.test($gif.attr('src')) ) { return true; }
      var canvas = document.createElement('canvas');
      if (typeof canvas.getContext === "undefined") { return true; } // THIS CHECK TO PREVENT IE 8 FROM EXPLODING
      var context = canvas.getContext('2d');
      var img = new Image();

      var start_animation = function(a, b) {
        b.on(settings.off, function() { stop_animation(a, b); });

        // Hackery to make GIFs play from the beginning everytime.
        // Momentarily replace the src with a blank 1x1 GIF, then set it back
        // to the original src.
        var src = b.attr('src');
        b.attr('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
        b.css({width:a.attr('width'), height:a.attr('height')});
        setTimeout(function() { b.attr('src', src); }, 0);

        a.replaceWith(b);
      };

      var stop_animation = function(a, b) {
        a.on(settings.on, function() { start_animation(a, b); });
        b.replaceWith(a);
      };

      img.onload = function() {
        var width = $gif.width();
        var height = $gif.height();
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);

        // Replace GIF w/ static canvas image
        var $canvas = $(canvas);

        // Wrap $canvas in a parent container so it can inherit the dynamic width dimension
        if (settings.autoResize === true) {
          canvas.setAttribute('data-src', $gif.attr('src'));
          canvas.setAttribute('class', 'gif');
          var $faux = $('<span class="faux-image">');
          $faux.css({
            'float':$gif.css('float'),
            'margin':$gif.css('margin'),
            'padding':$gif.css('padding'),
            'max-width':'100%',
            'position':'relative',
            'display':'block',
            'height':canvas.height
          });

          $canvas.css({'position':'absolute', 'top':0, 'left':0});

          // Wrap canvas in container
          $canvas = $faux.append($canvas);
        } else {
          // Inherit properties of GIF
          $canvas.css({
            'float':$gif.css('float'),
            'margin':$gif.css('margin'),
            'padding':$gif.css('padding'),
            'display':$gif.css('display')
          });
        }

        // Replace GIF w/ static canvas
        $gif.replaceWith($canvas);

        // Sometimes the containing element fixed dimensions and cut off
        // portions of the GIF. In this case, use the parent's dimensions
        // to center the circle overlay.
        var $parent = $canvas.parent();
        if (!$parent.is("p") &&
            ($parent.css('max-width') !== 'none' || $parent.css('max-height') !== 'none')) {
          width = $parent.width();
          height = $parent.height();
        }

        if (settings.removeAnchor) {
          if ($parent.is('a') && /\.gif$/i.test($parent.attr('href')) ) {
            $parent.replaceWith($canvas);
          }
        }

        // Show GIF overlay if dimensions are greater than 150x150
        if (width > 150 && height > 150) {
          drawGIFOverlay(context, width/2, height/2);
        }

        // Attach event to canvas
        $canvas.on(settings.on, function() { start_animation($canvas, $gif); });
      }
      
      img.src = $gif.attr('src');
    });
  }
})(jQuery)