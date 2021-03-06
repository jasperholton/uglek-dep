// By Jasper Camber Holton. V0.0.484
var seed = 9;
let TEXTTYPE = "bold " + 42 + "px Arial";
var maxv = 15;
function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x80000000; // 2**31;
  this.a = 1103515245;
  this.c = 12345;

  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}
RNG.prototype.nextInt = function() {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
}
RNG.prototype.nextFloat = function() {
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1);
}
RNG.prototype.nextRange = function(start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start;
  var randomUnder1 = this.nextInt() / this.m;
  return start + Math.floor(randomUnder1 * rangeSize);
}
RNG.prototype.choice = function(array) {
  return array[this.nextRange(0, array.length)];
}

var rng = new RNG(seed);

function pythagorean(sideA, sideB){
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}

function send(text){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://uglek.com/game/" + id + "/post/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(text);
}
var id = document.getElementById("gameid").innerHTML;
var gameplay;

var firstPut = false;
var opponentPlaying = false;
function readCallback(){
  gp = gameplay;
  console.log("Read callback");
      for(var i = currentTurn; i < gp.length; i++){
        console.log(gp[i]);
        sp = gp[i].split(",");
        if(sp[0] == "start"){
          startGame(sp[1]);
          currentTurn = i+1;
        } else if(sp[3] == user){
          currentTurn = i+1;
          console.log("Player turn syndicated");
        } else if(sp[0] == "set"){
          setOpponentBall(parseFloat(sp[1]),parseFloat(sp[2]));
          currentTurn = i+1;
          console.log("Opponent set ball");
        } else if(sp[0] == "put"){
          putOpponentBall(parseFloat(sp[1]),parseFloat(sp[2]));
          currentTurn = i+1;
          firstPut = true;
          opponentPlaying = true;
          console.log("Opponent hit ball");
        }
      }
}

function read(){
  const Http = new XMLHttpRequest();
  const url="https://uglek.com/game/" + id + "/play/";
  Http.open("GET", url);
  Http.send();
  Http.onreadystatechange = (e) => {
    gameplay = Http.responseText.split("/");
    readCallback();
  }
}
function gameplayArray(){
  gameplay.split('/');
}

var ADHEIGHT = 90;
var less = window.innerWidth;
if(window.innerHeight < less){
  less = window.innerHeight-ADHEIGHT;
}

var last = 0;
var movex;
var movey;
var stage = new createjs.Stage("game156");
createjs.Touch.enable(stage, true, false);
var container = new createjs.Container();
scale = container.scale = less/1000;
background = new createjs.Shape();
background.graphics.beginFill("black").drawRect(0, 0, window.innerWidth, window.innerHeight);
stage.addChild(background);
stage.addChild(container);
var speedfactor = 50;

stage.canvas.width = window.innerWidth;
var canvasHeight = window.innerHeight-ADHEIGHT;
stage.canvas.height = canvasHeight;
leftbound = (window.innerWidth - less)/2/scale;
topbound = ((canvasHeight - less)/2)/scale;
green = new createjs.Shape();
green.graphics.beginFill("green").drawRect(leftbound, topbound, 1000, 1000);
  container.addChild(green);
  createjs.Touch.enable(stage);

  start = new createjs.Shape();
  start.graphics.beginFill("grey").drawRect(leftbound, topbound, 200, 100);
  start.x = 0;
  start.y = 0;
var ballplaced = false;
var pressmovestarted = false;
var movestartx;
var movestarty;
var playerball = null;
var hitx = 0;
var hity = 0;
var ballSize = 20;

var player1 = document.getElementById("player1").innerHTML;
var player2 = document.getElementById("player2").innerHTML;
var user = document.getElementById("user").innerHTML;
var playerTurn = false;
if(user == player1){
  playerTurn = true;
}
        
