// Plants 
//
//
// NOTES
// - Put randomness in constructors
// - Context save/restore
// - Add audio

// initialized in init()
let CANVAS_WIDTH = -1;
let CANVAS_DITH = -1
//let CANVAS_WIDTH = 500
//let CANVAS_HEIGHT = 400;

const DEGREE_RAD = Math.PI/180;

var Random = {
    between: function(min, max) {
        return Math.random() * (max - min) + min;
    }
}

var Vine = function(params) { 
    this.pctGrown = 0;

    this.x = params.x;
    this.y = params.y;
    this.width = params.width;
    this.length = params.length;

    this.slant = DEGREE_RAD * Random.between(-25, 12), 
    this.curl = DEGREE_RAD * Random.between(1, 16), 
    this.taper = Random.between(0.88, 0.9);

    this.segments = []; 
    this.build();
}

Vine.prototype = { 
    build: function() {
        let sX = this.x;
        let sY = this.y;
        let width = this.width;
        let rotation = this.slant;
        for (let i = 0; i < this.length; i++) {
            this.segments.push({
                x: sX,
                y: sY,
                shaded: i % 2,
                width: width,
                rotation: rotation,
                length: 20
            });
            sX += 20 * Math.sin(rotation);
            sY -= 20 * Math.cos(rotation);
            rotation += Random.between(-1 * this.curl, this.curl);
            width = Math.max(width*this.taper, 1);
        }
    },
    update: function() {
        if(this.pctGrown <= 1 - 0.005) {
            this.pctGrown += 0.005;
        } else {
            this.pctGrown = 1;
        }
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
        this.vines.forEach(function(vine) {
            vine.update();
        });
        if (this.vines.length <= this.MAX_VINES && Math.random() < .05) {
            let vine = new Vine({
                    width: Random.between(0.75 * this.width, this.width), 
                    length: Random.between(0.35 * this.height, this.height), 
                    x: this.x + Random.between(-1 * this.base, this.base), 
                    y: this.y
                });
            this.vines.push(vine);
        }
    },
    draw: function(context) {
        let that = this;
        this.vines.forEach(function(vine) {
            let n = vine.pctGrown * vine.segments.length;

            let totalSegments = Math.ceil(n);
            let i = 0;
            let maturity = n > 1 ? 1 : n;

            while (i < totalSegments) {
                let segment = vine.segments[i];

                let points = [];
                let dx = (maturity * segment.length) * Math.tan((Math.PI/180) * 0.5);
    
                points.push({x: -1 * segment.width / 2, y: 0});
                points.push({x: dx - segment.width/2, y: -1 * maturity * segment.length});
                points.push({x: segment.width/2 - dx, y: -1 * maturity * segment.length});
                points.push({x: segment.width/2, y: 0});
    
                points = points.map(function(point) {
                    let rotatedX = point.x * Math.cos(segment.rotation) - point.y * Math.sin(segment.rotation);
                    let rotatedY = point.x * Math.sin(segment.rotation) + point.y * Math.cos(segment.rotation);
                    return {x: rotatedX + segment.x, y: rotatedY + segment.y};
                });
    
                context.save();
    
                context.globalAlpha = that.alpha;
                context.fillStyle = segment.shaded ? 'rgb(38, 145, 52)' : 'rgb(35, 147, 50)'
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

                i +=1;
                maturity = i === totalSegments - 1 ? n - i : 1;
            }
        });
    }
}

var World = new function() {
    let plants = [];
    let deadPlants = [];
    let ctx = null;

    function init() {
        ctx = document.getElementById('canvas').getContext('2d');
        plants.push(new Plant(CANVAS_WIDTH/3, CANVAS_HEIGHT, 30, 4, 19, 15));
        plants.push(new Plant(CANVAS_WIDTH*4/5, CANVAS_HEIGHT, 20, 2, 7, 10));

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
                    .easing(TWEEN.Easing.Exponential.In) 
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
                let plant = new Plant(x, CANVAS_HEIGHT, Random.between(15, 40), Random.between(2, 4), Random.between(5, 21), Random.between(7, 17));
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
	
	CANVAS_WIDTH = Math.min(500, window.innerWidth - (window.scrollX + document.getElementById('container').getBoundingClientRect().left) - 10)
	CANVAS_HEIGHT = Math.min(450, window.innerHeight - (window.scrollY + document.getElementById('container').getBoundingClientRect().top) - 20)

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvas.id = 'canvas';
    canvas.style="border-color: lightgray; border-style: solid; border-width: 1px"
    base.appendChild(canvas);
    
    World.init();
}

if (document.readyState === 'complete') init();
else window.addEventListener('load', init);

