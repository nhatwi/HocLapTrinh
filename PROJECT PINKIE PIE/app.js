/**
 * Pinkie Pie Y2K Live Wallpaper - Mane 6 Party Edition (v2.0)
 * High-performance, zero-dependency interactive wallpaper.
 * Compatible with Lively Wallpaper & Wallpaper Engine.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. SoundFX Module (Procedural Web Audio API - Zero External Files)
     ========================================================================== */

  class SoundFXController {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.isMuted = false;
      this.isUnlocked = false;

      // Check saved mute preference
      const savedMute = localStorage.getItem('pinkie_y2k_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }

      // Unlock on first user gesture
      const unlock = () => {
        this.init();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.isUnlocked = true;
      } catch (e) {
        console.warn('Web Audio API not supported or blocked:', e);
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('pinkie_y2k_muted', this.isMuted.toString());
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
      }
      return this.isMuted;
    }

    /** Cute bubbly upward pitch-sweep sine/triangle wave (350Hz -> 780Hz, ~90ms) */
    playStickerPop() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.09);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    }

    /** Nostalgic two-tone pastel chime (587Hz D5 -> 880Hz A5) */
    playWindowSpawn(delayMs = 0) {
      if (this.isMuted || !this.ctx) return;
      setTimeout(() => {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const now = this.ctx.currentTime;
        // Tone 1: D5 (587.33 Hz)
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        osc1.start(now);
        osc1.stop(now + 0.15);

        // Tone 2: A5 (880.00 Hz)
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880.00, now + 0.06);
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.setValueAtTime(0.35, now + 0.06);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now + 0.06);
        osc2.stop(now + 0.3);
      }, delayMs);
    }

    /** Crisp mechanical retro switch click + soft downward pop (620Hz -> 310Hz) */
    playWindowClose() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;

      // Mechanical click pulse
      const oscClick = this.ctx.createOscillator();
      const gainClick = this.ctx.createGain();
      oscClick.type = 'square';
      oscClick.frequency.setValueAtTime(1400, now);
      gainClick.gain.setValueAtTime(0.2, now);
      gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      oscClick.connect(gainClick);
      gainClick.connect(this.masterGain);
      oscClick.start(now);
      oscClick.stop(now + 0.025);

      // Downward pop
      const oscPop = this.ctx.createOscillator();
      const gainPop = this.ctx.createGain();
      oscPop.type = 'sine';
      oscPop.frequency.setValueAtTime(620, now + 0.015);
      oscPop.frequency.exponentialRampToValueAtTime(310, now + 0.08);
      gainPop.gain.setValueAtTime(0.3, now + 0.015);
      gainPop.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
      oscPop.connect(gainPop);
      gainPop.connect(this.masterGain);
      oscPop.start(now + 0.015);
      oscPop.stop(now + 0.09);
    }

    /** Gentle major-triad arpeggio chime on loop reset */
    playResetSparkle() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      notes.forEach((freq, idx) => {
        const startTime = this.ctx.currentTime + idx * 0.065;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.35, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0005, startTime + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    }

    /** 1. Rainbow Dash SFX: High-speed whoosh + sonic boom sweep */
    playRainbowDashSFX() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      // High-speed whoosh
      const oscWhoosh = this.ctx.createOscillator();
      const gainWhoosh = this.ctx.createGain();
      oscWhoosh.type = 'sawtooth';
      oscWhoosh.frequency.setValueAtTime(240, now);
      oscWhoosh.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
      oscWhoosh.frequency.exponentialRampToValueAtTime(90, now + 0.75);

      gainWhoosh.gain.setValueAtTime(0, now);
      gainWhoosh.gain.linearRampToValueAtTime(0.35, now + 0.22);
      gainWhoosh.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      oscWhoosh.connect(gainWhoosh);
      gainWhoosh.connect(this.masterGain);
      oscWhoosh.start(now);
      oscWhoosh.stop(now + 0.85);

      // Low shockwave boom
      const oscBoom = this.ctx.createOscillator();
      const gainBoom = this.ctx.createGain();
      oscBoom.type = 'triangle';
      oscBoom.frequency.setValueAtTime(140, now + 0.2);
      oscBoom.frequency.exponentialRampToValueAtTime(45, now + 0.75);

      gainBoom.gain.setValueAtTime(0, now + 0.2);
      gainBoom.gain.linearRampToValueAtTime(0.45, now + 0.23);
      gainBoom.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      oscBoom.connect(gainBoom);
      gainBoom.connect(this.masterGain);
      oscBoom.start(now + 0.2);
      oscBoom.stop(now + 0.9);
    }

    /** 2. Twilight Sparkle SFX: Mystical shimmering arpeggio chord */
    playTwilightSFX() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const notes = [587.33, 739.99, 880.0, 1108.73, 1318.51, 1760.0]; // D5, F#5, A5, C#6, E6, A6 (Mystical maj9)
      notes.forEach((freq, idx) => {
        const startTime = this.ctx.currentTime + idx * 0.055;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.28, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0008, startTime + 0.55);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    }

    /** 3. Fluttershy SFX: Soft fluttery melodic harp/windchime cascade */
    playFluttershySFX() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const melody = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51]; // C5, E5, G5, B5, C6, E6
      melody.forEach((freq, idx) => {
        const startTime = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0005, startTime + 0.65);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.7);
      });
    }

    /** 4. Rarity SFX: Crystalline chime cascade with bright bell tinkles */
    playRaritySFX() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const bells = [1760.0, 2093.0, 2637.0, 3135.96, 3520.0]; // A6, C7, E7, G7, A7
      bells.forEach((freq, idx) => {
        const startTime = this.ctx.currentTime + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.22, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0003, startTime + 0.5);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    }

    /** 5. Applejack SFX: Rustic percussion pops / bouncy retro bass plucks */
    playApplejackSFX() {
      if (this.isMuted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const pops = [220, 293.66, 369.99, 440, 220]; // A3, D4, F#4, A4, A3
      pops.forEach((freq, idx) => {
        const startTime = this.ctx.currentTime + idx * 0.11;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, startTime + 0.09);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.35, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.12);
      });
    }
  }

  const soundFX = new SoundFXController();

  /* ==========================================================================
     2. Custom Retro Pixel Cursor & Sparkle Particles
     ========================================================================== */

  const cursorEl = document.getElementById('retro-cursor');
  const sparkleContainer = document.getElementById('sparkle-container');
  const rippleContainer = document.getElementById('ripple-container');

  let lastSparkleTime = 0;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    const now = performance.now();
    if (now - lastSparkleTime > 32) {
      spawnMouseSparkle(mouseX, mouseY);
      lastSparkleTime = now;
    }
  });

  function spawnMouseSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'mouse-sparkle';

    const jx = (Math.random() - 0.5) * 14;
    const jy = (Math.random() - 0.5) * 14;
    sparkle.style.left = `${x + jx}px`;
    sparkle.style.top = `${y + jy}px`;

    const size = 12 + Math.random() * 10;
    const colors = ['#FF7EB3', '#FFA8CE', '#FFFFFF', '#FFB5D3', '#FF6097', '#9C27B0', '#00D2FF'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    sparkle.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24">
        <path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" fill="${color}" />
      </svg>
    `;

    sparkleContainer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 650);
  }

  function triggerClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    rippleContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 550);
  }

  /* ==========================================================================
     3. Layer 1: Starfield Background Canvas
     ========================================================================== */

  const canvas = document.getElementById('starfield-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 42;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    initStars();
  }

  function initStars() {
    stars = [];
    const colors = ['#FFFFFF', '#FFD6E7', '#FFB5D3', '#FFA8CE', '#FFE5F1', '#E1BEE7', '#B3E5FC'];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 3 + Math.random() * 8,
        speedX: -0.2 - Math.random() * 0.4,
        speedY: 0.1 + Math.random() * 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.3 + Math.random() * 0.6,
        points: Math.random() > 0.4 ? 4 : 5
      });
    }
  }

  function drawStar(cx, cy, spikes, outerRadius, innerRadius, fill, alpha, rot) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    const step = Math.PI / spikes;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(i * step) * r;
      const y = Math.sin(i * step) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fill;
    ctx.shadowColor = 'rgba(255, 181, 211, 0.6)';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  }

  function renderStars() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.speedX;
      s.y += s.speedY;
      s.rotation += s.rotSpeed;

      if (s.x < -20) s.x = window.innerWidth + 20;
      if (s.y > window.innerHeight + 20) s.y = -20;

      const inner = s.size * 0.42;
      drawStar(s.x, s.y, s.points, s.size, inner, s.color, s.alpha, s.rotation);
    }
    requestAnimationFrame(renderStars);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  renderStars();

  /* ==========================================================================
     4. Bulletproof Fallback SVGs for Mane 6 & Cutie Marks
     ========================================================================== */

  const SVG_FALLBACKS = {
    // Original Y2K Stickers
    bone: `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path d="M 28 42 L 72 42 Q 78 42 78 48 L 78 52 Q 78 58 72 58 L 28 58 Q 22 58 22 52 L 22 48 Q 22 42 28 42 Z" fill="#FFFFFF" stroke="#2B1425" stroke-width="4.5"/>
        <circle cx="25" cy="40" r="14" fill="#FFFFFF" stroke="#2B1425" stroke-width="4.5"/>
        <circle cx="25" cy="60" r="14" fill="#FFFFFF" stroke="#2B1425" stroke-width="4.5"/>
        <circle cx="75" cy="40" r="14" fill="#FFFFFF" stroke="#2B1425" stroke-width="4.5"/>
        <circle cx="75" cy="60" r="14" fill="#FFFFFF" stroke="#2B1425" stroke-width="4.5"/>
      </svg>
    `,
    star: `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#FFE55C" stroke="#FF9D00" stroke-width="5" stroke-linejoin="round"/>
        <polygon points="48,15 58,38 82,38 62,54 70,78 48,63 26,78 34,54 14,38 38,38" fill="#FFF7A8" />
      </svg>
    `,
    swirl: `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path d="M 50 50 m 0 -5 a 5 5 0 0 1 10 5 a 10 10 0 0 1 -20 0 a 16 16 0 0 1 32 0 a 24 24 0 0 1 -48 0 a 32 32 0 0 1 64 0" fill="none" stroke="#2B1425" stroke-width="9" stroke-linecap="round"/>
        <path d="M 50 50 m 0 -5 a 5 5 0 0 1 10 5 a 10 10 0 0 1 -20 0 a 16 16 0 0 1 32 0 a 24 24 0 0 1 -48 0 a 32 32 0 0 1 64 0" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
      </svg>
    `,
    cat: `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points="24,52 30,22 50,42" fill="#FFFFFF" stroke="#2B1425" stroke-width="4.5"/>
        <polygon points="76,52 70,22 50,42" fill="#FFFFFF" stroke="#2B1425" stroke-width="4.5"/>
        <ellipse cx="50" cy="58" rx="38" ry="32" fill="#FFFFFF" stroke="#2B1425" stroke-width="4.5"/>
        <circle cx="36" cy="56" r="4.5" fill="#2B1425"/>
        <circle cx="64" cy="56" r="4.5" fill="#2B1425"/>
        <polygon points="48,62 52,62 50,65" fill="#FF739D"/>
      </svg>
    `,
    bow: `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <ellipse cx="30" cy="50" rx="20" ry="14" fill="#FF85B3" stroke="#2B1425" stroke-width="3.5" transform="rotate(-15 30 50)"/>
        <ellipse cx="70" cy="50" rx="20" ry="14" fill="#FF85B3" stroke="#2B1425" stroke-width="3.5" transform="rotate(15 70 50)"/>
        <circle cx="50" cy="50" r="10" fill="#FFA8CB" stroke="#2B1425" stroke-width="3.5"/>
      </svg>
    `,
    heart: `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path d="M 50 82 C 15 55 10 25 32 18 C 42 15 48 22 50 26 C 52 22 58 15 68 18 C 90 25 85 55 50 82 Z" fill="#FF6FA0" stroke="#2B1425" stroke-width="4.5"/>
        <path d="M 50 74 C 22 51 18 29 35 23 C 43 21 48 27 50 30 C 52 27 57 21 65 23 C 82 29 78 51 50 74 Z" fill="#FFB0CE"/>
      </svg>
    `,

    // Cutie Mark Stickers
    'cm-pinkie': `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <!-- 3 Balloons: 2 Blue, 1 Yellow -->
        <ellipse cx="38" cy="40" rx="14" ry="18" fill="#40C4FF" stroke="#0091EA" stroke-width="2.5"/>
        <ellipse cx="62" cy="40" rx="14" ry="18" fill="#40C4FF" stroke="#0091EA" stroke-width="2.5"/>
        <ellipse cx="50" cy="56" rx="14" ry="18" fill="#FFEB3B" stroke="#FBC02D" stroke-width="2.5"/>
        <path d="M 38 58 Q 36 74 44 86" fill="none" stroke="#607D8B" stroke-width="2" stroke-linecap="round"/>
        <path d="M 62 58 Q 64 74 56 86" fill="none" stroke="#607D8B" stroke-width="2" stroke-linecap="round"/>
        <path d="M 50 74 Q 48 82 52 90" fill="none" stroke="#607D8B" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
    'cm-twilight': `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <!-- 6-pointed Magenta Star + 5 White Sparkles -->
        <polygon points="50,15 57,38 78,35 64,52 75,70 50,60 25,70 36,52 22,35 43,38" fill="#E91E63" stroke="#880E4F" stroke-width="2.5"/>
        <polygon points="50,22 55,39 70,37 60,49 68,64 50,56 32,64 40,49 30,37 45,39" fill="#FF4081"/>
        <circle cx="22" cy="24" r="3.5" fill="#FFFFFF"/>
        <circle cx="78" cy="24" r="3.5" fill="#FFFFFF"/>
        <circle cx="18" cy="74" r="3" fill="#FFFFFF"/>
        <circle cx="82" cy="74" r="3" fill="#FFFFFF"/>
        <circle cx="50" cy="85" r="3.5" fill="#FFFFFF"/>
      </svg>
    `,
    'cm-rainbow': `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <!-- Cloud + Lightning Bolt -->
        <path d="M 28 50 A 14 14 0 0 1 54 36 A 16 16 0 0 1 76 48 A 12 12 0 0 1 72 64 L 28 64 A 12 12 0 0 1 28 50 Z" fill="#FFFFFF" stroke="#B0BEC5" stroke-width="2.5"/>
        <polygon points="46,58 36,74 48,74 40,94 62,70 50,70" fill="#FF1744" stroke="#D50000" stroke-width="1.5"/>
        <polygon points="49,58 40,73 50,73 44,90 60,71 52,71" fill="#FFEA00"/>
        <polygon points="52,58 44,72 52,72 48,86 58,72 54,72" fill="#00B0FF"/>
      </svg>
    `,
    'cm-fluttershy': `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <!-- 3 Pink Butterflies with Cyan bodies -->
        <g transform="translate(25, 30)">
          <ellipse cx="-8" cy="-5" rx="8" ry="6" fill="#FF80AB" stroke="#C51162" stroke-width="1.2" transform="rotate(-30)"/>
          <ellipse cx="8" cy="-5" rx="8" ry="6" fill="#FF80AB" stroke="#C51162" stroke-width="1.2" transform="rotate(30)"/>
          <ellipse cx="0" cy="0" rx="2.5" ry="8" fill="#00E5FF"/>
        </g>
        <g transform="translate(70, 35)">
          <ellipse cx="-8" cy="-5" rx="8" ry="6" fill="#FF80AB" stroke="#C51162" stroke-width="1.2" transform="rotate(-30)"/>
          <ellipse cx="8" cy="-5" rx="8" ry="6" fill="#FF80AB" stroke="#C51162" stroke-width="1.2" transform="rotate(30)"/>
          <ellipse cx="0" cy="0" rx="2.5" ry="8" fill="#00E5FF"/>
        </g>
        <g transform="translate(48, 65)">
          <ellipse cx="-9" cy="-6" rx="9" ry="7" fill="#FF80AB" stroke="#C51162" stroke-width="1.2" transform="rotate(-30)"/>
          <ellipse cx="9" cy="-6" rx="9" ry="7" fill="#FF80AB" stroke="#C51162" stroke-width="1.2" transform="rotate(30)"/>
          <ellipse cx="0" cy="0" rx="3" ry="9" fill="#00E5FF"/>
        </g>
      </svg>
    `,
    'cm-rarity': `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <!-- 3 Sparkling Blue Diamonds -->
        <polygon points="50,18 64,36 50,54 36,36" fill="#00E5FF" stroke="#0091EA" stroke-width="2.5"/>
        <polygon points="50,22 60,36 50,50 40,36" fill="#E0F7FA"/>
        <polygon points="30,46 42,60 30,74 18,60" fill="#00B0FF" stroke="#0091EA" stroke-width="2.5"/>
        <polygon points="30,50 38,60 30,70 22,60" fill="#E0F7FA"/>
        <polygon points="70,46 82,60 70,74 58,60" fill="#00B0FF" stroke="#0091EA" stroke-width="2.5"/>
        <polygon points="70,50 78,60 70,70 62,60" fill="#E0F7FA"/>
      </svg>
    `,
    'cm-applejack': `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <!-- 3 Red Apples with green leaves -->
        <g transform="translate(50, 36)">
          <circle cx="-6" cy="0" r="10" fill="#FF1744"/>
          <circle cx="6" cy="0" r="10" fill="#FF1744"/>
          <path d="M 0 -8 Q 4 -16 10 -14" fill="none" stroke="#5D4037" stroke-width="2.5"/>
          <ellipse cx="8" cy="-14" rx="4" ry="2" fill="#76FF03" transform="rotate(-20)"/>
        </g>
        <g transform="translate(32, 64)">
          <circle cx="-5" cy="0" r="9" fill="#FF1744"/>
          <circle cx="5" cy="0" r="9" fill="#FF1744"/>
          <path d="M 0 -7 Q 4 -14 8 -12" fill="none" stroke="#5D4037" stroke-width="2"/>
          <ellipse cx="6" cy="-12" rx="3.5" ry="1.8" fill="#76FF03" transform="rotate(-20)"/>
        </g>
        <g transform="translate(68, 64)">
          <circle cx="-5" cy="0" r="9" fill="#FF1744"/>
          <circle cx="5" cy="0" r="9" fill="#FF1744"/>
          <path d="M 0 -7 Q 4 -14 8 -12" fill="none" stroke="#5D4037" stroke-width="2"/>
          <ellipse cx="6" cy="-12" rx="3.5" ry="1.8" fill="#76FF03" transform="rotate(-20)"/>
        </g>
      </svg>
    `,

    // Mane 6 Guest Cameo Bust Fallbacks
    twilight: `
      <svg viewBox="0 0 200 240" width="100%" height="100%">
        <ellipse cx="100" cy="140" rx="65" ry="60" fill="#D7BDE2" stroke="#8E44AD" stroke-width="4"/>
        <polygon points="100,80 90,20 110,20" fill="#D7BDE2" stroke="#8E44AD" stroke-width="3"/>
        <path d="M 50 110 Q 100 70 150 110" fill="#2C3E50"/>
        <rect x="75" y="80" width="15" height="40" fill="#E91E63"/>
        <ellipse cx="78" cy="140" rx="16" ry="22" fill="#6C3483"/>
        <ellipse cx="122" cy="140" rx="16" ry="22" fill="#6C3483"/>
        <circle cx="74" cy="134" r="5" fill="#FFFFFF"/>
        <circle cx="118" cy="134" r="5" fill="#FFFFFF"/>
      </svg>
    `,
    rainbow: `
      <svg viewBox="0 0 200 240" width="100%" height="100%">
        <ellipse cx="100" cy="140" rx="65" ry="60" fill="#A9CCE3" stroke="#2980B9" stroke-width="4"/>
        <path d="M 40 100 Q 100 50 160 80" fill="#E74C3C"/>
        <path d="M 45 110 Q 100 65 155 90" fill="#F39C12"/>
        <path d="M 50 120 Q 100 80 150 100" fill="#F1C40F"/>
        <ellipse cx="80" cy="140" rx="16" ry="22" fill="#C0392B"/>
        <ellipse cx="120" cy="140" rx="16" ry="22" fill="#C0392B"/>
        <circle cx="76" cy="134" r="5" fill="#FFFFFF"/>
        <circle cx="116" cy="134" r="5" fill="#FFFFFF"/>
      </svg>
    `,
    fluttershy: `
      <svg viewBox="0 0 200 240" width="100%" height="100%">
        <ellipse cx="100" cy="140" rx="65" ry="60" fill="#FCF3CF" stroke="#F1C40F" stroke-width="4"/>
        <path d="M 45 90 Q 60 170 40 220 Q 100 80 155 95" fill="#FADBD8" stroke="#F1948A" stroke-width="3"/>
        <ellipse cx="80" cy="145" rx="15" ry="20" fill="#16A085"/>
        <ellipse cx="120" cy="145" rx="15" ry="20" fill="#16A085"/>
        <circle cx="76" cy="139" r="4.5" fill="#FFFFFF"/>
        <circle cx="116" cy="139" r="4.5" fill="#FFFFFF"/>
      </svg>
    `,
    rarity: `
      <svg viewBox="0 0 200 240" width="100%" height="100%">
        <ellipse cx="100" cy="140" rx="65" ry="60" fill="#FFFFFF" stroke="#BDC3C7" stroke-width="4"/>
        <polygon points="100,80 93,25 107,25" fill="#FFFFFF" stroke="#BDC3C7" stroke-width="3"/>
        <path d="M 45 100 Q 100 40 160 70 Q 170 120 150 160" fill="#5B2C6F"/>
        <ellipse cx="80" cy="140" rx="16" ry="22" fill="#2471A3"/>
        <ellipse cx="120" cy="140" rx="16" ry="22" fill="#2471A3"/>
        <circle cx="76" cy="134" r="5" fill="#FFFFFF"/>
        <circle cx="116" cy="134" r="5" fill="#FFFFFF"/>
      </svg>
    `,
    applejack: `
      <svg viewBox="0 0 200 240" width="100%" height="100%">
        <!-- Cowboy Hat -->
        <ellipse cx="100" cy="65" rx="80" ry="25" fill="#B9770E"/>
        <path d="M 65 65 Q 100 20 135 65 Z" fill="#935116"/>
        <ellipse cx="100" cy="145" rx="65" ry="60" fill="#FAD7A0" stroke="#E67E22" stroke-width="4"/>
        <path d="M 60 100 Q 100 120 140 95" fill="#F9E79F"/>
        <ellipse cx="80" cy="145" rx="16" ry="22" fill="#27AE60"/>
        <ellipse cx="120" cy="145" rx="16" ry="22" fill="#27AE60"/>
        <circle cx="76" cy="139" r="5" fill="#FFFFFF"/>
        <circle cx="116" cy="139" r="5" fill="#FFFFFF"/>
      </svg>
    `
  };

  // Sticker rotation includes all 12: 6 Y2K icons + 6 Mane 6 Cutie Marks
  const STICKER_CONFIGS = [
    { type: 'bone', file: 'assets/sticker-bone.png' },
    { type: 'cm-pinkie', file: 'assets/cm-pinkie.png' },
    { type: 'star', file: 'assets/sticker-star.png' },
    { type: 'cm-twilight', file: 'assets/cm-twilight.png' },
    { type: 'swirl', file: 'assets/sticker-swirl.png' },
    { type: 'cm-rainbow', file: 'assets/cm-rainbow.png' },
    { type: 'cat', file: 'assets/sticker-cat.png' },
    { type: 'cm-fluttershy', file: 'assets/cm-fluttershy.png' },
    { type: 'bow', file: 'assets/sticker-bow.png' },
    { type: 'cm-rarity', file: 'assets/cm-rarity.png' },
    { type: 'heart', file: 'assets/sticker-heart.png' },
    { type: 'cm-applejack', file: 'assets/cm-applejack.png' }
  ];

  /* ==========================================================================
     5. Pinkie Pie Character & Bulletproof Image Fallback
     ========================================================================== */

  const pinkieCharacter = document.getElementById('pinkie-character');
  const pinkieIdleImg = document.getElementById('pinkie-idle-img');
  const pinkieBlinkImg = document.getElementById('pinkie-blink-img');
  const pinkieSvgFallback = document.getElementById('pinkie-svg-fallback');
  const stickerSurface = document.getElementById('sticker-surface');

  let useSvgFallback = false;
  let blinkTimeout = null;

  pinkieIdleImg.addEventListener('error', () => {
    activateSvgFallback();
  });

  pinkieBlinkImg.addEventListener('error', () => {
    // Handled gracefully via CSS
  });

  function activateSvgFallback() {
    useSvgFallback = true;
    pinkieIdleImg.style.display = 'none';
    pinkieBlinkImg.style.display = 'none';
    pinkieSvgFallback.style.display = 'flex';
  }

  function triggerPinkieReaction() {
    pinkieCharacter.classList.remove('pinkie-squish');
    void pinkieCharacter.offsetWidth;
    pinkieCharacter.classList.add('pinkie-squish');

    pinkieCharacter.classList.add('is-blinking');

    if (useSvgFallback) {
      const normalEyes = document.getElementById('svg-normal-eyes');
      const closedEyes = document.getElementById('svg-closed-eyes');
      if (normalEyes && closedEyes) {
        normalEyes.style.display = 'none';
        closedEyes.style.display = 'block';
      }
    }

    clearTimeout(blinkTimeout);
    blinkTimeout = setTimeout(() => {
      pinkieCharacter.classList.remove('is-blinking');
      if (useSvgFallback) {
        const normalEyes = document.getElementById('svg-normal-eyes');
        const closedEyes = document.getElementById('svg-closed-eyes');
        if (normalEyes && closedEyes) {
          normalEyes.style.display = 'block';
          closedEyes.style.display = 'none';
        }
      }
    }, 420);
  }

  /* ==========================================================================
     6. Layer 3: Interactive Sticker Slapping
     ========================================================================== */

  let stickerCycleIndex = 0;
  let currentStickerCount = 0;
  const placedStickers = [];
  let isCascadeActive = false;

  stickerSurface.addEventListener('pointerdown', (e) => {
    if (isCascadeActive) return;

    soundFX.init();

    const rect = stickerSurface.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pctX = (clickX / rect.width) * 100;
    const pctY = (clickY / rect.height) * 100;

    triggerClickRipple(e.clientX, e.clientY);
    triggerPinkieReaction();
    soundFX.playStickerPop();

    slapSticker(pctX, pctY);
  });

  function slapSticker(pctX, pctY) {
    const config = STICKER_CONFIGS[stickerCycleIndex % STICKER_CONFIGS.length];
    stickerCycleIndex++;
    currentStickerCount++;

    const rotation = (Math.random() - 0.5) * 44;
    const stickerData = {
      type: config.type,
      file: config.file,
      pctX,
      pctY,
      rotation
    };
    placedStickers.push(stickerData);

    const el = document.createElement('div');
    el.className = 'slapped-sticker';
    el.style.left = `${pctX}%`;
    el.style.top = `${pctY}%`;
    el.style.setProperty('--rot', `${rotation}deg`);

    const img = document.createElement('img');
    img.src = config.file;
    img.alt = config.type;
    img.draggable = false;
    img.onerror = () => {
      el.innerHTML = SVG_FALLBACKS[config.type] || '';
    };
    el.appendChild(img);

    stickerSurface.appendChild(el);

    // Check if 7 stickers placed -> Trigger Randomized Draggable Cascade Popups!
    if (currentStickerCount === 7) {
      isCascadeActive = true;
      setTimeout(() => {
        triggerRetroWindowCascade();
      }, 350);
    }
  }

  /* ==========================================================================
     7. Layer 4: Randomized & Draggable Retro Pop-up Windows
     ========================================================================== */

  const windowOverlay = document.getElementById('window-overlay');
  let openWindows = [];
  let highestZIndex = 510;

  const MANE_6_CAMEOS = [
    {
      id: 'twilight',
      name: 'Twilight Sparkle',
      icon: '🔮',
      title: '🔮 · Twilight_Library.sys',
      themeClass: 'titlebar-twilight',
      file: 'assets/twilight.png',
      decor: 'magic-star'
    },
    {
      id: 'rainbow',
      name: 'Rainbow Dash',
      icon: '⚡',
      title: '⚡ · Sonic_Rainboom.avi',
      themeClass: 'titlebar-rainbow',
      file: 'assets/rainbow.png',
      decor: 'lightning'
    },
    {
      id: 'fluttershy',
      name: 'Fluttershy',
      icon: '🌸',
      title: '🌸 · Kindness_Vibes.exe',
      themeClass: 'titlebar-fluttershy',
      file: 'assets/fluttershy.png',
      decor: 'butterfly'
    },
    {
      id: 'rarity',
      name: 'Rarity',
      icon: '💎',
      title: '💎 · Fabulous_Design.exe',
      themeClass: 'titlebar-rarity',
      file: 'assets/rarity.png',
      decor: 'diamond'
    },
    {
      id: 'applejack',
      name: 'Applejack',
      icon: '🍎',
      title: '🍎 · Sweet_Apple_Acres.exe',
      themeClass: 'titlebar-applejack',
      file: 'assets/applejack.png',
      decor: 'apple'
    }
  ];

  const FUN_ALERTS = [
    {
      icon: '⚠️',
      msg: 'Error 404: Too Much Sugar in the Party Cannon!',
      title: 'Sugar_Overflow.dll'
    },
    {
      icon: '🎉',
      msg: 'Party_Cannon.exe is 100% Loaded & Ready to Fire!',
      title: 'Party_Cannon.exe'
    },
    {
      icon: '💖',
      msg: 'Friendship_Level_MAX.dll successfully installed!',
      title: 'Friendship_Core.sys'
    },
    {
      icon: '🧁',
      msg: 'Warning: Extreme Cuteness Overload detected in Ponyville!',
      title: 'Cuteness_Alert.bmp'
    },
    {
      icon: '🍬',
      msg: 'Notice: Cupcake inventory running critically high!',
      title: 'Cupcake_Storage.dat'
    }
  ];

  function triggerRetroWindowCascade(forcedCount = null) {
    windowOverlay.innerHTML = '';
    openWindows = [];

    // Random count of 3 to 6 pop-up windows
    const count = forcedCount || (Math.floor(Math.random() * 4) + 3);

    // Guaranteed to include at least 1 Pinkie Zoom Cam and 1 Cameo
    const windowTypes = [];
    windowTypes.push('pinkie');
    windowTypes.push('cameo');
    if (count >= 3) windowTypes.push('alert');
    while (windowTypes.length < count) {
      const r = Math.random();
      if (r < 0.4) windowTypes.push('cameo');
      else if (r < 0.75) windowTypes.push('pinkie');
      else windowTypes.push('alert');
    }

    // Shuffle types slightly
    windowTypes.sort(() => Math.random() - 0.5);

    windowTypes.forEach((type, index) => {
      const delay = index * 120;
      setTimeout(() => {
        // Safe randomized coordinates (X: 10%..62%, Y: 12%..52%)
        const baseLeft = 12 + (index * 9) + (Math.random() - 0.5) * 8;
        const baseTop = 14 + (index * 8) + (Math.random() - 0.5) * 8;
        const safeLeft = Math.max(8, Math.min(65, baseLeft));
        const safeTop = Math.max(10, Math.min(54, baseTop));

        const win = createRetroWindow(type, safeLeft, safeTop);
        windowOverlay.appendChild(win);
        openWindows.push(win);

        soundFX.playWindowSpawn();

        requestAnimationFrame(() => {
          win.classList.add('is-open');
        });
      }, delay);
    });
  }

  function createRetroWindow(type, leftPct, topPct) {
    const win = document.createElement('div');
    win.className = 'retro-window';
    win.style.left = `${leftPct}%`;
    win.style.top = `${topPct}%`;
    highestZIndex++;
    win.style.zIndex = highestZIndex;

    if (type === 'alert') {
      setupAlertWindow(win);
    } else if (type === 'cameo') {
      setupCameoWindow(win);
    } else {
      setupPinkieZoomWindow(win);
    }

    // Attach draggable AFTER title bar has been added to the DOM
    makeWindowDraggable(win);

    return win;
  }

  function setupPinkieZoomWindow(win) {
    const titles = ['📷 · 🎀 PinkieCam_01.exe', '✨ · 💖 SuperParty.dll', '🎬 · 🎀 Y2K_StickerMania.avi', '🎨 · 🧁 Pinkie_Vision.bmp'];
    const titleStr = titles[Math.floor(Math.random() * titles.length)];

    const titleBar = createTitleBar(titleStr, 'titlebar-pinkie', win);
    win.appendChild(titleBar);

    const winBody = document.createElement('div');
    winBody.className = 'retro-window-body';

    // Synchronized zoomed-in close-up of Pinkie Pie's upper face & blue eyes
    const closeupImg = document.createElement('img');
    closeupImg.className = 'popup-pinkie-closeup';
    closeupImg.src = 'assets/pinkie-idle.png';
    closeupImg.alt = 'Pinkie Pie Closeup';
    closeupImg.draggable = false;
    closeupImg.onerror = () => {
      closeupImg.style.display = 'none';
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'popup-pinkie-closeup';
      fallbackDiv.innerHTML = SVG_FALLBACKS.cat;
      winBody.appendChild(fallbackDiv);
    };
    winBody.appendChild(closeupImg);

    // Replicate placed stickers in window viewport
    const stickerLayer = document.createElement('div');
    stickerLayer.className = 'popup-sticker-layer';
    placedStickers.forEach((st) => {
      const item = document.createElement('div');
      item.className = 'popup-sticker-item';
      const mappedX = ((st.pctX - 50) * 2.1) + 50;
      const mappedY = ((st.pctY - 48) * 2.1) + 50;
      item.style.left = `${Math.max(8, Math.min(92, mappedX))}%`;
      item.style.top = `${Math.max(8, Math.min(92, mappedY))}%`;
      item.style.transform = `translate(-50%, -50%) rotate(${st.rotation}deg) scale(0.9)`;

      const stImg = document.createElement('img');
      stImg.src = st.file;
      stImg.alt = st.type;
      stImg.onerror = () => {
        item.innerHTML = SVG_FALLBACKS[st.type] || '';
      };
      item.appendChild(stImg);
      stickerLayer.appendChild(item);
    });
    winBody.appendChild(stickerLayer);

    // Floating Retro Hearts
    addFloatingHearts(winBody);

    const scanlines = document.createElement('div');
    scanlines.className = 'retro-scanlines';
    winBody.appendChild(scanlines);

    win.appendChild(winBody);
  }

  function setupCameoWindow(win) {
    const cameo = MANE_6_CAMEOS[Math.floor(Math.random() * MANE_6_CAMEOS.length)];

    const titleBar = createTitleBar(cameo.title, cameo.themeClass, win);
    win.appendChild(titleBar);

    const winBody = document.createElement('div');
    winBody.className = 'retro-window-body';

    // Guest Pony Bust
    const guestImg = document.createElement('img');
    guestImg.className = 'popup-guest-pony';
    guestImg.src = cameo.file;
    guestImg.alt = cameo.name;
    guestImg.draggable = false;
    guestImg.onerror = () => {
      guestImg.style.display = 'none';
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'popup-guest-pony';
      fallbackDiv.innerHTML = SVG_FALLBACKS[cameo.id] || '';
      winBody.appendChild(fallbackDiv);
    };
    winBody.appendChild(guestImg);

    // Floating themed decorative item
    const decor = document.createElement('div');
    decor.className = 'popup-guest-theme-item';
    decor.style.top = '12%';
    decor.style.right = '12%';
    if (cameo.id === 'twilight') decor.innerHTML = SVG_FALLBACKS['cm-twilight'];
    else if (cameo.id === 'rainbow') decor.innerHTML = SVG_FALLBACKS['cm-rainbow'];
    else if (cameo.id === 'fluttershy') decor.innerHTML = SVG_FALLBACKS['cm-fluttershy'];
    else if (cameo.id === 'rarity') decor.innerHTML = SVG_FALLBACKS['cm-rarity'];
    else decor.innerHTML = SVG_FALLBACKS['cm-applejack'];
    winBody.appendChild(decor);

    // Floating hearts
    addFloatingHearts(winBody);

    const scanlines = document.createElement('div');
    scanlines.className = 'retro-scanlines';
    winBody.appendChild(scanlines);

    win.appendChild(winBody);
  }

  function setupAlertWindow(win) {
    win.classList.add('window-alert');
    const alertData = FUN_ALERTS[Math.floor(Math.random() * FUN_ALERTS.length)];

    const titleBar = createTitleBar(`⚠️ ${alertData.title}`, 'titlebar-alert', win);
    win.appendChild(titleBar);

    const alertBody = document.createElement('div');
    alertBody.className = 'retro-alert-body';

    const content = document.createElement('div');
    content.className = 'retro-alert-content';
    content.innerHTML = `
      <div class="retro-alert-icon">${alertData.icon}</div>
      <div class="retro-alert-msg">${alertData.msg}</div>
    `;
    alertBody.appendChild(content);

    const yayBtn = document.createElement('button');
    yayBtn.className = 'retro-alert-btn';
    yayBtn.textContent = 'Yay!';
    yayBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      closeRetroWindow(win);
    });
    alertBody.appendChild(yayBtn);

    win.appendChild(alertBody);
  }

  function createTitleBar(titleText, themeClass, win) {
    const titleBar = document.createElement('div');
    titleBar.className = `retro-window-titlebar ${themeClass}`;

    const textSpan = document.createElement('div');
    textSpan.className = 'retro-title-text';
    textSpan.textContent = titleText;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'retro-close-btn';
    closeBtn.setAttribute('title', 'Close Window');
    closeBtn.setAttribute('aria-label', 'Close Window');
    closeBtn.innerHTML = '✕';

    closeBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      closeRetroWindow(win);
    });

    titleBar.appendChild(textSpan);
    titleBar.appendChild(closeBtn);
    return titleBar;
  }

  function addFloatingHearts(container) {
    const h1 = document.createElement('div');
    h1.className = 'popup-floating-heart';
    h1.style.top = '12%';
    h1.style.left = '10%';
    h1.innerHTML = SVG_FALLBACKS.heart;
    container.appendChild(h1);

    const h2 = document.createElement('div');
    h2.className = 'popup-floating-heart';
    h2.style.bottom = '14%';
    h2.style.right = '12%';
    h2.style.animationDelay = '-1.3s';
    h2.innerHTML = SVG_FALLBACKS.heart;
    container.appendChild(h2);
  }

  /** Make any retro window draggable by its title bar */
  function makeWindowDraggable(win) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initLeft = 0;
    let initTop = 0;

    const titleBar = win.querySelector('.retro-window-titlebar') || win;

    const onPointerDown = (e) => {
      // Don't drag if clicking close button
      if (e.target.closest('.retro-close-btn') || e.target.closest('.retro-alert-btn')) return;

      soundFX.init();

      isDragging = true;
      win.classList.add('is-dragging');
      highestZIndex++;
      win.style.zIndex = highestZIndex;

      const rect = win.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      initLeft = rect.left;
      initTop = rect.top;

      // Lock to absolute pixel position
      win.style.left = `${initLeft}px`;
      win.style.top = `${initTop}px`;

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newLeft = initLeft + dx;
      let newTop = initTop + dy;

      // Clamp within safe viewport bounds
      const winW = win.offsetWidth || 300;
      const winH = win.offsetHeight || 240;
      newLeft = Math.max(10, Math.min(window.innerWidth - winW - 10, newLeft));
      newTop = Math.max(10, Math.min(window.innerHeight - winH - 10, newTop));

      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      win.classList.remove('is-dragging');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    titleBar.addEventListener('pointerdown', onPointerDown);
  }

  function closeRetroWindow(win) {
    soundFX.playWindowClose();

    win.classList.remove('is-open');
    win.classList.add('is-closing');

    openWindows = openWindows.filter((w) => w !== win);

    setTimeout(() => {
      win.remove();

      if (openWindows.length === 0) {
        completeLoopReset();
      }
    }, 240);
  }

  /* ==========================================================================
     8. Loop Reset & Mane 6 Signature Screen Effects
     ========================================================================== */

  const resetBurstContainer = document.getElementById('reset-burst-container');
  const signatureEffectsContainer = document.getElementById('signature-effects-container');

  function completeLoopReset() {
    soundFX.playResetSparkle();

    // 1. Randomly trigger one of 5 Mane 6 Signature Screen Effects!
    triggerRandomSignatureEffect();

    // 2. Trigger celebration sparkle & heart particle burst
    triggerCelebrationBurst();

    // 3. Clear all slapped stickers with smooth exit
    const allStickers = stickerSurface.querySelectorAll('.slapped-sticker');
    allStickers.forEach((st, idx) => {
      setTimeout(() => {
        st.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        st.style.transform = `${st.style.transform} scale(0)`;
        st.style.opacity = '0';
        setTimeout(() => st.remove(), 300);
      }, idx * 25);
    });

    placedStickers.length = 0;
    currentStickerCount = 0;
    isCascadeActive = false;

    // 4. Pinkie joyful bounce
    triggerPinkieReaction();
  }

  function triggerRandomSignatureEffect() {
    const effects = ['rainbow', 'twilight', 'fluttershy', 'rarity', 'applejack'];
    const chosen = effects[Math.floor(Math.random() * effects.length)];
    executeSignatureEffect(chosen);
  }

  function executeSignatureEffect(name) {
    signatureEffectsContainer.innerHTML = '';

    if (name === 'rainbow') {
      // 1. Rainbow Dash: High-speed rainbow streak + screen shockwave pulse
      soundFX.playRainbowDashSFX();

      const streak = document.createElement('div');
      streak.className = 'rd-rainbow-streak';
      signatureEffectsContainer.appendChild(streak);

      const shockwave = document.createElement('div');
      shockwave.className = 'rd-shockwave';
      signatureEffectsContainer.appendChild(shockwave);

      setTimeout(() => signatureEffectsContainer.innerHTML = '', 950);

    } else if (name === 'twilight') {
      // 2. Twilight Sparkle: Magic Star Ring Burst
      soundFX.playTwilightSFX();

      const glow = document.createElement('div');
      glow.className = 'twi-aura-glow';
      signatureEffectsContainer.appendChild(glow);

      const ring = document.createElement('div');
      ring.className = 'twi-magic-ring';

      const starCount = 14;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'twi-orbit-star';

        const angle = (i / starCount) * Math.PI * 2;
        const dist = 220 + Math.random() * 260;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const rot = (Math.random() - 0.5) * 720;

        star.style.setProperty('--tx', `${tx}px`);
        star.style.setProperty('--ty', `${ty}px`);
        star.style.setProperty('--rot', `${rot}deg`);

        const sz = 32 + Math.random() * 20;
        star.innerHTML = `
          <svg width="${sz}" height="${sz}" viewBox="0 0 100 100">
            <polygon points="50,10 60,35 85,35 65,52 75,75 50,60 25,75 35,52 15,35 40,35" fill="#E91E63" stroke="#FFFFFF" stroke-width="3"/>
          </svg>
        `;
        ring.appendChild(star);
      }
      signatureEffectsContainer.appendChild(ring);
      setTimeout(() => signatureEffectsContainer.innerHTML = '', 1300);

    } else if (name === 'fluttershy') {
      // 3. Fluttershy: Gentle flock of butterflies fluttering upward
      soundFX.playFluttershySFX();

      const butterflyCount = 18;
      const butterflyColors = ['#FF80AB', '#FFE082', '#80DEEA', '#F48FB1'];

      for (let i = 0; i < butterflyCount; i++) {
        const bf = document.createElement('div');
        bf.className = 'fs-butterfly';

        const sx = Math.random() * window.innerWidth;
        const sy = window.innerHeight * (0.65 + Math.random() * 0.35);
        const ex = sx + (Math.random() - 0.5) * 350;
        const ey = -80;

        const dur = 2.2 + Math.random() * 1.2;
        const scale = 0.8 + Math.random() * 0.7;
        const rot = (Math.random() - 0.5) * 40;

        bf.style.setProperty('--sx', `${sx}px`);
        bf.style.setProperty('--sy', `${sy}px`);
        bf.style.setProperty('--ex', `${ex}px`);
        bf.style.setProperty('--ey', `${ey}px`);
        bf.style.setProperty('--duration', `${dur}s`);
        bf.style.setProperty('--sc', `${scale}`);
        bf.style.setProperty('--base-rot', `${rot}deg`);

        const color = butterflyColors[i % butterflyColors.length];
        bf.innerHTML = `
          <div class="fs-wing-flap">
            <svg width="42" height="42" viewBox="0 0 100 100">
              <ellipse cx="32" cy="40" rx="20" ry="16" fill="${color}" stroke="#FFFFFF" stroke-width="3" transform="rotate(-25 32 40)"/>
              <ellipse cx="68" cy="40" rx="20" ry="16" fill="${color}" stroke="#FFFFFF" stroke-width="3" transform="rotate(25 68 40)"/>
              <ellipse cx="38" cy="62" rx="14" ry="12" fill="${color}" stroke="#FFFFFF" stroke-width="2.5" transform="rotate(-15 38 62)"/>
              <ellipse cx="62" cy="62" rx="14" ry="12" fill="${color}" stroke="#FFFFFF" stroke-width="2.5" transform="rotate(15 62 62)"/>
              <ellipse cx="50" cy="50" rx="5" ry="22" fill="#00E5FF"/>
            </svg>
          </div>
        `;
        signatureEffectsContainer.appendChild(bf);
      }
      setTimeout(() => signatureEffectsContainer.innerHTML = '', 3500);

    } else if (name === 'rarity') {
      // 4. Rarity: Sparkling diamond & crystal shower
      soundFX.playRaritySFX();

      const gemCount = 24;
      for (let i = 0; i < gemCount; i++) {
        const dia = document.createElement('div');
        dia.className = 'rarity-diamond';

        const dx = Math.random() * window.innerWidth;
        const drift = (Math.random() - 0.5) * 120;
        const dur = 1.4 + Math.random() * 1.0;
        const scale = 0.7 + Math.random() * 0.7;
        const drot = (Math.random() - 0.5) * 720;

        dia.style.setProperty('--dx', `${dx}px`);
        dia.style.setProperty('--drift', `${drift}px`);
        dia.style.setProperty('--fall-dur', `${dur}s`);
        dia.style.setProperty('--ds', `${scale}`);
        dia.style.setProperty('--drot', `${drot}deg`);

        dia.innerHTML = `
          <svg width="44" height="44" viewBox="0 0 100 100">
            <polygon points="50,15 72,38 50,62 28,38" fill="#00E5FF" stroke="#FFFFFF" stroke-width="3"/>
            <polygon points="50,22 66,38 50,54 34,38" fill="#E0F7FA"/>
          </svg>
        `;
        signatureEffectsContainer.appendChild(dia);
      }
      setTimeout(() => signatureEffectsContainer.innerHTML = '', 2600);

    } else {
      // 5. Applejack: Bouncing golden & red apples
      soundFX.playApplejackSFX();

      const appleCount = 8;
      for (let i = 0; i < appleCount; i++) {
        const apple = document.createElement('div');
        apple.className = 'aj-bouncing-apple';

        const ax = (window.innerWidth / (appleCount + 1)) * (i + 0.5) - 60;
        const dur = 1.4 + (i % 3) * 0.2;
        const isGolden = i % 3 === 0;
        const fillColor = isGolden ? '#FFD600' : '#FF1744';

        apple.style.setProperty('--ax', `${ax}px`);
        apple.style.setProperty('--bounce-dur', `${dur}s`);

        apple.innerHTML = `
          <svg width="56" height="56" viewBox="0 0 100 100">
            <circle cx="44" cy="54" r="26" fill="${fillColor}" stroke="#3E2723" stroke-width="3"/>
            <circle cx="56" cy="54" r="26" fill="${fillColor}" stroke="#3E2723" stroke-width="3"/>
            <path d="M 50 32 Q 54 20 62 22" fill="none" stroke="#5D4037" stroke-width="4.5"/>
            <ellipse cx="62" cy="22" rx="7" ry="3.5" fill="#76FF03" transform="rotate(-25 62 22)"/>
          </svg>
        `;
        signatureEffectsContainer.appendChild(apple);
      }
      setTimeout(() => signatureEffectsContainer.innerHTML = '', 2200);
    }
  }

  function triggerCelebrationBurst() {
    resetBurstContainer.innerHTML = '';
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.6;
    const count = 36;
    const colors = ['#FF7EB3', '#FFA8CE', '#FFFFFF', '#FFB5D3', '#FFE55C', '#FF6097', '#9C27B0', '#00D2FF'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'burst-particle';
      particle.style.left = `${cx}px`;
      particle.style.top = `${cy}px`;

      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const distance = 160 + Math.random() * 320;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = (Math.random() - 0.5) * 540;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.setProperty('--rot', `${rot}deg`);

      const size = 16 + Math.random() * 18;
      const color = colors[i % colors.length];

      if (i % 2 === 0) {
        particle.innerHTML = `
          <svg width="${size}" height="${size}" viewBox="0 0 24 24">
            <path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" fill="${color}" />
          </svg>
        `;
      } else {
        particle.innerHTML = `
          <svg width="${size}" height="${size}" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="${color}"/>
          </svg>
        `;
      }

      resetBurstContainer.appendChild(particle);
    }

    setTimeout(() => {
      resetBurstContainer.innerHTML = '';
    }, 1200);
  }

  /* ==========================================================================
     9. Minimalist Live Wallpaper UI Controls
     ========================================================================== */

  const btnPartyGuest = document.getElementById('btn-party-guest');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const iconSoundOff = document.getElementById('icon-sound-off');
  const btnManualReset = document.getElementById('btn-manual-reset');

  function updateMuteIcons(muted) {
    if (muted) {
      iconSoundOn.style.display = 'none';
      iconSoundOff.style.display = 'block';
    } else {
      iconSoundOn.style.display = 'block';
      iconSoundOff.style.display = 'none';
    }
  }

  updateMuteIcons(soundFX.isMuted);

  // Party Guest Button
  btnPartyGuest.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    soundFX.init();
    triggerPinkieReaction();

    // Trigger random signature effect + spawn a surprise guest cameo window
    triggerRandomSignatureEffect();

    const safeLeft = 20 + Math.random() * 45;
    const safeTop = 16 + Math.random() * 35;
    const win = createRetroWindow('cameo', safeLeft, safeTop);
    windowOverlay.appendChild(win);
    openWindows.push(win);
    soundFX.playWindowSpawn();
    requestAnimationFrame(() => win.classList.add('is-open'));
  });

  // Sound Toggle Button
  btnSoundToggle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    soundFX.init();
    const muted = soundFX.toggleMute();
    updateMuteIcons(muted);
    if (!muted) {
      soundFX.playStickerPop();
    }
  });

  // Manual Reset Button
  btnManualReset.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    soundFX.init();

    openWindows.forEach((w) => w.remove());
    openWindows = [];

    completeLoopReset();
  });

  // Lively Wallpaper & Wallpaper Engine Property Support
  window.livelyPropertyListener = function (name, val) {
    if (name === 'muteAudio') {
      if (soundFX.isMuted !== val) {
        soundFX.toggleMute();
        updateMuteIcons(soundFX.isMuted);
      }
    }
  };

})();
