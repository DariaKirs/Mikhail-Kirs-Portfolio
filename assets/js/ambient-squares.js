(() => {
  'use strict';

  const hero = document.querySelector('.hero[data-ambient-squares="hero"]');
  if (!hero) return;

  const layer = document.createElement('div');
  layer.className = 'ambient-squares-layer';
  layer.setAttribute('aria-hidden', 'true');
  hero.prepend(layer);

  const COLORS = ['#2F8BFF', '#7348D9', '#FF6F7C', '#F4B02A'];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');

  /* SOUND — opt-in only. The page is silent on a fresh visit. */
  const SOUND_STORAGE_KEY = 'mikhail-kirs-sound-enabled';
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  let soundEnabled = false;
  let audioContext = null;
  let audioMaster = null;
  let audioCompressor = null;

  try {
    soundEnabled = sessionStorage.getItem(SOUND_STORAGE_KEY) === '1';
  } catch (error) {
    soundEnabled = false;
  }

  const soundStyle = document.createElement('style');
  soundStyle.textContent = `
    .ambient-sound-toggle {
      position: absolute;
      top: clamp(16px, 1.8vw, 26px);
      right: clamp(16px, 2vw, 30px);
      z-index: 7;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 38px;
      padding: 8px 12px;
      border: 1px solid rgba(32, 54, 74, .24);
      border-radius: 999px;
      background: rgba(244, 239, 230, .88);
      color: #20364A;
      box-shadow: 0 8px 22px rgba(32, 54, 74, .10);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      font: inherit;
      font-size: .78rem;
      font-weight: 750;
      line-height: 1;
      letter-spacing: .01em;
      cursor: pointer;
      transition: transform 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
    }

    .ambient-sound-toggle:hover {
      transform: translateY(-1px);
      border-color: rgba(47, 139, 255, .38);
      box-shadow: 0 10px 26px rgba(32, 54, 74, .13);
    }

    .ambient-sound-toggle:focus-visible {
      outline: 2px solid #2F8BFF;
      outline-offset: 3px;
    }

    .ambient-sound-toggle[aria-pressed="true"] {
      background: rgba(216, 233, 238, .94);
      border-color: rgba(47, 139, 255, .34);
    }

    .ambient-sound-toggle:disabled {
      opacity: .55;
      cursor: default;
      transform: none;
    }

    .ambient-sound-icon {
      display: inline-flex;
      width: 17px;
      height: 17px;
      flex: 0 0 17px;
    }

    .ambient-sound-icon svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .ambient-sound-icon path,
    .ambient-sound-icon line {
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .ambient-sound-wave {
      opacity: 0;
      transform-origin: 8px 8px;
      transition: opacity 160ms ease;
    }

    .ambient-sound-slash {
      opacity: 1;
      transition: opacity 160ms ease;
    }

    .ambient-sound-toggle[aria-pressed="true"] .ambient-sound-wave {
      opacity: 1;
      animation: ambient-sound-wave 1.8s ease-in-out infinite;
    }

    .ambient-sound-toggle[aria-pressed="true"] .ambient-sound-wave.wave-two {
      animation-delay: 180ms;
    }

    .ambient-sound-toggle[aria-pressed="true"] .ambient-sound-slash {
      opacity: 0;
    }

    @keyframes ambient-sound-wave {
      0%, 100% { opacity: .45; }
      50% { opacity: 1; }
    }

    @media (max-width: 820px) {
      .ambient-sound-toggle {
        top: 12px;
        right: 12px;
        min-height: 36px;
        padding: 8px 10px;
        gap: 7px;
        font-size: .72rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .ambient-sound-toggle,
      .ambient-sound-wave {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(soundStyle);

  const soundToggle = document.createElement('button');
  soundToggle.type = 'button';
  soundToggle.className = 'ambient-sound-toggle';
  soundToggle.innerHTML = `
    <span class="ambient-sound-icon" aria-hidden="true">
      <svg viewBox="0 0 18 18" focusable="false">
        <path d="M3.2 7.1h3L9.7 4v10l-3.5-3.1h-3z"></path>
        <path class="ambient-sound-wave wave-one" d="M12 6.2c.9.8 1.4 1.7 1.4 2.8s-.5 2-1.4 2.8"></path>
        <path class="ambient-sound-wave wave-two" d="M14 4.6c1.4 1.2 2.2 2.7 2.2 4.4s-.8 3.2-2.2 4.4"></path>
        <line class="ambient-sound-slash" x1="11.5" y1="6.1" x2="16" y2="11.9"></line>
      </svg>
    </span>
    <span class="ambient-sound-label">Sound off</span>
  `;
  hero.appendChild(soundToggle);

  const updateSoundToggle = () => {
    const label = soundToggle.querySelector('.ambient-sound-label');
    if (!AudioContextCtor) {
      soundToggle.disabled = true;
      soundToggle.setAttribute('aria-pressed', 'false');
      soundToggle.setAttribute('aria-label', 'Sound unavailable');
      soundToggle.title = 'Sound effects are unavailable in this browser';
      if (label) label.textContent = 'Sound unavailable';
      return;
    }

    soundToggle.disabled = false;
    soundToggle.setAttribute('aria-pressed', String(soundEnabled));
    soundToggle.setAttribute('aria-label', soundEnabled ? 'Turn sound effects off' : 'Turn sound effects on');
    soundToggle.title = soundEnabled ? 'Sound effects on — click to mute' : 'Sound effects off — click to enable';
    if (label) label.textContent = soundEnabled ? 'Sound on' : 'Sound off';
  };

  const ensureAudioContext = async () => {
    if (!AudioContextCtor) return null;
    if (!audioContext) {
      audioContext = new AudioContextCtor();
      audioMaster = audioContext.createGain();
      audioCompressor = audioContext.createDynamicsCompressor();
      audioCompressor.threshold.value = -18;
      audioCompressor.knee.value = 24;
      audioCompressor.ratio.value = 1.8;
      audioCompressor.attack.value = .006;
      audioCompressor.release.value = .18;
      audioMaster.gain.value = soundEnabled ? .58 : 0;
      audioMaster.connect(audioCompressor);
      audioCompressor.connect(audioContext.destination);
    }

    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
      } catch (error) {
        return null;
      }
    }
    return audioContext;
  };

  const soundProfileFor = (tier, size) => {
    if (tier === 'xl' || size >= 170) {
      return { snapHz: 430, bodyHz: 190, duration: .19, snapGain: .105, bodyGain: .045, skinGain: .015 };
    }
    if (tier === 'm' || size >= 90) {
      return { snapHz: 520, bodyHz: 240, duration: .16, snapGain: .098, bodyGain: .041, skinGain: .014 };
    }
    if (tier === 's' || size >= 55) {
      return { snapHz: 620, bodyHz: 300, duration: .14, snapGain: .090, bodyGain: .037, skinGain: .013 };
    }
    return { snapHz: 760, bodyHz: 370, duration: .12, snapGain: .082, bodyGain: .033, skinGain: .012 };
  };

  /* Soap bubble: a tiny membrane snap followed by a short rounded cavity resonance.
     No musical chord, no hiss and no long tail — just a soft, wet little "plop". */
  const playDustBurst = (tier, size, { preview = false } = {}) => {
    if (!soundEnabled || !AudioContextCtor) return;

    ensureAudioContext().then((context) => {
      if (!context || !soundEnabled || context.state !== 'running' || !audioMaster) return;

      const profile = soundProfileFor(tier, size);
      const now = context.currentTime + .006;
      const variation = random(.965, 1.035);
      const previewScale = preview ? .80 : 1;

      const snap = context.createOscillator();
      snap.type = 'sine';
      snap.frequency.setValueAtTime(profile.snapHz * 1.42 * variation, now);
      snap.frequency.exponentialRampToValueAtTime(profile.snapHz * .72 * variation, now + profile.duration * .62);
      const snapGain = context.createGain();
      snapGain.gain.setValueAtTime(.0001, now);
      snapGain.gain.exponentialRampToValueAtTime(profile.snapGain * previewScale, now + .004);
      snapGain.gain.exponentialRampToValueAtTime(profile.snapGain * .18 * previewScale, now + profile.duration * .34);
      snapGain.gain.exponentialRampToValueAtTime(.0001, now + profile.duration * .72);
      snap.connect(snapGain);
      snapGain.connect(audioMaster);
      snap.start(now);
      snap.stop(now + profile.duration * .78);

      const bodyStart = now + .007;
      const body = context.createOscillator();
      body.type = 'sine';
      body.frequency.setValueAtTime(profile.bodyHz * 1.08 * variation, bodyStart);
      body.frequency.exponentialRampToValueAtTime(profile.bodyHz * .90 * variation, bodyStart + profile.duration);
      const bodyGain = context.createGain();
      bodyGain.gain.setValueAtTime(.0001, bodyStart);
      bodyGain.gain.exponentialRampToValueAtTime(profile.bodyGain * previewScale, bodyStart + .012);
      bodyGain.gain.exponentialRampToValueAtTime(profile.bodyGain * .30 * previewScale, bodyStart + profile.duration * .46);
      bodyGain.gain.exponentialRampToValueAtTime(.0001, bodyStart + profile.duration * 1.08);
      body.connect(bodyGain);
      bodyGain.connect(audioMaster);
      body.start(bodyStart);
      body.stop(bodyStart + profile.duration * 1.12);

      const skinStart = now + .002;
      const skin = context.createOscillator();
      skin.type = 'sine';
      skin.frequency.setValueAtTime(profile.snapHz * 2.05 * variation, skinStart);
      skin.frequency.exponentialRampToValueAtTime(profile.snapHz * 1.55 * variation, skinStart + .045);
      const skinGain = context.createGain();
      skinGain.gain.setValueAtTime(.0001, skinStart);
      skinGain.gain.exponentialRampToValueAtTime(profile.skinGain * previewScale, skinStart + .0025);
      skinGain.gain.exponentialRampToValueAtTime(.0001, skinStart + .052);
      skin.connect(skinGain);
      skinGain.connect(audioMaster);
      skin.start(skinStart);
      skin.stop(skinStart + .058);
    });
  };

  const setSoundEnabled = (enabled, preview = false) => {
    soundEnabled = Boolean(enabled);
    try {
      sessionStorage.setItem(SOUND_STORAGE_KEY, soundEnabled ? '1' : '0');
    } catch (error) {
      /* Session persistence is optional; sound state still works in-memory. */
    }
    updateSoundToggle();

    if (!soundEnabled) {
      if (audioMaster && audioContext) {
        audioMaster.gain.cancelScheduledValues(audioContext.currentTime);
        audioMaster.gain.setTargetAtTime(0, audioContext.currentTime, .014);
      }
      return;
    }

    ensureAudioContext().then((context) => {
      if (!context || !audioMaster || !soundEnabled) return;
      audioMaster.gain.cancelScheduledValues(context.currentTime);
      audioMaster.gain.setTargetAtTime(.58, context.currentTime, .016);
      if (preview) {
        window.setTimeout(() => playDustBurst('s', 64, { preview: true }), 45);
      }
    });
  };

  soundToggle.addEventListener('click', () => setSoundEnabled(!soundEnabled, !soundEnabled));

  const unlockStoredSound = () => {
    if (soundEnabled) ensureAudioContext();
  };
  document.addEventListener('pointerdown', unlockStoredSound, { capture: true, passive: true });
  document.addEventListener('keydown', unlockStoredSound, { capture: true });
  updateSoundToggle();

  const desktopZones = [
    { x: 3, y: 100 },
    { x: 13, y: 101 },
    { x: 23, y: 99 },
    { x: 38, y: 101 },
    { x: 54, y: 99 },
    { x: 70, y: 101 },
    { x: 84, y: 99 },
    { x: 97, y: 100 }
  ];

  const mobileZones = [
    { x: 5, y: 97.5 },
    { x: 18, y: 98.5 },
    { x: 32, y: 97.8 },
    { x: 50, y: 98.8 },
    { x: 68, y: 97.8 },
    { x: 82, y: 98.5 },
    { x: 95, y: 97.5 }
  ];

  const liveSquares = new Set();
  const occupiedZones = new Set();
  let activeParticles = 0;
  let generation = 0;
  let pointerX = -9999;
  let pointerY = -9999;
  let pointerSeen = false;
  let lastHoverSquare = null;

  const random = (min, max) => Math.random() * (max - min) + min;
  const choose = (items) => items[Math.floor(Math.random() * items.length)];
  const signedRange = (min, max) => (Math.random() < .5 ? -1 : 1) * random(min, max);
  const shuffle = (items) => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  let colorPool = shuffle(COLORS);
  const nextColor = () => {
    if (!colorPool.length) colorPool = shuffle(COLORS);
    return colorPool.pop();
  };
  const desktopTarget = choose([5, 6, 6, 6, 7]);

  const isMobile = () => window.innerWidth <= 820;
  const zones = () => isMobile() ? mobileZones : desktopZones;
  const targetCount = () => isMobile() ? 3 : desktopTarget;

  const initialTierFor = (index) => {
    if (isMobile()) return ['m', 'xs', 's'][index % 3];
    return ['xl', 'xs', 's', 'm', 'xs', 's', 'm'][index % 7];
  };

  const sizeForTier = (tier) => {
    if (isMobile()) {
      if (tier === 'm') return random(92, 118);
      if (tier === 's') return random(58, 72);
      return random(34, 44);
    }
    if (tier === 'xl') return random(180, 224);
    if (tier === 'm') return random(96, 124);
    if (tier === 's') return random(58, 72);
    return random(36, 44);
  };

  const rotationProfileForTier = (tier) => {
    if (tier === 'xl') return { angle: random(4.5, 6.8), duration: random(14.5, 18.5) };
    if (tier === 'l') return { angle: random(5.2, 7.8), duration: random(12.8, 16.5) };
    if (tier === 'm') return { angle: random(6.5, 9.5), duration: random(10.5, 13.8) };
    if (tier === 's') return { angle: random(8.2, 12.2), duration: random(8.2, 11.2) };
    return { angle: random(10.5, 15.5), duration: random(6.4, 9.1) };
  };

  const applyAxisDrift = (shape, tier) => {
    if (reducedMotion.matches || !shape) return;
    const profile = rotationProfileForTier(tier);
    const originX = random(24, 76);
    const originY = random(20, 80);
    const start = random(-profile.angle * .55, profile.angle * .55);
    const mid = random(-profile.angle, profile.angle);
    const end = random(-profile.angle * .8, profile.angle * .8);
    shape.style.transformOrigin = `${originX}% ${originY}%`;
    return shape.animate([
      { rotate: `${start}deg`, offset: 0 },
      { rotate: `${mid}deg`, offset: .5 },
      { rotate: `${end}deg`, offset: 1 }
    ], {
      duration: profile.duration * 1000,
      iterations: Infinity,
      direction: 'alternate',
      easing: 'ease-in-out',
      delay: random(-profile.duration * 1000, 0),
      composite: 'add'
    });
  };

  const depthFor = () => {
    const roll = Math.random();
    if (roll < .34) return { opacity: random(.44, .52), blur: random(.9, 1.35) };
    if (roll < .72) return { opacity: random(.52, .61), blur: random(.3, .8) };
    return { opacity: random(.61, .7), blur: random(.02, .28) };
  };

  const growthDurationFor = (size) => {
    if (reducedMotion.matches) return 240;
    if (size >= 170) return random(4400, 5600);
    if (size >= 90) return random(3800, 5000);
    if (size >= 55) return random(3400, 4500);
    return random(3100, 4100);
  };

  const riseFor = (size) => {
    if (reducedMotion.matches) return 0;
    const layerHeight = layer.getBoundingClientRect().height || hero.getBoundingClientRect().height || 720;
    const overshoot = isMobile() ? random(80, 130) : random(120, 190);
    return -(layerHeight + size * 1.7 + overshoot);
  };

  const riseDurationFor = () => {
    if (reducedMotion.matches) return 1;
    return isMobile() ? random(17, 23) : random(15.4, 22);
  };

  const tierAllowsZone = (zone, tier) => {
    if (isMobile()) {
      if (tier === 'm') return zone.x <= 18 || zone.x >= 82;
      return zone.x >= 32 && zone.x <= 68;
    }
    if (tier === 'xl') return zone.x <= 7 || zone.x >= 93;
    if (tier === 'l') return zone.x <= 12 || zone.x >= 88;
    return true;
  };

  const corridorIsSafe = (zone, size, tier) => {
    const width = layer.getBoundingClientRect().width || hero.getBoundingClientRect().width || 1200;
    const x = width * zone.x / 100;
    const ownSway = isMobile()
      ? (tier === 'm' ? 12 : tier === 's' ? 15 : 18)
      : (tier === 'xl' || tier === 'l' ? 18 : tier === 'm' ? 24 : 28);

    for (const other of liveSquares) {
      if (!other.isConnected || other.dataset.state === 'bursting') continue;
      const otherX = width * Number(other.dataset.zoneX) / 100;
      const otherSize = Number(other.dataset.size);
      const otherSway = Number(other.dataset.swayAbs || 24);
      const gap = Math.abs(x - otherX);
      const required = (size + otherSize) / 2 + ownSway + otherSway + (isMobile() ? 7 : 12);
      if (gap < required) return false;
    }
    return true;
  };

  const pickZone = (tier, size, avoidIndex = -1) => {
    const indexed = zones().map((zone, index) => ({ zone, index }));
    const candidates = indexed.filter(({ zone, index }) =>
      !occupiedZones.has(index) &&
      index !== avoidIndex &&
      tierAllowsZone(zone, tier) &&
      corridorIsSafe(zone, size, tier)
    );
    if (candidates.length) return choose(candidates);

    const safeAnyTier = indexed.filter(({ zone, index }) =>
      !occupiedZones.has(index) &&
      index !== avoidIndex &&
      corridorIsSafe(zone, size, tier)
    );
    return safeAnyTier.length ? choose(safeAnyTier) : null;
  };

  const particleBudget = () => isMobile() ? 360 : 780;

  const visibleRectFor = (square) => {
    const shape = square.querySelector('.ambient-square-shape');
    return shape ? shape.getBoundingClientRect() : square.getBoundingClientRect();
  };

  const coordinatesFor = (square) => {
    const layerRect = layer.getBoundingClientRect();
    const rect = visibleRectFor(square);
    return {
      x: rect.left - layerRect.left + rect.width / 2,
      y: rect.top - layerRect.top + rect.height / 2,
      layerRect
    };
  };

  const createCloud = ({ x, y }, color, size) => {
    const count = size < 55 ? 8 : size < 90 ? 14 : size < 170 ? 24 : 40;
    const spread = size >= 170
      ? size * .82
      : size >= 90
        ? size * .72
        : Math.max(26, size * .62);

    for (let i = 0; i < count; i += 1) {
      const speck = document.createElement('span');
      speck.className = 'ambient-cloud-speck';
      const speckSize = size >= 170 ? random(4.2, 10.5) : size >= 90 ? random(3.8, 8.5) : random(3, 6.8);
      const angle = (i / count) * Math.PI * 2 + random(-.11, .11);
      const radius = spread * random(.56, 1.08);
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;
      const duration = reducedMotion.matches ? 180 : size >= 170 ? random(560, 820) : random(440, 700);
      const startOpacity = random(.28, .58);

      speck.style.left = `${x}px`;
      speck.style.top = `${y}px`;
      speck.style.setProperty('--cloud-size', `${speckSize}px`);
      speck.style.setProperty('--cloud-color', color);
      layer.appendChild(speck);

      const animation = speck.animate([
        { transform: 'translate3d(-50%, -50%, 0) scale(.22)', opacity: 0, filter: 'blur(0px)', offset: 0 },
        { transform: `translate3d(calc(-50% + ${dx * .28}px), calc(-50% + ${dy * .28}px), 0) scale(1.08)`, opacity: startOpacity, filter: 'blur(.15px)', offset: .24 },
        { transform: `translate3d(calc(-50% + ${dx}px), calc(-50% + ${dy}px), 0) scale(.68)`, opacity: 0, filter: 'blur(2.8px)', offset: 1 }
      ], { duration, delay: random(0, 70), easing: 'cubic-bezier(.16,.58,.18,1)', fill: 'forwards' });

      animation.addEventListener('finish', () => speck.remove(), { once: true });
    }
  };

  const createDust = (origin, color, size) => {
    const wanted = size < 55 ? 62 : size < 90 ? 96 : size < 170 ? 154 : 240;
    const room = Math.max(24, particleBudget() - activeParticles);
    const count = Math.min(wanted, room);
    const sizeFactor = Math.max(.7, Math.min(2.2, size / 105));
    const spread = size >= 170
      ? size * 1.08
      : size >= 90
        ? size * .92
        : Math.max(54, size * .76);
    const baseDuration = reducedMotion.matches
      ? 340
      : size >= 170
        ? random(1780, 2450)
        : size >= 90
          ? random(1450, 2050)
          : random(1080, 1680);

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'ambient-particle';
      const fineDust = Math.random() < (size >= 170 ? .88 : .84);
      const pSize = fineDust ? random(.65, 2.05) : random(2.05, 4.6);
      const angle = (i / count) * Math.PI * 2 + random(-.055, .055);
      const outerRing = Math.random() < (size >= 170 ? .58 : .42);
      const distanceFactor = outerRing ? random(.76, 1.25) : random(.34, .82);
      const distance = spread * distanceFactor;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const curlX = signedRange(4, 18) * sizeFactor;
      const curlY = signedRange(4, 18) * sizeFactor;
      const duration = baseDuration + random(-120, 320) + (fineDust ? random(120, 380) : 0);
      const delay = random(25, size >= 170 ? 210 : 170);
      const startOpacity = fineDust ? random(.28, .6) : random(.44, .74);
      const endScale = fineDust ? random(.2, .52) : random(.16, .38);

      particle.style.left = `${origin.x}px`;
      particle.style.top = `${origin.y}px`;
      particle.style.setProperty('--particle-size', `${pSize}px`);
      particle.style.setProperty('--particle-color', color);
      particle.style.setProperty('--particle-opacity', String(startOpacity));
      layer.appendChild(particle);
      activeParticles += 1;

      const animation = particle.animate([
        { transform: 'translate3d(-50%, -50%, 0) scale(.48)', opacity: 0, filter: 'blur(0px)', offset: 0 },
        { transform: `translate3d(calc(-50% + ${dx * .14}px), calc(-50% + ${dy * .14}px), 0) scale(1)`, opacity: startOpacity, filter: 'blur(0px)', offset: .14 },
        { transform: `translate3d(calc(-50% + ${dx * .58 + curlX * .28}px), calc(-50% + ${dy * .58 + curlY * .28}px), 0) scale(.8)`, opacity: startOpacity * .66, filter: 'blur(.6px)', offset: .56 },
        { transform: `translate3d(calc(-50% + ${dx + curlX}px), calc(-50% + ${dy + curlY}px), 0) scale(${endScale})`, opacity: 0, filter: 'blur(3.1px)', offset: 1 }
      ], { duration, delay, easing: 'cubic-bezier(.12,.48,.18,1)', fill: 'forwards' });

      animation.addEventListener('finish', () => {
        particle.remove();
        activeParticles = Math.max(0, activeParticles - 1);
      }, { once: true });
    }
  };

  const scheduleRespawn = (tier, avoidZone, delay) => {
    window.setTimeout(() => {
      if (liveSquares.size >= targetCount()) return;
      if (!spawnSquare(tier, avoidZone)) scheduleRespawn(tier, avoidZone, 420);
    }, delay);
  };

  const burst = (square) => {
    if (!square || square.dataset.state === 'bursting') return;

    square.dataset.state = 'bursting';
    square.classList.remove('is-grown');
    square.classList.add('is-compressing');
    if (square._axisAnimation) {
      square._axisAnimation.cancel();
      square._axisAnimation = null;
    }

    const zoneIndex = Number(square.dataset.zoneIndex);
    const tier = square.dataset.tier;
    const size = Number(square.dataset.size);
    const color = square.dataset.color;
    const token = Number(square.dataset.generation);
    const compressionDuration = reducedMotion.matches ? 90 : random(105, 150);
    const cloudDuration = reducedMotion.matches ? 140 : random(185, 250);

    playDustBurst(tier, size);

    window.setTimeout(() => {
      if (!square.isConnected || token !== Number(square.dataset.generation)) return;
      square.classList.remove('is-compressing');
      square.classList.add('is-clouding');
      createCloud(coordinatesFor(square), color, size);

      window.setTimeout(() => {
        if (!square.isConnected || token !== Number(square.dataset.generation)) return;
        createDust(coordinatesFor(square), color, size);
        occupiedZones.delete(zoneIndex);
        liveSquares.delete(square);
        square.remove();
        scheduleRespawn(tier, zoneIndex, reducedMotion.matches ? 1500 : random(1450, 2450));
      }, cloudDuration);
    }, compressionDuration);
  };

  const squareAtPoint = (x, y) => {
    let best = null;
    let bestDistance = Infinity;
    for (const square of liveSquares) {
      if (!square.isConnected || square.dataset.state === 'bursting') continue;
      const rect = visibleRectFor(square);
      if (rect.width < 2 || rect.height < 2) continue;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) continue;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distance = Math.hypot(x - cx, y - cy);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = square;
      }
    }
    return best;
  };

  const eventTargetsSoundControl = (event) => {
    const target = event.target;
    return target instanceof Element && Boolean(target.closest('.ambient-sound-toggle'));
  };

  document.addEventListener('pointermove', (event) => {
    if (!finePointer.matches) return;
    if (eventTargetsSoundControl(event)) {
      pointerSeen = false;
      lastHoverSquare = null;
      return;
    }
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerSeen = true;
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    pointerSeen = false;
    lastHoverSquare = null;
  }, { passive: true });

  document.addEventListener('pointerdown', (event) => {
    if (finePointer.matches || eventTargetsSoundControl(event)) return;
    const hit = squareAtPoint(event.clientX, event.clientY);
    if (hit) burst(hit);
  }, { passive: true });

  let lastHitCheck = 0;
  const hoverLoop = (time) => {
    if (finePointer.matches && pointerSeen && time - lastHitCheck > 70) {
      lastHitCheck = time;
      const hit = squareAtPoint(pointerX, pointerY);
      if (hit && hit !== lastHoverSquare) burst(hit);
      lastHoverSquare = hit || null;
    }
    window.requestAnimationFrame(hoverLoop);
  };
  window.requestAnimationFrame(hoverLoop);

  const recycleSquare = (square, zoneIndex) => {
    if (!square || !square.isConnected || square.dataset.state === 'bursting') return;
    const tier = square.dataset.tier;
    occupiedZones.delete(zoneIndex);
    liveSquares.delete(square);
    square.remove();
    scheduleRespawn(tier, zoneIndex, reducedMotion.matches ? 1800 : random(180, 480));
  };

  function spawnSquare(tier, avoidZone = -1) {
    if (liveSquares.size >= targetCount()) return false;

    const size = sizeForTier(tier);
    const picked = pickZone(tier, size, avoidZone);
    if (!picked) return false;

    occupiedZones.add(picked.index);

    const square = document.createElement('span');
    const motion = document.createElement('span');
    const sway = document.createElement('span');
    const shape = document.createElement('span');
    const color = nextColor();
    const rotation = random(-10, 12);
    const depth = depthFor();
    const growthDuration = growthDurationFor(size);
    const swayAbs = isMobile()
      ? (tier === 'm' ? random(7, 12) : tier === 's' ? random(10, 15) : random(12, 18))
      : (tier === 'xl' || tier === 'l' ? random(10, 18) : tier === 'm' ? random(16, 24) : random(18, 28));
    const localGeneration = ++generation;

    square.className = `ambient-square ambient-size-${tier}`;
    square.dataset.state = 'entering';
    square.dataset.zoneIndex = String(picked.index);
    square.dataset.zoneX = String(picked.zone.x);
    square.dataset.size = String(size);
    square.dataset.tier = tier;
    square.dataset.color = color;
    square.dataset.swayAbs = String(swayAbs);
    square.dataset.generation = String(localGeneration);

    square.style.setProperty('--ambient-left', `${picked.zone.x}%`);
    square.style.setProperty('--ambient-top', `${picked.zone.y}%`);
    square.style.setProperty('--ambient-size', `${size}px`);
    square.style.setProperty('--ambient-color', color);
    square.style.setProperty('--ambient-opacity', String(depth.opacity));
    square.style.setProperty('--ambient-blur', `${depth.blur}px`);
    square.style.setProperty('--ambient-rotation', `${rotation}deg`);
    square.style.setProperty('--ambient-start-scale', String(random(.1, .22)));
    square.style.setProperty('--ambient-grow-duration', `${growthDuration}ms`);
    square.style.setProperty('--ambient-rise-y', `${riseFor(size)}px`);
    square.style.setProperty('--ambient-rise-duration', `${riseDurationFor()}s`);
    square.style.setProperty('--ambient-sway-x', `${Math.random() < .5 ? -swayAbs : swayAbs}px`);
    square.style.setProperty('--ambient-sway-rotation', `${random(-6, 6)}deg`);
    square.style.setProperty('--ambient-sway-duration', `${random(6.2, 10)}s`);
    square.style.setProperty('--ambient-sway-delay', `${random(-4, 0)}s`);

    motion.className = 'ambient-square-motion';
    sway.className = 'ambient-square-sway';
    shape.className = 'ambient-square-shape';
    sway.appendChild(shape);
    motion.appendChild(sway);
    square.appendChild(motion);
    layer.appendChild(square);
    liveSquares.add(square);

    square._axisAnimation = applyAxisDrift(shape, tier);

    if (!reducedMotion.matches) {
      motion.addEventListener('animationend', () => recycleSquare(square, picked.index), { once: true });
    }

    window.setTimeout(() => {
      if (!square.isConnected) return;
      square.classList.add('is-ready');
      window.setTimeout(() => {
        if (!square.isConnected) return;
        square.dataset.state = 'ready';
        square.classList.add('is-grown');
      }, growthDuration + 60);
    }, random(35, 110));

    return true;
  }

  const seed = () => {
    const count = targetCount();
    for (let i = 0; i < count; i += 1) {
      const tier = initialTierFor(i);
      window.setTimeout(() => {
        if (!spawnSquare(tier)) scheduleRespawn(tier, -1, 420);
      }, 140 + i * random(190, 290));
    }
  };

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const desired = targetCount();
      if (liveSquares.size > desired) {
        Array.from(liveSquares).slice(desired).forEach((square) => {
          occupiedZones.delete(Number(square.dataset.zoneIndex));
          liveSquares.delete(square);
          square.remove();
        });
      }
    }, 180);
  }, { passive: true });

  seed();
})();