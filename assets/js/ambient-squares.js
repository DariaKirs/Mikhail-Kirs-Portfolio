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

  /* DREAM 2 rule: every square is born at the bottom of HERO.
     X positions stay in lower safe lanes while the largest squares prefer the edges. */
  const desktopZones = [
    { x: 4.5, y: 99 },
    { x: 13, y: 101 },
    { x: 28, y: 98 },
    { x: 46, y: 101 },
    { x: 61, y: 98 },
    { x: 73, y: 101 },
    { x: 87, y: 101 },
    { x: 96, y: 98 }
  ];

  const mobileZones = [
    { x: 7, y: 100 },
    { x: 27, y: 101 },
    { x: 50, y: 99 },
    { x: 73, y: 101 },
    { x: 93, y: 100 }
  ];

  const liveSquares = new Set();
  const occupiedZones = new Set();
  let activeParticles = 0;
  let generation = 0;

  const random = (min, max) => Math.random() * (max - min) + min;
  const choose = (items) => items[Math.floor(Math.random() * items.length)];
  const signedRange = (min, max) => (Math.random() < .5 ? -1 : 1) * random(min, max);
  const desktopTarget = choose([5, 6, 6, 6, 7]);

  const isMobile = () => window.innerWidth <= 820;
  const zones = () => isMobile() ? mobileZones : desktopZones;
  const targetCount = () => isMobile() ? 3 : desktopTarget;

  const sizeFor = (index) => {
    if (isMobile()) {
      const pattern = ['l', 's', 'm'];
      const tier = pattern[index % pattern.length];
      if (tier === 'l') return { size: random(92, 120), tier };
      if (tier === 'm') return { size: random(56, 72), tier };
      return { size: random(34, 44), tier };
    }

    /* Four deliberately separated visual scales. With 6 squares there are two XL forms. */
    const pattern = ['xl', 'xs', 's', 'm', 's', 'xl', 'xs'];
    const tier = pattern[index % pattern.length];
    if (tier === 'xl') return { size: random(180, 224), tier };
    if (tier === 'm') return { size: random(96, 124), tier };
    if (tier === 's') return { size: random(58, 72), tier };
    return { size: random(36, 44), tier };
  };

  const depthFor = () => {
    const roll = Math.random();
    if (roll < .34) {
      return { opacity: random(.42, .5), blur: random(1, 1.45) };
    }
    if (roll < .72) {
      return { opacity: random(.5, .58), blur: random(.35, .9) };
    }
    return { opacity: random(.58, .66), blur: random(.02, .32) };
  };

  const growthDurationFor = (size) => {
    if (reducedMotion.matches) return 240;
    if (size >= 170) return random(4200, 5400);
    if (size >= 90) return random(3600, 4800);
    if (size >= 55) return random(3200, 4300);
    return random(2900, 3900);
  };

  const riseFor = (size) => {
    if (reducedMotion.matches) return 0;
    const layerHeight = layer.getBoundingClientRect().height || hero.getBoundingClientRect().height || 720;
    const overshoot = isMobile() ? random(80, 130) : random(120, 190);
    return -(layerHeight + size * 1.7 + overshoot);
  };

  const riseDurationFor = () => {
    if (reducedMotion.matches) return 1;
    return isMobile() ? random(12, 17) : random(14, 20);
  };

  const tierAllowsZone = (zone, tier) => {
    if (tier === 'xl' || tier === 'l') return zone.x <= 18 || zone.x >= 82;
    return true;
  };

  const pickZone = (tier, avoidIndex = -1) => {
    const indexed = zones().map((zone, index) => ({ zone, index }));
    const preferred = indexed.filter(({ zone, index }) =>
      !occupiedZones.has(index) &&
      index !== avoidIndex &&
      tierAllowsZone(zone, tier)
    );
    if (preferred.length) return choose(preferred);

    const available = indexed.filter(({ index }) => !occupiedZones.has(index) && index !== avoidIndex);
    if (available.length) return choose(available);

    const fallback = indexed.filter(({ index }) => index !== avoidIndex && tierAllowsZone(zones()[index], tier));
    return choose(fallback.length ? fallback : indexed);
  };

  const particleBudget = () => isMobile() ? 220 : 420;

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

  /* First burst layer: a sparse shell of larger, soft dust motes expanding like a bubble skin. */
  const createCloud = ({ x, y }, color, size) => {
    const count = size < 55 ? 8 : size < 100 ? 12 : size < 170 ? 18 : 26;
    const spread = Math.max(24, size * .56);

    for (let i = 0; i < count; i += 1) {
      const speck = document.createElement('span');
      speck.className = 'ambient-cloud-speck';

      const speckSize = size >= 170 ? random(4.5, 11) : size >= 90 ? random(4, 9) : random(3, 7);
      const angle = (i / count) * Math.PI * 2 + random(-.16, .16);
      const radius = spread * random(.5, 1.02);
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;
      const duration = reducedMotion.matches ? 180 : random(430, 680);
      const startOpacity = random(.28, .58);

      speck.style.left = `${x}px`;
      speck.style.top = `${y}px`;
      speck.style.setProperty('--cloud-size', `${speckSize}px`);
      speck.style.setProperty('--cloud-color', color);

      layer.appendChild(speck);

      const animation = speck.animate([
        {
          transform: 'translate3d(-50%, -50%, 0) scale(.25)',
          opacity: 0,
          filter: 'blur(0px)',
          offset: 0
        },
        {
          transform: `translate3d(calc(-50% + ${dx * .32}px), calc(-50% + ${dy * .32}px), 0) scale(1.08)`,
          opacity: startOpacity,
          filter: 'blur(.2px)',
          offset: .25
        },
        {
          transform: `translate3d(calc(-50% + ${dx}px), calc(-50% + ${dy}px), 0) scale(.72)`,
          opacity: 0,
          filter: 'blur(2.6px)',
          offset: 1
        }
      ], {
        duration,
        delay: random(0, 65),
        easing: 'cubic-bezier(.16,.58,.18,1)',
        fill: 'forwards'
      });

      animation.addEventListener('finish', () => speck.remove(), { once: true });
    }
  };

  /* Second burst layer: very fine radial dust. No gravity drop — it disperses and evaporates. */
  const createDust = (origin, color, size) => {
    const wanted = size < 55 ? 62 : size < 90 ? 84 : size < 170 ? 118 : 165;
    const room = Math.max(24, particleBudget() - activeParticles);
    const count = Math.min(wanted, room);
    const sizeFactor = Math.max(.7, Math.min(2.1, size / 105));
    const spread = Math.max(52, size * .68);

    const baseDuration = reducedMotion.matches
      ? 340
      : size >= 170
        ? random(1550, 2150)
        : size >= 90
          ? random(1350, 1900)
          : random(1050, 1650);

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'ambient-particle';

      const fineDust = Math.random() < .82;
      const pSize = fineDust ? random(.7, 2.15) : random(2.15, 4.8);
      const angle = random(0, Math.PI * 2);
      const distance = spread * random(.38, 1.2) * (fineDust ? random(.8, 1.15) : random(.72, .98));
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const curlX = signedRange(5, 20) * sizeFactor;
      const curlY = signedRange(5, 18) * sizeFactor;
      const duration = baseDuration + random(-140, 260) + (fineDust ? random(80, 320) : 0);
      const delay = random(35, 180);
      const startOpacity = fineDust ? random(.3, .62) : random(.46, .76);
      const endScale = fineDust ? random(.25, .6) : random(.18, .42);

      particle.style.left = `${origin.x}px`;
      particle.style.top = `${origin.y}px`;
      particle.style.setProperty('--particle-size', `${pSize}px`);
      particle.style.setProperty('--particle-color', color);
      particle.style.setProperty('--particle-opacity', String(startOpacity));

      layer.appendChild(particle);
      activeParticles += 1;

      const animation = particle.animate([
        {
          transform: 'translate3d(-50%, -50%, 0) scale(.55)',
          opacity: 0,
          filter: 'blur(0px)',
          offset: 0
        },
        {
          transform: `translate3d(calc(-50% + ${dx * .18}px), calc(-50% + ${dy * .18}px), 0) scale(1)`,
          opacity: startOpacity,
          filter: 'blur(0px)',
          offset: .16
        },
        {
          transform: `translate3d(calc(-50% + ${dx * .66 + curlX * .35}px), calc(-50% + ${dy * .66 + curlY * .35}px), 0) scale(.78)`,
          opacity: startOpacity * .58,
          filter: 'blur(.75px)',
          offset: .62
        },
        {
          transform: `translate3d(calc(-50% + ${dx + curlX}px), calc(-50% + ${dy + curlY}px), 0) scale(${endScale})`,
          opacity: 0,
          filter: 'blur(2.8px)',
          offset: 1
        }
      ], {
        duration,
        delay,
        easing: 'cubic-bezier(.12,.48,.18,1)',
        fill: 'forwards'
      });

      animation.addEventListener('finish', () => {
        particle.remove();
        activeParticles = Math.max(0, activeParticles - 1);
      }, { once: true });
    }
  };

  const burst = (square) => {
    if (!square || square.dataset.state !== 'ready') return;

    square.dataset.state = 'bursting';
    square.classList.remove('is-grown');
    square.classList.add('is-compressing');

    const zoneIndex = Number(square.dataset.zoneIndex);
    const size = Number(square.dataset.size);
    const color = square.dataset.color;
    const token = Number(square.dataset.generation);
    const compressionDuration = reducedMotion.matches ? 90 : random(105, 150);
    const cloudDuration = reducedMotion.matches ? 140 : random(185, 250);

    window.setTimeout(() => {
      if (!square.isConnected || token !== Number(square.dataset.generation)) return;

      square.classList.remove('is-compressing');
      square.classList.add('is-clouding');

      const origin = coordinatesFor(square);
      createCloud(origin, color, size);

      window.setTimeout(() => {
        if (!square.isConnected || token !== Number(square.dataset.generation)) return;

        const dustOrigin = coordinatesFor(square);
        createDust(dustOrigin, color, size);

        occupiedZones.delete(zoneIndex);
        liveSquares.delete(square);
        square.remove();

        const respawnDelay = reducedMotion.matches ? 1500 : random(1450, 2450);
        window.setTimeout(() => {
          if (liveSquares.size < targetCount()) spawnSquare(liveSquares.size, zoneIndex);
        }, respawnDelay);
      }, cloudDuration);
    }, compressionDuration);
  };

  const bindInteraction = (square, target) => {
    target.addEventListener('pointerenter', () => {
      if (finePointer.matches) burst(square);
    });

    target.addEventListener('pointerdown', (event) => {
      if (!finePointer.matches) {
        event.preventDefault();
        burst(square);
      }
    }, { passive: false });
  };

  const recycleSquare = (square, zoneIndex) => {
    if (!square || !square.isConnected || square.dataset.state === 'bursting') return;

    occupiedZones.delete(zoneIndex);
    liveSquares.delete(square);
    square.remove();

    const respawnDelay = reducedMotion.matches ? 1800 : random(140, 420);
    window.setTimeout(() => {
      if (liveSquares.size < targetCount()) spawnSquare(liveSquares.size, zoneIndex);
    }, respawnDelay);
  };

  function spawnSquare(index, avoidZone = -1) {
    if (liveSquares.size >= targetCount()) return;

    const sizeSpec = sizeFor(index);
    const picked = pickZone(sizeSpec.tier, avoidZone);
    if (!picked) return;

    occupiedZones.add(picked.index);

    const square = document.createElement('span');
    const motion = document.createElement('span');
    const sway = document.createElement('span');
    const shape = document.createElement('span');
    const size = sizeSpec.size;
    const tier = sizeSpec.tier;
    const color = choose(COLORS);
    const rotation = random(-10, 12);
    const depth = depthFor();
    const growthDuration = growthDurationFor(size);
    const driftScale = isMobile() ? .66 : 1;
    const localGeneration = ++generation;

    square.className = `ambient-square ambient-size-${tier}`;
    square.dataset.state = 'entering';
    square.dataset.zoneIndex = String(picked.index);
    square.dataset.size = String(size);
    square.dataset.tier = tier;
    square.dataset.color = color;
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
    square.style.setProperty('--ambient-sway-x', `${signedRange(22, 58) * driftScale}px`);
    square.style.setProperty('--ambient-sway-rotation', `${random(-6.5, 6.5)}deg`);
    square.style.setProperty('--ambient-sway-duration', `${random(5.5, 9.5)}s`);
    square.style.setProperty('--ambient-sway-delay', `${random(-4, 0)}s`);

    motion.className = 'ambient-square-motion';
    sway.className = 'ambient-square-sway';
    shape.className = 'ambient-square-shape';

    sway.appendChild(shape);
    motion.appendChild(sway);
    square.appendChild(motion);
    layer.appendChild(square);
    liveSquares.add(square);
    bindInteraction(square, shape);

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
  }

  const seed = () => {
    const count = targetCount();
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => spawnSquare(i), 120 + i * random(150, 245));
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
      } else {
        while (liveSquares.size < desired) spawnSquare(liveSquares.size);
      }
    }, 180);
  }, { passive: true });

  seed();
})();
