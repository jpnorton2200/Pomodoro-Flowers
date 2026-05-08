// App State
let timerInterval = null;
let timeRemaining = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let isBreak = false;
let currentGrowthStage = 0;
let flowers = [];

// Alpine wildflower types and colors
const alpineFlowers = [
    {
        name: 'Colorado Columbine',
        colors: ['#6B9BD1', '#FFFFFF', '#FFD700'], // Blue, white, yellow
        type: 'columbine'
    },
    {
        name: 'Indian Paintbrush',
        colors: ['#E74C3C', '#FF6B6B', '#FF8C8C'], // Red variations
        type: 'paintbrush'
    },
    {
        name: 'Alpine Forget-Me-Not',
        colors: ['#4A90E2', '#5DA3E8', '#7BB3ED'], // Blue variations
        type: 'forget-me-not'
    },
    {
        name: 'Mountain Lupine',
        colors: ['#7B68EE', '#9370DB', '#BA55D3'], // Purple variations
        type: 'lupine'
    },
    {
        name: 'Alpine Sunflower',
        colors: ['#FFD700', '#FFC107', '#FFB300'], // Yellow variations
        type: 'sunflower'
    },
    {
        name: 'Mountain Bluebells',
        colors: ['#6495ED', '#7AA5F0', '#87CEEB'], // Blue variations
        type: 'bluebells'
    },
    {
        name: 'Alpine Primrose',
        colors: ['#FFB6C1', '#FFC0CB', '#FFD6E0'], // Pink variations
        type: 'primrose'
    },
    {
        name: 'Yellow Avalanche Lily',
        colors: ['#FFEB3B', '#FFF176', '#FFFACD'], // Yellow/cream variations
        type: 'lily'
    }
];

// DOM Elements
const timerView = document.getElementById('timerView');
const gardenView = document.getElementById('gardenView');
const viewToggle = document.getElementById('viewToggle');
const timerText = document.getElementById('timerText');
const sessionLabel = document.getElementById('sessionLabel');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const currentFlower = document.getElementById('currentFlower');
const gardenGrid = document.getElementById('gardenGrid');
const emptyGarden = document.getElementById('emptyGarden');
const todayCount = document.getElementById('todayCount');
const totalCount = document.getElementById('totalCount');

// Initialize
init();

function init() {
    loadFlowers();
    updateStats();
    renderGarden();
    updateTimerDisplay();
    
    // Event listeners
    viewToggle.addEventListener('click', toggleView);
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}

function toggleView() {
    const isTimerActive = timerView.classList.contains('active');
    
    if (isTimerActive) {
        timerView.classList.remove('active');
        gardenView.classList.add('active');
        viewToggle.textContent = '⏱️';
    } else {
        gardenView.classList.remove('active');
        timerView.classList.add('active');
        viewToggle.textContent = '🏡';
    }
}

