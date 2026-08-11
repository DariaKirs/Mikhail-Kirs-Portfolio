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
    { x: 7, y: 100 },
    { x: 31, y: 101 },
    { x: 58, y: 99 },
    { x: 82, y: 101 },
    { x: 94, y: 100 }
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
    if (isMobile()) return ['s', 'm', 'l'][index % 3];
    return ['xl', 'xs', 's', 'm', 'xs', 's', 'm'][index % 7];
  };

  const sizeForTier = (tier) => {
    if (tier === 'xl') return random(180, 224);
    if (tier === 'l') return random(92, 120);
    if (tier === 'm') return random(96, 124);
    if (tier === 's') return isMobile() ? random(34, 44) : random(58, 72);
    return random(36, 44);
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

  /* About 10% slower than the previous Dream 2 pass. */
  const riseDurationFor = () => {
    if (reducedMotion.matches) return 1;
    return isMobile() ? random(13.2, 18.7) : random(15.4, 22);
  };

  const tierAllowsZone = (zone, tier) => {
    if (tier === 'xl') return zone.x <= 7 || zone.x >= 93;
    if (tier === 'l') return zone.x <= 12 || zone.x >= 88;
    return true;
  };

  /* Reserve a horizontal flight corridor for every square. Because every square rises
     monotonically through the whole HERO, non-overlapping corridors prevent overlaps
     for the entire journey, not only at birth. */
  const corridorIsSafe = (zone, size, tier) => {
    const width = layer.getBoundingClientRect().width || hero.getBoundingClientRect().width || 1200;
    const x = width * zone.x / 100;
    const ownSway = tier === 'xl' || tier === 'l' ? 18 : tier === 'm' ? 24 : 28;

    for (const other of liveSquares) {
      if (!other.isConnected || other.dataset.state === 'bursting') continue;
      const otherX = width * Number(other.dataset.zoneX) / 100;
      const otherSize = Number(other.dataset.size);
      const otherSway = Number(other.dataset.swayAbs || 24);
      const gap = Math.abs(x - otherX);
      const required = (size + otherSize) / 2 + ownSway + otherSway + 12;
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

  /* Higher budget lets XL squares create a dense halo without starving later bursts. */
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

  /* Sparse first shell. Particle count and radius now scale much more strongly with size. */
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

  /* Fine dust: small squares stay compact; large squares create a broad, nearly circular halo. */
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

      /* Even angular distribution avoids clumps and reads as a bubble-like circular release. */
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

    const zoneIndex = Number(square.dataset.zoneIndex);
    const tier = square.dataset.tier;
    const size = Number(square.dataset.size);
    const color = square.dataset.color;
    const token = Number(square.dataset.generation);
    const compressionDuration = reducedMotion.matches ? 90 : random(105, 150);
    const cloudDuration = reducedMotion.matches ? 140 : random(185, 250);

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

  /* Interaction is resolved geometrically instead of by DOM stacking. This means a square
     remains burstable while it visually travels under HERO text, buttons or the portrait.
     Squares are burstable from the moment they become visible; they do not need to finish growing. */
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

  document.addEventListener('pointermove', (event) => {
    if (!finePointer.matches) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerSeen = true;
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    pointerSeen = false;
    lastHoverSquare = null;
  }, { passive: true });

  document.addEventListener('pointerdown', (event) => {
    if (finePointer.matches) return;
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
    const driftScale = isMobile() ? .6 : 1;
    const swayAbs = (tier === 'xl' || tier === 'l' ? random(10, 18) : tier === 'm' ? random(16, 24) : random(18, 28)) * driftScale;
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