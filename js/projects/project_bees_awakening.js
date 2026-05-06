$.ajaxSetup({
  timeout: 500
});

var treeUglyUrl, treeUglyImg, winstonUrl, winstonImg, treeTallUrl, treeTallImg;
//check availability of the image's URLs
var animCoeff = 1;

//checking browser and platform, and if it is mobile then reduce fps 2 times

if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
  if (!!window.chrome) {
    animCoeff = 2;      
  }
  else {
    animCoeff = 3;   
  } 
}

if (navigator.userAgent.match(/(Android)/)) {
  if (!!window.chrome) {
    animCoeff = 2;      
  }
  else {
    animCoeff = 3;   
  }  
}

var externalUrls = {
  treeUglyUrl : 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/cute/TreeUgly.png',
  winstonUrl : 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/creatures/Winston.png',
  treeTallUrl : 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/cute/TreeTall.png'
}
var localUrls = {
  treeUglyUrl : '../../img/projects_Img/TreeUgly.png',
  winstonUrl : '../../img/projects_Img/Winston.png',
  treeTallUrl : '../../img/projects_Img/TreeTall.png'
}

var checkImgUrl = function (varName, goto_url, errorUrl) {
  $.ajax({
    url:goto_url,
    type:'HEAD',
    error: function(){
      window[varName] = errorUrl;           
    },
    success: function(){
      window[varName] = goto_url;
    }
  });
}

