$(document).ready(function() {  
  var wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#7addcd',
      progressColor: '#459cb6', 
      pixelRatio: 1,
      height: 75,
      fillParent: true,
      barWidth:2
  });
  wavesurfer.load('./Roses.mp3');
  

  var playButton = document.getElementById("play");
  playButton.onclick=function(){
    wavesurfer.playPause();
  }

  $("#form_part1").submit(function(e){
    var dancer = document.forms["form_part1"]["dancer_name"].value;
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.innerHTML = dancer;
    tr.appendChild(td);

    var table = document.getElementById("dancer_table");
    table.appendChild(tr);
    $("#new_dancer_modal").modal('hide');
    return false;
  });

  var slides = [], currentSlide = null; slideNum = 0, x = 0, y = 0;
  var visible = [], currentPlotted = [];

  var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element
    x_pos_original = 0, y_pos_original = 0; //position to return to if out of bounds

  if(currentSlide === null){
    var div = document.getElementById("content");
    div.style.backgroundColor = "d3d3d3";
  }


// Will be called when user starts dragging an element
function _drag_init(elem) {
    // Store the object of the element which needs to be moved
    selected = elem;
    selected.style.zIndex = 25;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
    x_pos_original = selected.style.left;
    y_pos_original = selected.style.top;
}

// Will be called when user dragging an element
function _move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
    }
}

var wasDragged = false;

// Destroy the object when we are done
function _destroy() {
    if( selected !== null ){
      selected.style.zIndex = "initial";
      selected_left = parseInt(selected.style.left, 10);
      selected_width = parseInt(selected.style.width, 10);
      selected_top = parseInt(selected.style.top, 10);
      if( selected_left < selected_width/2 ||
          selected_left > $('#content').width() - selected_width/2 ||
          selected_top < selected_width/2 ||
          selected_top > $('#content').height() - selected_width/2) {
        selected.style.left = x_pos_original;
        selected.style.top = y_pos_original;
        wasDragged = true;
      } else if (selected.style.left !== x_pos_original || selected.style.top !== y_pos_original) {
        wasDragged = true;
      } else {
        wasDragged = false;
      }
    }
    selected = null;
}
var canvases = [];
var targetPairs = [];
var fromPlotted = [];
var doNotMove = null;
// Bind the functions...
document.onmousedown = function (e) {
    if ((e.target.className == "placed" || e.target.className == "emptyDancer") && e.target.parentNode.parentNode.className == "transition") {
      doNotMove = e.target;
      if (!(fromPlotted[slideNum-1].indexOf(e.target)>-1)){
      var currentLocation = e.target.style.left+e.target.style.top;
      var transitionDancer = createTransitionDancer();
      transitionDancer.style.left = e.target.style.left;
      transitionDancer.style.top = e.target.style.top;
      transitionDancer.style.position = e.target.style.position;
      transitionDancer.style.transform = "translate(-50%, -50%)";
      currentSlide.appendChild(transitionDancer);
      to = transitionDancer;
      from = e.target;
      targetPairs[slideNum-1][parseInt(to.className.charAt(to.className.length-1))] = from;
      fromPlotted[slideNum-1].push(from);
      _drag_init(transitionDancer);
      return false;
      } 
    } else if (e.target.className.indexOf("transitionDancer")>-1) {
      to = e.target;
      from = targetPairs[slideNum-1][parseInt(to.className.charAt(to.className.length-1))];
      _drag_init(e.target);
    }
    else if(e.target.className == "placed" || e.target.className == "emptyDancer"){
      _drag_init(e.target);
      console.log("hit");
      return false;
  } 
};

document.onmousemove = _move_elem;

