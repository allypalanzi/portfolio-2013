$(document).bind('keydown',function(e){
  if (e.keyCode == 37) { 
    location.href = $('.arrows-left').attr('href');
  }
  else if (e.keyCode == 39) { 
    location.href = $('.arrows-right').attr('href');
  }
});