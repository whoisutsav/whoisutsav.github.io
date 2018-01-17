// Plants 2

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

function Plant() {
    
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

