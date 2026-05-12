$.ajaxSetup({
  timeout: 500
});

function setup() {
  // set the background color
    background(255, 255, 255);
    
    // canvas size (Integers only, please.)
    var canvas = createCanvas(400, 400);
    
    // Move the canvas so it’s inside our <div id="canvas-holder">.
  	canvas.parent('canvasHolderSmall');
    
    // smooth edges
    smooth();
    
    // limit the number of frames per second
    frameRate(30); 
}

function draw() {
  background(186, 145, 20); // wooden table
	ellipse(200, 200, 350, 350); // plate
	ellipse(200, 200, 300, 300); 
	//start_stake
	strokeWeight(10);
	stroke (240, 237, 180);
	fill(207, 60, 60);
	beginShape();
	curveVertex(-119,-7); 
	curveVertex(200,200);//start point 
	curveVertex(211,267); 
	curveVertex(262,274); 
	curveVertex(306,196); 
	curveVertex(288,109); 
	curveVertex(209,106); 
	curveVertex(200,200); //end point
	curveVertex(334,375);
	endShape();
	strokeWeight(3);
	stroke (107, 20, 20);
	line(233,204,287,187);
	line(239,220,287,203);
	line(243,235,285,220);
	noStroke();
	fill(222, 224, 192);
	ellipse(243, 150, 30, 30);
	//end_stake
	//start_omlette
	//white
	strokeWeight(1);
	noStroke ();
	fill(252, 246, 234);
	beginShape();
	curveVertex(186,113); 
	curveVertex(195,235); 
	curveVertex(180,268); 
	curveVertex(168,304); 
	curveVertex(130,299); 
	curveVertex(78,268); 
	curveVertex(68,241);
	curveVertex(100,200); 
	curveVertex(122,170); 
	curveVertex(153,174); 
	curveVertex(184,200); 
	curveVertex(195,235); 
	curveVertex(276,308); 
	endShape();
	//yolk
	noStroke();
	fill(255, 170, 0);
	ellipse(131, 231, 45, 43); 
	//end_omlette
	//start_french_fries
	noStroke ();
	fill(255, 213, 0);
	quad(130,90,180,80,180,85,135,95);
	quad(110,110,160,100,160,105,115,115);
	quad(90,130,140,120,140,125,95,135);
	//end_french_fries
	//start_table-knife
	stroke (0,0,0);
}

//check availability of the code txt version URL
var checkTxtUrl = function () {
  var txt_url = 'https://res.cloudinary.com/deah4rwon/raw/upload/v1601907400/js/code_project2_sfldet.txt'; 
  $.ajax({
    url:txt_url,
    type:'HEAD',
    error: function(){
      $('.snippetWrapper').load('../../txt/code_project2.txt');
    },
    success: function(){
      $('.snippetWrapper').load('https://res.cloudinary.com/deah4rwon/raw/upload/v1601907400/js/code_project2_sfldet.txt');
    }
  });   
}

checkTxtUrl();