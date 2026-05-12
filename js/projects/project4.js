/*This program based on the project: Memory Game
In this version has added next updates:
 - was add a changes tile background color when mouse is hovered on the tile - done
 - was add timer to the game - done
 - was add buttons which change time left - done
 - was add the possibility to chosen game mode single or multi - done
 - was add the possibility to chosen board size - done
 - was add tiles cascading down the screen - done
 */
$.ajaxSetup({
  timeout: 500
});
var leafYellowUrl, leafersSeedUrl, leafersSeedlingUrl, leafersSaplingUrl, 
leafersTreeUrl, leafersUltimateUrl, marcimusUrl, mrPantsUrl, mrPinkUrl, 
oldSpiceManUrl, robotFemaleUrl, codeTxtUrl, scriptText;
//check availability of the image's URLs
var checkImgUrl = function () {
  var goto_url = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/leaf-yellow.png'; 
  $.ajax({
    url:goto_url,
    type:'HEAD',
    error: function(){
      leafYellowUrl = '../../img/projects_Img/leaf-yellow.png';
      leafersSeedUrl = '../../img/projects_Img/leafers-seed.png';
      leafersSeedlingUrl = '../../img/projects_Img/leafers-seedling.png';
      leafersSaplingUrl = '../../img/projects_Img/leafers-sapling.png';
      leafersTreeUrl = '../../img/projects_Img/leafers-tree.png';
      leafersUltimateUrl = '../../img/projects_Img/leafers-ultimate.png';
      marcimusUrl = '../../img/projects_Img/marcimus.png';
      mrPantsUrl = '../../img/projects_Img/mr-pants.png';
      mrPinkUrl = '../../img/projects_Img/mr-pink.png';
      oldSpiceManUrl = '../../img/projects_Img/old-spice-man.png';
      robotFemaleUrl = '../../img/projects_Img/robot_female_1.png';
      let myp5 = new p5(gameSketch);      
    },
    success: function(){
      leafYellowUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/leaf-yellow.png';
      leafersSeedUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/leafers-seed.png';
      leafersSeedlingUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/leafers-seedling.png';
      leafersSaplingUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/leafers-sapling.png';
      leafersTreeUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/leafers-tree.png';
      leafersUltimateUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/leafers-ultimate.png';
      marcimusUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/marcimus.png';
      mrPantsUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/mr-pants.png';
      mrPinkUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/mr-pink.png';
      oldSpiceManUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/old-spice-man.png';
      robotFemaleUrl = 'https://www.kasandbox.org/third_party/javascript-khansrc/live-editor/build/images/avatars/robot_female_1.png';
      let myp5 = new p5(gameSketch);      
    }
  }); 
}

