/* ── CUSTOM CURSOR ──────────────────────────────── */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

if (cursor && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .stat, .proj-card, .course-cell, .edu-seal, .edu-badge').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

/* ── INTRO SCREEN ───────────────────────────────── */
const intro = document.getElementById('intro');
if (intro) {
  if (sessionStorage.getItem('introSeen')) {
    intro.classList.add('hidden');
  } else {
    sessionStorage.setItem('introSeen', '1');
    setTimeout(() => intro.classList.add('hidden'), 1400);
  }
}

/* ── NAV SCROLL ─────────────────────────────────── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── ACTIVE NAV LINK (single-page anchor tracking) ── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-links li a');

if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.25, rootMargin: '-68px 0px 0px 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

/* ── MOBILE NAV TOGGLE ──────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  document.querySelectorAll('.nav-mobile a').forEach(a => {
    a.addEventListener('click', () => document.body.classList.remove('nav-open'));
  });
}

/* ── SCROLL REVEAL ──────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left');
if (revealEls.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => obs.observe(el));
}

/* ── STAT COUNTER ANIMATION ─────────────────────── */
function animateCounter(el, target, suffix, duration = 1200) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');

  function update(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - elapsed, 3);
    const current = isDecimal
      ? (target * ease).toFixed(1)
      : Math.round(target * ease);
    el.textContent = current + suffix;
    if (elapsed < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(update);
}

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const counterData = [
    { selector: '.stat:nth-child(1) .stat-num', value: 8, suffix: '', acc: '+', accSuffix: '' },
    { selector: '.stat:nth-child(2) .stat-num', value: 3, suffix: '', acc: 'rd', accSuffix: '' },
    { selector: '.stat:nth-child(3) .stat-num', value: 2, suffix: '', acc: '×', accSuffix: '' },
  ];

  let countersRun = false;
  const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersRun) {
      countersRun = true;
      counterData.forEach(({ selector, value, acc }) => {
        const numEl = document.querySelector(selector);
        if (!numEl) return;
        const accEl = numEl.querySelector('.acc');
        const accText = accEl ? accEl.textContent : '';
        // Clear and animate
        numEl.childNodes.forEach(n => { if (n.nodeType === 3) n.textContent = ''; });
        const textNode = document.createTextNode('0');
        numEl.insertBefore(textNode, numEl.firstChild);
        animateCounter(textNode, value, '', 1000 + Math.random() * 300);
      });
    }
  }, { threshold: 0.4 });
  statsObs.observe(statsBar);
}

/* ── PARALLAX HERO IMAGE ─────────────────────────── */
const heroRight = document.querySelector('.hero-right');
if (heroRight) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const img = heroRight.querySelector('img');
        if (img && scrollY < window.innerHeight) {
          img.style.transform = `translateY(${scrollY * 0.18}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── MAGNETIC BUTTONS ───────────────────────────── */
document.querySelectorAll('.btn-blue').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── TILT ON PROJECT CARDS ──────────────────────── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease, background 0.35s ease, box-shadow 0.35s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});
