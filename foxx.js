const gameContainer = document.getElementById('gameContainer');
const character = document.getElementById('character');
const crosshairsIcon = document.getElementById('crosshairsIcon');
const shootSoundSrc = 'shot.mp3'; // Path ke file suara tembakan
const hitSoundSrc = 'hit.mp3'; // Path ke file suara hit
let highScore = localStorage.getItem('highScore') || 0;
let characterPosition = 0;
let jumping = false;
let score = 0;

function showGameInstructions() {
    Swal.fire({
        title: 'Hitamkan Ambatron!!',
        html: `
            <p>1. Tekan tombol <strong><- Kiri</strong> atau <strong>Kanan-></strong> untuk menggerakkan mas rusdi.</p>
            <p>2. Klik <i class="fas fa-crosshairs"></i> untuk mengeluarkan air muani.</p>
            <p>3. Hindari ambatron atau tembak dengan air muani untuk mengumpulkan point.</p>
            <p>Siap untuk hitamkan?</p>
        `,
        icon: 'info',
        confirmButtonText: 'Hitamkan Wak 😹',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: true
    }).then((result) => {
        if (result.isConfirmed) {
            startGame();
        }
    });
}

document.addEventListener('DOMContentLoaded', showGameInstructions);

function updateScoreDisplay() {
    document.getElementById('currentScore').textContent = score;
    document.getElementById('highScore').textContent = highScore;
}

function startGame() {


function moveLeft() {
    characterPosition -= 50;
    if (characterPosition < -150) characterPosition = -150;
    character.style.left = `calc(50% + ${characterPosition}px)`;
}

function moveRight() {
    characterPosition += 50;
    if (characterPosition > 150) characterPosition = 150;
    character.style.left = `calc(50% + ${characterPosition}px)`;
}

document.getElementById('moveLeftButton').addEventListener('click', moveLeft);

document.getElementById('moveRightButton').addEventListener('click', moveRight);

document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowLeft') {
        moveLeft();
    } else if (event.code === 'ArrowRight') {
        moveRight();
    } else if (event.code === 'ArrowUp' && !jumping) {
        jumping = true;
        character.classList.add('jump');
        setTimeout(() => {
            character.classList.remove('jump');
            jumping = false;
        }, 500);
    } else if (event.code === 'Space') {
        shootBullet();
    }
});

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

function handleGesture() {
    if (touchendX < touchstartX - 50) {
        moveLeft();
    }

    if (touchendX > touchstartX + 50) {
        moveRight();
    }

    if (touchendY < touchstartY - 50 && !jumping) {
        jumping = true;
        character.classList.add('jump');
        setTimeout(() => {
            character.classList.remove('jump');
            jumping = false;
        }, 500);
    }
}

gameContainer.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
});

gameContainer.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    handleGesture();
});

crosshairsIcon.addEventListener('click', shootBullet);

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    const lanes = [-150, -50, 50, 150];
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
    obstacle.style.left = `calc(50% + ${randomLane}px)`;
    gameContainer.appendChild(obstacle);
}

function shootBullet() {
    const shootSound = new Audio(shootSoundSrc);
    shootSound.play().catch(error => console.error('Error playing sound:', error));
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `calc(50% + ${characterPosition}px)`;
    bullet.innerHTML = '<i class="fas fa-bolt"></i>'; // Changed from fa-circle to fa-bolt
    gameContainer.appendChild(bullet);

    const bullets = document.querySelectorAll('.bullet');
    bullets.forEach(bullet => {
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            const bulletRect = bullet.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            if (
                bulletRect.left < obstacleRect.right &&
                bulletRect.right > obstacleRect.left &&
                bulletRect.top < obstacleRect.bottom &&
                bulletRect.bottom > obstacleRect.top
            ) {
                obstacle.remove();
                bullet.remove();
                const hitSound = new Audio(hitSoundSrc);
                hitSound.play().catch(error => console.error('Error playing hit sound:', error));
            }
        });
    });

    setTimeout(() => {
        bullet.remove();
    }, 1000);
}

function checkCollision() {
    const characterRect = character.getBoundingClientRect();
    const obstacles = document.querySelectorAll('.obstacle');
    
    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            characterRect.left < obstacleRect.right &&
            characterRect.right > obstacleRect.left &&
            characterRect.top < obstacleRect.bottom &&
            characterRect.bottom > obstacleRect.top
        ) {
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
            }
            
            Swal.fire({
                title: 'Game Over!',
                text: `Your score: ${score}`,
                icon: 'error',
                confirmButtonText: 'Play Again'
            }).then(() => {
                location.reload();
            });
        }
    });
}

setInterval(() => {
    checkCollision();
    score++;
    updateScoreDisplay();
    if (score % 30 === 0) {
        createObstacle();
    }
}, 100);

setInterval(() => {
    const obstacles = document.querySelectorAll('.obstacle');
    if (obstacles.length < 6) {
        createObstacle();
    }
}, 2000);

document.addEventListener('click', (e) => {
    if (e.button === 0) { // Klik mouse kiri
        shootBullet();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32 || 
        e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault(); // Mencegah scroll halaman saat tekan Space
        shootBullet();
    }
});

// Touch support untuk mobile
gameContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    shootBullet();
});

const backgroundMusic = document.getElementById('backgroundMusic');
let gameRunning = true;

function startBackgroundMusic() {
    backgroundMusic.play();
}

startBackgroundMusic(); }