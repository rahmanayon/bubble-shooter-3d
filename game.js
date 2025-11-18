// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelSelect = document.getElementById('levelSelect');
const gameOverPanel = document.getElementById('gameOver');
const leaderboardPanel = document.getElementById('leaderboard');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const nextBubbleElement = document.getElementById('nextBubble');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const closeLeaderboardBtn = document.getElementById('closeLeaderboard');
const submitScoreBtn = document.getElementById('submitScore');
const playerNameInput = document.getElementById('playerName');

let gameActive = false;
let score = 0;
let level = 1;
let difficulty = 'medium';

// Game settings based on difficulty
const difficultySettings = {
    easy: {
        rows: 5,
        colors: 4,
        speed: 8,
        scoreMultiplier: 1
    },
    medium: {
        rows: 7,
        colors: 5,
        speed: 10,
        scoreMultiplier: 1.5
    },
    hard: {
        rows: 9,
        colors: 6,
        speed: 12,
        scoreMultiplier: 2
    }
};

// Game objects
let bubbles = [];
let shooter = {
    x: 0,
    y: 0,
    radius: 20,
    color: '',
    angle: 0
};
let projectile = null;
let nextBubbleColor = '';

// Colors for bubbles
const colors = [
    '#FF5252', // red
    '#4CAF50', // green
    '#2196F3', // blue
    '#FFC107', // amber
    '#9C27B0', // purple
    '#FF9800', // orange
    '#795548'  // brown
];

// Constants
const BUBBLE_RADIUS = 20;
const GRID_WIDTH = 12;
const GRID_HEIGHT = 14;
const CANVAS_PADDING = 50;

// Leaderboard storage
const LEADERBOARD_KEY = 'bubbleShooterLeaderboard';

// Initialize game
function initGame() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    document.querySelectorAll('.levelButton').forEach(button => {
        button.addEventListener('click', () => {
            difficulty = button.dataset.level;
            startGame();
        });
    });
    
    restartButton.addEventListener('click', () => {
        gameOverPanel.style.display = 'none';
        levelSelect.style.display = 'block';
    });
    
    leaderboardBtn.addEventListener('click', showLeaderboard);
    closeLeaderboardBtn.addEventListener('click', () => {
        leaderboardPanel.style.display = 'none';
    });
    
    submitScoreBtn.addEventListener('click', submitScore);
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            displayLeaderboard(e.target.dataset.difficulty);
        });
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    shooter.x = canvas.width / 2;
    shooter.y = canvas.height - 50;
    
    if (gameActive) {
        drawGame();
    }
}

function startGame() {
    levelSelect.style.display = 'none';
    gameActive = true;
    score = 0;
    level = 1;
    
    updateScore();
    updateLevel();
    
    initBubbles();
    nextBubbleColor = getRandomColor();
    shooter.color = getRandomColor();
    updateNextBubble();
    
    gameLoop();
}

function initBubbles() {
    bubbles = [];
    const settings = difficultySettings[difficulty];
    const rows = settings.rows;
    const offsetX = (canvas.width - (GRID_WIDTH * BUBBLE_RADIUS * 2)) / 2;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            if (row % 2 === 1 && col === GRID_WIDTH - 1) continue;
            
            const x = offsetX + col * BUBBLE_RADIUS * 2 + (row % 2 === 1 ? BUBBLE_RADIUS : 0);
            const y = CANVAS_PADDING + row * BUBBLE_RADIUS * 1.8;
            
            bubbles.push({
                x: x,
                y: y,
                radius: BUBBLE_RADIUS,
                color: getRandomColor(),
                row: row,
                col: col
            });
        }
    }
}

function getRandomColor() {
    const settings = difficultySettings[difficulty];
    const availableColors = colors.slice(0, settings.colors);
    return availableColors[Math.floor(Math.random() * availableColors.length)];
}

function handleMouseMove(e) {
    if (!gameActive || projectile) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    shooter.angle = Math.atan2(mouseY - shooter.y, mouseX - shooter.x);
}