//main sketch function
let gameSketch = function(p) {
	var beeGoHome = false; //bee returned to home
	var beeAtHome = true; //bee in the beehave
	var beeScaled = false; //bee scale enadled
	var count=0; //remaining time for bee scale	
	var glassIsBroken = false;
	var numberOfRift = 20;
	var bees = [];	
	var rifts=[];
  p.preload = function () {
       
  };

  p.setup = function() {
  	treeUglyImg = p.loadImage(treeUglyUrl);
  	winstonImg = p.loadImage(winstonUrl);
    treeTallImg = p.loadImage(treeTallUrl);

  	p.angleMode(p.DEGREES);   
    // canvas size
    var canvas = p.createCanvas(400, 400);
    // canvas.style.p.width = '100%', canvas.style.p.height = '100%';
  
    // Move the canvas so it’s inside our <div id='canvas-holder'>.
    canvas.parent('canvasHolderSmall');
      
    // smooth edges
    p.smooth();
      
    // limit the number of frames per second
    p.frameRate(60/animCoeff);
    //creating color array
    
    p.colorMode(p.RGB);    

    p.startConfig();
  };

  p.startConfig = function () {	
		
		//broken glass
		{
			p.brokenGlass = function (angle) {
				this.angle=angle;
				this.a=p.random(130,170);
				this.a1=p.random(130,170);
				this.b=p.random(100,140);
				this.b1=p.random(100,140);
				this.c=p.random(60,100);
				this.c1=p.random(60,100);
				this.d=p.random(20,60);
				this.d1=p.random(20,60);
			};

			p.brokenGlass.prototype.draw = function() {
				p.push();
				p.translate(200,200);
				p.rotate(this.angle);
				p.fill(0,0,0);
				p.line(200,200,this.a,this.a1);
				p.line(this.a,this.a1,this.b,this.b1);
				p.line(this.b,this.b1,this.c,this.c1);
				p.line(this.c,this.c1,this.d,this.d1);
				p.line(this.d,this.d1,0,0);
				p.pop();
			};

			
			for (var i=0;i<numberOfRift;i++){
				rifts[i] = new p.brokenGlass (i*(360/numberOfRift));
			}
		}
		//bee part
		{
			p.bee = function () {
				this.bodyColor = p.color(255,255,0);
				this.beeScale = 0.09;//scale of bee
				this.decreaseDegrees = 0;
				this.beeIncAtHome=0;//The only condition to check is that the bee is at home
				this.beeAtHome = true;
				//fly translate coordinates
				this.x1=0;
				this.y1=0;
				this.x2=0;
				this.y2=0;
				this.angle1=0;
				this.angle2=0;
				this.xOff=138;//bee x start positions 
				this.yOff=325;//bee y start positions 
				//fly trajectory variables
				//small fly radius
				this.startAngle1 = 0;
				this.period1 = p.random(0.8,1.5)/animCoeff;//fly speed
				this.amplitude1 = p.random(20,35);//fly radius
				this.angleVel1 = (p.TWO_PI / this.period1) * 5;
				//big fly radius
				this.startAngle2 = 0;
				this.period2 = this.period1*4;//fly speed
				this.amplitude2 = this.amplitude1*5;//fly radius
				this.angleVel2 = (p.TWO_PI / this.period2) * 5;
				//wings flaps variable
				this.startWingAngle =0;
				this.wingsFlapAmplitude = 8;
				this.wingsFlapPeriod = 0.13/animCoeff;
				this.angleWingVel = (p.TWO_PI / this.wingsFlapPeriod) * 5;
				this.armLength = -20;
				//limbs swing variables
				this.position = new p5.Vector();
				this.angle = 0;
				this.aVelocity = 0.0;
				this.aAcceleration = 0.0;
				this.damping = 0.8;
			};

			p.bee.prototype.update = function() {

					if (!beeGoHome){//&& !beeAtHome
						this.beeAtHome = false;
						this.startAngle1 += p.TWO_PI / this.period1;//small fly radius
						this.startAngle2 += p.TWO_PI / this.period2;//big fly radius
						this.startWingAngle += p.TWO_PI / this.wingsFlapPeriod;//wings flaps						
					}
					else if (beeGoHome && this.startAngle2>355 ){//&& !beeAtHome
						while(this.decreaseDegrees<1){
							this.startAngle1 = (this.startAngle1/360-p.floor(this.startAngle1/360)+5)*360;
							this.startAngle2 = (this.startAngle2/360-p.floor(this.startAngle2/360)+2)*360;
							this.decreaseDegrees++;
						}
						this.startAngle1 -= p.TWO_PI / this.period1;//small fly radius
						this.startAngle2 -= p.TWO_PI / this.period2;//big fly radius
						this.startWingAngle -= p.TWO_PI / this.wingsFlapPeriod;//wings flaps
						this.yOff+=0.2;
						this.xOff+=0.2;		
					}
					else if (beeGoHome && this.startAngle2 < 355 && this.x2 > 95 && this.y2 < 30) {
						//this.beeIncAtHome = 3;
						while(this.beeIncAtHome<1){
							this.beeAtHome = true;
							this.beeIncAtHome++;
						}										
					}
					
					//legs swings    
					{
						// Arbitrary constant
						var gravity = this.amplitude1*-1;
						// Calculate acceleration
						this.aAcceleration = (-1 * gravity / this.armLength) * p.cos(this.startAngle1);
						// Increment velocity
						this.aVelocity += this.aAcceleration;
						// Arbitrary damping
						this.aVelocity *= this.damping;
						// Increment angle
						this.angle += this.aVelocity;}
					};

					p.bee.prototype.checkEdges = function () {
						if (count<300){
							if (this.x2 < -120 ) {
								this.xOff=this.amplitude2*1.05;
							}

							if (this.y2 > 100) {
								if (this.yOff>this.amplitude2*1.08){
									this.yOff-=2;
								}
							}
						}
					//println(this.angle1);
					//println(this.xOff);
			};
				
			p.bee.prototype.draw = function (){
				p.stroke(0);
				//fly trajectory 1
				this.angle1=this.startAngle1;
				this.y1=this.amplitude1*p.sin(this.angle1);
				this.x1=this.amplitude1*p.cos(this.angle1);
				this.angle1+=this.angleVel1;
				//fly trajectory 2 (bigger than 1 trajectory)
				this.angle2=this.startAngle2;
				this.y2=this.amplitude2*p.sin(this.angle2)*-1;
				this.x2=this.amplitude2*p.cos(this.angle2);
				this.angle2+=this.angleVel2;
				//position for swing limbs
				this.position = new p5.Vector(
					this.armLength * p.sin(this.angle),
				 	this.armLength * p.sin(this.angle)
				);
				//println(this.position);
				//bee drawing function
				p.push();
					p.translate(this.x2+this.xOff,this.y2+this.yOff);					
					p.push();
						p.translate(this.x1,this.y1);											
						p.scale(this.beeScale);						
						{
							//horns
							{   var hornCoff = -1.1;//horn swing coefficient
								//horn1
								p.push();
									p.translate(21,140);
									p.rotate(10);
									p.strokeWeight(6.2);
									p.scale(0.3);
									p.noFill();
									p.beginShape();
									p.curveVertex(-91,-5+this.position.y*hornCoff); 
									p.curveVertex(-69,-15+this.position.y*hornCoff); 
									p.curveVertex(-29,-55+this.position.y*hornCoff); 
									p.curveVertex(68,-74+this.position.y*hornCoff); 
									p.curveVertex(159,-8);
									p.curveVertex(68,-75+this.position.y*hornCoff); 
									p.curveVertex(-28,-53+this.position.y*hornCoff); 
									p.curveVertex(-74,-6+this.position.y*hornCoff); 
									p.curveVertex(-90,25+this.position.y*hornCoff); 
									p.curveVertex(-106,14+this.position.y*hornCoff); 
									p.curveVertex(-91,-5+this.position.y*hornCoff); 
									p.curveVertex(-69,-15+this.position.y*hornCoff); 
									p.curveVertex(-29,-55+this.position.y*hornCoff);
									p.endShape();
								p.pop();
								//horn2
								p.push();
									p.translate(34,120);
									p.rotate(31);
									p.strokeWeight(6.2);
									p.scale(0.3);
									p.noFill();
									p.beginShape();
									p.curveVertex(-91,-5+this.position.y*hornCoff); 
									p.curveVertex(-69,-15+this.position.y*hornCoff); 
									p.curveVertex(-29,-55+this.position.y*hornCoff); 
									p.curveVertex(68,-74+this.position.y*hornCoff); 
									p.curveVertex(159,-8);
									p.curveVertex(68,-75+this.position.y*hornCoff); 
									p.curveVertex(-28,-53+this.position.y*hornCoff); 
									p.curveVertex(-74,-6+this.position.y*hornCoff); 
									p.curveVertex(-90,25+this.position.y*hornCoff); 
									p.curveVertex(-106,14+this.position.y*hornCoff); 
									p.curveVertex(-91,-5+this.position.y*hornCoff); 
									p.curveVertex(-69,-15+this.position.y*hornCoff); 
									p.curveVertex(-29,-55+this.position.y*hornCoff);
									p.endShape();
								p.pop();
							}
							//head
							p.push();
								p.translate(9,1);
								p.rotate(4);
								{
									//contur of head
									{
										p.fill(255, 255, 0);
										p.strokeWeight(2);
										p.push();
											p.translate(93,177);
											p.scale(0.5);
											p.beginShape(); 
											p.curveVertex(-88,8); 
											p.curveVertex(-83,-36); 
											p.curveVertex(-53,-77); 
											p.curveVertex(-7,-93); 
											p.curveVertex(31,-67); 
											p.curveVertex(18,-9); 
											p.curveVertex(-12,26); 
											p.curveVertex(-60,49); 
											p.curveVertex(-68,71); 
											p.curveVertex(-88,8); 
											p.curveVertex(-83,-36); 
											p.curveVertex(-53,-77);
											p.endShape(); 
										p.pop();
									}
									//eye
									{
										p.fill(242, 161, 0);
										p.strokeWeight(2);
										p.push();
											p.translate(84,164);
											p.scale(0.18);
											p.rotate(-19);
											p.beginShape(); 
											p.curveVertex(-88,8); 
											p.curveVertex(-83,-36); 
											p.curveVertex(-53,-77); 
											p.curveVertex(-7,-93); 
											p.curveVertex(31,-67); 
											p.curveVertex(-7,-21); 
											p.curveVertex(-88,8); 
											p.curveVertex(-83,-36); 
											p.curveVertex(-53,-77);
											p.endShape(); 
										p.pop();
									}
								}
							p.pop();								
								//wings
								{ 
									var angleWing=this.startWingAngle;
									var w1=this.wingsFlapAmplitude*p.cos(angleWing);
									//println(w1);
									angleWing+=this.angleWingVel;
									//wing1
									p.push();
										p.translate(258+w1,121+w1*1.4);
										p.rotate(10+w1);
										p.strokeWeight(1.3);
										p.fill(0, 238, 255, 50);
										p.beginShape();
										p.curveVertex(-37,-63); 
										p.curveVertex(47,-120); 
										p.curveVertex(82,-97); 
										p.curveVertex(0,-13); 
										p.curveVertex(-100,30); 
										p.curveVertex(-37,-63); 
										p.curveVertex(47,-120); 
										p.curveVertex(82,-97);
										p.endShape();
									p.pop();
									//wing2
									p.push();
									p.translate(215-w1,121-w1*1.4);
									p.rotate(-18-w1);
									p.strokeWeight(1.3);
									p.fill(0, 238, 255, 50);
									p.beginShape();
									p.curveVertex(-37,-63); 
									p.curveVertex(47,-120); 
									p.curveVertex(82,-97); 
									p.curveVertex(0,-13); 
									p.curveVertex(-100,30); 
									p.curveVertex(-37,-63); 
									p.curveVertex(47,-120); 
									p.curveVertex(82,-97);
									p.endShape();
									p.pop();
								}
								//body chest
								{
									p.fill(this.bodyColor);
									p.push();
										p.strokeWeight(1.2);
										p.translate(163,193);
										p.scale(0.75,0.8);
										p.rotate(2);
										p.beginShape(); 
										p.curveVertex(-24,3); 
										p.curveVertex(-68,-16); 
										p.curveVertex(-71,-55); 
										p.curveVertex(-34,-79); 
										p.curveVertex(25,-83); 
										p.curveVertex(53,-44); 
										p.curveVertex(35,-1); 
										p.curveVertex(-24,3); 
										p.curveVertex(-68,-16); 
										p.curveVertex(-71,-55);
										p.endShape(); 
									p.pop();
								}
								//ass bee
								{
									p.fill(this.bodyColor);
									p.push();
										p.strokeWeight(1.2);
										p.translate(260,213);
										p.scale(0.96);
										p.rotate(22);
										//sting
										p.strokeWeight(1);
										p.fill(176, 166, 176);
										p.triangle(68,-32,75,-47,112,-32);
										//main ass body
										p.fill(this.bodyColor);
										p.beginShape(); 
										p.curveVertex(-24,3); 
										p.curveVertex(-68,-16); 
										p.curveVertex(-71,-55); 
										p.curveVertex(-34,-79); 
										p.curveVertex(12,-78); 
										p.curveVertex(77,-43); 
										p.curveVertex(27,-8); 
										p.curveVertex(-24,3); 
										p.curveVertex(-68,-16); 
										p.curveVertex(-71,-55);
										p.endShape(); 
										//bands
										p.noFill();
										p.strokeWeight(15);
										p.arc(-55,-36,22,-143,-72,68);
										p.arc(-18,-44,22,-143,-72,76);
										p.arc(23,-57,22,-143,-22,76);
									p.pop();
								}
								//legs
								{   
									p.push();
										p.translate(233,175);
										p.rotate(10);
										p.strokeWeight(5.3);
										p.fill(0, 238, 255, 50);
										p.beginShape();
										p.line(-101,30,-107+this.position.x,68);
										p.line(-107+this.position.x,69,-134+this.position.x,95);
										p.endShape();
									p.pop();
								}//leg1
								{   
									p.push();
										p.translate(262,178);
										p.rotate(10);
										p.strokeWeight(5.3);
										p.fill(0, 238, 255, 50);
										p.beginShape();
										p.line(-101,30,-97+this.position.x,63);
										p.line(-97+this.position.x,65,-80+this.position.x,100);
										p.endShape();
									p.pop();
								}//leg2
								{   
									p.push();
										p.translate(286,175);
										p.rotate(10);
										p.strokeWeight(5.3);
										p.fill(0, 238, 255, 50);
										p.beginShape();
										p.line(-101,30,-75+this.position.x,64);
										p.line(-74+this.position.x,64,-24+this.position.x,99);
										p.endShape();
									p.pop();
								}//leg3	
						}					
					p.pop();
				p.pop();
			};
				
			//creating bees				
			for (var i = 0; i<20/animCoeff; i++){
				bees[i] = new p.bee();
			}
		}
		//background trees draw function
		{   
				//prototypes
				p.noiseRandom = function(){
					this.x = [];
					this.y = [];
					this.tx = 0;
					this.ty = 9999;            
				};
				{
					p.noiseRandom.prototype.random = function (itemsQuantity,widthCoeff,heightCoeff) {
						for (var i=0;i < itemsQuantity;i++){
							var xStepSize = p.map(p.noise(this.tx),0,1,0,p.width*widthCoeff);
							var yStepSize = p.map(p.noise(this.ty),0,1,0,p.height/heightCoeff);
							// console.log(xStepSize);
							// console.log(yStepSize);
							this.x.push(xStepSize);
							this.y.push(yStepSize);
							this.tx += 1;
							this.ty += 0.5;
						}
					};

					p.noiseRandom.prototype.drawTrees = function () {
						for (var j=0;j < this.x.length; j++){
							p.image(treeUglyImg,this.x[j]-100,this.y[j]+180,20,30);
						}
					};
				}
				//draw function
				{
					var trees = new p.noiseRandom();
				}
				//main programm
				{
					trees.random(26/animCoeff,2,2);
					trees.drawTrees(); 
				}
			}
		//background part
		{
			p.drawBackground = function() {
				//sun
				p.image(winstonImg,29,24,40,40);
				p.noStroke();
				p.fill(35, 235, 0);
				p.rect(0,200,400,300);
				trees.drawTrees(-1115,19);
				p.textFont('Arial');
				p.stroke(0);
				p.strokeWeight(0);
				p.textSize(16);
				p.textStyle(p.NORMAL);
				if (beeAtHome){
					p.fill(255, 255, 255);
					p.rect(75,19,220,36,5);
					p.fill(0, 0, 0);
					p.text("Don't touch the beehive.",82,34);
					p.text("It is might be a dangerous!!!",82,50);
				}
				else {
					p.fill(255, 255, 255);
					p.rect(75,19,300,54,5);
					p.fill(0, 0, 0);
					p.text("Did I tell you? Do not touch the beehive.",82,34);
					p.text("But you did not listen to me.",82,50);
					p.text("Now has time to pay for your curiosity!!!",82,66);
				}
			};

			p.drawBeehive = function () {
				p.fill(219, 183, 41);
				p.stroke(1);
				p.strokeWeight(1);
				p.push();
					{
						p.image(treeTallImg,305,115,106,301);
						p.translate(258,69);
						//beehive					
						p.ellipse(100,243,30,40);
						p.arc(100,232,25,5,0,180);
						p.arc(100,253,25,5,0,180);
						p.arc(100,239,29,5,0,180);
						p.arc(100,246,29,5,0,180);
						p.fill(5, 5, 5);
						p.ellipse(100,243,10,10);
					}
				p.pop();
			};
			p.drawVibratingBeehive = function () {
				i++;
				p.fill(219, 183, 41);
				p.stroke(1);
				p.strokeWeight(1);
				p.image(treeTallImg,305,115,106,301);
				//p.ellipse(360,314,30,40);
				p.push();
				{	
					p.translate(258+i,69+i);				
					p.ellipse(100,243,30,40);
					p.arc(100,232,25,5,0,180);
					p.arc(100,253,25,5,0,180);
					p.arc(100,239,29,5,0,180);
					p.arc(100,246,29,5,0,180);
					p.fill(5, 5, 5);
					p.ellipse(100,243,10,10);
				}
				p.pop();
				if (i>2){
					i=0;
				}
			};
		}
	};
	//mouse cliked function
	p.mouseClicked = function() {
		if (p.mouseX>345 && p.mouseX<375 && p.mouseY<330 && p.mouseY>290){
			if (p.mouseButton === p.LEFT) {
				beeAtHome = false;
			}
		}
	};
	//main programm
	var beeNumber=0;
	var beeIncAtHome=0;
	p.draw = function(){
		p.background(0, 180, 235);
		p.drawBackground();
		if (!beeAtHome){
			var scaleSpeed = 2*animCoeff;
			if (!beeGoHome){
				p.drawBeehive();
			}
			//draw a bees
			for (var i=0; i<bees.length;i++){
				bees[i].update();
				bees[i].draw();
				bees[i].checkEdges();
			}
			//choose 1 bee
			if (count < 300){
				count++;
				beeScaled=false;
			}
			else if (!beeScaled && count === 300){
				beeScaled=true;
				beeNumber=bees.length-1;				
				count++;				
			}
			else if (beeScaled && bees[beeNumber].beeScale<1.2){
			//scale 1 bee			
				bees[beeNumber].beeScale+=0.001*scaleSpeed;
				bees[beeNumber].xOff-=0.11*scaleSpeed;
				bees[beeNumber].yOff-=0.21*scaleSpeed;
			}
			else if (beeScaled && bees[beeNumber].beeScale > 1.2){
				beeScaled=false;
				glassIsBroken=true;
			}
			else if(bees[beeNumber].beeScale>0.09){
				bees[beeNumber].beeScale-=0.001*scaleSpeed;
				bees[beeNumber].xOff+=0.11*scaleSpeed;
				bees[beeNumber].yOff+=0.22*scaleSpeed;
			}
			else {
				beeGoHome = true;				
				for (var i=0;i<bees.length;i++){
					if (bees[i].beeAtHome){
						beeIncAtHome++;
						bees[i].beeAtHome=false;
						bees[i].beeScale=0.09;
					}
				}
				if (beeIncAtHome===bees.length){
					//refresh start parameters
					beeIncAtHome=0;
					beeGoHome = false; //bee returned to home
					beeAtHome = true; //bee in the beehave
					beeScaled = false; //bee scale enadled
					count=0; //remaining time for bee scale					
					glassIsBroken = false;
					for (var i=0;i<bees.length;i++){						
						bees[i].beeIncAtHome=0;
						bees[i].x1=0;
						bees[i].y1=0;
						bees[i].x2=0;
						bees[i].y2=0;
						bees[i].angle1=0;
						bees[i].angle2=0;
						bees[i].startAngle1 = 0;
						bees[i].startAngle2 = 0;
						bees[i].startWingAngle=0;
						bees[i].xOff = 191;
						bees[i].yOff = 326;										
					}			
				}
			}
		}						
		if (!beeScaled && !beeAtHome && beeGoHome){
			p.drawBeehive();
		}
		if (beeAtHome){
			p.drawVibratingBeehive();
		}
		if (glassIsBroken){
			for (var i=0;i<rifts.length;i++){
				rifts[i].draw();
			}
		} 
		// let fps = p.frameRate();  
  //   p.fill(255);    
  //   p.textSize(32);
  //   p.text("FPS: "+fps.toFixed(2), 40, 80);   
	};
};