function startTimer() {
    isRunning = true;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    resetBtn.style.display = 'inline-block';
    
    if (currentGrowthStage === 0) {
        renderFlower(0);
    }
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        updateFlowerGrowth();
        
        if (timeRemaining <= 0) {
            timerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    pauseBtn.textContent = 'Resume';
    pauseBtn.onclick = resumeTimer;
}

function resumeTimer() {
    isRunning = true;
    pauseBtn.textContent = 'Pause';
    pauseBtn.onclick = pauseTimer;
    startTimer();
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeRemaining = isBreak ? 5 * 60 : 25 * 60;
    currentGrowthStage = 0;
    
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    
    currentFlower.innerHTML = '';
    delete currentFlower.dataset.flowerType;
    delete currentFlower.dataset.flowerColors;
    delete currentFlower.dataset.flowerName;
    updateTimerDisplay();
}

function timerComplete() {
    clearInterval(timerInterval);
    isRunning = false;
    
    if (!isBreak) {
        // Work session complete - save flower
        saveFlower();
        celebrate();
        
        // Switch to break
        isBreak = true;
        timeRemaining = 5 * 60;
        sessionLabel.textContent = 'Break Time 🏔️';
        startBtn.textContent = 'Start Break';
    } else {
        // Break complete
        isBreak = false;
        timeRemaining = 25 * 60;
        sessionLabel.textContent = 'Focus Time';
        startBtn.textContent = 'Start Growing 🌱';
    }
    
    currentGrowthStage = 0;
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    currentFlower.innerHTML = '';
    delete currentFlower.dataset.flowerType;
    delete currentFlower.dataset.flowerColors;
    delete currentFlower.dataset.flowerName;
    updateTimerDisplay();
    
    // Play notification sound (visual only for now)
    document.body.style.animation = 'none';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateFlowerGrowth() {
    const totalTime = isBreak ? 5 * 60 : 25 * 60;
    const elapsed = totalTime - timeRemaining;
    const progress = elapsed / totalTime;
    
    // Growth stages at 20%, 40%, 60%, 80%, 100%
    const newStage = Math.min(5, Math.floor(progress * 5) + 1);
    
    if (newStage > currentGrowthStage) {
        currentGrowthStage = newStage;
        renderFlower(currentGrowthStage);
    }
}

function renderFlower(stage) {
    // Pick a random alpine flower type
    if (!currentFlower.dataset.flowerType) {
        const flowerData = alpineFlowers[Math.floor(Math.random() * alpineFlowers.length)];
        currentFlower.dataset.flowerType = flowerData.type;
        currentFlower.dataset.flowerColors = JSON.stringify(flowerData.colors);
        currentFlower.dataset.flowerName = flowerData.name;
    }
    
    const flowerType = currentFlower.dataset.flowerType;
    const colors = JSON.parse(currentFlower.dataset.flowerColors);
    
    let svg = `<svg class="flower-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">`;
    
    // Stage 1: Seed/sprout
    if (stage >= 1) {
        svg += `<ellipse cx="100" cy="180" rx="15" ry="8" fill="#6B4423" opacity="0.6"/>`;
        svg += `<line x1="100" y1="180" x2="100" y2="160" stroke="#3D5A3D" stroke-width="3" class="flower-stem"/>`;
    }
    
    // Stage 2: Small stem with leaves
    if (stage >= 2) {
        svg += `<line x1="100" y1="160" x2="100" y2="120" stroke="#3D5A3D" stroke-width="4" class="flower-stem"/>`;
        svg += `<ellipse cx="85" cy="145" rx="12" ry="8" fill="#4A7C3C" class="flower-leaf" style="animation-delay: 0.2s"/>`;
        svg += `<ellipse cx="115" cy="140" rx="12" ry="8" fill="#4A7C3C" class="flower-leaf" style="animation-delay: 0.3s"/>`;
    }
    
    // Stage 3: Taller stem, more leaves
    if (stage >= 3) {
        svg += `<line x1="100" y1="120" x2="100" y2="80" stroke="#3D5A3D" stroke-width="5" class="flower-stem"/>`;
        svg += `<ellipse cx="80" cy="100" rx="15" ry="10" fill="#4A7C3C" class="flower-leaf" style="animation-delay: 0.4s"/>`;
        svg += `<ellipse cx="120" cy="95" rx="15" ry="10" fill="#4A7C3C" class="flower-leaf" style="animation-delay: 0.5s"/>`;
    }
    
    // Stage 4: Bud appears
    if (stage >= 4) {
        svg += `<circle cx="100" cy="70" r="12" fill="${colors[0]}" opacity="0.7" class="flower-petal" style="animation-delay: 0.6s"/>`;
    }
    
    // Stage 5: Full bloom - different shapes for different flowers
    if (stage >= 5) {
        if (flowerType === 'columbine') {
            // Colorado Columbine - distinctive spurred petals
            // Outer blue petals (sepals)
            const outerPetals = [
                [100, 35], [118, 45], [125, 60], [118, 75], [100, 85], [82, 75], [75, 60], [82, 45]
            ];
            outerPetals.forEach((pos, i) => {
                svg += `<ellipse cx="${pos[0]}" cy="${pos[1]}" rx="10" ry="16" fill="${colors[0]}" opacity="0.9" class="flower-petal" style="animation-delay: ${0.7 + i * 0.05}s"/>`;
            });
            
            // Inner white petals with spurs
            const innerPetals = [
                [100, 42], [112, 50], [115, 60], [112, 70], [100, 78], [88, 70], [85, 60], [88, 50]
            ];
            innerPetals.forEach((pos, i) => {
                svg += `<ellipse cx="${pos[0]}" cy="${pos[1]}" rx="8" ry="14" fill="${colors[1]}" opacity="0.95" class="flower-petal" style="animation-delay: ${0.75 + i * 0.05}s"/>`;
            });
            
            // Yellow center
            svg += `<circle cx="100" cy="60" r="6" fill="${colors[2]}" opacity="0.95"/>`;
            
        } else if (flowerType === 'paintbrush') {
            // Indian Paintbrush - brush-like top
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI * 2 * i) / 12;
                const r = 8 + Math.random() * 8;
                const x = 100 + Math.cos(angle) * r;
                const y = 55 + Math.sin(angle) * r;
                svg += `<ellipse cx="${x}" cy="${y}" rx="4" ry="12" fill="${colors[i % 3]}" opacity="0.85" class="flower-petal" style="animation-delay: ${0.7 + i * 0.03}s; transform: rotate(${angle}rad); transform-origin: ${x}px ${y}px"/>`;
            }
            
        } else if (flowerType === 'lupine') {
            // Mountain Lupine - spike of flowers
            for (let i = 0; i < 8; i++) {
                const y = 40 + i * 8;
                svg += `<ellipse cx="95" cy="${y}" rx="8" ry="6" fill="${colors[i % 3]}" opacity="0.85" class="flower-petal" style="animation-delay: ${0.7 + i * 0.05}s"/>`;
                svg += `<ellipse cx="105" cy="${y}" rx="8" ry="6" fill="${colors[i % 3]}" opacity="0.85" class="flower-petal" style="animation-delay: ${0.72 + i * 0.05}s"/>`;
            }
            
        } else if (flowerType === 'sunflower') {
            // Alpine Sunflower - large center with petals
            svg += `<circle cx="100" cy="60" r="12" fill="#8B4513" opacity="0.9"/>`;
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI * 2 * i) / 12 - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 20;
                const y = 60 + Math.sin(angle) * 20;
                svg += `<ellipse cx="${x}" cy="${y}" rx="10" ry="18" fill="${colors[i % 3]}" opacity="0.9" class="flower-petal" style="animation-delay: ${0.7 + i * 0.04}s; transform-origin: 100px 60px"/>`;
            }
            
        } else if (flowerType === 'forget-me-not' || flowerType === 'bluebells') {
            // Small 5-petaled flowers
            svg += `<circle cx="100" cy="60" r="5" fill="#FFD700" opacity="0.9"/>`;
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 14;
                const y = 60 + Math.sin(angle) * 14;
                svg += `<circle cx="${x}" cy="${y}" r="10" fill="${colors[i % 3]}" opacity="0.85" class="flower-petal" style="animation-delay: ${0.7 + i * 0.06}s"/>`;
            }
            
        } else if (flowerType === 'lily') {
            // Lily - 6 pointed petals
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 18;
                const y = 60 + Math.sin(angle) * 18;
                svg += `<ellipse cx="${x}" cy="${y}" rx="9" ry="20" fill="${colors[i % 3]}" opacity="0.88" class="flower-petal" style="animation-delay: ${0.7 + i * 0.05}s; transform-origin: 100px 60px"/>`;
            }
            svg += `<circle cx="100" cy="60" r="5" fill="#FF8C00" opacity="0.9"/>`;
            
        } else {
            // Default primrose style - 5 rounded petals
            svg += `<circle cx="100" cy="60" r="8" fill="#FFD700" opacity="0.9"/>`;
            for (let i = 0; i < 5; i++) {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 16;
                const y = 60 + Math.sin(angle) * 16;
                svg += `<ellipse cx="${x}" cy="${y}" rx="12" ry="15" fill="${colors[i % 3]}" opacity="0.85" class="flower-petal" style="animation-delay: ${0.7 + i * 0.06}s; transform-origin: 100px 60px"/>`;
            }
        }
    }
    
    svg += `</svg>`;
    
    currentFlower.innerHTML = svg;
}

