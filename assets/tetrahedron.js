// Tetrahedron

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const FOCAL_DEPTH = 1000;

var Matrix = {
    multiplyPoint: function(matrix, point) {
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web 
        var c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2];
        var c0r1 = matrix[ 3], c1r1 = matrix[ 4], c2r1 = matrix[ 5];
        var c0r2 = matrix[ 6], c1r2 = matrix[ 7], c2r2 = matrix[ 8];

        var x = point[0];
        var y = point[1];
        var z = point[2];

        var resultX = (x * c0r0) + (y * c0r1) + (z * c0r2);

        var resultY = (x * c1r0) + (y * c1r1) + (z * c1r2);

        var resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2);

        return [resultX, resultY, resultZ];
    },

    multiply: function(matrixA, matrixB) {
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web 

        var column0 = [matrixB[0], matrixB[3], matrixB[6]];
        var column1 = [matrixB[1], matrixB[4], matrixB[7]];
        var column2 = [matrixB[2], matrixB[5], matrixB[8]];
        
        var result0 = multiplyMatrixPoint(matrixA, column0);
        var result1 = multiplyMatrixPoint(matrixA, column1);
        var result2 = multiplyMatrixPoint(matrixA, column2);
        
        return [
          result0[0], result1[0], result2[0],
          result0[1], result1[1], result2[1],
          result0[2], result1[2], result2[2]
        ];
    }
}

var Rotation = {
    rotateAroundAxis: function(axisVector, theta) {
        let ux = axisVector[0];
        let uy = axisVector[1];
        let uz = axisVector[2];

        let p00 = Math.cos(theta) + ux*ux*(1 - Math.cos(theta)); 
        let p01 = ux*uy*(1 - Math.cos(theta)) - uz*Math.sin(theta);
        let p02 = ux*uz*(1 - Math.cos(theta)) + uy*Math.sin(theta);
        let p10 = uy*ux*(1 - Math.cos(theta)) + uz*Math.sin(theta);
        let p11 = Math.cos(theta) + uy*uy*(1-Math.cos(theta));
        let p12 = uy*uz*(1 - Math.cos(theta)) - ux*Math.sin(theta);
        let p20 = uz*ux*(1 - Math.cos(theta)) - uy*Math.sin(theta);
        let p21 = uz*uy*(1 - Math.cos(theta)) + ux*Math.sin(theta);
        let p22 = Math.cos(theta) + uz*uz*(1 - Math.cos(theta));

        return [p00, p01, p02,
                p10, p11, p12,
                p20, p21, p22];
    }
};


var Tetrahedron = function(x, y, z, side) {
    this.center = [x, y, z];
    this.rotationAxis = [0, 0, 1];
    this.angularVelocity = 0;
    this.vertexSize = 5;

    let r = side * 2/3; 

    this.A = [ r * Math.sqrt(3) / 2,
               0,
               -1 * r / 2];

    this.B = [ -1 * r * Math.sqrt(3)/4,
                3 * r / 4,
               -1 * r/2];

    this.C = [ -1 * r * Math.sqrt(3)/4,
               -1 * r * 3 / 4,
               -1 * r/2];

    this.D = [ 0,
               0,
               r];

}


Tetrahedron.prototype = {
    nudge: function(x, y) {
        this.angularVelocity += Math.PI/50;

        let vx = x - this.center[0];
        let vy = y - this.center[1];

        let ux = 1;
        let uy = -1 * vx/vy;

        let scale = Math.sqrt(1 / (ux*ux + uy*uy));

        this.rotationAxis = [ux * scale, uy * scale, 0];
    },
    update: function(x, y) {
        let matrix = Rotation.rotateAroundAxis(this.rotationAxis, this.angularVelocity);

        this.A = Matrix.multiplyPoint(matrix, this.A);
        this.B = Matrix.multiplyPoint(matrix, this.B);
        this.C = Matrix.multiplyPoint(matrix, this.C);
        this.D = Matrix.multiplyPoint(matrix, this.D);

        this.angularVelocity *= 0.97; 
    },
    draw: function(context) {

       function scale(val, zCoord) {
           return val * (FOCAL_DEPTH/(FOCAL_DEPTH + zCoord))
       };

        function scaleVertex(point) {
            return scale(this.vertexSize, point[2]);
        }

        function project3d2d(point) {
            return [scale(point[0], point[2]),
                    scale(point[1], point[2])]
        }

        function translate2d(point) {
            return [point[0] + this.center[0],
                    point[1] + this.center[1]] 
        }

        let model = [this.A, this.B, this.C, this.D];
        let temp = model.map(project3d2d);
        let points = model.map(project3d2d).map(translate2d, this);
        let radii = model.map(scaleVertex, this);


        context.fillStyle = '#8a8a5c';
        context.strokeStyle = '#8a8a5c';


        // Draw vertices
        context.beginPath();
        context.arc(points[0][0], points[0][1], radii[0], 0, Math.PI*2);
        context.fill();

        context.beginPath();
        context.arc(points[1][0], points[1][1], radii[1], 0, Math.PI*2);
        context.fill();
        
        context.beginPath();
        context.arc(points[2][0], points[2][1], radii[2], 0, Math.PI*2);
        context.fill(); 

        context.beginPath();
        context.arc(points[3][0], points[3][1], radii[3], 0, Math.PI*2);
        context.fill(); 

        // Draw edges 
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        context.lineTo(points[1][0], points[1][1]);
        context.lineTo(points[2][0], points[2][1]);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        context.lineTo(points[1][0], points[1][1]);
        context.lineTo(points[3][0], points[3][1]);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        context.lineTo(points[2][0], points[2][1]);
        context.lineTo(points[3][0], points[3][1]);
        context.closePath();
        context.fill();

        context.beginPath();
        context.moveTo(points[1][0], points[1][1]);
        context.lineTo(points[2][0], points[2][1]);
        context.lineTo(points[3][0], points[3][1]);
        context.closePath();
        context.stroke();
    }

}

var World = new function() {
    let triangle = new Tetrahedron(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 500, 180);
    let ctx = null;

    function onClick(e) {
        triangle.nudge(e.offsetX, e.offsetY);
    }

    function init() {
        ctx = document.getElementById('canvas').getContext('2d');

        canvas.addEventListener("click", onClick);

        draw();
    }

    function draw() {
        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        triangle.update();
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

