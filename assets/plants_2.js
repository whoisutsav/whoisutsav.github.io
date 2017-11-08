// Plants 2

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

function Plant() {
    
}


function Scene(width, height) {
    this.plants = [];
    this.width = width;
    this.height = height;
}

Scene.prototype.addPlant = function() {
    // Add a plant somehow
}

function Renderer(width, height) {
    this.canvas = document.findElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.width = width;
    this.height = height;
}

Renderer.prototype.render = function(scene) {
    this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    scene.plants.forEach(function(plant) {
        plant.vines.forEach(vine) {
            // draw plant
        }
    });

}

function init() {
    var base = document.getElementById('container');
    var canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvas.id = 'canvas';
    canvas.style="border-color: gray; border-style: solid; border-width: 1px"
    base.appendChild(canvas);

    const renderer = new Renderer(CANVAS_WIDTH, CANVAS_HEIGHT);
    const scene = new Scene(CANVAS_WIDTH, CANVAS_HEIGHT);
}

if (document.readyState === 'complete') init();
else window.addEventListener('load', init);

