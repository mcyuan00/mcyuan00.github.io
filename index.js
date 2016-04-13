$(document).ready(function() {  
  $.justwave({ showname: 0});
  
  $(document).click(function(event) {
    if (event.target.parentNode.id == "content" || event.target.parentNode.className == "transition"){
      event.target.innerHTML = "hit";
  	};
  });
//initializing single slide in slides 
var currentSlide = document.createElement("div");
currentSlide.style.width = "100%";
currentSlide.style.height = "100%";
document.getElementById('content').appendChild(currentSlide);
var slides = [currentSlide];

$('#newFormation').click(makeNewSlide);

function makeNewSlide(){
	if (slides.length > 0) {
        for (var i = 0; i < slides.length; ++i) {
          slides[i].style.display = "none";
        }
      };
      var div = document.createElement("div");
      div.style.width = "100%";
      div.style.height = "100%";
      document.getElementById('content').appendChild(div);
      slides.push(div);
      currentSlide = div;
}

   $('#newTransition').click(function(e){
     if (slides.length > 0) {
        for (var i = 0; i < slides.length; ++i) {
          slides[i].style.display = "none";
        }
      };
      var div = document.createElement("div");
      div.style.width = "100%";
      div.style.height = "100%";
      div.className = "transition";

      var previousFormation = currentSlide; //copy of previous formation
      var transition = previousFormation.cloneNode(true);
      transition.style.background = "red";
      transition.style.display = "block";
      div.appendChild(transition);

      var overlayTransition = document.createElement("div"); //for dragging and dropping
      overlayTransition.style.width = "100%";
      overlayTransition.style.height = "100%";
      overlayTransition.style.position = "absolute";
      overlayTransition.style.left = "0";
      overlayTransition.style.top = "0";
      overlayTransition.style.display = "block";
      div.appendChild(overlayTransition);

      var c = document.createElement("CANVAS"); //for arrows
      c.width  = "100%";
      c.height = "100%";
      c.style.zIndex   = 10;
      c.style.position = "absolute";
      div.appendChild(c);

      document.getElementById("content").appendChild(div);
      slides.push(div);
      currentSlide = div;
  });
});

var onClick = function () {
  var sidebar = document.querySelector('.sidebar');
  var body = document.querySelector('.body');
  var angle = document.querySelector('.angle');
  var classNames = document.querySelector('.sidebar').className;
  if(classNames.indexOf('maximized') > -1) {
    sidebar.className = 'sidebar';
    body.className = 'body minimized';
    angle.className = 'angle icon-double-angle-right';
    $('.tab-content').hide();
  } else {
    sidebar.className = 'sidebar maximized';
    body.className = 'body';
    angle.className = 'angle icon-double-angle-left';
    $('.tab-content').show();
  }
  return false;
};


var tabsFn = (function() {
  
  function init() {
    setHeight();
  }
  
  function setHeight() {
    var $tabPane = $('.tab-pane'),
        tabsHeight = $('.sidebar').height();
    
    $tabPane.css({
      height: tabsHeight,
    });
  }
    
  $(init);
})();
