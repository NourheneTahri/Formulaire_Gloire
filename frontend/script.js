// --- Son et interaction utilisateur ---
let soundAllowed = false;
const tadaSound = new Audio('https://www.myinstants.com/media/sounds/tada-fanfare.mp3');
tadaSound.volume = 0.3;

// Autoriser le son après le premier clic sur le formulaire
document.getElementById('gloryForm').addEventListener('click', () => { soundAllowed = true; }, { once: true });

// --- Fonction pour créer une étoile volante ---
function createStarAt(x, y, parent) {
    const star = document.createElement('span');
    star.textContent = '⭐';
    star.style.position = 'absolute';
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    star.style.fontSize = (Math.random() * 16 + 12) + 'px';
    star.style.color = `hsl(${Math.random()*360}, 85%, 55%)`;
    star.style.pointerEvents = 'none';
    star.style.opacity = 0.9;
    parent.appendChild(star);

    // Son si autorisé
    if (soundAllowed) {
        tadaSound.currentTime = 0;
        tadaSound.play();
    }

    // Animation
    let top = y;
    const vx = (Math.random()-0.5)*2;
    const vy = Math.random()*2 + 1;
    const rotationSpeed = (Math.random()-0.5)*0.2;
    let rotation = 0;

    const fall = setInterval(() => {
        top += vy;
        rotation += rotationSpeed;
        star.style.top = top + 'px';
        star.style.left = parseFloat(star.style.left) + vx + 'px';
        star.style.transform = `rotate(${rotation}rad)`;
        if (top > parent.offsetHeight + 20) {
            clearInterval(fall);
            star.remove();
        }
    }, 16);
}

// --- Easter egg "gloire" qui suit la souris ---
document.querySelectorAll('#name,#subject').forEach(input => {
    input.addEventListener('input', () => {
        const val = input.value.toLowerCase();
        if (val.includes('gloire')) {
            // Suivi de la souris
            input.addEventListener('mousemove', function followMouse(e) {
                for (let i=0; i<2; i++) { // plusieurs étoiles par mouvement
                    createStarAt(e.offsetX, e.offsetY, input.parentNode);
                }
            });
        }
    });
});

// --- Bouton "Retour" ---
const backBtn = document.getElementById('back');
backBtn.addEventListener('click', () => location.href = 'index.html');

// --- Formulaire + confettis ---
const form = document.getElementById('gloryForm');
const submitBtn = document.getElementById('submitBtn');
const confettiCanvas = document.getElementById('confetti');

function launchConfetti(duration = 3500) {
    confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight;
    const ctx = confettiCanvas.getContext('2d');
    const pieces = [];
    for(let i=0;i<140;i++){
        pieces.push({
            x: Math.random()*confettiCanvas.width,
            y: Math.random()*confettiCanvas.height - confettiCanvas.height,
            w: Math.random()*10+6,
            h: Math.random()*6+4,
            r: Math.random()*360,
            vy: Math.random()*3+1,
            vx: (Math.random()-0.5)*4,
            color: `hsl(${Math.random()*360}, 85%, 55%)`
        });
    }
    const start = Date.now();
    function frame(){
        ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
        pieces.forEach(p=>{
            ctx.save();
            ctx.translate(p.x,p.y);
            ctx.rotate((p.r*Math.PI)/180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            ctx.restore();
            p.x += p.vx; p.y += p.vy; p.r += 6;
            if(p.y > confettiCanvas.height + 20){ p.y = -40; p.x = Math.random()*confettiCanvas.width; }
        });
        if(Date.now() - start < duration) requestAnimationFrame(frame);
        else ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    }
    frame();
}

// --- Soumission formulaire ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi...';

    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    // Easter egg check
    const name = (data.name || '').toLowerCase();
    const subject = (data.subject || '').toLowerCase();
    const message = (data.message || '').toLowerCase();
    let eggMessage = 'Vous avez gagné le droit de briller 🌟';
    let gifUrl = 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif';

    if(name.includes('gloire') || subject.includes('gloire')){
        eggMessage = 'Tu as débloqué la Gloire Suprême !';
        gifUrl = 'https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif';
    } else if(message.includes('win') || message.includes('gagner')){
        eggMessage = 'Victoire détectée !';
        gifUrl = 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif';
    }

    await Swal.fire({
        title: 'Félicitations !',
        text: eggMessage,
        imageUrl: gifUrl,
        imageAlt: 'celebration',
        confirmButtonText: 'Je brille ✨',
        width: 600,
    });

    launchConfetti(4000);

    try {
        const resp = await fetch('http://localhost:5000/send-email',{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(data)
        });
        const json = await resp.json();
        if(json.success){
            Swal.fire('Envoyé !', 'Ton message a bien été transmis.', 'success');
            form.reset();
        } else {
            Swal.fire('Erreur', json.error || 'Impossible d\'envoyer le message.', 'error');
        }
    } catch(err){
        console.error(err);
        Swal.fire('Erreur réseau', 'Impossible de contacter le serveur.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer 🌟';
    }
});
