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

  const desktopZones = [
    { x: 6, y: 16 },
    { x: 48, y: 8 },
    { x: 94, y: 17 },
    { x: 7, y: 49 },
    { x: 48, y: 46 },
    { x: 94, y: 50 },
    { x: 7, y: 82 },
    { x: 46, y: 88 },
    { x: 94, y: 82 },
    { x: 72, y: 94 }
  ];

  const mobileZones = [
    { x: 8, y: 12 },
    { x: 91, y: 16 },
    { x: 7, y: 48 },
    { x: 92, y: 54 },
    { x: 8, y: 86 },
    { x: 90, y: 88 }
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
      if (index === 0) return random(58, 72);
      if (index === 1) return random(38, 50);
      return random(30, 40);
    }

    const slot = index % 7;
    if (slot === 0) return random(88, 108);
    if (slot === 1) return random(56, 70);
    if (slot === 2) return random(34, 44);
    if (slot === 3) return random(52, 66);
    if (slot === 4) return random(74, 92);
    if (slot === 5) return random(46, 60);
    return random(30, 40);
  };

  const depthFor = () => {
    const roll = Math.random();
    if (roll < .32) {
      return {
        opacity: random(.48, .56),
        blur: random(.75, 1.35),
        mix: random(55, 62)
      };
    }
    if (roll < .7) {
      return {
        opacity: random(.55, .63),
        blur: random(.25, .75),
        mix: random(59, 67)
      };
    }
    return {
      opacity: random(.62, .69),
      blur: random(0, .3),
      mix: random(63, 71)
    };
  };

  const growthDurationFor = (size) => {
    if (reducedMotion.matches) return 220;
    if (size >= 78) return random(4700, 5800);
    if (size >= 48) return random(3700, 4900);
    return random(2900, 3900);
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

  const particleBudget = () => isMobile() ? 92 : 180;

  const burst = (square) => {
    if (!square || square.dataset.state !== 'ready') return;
    square.dataset.state = 'bursting';
    square.classList.add('is-compressing');

    const zoneIndex = Number(square.dataset.zoneIndex);
    const size = Number(square.dataset.size);
    const color = square.dataset.color;
    const token = Number(square.dataset.generation);

    window.setTimeout(() => {
      if (!square.isConnected || token !== Number(square.dataset.generation)) return;

      const layerRect = layer.getBoundingClientRect();
      const rect = square.getBoundingClientRect();
      const centerX = rect.left - layerRect.left + rect.width / 2;
      const centerY = rect.top - layerRect.top + rect.height / 2;

      const wanted = size < 45 ? 24 : size < 75 ? 36 : 50;
      const room = Math.max(14, particleBudget() - activeParticles);
      const count = Math.min(wanted, room);
      const durationBase = reducedMotion.matches ? 280 : random(650, 860);
      const maxFall = Math.max(80, layerRect.height - centerY + 72);

      for (let i = 0; i < count; i += 1) {
        const particle = document.createElement('span');
        particle.className = 'ambient-particle';

        const fineDust = Math.random() < .58;
        const pSize = fineDust ? random(1.2, 3.2) : random(3, 6.6);
        const pHeight = Math.max(1.2, pSize * random(.5, 1.5));
        const sizeFactor = Math.max(.72, size / 72);
        const vx = random(-48, 48) * sizeFactor;
        const lift = random(-34, 10);
        const longFall = Math.random() < .26;
        const rawFall = (longFall ? random(145, 265) : random(72, 150)) * Math.min(1.18, sizeFactor);
        const fall = Math.min(rawFall, maxFall);
        const rotation = random(-210, 210);
        const duration = durationBase + (longFall ? random(130, 280) : random(-35, 120));
        const delay = random(0, 42);
        const startOpacity = random(.5, .9);

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--particle-size', `${pSize}px`);
        particle.style.setProperty('--particle-height', `${pHeight}px`);
        particle.style.setProperty('--particle-radius', `${random(12, 46)}% ${random(7, 34)}%`);
        particle.style.setProperty('--particle-color', color);
        particle.style.setProperty('--particle-opacity', String(startOpacity));

        layer.appendChild(particle);
        activeParticles += 1;

        const animation = particle.animate([
          {
            transform: 'translate3d(-50%, -50%, 0) rotate(0deg) scale(1)',
            opacity: startOpacity,
            offset: 0
          },
          {
            transform: `translate3d(calc(-50% + ${vx * .42}px), calc(-50% + ${lift}px), 0) rotate(${rotation * .24}deg) scale(.96)`,
            opacity: Math.min(.9, startOpacity + .06),
            offset: .22
          },
          {
            transform: `translate3d(calc(-50% + ${vx * .76}px), calc(-50% + ${lift + fall * .38}px), 0) rotate(${rotation * .58}deg) scale(.7)`,
            opacity: startOpacity * .68,
            offset: .58
          },
          {
            transform: `translate3d(calc(-50% + ${vx}px), calc(-50% + ${lift + fall}px), 0) rotate(${rotation}deg) scale(.12)`,
            opacity: 0,
            offset: 1
          }
        ], {
          duration,
          delay,
          easing: 'cubic-bezier(.16,.56,.18,1)',
          fill: 'forwards'
        });

        animation.addEventListener('finish', () => {
          particle.remove();
          activeParticles = Math.max(0, activeParticles - 1);
        }, { once: true });
      }

      occupiedZones.delete(zoneIndex);
      liveSquares.delete(square);
      square.remove();

      const respawnDelay = reducedMotion.matches ? 1500 : random(2100, 3400);
      window.setTimeout(() => {
        if (liveSquares.size < targetCount()) spawnSquare(liveSquares.size, zoneIndex);
      }, respawnDelay);
    }, 88);
  };

  const bindInteraction = (square) => {
    square.addEventListener('pointerenter', () => {
      if (finePointer.matches) burst(square);
    });

    square.addEventListener('pointerdown', (event) => {
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
    const shape = document.createElement('span');
    const size = sizeFor(index);
    const color = choose(COLORS);
    const rotation = random(-10, 12);
    const depth = depthFor();
    const growthDuration = growthDurationFor(size);
    const driftScale = isMobile() ? .68 : 1;
    const localGeneration = ++generation;

    square.className = 'ambient-square';
    square.dataset.state = 'entering';
    square.dataset.zoneIndex = String(picked.index);
    square.dataset.size = String(size);
    square.dataset.color = color;
    square.dataset.generation = String(localGeneration);

    square.style.setProperty('--ambient-left', `${picked.zone.x}%`);
    square.style.setProperty('--ambient-top', `${picked.zone.y}%`);
    square.style.setProperty('--ambient-size', `${size}px`);
    square.style.setProperty('--ambient-color', color);
    square.style.setProperty('--ambient-mix', `${depth.mix}%`);
    square.style.setProperty('--ambient-opacity', String(depth.opacity));
    square.style.setProperty('--ambient-blur', `${depth.blur}px`);
    square.style.setProperty('--ambient-rotation', `${rotation}deg`);
    square.style.setProperty('--ambient-start-scale', String(random(.3, .45)));
    square.style.setProperty('--ambient-grow-duration', `${growthDuration}ms`);
    square.style.setProperty('--ambient-drift-mid-x', `${random(-34, 34) * driftScale}px`);
    square.style.setProperty('--ambient-drift-mid-y', `${random(-28, 28) * driftScale}px`);
    square.style.setProperty('--ambient-drift-x', `${signedRange(30, 65) * driftScale}px`);
    square.style.setProperty('--ambient-drift-y', `${signedRange(20, 55) * driftScale}px`);
    square.style.setProperty('--ambient-drift-mid-rotation', `${random(-2.8, 2.8)}deg`);
    square.style.setProperty('--ambient-drift-rotation', `${random(-5.5, 5.5)}deg`);
    square.style.setProperty('--ambient-duration', `${random(10, 16)}s`);
    square.style.setProperty('--ambient-delay', `${random(-4, 0)}s`);

    shape.className = 'ambient-square-shape';
    square.appendChild(shape);
    layer.appendChild(square);
    liveSquares.add(square);
    bindInteraction(square);

    window.setTimeout(() => {
      if (!square.isConnected) return;
      square.classList.add('is-ready');

      window.setTimeout(() => {
        if (!square.isConnected) return;
        square.dataset.state = 'ready';
      }, growthDuration + 80);
    }, random(45, 135));
  }

  const seed = () => {
    const count = targetCount();
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => spawnSquare(i), 180 + i * random(185, 285));
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