var opponentball = null;
var opponentballset = false;
function setOpponentBall(x,y){
  if(!opponentballset || opponentball == null){
  opponentball = new createjs.Shape();
        opponentball.graphics.beginFill("yellow").drawCircle(0, 0, ballSize);
        opponentball.x = x + leftbound;
    opponentball.y = y + topbound;
        opponentball.vx = 0;
        opponentball.vy = 0;
    opponentball.inHole = false;
        container.addChild(opponentball);
    opponentballset = true;
  } else {
    opponentball.x = x + leftbound;
    opponentball.y = y + topbound;
  }
}
var opponentPlayed = false;
function putOpponentBall(x,y){
  opponentball.vx = x;
  opponentball.vy = y;
}

  start.on("mousedown", function(evt) {
    if(playerTurn && evt.stageX/scale > leftbound + ballSize && evt.stageY/scale > topbound + ballSize){
      if(!ballplaced){
        playerball = new createjs.Shape();
        playerball.graphics.beginFill("white").drawCircle(0, 0, ballSize);
        playerball.x = evt.stageX/scale;
        playerball.y = evt.stageY/scale;
        movestartx = evt.stageX;
        movestarty = evt.stageY;
        playerball.vx = 0;
        playerball.vy = 0;
        container.addChild(playerball);
        playerball.inHole = false;
        ballplaced = true;
        send("set,"+(playerball.x-leftbound)+","+(playerball.y-topbound)+","+user);
      }
      else if(playerTurn) {
        playerball.x = evt.stageX/scale;
        playerball.y = evt.stageY/scale;
        send("set,"+(playerball.x-leftbound)+","+(playerball.y-topbound)+","+user);
      }
    }
  });
  container.addChild(start);
var line;
function drawLine(x,y,xx,yy){
   // Get a new 'shape' which comes with a 'graphics' property that allows us to draw
  container.removeChild(line);
            line = new createjs.Shape();

            // Add this line shape to the canvas
            container.addChild(line);

            // Set the 'brush stroke' style (basically the thickness of the line)
            //      Then start drawing a black line
            line.graphics.setStrokeStyle(4).beginStroke("rgba(0,0,0,1)");

            // Tell EaselJS where to go to start drawing the line
            line.graphics.moveTo(x, y);

            // Tell EaselJS where to draw the line to
            line.graphics.lineTo(xx, yy);
}

hole = new createjs.Shape();
hole.graphics.beginFill("black").drawCircle(0, 0, ballSize+2);
hole.x = leftbound + 800;
hole.y = topbound + 900;
container.addChild(hole)

var movefactor = 10.0;

var obstacles = [];
var obstacleSize = [];

for(var i = 0; i < 10; i++){
  obstacles[i] = new createjs.Shape();
  var size = (rng.nextFloat()*30 + 30);
  obstacleSize[i] = size;
      obstacles[i].graphics.beginFill("red").drawCircle(0, 0, size);
      obstacles[i].x = leftbound + rng.nextFloat() * 850 + 75;
      obstacles[i].y = topbound + rng.nextFloat() * 500 + 150;
    obstacles[i].vx = 0;
  obstacles[i].vy = 0;
      container.addChild(obstacles[i])
}
var fixedobstacles = [];
var fixedobstacleSize = [];
for(var i = 0; i < 7; i++){
  fixedobstacles[i] = new createjs.Shape();
  var size = (rng.nextFloat()*60 + 60);
  fixedobstacleSize[i] = size;
      fixedobstacles[i].graphics.beginFill("blue").drawRect(0, 0, size, size);
      fixedobstacles[i].x = leftbound + rng.nextFloat() * 850 + 75;
      fixedobstacles[i].y = topbound + rng.nextFloat() * 500 + 200;
      container.addChild(fixedobstacles[i])
}

var putted = false;

