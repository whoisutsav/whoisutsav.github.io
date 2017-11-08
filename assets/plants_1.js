// Plants 
//
//
// NOTES
// DONE - Attempt alpha-ing out
// - Generate plants randomly
// - Put randomness in constructors
// - Context save/restore
// - Add audio

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
    this.alpha = params.alpha || 1.0; 

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


        context.save();

        context.globalAlpha = this.alpha;
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

        context.restore();
    }
}

// TODO remove
let Curve = {
    exponentialOut: function(k) {
        return k === 0 ? 0 : Math.pow(1.5, k - 1);
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
    this.alpha = 0.8;

    let initialSegment = new Segment({
        x: this.x, 
        y: this.y, 
        shaded: false, 
        rotation: this.rotation, 
        width: this.width, 
        growthRate: 10,
        alpha: this.alpha});
    this.segments = Array.of(initialSegment); 
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
        let that = this;
        this.segments.forEach(function(segment) {
            segment.alpha = that.alpha;
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
    this.alpha = 0.8;

    this.vines = [];
}

Plant.prototype = {
    update: function(){
        this.vines.forEach(function(vine) {vine.update();});
        if (this.dead !== true && this.vines.length <= this.MAX_VINES) {
            if (Math.random() < .05) {
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
        } else if (this.grown === false) {
            this.grown = true;    
        }
    },
    draw: function(context) {
        let that = this;
        this.vines.forEach(function(vine) {
            vine.alpha = that.alpha;
            vine.draw(context);
        });
    }
}

var World = new function() {
    let plants = [];
    let deadPlants = [];
    let ctx = null;

    function init() {
        ctx = document.getElementById('canvas').getContext('2d');
        plants.push(new Plant(200, 400, 30, 4, 19, 15));
        plants.push(new Plant(350, 400, 20, 2, 7, 10));

        draw();
    }

    function draw() {
        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        for(let i = 0; i < plants.length; i++) {
            let plant = plants[i];
            if(plant.grown === true) {
                plants.splice(i, 1);
                deadPlants.push(plant);
                var tween = new TWEEN.Tween(plant)
                    .to({ alpha: 0 }, 5000)
                    .easing(TWEEN.Easing.Sinusoidal.InOut) 
                    .delay(1000) 
                    .onComplete(respawn)
                    .start(); 
            } else { 
                plant.update(); 
                plant.draw(ctx); }
        }
        deadPlants.forEach(function(plant) {
            plant.draw(ctx);
        });
        TWEEN.update();
    }

    function respawn(plant) {
        let i = deadPlants.find(function(d) {
            return d === plant;
        });
        console.log(i);
        deadPlants.splice(i, 1);

        let num = Math.floor(Random.between(0, 4)); 
        let seeds = null; 
        let minDiff = Number.MIN_VALUE; 
        while(num > 1 && minDiff < 40) { // Protect against infinite loop 
            seeds = Array.apply(null, Array(num)).map(function() { return Random.between(20, CANVAS_WIDTH - 20); }); 
            minDiff = seeds.sort().reduce(function(acc, val) { let diff = val - acc.prev; acc.minDiff = Math.min(acc.minDiff, diff);
                acc.prev = val;
                return acc;
            }, {minDiff: Number.MAX_VALUE, prev: 0}).minDiff;
        }
        if(seeds && plants.length < 3) {
            seeds.forEach(function(x) {
                let plant = new Plant(x, 400, Random.between(15, 40), Random.between(2, 4), Random.between(5, 21), Random.between(7, 17));
                plants.push(plant);
            });
        }
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

