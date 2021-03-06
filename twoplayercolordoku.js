// By Jasper Camber Holton. V0.0.96
(function twoplayercolordoku(){
  var board = blank_board_array();
var ogboard = blank_board_array();
var completedboard = blank_board_array();
function get_completed_cell(col, row) {
      return completedboard[col][row];
    }

  
  function logBoard() {
    //console.log("Board");
      for (let x = 0; x < 9; x++) {
        b = ""
        for (let y = 0; y < 9; y++) {
          b = b + board[x][y] + ",";
        }
        //console.log(b)
      }
  }
function blank_board_array() {
      return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
    }
  
  
function get_board_array() {
      return board;
    }


function set_board(board_string, completed_board_string) {
      for (let col = 0; col <= 8; col++) {
        for (let row = 0; row <= 8; row++) {
          completedboard[col][row] = completed_board_string.charAt(row * 9 + col);
          board[col][row] = board_string.charAt(row * 9 + col);
          ogboard[col][row] = board_string.charAt(row * 9 + col);
        }
      }
    }
function get_cell(col, row) {
      return board[col][row];
    }

function get_available_balls() {
      let availableBalls = [];
      let ballCounts = [];
      for (let i = 0; i < 10; i++) {
        ballCounts[i] = 0;
      }
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          ballCounts[board[x][y]]++;
        }
      }
      for (let i = 1; i < 10; i++) {
        availableBalls[i] = true;
        if (ballCounts[i] == 9) {
          availableBalls[i] = false;
        }
      }
      return availableBalls;
    }

function make_move(col, row) {
      //console.log("Made move at " + col + "," + row + " with ball " + completedboard[col][row])
      board[col][row] = completedboard[col][row];
      let willDropConfetti = true;
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          if (board[x][y] == 0) {
            willDropConfetti = false;
          }
        }
      }
      if (willDropConfetti && !isFinished) {
        isFinished = true;
        wonGame();
        dropConfetti();
      }
    }

function is_legal_move(col, row, value) {

      if (ogboard[col][row] > 0) {
        return false;
      }
      if (value == 10) {
        return true;
      }

      if (completedboard[col][row] == value) {
        return true;
      }
      return false;
}
  let seed = Math.floor(Math.random() * 5000);

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
    let rangeSize = end - start;
    let randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  }
  RNG.prototype.choice = function(array) {
    return array[this.nextRange(0, array.length)];
  }
  let rng = new RNG(seed);

  let id;
  let player1;
  let player2;
  let user;
  try {
    id = document.getElementById("gameid").innerHTML;
    player1 = document.getElementById("player1").innerHTML;
    player2 = document.getElementById("player2").innerHTML;
    user = document.getElementById("user").innerHTML;
    if(user == player2){
      send("join");
    }
  } catch {
    //console.log("No game")
  }

  let gameplay;

  function send(text){
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "https://uglek.com/game/" + id + "/post/", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      xhr.send(text);
  }

  let canvasid = "game198";
  let canvas = document.getElementById(canvasid);
  let width = canvas.width;
  let height = canvas.height;


  /*
  let ADHEIGHT = 90;
  let less = width;
  if (height < less) {
    less = height - ADHEIGHT;
  }*/
  let TEXTTYPE = "bold " + 42 + "px Arial";
  let last = 0;
  let stage = new createjs.Stage(canvasid);
  let container = new createjs.Container();

  background = new createjs.Shape();
  background.graphics.beginFill("#b0afb3").drawRect(0, 0, window.innerWidth, window.innerHeight); //
  stage.addChild(background);
  stage.addChild(container);

