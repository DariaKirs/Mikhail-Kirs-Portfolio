(() => {
  'use strict';

  const hero = document.querySelector('.hero[data-ambient-squares="hero"]');
  if (!hero) return;

  const layer = document.createElement('div');
  layer.className = 'ambient-squares-layer';
  layer.setAttribute('aria-hidden', 'true');
  hero.prepend(layer);

  const COLORS = ['#D87B89', '#7E9C86', '#326E8B', '#69418C'];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');

  /* Birth points are intentionally biased toward the sides and lower edge.
     Each square rises from one of these peripheral safe zones. */
  const desktopZones = [
    { x: 5.5, y: 38 },
    { x: 94.5, y: 36 },
    { x: 5.5, y: 61 },
    { x: 94.5, y: 60 },
    { x: 6.5, y: 82 },
    { x: 93.5, y: 82 },
    { x: 22, y: 94 },
    { x: 48, y: 95 },
    { x: 76, y: 94 },
    { x: 88, y: 92 }
  ];

  const mobileZones = [
    { x: 7, y: 52 },
    { x: 92, y: 54 },
    { x: 8, y: 82 },
    { x: 91, y: 84 },
    { x: 24, y: 94 },
    { x: 76, y: 94 }
  ];

  const liveSquares = new Set();
  const occupiedZones = new Set();
  let activeParticles = 0;
  let generation = 0;

  const random = (min, max) => Math.random() * (max - min) + min;
  const choose = (items) => items[Math.floor(Math.random() * items.length)];
  const signedRange = (min, max) => (Math.random() < .5 ? -1 : 1) * random(min, max);
  const desktopTarget = Math.floor(random(5, 8));

  const isMobile = () => window.innerWidth <= 820;
  const zones = () => isMobile() ? mobileZones : desktopZones;
  const targetCount = () => isMobile() ? 3 : desktopTarget;

  const sizeFor = (index) => {
    if (isMobile()) {
      if (index === 0) return random(64, 78);
      if (index === 1) return random(42, 54);
      return random(32, 42);
    }

    const slot = index % 7;
    if (slot === 0) return random(92, 104);
    if (slot === 1) return random(58, 68);
    if (slot === 2) return random(34, 40);
    if (slot === 3) return random(52, 64);
    if (slot === 4) return random(82, 98);
    if (slot === 5) return random(46, 58);
    return random(32, 40);
  };

  const depthFor = () => {
    const roll = Math.random();
    if (roll < .34) {
      return {
        opacity: random(.38, .46),
        blur: random(1, 1.65),
        mix: random(44, 51)
      };
    }
    if (roll < .72) {
      return {
        opacity: random(.44, .52),
        blur: random(.4, 1),
        mix: random(49, 57)
      };
    }
    return {
      opacity: random(.5, .58),
      blur: random(.05, .4),
      mix: random(55, 63)
    };
  };

  const growthDurationFor = (size) => {
    if (reducedMotion.matches) return 240;
    if (size >= 80) return random(5600, 7000);
    if (size >= 50) return random(4800, 6200);
    return random(4000, 5200);
  };

  const riseFor = (zoneY) => {
    if (reducedMotion.matches) return 0;
    const scale = isMobile() ? .58 : 1;
    const distance = zoneY >= 88 ? random(125, 185) : zoneY >= 70 ? random(105, 165) : random(82, 142);
    return -distance * scale;
  };

  const pickZone = (avoidIndex = -1) => {
    const available = zones()
      .map((zone, index) => ({ zone, index }))
      .filter(({ index }) => !occupiedZones.has(index) && index !== avoidIndex);

    if (available.length) return choose(available);

    const fallback = zones()
      .map((zone, index) => ({ zone, index }))
      .filter(({ index }) => index !== avoidIndex);

    return choose(fallback.length ? fallback : zones().map((zone, index) => ({ zone, index })));
  };

  const particleBudget = () => isMobile() ? 150 : 260;

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

  const createCloud = ({ x, y }, color, mix, size) => {
    const count = size < 45 ? 11 : size < 75 ? 17 : 24;
    const spread = Math.max(18, size * .42);

    for (let i = 0; i < count; i += 1) {
      const speck = document.createElement('span');
      speck.className = 'ambient-cloud-speck';

      const speckSize = random(4, Math.max(7, size * .13));
      const angle = random(0, Math.PI * 2);
      const radius = random(spread * .18, spread);
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius * .72;
      const duration = reducedMotion.matches ? 170 : random(330, 470);
      const startOpacity = random(.18, .42);

      speck.style.left = `${x}px`;
      speck.style.top = `${y}px`;
      speck.style.setProperty('--cloud-size', `${speckSize}px`);
      speck.style.setProperty('--cloud-color', color);
      speck.style.setProperty('--cloud-mix', `${Math.min(82, Number(mix) + random(12, 24))}%`);

      layer.appendChild(speck);

      const animation = speck.animate([
        {
          transform: 'translate3d(-50%, -50%, 0) scale(.35)',
          opacity: 0,
          filter: 'blur(0px)',
          offset: 0
        },
        {
          transform: `translate3d(calc(-50% + ${dx * .42}px), calc(-50% + ${dy * .42}px), 0) scale(.92)`,
          opacity: startOpacity,
          filter: 'blur(.7px)',
          offset: .42
        },
        {
          transform: `translate3d(calc(-50% + ${dx}px), calc(-50% + ${dy}px), 0) scale(1.35)`,
          opacity: 0,
          filter: 'blur(1.8px)',
          offset: 1
        }
      ], {
        duration,
        delay: random(0, 55),
        easing: 'cubic-bezier(.2,.6,.2,1)',
        fill: 'forwards'
      });

      animation.addEventListener('finish', () => speck.remove(), { once: true });
    }
  };

  const createDust = (origin, color, mix, size) => {
    const wanted = size < 45 ? 38 : size < 75 ? 54 : 72;
    const room = Math.max(18, particleBudget() - activeParticles);
    const count = Math.min(wanted, room);
    const sizeFactor = Math.max(.72, size / 72);
    const maxFall = Math.max(100, origin.layerRect.height - origin.y + 90);

    const baseDuration = reducedMotion.matches
      ? 320
      : size < 45
        ? random(850, 1030)
        : size < 75
          ? random(1030, 1240)
          : random(1280, 1500);

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'ambient-particle';

      const fineDust = Math.random() < .66;
      const pSize = fineDust ? random(1, 2.9) : random(2.8, 6.8);
      const pHeight = Math.max(1, pSize * random(.5, 1.55));
      const vx = random(-54, 54) * Math.min(1.16, sizeFactor);
      const lift = random(-28, 12);
      const longFall = Math.random() < .38;
      const rawFall = (longFall ? random(190, 340) : random(90, 190)) * Math.min(1.15, sizeFactor);
      const fall = Math.min(rawFall, maxFall);
      const rotation = random(-240, 240);
      const linger = fineDust ? random(40, 180) : random(0, 80);
      const duration = baseDuration + (longFall ? random(100, 230) : random(-40, 100)) + linger;
      const delay = random(0, 85);
      const startOpacity = fineDust ? random(.34, .68) : random(.48, .78);

      particle.style.left = `${origin.x}px`;
      particle.style.top = `${origin.y}px`;
      particle.style.setProperty('--particle-size', `${pSize}px`);
      particle.style.setProperty('--particle-height', `${pHeight}px`);
      particle.style.setProperty('--particle-radius', `${random(12, 48)}% ${random(7, 36)}%`);
      particle.style.setProperty('--particle-color', color);
      particle.style.setProperty('--particle-mix', `${Math.min(92, Number(mix) + random(16, 30))}%`);
      particle.style.setProperty('--particle-opacity', String(startOpacity));

      layer.appendChild(particle);
      activeParticles += 1;

      const animation = particle.animate([
        {
          transform: 'translate3d(-50%, -50%, 0) rotate(0deg) scale(.72)',
          opacity: startOpacity * .72,
          offset: 0
        },
        {
          transform: `translate3d(calc(-50% + ${vx * .3}px), calc(-50% + ${lift}px), 0) rotate(${rotation * .16}deg) scale(1)`,
          opacity: startOpacity,
          offset: .18
        },
        {
          transform: `translate3d(calc(-50% + ${vx * .62}px), calc(-50% + ${lift + fall * .24}px), 0) rotate(${rotation * .46}deg) scale(.86)`,
          opacity: startOpacity * .82,
          offset: .48
        },
        {
          transform: `translate3d(calc(-50% + ${vx * .88}px), calc(-50% + ${lift + fall * .7}px), 0) rotate(${rotation * .78}deg) scale(.48)`,
          opacity: startOpacity * .36,
          offset: .8
        },
        {
          transform: `translate3d(calc(-50% + ${vx}px), calc(-50% + ${lift + fall}px), 0) rotate(${rotation}deg) scale(.1)`,
          opacity: 0,
          offset: 1
        }
      ], {
        duration,
        delay,
        easing: 'cubic-bezier(.12,.46,.16,1)',
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
    square.classList.add('is-compressing');

    const zoneIndex = Number(square.dataset.zoneIndex);
    const size = Number(square.dataset.size);
    const color = square.dataset.color;
    const mix = Number(square.dataset.mix);
    const token = Number(square.dataset.generation);
    const compressionDuration = reducedMotion.matches ? 90 : random(125, 175);
    const cloudDuration = reducedMotion.matches ? 150 : random(230, 315);

    window.setTimeout(() => {
      if (!square.isConnected || token !== Number(square.dataset.generation)) return;

      square.classList.remove('is-compressing');
      square.classList.add('is-clouding');

      const origin = coordinatesFor(square);
      createCloud(origin, color, mix, size);

      window.setTimeout(() => {
        if (!square.isConnected || token !== Number(square.dataset.generation)) return;

        const dustOrigin = coordinatesFor(square);
        createDust(dustOrigin, color, mix, size);

        occupiedZones.delete(zoneIndex);
        liveSquares.delete(square);
        square.remove();

        const respawnDelay = reducedMotion.matches ? 1600 : random(2400, 3900);
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

  function spawnSquare(index, avoidZone = -1) {
    if (liveSquares.size >= targetCount()) return;

    const picked = pickZone(avoidZone);
    if (!picked) return;

    occupiedZones.add(picked.index);

    const square = document.createElement('span');
    const motion = document.createElement('span');
    const sway = document.createElement('span');
    const shape = document.createElement('span');
    const size = sizeFor(index);
    const color = choose(COLORS);
    const rotation = random(-10, 12);
    const depth = depthFor();
    const growthDuration = growthDurationFor(size);
    const driftScale = isMobile() ? .66 : 1;
    const localGeneration = ++generation;

    square.className = 'ambient-square';
    square.dataset.state = 'entering';
    square.dataset.zoneIndex = String(picked.index);
    square.dataset.size = String(size);
    square.dataset.color = color;
    square.dataset.mix = String(depth.mix);
    square.dataset.generation = String(localGeneration);

    square.style.setProperty('--ambient-left', `${picked.zone.x}%`);
    square.style.setProperty('--ambient-top', `${picked.zone.y}%`);
    square.style.setProperty('--ambient-size', `${size}px`);
    square.style.setProperty('--ambient-color', color);
    square.style.setProperty('--ambient-mix', `${depth.mix}%`);
    square.style.setProperty('--ambient-opacity', String(depth.opacity));
    square.style.setProperty('--ambient-blur', `${depth.blur}px`);
    square.style.setProperty('--ambient-rotation', `${rotation}deg`);
    square.style.setProperty('--ambient-start-scale', String(random(.22, .4)));
    square.style.setProperty('--ambient-grow-duration', `${growthDuration}ms`);
    square.style.setProperty('--ambient-rise-y', `${riseFor(picked.zone.y)}px`);
    square.style.setProperty('--ambient-rise-duration', `${reducedMotion.matches ? 1 : random(28, 42)}s`);
    square.style.setProperty('--ambient-sway-x', `${signedRange(24, 50) * driftScale}px`);
    square.style.setProperty('--ambient-sway-y', `${random(-10, 8) * driftScale}px`);
    square.style.setProperty('--ambient-sway-rotation', `${random(-5.5, 5.5)}deg`);
    square.style.setProperty('--ambient-sway-duration', `${random(8, 13)}s`);
    square.style.setProperty('--ambient-sway-delay', `${random(-5, 0)}s`);

    motion.className = 'ambient-square-motion';
    sway.className = 'ambient-square-sway';
    shape.className = 'ambient-square-shape';

    sway.appendChild(shape);
    motion.appendChild(sway);
    square.appendChild(motion);
    layer.appendChild(square);
    liveSquares.add(square);
    bindInteraction(square, shape);

    window.setTimeout(() => {
      if (!square.isConnected) return;
      square.classList.add('is-ready');

      window.setTimeout(() => {
        if (!square.isConnected) return;
        square.dataset.state = 'ready';
      }, growthDuration + 70);
    }, random(45, 140));
  }

  const seed = () => {
    const count = targetCount();
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => spawnSquare(i), 170 + i * random(210, 330));
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
