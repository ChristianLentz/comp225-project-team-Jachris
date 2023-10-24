// $.fn.extend({
//     animateCss: function (animationName, callback) {
//         var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
//         $(this).addClass('animated ' + animationName).one(animationEnd, function() {
//             $(this).removeClass('animated ' + animationName);
//             callback.call();
//         });
//     }
// });

// $('.card').bind('click', function() {
//   //$('.section').show().animateCss('zoomIn');
//   $overlay = $(this).clone();
//   $overlay.css({
//     position: 'absolute',
//     top: $(this).position().top,
//     left: $(this).position().left,
//     width: $(this).width(),
//     height: $(this).height()
//   });
//   $overlay.appendTo( 'body' );
//   $overlay.animate({
//     top: 0,
//     left: 0,
//     width: $(window).width(),
//     height: $(window).height()
//   }, 150, 'linear');
//   $overlay.bind('click', function(){ $(this).remove(); });
// });
// $('.section').bind('click', function() {
//   $('.section').animateCss('zoomOut', function(){ $('.section').hide(); });
// });

onload = function(){
  document.querySelector(".flipdiv.v").onclick = flipdivClicked;
};
function flipdivClicked(e) {
  if (/\bshowBack\b/.test(this.className)) {
    this.className = this.className.replace(/ ?\bshowBack\b/g, "");
  }
  else {
    this.className += " showBack";
  }
}