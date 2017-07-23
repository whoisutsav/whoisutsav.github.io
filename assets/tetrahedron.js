// Tetrahedron

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

var Triangle = function(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
    this.theta = 0;
}


Triangle.prototype = {
    update: function(x, y) {
        this.theta = -1 * Math.atan2((x - this.x), (y - this.y));

    },
    draw: function(context) {
        let r = this.side * Math.sqrt(3)/3;
        let Ax = r * Math.cos(this.theta);
        let Ay = r * Math.sin(this.theta);
        let Bx = r * Math.cos(this.theta + (2*Math.PI/3));
        let By = r * Math.sin(this.theta + (2*Math.PI/3));
        let Cx = r * Math.cos(this.theta + (4*Math.PI/3));
        let Cy = r * Math.sin(this.theta + (4*Math.PI/3));

        context.beginPath();
        context.moveTo(this.x + Ax, this.y + Ay);
        context.lineTo(this.x + Bx, this.y + By);
        context.lineTo(this.x + Cx, this.y + Cy);
        context.closePath();
        context.stroke(); 
    }

}

var World = new function() {
    let triangle = new Triangle(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 125);
    let ctx = null;

    function onMouseMove(e) {
        triangle.update(e.offsetX, e.offsetY);
    }

    function init() {
        ctx = document.getElementById('canvas').getContext('2d');

        canvas.addEventListener("mousemove", onMouseMove);

        draw();
    }

    function draw() {
        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        triangle.draw(ctx);
    }

    return {
        init: init,
        draw: draw
    }
}();


function init() {
    var base = document.getElementById('container');
    var canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvas.id = 'canvas';
    base.appendChild(canvas);
    
    World.init();
}

if (document.readyState === 'complete') init();
else window.addEventListener('load', init);

