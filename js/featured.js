var canvas;
var walker = undefined;
var hu=0;
var time;
var last = walker;


var soundOBJs = [];
var click;
var zap;
function WebSoundSetup(){
  setupSoundOnClick(soundOBJs,'mainClick',click);
}
function loadAllSounds(){
  click = loadSound("Sounds/click.wav");
  zap = loadSound("Sounds/SFX/zap.wav");
}
function preload(){
  loadAllSounds();
}


function setup(){
  WebSoundSetup();
  colorMode(HSB);
  canvas = createCanvas(400, 400);
  canvas.parent('CanvasContainer');
  walker = createVector(width/2,height/2);
  background(0);
  last = walker;
}

function draw(){
  hu+=.1;
  hu = hu % 255;
  fill(hu,255,255);
  point(walker.x,walker.y);
  last = walker;
  walker.add(createVector(random(-1,1),random(-1,1)));
  walker.x = constrain(walker.x,0,width);
  walker.y = constrain(walker.y,0,height);
}
