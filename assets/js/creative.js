// Initialize Web Audio API
let audioContext;
let soundEnabled = true;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Create piano sound with Web Audio API
function playPianoNote(frequency, duration = 1) {
    if (!soundEnabled) return;
    
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    // Piano-like sound with multiple harmonics
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Filter for warmer sound
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, audioContext.currentTime);
    filter.Q.setValueAtTime(1, audioContext.currentTime);
    
    // ADSR envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.01); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.1); // Decay
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration); // Release
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    // Add second harmonic for richness
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(frequency * 2, audioContext.currentTime);
    gainNode2.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    
    oscillator2.start(audioContext.currentTime);
    oscillator2.stop(audioContext.currentTime + duration);
}

// Hide splash screen
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.classList.add('hidden');
            // Play opening chord
            if (soundEnabled) {
                playPianoNote(261.63, 2); // C
                setTimeout(() => playPianoNote(329.63, 2), 100); // E
                setTimeout(() => playPianoNote(392.00, 2), 200); // G
            }
        }
    }, 2000);
});

// Piano keyboard setup
const pianoKeys = document.querySelectorAll('#interactive-piano .key');
const keyMap = {
    'a': 261.63, // C
    'w': 277.18, // C#
    's': 293.66, // D
    'e': 311.13, // D#
    'd': 329.63, // E
    'f': 349.23, // F
    't': 369.99, // F#
    'g': 392.00, // G
    'y': 415.30, // G#
    'h': 440.00, // A
    'u': 466.16, // A#
    'j': 493.88, // B
    'k': 523.25  // C (octave up)
};

pianoKeys.forEach(key => {
    const frequency = parseFloat(key.dataset.freq);
    
    key.addEventListener('mousedown', () => {
        key.classList.add('active');
        playPianoNote(frequency);
    });
    
    key.addEventListener('mouseup', () => {
        key.classList.remove('active');
    });
    
    key.addEventListener('mouseleave', () => {
        key.classList.remove('active');
    });
    
    // Touch support
    key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        key.classList.add('active');
        playPianoNote(frequency);
    });
    
    key.addEventListener('touchend', () => {
        key.classList.remove('active');
    });
});

// Keyboard piano playing
document.addEventListener('keydown', (e) => {
    if (keyMap[e.key.toLowerCase()]) {
        playPianoNote(keyMap[e.key.toLowerCase()]);
        // Find and highlight the corresponding key
        pianoKeys.forEach(key => {
            if (Math.abs(parseFloat(key.dataset.freq) - keyMap[e.key.toLowerCase()]) < 1) {
                key.classList.add('active');
            }
        });
    }
});

document.addEventListener('keyup', (e) => {
    if (keyMap[e.key.toLowerCase()]) {
        pianoKeys.forEach(key => {
            if (Math.abs(parseFloat(key.dataset.freq) - keyMap[e.key.toLowerCase()]) < 1) {
                key.classList.remove('active');
            }
        });
    }
});

// Sound toggle
const soundBtn = document.getElementById('sound-btn');
if (soundBtn) {
    soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundBtn.className = soundEnabled ? 'sound-on' : 'sound-off';
        soundBtn.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    });
}

// Navigation with track buttons
document.querySelectorAll('.track-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        const target = document.getElementById(section);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Play a click sound
            if (soundEnabled) {
                playPianoNote(440, 0.1);
            }
        }
    });
});

// Animated frequency bars
const frequencyBars = document.querySelectorAll('.frequency-bars span');
function animateFrequencyBars() {
    frequencyBars.forEach((bar, index) => {
        const randomHeight = Math.random() * 80 + 20;
        bar.style.height = `${randomHeight}%`;
    });
}
setInterval(animateFrequencyBars, 500);

// Mixtape hover effects
document.querySelectorAll('.mixtape').forEach((mixtape, index) => {
    mixtape.addEventListener('mouseenter', () => {
        if (soundEnabled) {
            // Play a note based on project
            const notes = [261.63, 329.63, 392.00, 440.00];
            playPianoNote(notes[index % notes.length], 0.3);
        }
    });
});

// Poster wall interactions
document.querySelectorAll('.poster').forEach((poster, index) => {
    poster.addEventListener('click', () => {
        // Play achievement sound
        if (soundEnabled) {
            // Victory chord
            playPianoNote(261.63, 0.5); // C
            setTimeout(() => playPianoNote(329.63, 0.5), 100); // E
            setTimeout(() => playPianoNote(392.00, 0.5), 200); // G
            setTimeout(() => playPianoNote(523.25, 0.5), 300); // High C
        }
    });
});

