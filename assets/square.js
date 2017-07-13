// Rotating Square

var Square = function(x, y, angle, alpha) {
    this.x = x;
    this.y = y;
    this.diagonal = 75;
    this.angle = angle;
    this.alpha = alpha;
}

Square.prototype.corners = function() {
    const theta = this.angle * Math.PI/180;
    var points = [];

    for(let i=0; i<4; i++) {
        const currTheta = theta + (i * Math.PI/2);
        pX = this.x + this.diagonal * Math.cos(currTheta);
        pY = this.y + this.diagonal * Math.sin(currTheta);
        points.push({ x: pX, y: pY});
    }
    
    return points;
}

Square.prototype.draw = function(context) {
    context.beginPath();
    context.strokeStyle = 'rgba(160, 160, 160,' + this.alpha + ')';
    const points = this.corners();
    let p1 = points.shift();
    context.lineTo(p1.x, p1.y);
    let p2 = points.shift();
    context.lineTo(p2.x, p2.y);
    let p3 = points.shift();
    context.lineTo(p3.x, p3.y);
    let p4 = points.shift();
    context.lineTo(p4.x, p4.y);
    context.closePath();
    context.stroke();
}

function draw(timestamp) {
    let ctx = document.getElementById('canvas').getContext('2d');
    ctx.clearRect(0, 0, 300, 300); // clear canvas

    var square = new Square(100, 100, timestamp/30, 100);
    square.draw(ctx);

    var square2 = new Square(100, 100, (timestamp/30) + 5, .60);
    square2.draw(ctx);

    var square3 = new Square(100, 100, (timestamp/30) + 10, .30);
    square3.draw(ctx);
    
    requestAnimationFrame(draw);
}

function init() {
    var base = document.getElementById('container');
    var canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    canvas.id = 'canvas';
    base.appendChild(canvas);
    requestAnimationFrame(draw);
}

if (document.readyState === 'complete') init();
else window.addEventListener('load', init);
