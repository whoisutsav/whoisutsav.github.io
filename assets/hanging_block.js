// Hanging block

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 400;

const STAKE_X = 150;
const STAKE_Y = 50;

const GRAVITY = .198;
const SPRING_CONSTANT = .9;
const MASS = 1;

const FLOOR_Y = 350;

const BLOCK_WIDTH = 10;
const BLOCK_HEIGHT = 10;

const ROPE_LENGTH = 200;

function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
}

Vector.multiply = function(v, magnitude) {
    return new Vector(v.x * magnitude, v.y * magnitude);
}

Vector.subtract = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
}

Vector.magnitude = function(v) {
    return Math.sqrt((v.x * v.x) + (v.y * v.y));
}

var Block = function(x, y, vX, vY) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(vX, vY);
    this.force = new Vector(0, GRAVITY * MASS);
    this.acceleration = new Vector(0, 0);
    this.stake = new Vector(STAKE_X, STAKE_Y);
    // todo - rename
    this.gravityForce = new Vector(0, GRAVITY);
    this.width = BLOCK_WIDTH;
    this.height = BLOCK_HEIGHT;
}

Block.prototype = {
    reset: function(x, y) {
        this.position = new Vector(x, y);

        // todo - add vector modifying functionality
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
    },

    // todo - don't create so many new vectors!
    update: function() {
        var distance = Vector.magnitude(Vector.subtract(this.position, this.stake));
        var speed = Vector.magnitude(this.velocity);
        //var dragForce = Vector.multiply(this.velocity, -0.0001 * speed * speed);
        if(distance > ROPE_LENGTH) {
            var stretch = distance - ROPE_LENGTH;
            var theta = Math.atan2((this.stake.x - this.position.x), (this.stake.y - this.position.y));
            var springMagnitude = SPRING_CONSTANT * stretch;
            var springForce = new Vector(springMagnitude * Math.sin(theta), springMagnitude * Math.cos(theta));
            this.force = Vector.add(
                springForce,
                this.gravityForce);
            //this.force = Vector.add(this.force, dragForce);
        } else {
            this.force = this.gravityForce;
            //this.force = Vector.add(this.gravityForce, dragForce);
        }
        this.acceleration = Vector.multiply(this.force, (1/MASS));
        this.velocity = Vector.add(this.velocity, this.acceleration);

        // hack to mimic heat loss in spring
        if(stretch > 0) {
            this.velocity = Vector.multiply(this.velocity, 0.91);
        }

        this.position = Vector.add(this.position, this.velocity);
    },

    render: function(context) {
        context.fillStyle = 'rgb(96, 96, 96)'
        var x = this.position.x;
        var y = this.position.y;
        context.fillRect(x-(this.width/2), y-(this.height/2), this.width, this.height);
        context.beginPath();
        context.moveTo(STAKE_X, STAKE_Y);
        context.lineTo(x, y);
        context.stroke();
    }
}

var block = new Block(CANVAS_WIDTH/2, 50, 0, 0);

var World = new function() {
    var canvas = null;
    var ctx = null;
    
    function onClick(e) {
        block.reset(e.offsetX, e.offsetY);
    }

    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');

        canvas.addEventListener("click", onClick);
        update();
    }

    function drawBackground() {
        const height = 8;
        const height2 = 13;
        const height3 = 4;
        ctx.fillStyle = 'rgb(194, 194, 194)'
        ctx.fillRect(0, FLOOR_Y, CANVAS_WIDTH, height);
        ctx.fillStyle = 'rgb(234, 234, 234)'
        ctx.fillRect(0, FLOOR_Y + height, CANVAS_WIDTH, height2);
        ctx.fillStyle = 'rgb(102, 178, 255)'
        ctx.fillRect(0, FLOOR_Y + height + height2, CANVAS_WIDTH, height3); 
    }

    function update() {
        requestAnimationFrame(update);

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawBackground();
        block.update();
        block.render(ctx);
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



