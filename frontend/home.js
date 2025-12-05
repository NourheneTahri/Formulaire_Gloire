const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');

function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); window.addEventListener('resize', resize);

// Particles (floating stars)
const particles = [];
for(let i=0;i<180;i++){
  particles.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*1.8 + 0.6,
    a: Math.random()*0.9 + 0.1,
    vy: Math.random()*0.3 + 0.08,
    vx: (Math.random()-0.5)*0.2
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.globalAlpha = p.a;
    ctx.fillStyle = 'white';
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
    p.x += p.vx;
    p.y -= p.vy;
    if(p.y < -10) { p.y = canvas.height + 10; p.x = Math.random()*canvas.width; }
    if(p.x < -10) p.x = canvas.width + 10;
    if(p.x > canvas.width + 10) p.x = -10;
  });
  requestAnimationFrame(draw);
}
draw();
