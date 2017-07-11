// Orbital

var unit = 0;
const ANIMATION_SPEED = 1;

function draw() {
    let ctx = document.getElementById('canvas').getContext('2d');

    ctx.clearRect(0, 0, 400, 400); // clear canvas

    // draw orbit
    const centerX = 200;
    const centerY = 200;
    const radius = 125;
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(160, 160, 160)';
    ctx.arc(centerX, centerY, radius, 0, 2*Math.PI, true);
    ctx.stroke();

    // draw center
    ctx.beginPath();
    ctx.fillStyle = 'rgb(102, 178, 255)';
    ctx.arc(200, 200, 30, 0, 2*Math.PI, true);
    ctx.fill();

    // draw circle
    ctx.beginPath();
    ctx.fillStyle = 'rgb(204, 102, 0)';
    const ang = unit * (Math.PI/180);
    const bodyX = centerX + radius * Math.cos(ang);
    const bodyY = centerY + radius * Math.sin(ang);
    ctx.arc(bodyX, bodyY, 15, 0, 2*Math.PI, true);
    ctx.fill();

    unit += ANIMATION_SPEED;
    window.requestAnimationFrame(draw);

}

function init() {
  window.requestAnimationFrame(draw);
}

