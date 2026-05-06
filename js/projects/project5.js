$.ajaxSetup({
  timeout: 500
});

/*This programm based on the project: Hoppy Bever Extreme
In this version has added next updates:
 - was change bever to the OhNoesGuy - done
 - was add sounds for OhNoesGuy hops - done
 - was add change gems to the gem - done
 - was add the screen of choose username  - done
 - was add level with holes in the ground - done
 - was add level include appearance enemies - done
 - was add change day and night - done
 - was add score screen - done
 - was add moving world acceleration*/

var grassBlockUrl, OhNoesHmmImgUrl, OhNoesHappyImgUrl, OhNoesImgUrl, GemOrangeImgUrl, piceratopsSaplingImgUrl, muteBtnImgUrl, unMuteBtnImgUrl, giantYahUrl, boom2Url, hitThudUrl, battleSwingUrl;
//check availability of the image's URLs

var externalUrls = {
  grassBlockUrl : 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/cute/GrassBlock.png',
  OhNoesHmmImgUrl : 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/creatures/OhNoes-Hmm.png',
  OhNoesHappyImgUrl : 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/creatures/OhNoes-Happy.png',
  OhNoesImgUrl : 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/creatures/OhNoes.png',
  GemOrangeImgUrl : 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/cute/GemOrange.png',
  piceratopsSaplingImgUrl : 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/piceratops-sapling.png',
  muteBtnImgUrl : 'https://res.cloudinary.com/deah4rwon/image/upload/v1602394173/imgs/projects_imgs/PikPng.com_mute-button-_rqrhc1.png', 
  unMuteBtnImgUrl : 'https://res.cloudinary.com/deah4rwon/image/upload/v1602394173/imgs/projects_imgs/PikPng.com_unmute-button-_aj0rii.png',
  giantYahUrl : 'https://res.cloudinary.com/deah4rwon/video/upload/v1602394241/sounds/giant-yah_w1pvqp.mp3',
  boom2Url : 'https://res.cloudinary.com/deah4rwon/video/upload/v1602394240/sounds/boom2_phvv5e.mp3',
  hitThudUrl : 'https://res.cloudinary.com/deah4rwon/video/upload/v1602394241/sounds/hit-thud_zcsdgd.mp3',
  battleSwingUrl : 'https://res.cloudinary.com/deah4rwon/video/upload/v1602394240/sounds/battle-swing_eu8vb0.mp3'
}
var localUrls = {
  grassBlockUrl : '../../img/projects_Img/GrassBlock.png',
  OhNoesHmmImgUrl : '../../img/projects_Img/OhNoes-Hmm.png',
  OhNoesHappyImgUrl : '../../img/projects_Img/OhNoes-Happy.png',
  OhNoesImgUrl : '../../img/projects_Img/OhNoes.png',
  GemOrangeImgUrl : '../../img/projects_Img/GemOrange.png',
  piceratopsSaplingImgUrl : '../../img/projects_Img/piceratops-sapling.png',
  muteBtnImgUrl : '../../img/projects_Img/PikPng.com_mute-button-.png', 
  unMuteBtnImgUrl : '../../img/projects_Img/PikPng.com_unmute-button-.png',
  giantYahUrl : '../../sounds/giant-yah.mp3',
  boom2Url : '../../sounds/boom2.mp3',
  hitThudUrl : '../../sounds/hit-thud.mp3',
  battleSwingUrl : '../../sounds/battle-swing.mp3'      
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

//main game function
let gameSketch = function(p) {
  var chosenNick = "Unknown";
  var scene = 1;
  var fall_hole = 0;
  var qGems = 40;  
  var speed = 1;
  var soundOnce = 1, standOnce = 1; //a variables which allows sounds once 
  var startA = 0; //start main grass
  var start2for = 25;//number of blocks after which holes will appear
  var Dragons = [];
  var gems = [];
  var grassXs = [];
  var grassX1s = [];
  var holeXs = [];
  //nickNames
  var nickNames = ["Cuddles",
    "Cloud",
    "Machine",
    "Dealer",
    "Princess",
    "Diamond",
    "Ducky",
    "Thunder",
    "Hooks",
    "Ziggy"
  ];
  let giantYah, boom2, hitThud, battleSwing;
  let grassBlock, OhNoesHmmImg, OhNoesHappyImg, OhNoesImg, GemOrangeImg, piceratopsSaplingImg, muteBtnImg, unMuteBtnImg;
  
  p.preload = function () {

  };

  p.setup = function() {
    grassBlock = p.loadImage(grassBlockUrl);
    OhNoesHmmImg = p.loadImage(OhNoesHmmImgUrl);
    OhNoesHappyImg = p.loadImage(OhNoesHappyImgUrl);
    OhNoesImg = p.loadImage(OhNoesImgUrl);
    GemOrangeImg = p.loadImage(GemOrangeImgUrl);
    piceratopsSaplingImg = p.loadImage(piceratopsSaplingImgUrl);
    muteBtnImg = p.loadImage(muteBtnImgUrl); 
    unMuteBtnImg = p.loadImage(unMuteBtnImgUrl);
    giantYah = p.loadSound(giantYahUrl);
    boom2 = p.loadSound(boom2Url);
    hitThud = p.loadSound(hitThudUrl);
    battleSwing = p.loadSound(battleSwingUrl);
    // canvas size
    var canvas = p.createCanvas(400, 400);
    // canvas.style.width = '100%', canvas.style.height = '100%';
  
    // Move the canvas so it’s inside our <div id='canvas-holder'>.
    canvas.parent('canvasHolderSmall');
      
    // smooth edges
    p.smooth();
      
    // limit the number of frames per second
    p.frameRate(60);
    //creating color array
    
    p.colorMode(p.RGB);    

    p.startConfig();
  };

  p.startConfig = function () {    
    //hero_part
    p.ohNoesGuy = function(x, y) {
      this.x = x;
      this.y = y;
      this.width = 40;
      this.height = 40;
      this.img = OhNoesHmmImg;
      this.gems = 0;
      this.dragons = 0;
      this.worldSpeed = 0;
      this.isStand = 1;
    };

    p.ohNoesGuy.prototype.draw = function() {
      p.fill(255, 0, 0);
      this.y = p.constrain(this.y, 0, 450);
      p.image(this.img, this.x, this.y, this.width, this.height);
    };

    p.ohNoesGuy.prototype.hop = function() {
      this.img = OhNoesHmmImg;
      this.y -= 5;
    };

    p.ohNoesGuy.prototype.stand = function() {
      this.img = OhNoesHappyImg;      
    };

    p.ohNoesGuy.prototype.fall = function() {
      this.img = OhNoesImg;       
      this.y += 5;      
    };
    //check thi gem grab
    p.ohNoesGuy.prototype.checkForGemGrab = function(gem) {
      if ((gem.x >= this.x && gem.x <= (this.x + 40)) &&
        (gem.y >= this.y && gem.y <= (this.y + 40))) {
        gem.x = p.random(gem.x*qGems,2000);
        gem.y = p.random(0,250);
        this.gems++;
        giantYah.play();
        this.worldSpeed++;        
        if  (this.worldSpeed === 2) {
          this.worldSpeed =0;
          speed += 0.1;
        }
        
      }
    };

    p.ohNoesGuy.prototype.checkForDragonEat = function(Dragon) {
      if ((Dragon.x >= this.x && Dragon.x <= (this.x + 20)) &&
        (Dragon.y >= this.y && Dragon.y <= (this.y + 20))) {
        this.dragons=1;
        boom2.play();
      }
    };

    OhNoesGuy = new p.ohNoesGuy(116, 300);

    p.Gem = function(x, y) {
      this.x = x;
      this.y = y;
      this.img = GemOrangeImg;
    };

    p.Gem.prototype.draw = function() { 
      p.fill(89, 71, 0);
      p.rectMode(p.CENTER);
      p.image(this.img, this.x, this.y, 20, 30);
    };

    p.Dragon = function(x, y) {
      this.x = x;
      this.y = y;
      this.img1 = piceratopsSaplingImg;
    };
    
    p.Dragon.prototype.draw = function() {
      p.fill(89, 71, 0);
      p.rectMode(p.CENTER);
      p.image(this.img1, this.x, this.y, 40, 40);
    };

    p.GroundBlock = function (x){
      this.x = x;
      this.y = p.height*0.90;
      this.width = p.width/10+5;
      this.height = p.height*0.10;
      this.img = grassBlock;
      this.imgY = p.height*0.85;      
    }

    p.GroundBlock.prototype.draw = function() {
      p.image(this.img, this.x, this.imgY, 40, 20);
      p.fill(130, 79, 43);
      p.noStroke();
      p.rectMode(p.CORNER);
      p.rect(this.x, this.y, this.width-4.5, this.height);
    };
    
    for (var i = 0; i < 100; i++) {  
      Dragons.push(new p.Dragon(i * p.random(100, 200) + 600, p.random(20, 260)));
    }

    for (var i = 0; i < 40; i++) {
      var xGem = i * qGems + 300;
      gems.push(new p.Gem(xGem, p.random(20, 260)));
    }
    
    //ground    
    for (var i = 0; i < 25; i++) { 
      grassXs.push(new p.GroundBlock(i*20));
    }

    for (var j = 0; j < 50; j++) { 
      grassX1s.push(new p.GroundBlock(j*20));
    }

    for (var i; i < 100; i++) { 
      holeXs.push(p.random(0,100));
    }

    //Buttons
    p.button = function (config) {
      this.x = config.x || 0;
      this.y = config.y || 0;
      this.width = config.width ||100;
      this.height = config.height ||30;
      this.muteState = false;
      this.img = config.img;
      this.label = config.label || "click";
      this.strokeColor = config.strokeColor || p.noStroke();
      this.color = config.color || p.color(87, 189, 207);
      this.onClick = config.onClick || function() {};      
    };

    p.button.prototype.isMouseInside = function() {
      return p.mouseX > this.x &&
      p.mouseX < (this.x + this.width) &&
      p.mouseY > this.y &&
      p.mouseY < (this.y + this.height);
    };

    p.button.prototype.handleMouseClick = function() {
      if (this.isMouseInside()) {
        this.onClick();
      }
    };

    p.button.prototype.draw = function() {
      p.stroke(this.strokeColor);
      p.fill(this.color); 
      p.rect(this.x, this.y, this.width, this.height, 24);
      p.fill(0, 0, 0);
      p.textSize(22);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(this.label, this.x+this.width/2.0, this.y+this.height/2.0);          
    };

    p.button.prototype.drawImgBtn = function() {
      p.image(this.img, this.x, this.y, this.width, this.height);           
    };



    var x1 = 39;
    var y1 = 129;

    btn1 = new p.button({
      x: x1,
      y: y1,
      label: nickNames[0],
      strokeColor:  p.color(113, 179, 7),
      color: p.color(113, 179, 7),
      onClick: function() {
        btn1.color = p.color(255, 255, 255);
        chosenNick = btn1.label;
      }
    });

    btn2 = new p.button({
      x: x1*4,
      y: y1,
      label: nickNames[1],
      strokeColor:  p.color(113, 179, 7),
      color: p.color(113, 179, 7),
      onClick: function() {
        btn2.color = p.color(255, 255, 255);
        chosenNick = btn2.label;
      }
    });

    btn3 = new p.button({
      x: x1*7,
      y: y1,
      label: nickNames[2],
      strokeColor:  p.color(113, 179, 7),
      color: p.color(113, 179, 7),
      onClick: function() {
        btn3.color = p.color(255, 255, 255);
        chosenNick = btn3.label;
      }
    });

    btn4 = new p.button({
      x: x1,
      y: y1*1.4,
      label: nickNames[3],
      strokeColor:  p.color(113, 179, 7),
      color: p.color(113, 179, 7),
      onClick: function() {
        btn4.color = p.color(255, 255, 255);
        chosenNick = btn4.label;
      }
    });
    btn5 = new p.button({
      x: x1*4,
      y: y1*1.4,
      label: nickNames[4],
      strokeColor:  p.color(113, 179, 7),
      color: p.color(113, 179, 7),
      onClick: function() {
        btn5.color = p.color(255, 255, 255);
        chosenNick = btn5.label;
      }
    });
    btn6 = new p.button({
      x: x1*7,
      y: y1*1.4,
      label: nickNames[5],
      strokeColor:  p.color(113, 179, 7),
      color: p.color(113, 179, 7),
      onClick: function() {
        btn6.color = p.color(255, 255, 255);
        chosenNick = btn6.label;
      }
    });
    btn7 = new p.button({
      x: x1,
      y: y1*1.8,
      label: nickNames[6],
      strokeColor:  p.color(113, 179, 7),
      color: p.color(113, 179, 7),
      onClick: function() {
        btn7.color = p.color(255, 255, 255);
        chosenNick = btn7.label;
      }
    });
    btn8 = new p.button({
      x: x1*4,
      y: y1*1.8,
      label: nickNames[7],
      strokeColor:  p.color(113, 179, 7),
      color: p.color(113, 179, 7),
      onClick: function() {
        btn8.color = p.color(255, 255, 255);
        chosenNick = btn8.label;
      }
    });
    btn9 = new p.button({
      x: x1*7,
      y: y1*1.8,
      label: nickNames[8],
      strokeColor:  p.color(113, 179, 7),
      color: p.color(113, 179, 7),
      onClick: function() {
        btn9.color = p.color(255, 255, 255);
        chosenNick = btn9.label;
      }
    });

    startBtn = new p.button({
      x: 140,
      y: 285,
      width:131,
      label: "Start game",
      strokeColor: p.color(125, 255, 255),
      color: p.color(125, 255, 255),
      onClick: function() {
        scene = 2;
      }
    });

    continueBtn = new p.button({
      x: 136,
      y: 200,
      width:131,
      label: "Start again",
      strokeColor: p.color(125, 255, 255),
      color: p.color(125, 255, 255),
      onClick: function() { 
        chosenNick = "Unknown";
        scene = 1;
        speed = 1;
        fall_hole = 0;                
        startA = 0; //start main grass
        start2for = 25;//number of blocks after which holes will appear
        Dragons = [];
        gems = [];
        grassXs = [];
        grassX1s = [];
        holeXs = [];
        p.startConfig();
      }
    });

    muteBtn = new p.button({
      x: 360,
      y: 10,
      width:30,
      height:30,
      img: unMuteBtnImg,
      muteState: false,
      onClick: function() {        
        if (this.muteState) {
          p.masterVolume(1)
          this.muteState = false;
          this.img = unMuteBtnImg;
        }
        else {
          p.masterVolume(0)
          this.muteState = true;
          this.img = muteBtnImg;
        }        
      }
    });
    
    p.scene1 = function () {
      scene = 1;
      p.background(227, 254, 255);
      p.fill(130, 79, 43);
      p.noStroke();
      for (var i = 0; i < grassXs.length; i++) {
        grassXs[i].draw();
      }
      p.fill(11, 150, 214);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(25);
      p.text("Extreme Hoppy OhNoesGuy",200,66);
      p.textSize(20);
      p.text("Please chose you nickname",200,93);         
    };

    var time = 800;
    var timeDay = 0;
    var timeNight = 0;
    /***scene2****/
    p.scene2 = function () {

      scene = 2;
     
      if (timeDay < time) {
        timeDay++;
        p.background(227, 254, 255);
        timeNight++;
      }
      else if (timeNight > 0){
        timeNight--;
        p.background(4, 111, 115);
      }
      else if (timeNight === 0) {
        timeDay=0;
      }      
    };
    /***scene3****/
    p.scene3 = function () {
      scene = 3;
      p.background(9, 43, 71);           
      for (var i = 0; i < grassXs.length; i++) {
        grassXs[i].draw();
      }
      p.fill(11, 150, 214);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(33);
      p.text("Your game is over",200,66);
      p.textSize(15);
      p.text(chosenNick + " your final score is:",200,100);
      p.text(OhNoesGuy.gems, 200, 120);
      p.text("If you want to play again",200,140);
      p.text("please push the button",200,160);
    };
    
    var holesProc = 50; //procent of holes
    p.moveGroundWithholes = function () {
      p.checkIsStand = function (nI, grassBlockName) {        
        return OhNoesGuy.x >= grassBlockName[nI].x &&
        OhNoesGuy.x <= grassBlockName[nI].x+grassBlockName[nI].width ||
        OhNoesGuy.x+OhNoesGuy.width-10 >= grassBlockName[nI].x &&
        OhNoesGuy.x+OhNoesGuy.width-10 <= grassBlockName[nI].x+grassBlockName[nI].width;
      };
      //moving first ground array without holes      
      if (start2for!==0){        
        for (var i = startA; i < start2for; i+=1) {
          grassXs[i].draw();
          grassXs[i].x -= speed;          
          if (p.checkIsStand(i, grassXs)) 
          {
            OhNoesGuy.isStand += 1;
          }
          if (grassXs[i].x < -600){
            start2for=0;            
          }
        }
      }
      else {
        for (var i = 0; i < grassXs.length; i+=1) {
          grassXs[i].x = i*20;
        }        
      } 
      //moving the main ground array with holes
      for (var j = startA+25; j < grassX1s.length; j+=1) {
        if (holeXs [j/2] < holesProc) {
          grassX1s[j].draw();
          grassX1s[j].x -= speed;                  
        }        
        if (p.checkIsStand(j, grassX1s)) {
          OhNoesGuy.isStand += 1;
        }
        if (grassX1s[j].x <= -40){
          grassX1s[j].x = 400;
        }
      }
           
      //check OhNoesGuy's stand state
      if (OhNoesGuy.isStand > 0) 
      {
        fall_hole = 0;
        OhNoesGuy.isStand = 0;
      }
      else {
        fall_hole = 1;
        OhNoesGuy.isStand = 0;
      }
      
    };

    /*main program*/
    scene = 1;
    // var qGems = gems.length;
  };
  p.mouseClicked = function() {
    if (p.getAudioContext().state !== 'running') {
      p.getAudioContext().resume();
    }
    if (scene === 1){
      btn1.handleMouseClick();
      btn2.handleMouseClick();
      btn3.handleMouseClick();
      btn4.handleMouseClick();
      btn5.handleMouseClick();
      btn6.handleMouseClick();
      btn7.handleMouseClick();
      btn8.handleMouseClick();
      btn9.handleMouseClick();
      startBtn.handleMouseClick();
      muteBtn.handleMouseClick();    
    }
    else if (scene === 2) {
      muteBtn.handleMouseClick(); 
      return false;
    }
    else if (scene === 3) {
      continueBtn.handleMouseClick();
    }    
  };
  p.keyTyped = function () {
    if (p.key !== 'F5') {
      return false; // prevent any default behaviour
    }
    
  }
  p.keyReleased = function () {
    soundOnce = 1;
    return false; // prevent any default behavior
  }
  p.mouseReleased = function () {
    soundOnce = 1;    
  }
  p.draw = function() {
    if (scene === 1){
      p.scene1 ();
      btn1.draw();
      btn2.draw();
      btn3.draw();
      btn4.draw();
      btn5.draw();
      btn6.draw();
      btn7.draw();
      btn8.draw();
      btn9.draw();
      startBtn.draw ();
      muteBtn.drawImgBtn();
    }
    else if (scene === 2) {   
      // static
      p.scene2 ();  
      muteBtn.drawImgBtn();
      //moved hero ground      
      p.moveGroundWithholes ();

      for (var i = startA; i < gems.length; i++) {
        gems[i].draw();
        OhNoesGuy.checkForGemGrab(gems[i]);
        gems[i].x -= speed;
        if (gems[i].x < -40){
          gems[i].x = p.random(qGems * 40,2 * (qGems * 40));
        }
      }
      if (OhNoesGuy.gems > 2) {
        for (var i = startA; i < Dragons.length; i++) {
          Dragons[i].draw();
          OhNoesGuy.checkForDragonEat(Dragons[i]);
          Dragons[i].x -= speed;
          if (Dragons[i].x < -40){
            Dragons[i].x = p.random(qGems * 40,2 * (qGems * 40));
          }
        }
      }
      p.textSize(18);
      p.text(" " + chosenNick + " score: " + OhNoesGuy.gems, 80, 30);

      if (OhNoesGuy.y>400 || OhNoesGuy.dragons === 1) {
        scene = 3;
      }
      //move_gen_hero  
      if (p.keyIsPressed || p.mouseIsPressed){        
        OhNoesGuy.hop();        
        while(soundOnce===1){
          battleSwing.play()
          standOnce=1;
          soundOnce-=1;
        }
      }      
      else if (OhNoesGuy.y>310 && OhNoesGuy.y<320 && fall_hole === 0)  {
        OhNoesGuy.stand();        
        while(standOnce===1){
          hitThud.play();
          standOnce-=1;
        }
      }
      else {
        OhNoesGuy.fall();
      } 

      OhNoesGuy.draw();
    } 
    else if (scene === 3 ) {

      p.scene3 ();

      continueBtn.draw ();
      /*changeNickBtn.draw();*/           
    }
  };
  $('#canvasHolderSmall').contextmenu(function() {
    return false;
  }).css({
    'touch-action': 'manipulation',
    '-webkit-touch-callout': 'none', /* iOS Safari */
    '-webkit-user-select': 'none', /* Safari */
    ' -khtml-user-select': 'none', /* Konqueror HTML */
       '-moz-user-select': 'none', /* Old versions of Firefox */
        '-ms-user-select': 'none', /* Internet Explorer/Edge */
            'user-select': 'none' /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  });
  
};

//check availability of the code txt version URL
var checkTxtUrl = function () {
  var txt_url = 'https://res.cloudinary.com/deah4rwon/raw/upload/v1602429596/js/code_project5_y5z2m7.txt'; 
  $.ajax({
    url:txt_url,
    type:'HEAD',
    error: function(){
      $('.snippetWrapper').load('../../txt/code_project5.txt');
    },
    success: function(){
      $('.snippetWrapper').load('https://res.cloudinary.com/deah4rwon/raw/upload/v1602429596/js/code_project5_y5z2m7.txt');
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

//waiting until ajax is will complete, after that draw sketch is started
var ajaxComplete = 0;
$(document).ajaxComplete(function(){
  ajaxComplete++;  
  // console.log(ajaxComplete)
  if (ajaxComplete === 14){
    p5.disableFriendlyErrors = true; // disables FES
    let myp5 = new p5(gameSketch);
  }  
});