// Skills mixer faders
document.querySelectorAll('.fader').forEach(fader => {
    const handle = fader.querySelector('.fader-handle');
    const level = fader.querySelector('.level');
    let isDragging = false;
    
    handle.addEventListener('mousedown', () => {
        isDragging = true;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const rect = fader.querySelector('.fader-track').getBoundingClientRect();
            const y = e.clientY - rect.top;
            const percentage = Math.max(0, Math.min(100, (1 - y / rect.height) * 100));
            handle.style.bottom = `${percentage}%`;
            if (level) {
                level.textContent = `${Math.round(percentage)}%`;
            }
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});

// VU Meter animation
function animateVUMeter() {
    const bars = document.querySelectorAll('.vu-bar');
    bars.forEach((bar, index) => {
        const isActive = Math.random() > 0.3 - (index * 0.05);
        bar.className = 'vu-bar';
        if (isActive) {
            bar.classList.add(index > 7 ? 'peak' : 'active');
        }
    });
}
setInterval(animateVUMeter, 200);

// Music mode easter egg
let musicModeSequence = [];
document.addEventListener('keypress', (e) => {
    musicModeSequence.push(e.key.toLowerCase());
    musicModeSequence = musicModeSequence.slice(-1);
    
    if (e.key.toLowerCase() === 'm') {
        activateMusicMode();
    }
});

function activateMusicMode() {
    const player = document.getElementById('music-player');
    if (player) {
        player.classList.toggle('hidden');
        
        if (!player.classList.contains('hidden')) {
            // Play a funky intro
            const melody = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
            melody.forEach((note, index) => {
                setTimeout(() => playPianoNote(note, 0.2), index * 100);
            });
        }
    }
}

// Play button in music player
const playBtn = document.querySelector('.player-btn.play');
if (playBtn) {
    let isPlaying = false;
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        
        if (isPlaying && soundEnabled) {
            // Play a simple loop
            const playLoop = () => {
                if (isPlaying) {
                    const notes = [261.63, 329.63, 392.00, 329.63];
                    notes.forEach((note, index) => {
                        setTimeout(() => {
                            if (isPlaying) playPianoNote(note, 0.5);
                        }, index * 500);
                    });
                    setTimeout(playLoop, 2000);
                }
            };
            playLoop();
        }
    });
}

// Smooth scroll with progress indicator
let scrollProgress = 0;
window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    scrollProgress = (window.scrollY / documentHeight) * 100;
    
    // Update frequency bars based on scroll
    frequencyBars.forEach((bar, index) => {
        const baseHeight = 20 + (scrollProgress * 0.6);
        const randomVariation = Math.sin(Date.now() / 200 + index) * 20;
        bar.style.height = `${baseHeight + randomVariation}%`;
    });
});

// Create floating music notes
function createFloatingNote() {
    const note = document.createElement('div');
    note.innerHTML = ['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)];
    note.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        bottom: -50px;
        font-size: ${20 + Math.random() * 20}px;
        color: rgba(255, 183, 0, ${0.3 + Math.random() * 0.3});
        z-index: 1;
        pointer-events: none;
        animation: floatUp ${5 + Math.random() * 5}s linear;
    `;
    
    document.body.appendChild(note);
    
    note.addEventListener('animationend', () => {
        note.remove();
    });
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Create notes periodically
setInterval(createFloatingNote, 3000);

// Parallax effect for cassette tape
window.addEventListener('mousemove', (e) => {
    const cassette = document.querySelector('.cassette-tape');
    if (cassette) {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        cassette.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    }
});

// Console art
console.log('%c🎹 Welcome to Jimmy\'s Music Studio! 🎵', 'color: #FFB700; font-size: 24px; font-weight: bold;');
console.log('%c♫ Press M to toggle music player', 'color: #00F5FF; font-size: 14px;');
console.log('%c♪ Use keys A-K to play the piano', 'color: #FF006E; font-size: 14px;');
console.log('%c🎸 Hover over projects to hear them sing!', 'color: #00FF41; font-size: 14px;');

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Add entrance animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Play a subtle note when sections appear
                if (soundEnabled && entry.target.tagName === 'SECTION') {
                    const sectionNotes = {
                        'about': 293.66,
                        'projects': 329.63,
                        'achievements': 392.00,
                        'skills': 440.00,
                        'connect': 523.25
                    };
                    const note = sectionNotes[entry.target.id];
                    if (note) {
                        playPianoNote(note, 0.2);
                    }
                }
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});