var currentDancer = null;
var menuOpen = false; 
function drawLine (target, x1, y1, x2, y2) {
  var c = document.createElement("canvas"); //for arrows
  c.width  = $('#content').width(); 
  c.height = $('#content').height();
  c.style.position = "absolute";
  c.style.left = 0; c.style.top = 0;
  c.className = target.className;
  
  target.parentNode.appendChild(c);
  canvases[slideNum-1].push(c);
  var center = 0;
  x1 += center; x2 += center;
  y1 += center; y2 += center;
  var width = center*.5;
  //line
  ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = center * .1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  //triangle
  ctx.fillStyle = "black";
  var angle = Math.atan((y2-y1)/(x2-x1));
  angle += ((x2>x1)?-90:90)*Math.PI/180*-1;
  if (x1 == x2 && y1 < y2) { // move up
      angle += Math.PI;
  } else if (x1 == x2 && y1 > y2) { // move down
      angle -= Math.PI;
  } 
  drawTriangle(ctx, x2, y2, angle);
  redo = false
} 
function redrawLine (canvas, x1, y1, x2, y2) {
  var center = 0;
  x1 += center; x2 += center;
  y1 += center; y2 += center;
  var width = center*.5;
  //line
  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = center * .1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  //triangle
  ctx.fillStyle = "black";
  var angle = Math.atan((y2-y1)/(x2-x1));
  angle += ((x2>x1)?-90:90)*Math.PI/180*-1;
  if (x1 == x2 && y1 < y2) { // move up
      angle += Math.PI;
  } else if (x1 == x2 && y1 > y2) { // move down
      angle -= Math.PI;
  } 
  drawTriangle(ctx, x2, y2, angle);
  redo = false
} 
function drawTriangle(ctx, x, y, angle) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.moveTo(0,0);
  ctx.lineTo(8,12);
  ctx.lineTo(-8,12);
  ctx.closePath();
  ctx.restore();
  ctx.fill();
}

