// Block.js

const GRAVITY = .498;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 400;
const FLOOR_Y = 350;
const BLOCK_WIDTH = 10;
const BLOCK_HEIGHT = 10;

var Block = function(x, y, vX, vY) {
    this.x = x;
    this.y = y;
    this.vX = vX;
    this.vY = vY;
    this.aX = 0;
    this.aY = GRAVITY;
    this.width = BLOCK_WIDTH;
    this.height = BLOCK_HEIGHT;
}

Block.prototype = {
    reset: function(x, y) {
        this.x = x;
        this.y = y;
        this.vX = 0;
        this.vY = 0;
        this.aY = GRAVITY;
    },

    update: function() {
        this.vX += this.aX;
        this.vY += this.aY;
        this.x += this.vX;

        if (this.y + this.vY >= FLOOR_Y) {
            if (Math.abs(this.vY) < 0.1) {
                this.aY = 0;
                this.vY = 0;
            }
            
            this.y = FLOOR_Y;
            this.vY = -0.8 * this.vY;
            
        } else {
            this.y += this.vY;
        }
    },

    render: function(context) {
        context.fillStyle = 'rgb(96, 96, 96)'
        context.fillRect(this.x-this.width, this.y-this.height, this.width, this.height);
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
