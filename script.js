/* =============================================
   TEJAS UPADHYAY — PORTFOLIO JAVASCRIPT
   ============================================= */

'use strict';

// ─── PARTICLE BACKGROUND ─────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.3 + 0.05;
    this.r = Math.random() * 1.5 + 0.5;
  };

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 65, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 65, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

// ─── HERO TERMINAL TYPING ANIMATION ──────────
(function initTypingAnimation() {
  const commands = [
    { cmd: 'whoami', outId: 'out1', nextId: 'line2', cmdId: 'cmd1' },
    { cmd: 'cat interests.txt', outId: 'out2', nextId: 'line3', cmdId: 'cmd2' }
  ];

  function typeText(element, text, speed, callback) {
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text[i++];
        setTimeout(type, speed);
      } else if (callback) {
        setTimeout(callback, 400);
      }
    }
    type();
  }

  function runCommand(index) {
    if (index >= commands.length) {
      // Show CTA
      const heroActions = document.getElementById('heroActions');
      if (heroActions) {
        setTimeout(() => { heroActions.style.opacity = '1'; }, 300);
      }
      return;
    }

    const { cmd, outId, nextId, cmdId } = commands[index];
    const cmdEl = document.getElementById(cmdId);
    const outEl = document.getElementById(outId);
    const nextEl = document.getElementById(nextId);

    typeText(cmdEl, cmd, 60, () => {
      if (outEl) {
        outEl.style.display = 'block';
      }
      if (nextEl) {
        setTimeout(() => {
          nextEl.style.display = 'flex';
          runCommand(index + 1);
        }, 600);
      } else {
        runCommand(index + 1);
      }
    });
  }

  setTimeout(() => runCommand(0), 600);
})();

// ─── MOBILE NAV ───────────────────────────────
(function initMobileNav() {
  const toggle = document.getElementById('menuToggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
})();

// ─── ACTIVE NAV HIGHLIGHT ─────────────────────
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) current = sec.id;
    });

    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ─── NAV BACKGROUND ON SCROLL ─────────────────
(function initNavScroll() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.borderBottomColor = 'rgba(0,255,65,0.2)';
    } else {
      nav.style.borderBottomColor = '';
    }
  }, { passive: true });
})();

// ─── SCROLL FADE-IN ANIMATIONS ────────────────
(function initScrollAnimations() {
  const targets = [
    '#about', '#skills', '#experience', '#projects', '#contact',
    '.skill-card', '.project-card', '.timeline-item',
    '.stat', '.about-terminal', '.contact-terminal', '.contact-link'
  ];

  const elements = document.querySelectorAll(targets.join(', '));

  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80 * i);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ─── STATS COUNTER ANIMATION ──────────────────
(function initCounters() {
  const stats = [
    { id: 'stat-1', target: 4,  suffix: '', duration: 800 },
    { id: 'stat-2', target: 13, suffix: '+', duration: 1000 },
  ];

  stats.forEach(({ id, target, suffix, duration }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const numEl = el.querySelector('.stat-num');
    if (!numEl) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / (duration / 16);
          const tick = () => {
            start = Math.min(start + step, target);
            numEl.textContent = Math.floor(start) + suffix;
            if (start < target) requestAnimationFrame(tick);
          };
          tick();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(el);
  });
})();

// ─── GLITCH EFFECT ON HOVER ───────────────────
(function initGlitch() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;

  logo.addEventListener('mouseenter', () => {
    logo.style.textShadow = '2px 0 #f00, -2px 0 #0f0';
    logo.style.transition = 'none';
    setTimeout(() => {
      logo.style.textShadow = '';
      logo.style.transition = '';
    }, 150);
  });
})();

// ─── SMOOTH SECTION TRANSITIONS ───────────────
(function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ─── CURSOR GLOW TRAIL ────────────────────────
(function initCursorGlow() {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(0,255,65,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    will-change: left, top;
  `;
  document.body.appendChild(trail);

  window.addEventListener('mousemove', e => {
    trail.style.left = e.clientX + 'px';
    trail.style.top  = e.clientY + 'px';
  }, { passive: true });
})();