var from = null, to = null, canvas = null, redraw = new Array(), redo = false;

  $(document).mouseup(function(event) {
    _destroy();
    if (event.target.parentNode.className == "transition" && event.target.className.indexOf("transitionDancer")>-1)  {
      event.preventDefault();
      if (!redo){
        var j = 0;
        for (var i = 0; i < canvases[slideNum-1].length; ++i) {
          if (event.target.className === canvases[slideNum-1][i].className) {
            redrawLine(canvases[slideNum-1][i], parseInt(from.style.left),parseInt(from.style.top),parseInt(to.style.left),parseInt(to.style.top));
          } else {
            j += 1;
          }
        }
        if (j === canvases[slideNum-1].length) {
          drawLine(event.target, parseInt(from.style.left),parseInt(from.style.top),parseInt(to.style.left),parseInt(to.style.top));
        }
        }
      } 
      else if ((event.target.className == "emptyDancer"|| event.target.className == "placed") && !wasDragged) {
      if (!menuOpen){
        document.getElementById('colorMenu').style.display = "none";
        document.getElementById('menu').style.display = "inline-block";
        document.getElementById('menu').style.position = "relative";
        document.getElementById('menu').style.left = event.target.style.left;
        document.getElementById('menu').style.top = event.target.style.top;
        document.getElementById('menu').style.transform = "translate(-50%, -175%)";

        document.getElementById('trash').style.display = "initial";
        document.getElementById('trash').style.position = "absolute";
        document.getElementById('trash').style.left = event.target.style.left;
        document.getElementById('trash').style.top = event.target.style.top;
        document.getElementById('trash').style.transform = "translate(-50%, 175%)";
        currentDancer = event.target;
        menuOpen = true;
      } else {
        currentDancer = event.target;
        document.getElementById('menu').style.display = "none";
        document.getElementById('trash').style.display = "none";
        menuOpen = false;
        document.getElementById('colorMenu').style.display = "inline-block";
        document.getElementById('colorMenu').style.position = "relative";
        document.getElementById('colorMenu').style.left = event.target.style.left;
        document.getElementById('colorMenu').style.top = event.target.style.top;
        document.getElementById('colorMenu').style.transform = "translate(-50%, -175%)";

      }
    }
    else if ((event.target.parentNode.id == "content" || event.target.parentNode.className == "transition") &&!wasDragged && document.getElementById('colorMenu').style.display != "inline-block" && !menuOpen){
      //if (!(fromPlotted[slideNum-1].indexOf(doNotMove)>-1) ) {
      var emptyDancer = createEmptyDancer();
      x = event.clientX - $('#content').offset().left; y = event.clientY - $('#content').offset().top;
      emptyDancer.style.left = x + "px"; emptyDancer.style.top = y + "px";
      emptyDancer.style.transform = "translate(-50%, -50%)";
      emptyDancer.style.position = "absolute";
      currentSlide.appendChild(emptyDancer);
      document.getElementById('menu').style.display = "none";
      document.getElementById('trash').style.display = "none";
      document.getElementById('colorMenu').style.display = "none";
      menuOpen = false;
      
      //}
    } else {
        document.getElementById('menu').style.display = "none";
        document.getElementById('trash').style.display = "none";
        document.getElementById('colorMenu').style.display = "none";
        menuOpen = false;
        
    }
    wasDragged = false;
  });


  /*menu functionalities*/
  $('#menu').mouseover(function(e){
    if (e.target.className == "dance") {
      document.getElementById("menu").style.cursor = "pointer";
    } else {
      document.getElementById("menu").style.cursor = "default";

    }
  });
  $('#menu').click(function(e){
    var placeDancer = e.target;
    if ( placeDancer.textContent.length ==2) {
      var dancerFinal = createDancer(e.target.children[0].innerHTML);
      dancerFinal.className = "placed";
      currentSlide.appendChild(dancerFinal);
      dancerFinal.style.left = currentDancer.style.left; dancerFinal.style.top = currentDancer.style.top;
      dancerFinal.style.transform = "translate(-50%, -50%)";
      dancerFinal.style.background = currentDancer.style.background;
      currentSlide.removeChild(currentDancer);
      if(currentDancer.className == "placed"){
        var nameVisible = currentDancer.children[0].innerHTML;
        $('#menu').children().each( function() {
          if( this.children[0].innerHTML == nameVisible){
            this.style.display = "initial";
          };
        });
        var index = currentPlotted.indexOf(nameVisible);
        if (index > -1) {
          currentPlotted.splice(index, 1);
        }
      }
      currentPlotted.push(e.target.children[0].innerHTML);
      console.log(currentPlotted);
      currentDancer = null;
      dancerFinal.style.position = "absolute";
      document.getElementById("menu").style.display = "none";
      placeDancer.style.display = "none";
    } 
  });

  $('#colorMenu').click(function(e){
    var selectedColor = e.target;
    if (currentDancer.className == "placed"){
      currentDancer.style.background = selectedColor.style.background;
    }
  });

  $('#trash').click( function(e){
    currentSlide.removeChild(currentDancer);
    if(currentDancer.className == "placed"){
        var nameVisible = currentDancer.children[0].innerHTML;
        $('#menu').children().each( function() {
          if( this.children[0].innerHTML == nameVisible){
            this.style.display = "initial";
            

          };
        });
        var index = currentPlotted.indexOf(nameVisible);
        if (index > -1) {
          currentPlotted.splice(index, 1);
        }
      }
  })

//initializing single slide in slides 
//var currentSlide = document.createElement("div");
//currentSlide.style.width = "100%";
//currentSlide.style.height = "100%";
//document.getElementById('content').appendChild(currentSlide);

document.getElementById('menu').appendChild(createDancer("JF"));
document.getElementById('menu').appendChild(createDancer("FU"));
document.getElementById('menu').appendChild(createDancer("SS"));
document.getElementById('menu').appendChild(createDancer("HU"));
document.getElementById('menu').appendChild(createDancer("BO"));

document.getElementById('colorMenu').appendChild(createColorSelection('#bff0e7'));
document.getElementById('colorMenu').appendChild(createColorSelection('#7addcd'));
document.getElementById('colorMenu').appendChild(createColorSelection('#459cb6'));
document.getElementById('colorMenu').appendChild(createColorSelection('#f99186'));
document.getElementById('colorMenu').appendChild(createColorSelection('#fec35b'));


