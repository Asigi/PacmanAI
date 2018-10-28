var GAMEBOARD = [];

var getXY = function(x, y) {
  var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP);
  var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);

  return {x: i, y: j}
}

var buildGameboard = function () {
  GAMEBOARD = [];
  for(var i = 0; i < 26; i++) {
    GAMEBOARD.push([]);
    for(var j = 0; j < 29; j++) {
      GAMEBOARD[i].push({
        bubble: false,
        superBubble: false,
        inky: false,
        pinky: false,
        blinky: false,
        clyde: false,
        pacman: false,
        eaten: false
      });
    }
  }

  for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
    var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
    var y = parseInt(bubbleParams[1]) - 1;
    var x = parseInt(bubbleParams[2]) - 1;
    var type = bubbleParams[3];
    var eaten = parseInt(bubbleParams[4]);
    if (type === "b") {
      GAMEBOARD[x][y].bubble = true;
    } else {
      GAMEBOARD[x][y].superBubble = true;
    }
    if(eaten === 0) {
      GAMEBOARD[x][y].eaten = false;
    } else {
      GAMEBOARD[x][y].eaten = true;
    }
  }

  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      if(!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble){
          GAMEBOARD[i][j] = null;
      }
    }
  }

  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      if((i === 0 && (j === 13)) ||
      (i === 1 && (j === 13)) ||
      (i === 2 && (j === 13)) ||
      (i === 3 && (j === 13)) ||
      (i === 4 && (j === 13)) ||
      (i === 6 && (j === 13)) ||
      (i === 7 && (j === 13)) ||
      (i === 8 && (j >= 10 && j <= 18)) ||
      (i === 9 && (j === 10 || j === 16)) ||
      (i === 10 && (j === 10 || j === 16)) ||
      (i === 11 && (((j >= 8) && (j <= 10)) || j === 16)) ||
      (i === 12 && (j === 10 || j === 16)) ||
      (i === 13 && (j === 10 || j === 16)) ||
      (i === 14 && (((j >= 8) && (j <= 10)) || j === 16)) ||
      (i === 15 && (j === 10 || j === 16)) ||
      (i === 16 && (j === 10 || j === 16)) ||
      (i === 17 && (j >= 10 && j <= 18)) ||
      (i === 18 && (j === 13)) ||
      (i === 19 && (j === 13)) ||
      (i === 21 && (j === 13)) ||
      (i === 22 && (j === 13)) ||
      (i === 23 && (j === 13)) ||
      (i === 24 && (j === 13)) ||
      (i === 25 && (j === 13)))  {
        GAMEBOARD[i][j] = {
          bubble: false,
          superBubble: false,
          inky: false,
          pinky: false,
          blinky: false,
          clyde: false,
          pacman: false,
          eaten: false
        };
      }
    }
  }

  var p = getXY(GHOST_INKY_POSITION_X,GHOST_INKY_POSITION_Y);
  if(GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].inky = true;
  p = getXY(GHOST_PINKY_POSITION_X,GHOST_PINKY_POSITION_Y);
  if(GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].pinky = true;
  p = getXY(GHOST_BLINKY_POSITION_X,GHOST_BLINKY_POSITION_Y);
  if(GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].blinky = true;
  p = getXY(GHOST_CLYDE_POSITION_X,GHOST_CLYDE_POSITION_Y);
  if(GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].clyde = true;

  p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
  if(GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].pacman = true;

};

function drawRect(i,j) {
  var ctx = PACMAN_CANVAS_CONTEXT;
  var ygap = 17.75;
  var x = BUBBLES_X_START + i*BUBBLES_GAP - BUBBLES_GAP/2;
  var y = BUBBLES_Y_START + j*ygap- 9;
  var w = BUBBLES_GAP;
  var h = ygap;

  if(GAMEBOARD[i][j]){
    ctx.strokeStyle = "green";
    ctx.rect(x,y,w,h);
    ctx.stroke();
  }
}

function drawDebug() {
  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      drawRect(i,j);
    }
  }
}



