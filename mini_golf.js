
  var id = document.getElementById("gameid").innerHTML;
  var last = 0;
  var stage = new createjs.Stage("game156");
  stage.canvas.height = window.innerHeight - 54;
  green = new createjs.Shape();
  green.graphics.beginFill("green").drawRect(0, 0, window.innerWidth, window.innerHeight);
  stage.addChild(green);
  createjs.Touch.enable(stage);
  /*stage.on("stagemousedown", function(evt) {
    playerball = new createjs.Shape();
    playerball.graphics.beginFill("red").drawCircle(0, 0, 20);
    playerball.x = evt.x
    
    console.log("https://uglek.com/game/" + id + "/post/")
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://uglek.com/game/" + id + "/post/", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send("put 90 50");
  });*/
  
  start = new createjs.Shape();
  start.graphics.beginFill("grey").drawRect(0, 0, 100, 50);
  start.x = 0;
  start.y = 0;
var ballplaced = false;
var pressmovestarted = false;
var movestartx;
var movestarty;
  start.on("mousedown", function(evt) {
    if(!ballplaced){
      playerball = new createjs.Shape();
      playerball.graphics.beginFill("white").drawCircle(0, 0, 5);
      playerball.x = evt.stageX;
      playerball.y = evt.stageY;
      stage.addChild(playerball)
      ballplaced = true;
    }
    else {
      playerball.x = evt.stageX;
      playerball.y = evt.stageY;
    }
  });
  stage.addChild(start);

var line;
function drawLine(x,y,xx,yy){
   // Get a new 'shape' which comes with a 'graphics' property that allows us to draw
  stage.removeChild(line);
            line = new createjs.Shape();

            // Add this line shape to the canvas
            stage.addChild(line);

            // Set the 'brush stroke' style (basically the thickness of the line)
            //      Then start drawing a black line
            line.graphics.setStrokeStyle(3).beginStroke("rgba(0,0,0,1)");

            // Tell EaselJS where to go to start drawing the line
            line.graphics.moveTo(x, y);

            // Tell EaselJS where to draw the line to
            line.graphics.lineTo(xx, yy);
}

stage.on("stagemousedown", function(evt) {
          if(!pressmovestarted){
          movestartx = evt.stageX;
            movestartY = evt.stageY;
            pressmovestarted = true;
          }
        
      });
stage.on("stagemouseup", function(evt) {
          movex = movestart.x - evt.stageX;
          movey = movestart.y - evt.stageY;
          if(movex > 30 && movey > 30){
          playerball.x = playerball.x + movex;
          playerball.y = playerball.y + movey;
          }
      pressmovestarted = false
      });
stage.on("stagemousemove", function(evt) {
          movex = movestart.x - evt.stageX;
          movey = movestart.y - evt.stageY;
          drawLine(playerball.x,playerball.y,playerball.x + movex,playerball.y + movey);
      });
  
    //Update stage will render next frame
  stage.update();
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", handleTick);
  function handleTick(event) {
    stage.update();
  }