function createDancer (dancerName) {
  var dancer = document.createElement("div");
  dancer.style.width = "50px"; dancer.style.height = "50px";
  dancer.style.position = "relative";
  dancer.style.borderRadius = "50%";
  dancer.style.background = "#7addcd";
  dancer.style.float = "left";
  dancer.style.marginRight = "10px";
  var name = document.createElement("div");
  name.className = "dancer_name";
  name.innerHTML = dancerName; name.style.position = "absolute"; name.style.top = "50%"; 
  name.style.left = "50%"; name.style.transform = "translate(-50%, -50%)";
  name.style.color = "white";
  dancer.appendChild(name);
  dancer.className = "dance";
  return dancer;
};

function createEmptyDancer() {
  var emptyDancer = document.createElement("div");
  emptyDancer.style.width = "50px"; emptyDancer.style.height = "50px";
  emptyDancer.style.borderRadius = "50%";
  emptyDancer.style.background = "#7addcd";
  emptyDancer.style.opacity = "0.85";
  emptyDancer.className = "emptyDancer";
  return emptyDancer;
};
var transitionNumber = 1;
function createTransitionDancer() {
  var transitionDancer = document.createElement("div");
  transitionDancer.style.width = "50px"; transitionDancer.style.height = "50px";
  transitionDancer.style.borderRadius = "50%";
  transitionDancer.style.background = "#none";
  transitionDancer.style.borderStyle = "dashed";
  transitionDancer.style.borderColor = "black";
  transitionDancer.className = "transitionDancer" + transitionNumber;
  transitionNumber += 1;
  return transitionDancer;
};

function createColorSelection(hex) {
  var color = document.createElement("div");
  color.style.width = "50px"; color.style.height = "50px";
  color.style.borderRadius = "50%";
  color.style.background = hex;
  color.style.border = "thin solid gray";
  color.style.float = "left";
  color.style.marginRight = "10px";
  return color;
};

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

$('#newFormation').click(makeNewFormation);
$('#newTransition').click(makeNewTransition);

function makeNewFormation(){
  var background = document.getElementById("content");
  background.style.backgroundColor = "white";
  canvases.push([]);
  targetPairs.push(new Array());
  fromPlotted.push([]);
  document.getElementById('menu').style.display = "none";
  if (slides.length > 0) {
    for (var i = 0; i < slides.length; ++i) {
      slides[i].style.display = "none";
      }
  };
  var div = document.createElement("div");
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.backgroundColor = "#none";
  document.getElementById('content').appendChild(div);
  slides.push(div);
  currentSlide = div;
  slideNum += 1;
  currentPlotted = [];
  visible.push(currentPlotted);
  $('#menu').children().each( function() {
    this.style.display = "initial";
  });
};

 function makeNewTransition() {
    canvases.push([]);
    targetPairs.push(new Array());
    fromPlotted.push([]);
    document.getElementById('menu').style.display = "none";
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
    transition.style.display = "block";
    var children = transition.childNodes;
    for (var i = 0; i <children.length; ++i)
      children[i].style.opacity = ".4";
    div.appendChild(transition);

    document.getElementById("content").appendChild(div);
    slides.push(div);
    currentSlide = div;
    slideNum += 1;
    visible.push([]);
    console.log(currentPlotted);
    $('#menu').children().each( function() {
      if(isInArray(this.children[0].innerHTML, currentPlotted )){
        this.style.display = "none";
      } else {
        this.style.display = "initial"; //makes visible
      }
    });
  };