function handleClick() {
    if (!gameActive || projectile) return;
    
    const settings = difficultySettings[difficulty];
    projectile = {
        x: shooter.x,
        y: shooter.y,
        radius: BUBBLE_RADIUS,
        color: shooter.color,
        vx: Math.cos(shooter.angle) * settings.speed,
        vy: Math.sin(shooter.angle) * settings.speed
    };
}

function updateProjectile() {
    if (!projectile) return;
    
    projectile.x += projectile.vx;
    projectile.y += projectile.vy;
    
    // Wall collision
    if (projectile.x - projectile.radius < 0 || projectile.x + projectile.radius > canvas.width) {
        projectile.vx *= -1;
    }
    
    // Check collision with bubbles
    for (let bubble of bubbles) {
        const dx = projectile.x - bubble.x;
        const dy = projectile.y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < projectile.radius + bubble.radius) {
            attachBubble(projectile, bubble);
            return;
        }
    }
    
    // Check if reached top
    if (projectile.y - projectile.radius < CANVAS_PADDING) {
        attachBubbleToTop(projectile);
    }
}

function attachBubble(proj, nearBubble) {
    const newBubble = {
        x: nearBubble.x,
        y: nearBubble.y - BUBBLE_RADIUS * 1.8,
        radius: BUBBLE_RADIUS,
        color: proj.color,
        row: nearBubble.row - 1,
        col: nearBubble.col
    };
    
    bubbles.push(newBubble);
    projectile = null;
    
    checkMatches(newBubble);
    checkFloatingBubbles();
    
    if (bubbles.length === 0) {
        levelUp();
    } else if (checkGameOver()) {
        endGame();
    } else {
        nextShot();
    }
}

function attachBubbleToTop(proj) {
    const offsetX = (canvas.width - (GRID_WIDTH * BUBBLE_RADIUS * 2)) / 2;
    const col = Math.floor((proj.x - offsetX) / (BUBBLE_RADIUS * 2));
    
    const newBubble = {
        x: offsetX + col * BUBBLE_RADIUS * 2,
        y: CANVAS_PADDING,
        radius: BUBBLE_RADIUS,
        color: proj.color,
        row: 0,
        col: col
    };
    
    bubbles.push(newBubble);
    projectile = null;
    
    checkMatches(newBubble);
    checkFloatingBubbles();
    
    if (bubbles.length === 0) {
        levelUp();
    } else if (checkGameOver()) {
        endGame();
    } else {
        nextShot();
    }
}

function checkMatches(bubble) {
    const matches = [bubble];
    const checked = new Set();
    const toCheck = [bubble];
    
    while (toCheck.length > 0) {
        const current = toCheck.pop();
        const key = `${current.x},${current.y}`;
        
        if (checked.has(key)) continue;
        checked.add(key);
        
        for (let other of bubbles) {
            if (other === current) continue;
            if (other.color !== bubble.color) continue;
            
            const dx = current.x - other.x;
            const dy = current.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < BUBBLE_RADIUS * 2.5) {
                const otherKey = `${other.x},${other.y}`;
                if (!checked.has(otherKey) && !matches.includes(other)) {
                    matches.push(other);
                    toCheck.push(other);
                }
            }
        }
    }
    
    if (matches.length >= 3) {
        const settings = difficultySettings[difficulty];
        const points = matches.length * 10 * settings.scoreMultiplier;
        score += Math.floor(points);
        updateScore();
        
        matches.forEach(match => {
            const index = bubbles.indexOf(match);
            if (index > -1) {
                bubbles.splice(index, 1);
            }
        });
    }
}

function checkFloatingBubbles() {
    const connected = new Set();
    const toCheck = [];
    
    // Find all bubbles connected to the top
    bubbles.forEach(bubble => {
        if (bubble.y < CANVAS_PADDING + BUBBLE_RADIUS * 2) {
            connected.add(bubble);
            toCheck.push(bubble);
        }
    });
    
    while (toCheck.length > 0) {
        const current = toCheck.pop();
        
        bubbles.forEach(other => {
            if (connected.has(other)) return;
            
            const dx = current.x - other.x;
            const dy = current.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < BUBBLE_RADIUS * 2.5) {
                connected.add(other);
                toCheck.push(other);
            }
        });
    }
    
    // Remove floating bubbles
    const floating = bubbles.filter(b => !connected.has(b));
    if (floating.length > 0) {
        const settings = difficultySettings[difficulty];
        const points = floating.length * 20 * settings.scoreMultiplier;
        score += Math.floor(points);
        updateScore();
        
        bubbles = bubbles.filter(b => connected.has(b));
    }
}

