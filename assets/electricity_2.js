// Electricity

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

var Ring = function(x, y, r) {
    this.centerX = x;
    this.centerY = y;
    this.r = r;
    this.points = this.init();

    // todo - move this into the prototype? or enclose r
}

Ring.prototype = {
    init: function() {
        var theta = 0;
        let points = [];
        while(theta < Math.PI * 2) {
            let radius = this.r + Random.float(-16, 16);
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


var World = new function() {
    var canvas = null;
    var ctx = null;
    var RINGS = [];
    
    function onClick(e) {
    }

    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        canvas.addEventListener("click", onClick);

        RINGS.push(new Ring(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 75));
        RINGS.push(new Ring(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 85));
        RINGS.push(new Ring(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 95));
        RINGS.push(new Ring(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 105));
        RINGS.push(new Ring(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 115));

        setInterval(update, 100);
        update();
    }

    function update() {

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        RINGS.forEach(function(ring) {
            ring.update();
            ring.render(ctx);
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
    //canvas.style="cursor: none;"
    base.appendChild(canvas);
    World.init();
}

if (document.readyState === 'complete') init();
else window.addEventListener('load', init);