//main game function
let gameSketch = function(p) {
  //global variables
    var scene = 1;
    var NUM_COLS = 5;
    var NUM_ROWS = 4;
    var timeSec = 0;
    var timeMin = 0;
    var timeLeft = 0;
    var refreshTimeCalc = 0;
    var changeBoardSize = 0;
    var sceneOutTime = 0;
    var numPlayers = 1;
    var player = 1;
    var btnSPChangeColor = false;
    var btnDPChangeColor = false;
    var numTries = 0;
    var numMatches = 0;
    var numTries1 = 0;
    var numMatches1 = 0;
    var numTries2 = 0;
    var numMatches2 = 0;
    var timeIsOver = 0;
    var winState = false;
    var button, btnSinglePlayer, btnDoublePlayer, btnPlus, btnMinus, btnStart, btnBoardSizePlus, btnBoardSizeMinus, btnRestart, Tile;  
    var countTime, timeCalc, timeX, timeDraw, timeCount, j1, j2, tempArr, scene1, scene2;
    var tiles = [];
    var flippedTiles = [];
    var leafYellow;  
    var delayStartFC;

  p.preload = function () {  
    leafYellow = p.loadImage(leafYellowUrl);  
  }
    
  p.setup = function() {

    // canvas size (Integers only, please.)
    var canvas = p.createCanvas(400, 400);
      
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
  
    //buttons prototypes**************************************************

    //prototypes
    p.button = function (config){
      this.x = config.x;
      this.y = config.y;
      this.width = config.width;
      this.height = config.height || 0;
      this.strokeColor = config.color || p.color(113, 179, 7);
      this.strokeWeight = config.strokeWeight || 1;
      this.color = config.color || p.color(113, 179, 7);
      this.label = config.label || 'push me';
      this.textColor = config.textColor || p.color(0, 0, 0);
      this.textSize = config.textSize || 20;
      this.textX = config.textX || 0;
      this.textY = config.textY || 0;
      this.onClick = config.onClick || function() {};
      this.changeColor = config.changeColor || false;
      this.count = config.count || 0;
    };

    p.button.prototype.draw = function() {
      p.fill(this.color);
      p.strokeWeight(this.strokeWeight);
      p.rect(this.x, this.y, this.width, this.width+this.height, 10);
      p.fill (this.textColor);
      p.textSize(this.textSize);
      p.text(this.label,this.x+this.width/3.5+this.textX,this.y+this.width/1.26+this.textY);
    };

    p.button.prototype.isMouseInside = function() {
      return p.mouseX > this.x &&
      p.mouseX < (this.x + this.width) &&
      p.mouseY > this.y &&
      p.mouseY < (this.y + this.width+this.height);
    };

    p.button.prototype.handleMouseClick = function() {
      if (this.isMouseInside()) {
        this.onClick();
      }          
    };


    btnSinglePlayer = new p.button({
      x: 20,
      y: 209,
      width:174,
      height:-141,
      textSize:24,
      textX:-32,
      textY:-114,
      label: 'Single player',
      onClick: function() {
        this.color = p.color(255, 255, 255);
        btnSPChangeColor = true;
        btnDPChangeColor = false;
        numPlayers = 1;
      }            
    });

    btnDoublePlayer = new p.button({
      x: 210,
      y: btnSinglePlayer.y,
      width:btnSinglePlayer.width,
      height:btnSinglePlayer.height,
      textSize:btnSinglePlayer.textSize,
      textX:-35,
      textY:btnSinglePlayer.textY,
      label: 'Double player',
      onClick: function() {
        this.color = p.color(255, 255, 255);
        btnSPChangeColor = false;
        btnDPChangeColor = true;
        numPlayers = 2;
      }            
    });

    p.button.prototype.offClick = function(){
      if (this.changeColor){
        this.count++;
        if (this.count === 15){
          this.color = p.color(113, 179, 7);
          this.count = 0;
          this.changeColor = false;
        }
      }
      else if (!btnSPChangeColor){
        btnSinglePlayer.color = p.color(113, 179, 7);
      }
      else if (!btnDPChangeColor){
        btnDoublePlayer.color = p.color(113, 179, 7);
      }
    };

    //creating buttons**************************************
    btnPlus = new p.button({
      x: 371,
      y: 34,
      textX:0,
      textY:1,
      width:20,
      label: '+',
      onClick: function() {
        this.color = p.color(255, 255, 255);
        this.changeColor = true;
        timeSec+=10;
        timeLeft+=10;
        refreshTimeCalc=0;
        if (timeSec > 0){
          sceneOutTime = 0;
        }
      }            
    });

    btnMinus = new p.button({
      x: btnPlus.x-30,
      y: btnPlus.y,
      textSize:29,
      textX:0,
      textY:1,
      width:btnPlus.width,
      label: '-',
      onClick: function() {
        this.color = p.color(255, 255, 255);
        this.changeColor = true;
        timeSec-=10;
        timeLeft-=10;
        refreshTimeCalc=0;
      }            
    });

    btnStart = new p.button({
      x: 110,
      y: 258,
      width:180,
      height:-145,
      textSize:29,
      textX:-30,
      textY:-117,
      label: 'Start game',
      onClick: function() {
        this.color = p.color(255, 255, 255);
        this.changeColor = true;
        if (timeSec <= 0 && timeMin <= 0){
          sceneOutTime = 1;
        }
        else {
          sceneOutTime = 0;
          scene = 2;
        }              
      }            
    });

    btnBoardSizePlus = new p.button({
      x: 91,
      y: btnPlus.y,
      width:btnPlus.width,
      textSize:22,
      textX:-2,
      textY:3,
      label: '+',
      onClick: function() {
        this.color = p.color(255, 255, 255);
        this.changeColor = true;
        if (NUM_COLS!==5 && NUM_ROWS!==4){
          NUM_COLS++;
          NUM_ROWS++;
        }
      }            
    });

    btnBoardSizeMinus = new p.button({
      x: btnBoardSizePlus.x-30,
      y: btnPlus.y,
      width:btnPlus.width,
      textSize:btnBoardSizePlus.textSize,
      textX:btnBoardSizePlus.textX+3,
      textY:btnBoardSizePlus.textY-1,
      label: '-',
      onClick: function() {
        this.color = p.color(255, 255, 255);
        this.changeColor = true;
        if (NUM_COLS!==2 && NUM_ROWS!==1){
          NUM_COLS--;
          NUM_ROWS--;
        } 
      }            
    });

    btnRestart = new p.button({
      x: 139,
      y: 357,
      width:120,
      height:-89,
      textSize:15,
      textX:-17,
      textY:-75,
      label: 'Restart game',
      onClick: function() {
        this.color = p.color(255, 255, 255);
        this.changeColor = true;      
        scene = 1;
        tiles.length = 0;
        flippedTiles.length = 0;
        timeSec = 0;
        timeLeft = 0;
        winState = 0;
        timeIsOver = 0;
        numMatches = 0;
        numTries = 0;
        NUM_COLS = 5;
        NUM_ROWS = 4;
        p.startConfig();
      }            
    });        

    //tiles prototypes****************************************************
    
      p.Tile = function(x, y, face) {
        this.x = x;
        this.y = y;
        this.width = 70;
        this.face = face;
        this.isFaceUp = false;
        this.isMatch = false;
        this.color = p.color(232, 245, 157);
        this.countY = 0;
        this.randomTileFallY = p.random (1,6);
        this.randomTileFallX = p.random (1,2);
      };

      p.Tile.prototype.draw = function() {
        p.fill(this.color);
        p.strokeWeight(2);
        p.rect(this.x, this.y, this.width, this.width, 10);
        if (this.isFaceUp) {
          p.image(this.face, this.x, this.y, this.width, this.width);
        } else {
          p.image(leafYellow, this.x, this.y, this.width, this.width);
        }
        if (winState || timeIsOver === 1){
          if (this.countY < 200){
            this.countY+=this.randomTileFallY;
            this.y+=this.randomTileFallY; 
            this.x+=this.randomTileFallX;
          }
          else if (this.x > 30) {
            this.y-=this.randomTileFallY; 
            this.x+=this.randomTileFallX;
          }
        }
      };

      p.Tile.prototype.isUnderMouse = function(x, y) {
        return x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.width;
      };
      // Declare an array of all possible faces
      var faces = [
        p.loadImage(leafersSeedUrl),
        p.loadImage(leafersSeedlingUrl),
        p.loadImage(leafersSaplingUrl),
        p.loadImage(leafersTreeUrl),
        p.loadImage(leafersUltimateUrl),
        p.loadImage(marcimusUrl),
        p.loadImage(mrPantsUrl),
        p.loadImage(mrPinkUrl),
        p.loadImage(oldSpiceManUrl),
        p.loadImage(robotFemaleUrl)
      ];
    //tiles creating******************************************************
    
      // Create the tiles
      for (var i = 0; i < NUM_COLS; i++) {
        for (var j = 0; j < NUM_ROWS; j++) {
          var tileX = i * 78 + 10;
          var tileY = j * 78 + 40;
          tiles.push(new p.Tile(tileX, tileY));
        }
      }       
    

    //time part***********************************************************
           
      countTime = 0;
      timeCalc = function (){
        while (refreshTimeCalc < 1){
         refreshTimeCalc++;
         if (timeSec > 50) {
          timeMin++;
          timeSec -= 60;
        }
        else if (timeMin > 0 && timeSec < 0){
          timeMin--;
          timeSec += 60;
        }
        else if (timeSec < 0){
          timeSec = 0;
          timeLeft = 0;
        }
      }
    };

    timeX=344;
    timeDraw = function (){
      p.fill(0, 0, 0);
      p.textSize(14);
      p.text ('Time left:',timeX+-63,21);               
      if (timeMin < 10){
        if (timeSec < 10){
          p.text('0' + timeMin + ' : 0' + timeSec,timeX,21);
        }
        else{
          p.text('0' + timeMin + ' : ' + timeSec,timeX,21);
        }
      }
      else{
        if (timeSec < 10){
          p.text(timeMin + ' : 0' + timeSec,timeX,21);
        }
        else{
          p.text(timeMin + ' : ' + timeSec,timeX,21);
        }
      }
    };
    timeCount = function () {
      if (timeLeft > 0){
        countTime++;
        if(countTime === 60){
          timeSec--;
          timeLeft--;
          if (timeSec < 0) {
            timeMin--;
            timeSec=59;
          }
          countTime = 0;
        }
        if (timeLeft === 0) {
          timeIsOver = 1;
        }
      }
    };

    //scenes**************************************************************

    //sene1 - introduction
    j1 = 0;
    j2 = 0;
    tempArr=0;
    scene1 = function (){
      p.background(255, 255, 255);
      //change board size
      //draw array
      for (var i = 0; i < tiles.length-j2; i++) {
        tiles[i].draw();
      }
      //copy_array_at_programm_start
      while (j1<1){
        j1++;
        tempArr = tiles.slice(0);
      }
      if (NUM_COLS === 5 && NUM_ROWS === 4){
        tiles = tempArr.slice(0);
        j2=0;
      }
      else if (NUM_COLS === 4 && NUM_ROWS === 3){
        tiles = tempArr.slice(0);
        j2=4;
        tiles.splice(3, 1);
        tiles.splice(6, 1);
        tiles.splice(9, 1);
        tiles.splice(13, 1);
      }
      else if (NUM_COLS === 3 && NUM_ROWS === 2){
        tiles = tempArr.slice(0);
        j2=8;
        tiles.splice(3, 1);
        tiles.splice(2, 1);
        tiles.splice(5, 1);
        tiles.splice(4, 1);
        tiles.splice(9, 1);
        tiles.splice(13, 1);
      }
      else if (NUM_COLS === 2 && NUM_ROWS === 1){
        tiles = tempArr.slice(0);
        j2=12;
        tiles.splice(7, 1);
        tiles.splice(6, 1);
        tiles.splice(5, 1);
        tiles.splice(3, 1);
        tiles.splice(2, 1);
        tiles.splice(1, 1);
      }

      if (sceneOutTime === 1) {
        p.fill(255,255, 255);
        p.strokeWeight(1);
        p.rect (5,120,390,73,10);
        p.textSize(25);
        p.fill(0, 0, 0);
        p.text('The time value is zero',74,147);
        p.text('please increase the playing time',20,179);
      }
      //topText
    
      p.fill(255,255, 255);
      p.strokeWeight(1);
      p.rect (5,5,390,59,10);
      p.fill(0, 0, 0);
      p.textSize(14);
      p.text('Change the playing time',183,49);
      p.text('Change the board size',15,22);
      p.text(NUM_ROWS + ' ' + NUM_COLS,15,45);
    
      //functions
      timeCalc();
      timeDraw();
      btnPlus.draw();
      btnMinus.draw();
      btnStart.draw();
      btnBoardSizePlus.draw();
      btnBoardSizeMinus.draw();
      btnSinglePlayer.draw();
      btnDoublePlayer.draw();
      btnPlus.offClick();
      btnMinus.offClick();
      btnStart.offClick();
      btnBoardSizePlus.offClick();
      btnBoardSizeMinus.offClick();
      btnSinglePlayer.offClick();
      btnDoublePlayer.offClick();
    }
    
    
    //scene2 - game
    //defining tiles loop variables
    
      var c1 = 0;
      var possibleFaces = faces.slice(0);
      var selected = [];
      // Now shuffle the elements of that array
      var shuffleArray = function(array) {
        var counter = array.length;
        // While there are elements in the array
        while (counter > 0){
          var ind = Math.floor(Math.random() * counter);// Pick a random index
          counter--;// Decrease counter by 1
          var temp = array[counter];// And swap the last element with it
          array[counter] = array[ind];
          array[ind] = temp;
        }
      };    
      delayStartFC = null;
      
    scene2 = function () {
      //tiles creating at once
      while (c1<1){
        tiles.length = 0;
        c1++;
        //tiles creating
        
          // Make an array which has 2 of each, then randomize it
          for (var i = 0; i < (NUM_COLS * NUM_ROWS) / 2; i++) {
            // Randomly pick one from the array of remaining faces
            var randomInd = p.floor(p.random(possibleFaces.length));
            var face = possibleFaces[randomInd];
            // Push twice onto array
            selected.push(face);
            selected.push(face);
            // Remove from array
            possibleFaces.splice(randomInd, 1);
          }
          shuffleArray(selected); 
          // Create the tiles
          for (var q = 0; q < NUM_COLS; q++) {
            for (var w = 0; w < NUM_ROWS; w++) {
              var tileX = q * 78 + 10;
              var tileY = w * 78 + 40;
              var tileFace = selected.pop();
              tiles.push(new p.Tile(tileX, tileY, tileFace));
            }
          }    
      }
      //draw tiles
      
      //timer draw
      timeCount();
      timeDraw();
      //buttons
      btnRestart.draw();
      btnRestart.offClick();
      //time faceFlip    
      if (delayStartFC && (p.frameCount - delayStartFC) > 30) {
        console.log('check');
        for (var i = 0; i < tiles.length; i++) {
          var tile = tiles[i];
          if (!tile.isMatch) {
            tile.isFaceUp = false;
          }
        }
        flippedTiles = [];
        delayStartFC = null;
      }
      for (var i = 0; i < tiles.length; i++) {
        tiles[i].draw();
      }
      //changes color when mouse is hovered
      for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (tile.isUnderMouse(p.mouseX, p.mouseY)) {
          tile.color = p.color (222, 222, 4);
        }
        else {
          tile.color = p.color (232, 245, 157);
        }
      }  
      //score text
      p.fill(0, 0, 0);
      p.textSize(13);
      if (numPlayers === 1){
        p.text('Player score: ' + numMatches,10,370);
        p.text('Number of tries: ' + numTries,10,385);
        //p.text(timeIsOver+ ' ' + timeLeft,350,385);
        if (numMatches === tiles.length/2 || timeIsOver === 1) {
          if (timeIsOver === 1){
            p.fill(255,255, 255);
            p.strokeWeight(1);
            p.rect (5,120,390,73,10);
            p.fill(0, 0, 0);
            p.textSize(20);
            p.text('Time is over', 40, 150);
            p.text('Player score: ' + numMatches,200,150);
            p.text('Number of tries: ' + numTries,125,175);
          }
          else {
            p.fill(255,255, 255);
            p.strokeWeight(1);
            p.rect (5,120,390,73,10);
            p.fill(0, 0, 0);
            p.textSize(20);
            p.text('You found them all in ' + numTries + ' tries!', 20, 164);
            winState = true;
          }
        }
      }
      else if (numPlayers === 2) {
        p.textSize(18);
        p.text('Turn player ' +  player,12,25);
        p.textSize(13);
        p.text('Player1 score: ' + numMatches1,10,370);
        p.text('Number of tries: ' + numTries1,10,385);
        p.text('Player2 score: ' + numMatches2,277,370);
        p.text('Number of tries: ' + numTries2,277,385);
        if ((numMatches1+numMatches2) === tiles.length/2 || timeIsOver === 1){
          if (timeIsOver === 1){
            p.fill(255,255, 255);
            p.strokeWeight(1);
            p.rect (5,101,390,107,30);
            p.fill(0, 0, 0);
            p.textSize(20);
            p.text('Time is over', 150, 120);
            p.text('Player1 score: ' + numMatches1,20,145);
            p.text('Number of tries: ' + numTries1,20,175);
            p.text('Player2 score: ' + numMatches2,220,145);
            p.text('Number of tries: ' + numTries2,220,175);
            if (numMatches1 > numMatches2){
              p.text('Player1 are winner',120,197);
            }
            else if (numMatches1 < numMatches2){
              p.text('Player2 are winner',120,197);
            }
            else if (numMatches1 === numMatches2 && numTries1 < numTries2){
              p.text('Player1 are winner',120,197);
            }
            else if (numMatches1 === numMatches2 && numTries1 > numTries2){
              p.text('Player2 are winner',120,197);
            }
            else if (numMatches1 === numMatches2 && numTries1 === numTries2){
              p.text('The winner is friendship',120,197);
            }
          }
          else {
            p.fill(255,255, 255);
            p.strokeWeight(1);
            p.rect (5,101,390,107,30);
            p.fill(0, 0, 0);
            p.textSize(20);
            p.text('Player1 score: ' + numMatches1,20,145);
            p.text('Number of tries: ' + numTries1,20,175);
            p.text('Player2 score: ' + numMatches2,220,145);
            p.text('Number of tries: ' + numTries2,220,175);
            if (numMatches1 > numMatches2){
              p.text('Player1 are winner',120,197);
            }
            else if (numMatches1 < numMatches2){
              p.text('Player2 are winner',120,197);
            }
            else if (numMatches1 === numMatches2 && numTries1 < numTries2){
              p.text('Player1 are winner',120,197);
            }
            else if (numMatches1 === numMatches2 && numTries1 > numTries2){
              p.text('Player2 are winner',120,197);
            }
            else if (numMatches1 === numMatches2 && numTries1 === numTries2){
              p.text('The winner is friendship',120,197);
            }
            winState = true;
          }
        }
      }
    }
  }

  //mouse clicked*******************************************************
  p.mouseClicked = function() {
    if (scene === 1){
      btnPlus.handleMouseClick();
      btnMinus.handleMouseClick();
      btnStart.handleMouseClick();
      btnBoardSizePlus.handleMouseClick();
      btnBoardSizeMinus.handleMouseClick();
      btnSinglePlayer.handleMouseClick();
      btnDoublePlayer.handleMouseClick();
    }
    else if (scene === 2){
      btnRestart.handleMouseClick();
      //tiles clicked function
      if (numPlayers === 1){
        for (var i = 0; i < tiles.length; i++) {
          var tile = tiles[i];
          if (tile.isUnderMouse(p.mouseX, p.mouseY)) {
            if (flippedTiles.length < 2 && !tile.isFaceUp) {
              tile.isFaceUp = true;
              flippedTiles.push(tile);
              if (flippedTiles.length === 2) {
                numTries++;
                if (flippedTiles[0].face === flippedTiles[1].face) {
                  flippedTiles[0].isMatch = true;
                  flippedTiles[1].isMatch = true;
                  flippedTiles.length = 0;
                  numMatches++;
                }
                delayStartFC = p.frameCount;
                console.log(delayStartFC+' '+p.frameCount);             
              }
            } 
            p.loop()
          }
        }
      }
      else if (numPlayers === 2){
        if (player === 1){
          for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.isUnderMouse(p.mouseX, p.mouseY)) {
              if (flippedTiles.length < 2 && !tile.isFaceUp) {
                tile.isFaceUp = true;
                flippedTiles.push(tile);
                if (flippedTiles.length === 2) {
                  numTries1++;
                  if (flippedTiles[0].face === flippedTiles[1].face) {
                    flippedTiles[0].isMatch = true;
                    flippedTiles[1].isMatch = true;
                    flippedTiles.length = 0;
                    numMatches1++;
                  }
                  delayStartFC = p.frameCount;
                  player++;
                }
              } 
              p.loop()
            }
          }
        }
        else if (player === 2){
          for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.isUnderMouse(p.mouseX, p.mouseY)) {
              if (flippedTiles.length < 2 && !tile.isFaceUp) {
                tile.isFaceUp = true;
                flippedTiles.push(tile);
                if (flippedTiles.length === 2) {
                  numTries2++;
                  if (flippedTiles[0].face === flippedTiles[1].face) {
                    flippedTiles[0].isMatch = true;
                    flippedTiles[1].isMatch = true;
                    flippedTiles.length = 0;
                    numMatches2++;
                  }
                  delayStartFC = p.frameCount;
                  player--;
                }
              } 
              p.loop()
            }
          }
        }
      }
    }
  }  

  //****************main*program***************************************
  //start scenes********************************************************
  //mouse coordinates set null
  mouseX=null;
  mouseY=null;
  p.draw = function() {
    if (scene === 1){
      scene1();                
    }
    else if (scene === 2){
      p.background(255, 255, 255);
      scene2();
    }
  };
};

//check availability of the code txt version URL
var checkTxtUrl = function () {
  var txt_url = 'https://res.cloudinary.com/deah4rwon/raw/upload/v1582167507/js/code_project4_hszfeg.txt'; 
  $.ajax({
    url:txt_url,
    type:'HEAD',
    error: function(){
      $('.snippetWrapper').load('../../txt/code_project4.txt');
    },
    success: function(){
      $('.snippetWrapper').load('https://res.cloudinary.com/deah4rwon/raw/upload/v1582167507/js/code_project4_hszfeg.txt');
    }
  });   
}


//****main_programm*****
checkImgUrl();
checkTxtUrl();