stage.on("stagemousedown", function(evt) {
          if(!pressmovestarted && ballplaced){
          movestartx = evt.stageX;
            movestarty = evt.stageY;
            pressmovestarted = true;
          }
      });

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
stage.on("stagemouseup", function(evt) {
          //movex = movestartx - evt.stageX;
          //movey = movestarty - evt.stageY;
        console.log("Move:");
              console.log(movex);
            console.log(movey);
       if(playerTurn && ballplaced && playerball && playerball.vx == 0 && playerball.vy == 0){
          if(pythagorean(Math.abs(movex),Math.abs(movey)) > 30 && pressmovestarted){
            playerball.vx = movex/movefactor;
            playerball.vy = movey/movefactor;
            // sin = opposite/hypotenuse cos = adjacent/hypotenuse cos*hypotenuse = adjacent
            if(pythagorean(playerball.vx,playerball.vy) > maxv){
              var angle = Math.atan2(playerball.vy,playerball.vx);
              playerball.vx = Math.cos(angle)*maxv;
              playerball.vy = Math.sin(angle)*maxv;
            }
            playerball.vx = Math.round(playerball.vx * 10000) / 10000
            playerball.vy = Math.round(playerball.vy * 10000) / 10000
            send("put,"+playerball.vx+","+playerball.vy+","+user);
            playerTurn = false;
            firstPut = true;
            putted = true;
            //currentTurn = currentTurn + 1;
          }
  }
  container.removeChild(line);
      pressmovestarted = false;
      });
stage.on("stagemousemove", function(evt) {
  if(pressmovestarted && playerball){
          movex = movestartx - evt.stageX;
          movey = movestarty - evt.stageY;
        if(playerball.vx == 0 && playerball.vy == 0){
          drawLine(playerball.x,playerball.y,playerball.x + movex,playerball.y + movey);
        }
  }
      });

    //Update stage will render next frame
  stage.update();
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", handleTick);
var ticks = 0;
var currentTurn = 0;

function checkObstacleCollisions() {
  for(var i = 0; i < obstacles.length; i++){
  for(var o = 0; o < fixedobstacles.length; o++){
        var obs = fixedobstacles[o];
      var body = obstacles[i];
        // If collision
        if(body.x > fixedobstacles[o].x - obstacleSize[i] && body.x < fixedobstacles[o].x + obstacleSize[i] + fixedobstacleSize[o] && body.y > fixedobstacles[o].y - obstacleSize[i] && body.y < fixedobstacles[o].y + fixedobstacleSize[o] + obstacleSize[i]) {
          var dx=(body.x)-(obs.x+fixedobstacleSize[o]/2);
          var dy=(body.y)-(obs.y+fixedobstacleSize[o]/2);
          var width=(obstacleSize[i] * 2+fixedobstacleSize[o])/2;
          var height=(obstacleSize[i] * 2+fixedobstacleSize[o])/2;
          var crossWidth=width*dy;
          var crossHeight=height*dx;
          var collision='none';
          if(Math.abs(dx)<=width && Math.abs(dy)<=height){
              if(crossWidth>crossHeight){
                  collision=(crossWidth>(-crossHeight))?'bottom':'left';
              }else{
                  collision=(crossWidth>-(crossHeight))?'right':'top';
              }
          }
          if(collision == 'bottom' || collision == 'top'){
            body.vy = -body.vy;
          }
          if(collision == 'right' || collision == 'left'){
            body.vx = -body.vx;
          }
        }
      }
  }
  for(var i = 0; i < obstacles.length; i++){
  for(var o = 0; o < obstacles.length; o++){
    if(i != o){
        // If collided
        if(pythagorean(Math.abs(obstacles[o].x - obstacles[i].x),Math.abs(obstacles[o].y - obstacles[i].y)) < (obstacleSize[o] + obstacleSize[i])){
          let vCollision = {x: obstacles[i].x - obstacles[o].x, y: obstacles[i].y - obstacles[o].y};
          let distance = Math.sqrt((obstacles[i].x-obstacles[o].x)*(obstacles[i].x-obstacles[o].x) + (obstacles[i].y-obstacles[o].y)*(obstacles[i].y-obstacles[o].y));
          let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
          let vRelativeVelocity = {x: obstacles[i].vx - obstacles[o].vx, y: obstacles[i].vy - obstacles[o].vy};
          let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
          obstacles[o].vx += (speed * vCollisionNorm.x);
          obstacles[o].vy += (speed * vCollisionNorm.y);
          obstacles[i].vx -= (speed * vCollisionNorm.x);
          obstacles[i].vy -= (speed * vCollisionNorm.y);
        }
      }
    }
  }
}

