// Vine

let CANVAS_WIDTH = 500;
let CANVAS_HEIGHT = 400;

var Random = {
    between: function(min, max) {
        return Math.random() * (max - min) + min;
    }
}

var Segment = function(params) { 
    this.x = params.x;
    this.y = params.y;

    this.rotation = (Math.PI/180) * params.rotation;
    this.width = params.width;
    this.growthRate = params.growthRate;
    this.color = params.shaded ? 'rgb(38, 145, 52)' : 'rgb(35, 147, 50)'

    this.taper = (Math.PI/180) * 0.5;
    this.maturity = 0;
    this.length = 20; 
    this.grown = false;

    this.endX = this.x + this.length * Math.sin(this.rotation); // does this belong here?
    this.endY = this.y - this.length * Math.cos(this.rotation);
}

Segment.prototype = {
    update: function() {
        if (this.maturity < 1) {
            this.maturity += .01 * this.growthRate;
        } else {
            this.grown = true;
        }
    },
    draw: function(context) {

        let points = [];
        let dx = (this.maturity * this.length) * Math.tan(this.taper);

        points.push({x: -1 * this.width / 2, y: 0});
        points.push({x: dx - this.width/2, y: -1 * this.maturity * this.length});
        points.push({x: this.width/2 - dx, y: -1 * this.maturity * this.length});
        points.push({x: this.width/2, y: 0});

        let that = this;
        points = points.map(function(point) {
            let rotatedX = point.x * Math.cos(that.rotation) - point.y * Math.sin(that.rotation);
            let rotatedY = point.x * Math.sin(that.rotation) + point.y * Math.cos(that.rotation);
            return {x: rotatedX + that.x, y: rotatedY + that.y};
        });


        context.fillStyle = this.color;
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
        let controlX = (points[1].x + points[2].x)/2;
        let controlY = points[1].y - 3;
        context.quadraticCurveTo(controlX, controlY, points[2].x, points[2].y);
        context.lineTo(points[3].x, points[3].y);
        context.closePath();
        context.fill();
    }
}

var Vine = function(params) { 
    this.width = params.width;
    this.taperFactor = params.taperFactor;
    this.rotation = params.rotation;
    this.rotationFactor = params.rotationFactor;
    this.length = params.length;
    this.grown = false;
    this.x = params.x;
    this.y = params.y;

    let initialSegment = new Segment({
        x: this.x, 
        y: this.y, 
        shaded: false, 
        rotation: this.rotation, 
        width: this.width, 
        growthRate: 10});
    this.segments = Array.of(initialSegment); 
}

// TODO remove
let Curve = {
    exponentialOut: function(k) {
        return k === 0 ? 0 : Math.pow(1.5, k - 1);
    }
}


Vine.prototype = { 
    update: function() {
        let i = this.segments.length-1;

        if (this.segments[i].grown === false) {
            this.segments[i].update();
        } else if (this.segments.length <= this.length) {
            let x = this.segments[i].endX;
            let y = this.segments[i].endY;
            this.rotation += (Math.random() * this.rotationFactor * 2 - this.rotationFactor);  // switch to use random object
            this.width = Math.max(this.width*this.taperFactor, 1);
            this.segments.push(new Segment({
                x: x, 
                y: y, 
                shaded: this.segments.length % 2, 
                rotation: this.rotation, 
                width: this.width, 
                growthRate: Math.max(10 * Curve.exponentialOut((i+1)/15), 3)})); 
        } else {
            this.grown = true;
        }
    },
    draw: function(context) {
        this.segments.forEach(function(segment) {
            segment.draw(context);
        });
    }
}

var Plant = function(x, y, vines, width, height, base) {
    this.x = x; 
    this.y = y;
    this.MAX_VINES = vines;
    this.width = width;
    this.height = height;
    this.base = base;
    this.grown = false;

    //let vine = new Vine(5, 0.9, 0, 7, 9);
    this.vines = [] //Array.of(vine);
}

Plant.prototype = {
    update: function(){
        this.vines.forEach(function(vine) {vine.update();});
        if (this.vines.length <= this.MAX_VINES && Math.random() < .05) {
            this.vines.push(new Vine({
                width: Random.between(0.75 * this.width, this.width), 
                taperFactor: Random.between(0.88, 0.9), 
                rotation: Random.between(-25, 12), 
                rotationFactor: Random.between(1, 16), 
                length: Random.between(0.35 * this.height, this.height), 
                x: this.x + Random.between(-1 * this.base, this.base), 
                y: this.y
            }));
        }
    },
    draw: function(context) {
        this.vines.forEach(function(vine) {vine.draw(context);});
    }
}

var World = new function() {
    let plant1 = new Plant(200, 400, 30, 4, 19, 15);
    let plant2 = new Plant(350, 400, 20, 2, 7, 10);
    let ctx = null;

    function init() {
        ctx = document.getElementById('canvas').getContext('2d');
        draw();
    }

    function draw() {
        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        plant1.update();
        plant1.draw(ctx);
        plant2.update();
        plant2.draw(ctx);
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
    canvas.style="border-color: gray; border-style: solid; border-width: 1px"
    base.appendChild(canvas);
    
    World.init();
}

if (document.readyState === 'complete') init();
else window.addEventListener('load', init);

