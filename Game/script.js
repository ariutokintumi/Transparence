const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const angleSlider = document.getElementById('angleSlider');
const angleDisplay = document.getElementById('angleDisplay');

// Initial mirror angle
let mirrorAngle = parseInt(angleSlider.value);

// Basic setup for the light beam
const lightSource = { x: 50, y: 350 };
const target = { x: 550, y: 50 };
let mirror = { x: 300, y: 200, width: 100, height: 10 };

// Convert degrees to radians
function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

// Draw the game scene
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw light source
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(lightSource.x, lightSource.y, 10, 0, Math.PI * 2);
  ctx.fill();

  // Draw target
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
  ctx.fill();

  // Draw mirror
  ctx.fillStyle = 'gray';
  ctx.save();
  ctx.translate(mirror.x, mirror.y);
  ctx.rotate(degToRad(mirrorAngle));
  ctx.fillRect(-mirror.width / 2, -mirror.height / 2, mirror.width, mirror.height);
  ctx.restore();

  // Draw initial light beam to mirror
  ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
  ctx.beginPath();
  ctx.moveTo(lightSource.x, lightSource.y);
  ctx.lineTo(mirror.x, mirror.y);
  ctx.stroke();

  // Calculate reflection
  const dx = mirror.x - lightSource.x;
  const dy = mirror.y - lightSource.y;
  const angleIncidence = Math.atan2(dy, dx);
  const angleReflection = 2 * degToRad(mirrorAngle) - angleIncidence;
  const reflectionLength = 1000;  // Make the reflection line long enough
  const reflectionX = mirror.x + reflectionLength * Math.cos(angleReflection);
  const reflectionY = mirror.y + reflectionLength * Math.sin(angleReflection);

  // Draw reflected beam
  ctx.beginPath();
  ctx.moveTo(mirror.x, mirror.y);
  ctx.lineTo(reflectionX, reflectionY);
  ctx.stroke();
}

// Check if the beam reaches the target
function checkSolution() {
  const dx = target.x - mirror.x;
  const dy = target.y - mirror.y;
  const angleIncidence = Math.atan2(dy, dx);
  const angleReflection = 2 * degToRad(mirrorAngle) - angleIncidence;
  const reflectionX = mirror.x + Math.cos(angleReflection) * 1000;  // Check far enough
  const reflectionY = mirror.y + Math.sin(angleReflection) * 1000;

  // Simple bounding box collision detection
  if (Math.abs(reflectionX - target.x) < 10 && Math.abs(reflectionY - target.y) < 10) {
    alert('Congratulations! You’ve aligned the mirror correctly!');
  } else {
    alert('Try again! Adjust the angle to direct the light beam to the target.');
  }
}

// Update mirror angle based on slider
angleSlider.oninput = function() {
  mirrorAngle = parseInt(this.value);
  angleDisplay.textContent = this.value;
  draw();
};

// Initial draw
draw();