function saveFlower() {
    const flowerData = alpineFlowers[Math.floor(Math.random() * alpineFlowers.length)];
    const flower = {
        id: Date.now(),
        date: new Date().toISOString(),
        colors: flowerData.colors,
        type: flowerData.type,
        name: flowerData.name
    };
    
    flowers.push(flower);
    localStorage.setItem('flowers', JSON.stringify(flowers));
    
    updateStats();
    renderGarden();
}

function loadFlowers() {
    const saved = localStorage.getItem('flowers');
    if (saved) {
        flowers = JSON.parse(saved);
    }
}

function updateStats() {
    const today = new Date().toDateString();
    const todayFlowers = flowers.filter(f => new Date(f.date).toDateString() === today);
    
    todayCount.textContent = todayFlowers.length;
    totalCount.textContent = flowers.length;
}

function renderGarden() {
    if (flowers.length === 0) {
        emptyGarden.style.display = 'block';
        gardenGrid.innerHTML = '';
        return;
    }
    
    emptyGarden.style.display = 'none';
    gardenGrid.innerHTML = '';
    
    // Show most recent flowers first
    const sortedFlowers = [...flowers].reverse();
    
    sortedFlowers.forEach(flower => {
        const flowerDiv = document.createElement('div');
        flowerDiv.className = 'garden-flower';
        flowerDiv.title = flower.name || 'Alpine Wildflower';
        
        const svg = createGardenFlowerSVG(flower);
        const date = new Date(flower.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        flowerDiv.innerHTML = svg + `<div class="flower-date">${date}</div>`;
        gardenGrid.appendChild(flowerDiv);
    });
}

function createGardenFlowerSVG(flower) {
    const colors = flower.colors || ['#6B9BD1', '#FFFFFF', '#FFD700'];
    const type = flower.type || 'columbine';
    
    let svg = `<svg class="flower-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">`;
    
    // Soil and stem
    svg += `<ellipse cx="100" cy="180" rx="15" ry="8" fill="#6B4423" opacity="0.6"/>`;
    svg += `<line x1="100" y1="180" x2="100" y2="80" stroke="#3D5A3D" stroke-width="5"/>`;
    svg += `<ellipse cx="80" cy="140" rx="15" ry="10" fill="#4A7C3C"/>`;
    svg += `<ellipse cx="120" cy="135" rx="15" ry="10" fill="#4A7C3C"/>`;
    
    // Different flower types
    if (type === 'columbine') {
        // Colorado Columbine
        const outerPetals = [[100, 35], [118, 45], [125, 60], [118, 75], [100, 85], [82, 75], [75, 60], [82, 45]];
        outerPetals.forEach((pos, i) => {
            svg += `<ellipse cx="${pos[0]}" cy="${pos[1]}" rx="10" ry="16" fill="${colors[0]}" opacity="0.9"/>`;
        });
        const innerPetals = [[100, 42], [112, 50], [115, 60], [112, 70], [100, 78], [88, 70], [85, 60], [88, 50]];
        innerPetals.forEach((pos, i) => {
            svg += `<ellipse cx="${pos[0]}" cy="${pos[1]}" rx="8" ry="14" fill="${colors[1]}" opacity="0.95"/>`;
        });
        svg += `<circle cx="100" cy="60" r="6" fill="${colors[2]}" opacity="0.95"/>`;
        
    } else if (type === 'paintbrush') {
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const r = 8 + Math.random() * 8;
            const x = 100 + Math.cos(angle) * r;
            const y = 55 + Math.sin(angle) * r;
            svg += `<ellipse cx="${x}" cy="${y}" rx="4" ry="12" fill="${colors[i % 3]}" opacity="0.85"/>`;
        }
        
    } else if (type === 'lupine') {
        for (let i = 0; i < 8; i++) {
            const y = 40 + i * 8;
            svg += `<ellipse cx="95" cy="${y}" rx="8" ry="6" fill="${colors[i % 3]}" opacity="0.85"/>`;
            svg += `<ellipse cx="105" cy="${y}" rx="8" ry="6" fill="${colors[i % 3]}" opacity="0.85"/>`;
        }
        
    } else if (type === 'sunflower') {
        svg += `<circle cx="100" cy="60" r="12" fill="#8B4513" opacity="0.9"/>`;
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12 - Math.PI / 2;
            const x = 100 + Math.cos(angle) * 20;
            const y = 60 + Math.sin(angle) * 20;
            svg += `<ellipse cx="${x}" cy="${y}" rx="10" ry="18" fill="${colors[i % 3]}" opacity="0.9"/>`;
        }
        
    } else if (type === 'forget-me-not' || type === 'bluebells') {
        svg += `<circle cx="100" cy="60" r="5" fill="#FFD700" opacity="0.9"/>`;
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const x = 100 + Math.cos(angle) * 14;
            const y = 60 + Math.sin(angle) * 14;
            svg += `<circle cx="${x}" cy="${y}" r="10" fill="${colors[i % 3]}" opacity="0.85"/>`;
        }
        
    } else if (type === 'lily') {
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
            const x = 100 + Math.cos(angle) * 18;
            const y = 60 + Math.sin(angle) * 18;
            svg += `<ellipse cx="${x}" cy="${y}" rx="9" ry="20" fill="${colors[i % 3]}" opacity="0.88"/>`;
        }
        svg += `<circle cx="100" cy="60" r="5" fill="#FF8C00" opacity="0.9"/>`;
        
    } else {
        // Default primrose
        svg += `<circle cx="100" cy="60" r="8" fill="#FFD700" opacity="0.9"/>`;
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const x = 100 + Math.cos(angle) * 16;
            const y = 60 + Math.sin(angle) * 16;
            svg += `<ellipse cx="${x}" cy="${y}" rx="12" ry="15" fill="${colors[i % 3]}" opacity="0.85"/>`;
        }
    }
    
    svg += `</svg>`;
    return svg;
}

function celebrate() {
    currentFlower.classList.add('celebrating');
    setTimeout(() => {
        currentFlower.classList.remove('celebrating');
    }, 1500);
    
    // Create confetti effect
    for (let i = 0; i < 30; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.textContent = ['🌸', '🌺', '🌼', '🌻', '🌷'][Math.floor(Math.random() * 5)];
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-50px';
    confetti.style.fontSize = '24px';
    confetti.style.opacity = '1';
    confetti.style.transition = 'all 3s ease-out';
    confetti.style.zIndex = '1000';
    confetti.style.pointerEvents = 'none';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.style.top = '100vh';
        confetti.style.opacity = '0';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    }, 10);
    
    setTimeout(() => {
        confetti.remove();
    }, 3000);
}

// Prevent screen sleep during timer (if supported)
let wakeLock = null;
async function requestWakeLock() {
    if ('wakeLock' in navigator && isRunning) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
            console.log('Wake Lock not supported');
        }
    }
}

// Request wake lock when timer starts
const originalStartTimer = startTimer;
startTimer = function() {
    originalStartTimer();
    requestWakeLock();
};