//assign a number to each ghost for easy reference.
var B_NUM = 1; //blinky
var P_NUM = 2; //pinky
var I_NUM = 3; //inky
var C_NUM = 4; //clyde
// when the ghost is in the center storage area, it's coordinate values will be as such:
var minXstorage = 238;
var maxXstorage = 314;
var yStorage = 258;




//returns a list of ghosts #'s who are outside the center storage area (NOT THE TUNNEL!)
function checkOutside() {
  var list = [];
  
  if (checkOutsideHelper(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y)) {list.push(0)};
  if (checkOutsideHelper(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y)) {list.push(1)};
  if (checkOutsideHelper(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y)) {list.push(2)};
  if (checkOutsideHelper(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y)) {list.push(3)};

  console.info("number of ghosts who are outside: " + list.length );
  
  return list;
}
//helper function for checking if the ghost is outside the center storage
function checkOutsideHelper(theX, theY) {
  if (theX < minXstorage || theX > maxXstorage || theY != yStorage) {
    return true; //the ghost is outside the center storage
  } else{
    return false; //the ghost is not outside center storage
  }
}

//returns a list of distances of each ghost
function ghostDistances(){
  var distList = [];
  distList.push(distanceToPacman(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y));
  distList.push(distanceToPacman(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y));
  distList.push(distanceToPacman(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y));
  distList.push(distanceToPacman(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y));
  return distList;
}

//returns hypotenuse distance
function distanceToPacman(ghostX, ghostY) {
  var a = PACMAN_POSITION_X - ghostX;
  var b = PACMAN_POSITION_Y - ghostY;
  var c = Math.sqrt( (a*a) + (b*b) );
  return c;
}

//finds the nearest ghost out of the list of ghosts that are not in the tunnel.
function findNearestGhost(outList, distList) {
  var lowestDistance = 100000;
  var lowestGhost; //number corresponding to which ghost is closest
  for (i = 0; i < outList.length; i++) {
    var dist = distList[outList[i]];
    //logger.info("distance of " + i + " ghost is " + dist);
    if (lowestDistance > dist) {
      lowestDistance = dist;
      lowestGhost = outList[i];
    }
  }
  return lowestGhost;
}

//pass in the number correspending to the ghost that should be copied.
function copyGhostDirec(ghostNum) {
  if (ghostNum = 0) {
    return GHOST_BLINKY_DIRECTION;
  } else if (ghostNum = 1) {
    return GHOST_PINKY_DIRECTION;
  } else if (ghostNum = 2) {
    return GHOST_INKY_DIRECTION;
  } else {
    return GHOST_CLYDE_DIRECTION;
  }
}


function selectMove() {

    buildGameboard();

    var outsideTunnelList = checkOutside();   //check the position of each ghost. if they are not in the box. 
    var distanceList = ghostDistances();  //find the distance of each ghost from pacman
    var nearGhost = findNearestGhost(outsideTunnelList, distanceList); //variable for nearest ghost
    
    console.info("nearest ghost is " + nearGhost);

    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running

      var directions = [];
      for (var i = 1; i < 5; i++) {
          if (canMovePacman(i)) directions.push(i);
      }

      //do the same thing that the nearest ghost is doing.
      if (directions.length > 2 || !PACMAN_MOVING) {
        //if pacman can move in the direction that the nearest ghost is heading
        if (canMovePacman(copyGhostDirec(nearGhost))) {
          movePacman(copyGhostDirec(nearGhost)); //then move him in that direction
        } else { //else move him in a random direction //later on make sure he doesnt move in the direction of the ghost
          movePacman(directions[Math.floor(Math.random() * directions.length)]);
        }
      }
  }
 

  //TODO: 
  
  //make pacman change direction while moving rather than continuing his current direction 
  //if nearest ghost is within distance of 4, go in opposite direction of that ghost (dont do same thing, maybe ghost will turn away and you can create distance)
  //? find the path distance of each ghost from pacman (the path which the ghost would have to take to reach pacman) ?

};







setInterval(drawDebug, 1000/3);









    /* //Old code below 
    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running

        var directions = [];
        for (var i = 1; i < 5; i++) {
            if (canMovePacman(i)) directions.push(i);
        }

        if (directions.length > 2 || !PACMAN_MOVING) movePacman(directions[Math.floor(Math.random() * directions.length)]);
    }
    */


