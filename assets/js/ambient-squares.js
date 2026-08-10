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
    { x: 4.6, y: 18 },
    { x: 95.2, y: 22 },
    { x: 4.2, y: 74 },
    { x: 95.5, y: 72 },
    { x: 53, y: 5.5 },
    { x: 51, y: 94 }
  ];

  const mobileZones = [
    { x: 7, y: 11 },
    { x: 93, y: 15 },
    { x: 7, y: 84 },
    { x: 92, y: 88 }
  ];

  const liveSquares = new Set();
  const occupiedZones = new Set();
  let activeParticles = 0;
  let generation = 0;

  const random = (min, max) => Math.random() * (max - min) + min;
  const choose = (items) => items[Math.floor(Math.random() * items.length)];

  const isMobile = () => window.innerWidth <= 820;
  const zones = () => isMobile() ? mobileZones : desktopZones;
  const targetCount = () => isMobile() ? 2 : 4;

  const sizeFor = (index) => {
    if (isMobile()) return index === 0 ? random(42, 50) : random(27, 35);
    if (index === 0) return random(68, 78);
    if (index === 1 || index === 2) return random(42, 52);
    return random(24, 30);
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

  const particleBudget = () => isMobile() ? 42 : 82;

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

      const wanted = size < 36 ? 14 : size < 60 ? 21 : 29;
      const room = Math.max(8, particleBudget() - activeParticles);
      const count = Math.min(wanted, room);
      const durationBase = reducedMotion.matches ? 260 : random(430, 560);

      for (let i = 0; i < count; i += 1) {
        const particle = document.createElement('span');
        particle.className = 'ambient-particle';

        const pSize = random(2.2, 6.6);
        const pHeight = Math.max(2, pSize * random(.55, 1.35));
        const vx = random(-34, 34) * (size / 58);
        const lift = random(-22, 8);
        const fall = random(24, 68) * (size / 58);
        const rotation = random(-150, 150);
        const duration = durationBase + random(-45, 85);
        const delay = random(0, 28);

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.setProperty('--particle-size', `${pSize}px`);
        particle.style.setProperty('--particle-height', `${pHeight}px`);
        particle.style.setProperty('--particle-radius', `${random(16, 42)}% ${random(8, 30)}%`);
        particle.style.setProperty('--particle-color', color);
        particle.style.setProperty('--particle-opacity', String(random(.56, .92)));

        layer.appendChild(particle);
        activeParticles += 1;

        const animation = particle.animate([
          {
            transform: 'translate3d(-50%, -50%, 0) rotate(0deg) scale(1)',
            opacity: Number(particle.style.getPropertyValue('--particle-opacity')) || .8,
            offset: 0
          },
          {
            transform: `translate3d(calc(-50% + ${vx * .52}px), calc(-50% + ${lift}px), 0) rotate(${rotation * .35}deg) scale(.92)`,
            opacity: .82,
            offset: .28
          },
          {
            transform: `translate3d(calc(-50% + ${vx}px), calc(-50% + ${lift + fall}px), 0) rotate(${rotation}deg) scale(.28)`,
            opacity: 0,
            offset: 1
          }
        ], {
          duration,
          delay,
          easing: 'cubic-bezier(.18,.72,.25,1)',
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

      const respawnDelay = reducedMotion.matches ? 1700 : random(2500, 4000);
      window.setTimeout(() => {
        if (liveSquares.size < targetCount()) spawnSquare(liveSquares.size, zoneIndex);
      }, respawnDelay);
    }, 84);
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
    const driftScale = isMobile() ? .62 : 1;
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
    square.style.setProperty('--ambient-rotation', `${rotation}deg`);
    square.style.setProperty('--ambient-drift-x', `${random(-42, 42) * driftScale}px`);
    square.style.setProperty('--ambient-drift-y', `${random(-36, 36) * driftScale}px`);
    square.style.setProperty('--ambient-duration', `${random(12, 18)}s`);
    square.style.setProperty('--ambient-delay', `${random(-5, 0)}s`);

    shape.className = 'ambient-square-shape';
    square.appendChild(shape);
    layer.appendChild(square);
    liveSquares.add(square);
    bindInteraction(square);

    const entryDelay = random(40, 140);
    window.setTimeout(() => {
      if (!square.isConnected) return;
      square.classList.add('is-ready');
      window.setTimeout(() => {
        if (!square.isConnected) return;
        square.dataset.state = 'ready';
      }, reducedMotion.matches ? 190 : 590);
    }, entryDelay);
  }

  const seed = () => {
    const count = targetCount();
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => spawnSquare(i), 260 + i * random(210, 330));
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