function checkGameOver() {
    return bubbles.some(bubble => bubble.y > canvas.height - 150);
}

function nextShot() {
    shooter.color = nextBubbleColor;
    nextBubbleColor = getRandomColor();
    updateNextBubble();
}

function levelUp() {
    level++;
    updateLevel();
    score += 100 * level;
    updateScore();
    initBubbles();
}

function endGame() {
    gameActive = false;
    finalScoreElement.textContent = `Your Score: ${score}`;
    gameOverPanel.style.display = 'block';
    playerNameInput.value = '';
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function updateLevel() {
    levelElement.textContent = `Level: ${level}`;
}

function updateNextBubble() {
    nextBubbleElement.style.backgroundColor = nextBubbleColor;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bubbles
    bubbles.forEach(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add 3D effect
        const gradient = ctx.createRadialGradient(
            bubble.x - bubble.radius / 3,
            bubble.y - bubble.radius / 3,
            0,
            bubble.x,
            bubble.y,
            bubble.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fill();
    });
    
    // Draw shooter
    ctx.beginPath();
    ctx.arc(shooter.x, shooter.y, shooter.radius, 0, Math.PI * 2);
    ctx.fillStyle = shooter.color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw aim line
    if (gameActive && !projectile) {
        ctx.beginPath();
        ctx.moveTo(shooter.x, shooter.y);
        ctx.lineTo(
            shooter.x + Math.cos(shooter.angle) * 100,
            shooter.y + Math.sin(shooter.angle) * 100
        );
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw projectile
    if (projectile) {
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
        ctx.fillStyle = projectile.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function gameLoop() {
    if (!gameActive) return;
    
    updateProjectile();
    drawGame();
    
    requestAnimationFrame(gameLoop);
}

// Leaderboard functions
function getLeaderboard() {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : { easy: [], medium: [], hard: [] };
}

function saveLeaderboard(leaderboard) {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

function submitScore() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }
    
    const leaderboard = getLeaderboard();
    const entry = {
        name: playerName,
        score: score,
        level: level,
        date: new Date().toISOString()
    };
    
    leaderboard[difficulty].push(entry);
    leaderboard[difficulty].sort((a, b) => b.score - a.score);
    leaderboard[difficulty] = leaderboard[difficulty].slice(0, 10); // Keep top 10
    
    saveLeaderboard(leaderboard);
    
    gameOverPanel.style.display = 'none';
    showLeaderboard();
}

function showLeaderboard() {
    leaderboardPanel.style.display = 'block';
    displayLeaderboard(difficulty);
}

function displayLeaderboard(diff) {
    const leaderboard = getLeaderboard();
    const entries = leaderboard[diff] || [];
    const listElement = document.getElementById('leaderboardList');
    
    if (entries.length === 0) {
        listElement.innerHTML = '<p style="color: rgba(255,255,255,0.6);">No scores yet. Be the first!</p>';
        return;
    }
    
    listElement.innerHTML = entries.map((entry, index) => {
        const rank = index + 1;
        const date = new Date(entry.date).toLocaleDateString();
        const rankClass = rank <= 3 ? `top-${rank}` : '';
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
        
        return `
            <div class="leaderboard-entry ${rankClass}">
                <div class="rank">${medal || rank}</div>
                <div class="player-info">
                    <div class="player-name">${entry.name}</div>
                    <div class="player-date">Level ${entry.level} • ${date}</div>
                </div>
                <div class="player-score">${entry.score}</div>
            </div>
        `;
    }).join('');
}

// Initialize game when page loads
window.addEventListener('load', initGame);