/*create a formation from template*/
$(".formation").click(function(e){
  currentSlide.innerHTML = "";
  var emptyDancer1 = createEmptyDancer();
  var emptyDancer2 = createEmptyDancer();
  var emptyDancer3 = createEmptyDancer();
  var emptyDancer4 = createEmptyDancer();
  var emptyDancer5 = createEmptyDancer();
  var emptyDancer6 = createEmptyDancer();
  var emptyDancer7 = createEmptyDancer();
  var emptyDancer8 = createEmptyDancer();

  emptyDancer1.style.position = "absolute"
  emptyDancer1.style.display = "block";
  emptyDancer1.style.zIndex = "20";

  emptyDancer2.style.position = "absolute"
  emptyDancer2.style.display = "block";
  emptyDancer2.style.zIndex = "20";

  emptyDancer3.style.position = "absolute"
  emptyDancer3.style.display = "block";
  emptyDancer3.style.zIndex = "20";

  emptyDancer4.style.position = "absolute"
  emptyDancer4.style.display = "block";
  emptyDancer4.style.zIndex = "20";

  emptyDancer5.style.position = "absolute"
  emptyDancer5.style.display = "block";
  emptyDancer5.style.zIndex = "20";

  emptyDancer6.style.position = "absolute"
  emptyDancer6.style.display = "block";
  emptyDancer6.style.zIndex = "20";

  emptyDancer7.style.position = "absolute"
  emptyDancer7.style.display = "block";
  emptyDancer7.style.zIndex = "20";

  emptyDancer8.style.position = "absolute"
  emptyDancer8.style.display = "block";
  emptyDancer8.style.zIndex = "20";

  if (e.target.id === "formation1"){

    emptyDancer1.style.left = "calc(20% - 25px)";
    emptyDancer1.style.top = "calc(40% - 25px)";
    
    currentSlide.appendChild(emptyDancer1);

    emptyDancer2.style.left = "calc(50% - 25px)";
    emptyDancer2.style.top = "calc(40% - 25px)";

    currentSlide.appendChild(emptyDancer2);

    emptyDancer3.style.left = "calc(80% - 25px)";
    emptyDancer3.style.top = "calc(40% - 25px)";

    currentSlide.appendChild(emptyDancer3);

    emptyDancer4.style.left = "calc(10% - 25px)";
    emptyDancer4.style.top = "calc(60% - 25px)";
 
    currentSlide.appendChild(emptyDancer4);

    emptyDancer5.style.left = "calc(30% - 25px)";
    emptyDancer5.style.top = "calc(60% - 25px)";

    currentSlide.appendChild(emptyDancer5);

    emptyDancer6.style.left = "calc(50% - 25px)";
    emptyDancer6.style.top = "calc(60% - 25px)";

    currentSlide.appendChild(emptyDancer6);

    emptyDancer7.style.left = "calc(90% - 25px)";
    emptyDancer7.style.top = "calc(60% - 25px)";

    currentSlide.appendChild(emptyDancer7);

    emptyDancer8.style.left = "calc(70% - 25px)";
    emptyDancer8.style.top = "calc(60% - 25px)";

    currentSlide.appendChild(emptyDancer8);


  }
  if (e.target.id === "formation2"){
    emptyDancer1.style.left = "calc(60% - 25px)";
    emptyDancer1.style.top = "calc(30% - 25px)";
    
    currentSlide.appendChild(emptyDancer1);

    emptyDancer2.style.left = "calc(60% - 25px)";
    emptyDancer2.style.top = "calc(45% - 25px)";

    currentSlide.appendChild(emptyDancer2);

    emptyDancer3.style.left = "calc(60% - 25px)";
    emptyDancer3.style.top = "calc(60% - 25px)";

    currentSlide.appendChild(emptyDancer3);

    emptyDancer4.style.left = "calc(40% - 25px)";
    emptyDancer4.style.top = "calc(45% - 25px)";
 
    currentSlide.appendChild(emptyDancer4);

    emptyDancer5.style.left = "calc(40% - 25px)";
    emptyDancer5.style.top = "calc(60% - 25px)";

    currentSlide.appendChild(emptyDancer5);

    emptyDancer6.style.left = "calc(40% - 25px)";
    emptyDancer6.style.top = "calc(75% - 25px)";

    currentSlide.appendChild(emptyDancer6);

    emptyDancer7.style.left = "calc(80% - 25px)";
    emptyDancer7.style.top = "calc(45% - 25px)";

    currentSlide.appendChild(emptyDancer7);

    emptyDancer8.style.left = "calc(20% - 25px)";
    emptyDancer8.style.top = "calc(60% - 25px)";

    currentSlide.appendChild(emptyDancer8);
  }
  if (e.target.id === "formation3"){
    emptyDancer1.style.left = "calc(50% - 25px)";
    emptyDancer1.style.top = "calc(20% - 25px)";
    
    currentSlide.appendChild(emptyDancer1);

    emptyDancer2.style.left = "calc(40% - 25px)";
    emptyDancer2.style.top = "calc(40% - 25px)";

    currentSlide.appendChild(emptyDancer2);

    emptyDancer3.style.left = "calc(60% - 25px)";
    emptyDancer3.style.top = "calc(40% - 25px)";

    currentSlide.appendChild(emptyDancer3);

    emptyDancer4.style.left = "calc(50% - 25px)";
    emptyDancer4.style.top = "calc(60% - 25px)";
 
    currentSlide.appendChild(emptyDancer4);

    emptyDancer5.style.left = "calc(30% - 25px)";
    emptyDancer5.style.top = "calc(60% - 25px)";

    currentSlide.appendChild(emptyDancer5);

    emptyDancer6.style.left = "calc(70% - 25px)";
    emptyDancer6.style.top = "calc(60% - 25px)";

    currentSlide.appendChild(emptyDancer6);

    emptyDancer7.style.left = "calc(40% - 25px)";
    emptyDancer7.style.top = "calc(80% - 25px)"
    currentSlide.appendChild(emptyDancer7);

    emptyDancer8.style.left = "calc(60% - 25px)";
    emptyDancer8.style.top = "calc(80% - 25px)";

    currentSlide.appendChild(emptyDancer8);
  }
  if (e.target.id === "formation4"){
    emptyDancer1.style.left = "calc(25% - 25px)";
    emptyDancer1.style.top = "calc(30% - 25px)";
    
    currentSlide.appendChild(emptyDancer1);

    emptyDancer2.style.left = "calc(75% - 25px)";
    emptyDancer2.style.top = "calc(30% - 25px)";

    currentSlide.appendChild(emptyDancer2);

    emptyDancer3.style.left = "calc(10% - 25px)";
    emptyDancer3.style.top = "calc(50% - 25px)";

    currentSlide.appendChild(emptyDancer3);

    emptyDancer4.style.left = "calc(40% - 25px)";
    emptyDancer4.style.top = "calc(50% - 25px)";
 
    currentSlide.appendChild(emptyDancer4);

    emptyDancer5.style.left = "calc(60% - 25px)";
    emptyDancer5.style.top = "calc(50% - 25px)";

    currentSlide.appendChild(emptyDancer5);

    emptyDancer6.style.left = "calc(90% - 25px)";
    emptyDancer6.style.top = "calc(50% - 25px)";

    currentSlide.appendChild(emptyDancer6);

    emptyDancer7.style.left = "calc(25% - 25px)";
    emptyDancer7.style.top = "calc(70% - 25px)";

    currentSlide.appendChild(emptyDancer7);

    emptyDancer8.style.left = "calc(75% - 25px)";
    emptyDancer8.style.top = "calc(70% - 25px)";

    currentSlide.appendChild(emptyDancer8);
  }
  if (e.target.id === "formation5"){
        emptyDancer1.style.left = "calc(25% - 25px)";
    emptyDancer1.style.top = "calc(30% - 25px)";
    
    currentSlide.appendChild(emptyDancer1);

    emptyDancer2.style.left = "calc(75% - 25px)";
    emptyDancer2.style.top = "calc(30% - 25px)";

    currentSlide.appendChild(emptyDancer2);

    emptyDancer3.style.left = "calc(10% - 25px)";
    emptyDancer3.style.top = "calc(50% - 25px)";

    currentSlide.appendChild(emptyDancer3);

    emptyDancer4.style.left = "calc(40% - 25px)";
    emptyDancer4.style.top = "calc(50% - 25px)";
 
    currentSlide.appendChild(emptyDancer4);

    emptyDancer5.style.left = "calc(60% - 25px)";
    emptyDancer5.style.top = "calc(50% - 25px)";

    currentSlide.appendChild(emptyDancer5);

    emptyDancer6.style.left = "calc(90% - 25px)";
    emptyDancer6.style.top = "calc(50% - 25px)";

    currentSlide.appendChild(emptyDancer6);

    emptyDancer7.style.left = "calc(25% - 25px)";
    emptyDancer7.style.top = "calc(70% - 25px)";

    currentSlide.appendChild(emptyDancer7);

    emptyDancer8.style.left = "calc(75% - 25px)";
    emptyDancer8.style.top = "calc(70% - 25px)";

    currentSlide.appendChild(emptyDancer8);
  }


  // var formation = e.target.cloneNode(true);

  // formation.style.width = "100%";
  // formation.style.height = "100%";
  // formation.style.position = "absolute";
  // formation.style.left = "0";
  // formation.style.top = "0";
  // formation.style.display = "block";
  // formation.style.zIndex = "20";
  // currentSlide.appendChild(formation);
})

