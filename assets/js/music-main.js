// Sound enabled state
let soundEnabled = true;
const soundToggle = document.getElementById('sound-toggle');

// Role rotation for the "Now Playing" section
const roles = [
    "ML Engineer @ Positive Grid 🎸",
    "Berkeley CS Fall 2025 🐻",
    "3× Hackathon Champion 🏆",
    "24 Concert Pianist 🎹",
    "Open Source Contributor 💻",
    "Baseball Data Wizard ⚾",
    "VST Plugin Developer 🎛️",
    "Full-Stack Architect 🏗️"
];

let currentRoleIndex = 0;

function updateRole() {
    const roleElement = document.getElementById('current-role');
    if (roleElement) {
        roleElement.style.opacity = '0';
        setTimeout(() => {
            roleElement.textContent = roles[currentRoleIndex];
            roleElement.style.opacity = '1';
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        }, 300);
    }
}

setInterval(updateRole, 3000);
updateRole();

// Piano key interactions
const pianoKeys = document.querySelectorAll('.key');
const notes = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88
};

// Create audio context for piano sounds
let audioContext;
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playNote(frequency) {
    if (!soundEnabled) return;
    
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}

pianoKeys.forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = key.dataset.note;
        if (note && notes[note]) {
            playNote(notes[note]);
            key.classList.add('pressed');
        }
        
        // Navigate to section if it's a white key
        const section = key.dataset.section;
        if (section) {
            setTimeout(() => {
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
            }, 200);
        }
    });
    
    key.addEventListener('mouseup', () => {
        key.classList.remove('pressed');
    });
    
    key.addEventListener('mouseleave', () => {
        key.classList.remove('pressed');
    });
});

// Sound toggle
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
});

// Vinyl record hover effects
const recordSleeves = document.querySelectorAll('.record-sleeve');
recordSleeves.forEach(sleeve => {
    sleeve.addEventListener('mouseenter', () => {
        if (soundEnabled) {
            playNote(notes['E']);
        }
    });
});

// Music visualizer enhancement based on scroll
window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const waves = document.querySelectorAll('.wave');
    waves.forEach((wave, index) => {
        const height = 100 + (scrollPercent * 200);
        wave.style.height = `${height}px`;
        wave.style.opacity = 0.3 + (scrollPercent * 0.3);
    });
});

// Cassette tape animation
const reels = document.querySelectorAll('.reel');
let tapeRotation = 0;

setInterval(() => {
    tapeRotation += 10;
    reels.forEach(reel => {
        reel.style.transform = `rotate(${tapeRotation}deg)`;
    });
}, 100);

// Studio knob interactions
const knobs = document.querySelectorAll('.knob');
knobs.forEach(knob => {
    let rotation = 0;
    knob.addEventListener('click', () => {
        rotation += 45;
        knob.style.transform = `rotate(${rotation}deg)`;
        if (soundEnabled) {
            playNote(notes['A']);
        }
    });
});

// Effect pedal interactions
const pedals = document.querySelectorAll('.effect-pedal');
pedals.forEach(pedal => {
    pedal.addEventListener('click', function() {
        this.classList.toggle('active');
        if (soundEnabled) {
            playNote(notes['G']);
        }
    });
});

// Secret music mode
let secretCode = [];
const secretSequence = ['m', 'u', 's', 'i', 'c'];

document.addEventListener('keypress', (e) => {
    secretCode.push(e.key.toLowerCase());
    secretCode = secretCode.slice(-5);
    
    if (secretCode.join('') === secretSequence.join('')) {
        activateMusicMode();
    }
});

function activateMusicMode() {
    document.body.style.animation = 'disco 2s linear infinite';
    
    // Create disco ball effect
    const discoBall = document.createElement('div');
    discoBall.className = 'disco-ball';
    discoBall.style.cssText = `
        position: fixed;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, #fff, #silver);
        border-radius: 50%;
        animation: spin 2s linear infinite;
        z-index: 10000;
        box-shadow: 0 0 50px rgba(255, 255, 255, 0.8);
    `;
    document.body.appendChild(discoBall);
    
    // Play a melody
    const melody = ['C', 'E', 'G', 'E', 'C'];
    melody.forEach((note, index) => {
        setTimeout(() => {
            playNote(notes[note]);
        }, index * 200);
    });
    
    setTimeout(() => {
        document.body.style.animation = '';
        discoBall.remove();
        alert('🎵 You found the music mode! Keep vibing! 🎵');
    }, 5000);
}

// Add disco animation
const style = document.createElement('style');
style.textContent = `
    @keyframes disco {
        0% { filter: hue-rotate(0deg) brightness(1.2); }
        25% { filter: hue-rotate(90deg) brightness(1.5); }
        50% { filter: hue-rotate(180deg) brightness(1.2); }
        75% { filter: hue-rotate(270deg) brightness(1.5); }
        100% { filter: hue-rotate(360deg) brightness(1.2); }
    }
`;
document.head.appendChild(style);

// Smooth parallax for album cover
window.addEventListener('mousemove', (e) => {
    const vinyl = document.querySelector('.vinyl-record');
    if (vinyl) {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        vinyl.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    }
});

// Concert poster interactions
const posters = document.querySelectorAll('.concert-poster');
posters.forEach((poster, index) => {
    poster.style.animationDelay = `${index * 0.1}s`;
    poster.addEventListener('click', () => {
        poster.style.transform = 'rotate(0) scale(1.2)';
        if (soundEnabled) {
            playNote(notes[Object.keys(notes)[index % 12]]);
        }
        setTimeout(() => {
            poster.style.transform = poster.classList.contains('even') ? 'rotate(2deg)' : 'rotate(-2deg)';
        }, 500);
    });
});

// Initialize LED meters based on skill levels
document.querySelectorAll('.instrument').forEach(instrument => {
    const level = parseInt(instrument.dataset.level);
    const leds = instrument.querySelectorAll('.led-meter span');
    const activeLeds = Math.ceil((level / 100) * leds.length);
    
    leds.forEach((led, index) => {
        if (index < activeLeds) {
            led.style.background = '#00ff41';
            led.style.boxShadow = '0 0 10px #00ff41';
        }
    });
});

// Add entrance animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Play a subtle note when sections appear
            if (soundEnabled && entry.target.classList.contains('section-header')) {
                playNote(notes['C']);
            }
        }
    });
}, observerOptions);

// Observe all major sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});

// Console art
console.log('%c♪ ♫ ♪ Welcome to Vaclis Music Studio ♪ ♫ ♪', 'color: #d4af37; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%c🎹 Try typing "music" for a surprise!', 'color: #ff006e; font-size: 14px;');
console.log('%c🎸 Click the piano keys to navigate', 'color: #00f5ff; font-size: 14px;');
console.log('%c🎵 Sound can be toggled with the speaker icon', 'color: #00ff41; font-size: 14px;');

// Add subtle background music visualization
let animationFrame;
function createMusicVisualization() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.1;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            hue: Math.random() * 360
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.hue += 1;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 100%, 50%, 0.8)`;
            ctx.fill();
        });
        
        animationFrame = requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize visualization after page load
window.addEventListener('load', () => {
    setTimeout(createMusicVisualization, 1000);
});