$.ajaxSetup({
  timeout: 500
});

let cuteRockUrl;

let colorRainSketch = function(p) {
  //main variables
    var j = 0;
    var c = 0;
    var l = 50;//number of start drops
    var xPositions = [200];
    var yPositions = [0];
    var xPositionsRock = [200];
    var yPositionsRock = [-203];
    var dropsObjArray = [];
    let img; // Declaring variable 'img'.
    let cuteRock;
  p.preload = function () {
    cuteRock = p.loadImage(cuteRockUrl);
  }
  p.setup = function() {  
    // canvas size (Integers only, please.)
    var canvas = p.createCanvas(400, 400);
      
    // Move the canvas so it’s inside our <div id="canvas-holder">.
    canvas.parent('canvasHolderSmall');
      
    // smooth edges
    p.smooth();
      
    // limit the number of frames per second
    p.frameRate(60);
    //creating color array
    
    p.colorMode(p.RGB);
    
    //loop is determining rain density
    while (j < l){
      j++;
      var newDropObj = { 
        xPositions: p.random(-228,158),   
        yPositions: p.random(-800,-200),
        color: p.color(p.random(255),p.random(255),p.random(255))
      }
      dropsObjArray.push (newDropObj);  
    }   
  }
  //loop add drop or rock
  p.mousePressed = function (event) {
    console.log(event);
    if ( event.button === 0){
      var newDropObj = { 
        xPositions: p.mouseX-241,   
        yPositions: p.mouseY-161,
        color: p.color(p.random(255),p.random(255),p.random(255))
      }
      dropsObjArray.push (newDropObj);      
    }
    else {
      xPositionsRock.push(p.mouseX);
      yPositionsRock.push(p.mouseY);
      console.log('clicked'); 
    }
    return false
  }

  p.draw = function() { 
  
    //loop determining drop color  
    
    p.background(204, 247, 255);
         
    //loop rain engine
    for (var i = 0; i < dropsObjArray.length; i++) {
      p.noStroke();       
      var dropObj = dropsObjArray[i]; 
      p.fill(dropObj.color);    
      p.bezier(242+dropObj.xPositions, dropObj.yPositions+115, 233+dropObj.xPositions, dropObj.yPositions+138, dropObj.xPositions+250, dropObj.yPositions+146, dropObj.xPositions+241, dropObj.yPositions+114);                  
      dropObj.yPositions++;
      //restart rain engine
      if (dropObj.yPositions>400) {
        dropObj.yPositions=p.random(-200,-130);
      }           
    }
    //loop rain of rock engine
    for (var q = 0; q < xPositionsRock.length; q++) {
      //shape of drops
      p.image(cuteRock, xPositionsRock[q], yPositionsRock[q], 15, 30); 
      yPositionsRock[q] += 2;
      //restart rain engine
      if (yPositionsRock[q]>400) {
        yPositionsRock[q]=p.random(-200,-130);
      }           
    }
  }
  $('#canvasHolderSmall').contextmenu(function() {
    return false;
  });
}

var checkImgUrl = function () {
  var goto_url = ('https://res.cloudinary.com/deah4rwon/image/upload/v1580977996/cuteRock_wfbb7c.png'); 
  $.ajax({
    url:goto_url,
    type:'HEAD',
    error: function(){
      cuteRockUrl = '../../img/projects_Img/cuteRock.png'
      let myp5 = new p5(colorRainSketch);      
    },
    success: function(){
      cuteRockUrl = 'https://res.cloudinary.com/deah4rwon/image/upload/v1580977996/cuteRock_wfbb7c.png';
      let myp5 = new p5(colorRainSketch);      
    }
  }); 
}

//check availability of the code txt version URL
var checkTxtUrl = function () {
  var txt_url = 'https://res.cloudinary.com/deah4rwon/raw/upload/v1581477877/js/code_project3_xurmh5.txt'; 
  $.ajax({
    url:txt_url,
    type:'HEAD',
    error: function(){
      $('.snippetWrapper').load('../../txt/code_project3.txt');
    },
    success: function(){
      $('.snippetWrapper').load('https://res.cloudinary.com/deah4rwon/raw/upload/v1581477877/js/code_project3_xurmh5.txt');
    }
  });   
}

checkImgUrl();
checkTxtUrl();