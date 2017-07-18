// Electricity III

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const COLORS = ['#ffcc00','#33cc33','#6600ff','#ff9900','#0066ff', '#cc0000', '#ff99cc']


const Random = new function() {
    const R = Math.random;
    R.float = function(min, max) {
        return min + Random() * (max - min);
    }

    R.bool = function() {
        return Random() < 0.5
    }

    R.listElement = function(list) {
        if(list == undefined) return undefined;
        var i = Math.floor(Random() * list.length);
        return list[i];
    }

    return R;
}


var Ring = function(x, y, r) {
    this.centerX = x;
    this.centerY = y;
    this.r = r;
    this.points = this.init();
    this.color = Random.listElement(COLORS);
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
        this.points = this.init();
        this.color = Random.listElement(COLORS);
    },

    update: function(x, y) {
        this.centerX = x;
        this.centerY = y;

    },

    render: function(context) {
        let centerX = this.centerX;
        let centerY = this.centerY;
        context.beginPath();
        context.fillStyle = this.color;
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
        context.fill();
    }
}

var Element = function(x, y, startRadius, dr, num, colors) {
    this.rings = [];
    this.num = num;
    for(let i=num-1; i>0; i--) {
        let color = colors ? colors[i] : undefined;
        this.rings.push(new Ring(x, y, startRadius + (dr * i), color));
    }
}

Element.prototype = {
    update: function(x, y) {
        let prevX = x;
        let prevY = y;
        let num = this.num;
        for(let i=this.rings.length-1; i>=0; i--) {
            let ring = this.rings[i];
            let newX = ring.centerX + (prevX - ring.centerX)/((num-i)+1);
            let newY = ring.centerY + (prevY - ring.centerY)/((num-i)+1);
            ring.update(newX, newY);
            prevX = newX;
            prevY = newY;
        }
    },
    reset: function() {
        this.rings.forEach(function(ring) {
            ring.reset();
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
    var mouseX = CANVAS_WIDTH/2;
    var mouseY = CANVAS_HEIGHT/2;

    function onClick() {
        ELEMENTS.forEach(function(element) {
            element.reset(mouseX, mouseY);
        });
    }

    function onMouseMove(e) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }

    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("click", onClick);

        ELEMENTS.push(new Element(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 15, 4, 12, [
            '#ffcc00','#33cc33','#6600ff','#ff9900','#0066ff']));

        update();
    }

    function update() {
        requestAnimationFrame(update);

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ELEMENTS.forEach(function(element) {
            element.update(mouseX, mouseY);
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
    canvas.style="border-color: gray; border-style: solid; border-width: 1px"
    base.appendChild(canvas);
    World.init();
}

if (document.readyState === 'complete') init();
else window.addEventListener('load', init);