var dontshowad;
try {
    dontshowad = document.getElementById("dontshowad").innerHTML;
 
  } catch {
    //console.log("No game")
  }

  let ADHEIGHT = 90;
  if(dontshowad == "true"){
    ADHEIGHT = 0;
  }
  let less = window.innerWidth;
  if(window.innerHeight < less){
    less = window.innerHeight-ADHEIGHT;
  }
  scale = container.scale = less / 1000;

  stage.canvas.width = window.innerWidth;
  let canvasHeight = window.innerHeight-ADHEIGHT;
  stage.canvas.height = canvasHeight;
  leftbound = (window.innerWidth - less)/2/scale;
  topbound = ((canvasHeight - less)/2)/scale;

  //leftbound = (width - less) / 2 / scale;
  //topbound = ((height - less) / 2) / scale;
  // red, orange, yellow, dark green, light green, dark blue, light blue, dark purple, pink
  let colors = ["#f50521", "#fa8907", "#fafa07", "#2e8008", "#33f707", "#214bcc", "#07eef2", "#9b5bf0", "#fa75e6", "grey"];
  let selectorBallOffset = 5;
  let ballSize = 37;
  let selectorBall = new createjs.Shape();
  selectorBall.graphics.beginFill("white").drawCircle(0, 0, ballSize + 7);
  selectorBall.x = leftbound + 100 + 800 / 20 + selectorBallOffset;
  selectorBall.y = topbound + 900 + 800 / 18 / 2;
  container.addChild(selectorBall)
  let selectedBall = 0;
  let selectorBalls = [];
  let text;
  let text2;
  let hints = 0;
  for (let i = 0; i < 10; i++) {
    selectorBalls[i] = new createjs.Shape();
    selectorBalls[i].graphics.beginFill(colors[i]).drawCircle(0, 0, ballSize);
    selectorBalls[i].x = leftbound + 100 + 800 / 10 * i + 800 / 20 + selectorBallOffset;
    selectorBalls[i].y = topbound + 900 + 800 / 18 / 2;
    selectorBalls[i].index = i
    selectorBalls[i].on("mousedown", function(event) {
      let availableBalls = get_available_balls();
      if(availableBalls[event.target.index + 1] || (hints > 0 && event.target.index == 9)){
        selectorBall.x = event.target.x;
        selectedBall = event.target.index
      }
    });
    if (i == 9) {
      //text = new createjs.Text("\u21ba", TEXTTYPE, "#000000")
      text2 = new createjs.Text("?", TEXTTYPE, "#000000")
      text2.x = selectorBalls[i].x - 13;
      text2.y = selectorBalls[i].y - 20;
    }
    container.addChild(selectorBalls[i])
  }
  container.addChild(text2)

  

  line1 = new createjs.Shape();
  line1.graphics.beginFill("grey").drawRect(0, 0, 800, 5);
  line1.x = leftbound + 100 * 1;
  line1.y = topbound + 100 + 645 / 3;
  container.addChild(line1)

  line2 = new createjs.Shape();
  line2.graphics.beginFill("grey").drawRect(0, 0, 800, 5);
  line2.x = leftbound + 100 * 1;
  line2.y = topbound + 582;
  container.addChild(line2)

  line3 = new createjs.Shape();
  line3.graphics.beginFill("grey").drawRect(0, 0, 5, 800);
  line3.x = leftbound + 148 + 645 / 3;
  line3.y = topbound + 50;
  container.addChild(line3)

  line4 = new createjs.Shape();
  line4.graphics.beginFill("grey").drawRect(0, 0, 5, 800);
  line4.x = leftbound + 630;
  line4.y = topbound + 50;
  container.addChild(line4)
  line5 = new createjs.Shape();
  line5.graphics.beginFill("grey").drawRect(0, 0, 5, 800);
  line5.x = leftbound + 100 * 1;
  line5.y = topbound + 50;
  container.addChild(line5)

  line8 = new createjs.Shape();
  line8.graphics.beginFill("grey").drawRect(0, 0, 5, 800);
  line8.x = leftbound + 100 * 1 + 800;
  line8.y = topbound + 50;
  container.addChild(line8)

  line6 = new createjs.Shape();
  line6.graphics.beginFill("grey").drawRect(0, 0, 800, 5);
  line6.x = leftbound + 100;
  line6.y = topbound + 50;
  container.addChild(line6)

  line7 = new createjs.Shape();
  line7.graphics.beginFill("grey").drawRect(0, 0, 800, 5);
  line7.x = leftbound + 100;
  line7.y = topbound + 50 + 800;
  container.addChild(line7)



  function updateSelectorBalls(){
    let availableBalls = get_available_balls();
    //console.log("Available balls: " + availableBalls)
    for (let i = 1; i < 10; i++) {
      if (!availableBalls[i]) {
        selectorBalls[i - 1].alpha = 0.3; //graphics.beginFill("grey").drawCircle(0,0,ballSize);
      } else {
        selectorBalls[i - 1].alpha = 1;
      }
    }
    if(selectedBall == 9 && hints == 0){
      for (let i = 1; i < 10; i++) {
        if(availableBalls[i]){
          selectedBall = i-1
          selectorBall.x = selectorBalls[selectedBall].x
          break;
        }
      }
    }
    if(selectedBall < 9 && !availableBalls[selectedBall+1]){
      for (let i = 1; i < 10; i++) {
        if(availableBalls[i]){
          selectedBall = i-1
          selectorBall.x = selectorBalls[selectedBall].x
          break;
        }
      }
    }
  }
  
  function makeMove(col,row,num){
    var ball = balls[col][row]
    if (!is_legal_move(col,row,num)) {
          ball.graphics.beginFill("grey").drawCircle(0, 0, ballSize);
          if (get_board_array()[col][row] > 0) {
            setTimeout(() => {
              ball.graphics.beginFill(colors[get_cell(col, row) - 1]).drawCircle(0, 0, ballSize);
            }, 2000);
          } else {
            setTimeout(() => {
              ball.graphics.beginFill("white").drawCircle(0, 0, ballSize);
            }, 1000);
          }
        } else {
          if (num != 10) {
            make_move(col, row);
            ball.graphics.beginFill(colors[num-1]).drawCircle(0, 0, ballSize);
            send("set,"+col+","+row+","+num)
          } else if (hints > 0) {
            make_move(col, row);
            ball.graphics.beginFill(colors[get_completed_cell(col, row) - 1]).drawCircle(0, 0, ballSize);
            send("set,"+col+","+row+","+num)
            hints = hints - 1;
            if (hints == 0) {
              selectorBalls[num-1].alpha = 0.3;
              updateSelectorBalls();
            }
          } else if (hints == 0) {
            ball.graphics.beginFill("grey").drawCircle(0, 0, ballSize);
            if (get_board_array()[col][row] > 0) {
              setTimeout(() => {
                ball.graphics.beginFill(colors[get_cell(col, row) - 1]).drawCircle(0, 0, ballSize);
              }, 2000);
            } else {
              setTimeout(() => {
                ball.graphics.beginFill("white").drawCircle(0, 0, ballSize);
              }, 1000);
            }
          }
        }
        updateSelectorBalls();
  }
  
  let rand = rng.nextRange(0, 399);
  let import_string = games2[rand * 2];
  let completed_import_string = games2[rand * 2 + 1];
  set_board(completed_import_string, completed_import_string);
  let sudoku_squares = createArray(9, 9);
  let balls = [];
  for (let i = 0; i < 9; i++) {
    balls[i] = [];
    for (let j = 0; j < 9; j++) {
      balls[i][j] = new createjs.Shape();
      balls[i][j].graphics.beginFill("white").drawCircle(0, 0, ballSize); //
      balls[i][j].x = leftbound + 100 + 800 / 9 * i + 800 / 18;
      balls[i][j].y = topbound + 50 + 800 / 9 * j + 800 / 18;
      balls[i][j].row = j;
      balls[i][j].col = i;
      balls[i][j].on("mousedown", function(evt) {
        makeMove(evt.target.col, evt.target.row, selectedBall + 1);
        
      });
      container.addChild(balls[i][j])

    }
  }

  function playTurn(col,row,selBall){
    //console.log("Made move with ball: " + selBall+1)
    target = balls[col][row];
    var aballs = get_available_balls();
    //console.log("Balls before: " + aballs);
    if (selBall != 10) {
      make_move(col, row);
      target.graphics.beginFill(colors[get_completed_cell(col, row) - 1]).drawCircle(0, 0, ballSize);
    } else if (hints > 0) {
      make_move(col, row);
      target.graphics.beginFill(colors[get_completed_cell(col, row) - 1]).drawCircle(0, 0, ballSize);
      hints = hints - 1;
      if (hints == 0) {
        selectorBalls[9].alpha = 0.3;
      }
    }
    aballs = get_available_balls();
    //console.log("Balls after: " + aballs);
    updateSelectorBalls();
  }

  function print_sudoku_to_webpage() {
    let board = get_board_array();
    for (let row = 0; row <= 8; row++) {
      for (let col = 0; col <= 8; col++) {
        let input = balls[col][row];
        if (board[col][row] != 0) {
          input.graphics.beginFill(colors[board[col][row] - 1]).drawCircle(0, 0, ballSize);
        } else {
          input.graphics.beginFill("white").drawCircle(0, 0, ballSize);
        }
      }
    }
  }
  print_sudoku_to_webpage()
  var opjContainer;
  function opponentJoinedGame(){
    opjContainer = new createjs.Container();
      var opjText = new createjs.Text("Opponent Joined Game", TEXTTYPE, "#000000")
      opjText.x = leftbound + 500;
      opjText.y = topbound + 10;
      opjText.textAlign = 'center';
      opjContainer.addChild(opjText);
    setTimeout(() => {
              container.removeChild(opjContainer);
            }, 5000);
    container.addChild(opjContainer);
  }

  let currentTurn = 0;
  function readCallback(){
    gp = gameplay;
    //console.log("Read callback");
        for(let i = currentTurn; i < gp.length; i++){
          sp = gp[i].split(",");
          //if(sp[3] == user){
            //currentTurn = i+1;
            //console.log("Player turn syndicated");
      
          //} else
          if(sp[0] == "start"){
            newGame(parseInt(sp[1]));
            //container.removeChild(difficultyContainer);
            currentTurn = i+1;
            //console.log("Start command");
          } else if(sp[0] == "set"){
            playTurn(parseInt(sp[1]),parseInt(sp[2]), parseInt(sp[3]))
            currentTurn = i+1;
            //console.log("Set command");
          } else if(sp[0] == "join" && user != player2){
            opponentJoinedGame();
            currentTurn = i+1;
            //console.log("Opponent Joined Game");
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
    return gameplay.split('/');
  }

  // This code is borrowed from another website. Thanks google.
  function createArray(length) {
    let arr = new Array(length || 0),
      i = length;

    if (arguments.length > 1) {
      let args = Array.prototype.slice.call(arguments, 1);
      while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
  }

  COLORS = ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"];
  let confettiCount = 60;
  let confetti = [];
  let confettivx = [];
  let confettivy = [];
  let confettiv = 10;
  let confettimin = -600;

  function drawConfetti() {
    for (i = 0; i < confettiCount; i++) {
      confetti[i] = new createjs.Shape();
      confetti[i].graphics.beginFill(COLORS[0, rng.nextRange(0, COLORS.length)]).drawCircle(0, 0, rng.nextRange(7, 15));
      confetti[i].x = rng.nextRange(0, width);
      confetti[i].y = rng.nextRange(window.innerHeight + 30);
      confetti[i].visible = false;
      confettivx[i] = rng.nextRange(-1, 1) / 5.0;
      confettivy[i] = rng.nextRange(-1, 1) / 5.0;
      stage.addChild(confetti[i]);
    }
  }

  function dropConfetti() {
    droppedConfetti = false;
    for (i = 0; i < confettiCount; i++) {
      confetti[i].visible = true;
      confetti[i].y = rng.nextRange(confettimin, -20);
      confetti[i].x = rng.nextRange(0, width);
      confettivx[i] = rng.nextRange(-3, 3) / 7.0;
      confettivy[i] = rng.nextRange(-3, 3) / 3.0;
    }
  }

  drawConfetti();

  //Update stage will render next frame

  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", handleTick2);

  let droppedConfetti = false;

  function handleTick2(event) {
    if (!droppedConfetti) {
      dropped = true;
      for (i = 0; i < confettiCount; i++) {
        if (confetti[i].y < window.innerHeight + 20) {
          confetti[i].x = confetti[i].x + confettivx[i]
          confetti[i].y = confetti[i].y + confettivy[i] + confettiv
          dropped = false;
        } else {
          confetti[i].visible = false;
        }
      }
      if (dropped) {
        droppedConfetti = true;
      }
    }
    stage.update();
  }

  let gamesfactor = 4*2; // gamesFactor is number of games / 400 (1600 games gamesFactor is 4)
  function newGame(difficulty) {
    // New game
    selectedBall = 0
    selectorBall.x = selectorBalls[selectedBall].x
    //let d = difficulty * gamesfactor * 100 + 100*gamesfactor;
    //let rand = rng.nextRange(d - 100*gamesfactor, d);
    let import_string = games2[difficulty * 2];
    let completed_import_string = games2[difficulty * 2 + 1];
    set_board(import_string, completed_import_string);
    print_sudoku_to_webpage();
    let availableBalls = get_available_balls();
    selectorBalls[9].alpha = 1;
    hints = 3;
    updateSelectorBalls();
  }

  let difficultyColors = ["#bafa25", "#e4f218", "#faa537", "#c70808"];
  let difficultyNames = ["Easy", "Medium", "Difficult", "Expert"]; //["Simple", "Easy", "Intermed.", "Expert"];

  let difficultyContainer;

  function drawDifficultySelector() {
    difficultyContainer = new createjs.Container();
    let difficulties = [];
    let diffText = [];
    for (let i = 0; i < difficultyColors.length; i++) {
      difficulties[i] = new createjs.Shape();
      difficulties[i].graphics.beginFill(difficultyColors[i]).drawCircle(0, 0, 110);
      difficulties[i].x = leftbound + 1000 / 4.0 * (i) + 125;
      difficulties[i].y = topbound + 1000 / 2.0;
      difficulties[i].diff = i;
      diffText[i] = new createjs.Text(difficultyNames[i], TEXTTYPE, "#000000")
      diffText[i].x = leftbound + 1000 / 4.0 * (i) + 125;
      diffText[i].y = topbound + 1000 / 2.0 - 20;
      diffText[i].textAlign = 'center';
      difficultyContainer.addChild(difficulties[i]);
      difficultyContainer.addChild(diffText[i]);
      difficulties[i].on("mousedown", function(event) {
        let d = event.target.diff * gamesfactor * 100 + 100*gamesfactor;
        let rand = rng.nextRange(d - 100*gamesfactor, d);
        newGame(rand);
        send("start,"+rand);
        container.removeChild(difficultyContainer);
      });
    }
    container.addChild(difficultyContainer);
  }

  let wonContainer;
  let wonDialog;
  let isFinished = false;
  // Draw a dialog to create a new game
  function wonGame() {
    wonContainer = new createjs.Container();
    wonDialog = new createjs.Shape();
    wonDialog.graphics.beginFill(colors[0]).drawCircle(0, 0, 1000);
    wonDialog.y = topbound + 1000 + 900;
    wonDialog.x = leftbound + 500;
    let wonText = new createjs.Text("You won! (Tap)", TEXTTYPE, "#000000")
    wonText.x = leftbound + 360;
    wonText.y = topbound + 925;
    wonContainer.on("mousedown", function(event) {
      container.removeChild(wonContainer);
      if(user == player1){
        drawDifficultySelector();
      }
      isFinished = false;
    });
    wonContainer.addChild(wonDialog);
    wonContainer.addChild(wonText);
    container.addChild(wonContainer);

  }
  if(user == player1){
    drawDifficultySelector();
  }
  let ticks = 0;

  function handleTick(event) {
    if(ticks > 5*60){
      ticks = 0;
      read();
      updateSelectorBalls();
      //console.log("Reading");
      logBoard();
    }
    ticks++;
    stage.update();
  }

  /*const interval = setInterval(function() {
      read();
      updateSelectorBalls();
      console.log("Reading");
      stage.update();
   }, 5000);*/

  createjs.Ticker.addEventListener("tick", handleTick);



  stage.update();

  //dropConfetti();
  //wonGame();
})();