//check availability of the code txt version URL
var checkTxtUrl = function () {
  var txt_url = 'https://res.cloudinary.com/deah4rwon/raw/upload/v1604198768/js/code_project_bees_awakening_i6tk7q.txt'; 
  $.ajax({
    url:txt_url,
    type:'HEAD',
    error: function(){
      $('.snippetWrapper').load('../../txt/code_project_bees_awakening.txt');
    },
    success: function(){
      $('.snippetWrapper').load('https://res.cloudinary.com/deah4rwon/raw/upload/v1604198768/js/code_project_bees_awakening_i6tk7q.txt');
    }
  });   
}



//****main_programm*****
checkTxtUrl();
var externalUrlsArray = Object.values(externalUrls);
var localUrlsArray = Object.values(localUrls);
var urlKeys = Object.keys(externalUrls);
for (var i = 0; i < urlKeys.length; i++) {
  checkImgUrl(urlKeys[i], externalUrlsArray[i], localUrlsArray[i]);    
}

//waiting until ajax will be complete after that will start the drawing sketch 
var ajaxComplete = 0;
$(document).ajaxComplete(function(){
  ajaxComplete++;  
  // console.log(ajaxComplete)
  if (ajaxComplete === 5){
    p5.disableFriendlyErrors = true; // disables FES
    let myp5 = new p5(gameSketch);
  }  
});