function checkCollisions(body) {
  if(body){
      body.x = body.x + body.vx;
    body.y = body.y + body.vy;
       body.vx = body.vx - body.vx/speedfactor;
    body.vy = body.vy - body.vy/speedfactor;
    if(body.vx > 0 && body.vx < 0.1){
      body.vx = 0;
    }
    if(body.vy > 0 && body.vy < 0.1){
      body.vy = 0;
    }
    if(body.vx < 0 && body.vx > -0.1){
      body.vx = 0;
    }
    if(body.vy < 0 && body.vy > -0.1){
      body.vy = 0;
    }


      if(body.x < leftbound + ballSize){
        body.vx = -body.vx;
      }
      if(body.y < topbound + ballSize){
        body.vy = -body.vy;
      }
      if(body.x > leftbound+1000-ballSize){
        body.vx = -body.vx;
      }
      if(body.y > topbound+1000-ballSize){
        body.vy = -body.vy;
      }
      if(pythagorean(Math.abs(body.x - hole.x),Math.abs(body.y - hole.y)) < ballSize * 1.5){
        body.inHole = true;
        container.removeChild(body);
      }
      for(var o = 0; o < obstacles.length; o++){
        var obs = obstacles[o];
        obs.x = obs.x + obs.vx;
        obs.y = obs.y + obs.vy;
        obs.vx = obs.vx - obs.vx/speedfactor;
        obs.vy = obs.vy - obs.vy/speedfactor;
        // If collided
        if(pythagorean(Math.abs(body.x - obs.x),Math.abs(body.y - obs.y)) < obstacleSize[o] + ballSize){
          let vCollision = {x: obs.x - body.x, y: obs.y - body.y};
          let distance = Math.sqrt((obs.x-body.x)*(obs.x-body.x) + (obs.y-body.y)*(obs.y-body.y));
          let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
          let vRelativeVelocity = {x: obs.vx - body.vx, y: obs.vy - body.vy};
          let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
          body.vx += (speed * vCollisionNorm.x);
          body.vy += (speed * vCollisionNorm.y);
          obs.vx -= (speed * vCollisionNorm.x);
          obs.vy -= (speed * vCollisionNorm.y);


        }
        if(obs.vx > 0 && obs.vx < 0.1){
            obs.vx = 0;
          }
          if(obs.vy > 0 && obs.vy < 0.1){
            obs.vy = 0;
          }
          if(obs.vx < 0 && obs.vx > -0.1){
            obs.vx = 0;
          }
          if(obs.vy < 0 && obs.vy > -0.1){
            obs.vy = 0;
          }
          if(obs.x < leftbound + obstacleSize[o]){
            obs.vx = -obs.vx;
          }
          if(obs.y < topbound + obstacleSize[o]){
            obs.vy = -obs.vy;
          }
          if(obs.x > leftbound+1000-obstacleSize[o]){
            obs.vx = -obs.vx;
          }
          if(obs.y > topbound+1000-obstacleSize[o]){
            obs.vy = -obs.vy;
          }
      }
      for(var o = 0; o < fixedobstacles.length; o++){
        var obs = fixedobstacles[o];
        // If collision
        if(body.x > fixedobstacles[o].x - ballSize && body.x < fixedobstacles[o].x + ballSize + fixedobstacleSize[o] && body.y > fixedobstacles[o].y - ballSize && body.y < fixedobstacles[o].y + fixedobstacleSize[o] + ballSize) {
          var dx=(body.x)-(obs.x+fixedobstacleSize[o]/2);
          var dy=(body.y)-(obs.y+fixedobstacleSize[o]/2);
          var width=(ballSize * 2+fixedobstacleSize[o])/2;
          var height=(ballSize * 2+fixedobstacleSize[o])/2;
          var crossWidth=width*dy;
          var crossHeight=height*dx;
          var collision='none';
          if(Math.abs(dx)<=width && Math.abs(dy)<=height){
              if(crossWidth>crossHeight){
                  collision=(crossWidth>(-crossHeight))?'bottom':'left';
              }else{
                  collision=(crossWidth>-(crossHeight))?'right':'top';
              }
          }
          if(collision == 'bottom' || collision == 'top'){
            body.vy = -body.vy;
          }
          if(collision == 'right' || collision == 'left'){
            body.vx = -body.vx;
          }
        }
      }
  }
}
function checkBallCollisions(){
        var body = playerball
        var obs = opponentball;
        // If collided
        if(pythagorean(Math.abs(body.x - obs.x),Math.abs(body.y - obs.y)) < ballSize*2){
          let vCollision = {x: obs.x - body.x, y: obs.y - body.y};
          let distance = Math.sqrt((obs.x-body.x)*(obs.x-body.x) + (obs.y-body.y)*(obs.y-body.y));
          let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
          let vRelativeVelocity = {x: obs.vx - body.vx, y: obs.vy - body.vy};
          let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
          body.vx += (speed * vCollisionNorm.x);
          body.vy += (speed * vCollisionNorm.y);
          obs.vx -= (speed * vCollisionNorm.x);
          obs.vy -= (speed * vCollisionNorm.y);
        }
      }