$('#next-btn').click(function(e){
  if (slideNum < slides.length){
    currentSlide.style.display = "none";
    document.getElementById('menu').style.display = "none";
    
    slideNum = slideNum + 1;
    currentSlide = slides[slideNum - 1];
    currentSlide.style.display = 'block';

    if( currentSlide.className == "transition"){
      currentPlotted = visible[slideNum - 2];
    } else {
      currentPlotted = visible[slideNum - 1];
    }

    $('#menu').children().each( function() {
      if(isInArray(this.children[0].innerHTML, currentPlotted )){
        this.style.display = "none";
      } else {
        this.style.display = "initial"; //makes visible
      }
    });
  }
});

$('#previous-btn').click(function(e){
  if (slideNum > 1){
    currentSlide.style.display = 'none';
    
    slideNum = slideNum - 1;
    currentSlide = slides[slideNum - 1];
    currentSlide.style.display = "block";

    if( currentSlide.className == "transition"){
      currentPlotted = visible[slideNum - 2];
    } else {
      currentPlotted = visible[slideNum - 1];
    }

    $('#menu').children().each( function() {
      if(isInArray(this.children[0].innerHTML, currentPlotted )){
        this.style.display = "none";
      } else {
        this.style.display = "initial"; //makes visible
      }
    });
  }
});


