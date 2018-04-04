// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;

var engine = Engine.create();

var render = Render.create({
    element: document.body,
    engine: engine
});

var canvas;
function setup() {
  canvas = createCanvas(400,400);
  canvas.parent('canvas');
}

function draw() {
  background(0);
}
