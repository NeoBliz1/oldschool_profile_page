$.ajaxSetup({
  timeout: 500
});

var leafOrangeUrl, leafOrangeImg;
//check availability of the image's URLs
var animCoeff = 1;

//checking browser and platform, and if it is mobile then reduce fps 2 times

if (navigator.userAgent.match(/(iPod|iPhone|iPad)/) || navigator.userAgent.match(/(Android)/)) {
	if (!!window.chrome) {
		animCoeff = 2;      
	}
	else {
		animCoeff = 3;   
	}	 
}

var externalUrls = {
	leafOrangeUrl : 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/leaf-orange.png'	
}
var localUrls = {
	leafOrangeUrl : '../../img/projects_Img/leaf-orange.png'	
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
	var bubblesArr = [];//global bubbles array
	var carrotsArr = [];//global carrots array
	var bubbleSystem, carrotSystem, yellowAnt, blackAnt, redAnt;
	var whiteAnt, antSystem, YellowAnt, BlackAnt, RedAnt, WhiteAnt;	
	var leaves = [];
	var angleLeaves = []; 

	p.preload = function () {
		leafOrangeImg = p.loadImage(leafOrangeUrl);		 
	};

	p.setup = function() {  	

		p.angleMode(p.RADIANS);   
		// canvas size
		var canvas = p.createCanvas(600, 600);
		// canvas.style.width = '100%', canvas.style.height = '100%';
	
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
	p.mouseClicked = function() {
		bubbleSystem.addParticle(new p5.Vector(p.mouseX,p.mouseY));
	};

	p.startConfig = function () {	
		// There exist 4 fractions of ants.
		// Yellow, black, red, and white ants
		// They are competing for the carrots.		
		// Green grass is the background.
		// All ants crawling in different directions
		// If the ant find the food, it should take it and return to its hive
		// If the food turns into a hive, the ant population will be increased by 1.		
		
		
		//bubbles partical systems
		{
			p.Particle = function(position) {
					this.acceleration = new p5.Vector(0, -0.05);
					this.velocity = new p5.Vector(p.random(-1, 1), p.random(-1, 0));
					this.position = position.copy()
					this.timeToLive = 255;
					this.sizeOfBubble = 100;
					this.shakeBubbles = false;
					this.readyForBlastOff = false;
					this.fullBubble = false;
					this.countToStart = 0; //counter counts time to start
					this.bubbleHeightFactor = 0;		    
			};

			p.Particle.prototype.run = function() {
					this.display();
					this.shakeBubble();
					this.update();
			};

			p.Particle.prototype.update = function() {
					if (this.countToStart < 300 && !this.readyForBlastOff){
							this.countToStart += 1*animCoeff;
							this.shakeBubbles = true;
					}
					else if (this.countToStart >= 300 || this.readyForBlastOff){
							this.fullBubble = true;
							this.timeToLive -= 1*animCoeff;
							this.sizeOfBubble += 2*animCoeff;
							this.shakeBubbles = false;
					}
					
			};

			p.Particle.prototype.shakeBubble = function() {
					if (this.shakeBubbles && this.bubbleHeightFactor < 0.1){
							this.bubbleHeightFactor += 0.02*animCoeff;
					}
					else {
							this.bubbleHeightFactor = 0;
					}
			};

			p.Particle.prototype.display = function() {
					p.stroke(0, 0, 0, this.timeToLive);
					p.strokeWeight(1);
					p.noFill();
					p.ellipse(this.position.x, this.position.y, this.sizeOfBubble/2, this.sizeOfBubble/(2+this.bubbleHeightFactor));
					p.noStroke();
					p.fill(252, 252, 252, this.timeToLive);
					p.arc(this.position.x-10, this.position.y,this.sizeOfBubble/6, this.sizeOfBubble/(6+this.bubbleHeightFactor),111,260);
			};

			p.Particle.prototype.isDead = function() {
					if (this.timeToLive === 0) {
							return true;
					} else {
							return false;
					}
			};
			p.ParticleSystem = function() {
				 
			};

			p.ParticleSystem.prototype.addParticle = function(position) {
					this.origin = position.copy()
					bubblesArr.push(new p.Particle(this.origin));
			};
			p.ParticleSystem.prototype.run = function() {
					for (var i = bubblesArr.length-1; i >= 0; i--) {
							var pAnt = bubblesArr[i];
									pAnt.run();  
								 
							if (pAnt.isDead()) {
									bubblesArr.splice(i, 1);
							}
					}
			};

			bubbleSystem = new p.ParticleSystem();
		}
		//carrots partical systems
		{
			p.Carrot = function(position) {
					this.acceleration = new p5.Vector(0, -0.05);
					this.sizeOfCarrot = 20;
					this.position = position.copy()
					this.origin = new p5.Vector(0, 0);
					this.distToOrigin = 0;
					this.takeCarrotFlag = 0;//flag registred who taked the carrot
					this.readyCarryCarrot = false;
			};

			p.Carrot.prototype.run = function() {
					this.display();
			};

			p.Carrot.prototype.display = function() {
					p.noStroke();
					p.strokeWeight(1);
					p.fill(247, 170, 3);
					p.ellipse(this.position.x, this.position.y, this.sizeOfCarrot, this.sizeOfCarrot);
					p.fill(245, 237, 5);
					p.ellipse(this.position.x, this.position.y, this.sizeOfCarrot/2, this.sizeOfCarrot/2);
			};

			p.CarrotSystem = function() {
				 
			};

			p.CarrotSystem.prototype.addCarrot = function() {
					if (carrotsArr.length<4){
							this.origin = new p5.Vector(p.random(100,500),p.random(100,500));
							carrotsArr.push(new p.Carrot(this.origin));
					}
			};

			p.CarrotSystem.prototype.run = function() {
					for (var i = carrotsArr.length-1; i >= 0; i--) {
							var pAnt = carrotsArr[i];
							pAnt.run();
					}
					this.addCarrot();
			};

			carrotSystem = new p.CarrotSystem();
		}
		//ants partical systems
		{
			//main ants prototype
			{
				p.Ant = function(x, y) {
					this.power = 250;
					this.velocity = new p5.Vector(2*animCoeff, 0);//ant speed					
					this.carrotVelocity = new p5.Vector(0, 0);
					this.acceleration = new p5.Vector(0, 0);
					this.topspeed = 6*animCoeff;
					this.rotateAntSpeed = 0.2*animCoeff;
					this.position = new p5.Vector(x, y);
					this.carrotPosition = new p5.Vector(0, 0);
					this.readyForBlastOff = false;
					this.fullBubble = false;
					this.readyForMoving = false; //into the bubble
					this.readyCarryCarrot = false; //ready for taking the carrot
					this.outOfZone = false;//out from the carrot zone
					this.readyCarrotToSplice = false;
					this.antAdd = false;//adding ant after carrot in home
					this.distForBubble = 0;
					this.distForCarrot = 0;
					this.distToOrigin = 0;
					this.countCarryCarrot = 0;//countdown after carrot is thrown
					this.offV = 0;//coefficient offset in the bubble
					this.antSize = 0.27;//size of the ant
					this.antTransparency = 255;
					this.calculatedVectorDir = false;
					this.calculatedVectorDirCarrot = false;
					this.takeCarrotFlag = 0;//flag registred who taked the carrot
					this.normalizeDistForBubble = 0;//unit of vector of ant to the bubble
					this.normalizeDistForCarrot = 0;//unit of vector of ant to the carrot
					this.amplitudeLegsSwing = 10;
					this.speedLegsSwing = 1.2*animCoeff;
						//left three legs
						{
								this.ll1x = 0;
								this.ll2x = 0;
								this.ll3x = 0;
								this.ll1y = 0;
								this.ll2y = 0;
								this.ll3y = 0;
						}
						//right three legs
						{
								this.rl1x = 0;
								this.rl2x = 0;
								this.rl3x = 0;
								this.rl1y = 0;
								this.rl2y = 0;
								this.rl3y = 0;
						}
						this.antColor = p.color(255, 8, 255, this.antTransparency);
						this.antEyeColor = p.color(0, 0, 0, this.antTransparency);
						this.antRotateAngle = p.PI;
						this.turnSide = 0;
						this.antMovingAngleCoeff = 0;//used for update angle of velocity
						this.distanceByEdge = 20;
						this.addAntMovingAngle = true;//condition rotate ant on the edge
						this.stuckOfEdge = false; //which edge of stucking ant
						this.antStepsBackward = 0;
				};  

				p.Ant.prototype.display = function() {
						this.antAngle = this.velocity.heading();
						this.antColor.setAlpha(this.antTransparency);
						this.antEyeColor.setAlpha(this.antTransparency);
						p.push();
						p.translate(this.position.x+this.velocity.x*this.offV, this.position.y+this.velocity.y*this.offV);
						p.rotate(this.antAngle);
								p.push();
								p.rotate(this.antRotateAngle);
								 p.scale(this.antSize);
										p.noStroke();
										p.fill(this.antColor);
										//head
										p.ellipse(0, 0, 40, 35);
										//middle body
										p.ellipse(0+37, 0, 40, 28);
										//ass body
										p.ellipse(0+87, 0, 63, 46);
										//limbs
										{   p.stroke(0,0,0,this.antTransparency);
												p.strokeWeight(2);
												/**legs**/
												//left three legs
												{
												p.push();
														p.translate(17,0);
														{
														//first leg    
														p.line(10, this.ll1y+10, this.ll1x, this.ll1y+30);
														p.line(this.ll1x, this.ll1y+30, this.ll1x-15, this.ll1y+40);
														p.line(this.ll1x-15, this.ll1y+40, this.ll1x-23, this.ll1y+40);
														//second leg
														p.push();
														p.translate(11,2);
														p.line(10, this.ll2y+10, this.ll2x+13, this.ll2y+30);
														p.line(this.ll2x+13, this.ll2y+30, this.ll2x+5, this.ll2y+40);
														p.line(this.ll2x+5, this.ll2y+40, this.ll2x-2, this.ll2y+40);
														p.pop();
														//third leg
														p.push();
														p.translate(41,0);
														p.scale(-1,1);
														
														p.line(10, this.ll3y+10, this.ll3x+10, this.ll3y+30);
														p.line(this.ll3x+10, this.ll3y+30, this.ll3x, this.ll3y+40);
														p.line(this.ll3x, this.ll3y+40, this.ll3x-7, this.ll3y+40);
														p.pop();
														
												}
												p.pop();
												}
												//right three legs
												{
												
												p.push();
														p.scale(1,-1);
														p.translate(17,0);
														{
														//first leg    
														p.line(10, this.rl1y+10, this.rl1x+10, this.rl1y+30);
														p.line(this.rl1x+10, this.rl1y+30, this.rl1x-5, this.rl1y+40);
														p.line(this.rl1x-5, this.rl1y+40, this.rl1x-12, this.rl1y+40);
														//second leg
														p.push();
														p.translate(11,2);
														p.line(10, this.rl2y+10, this.rl2x+6, this.rl2y+30);
														p.line(this.rl2x+6, this.rl2y+30, this.rl2x-0, this.rl2y+40);
														p.line(this.rl2x-0, this.rl2y+40, this.rl2x-6, this.rl2y+40);
														p.pop();
														//third leg
														p.push();
														p.translate(41,0);
														p.scale(-1,1);
														p.line(10, this.rl3y+10, this.rl3x, this.rl3y+30);
														p.line(this.rl3x, this.rl3y+30, this.rl3x-10, this.rl3y+40);
														p.line(this.rl3x-10, this.rl3y+40, this.rl3x-17, this.rl3y+40);
														p.pop();
														
												}
												p.pop();
												}
												/**mandibles**/
												//right
												{
												this.rmX = 0;
												this.rmY = 0;
												p.push();
														p.translate(-24,-7);
														p.scale(0.11);
														p.rotate(0.29);
														p.noStroke();
														p.strokeWeight(4);
														p.beginShape(); 
														p.curveVertex(this.rmX-29,this.rmY-11);
														p.curveVertex(this.rmX+50,this.rmY-13);
														p.curveVertex(this.rmX+90,this.rmY-43);
														p.curveVertex(this.rmX+78,this.rmY-61);
														p.curveVertex(this.rmX-31,this.rmY-64);
														p.curveVertex(this.rmX-87,this.rmY-22);
														p.curveVertex(this.rmX-103,this.rmY+18);
														p.curveVertex(this.rmX-100,this.rmY+62);
														p.curveVertex(this.rmX-29,this.rmY-11);
														p.curveVertex(this.rmX+50,this.rmY-13);
														p.curveVertex(this.rmX+90,this.rmY-43); 
														p.endShape();
												p.pop();
												p.noStroke();
												}
												//left
												{
												this.lmX = 0;
												this.lmY = 0;
												p.push();
														p.translate(-24,8);
														p.scale(0.11);
														p.scale(1,-1);
														p.rotate(0.29);
														p.noStroke();
														p.strokeWeight(4);
														p.beginShape(); 
														p.curveVertex(this.lmX-29,this.lmY-11);
														p.curveVertex(this.lmX+50,this.lmY-13);
														p.curveVertex(this.lmX+90,this.lmY-43);
														p.curveVertex(this.lmX+78,this.lmY-61);
														p.curveVertex(this.lmX-31,this.lmY-64);
														p.curveVertex(this.lmX-87,this.lmY-22);
														p.curveVertex(this.lmX-103,this.lmY+18);
														p.curveVertex(this.lmX-100,this.lmY+62);
														p.curveVertex(this.lmX-29,this.lmY-11);
														p.curveVertex(this.lmX+50,this.lmY-13);
														p.curveVertex(this.lmX+90,this.lmY-43); 
														p.endShape();
												p.pop();
												p.noStroke();
												}
												
										}
										/**eyes**/
										//left eye
										{
											p.push();
											p.fill(this.antEyeColor);
											p.translate(-6,42);
											p.scale(0.55);
													p.beginShape(); 
													p.curveVertex(22,-92);
													p.curveVertex(15,-109);
													p.curveVertex(-11,-101);
													p.curveVertex(-19,-90);
													p.curveVertex(22,-92);
													p.curveVertex(15,-109);
													p.curveVertex(-11,-101); 
													p.endShape();
											p.pop();
										p.fill(this.antColor);
										}
										//right eye
										{
											p.push();
											p.fill(this.antEyeColor);
											p.translate(-6,-42);
											p.scale(0.55);
											p.scale(1,-1);
													p.beginShape(); 
													p.curveVertex(22,-92);
													p.curveVertex(15,-109);
													p.curveVertex(-11,-101);
													p.curveVertex(-19,-90);
													p.curveVertex(22,-92);
													p.curveVertex(15,-109);
													p.curveVertex(-11,-101); 
													p.endShape();
											p.pop();
											p.fill(this.antColor);
										}
								p.pop();
						p.pop();
				};

				p.Ant.prototype.run = function () {
						this.movingLegs();
						this.updateStartAngle();
						this.display();
						this.updatePosition();
						this.checkObstacle();
						this.obstacleOvercome();
						this.checkBubbles();
						this.checkCarrots();
						this.antBlastOff();//ant blast off and disappearing with a bubble
						this.movingIntoAnthill();
				};

				p.Ant.prototype.movingLegs = function () {
						if (this.c1<this.amplitudeLegsSwing){
								this.c1 += this.speedLegsSwing;
								this.ll1x += this.speedLegsSwing;
								this.ll2x -= this.speedLegsSwing;
								this.ll3x -= this.speedLegsSwing;
								this.rl1x -= this.speedLegsSwing;
								this.rl2x += this.speedLegsSwing;
								this.rl3x += this.speedLegsSwing;
						}
						else if (this.ll1x>0){
								this.ll1x -= this.speedLegsSwing;
								this.ll2x += this.speedLegsSwing;
								this.ll3x += this.speedLegsSwing;
								this.rl1x += this.speedLegsSwing;
								this.rl2x -= this.speedLegsSwing;
								this.rl3x -= this.speedLegsSwing;
						}
						else {
								this.c1 =0;
						}
						
						
						//println(this.ll1x);
				};

				p.Ant.prototype.updateStartAngle = function () {
						//rotate start moving velocity ant equal antAngle
						while(this.antMovingAngleCoeff<1){
								this.velocity.rotate(this.antAngle);
								this.antMovingAngleCoeff++;
						}
				};

				p.Ant.prototype.updatePosition = function () {
						//update angle of moving
						if (!this.readyForMoving && !this.readyCarryCarrot){
							if(!this.velocityBackward){
								this.velocity.add(this.acceleration);
								this.position.add(this.velocity);
								this.acceleration.mult(0);
							}
							else {
								this.velocity.sub(this.acceleration);
								this.position.sub(this.velocity);
								this.acceleration.mult(0);
								this.antStepsBackward += 1*animCoeff;
								// console.log(this.antStepsBackward)
								if (this.antStepsBackward > 15) {
									this.turnSide = p.random(0,1);
									if (this.turnSide>0.5){
										this.velocity.rotate(p.random(0,2));								
									}
									else {
										this.velocity.rotate(p.random(-2,0));								
									}			
									this.velocityBackward = false;
									this.antStepsBackward = 0;
								}
							}
						}
				};

				p.Ant.prototype.checkObstacle = function () {
						//find the distance between center of the canvas and current point
						var v1 = new p5.Vector(this.position.x, this.position.y);
						var v2 = new p5.Vector(p.width/2, p.height/2);
						this.d=v1.dist(v2);
					 
						//checking what is the edge of canvas we stuck
						if (this.position.x < this.distanceByEdge+10 || this.position.x > p.width-this.distanceByEdge || this.position.y < this.distanceByEdge+20 || this.position.y > p.height-this.distanceByEdge || this.d>340 && !this.readyCarryCarrot)
						{
							this.stuckOfEdge = true;						
						}
						else{
							this.stuckOfEdge = false;								
						}
						
				};
				
				p.Ant.prototype.obstacleOvercome = function () {
						if (this.stuckOfEdge){							
							this.velocityBackward=true;
						}						
				};

				p.Ant.prototype.checkBubbles = function (){
						for (var i=0;i<bubblesArr.length;i++){
								
								//calculated the distance between two points, point of ant and point of the bubble
								this.distForBubble = this.position.dist(bubblesArr[i].position);								
								
								//moving ant into the bubble
								if (this.distForBubble>0 && this.distForBubble<30 && !bubblesArr[i].fullBubble || this.fullBubble){
										//calculated unit of vector to the bubble										
										while (!this.calculatedVectorDir){
											this.normalizeDistForBubble=p5.Vector.sub(this.position, bubblesArr[i].position);
											this.normalizeDistForBubble.normalize();
											this.calculatedVectorDir=true;
										}
										this.readyForMoving = true;
										if (this.distForBubble>10){
											this.position.sub(this.normalizeDistForBubble);
										}
										else
										{											
											var pA = bubblesArr[i].position.copy();											
											bubblesArr[i].readyForBlastOff = true;
											this.readyForBlastOff = true;
											this.position.set(pA);											
											this.offV = 10.1;
											this.fullBubble = true;
										}
									 
								}
								else {
										this.readyForMoving = false;
								}
								
						}
						
				};

				p.Ant.prototype.antBlastOff = function (){
						if (this.readyForBlastOff){
							this.antSize += 0.0035*animCoeff;//size of the ant
							this.antTransparency -= 1*animCoeff;							
						}
				};

				p.Ant.prototype.checkCarrots = function (){
					this.distFlag=0;
					for (var i=0;i<carrotsArr.length;i++){								
						//calculated the distance between two points, point of ant and point of the carrot
						this.distForCarrot = this.position.dist(carrotsArr[i].position);
						if (this.distForCarrot>30){
							this.distFlag +=1
						}																			
					}					
					if (this.distFlag!==4){
						for (var i=0;i<carrotsArr.length;i++){								
							//calculated the distance between two points, point of ant and point of the carrot
							this.distForCarrot = this.position.dist(carrotsArr[i].position);
							//carrot interception algorithm
							if (this.distForCarrot>0 && this.distForCarrot<25 && this.takeCarrotFlag === carrotsArr[i].takeCarrotFlag){
								//calculated unit of vector to the home										
								while (!this.calculatedVectorDirCarrot){
									this.normalizeDistForCarrot=p5.Vector.sub(this.position,this.origin);
									this.normalizeDistForCarrot.normalize();												
									this.velocity = this.normalizeDistForCarrot.copy();
									this.normalizeDistForCarrot.mult(animCoeff);//ant speed with carrot
									this.velocity.mult(-1);
									carrotsArr[i].takeCarrotFlag +=1;
									this.takeCarrotFlag +=1;
									this.calculatedVectorDirCarrot=true;																			
									this.distToOrigin = this.position.dist(this.origin);																							
								}
								this.carrotVelocity = this.velocity.copy();
								this.carrotVelocity.mult(20);
								this.carrotPosition = this.position.copy();
								this.carrotPosition = p5.Vector.add(this.carrotPosition,this.carrotVelocity);
								carrotsArr[i].position = this.carrotPosition.copy()
								carrotsArr[i].origin = this.origin.copy();																		
								carrotsArr[i].distToOrigin = carrotsArr[i].position.dist(carrotsArr[i].origin);																				
								this.readyCarryCarrot = true;	
								//if carrot into the anthill splice carrot from array
								if (carrotsArr[i].distToOrigin>0 && carrotsArr[i].distToOrigin<10){
									this.readyCarryCarrot = false;
									this.outOfZone=true;
									this.calculatedVectorDirCarrot=false;
									this.antAdd = true;
									carrotsArr.splice(i,1);
								}															
							} 		//intersection
							else if (this.distForCarrot>0 && this.distForCarrot<25 && this.takeCarrotFlag === 0){
								this.takeCarrotFlag = carrotsArr[i].takeCarrotFlag;										
								this.calculatedVectorDirCarrot=false;
								// console.log('2')
							}						
						}												
					}
					else if(this.readyCarryCarrot){
						this.readyCarryCarrot = false;
						this.outOfZone=true;
						this.calculatedVectorDirCarrot=false
					}
					else if (this.outOfZone){
						this.countCarryCarrot++;
						if (this.countCarryCarrot>100){
							this.takeCarrotFlag = 0;
							this.countCarryCarrot = 0;
							this.outOfZone=false;
							this.calculatedVectorDirCarrot=false;
							this.speedRestart = true;
						}						
					}
					else if (this.speedRestart) {
						// console.log('speedRestart')
						// console.log(this.takeCarrotFlag)
						this.velocity = new p5.Vector(2*animCoeff, 0);//ant speed	
						this.speedRestart = false;
					}									
				};


				p.Ant.prototype.isDead = function() {
						if (this.antTransparency === 0) {
								return true;
						} else {
								return false;
						}
				};

				p.Ant.prototype.movingIntoAnthill = function (){
						//moving carrot into the anthill
						if (this.readyCarryCarrot && this.distToOrigin>30){
							this.position.sub(this.normalizeDistForCarrot);															
							this.distToOrigin = this.position.dist(this.origin);															
						}
						else {
							this.readyCarryCarrot = false;																			
						}
				};		    
			}

			//yellow ants prototype
			{
				p.YellowAnt = function(position) {
					p.Ant.call(this, position);
					this.origin = new p5.Vector(550,50);
					this.antColor = p.color(255, 255, 20, this.antTransparency);
					this.position = position.copy()
					this.yellowAnts = [];
					this.antAngle = p.random(0,6);
				};

				p.YellowAnt.prototype = Object.create(p.Ant.prototype);
				p.YellowAnt.prototype.constructor = YellowAnt;

				p.YellowAnt.prototype.addAnt = function() {
					this.yellowAnts.push(new YellowAnt(new p5.Vector(509, 100)));
				};

				yellowAnt = new p.YellowAnt(new p5.Vector(200, 200));
			}

			//black ants prototype
			{
				p.BlackAnt = function(position) {
					this.origin = new p5.Vector(50,50);
					p.Ant.call(this, position);
					this.antColor = p.color(0, 0, 0,  this.antTransparency);
					this.antEyeColor = p.color(0, 231, 252,  this.antTransparency);
					this.position = position.copy()
					this.blackAnts = [];
					this.antAngle = p.random(0,6);
				};

				p.BlackAnt.prototype = Object.create(p.Ant.prototype);
				p.BlackAnt.prototype.constructor = BlackAnt;


				p.BlackAnt.prototype.addAnt = function() {
					 this.blackAnts.push(new BlackAnt(new p5.Vector(100, 450)));
				};
				
				blackAnt = new p.BlackAnt(new p5.Vector(200, 200));
			}

			//red ants prototype
			{
				p.RedAnt = function(position) {
						this.origin = new p5.Vector(50,550);
						p.Ant.call(this, position);
						this.antColor = p.color(255, 0, 0, this.antTransparency);
						this.antEyeColor = p.color(0, 0, 0, this.antTransparency);
						this.position = position.copy()
						this.redAnts = [];
						this.antAngle = p.random(0,6);
				};
				p.RedAnt.prototype = Object.create(p.Ant.prototype);
				p.RedAnt.prototype.constructor = RedAnt;

				p.RedAnt.prototype.addAnt = function() {
					this.redAnts.push(new RedAnt(new p5.Vector(100, 450)));
				};

				redAnt = new p.RedAnt(new p5.Vector(200, 200));
			}

			//White ants prototype
			{
				p.WhiteAnt = function(position) {
						this.origin = new p5.Vector(550,550);
						p.Ant.call(this, position);
						this.antColor = p.color(255, 255, 255, this.antTransparency);
						this.antEyeColor = p.color(0, 0, 0, this.antTransparency);
						this.position = position.copy()
						this.whiteAnts = [];
						this.antAngle = p.random(0,6);
				};
				p.WhiteAnt.prototype = Object.create(p.Ant.prototype);
				p.WhiteAnt.prototype.constructor = WhiteAnt;

				p.WhiteAnt.prototype.addAnt = function() {
					this.whiteAnts.push(new WhiteAnt(new p5.Vector(450, 450)));
				};

				whiteAnt = new p.WhiteAnt(new p5.Vector(200, 200));
			}

			//system of ants
			{
				p.AntSystem = function() {
						this.numberBlackAnts = 1;
						this.numberYellowAnts = 1;
						this.numberRedAnts = 1;
						this.numberWhiteAnts = 1;
				};

				p.AntSystem.prototype.run = function(){
						bubbleSystem.run();
						
						for (var i = yellowAnt.yellowAnts.length-1; i >= 0; i--) {
								var pAnt = yellowAnt.yellowAnts[i];
								pAnt.run();
								if (pAnt.antAdd){
										this.numberYellowAnts++;
										pAnt.antAdd = false;
								}
								if (pAnt.isDead()) {
										yellowAnt.yellowAnts.splice(i, 1);
								}
						}
						for (var i = blackAnt.blackAnts.length-1; i >= 0; i--) {
								var pAnt = blackAnt.blackAnts[i];
								pAnt.run();
								if (pAnt.antAdd){
										this.numberBlackAnts++;
										pAnt.antAdd = false;
								}
								if (pAnt.isDead()) {
										blackAnt.blackAnts.splice(i, 1);
								}
						}
						for (var i = redAnt.redAnts.length-1; i >= 0; i--) {
								var pAnt = redAnt.redAnts[i];
								pAnt.run();
								if (pAnt.antAdd){
										this.numberRedAnts++;
										pAnt.antAdd = false;
								}
								if (pAnt.isDead()) {
										redAnt.redAnts.splice(i, 1);
								}
						}
						for (var i = whiteAnt.whiteAnts.length-1; i >= 0; i--) {
								var pAnt = whiteAnt.whiteAnts[i];
								pAnt.run();
								if (pAnt.antAdd){
										this.numberWhiteAnts++;
										pAnt.antAdd = false;
								}
								if (pAnt.isDead()) {
										whiteAnt.whiteAnts.splice(i, 1);
								}
						}
						this.addAnt();
				};

				p.AntSystem.prototype.addAnt = function(){
						if (this.numberYellowAnts>0){
								yellowAnt.yellowAnts.push(new p.YellowAnt(new p5.Vector(525, 72)));
								this.numberYellowAnts--;
						} 
						if (this.numberBlackAnts>0){
								blackAnt.blackAnts.push(new p.BlackAnt(new p5.Vector(79, 66)));
								this.numberBlackAnts--;
						}
						if (this.numberRedAnts>0){
								redAnt.redAnts.push(new p.RedAnt(new p5.Vector(75, 530)));
								this.numberRedAnts--;
						}
						if (this.numberWhiteAnts>0){
								whiteAnt.whiteAnts.push(new p.WhiteAnt(new p5.Vector(519, 540)));
								this.numberWhiteAnts--;
						}
				};
				antSystem = new p.AntSystem();
			}
		}
		//starting conditionals
		{
			// We start off with an empty systems array			
			for (var i = 0; i < 20; i++) {
					leaves.push(new p5.Vector(p.random(0, p.width/2), p.random(0, p.height/2)));
					angleLeaves.push(p.random(0, 180));
			}			
		}
		//background function
		{
			p.backgroundInit = function (){
				p.background(184, 219, 9);
				if (animCoeff!==3) {
					//leaves
					for (var i = 0; i < leaves.length; i++) {
						p.push();
						p.translate(316,430);
						p.rotate(angleLeaves[i]);
						p.image(leafOrangeImg, leaves[i].x, leaves[i].y, 30, 30);
						p.pop();
					}
				}					
				//text
				p.fill(0, 0, 0);
				if (animCoeff!==1) {
					p.textFont('sans-serif');
					p.textSize(14);
					p.text("Tap canvas to create bubbles",176,17);
				} else {
					p.textFont('sans-serif');
					p.textSize(14);
					p.text("Press any mouse button to create bubbles",176,17);
				}				
				
			};
		}
		//anthills
				{
				//calculating random coordinates for sticks of the anthills
				var point1Arr = [];
				var point2Arr = [];
				var squareSize = 110;
				var radiusEdgeAnthill = 91;
				for (var i=0; i<500; i++){
						var p1 = new p5.Vector(p.random(0,squareSize),p.random(0,squareSize));
						let v1 =  new p5.Vector(0,0);						 
						var pDist = v1.dist(p1);
						if (pDist>radiusEdgeAnthill){
								point1Arr.push(p1);
								var p2 = new p5.Vector(p.random(-5,5),p.random(-5,5));
								var m1 = p.random(-1,1);
								if (m1<0){
										p2 = p1.sub(p2);
								}
								else {
										p2 = p1.add(p2);
										
								}
								point2Arr.push(p2);
							 
						}
						
				}
				//println(point1Arr[1]);
				//println(point2Arr[1]);

				
				p.anthillsDraw = function () {
						//bottom right angle
						{
						p.push();
								p.translate(419,417);
								p.scale(1.21);
								p.noStroke();
								p.fill(204, 195, 179);
								p.beginShape(); 
										p.curveVertex(114,113);
										p.curveVertex(34,150);
										p.curveVertex(71,153);
										p.curveVertex(153,150);
										p.curveVertex(153,64);
										p.curveVertex(148,47);
										p.curveVertex(114,113);
										p.curveVertex(45,143);
										p.curveVertex(71,153); 
								p.endShape();
								p.stroke(0);
								p.strokeWeight(1);
								//sticks of the anthills 
								{
										p.push();
										p.translate(54,51);
								for (var i=0;i<point1Arr.length;i++){
										p.line(point1Arr[i].x,point1Arr[i].y,point2Arr[i].x,point2Arr[i].y);
								}
										p.pop();
								}
								
						p.pop();
						}
						//bottom left angle
						{
						p.push();
								p.translate(184,418);
								p.scale(-1,1);
								p.scale(1.21);
								p.noStroke();
								p.fill(143, 89, 71);
								p.beginShape(); 
										p.curveVertex(114,113);
										p.curveVertex(34,150);
										p.curveVertex(71,153);
										p.curveVertex(153,150);
										p.curveVertex(153,64);
										p.curveVertex(148,47);
										p.curveVertex(114,113);
										p.curveVertex(45,143);
										p.curveVertex(71,153); 
								p.endShape();
								p.stroke(0);
								p.strokeWeight(1);
								//sticks of the anthills 
								{
										p.push();
										p.translate(54,51);
								for (var i=0;i<point1Arr.length;i++){
										p.line(point1Arr[i].x,point1Arr[i].y,point2Arr[i].x,point2Arr[i].y);
								}
										p.pop();
								}
								
						p.pop();
						}
						//top left angle
						{
						p.push();
								p.translate(183,184);
								p.scale(-1,-1);
								p.scale(1.21);
								p.noStroke();
								p.fill(112, 93, 57);
								p.beginShape(); 
										p.curveVertex(114,113);
										p.curveVertex(34,150);
										p.curveVertex(71,153);
										p.curveVertex(153,150);
										p.curveVertex(153,64);
										p.curveVertex(148,47);
										p.curveVertex(114,113);
										p.curveVertex(45,143);
										p.curveVertex(71,153); 
								p.endShape();
								p.stroke(0);
								p.strokeWeight(1);
								//sticks of the anthills 
								{
										p.push();
										p.translate(54,51);
								for (var i=0;i<point1Arr.length;i++){
										p.line(point1Arr[i].x,point1Arr[i].y,point2Arr[i].x,point2Arr[i].y);
								}
										p.pop();
								}
								
						p.pop();
						}
						//top right angle
						{
						p.push();
								p.translate(417,182);
								p.scale(1,-1);
								p.scale(1.21);
								p.noStroke();
								p.fill(176, 166, 60);
								p.beginShape(); 
										p.curveVertex(114,113);
										p.curveVertex(34,150);
										p.curveVertex(71,153);
										p.curveVertex(153,150);
										p.curveVertex(153,64);
										p.curveVertex(148,47);
										p.curveVertex(114,113);
										p.curveVertex(45,143);
										p.curveVertex(71,153); 
								p.endShape();
								p.stroke(0);
								p.strokeWeight(1);
								//sticks of the anthills 
								{
										p.push();
										p.translate(54,51);
								for (var i=0;i<point1Arr.length;i++){
										p.line(point1Arr[i].x,point1Arr[i].y,point2Arr[i].x,point2Arr[i].y);
								}
										p.pop();
								}
								
						p.pop();
						}
				};    
		}
	};
	
	p.draw = function() {   
		p.backgroundInit();
		antSystem.run();
		carrotSystem.run();
		p.anthillsDraw();
		// let fps = p.frameRate();  
		// p.fill(255);    
		// p.textSize(32);
		// p.text("FPS: "+fps.toFixed(2), 40, 80);    
	};
};

//check availability of the code txt version URL
var checkTxtUrl = function () {
	var txt_url = 'https://res.cloudinary.com/deah4rwon/raw/upload/v1606018712/js/code_project_ants_colony_bcyzhb.txt'; 
	$.ajax({
		url:txt_url,
		type:'HEAD',
		error: function(){
			$('.snippetWrapper').load('../../txt/code_project_ants_colony.txt');
		},
		success: function(){
			$('.snippetWrapper').load('https://res.cloudinary.com/deah4rwon/raw/upload/v1606018712/js/code_project_ants_colony_bcyzhb.txt');
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
	if (ajaxComplete === 3){
		p5.disableFriendlyErrors = true; // disables FES
		let myp5 = new p5(gameSketch);
	}  
});