var opponentPlayingTicks = 0;
var wonContainer;
var wonGame = false;
function wonDialog(){

  wonContainer = new createjs.Container();
  wonrect = new createjs.Shape();
  wonrect.graphics.beginFill("white").drawRect(leftbound, topbound + 450, 1000, 100);
  wonContainer.addChild(wonrect)

  text = "Your opponent won!"
  if(opponentball && playerball && opponentball.inHole && playerball.inHole){
    text = "You and your opponent won!"
  } else if(playerball.inHole) {
    text = "You won!"
  }
  wonText = new createjs.Text(text, TEXTTYPE, "#000000")
  wonText.x = leftbound + 500;
  wonText.y = topbound + 500-20;
  wonText.textAlign = 'center';
  wonContainer.addChild(wonText)
  wonContainer.on("mousedown", function(evt) {
    container.removeChild(evt.target);
    if(player1 == user){
      var newGame = Math.floor(Math.random() * 5);
      send("start,"+newGame);
      currentTurn = i+1;
      startGame(newGame);
    }
  });
  container.addChild(wonContainer);
}


function startGame(newGame){
  wonGame = false;
  console.log("New game: " + newGame);
  container.removeChild(wonContainer);
  container.removeChild(playerball);
  container.removeChild(opponentball);
  playerTurn = false;
  if(user == player1){
    playerTurn = true;
  }
  playerball = null;
  opponentball = null;
  ballplaced = false;
  opponentballset = false;
  
  // Clear the objects on screen
  for(var i = 0; i < fixedobstacles.length; i++){
    container.removeChild(fixedobstacles[i]);
  }
  for(var i = 0; i < obstacles.length; i++){
    container.removeChild(obstacles[i]);
  }
  container.removeChild(hole);

  obstacles = [];
  obstacleSize = [];
  fixedobstacles = [];
  fixedobstacleSize = [];
  // Clear RNG
  rng = new RNG(seed);
  // Other stuff
  if(player1 == user){
    playerTurn = true;
  } else {
    playerTurn = false;
  }
  // Draw new game
  //newGame = 4;
  if(newGame == 0){
    holeposx = 900;
    holeposy = 800;
    hole = new createjs.Shape();
    hole.graphics.beginFill("black").drawCircle(0, 0, ballSize+2);
    hole.x = leftbound + holeposx;
    hole.y = topbound + holeposy;
    container.addChild(hole)
    for(var i = 0; i < 10; i++){
      obstacles[i] = new createjs.Shape();
      var size = (rng.nextFloat()*30 + 30);
      obstacleSize[i] = size;
          obstacles[i].graphics.beginFill("red").drawCircle(0, 0, size);
          obstacles[i].x = leftbound + rng.nextFloat() * 850 + 75;
          obstacles[i].y = topbound + rng.nextFloat() * 850 + 75;
        obstacles[i].vx = 0;
      obstacles[i].vy = 0;
          container.addChild(obstacles[i])
    }
    for(var i = 0; i < 5; i++){
      fixedobstacles[i] = new createjs.Shape();
      var size = (rng.nextFloat()*60 + 60);
      fixedobstacleSize[i] = size;
          fixedobstacles[i].graphics.beginFill("blue").drawRect(0, 0, size, size);
          fixedobstacles[i].x = leftbound + 500;
          fixedobstacles[i].y = topbound + i * (900/7)  + 100;
          container.addChild(fixedobstacles[i])
    }
  } else if(newGame == 1){
    holeposx = 900;
    holeposy = 200;
    hole = new createjs.Shape();
    hole.graphics.beginFill("black").drawCircle(0, 0, ballSize+2);
    hole.x = leftbound + holeposx;
    hole.y = topbound + holeposy;
    container.addChild(hole)
    // Draw new objects
    for(var i = 0; i < 10; i++){
      obstacles[i] = new createjs.Shape();
      var size = (rng.nextFloat()*30 + 30);
      obstacleSize[i] = size;
          obstacles[i].graphics.beginFill("red").drawCircle(0, 0, size);
          obstacles[i].x = leftbound + rng.nextFloat() * 850 + 75;
          obstacles[i].y = topbound + rng.nextFloat() * 850 + 75;
        obstacles[i].vx = 0;
      obstacles[i].vy = 0;
          container.addChild(obstacles[i])
    }
    for(var i = 0; i < 5; i++){
      fixedobstacles[i] = new createjs.Shape();
      var size = (rng.nextFloat()*60 + 60);
      fixedobstacleSize[i] = size;
          fixedobstacles[i].graphics.beginFill("blue").drawRect(0, 0, size, size);
          fixedobstacles[i].x = leftbound + rng.nextFloat() * 850 + 75;
          fixedobstacles[i].y = topbound + rng.nextFloat() * 500 + 200;
          container.addChild(fixedobstacles[i])
    }
  } else if(newGame == 2){
    holeposx = 400;
    holeposy = 700;
    hole = new createjs.Shape();
    hole.graphics.beginFill("black").drawCircle(0, 0, ballSize+2);
    hole.x = leftbound + holeposx;
    hole.y = topbound + holeposy;
    container.addChild(hole)
    // Draw new objects
    for(var i = 0; i < 15; i++){
      obstacles[i] = new createjs.Shape();
      var size = (rng.nextFloat()*30 + 30);
      obstacleSize[i] = size;
          obstacles[i].graphics.beginFill("red").drawCircle(0, 0, size);
          obstacles[i].x = leftbound + rng.nextFloat() * 850 + 75;
          obstacles[i].y = topbound + rng.nextFloat() * 850 + 75;
        obstacles[i].vx = 0;
      obstacles[i].vy = 0;
          container.addChild(obstacles[i])
    }
    for(var i = 0; i < 7; i++){
      fixedobstacles[i] = new createjs.Shape();
      var size = (rng.nextFloat()*60 + 60);
      fixedobstacleSize[i] = size;
          fixedobstacles[i].graphics.beginFill("blue").drawRect(0, 0, size, size);
          fixedobstacles[i].x = leftbound + i * 600/10 + Math.sin(i/10.0) * 200 + 10;
          fixedobstacles[i].y = topbound + i * 600/10 + 200;
          container.addChild(fixedobstacles[i])
    }
  } else if(newGame == 3){
    holeposx = 400;
    holeposy = 700;
    hole = new createjs.Shape();
    hole.graphics.beginFill("black").drawCircle(0, 0, ballSize+2);
    hole.x = leftbound + holeposx;
    hole.y = topbound + holeposy;
    container.addChild(hole);
    for(var i = 0; i < 6; i++){
      obstacles[i] = new createjs.Shape();
      var size = (rng.nextFloat()*30 + 30);
      obstacleSize[i] = size;
          obstacles[i].graphics.beginFill("red").drawCircle(0, 0, size);
          obstacles[i].x = leftbound + rng.nextFloat() * 850 + 75;
          obstacles[i].y = topbound + rng.nextFloat() * 850 + 75;
        obstacles[i].vx = 0;
      obstacles[i].vy = 0;
          container.addChild(obstacles[i])
    }
    for(var i = 0; i < 6; i++){
      fixedobstacles[i] = new createjs.Shape();
      var size = (rng.nextFloat()*60 + 60);
      fixedobstacleSize[i] = size;
          fixedobstacles[i].graphics.beginFill("blue").drawRect(0, 0, size, size);
          fixedobstacles[i].x = leftbound + i * 850/10 + 25;
          fixedobstacles[i].y = topbound + Math.sin(i/10 * 4) * 700 + 100 + 200;
          container.addChild(fixedobstacles[i])
    }
  } else if(newGame == 4){
    holeposx = 500;
    holeposy = 900;
    hole = new createjs.Shape();
    hole.graphics.beginFill("black").drawCircle(0, 0, ballSize+2);
    hole.x = leftbound + holeposx;
    hole.y = topbound + holeposy;
    container.addChild(hole)
    for(var i = 0; i < 10; i++){
      obstacles[i] = new createjs.Shape();
      var size = (rng.nextFloat()*30 + 30);
      obstacleSize[i] = size;
          obstacles[i].graphics.beginFill("red").drawCircle(0, 0, size);
          obstacles[i].x = leftbound + rng.nextFloat() * 850 + 75;
          obstacles[i].y = topbound + rng.nextFloat() * 850 + 75;
        obstacles[i].vx = 0;
      obstacles[i].vy = 0;
          container.addChild(obstacles[i])
    }
    for(var i = 0; i < 5; i++){
      fixedobstacles[i] = new createjs.Shape();
      var size = (rng.nextFloat()*60 + 60);
      fixedobstacleSize[i] = size;
          fixedobstacles[i].graphics.beginFill("blue").drawRect(0, 0, size, size);
          fixedobstacles[i].x = leftbound + 500 + Math.sin(i/7*3) * 400;
          fixedobstacles[i].y = topbound + i * (900/7)  + 100;
          container.addChild(fixedobstacles[i])
    }
  }


}

  function handleInterval(){
    read();
    setTimeout(handleInterval, 5000);
  }
  handleInterval();

  function handleTick(event) {
    if(opponentPlaying){
      opponentPlayingTicks++;
      if(opponentPlayingTicks > 5 * 60){
       playerTurn = true;
        opponentPlaying = false;
        opponentPlayingTicks = 0;
      }
    }

    if(putted){
      if(playerball && playerball.vx == 0 && playerball.vy == 0) {
        putted = false;
        //playerTurn = false;
      }
    }
    if(ticks > 2*60){
      if(!wonGame && ((playerball && playerball.inHole && playerTurn) || (opponentball && opponentball.inHole && !playerTurn))){
        wonGame = true;
        wonDialog();
      }
      ticks = 0;
    }
    

    if(playerball && !playerball.inHole){
   checkCollisions(playerball);
    }
    if(opponentball && !opponentball.inHole){
      checkCollisions(opponentball);
    }
    if(playerball && opponentball && !opponentball.inHole && !playerball.inHole){
      checkBallCollisions();
    }
    checkObstacleCollisions();

    stage.update();
    ticks = ticks + 1;
  }
  if(player1 == user){
    var newGame = Math.floor(Math.random() * 5);
    send("start,"+newGame)
    startGame(newGame);
    currentTurn = currentTurn+1;
  }
//  wonDialog();
