const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

const colors = ['#ff0000', '#00cc00', '#0033cc', '#ffff00', '#cc00cc'];

class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
    };
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
    ctx.closePath();
  }
  update() {
    this.draw();

    detectWallCollision(this);

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    //detect if 2 particles touch onr another

    for (let i = 0; i < particles.length; i++) {
      if (
        this !== particles[i] &&
        detectParticlesCollision(this, particles[i])
      ) {
        if (this.radius < particles[i].radius) {
          this.color = particles[i].color;
        }
        this.velocity.x *= -1;
        this.velocity.y *= -1;
      }
    }
  }
}

let particles = [];
function init() {
  for (let i = 0; i < 150; i++) {
    const radius = Math.random() * (30 - 4) + 4;
    let x = generateRandomX(radius, canvas.width);
    let y = generateRandomY(radius, canvas.height);
    const colorIndex = Math.round(Math.random() * (colors.length - 1));

    //prevent render 2 particles one on top of each other
    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (
          calulateDistance(x, y, particles[j].x, particles[j].y) -
            (radius + particles[j].radius) <
          0
        ) {
          x = generateRandomX(radius, canvas.width);
          y = generateRandomY(radius, canvas.height);

          j = -1;
        }
      }
    }

    particles.push(new Particle(x, y, radius, colors[colorIndex]));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => particle.update());
}

//util fuctions

function generateRandomX(radius, width) {
  let num = Math.random() * width;
  while (num + radius > width || num - radius < 0) num = Math.random() * width;
  return num;
}

function generateRandomY(radius, height) {
  let num = Math.random() * height;
  while (num + radius > height || num - radius < 0)
    num = Math.random() * height;
  return num;
}

function detectWallCollision(particle) {
  if (
    particle.x + particle.radius > canvas.width ||
    particle.x - particle.radius < 0
  ) {
    particle.velocity.x *= -1;
  } else if (
    particle.y + particle.radius > canvas.height ||
    particle.y - particle.radius < 0
  ) {
    particle.velocity.y *= -1;
  }
}

function calulateDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function detectParticlesCollision(particle1, particle2) {
  if (
    calulateDistance(particle1.x, particle1.y, particle2.x, particle2.y) -
      (particle1.radius + particle2.radius) <
    0
  ) {
    return true;
  }
  return false;
}

init();
animate();
