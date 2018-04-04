function reload(){
  window.location.reload();
}
function reset(){
  openSet = [];
  closedSet = [];
  path = [];
  background(255);
  w = width/cols;
  h=  height/rows;
  grid = new Array(cols);
  //making a 2D Array
  for(var i = 0;i<cols;i++){
    grid[i] = new Array(rows);
  }

  for(var i = 0;i<cols;i++){
    for(var j = 0;j<rows;j++){
      grid[i][j] = new Spot(i,j);
    }
  }
  for(var i = 0;i<cols;i++){
    for(var j = 0;j<rows;j++){
      grid[i][j].addNeighbors(grid);
    }
  }
  start = grid[0][0];
  //rows-1
  end = grid[cols-1][rows-1];
  openSet.push(start);
  start.wall = false;
  end.wall = false;
  loop();
}

function removeFromArray(arr,elt){
  for(var i = arr.length;i>=0;i--){
    if(arr[i]== elt){
      arr.splice(i,1);
    }
  }
}

var cols = 40;
var rows = 40;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var start;
var end;
var w,h;
var path = [];
var time = 0;
var Btn;
var canvas;

function Spot(i,j){
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;
  var noiseScale = 10;
  noiseSeed(random(0,8736482376));
  noiseDetail(.6);
  if(noise(i*noiseScale,j*noiseScale)<0.23){
    this.wall = true;
  }
  this.show = function(col,type){
    var x = this.i*w;
    var y = this.j*h;
    stroke(255);
    if(type === 0){
      noStroke();
      fill(col);
      if(this.wall){
        fill(0);
      }
      //ellipse(x+w/2,y+h/2,w/1.5,h/1.5);
      rect(x+1,y+1,w-1,h-1);
    }
  };
  this.addNeighbors = function(grid){
    var i = this.i ;
    var j = this.j ;
    //straight
    if(i < cols-1){this.neighbors.push(grid[i+1][j]);}
    if(i > 0){this.neighbors.push(grid[i-1][j]);}
    if(j < rows - 1){this.neighbors.push(grid[i][j+1]);}
    if(j > 0){this.neighbors.push(grid[i][j-1]);}
    //diagonals
    if(i>0 && j>0){this.neighbors.push(grid[i-1][j-1]);}
    if(i < cols - 1 && j > 0){this.neighbors.push(grid[i+1][j-1]);}
    if(i > 0 && j < rows - 1){this.neighbors.push(grid[i-1][j+1]);}
    if(i < cols-1 && j < rows-1){this.neighbors.push(grid[i+1][j+1]);}
  };
}

function heuristic(a,b){
  var d = dist(a.i,a.j,b.i,b.j);
  return d;
}

var soundOBJs = [];
var click;
function SetupSounds(){
  setupSoundOnClick(soundOBJs,'body',click)
}

function preload(){
  click = loadSound("Sounds/click.wav");
}

function setup() {
  SetupSounds();
  canvas = createCanvas(400,400);
  canvas.parent('canvas');
  Btn = createButton("Restart");
  Btn.mousePressed(reset);
  Btn.parent('canvas');
  console.log('A*');
  background(255);
  w = width/cols;
  h=  height/rows;
  for(var i = 0;i<cols;i++){
    grid[i] = new Array(rows);
  }
  for(var i = 0;i<cols;i++){
    for(var j = 0;j<rows;j++){
      grid[i][j] = new Spot(i,j);
    }
  }
  for(var i = 0;i<cols;i++){
    for(var j = 0;j<rows;j++){
      grid[i][j].addNeighbors(grid);
    }
  }
  start = grid[0][0];
  end = grid[cols-1][rows-1];
  openSet.push(start);
  start.wall = false;
  end.wall = false;
}

function draw() {
  if(openSet.length > 0){
    var winner=0;
    for(var i=0;i<openSet.length;i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }
    var current = openSet[winner];
    path = [];
    var temp = current;
    path.push(temp);
    while(temp.previous){
      path.push(temp.previous);
      temp = temp.previous;
    }
    var pathstr = "Path total length: ";
    var tot = 0;
    for(var i = path.length-1;i>1;i--){
      tot+=dist(path[i].i,path[i].j,path[i-1].i,path[i-1].j);
    }
    document.getElementById('path').innerHTML = pathstr+tot/(dist(0,0,cols,rows));
    if(current === end){
      console.log("DONE!!!");
      document.getElementById('Solution').innerHTML = 'Done Pathfinding!!! :^)';
      noLoop();
    }
    removeFromArray(openSet,current);
    closedSet.push(current);
    var neighbors = current.neighbors;
    for(var i = 0; i<neighbors.length;i++){
      var neighbor = neighbors[i];
      var newPath = false;
      if(!closedSet.includes(neighbor) && !neighbor.wall){
        var tempG = current.g+1;
        if(openSet.includes(neighbor)){
          if(tempG < neighbor.g){
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
          newPath = true;
        }
        if(newPath){
          neighbor.h = heuristic(neighbor,end);
          neighbor.f = neighbor.g+neighbor.h;
          neighbor.previous = current;
        }
      }
    }
  }else{
    document.getElementById('Solution').innerHTML = 'No Solution Found :(';
    noLoop();
    return;
  }
  background(0);
  for(var i = 0;i<cols;i++){
    for(var j = 0;j<rows;j++){
      grid[i][j].show(color(255),0);
    }
  }
  for(var j = 0;j<openSet.length;j++){
      openSet[j].show(color(0,128,0),0);
  }
  for(var j = 0;j<closedSet.length;j++){
    closedSet[j].show(color(255,0,0),0);
  }
  noFill();
  strokeWeight((w/3+h/3)/2);
  stroke(0,34,200);
  beginShape();
  for(var j = 0;j<path.length;j++){
    vertex(path[j].i*w+w/2,path[j].j*h+h/2);
  }
  endShape();
  strokeWeight(0);
  document.getElementById('pathlength').innerHTML = 'Path length: '+ path.length;
  document.getElementById('iterations').innerHTML = 'Iterations: '+ time;
  time++;
}
