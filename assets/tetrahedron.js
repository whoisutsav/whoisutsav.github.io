// Tetrahedron

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;


function multiplyMatrixPoint(matrix, point) {

  //Give a simple variable name to each part of the matrix, a column and row number
  var c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2];
  var c0r1 = matrix[ 3], c1r1 = matrix[ 4], c2r1 = matrix[ 5];
  var c0r2 = matrix[ 6], c1r2 = matrix[ 7], c2r2 = matrix[ 8];

  //Now set some simple names for the point
  var x = point[0];
  var y = point[1];
  var z = point[2];

  //Multiply the point against each part of the 1st column, then add together
  var resultX = (x * c0r0) + (y * c0r1) + (z * c0r2);

  //Multiply the point against each part of the 2nd column, then add together
  var resultY = (x * c1r0) + (y * c1r1) + (z * c1r2);

  //Multiply the point against each part of the 3rd column, then add together
  var resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2);

  return [resultX, resultY, resultZ];
}

function multiplyMatrices(matrixA, matrixB) {

  // Slice the second matrix up into columns
  var column0 = [matrixB[0], matrixB[3], matrixB[6]];
  var column1 = [matrixB[1], matrixB[4], matrixB[7]];
  var column2 = [matrixB[2], matrixB[5], matrixB[8]];

  // Multiply each column by the matrix
  var result0 = multiplyMatrixPoint(matrixA, column0);
  var result1 = multiplyMatrixPoint(matrixA, column1);
  var result2 = multiplyMatrixPoint(matrixA, column2);

  // Turn the result columns back into a single matrix
  return [
    result0[0], result1[0], result2[0],
    result0[1], result1[1], result2[1],
    result0[2], result1[2], result2[2]
  ];
}



function getRotationMatrix(theta) {
    var Rx = [1, 0, 0,
                0, Math.cos(theta), -1*Math.sin(theta),
                0, Math.sin(theta), Math.cos(theta)]

    var Ry = [Math.cos(theta), 0, Math.sin(theta),
          0, 1, 0,
          -1*Math.sin(theta), 0, Math.cos(theta)]

    var Rz = [Math.cos(theta), -1*Math.sin(theta), 0,
                Math.sin(theta), Math.cos(theta), 0,
                0, 0, 1]

    let Rj = multiplyMatrices(Rx, Ry);
    
    return multiplyMatrices(Rj, Rz);
}

function getRotationMatrixFromAxisAngle(theta, unitVector) {
    let ux = unitVector[0];
    let uy = unitVector[1];
    let uz = unitVector[2];

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


var Triangle = function(x, y, z, r) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r; 

    this.rotationVector = [0, 0, 1];
    this.thetaV = 0;

    this.center = [x, y, z];

    let Ax = (r * Math.sqrt(3) / 2); 
    let Ay = 0;
    let Az = (-1 * r / 2);
    this.A = [Ax, Ay, Az];

    let Bx = (-1 * r * Math.sqrt(3)/4);
    let By = (3 * r / 4);
    let Bz = (-1 * r/2);
    this.B = [Bx, By, Bz];

    let Cx = (-1 * r * Math.sqrt(3)/4);
    let Cy = (-1 * r * 3 / 4);
    let Cz = (-1 * r/2);
    this.C = [Cx, Cy, Cz];

    let Dx = 0;
    let Dy = 0;
    let Dz = r; 
    this.D = [Dx, Dy, Dz];

    this.f = 500;
    this.vR = 10;
}


Triangle.prototype = {
    initiateMotion: function(x, y) {
        this.thetaV = Math.PI/20;

        let vx = x - this.center[0];
        let vy = y - this.center[1];


        let ux = 1;
        let uy = -1 * vx/vy;
        let scale = Math.sqrt(1 / (ux*ux + uy*uy));

        this.rotationVector = [ux * scale, uy * scale, 0];
    },
    update: function(x, y) {
        let matrix = getRotationMatrixFromAxisAngle(this.thetaV, this.rotationVector);

        this.A = multiplyMatrixPoint(matrix, this.A);
        this.B = multiplyMatrixPoint(matrix, this.B);
        this.C = multiplyMatrixPoint(matrix, this.C);
        this.D = multiplyMatrixPoint(matrix, this.D);

        if(this.thetaV > Math.PI/150) this.thetaV *= 0.97; 
    },
    draw: function(context) {

       function formula(val, z, fDepth) {
           return val * (fDepth/(fDepth + z))
       };

        function transform(point, fDepth) {
            return [formula(point[0], point[2], fDepth),
                    formula(point[1], point[2], fDepth),
                    point[2]]
            }

        function translate(point, translation) {
            return [point[0] + translation[0],
                    point[1] + translation[1],
                    point[2] + translation[2]] 
        }


        let At = transform(this.A, this.f);
        At = translate(At, this.center); 
        let Atr = formula(this.vR, At[2], this.f);
    
        let Bt = transform(this.B, this.f);
        Bt = translate(Bt, this.center); 
        let Btr = formula(this.vR, Bt[2], this.f);

        let Ct = transform(this.C, this.f);
        Ct = translate(Ct, this.center);
        let Ctr = formula(this.vR, Ct[2], this.f);

        let Dt = transform(this.D, this.f);
        Dt = translate(Dt, this.center);
        let Dtr = formula(this.vR, Dt[2], this.f);


        // draw vertices
        context.beginPath();
        context.arc(At[0], At[1], Atr , 0, Math.PI*2);
        context.fill();

        context.beginPath();
        context.arc(Bt[0], Bt[1], Btr, 0, Math.PI*2);
        context.fill();
        
        context.beginPath();
        context.arc(Ct[0], Ct[1], Ctr, 0, Math.PI*2);
        context.fill(); 

        context.beginPath();
        context.arc(Dt[0], Dt[1], Dtr, 0, Math.PI*2);
        context.fill(); 

        // draw edges 
        context.beginPath();
        context.moveTo(At[0], At[1]);
        context.lineTo(Bt[0], Bt[1]);
        context.lineTo(Ct[0], Ct[1]);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(At[0], At[1]);
        context.lineTo(Bt[0], Bt[1]);
        context.lineTo(Dt[0], Dt[1]);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(At[0], At[1]);
        context.lineTo(Ct[0], Ct[1]);
        context.lineTo(Dt[0], Dt[1]);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(Bt[0], Bt[1]);
        context.lineTo(Ct[0], Ct[1]);
        context.lineTo(Dt[0], Dt[1]);
        context.closePath();
        context.stroke();
    }

}

var World = new function() {
    let triangle = new Triangle(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 300, 125);
    let ctx = null;

    function onClick(e) {
        triangle.initiateMotion(e.offsetX, e.offsetY);
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

