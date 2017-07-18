// Electricity III

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;


const Random = new function() {
    const R = Math.random;
    R.float = function(min, max) {
        return min + Random() * (max - min);
    }

    R.bool = function() {
        return Random() < 0.5
    }

    return R;
}


var Ring = function(x, y, r, color) {
    this.centerX = x;
    this.centerY = y;
    this.r = r;
    this.points = this.init();
    this.strokeStyle = color || 'black';

}

Ring.prototype = {
    init: function() {
        var theta = 0;
        let points = [];
        while(theta < Math.PI * 2) {
            let radius = this.r + Random.float(-8, 8);
            points.push({x: radius*Math.cos(theta), y: radius*Math.sin(theta)})
            theta += Random.float(Math.PI/20, Math.PI/6);
        }
        return points;
    },

    reset: function(x, y) {
    },

    update: function() {
        this.points = this.init();
    },

    render: function(context) {
        let centerX = this.centerX;
        let centerY = this.centerY;
        context.beginPath();
        context.strokeStyle = this.strokeStyle;
        this.points.forEach(function(point, index) {
            let x = centerX + point.x;
            let y = centerY + point.y;
            if (index === 0) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y);
            }
        });
        context.closePath();
        context.stroke();
    }
}

var Element = function(x, y, startRadius, dr, num, colors) {
    this.rings = [];
    for(let i=0; i<num; i++) {
        let color = colors ? colors[i] : undefined;
        this.rings.push(new Ring(x, y, startRadius + (dr * i), color));
    }
}

Element.prototype = {
    update: function() {
        this.rings.forEach(function(ring) {
            ring.update();
        });
    },
    render: function(context) {
        this.rings.forEach(function(ring) {
            ring.render(context);
        });
    }
}


var World = new function() {
    var canvas = null;
    var ctx = null;
    var ELEMENTS = [];
    
    function onClick(e) {
    }

    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        canvas.addEventListener("click", onClick);

        ELEMENTS.push(new Element(CANVAS_WIDTH/4, CANVAS_HEIGHT/4, 45, 6, 5, [,,,'#ff0000']));
        ELEMENTS.push(new Element(CANVAS_WIDTH*3/4, CANVAS_HEIGHT/4, 45, 6, 5, [,,,'#80bfff']));
        ELEMENTS.push(new Element(CANVAS_WIDTH/4, CANVAS_HEIGHT*3/4, 45, 6, 5, [
            '#a6a6a6','#a6a6a6','#a6a6a6','#4d4d4d','#a6a6a6']));
        ELEMENTS.push(new Element(CANVAS_WIDTH*3/4, CANVAS_HEIGHT*3/4, 45, 6, 5, [
            '#ffcc00','#33cc33','#6600ff','#ff9900','#0066ff']));

        setInterval(update, 100);
        update();
    }

    function update() {

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ELEMENTS.forEach(function(element) {
            element.update();
            element.render(ctx);
        });
    }

    return {
        init: init,
        update: update
    }
};

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