var dancerEditing = false; 
$('#editButton').on('click', function(){
  console.log('hit')
  if(!dancerEditing){
    dancerEditing = true;
    $('#danceTitle').removeAttr('readonly');
    $('#numDancers').removeAttr('disabled');
    $('#description').removeAttr('readonly');
    $('#music').removeAttr('disabled');
    document.getElementById('editButton').innerHTML = "Save";
  } else if (dancerEditing) {
    dancerEditing = false;
    $('#danceTitle').attr('readonly', true);
    $('#numDancers').attr('disabled', true);
    $('#description').attr('readonly', true);
    $('#music').attr('disabled', true);
    document.getElementById('editButton').innerHTML = "Edit";
  }
});

$('#addDancer').click(function(){
  // var name = $('#DancerName').modal();
  // console.log(name);
});

$('#sidebar-toggle').click(function() {
  var sidebar = document.querySelector('.sidebar');
  var body = document.querySelector('.body');
  var angle = document.querySelector('.angle');
  var progressRatio = 0;
  var classNames = document.querySelector('.sidebar').className;
  if(classNames.indexOf('maximized') > -1) {
    sidebar.className = 'sidebar';
    body.className = 'body minimized';
    angle.className = 'angle icon-double-angle-right';
    $('.tab-content').hide();
    progressRatio = wavesurfer.getCurrentTime()/wavesurfer.getDuration();
    $('#waveform').width($(window).width() - 50);
    wavesurfer.drawBuffer();
    wavesurfer.seekTo(progressRatio);
  } else {
    sidebar.className = 'sidebar maximized';
    body.className = 'body';
    angle.className = 'angle icon-double-angle-left';
    $('.tab-content').show();
    progressRatio = wavesurfer.getCurrentTime()/wavesurfer.getDuration();
    $('#waveform').width($(window).width() - 250);
    wavesurfer.drawBuffer();
    wavesurfer.seekTo(progressRatio);
  }
  return false;
});


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



}); //end of document ready 


