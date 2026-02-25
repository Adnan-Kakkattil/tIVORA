/* ================================================
   TIVORA ELECTRONICS — main.js
   Professional scroll animations & interactions
================================================ */

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger && hamburger.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  Object.assign(navLinks.style, {
    display: open ? 'none' : 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '66px', left: '0', right: '0',
    background: 'rgba(255,255,255,.98)',
    padding: '18px 28px 24px',
    gap: '4px',
    borderBottom: '1px solid rgba(0,0,0,.07)',
    backdropFilter: 'blur(20px)',
    zIndex: '998',
    boxShadow: '0 8px 32px rgba(0,0,0,.1)'
  });
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth < 768) navLinks.style.display = 'none';
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const match = a.getAttribute('href') === `#${current}`;
    a.classList.toggle('active', match);
  });
}, { passive: true });

// ---- INJECTION: Add animated divider to section headers ----
document.querySelectorAll('.section-header').forEach(el => {
  if (!el.querySelector('.divider')) {
    const d = document.createElement('span');
    d.className = 'divider';
    el.appendChild(d);
  }
});

// ---- SCROLL ANIMATION ENGINE ----
function initAnimations() {
  // Assign animation classes to elements that need them
  const map = [
    ['.col-card', 'anim-up'],
    ['.size-card', 'anim-scale'],
    ['.product-card', 'anim-up'],
    ['.testi-card', 'anim-up'],
    ['.process-step', 'anim-up'],
    ['.promise-card', 'anim-scale'],
    ['.sector', 'anim-scale'],
    ['.tech-feat', 'anim-up'],
    ['.b2b-feat', 'anim-up'],
    ['.sound-feat', 'anim-up'],
    ['.p-tag', 'anim-up'],
    ['.section-header', 'anim-up'],
  ];

  map.forEach(([sel, cls]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('anim-up') &&
        !el.classList.contains('anim-left') &&
        !el.classList.contains('anim-right') &&
        !el.classList.contains('anim-scale')) {
        el.classList.add(cls);
      }
      // Add stagger delays
      const delay = ['d1', 'd2', 'd3', 'd4', 'd5'][(i % 5)];
      if (!el.classList.contains('d1') && !el.classList.contains('d2') &&
        !el.classList.contains('d3') && !el.classList.contains('d4') &&
        !el.classList.contains('d5')) {
        el.classList.add(delay);
      }
    });
  });
}

// Intersection observer for triggering animations
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('in-view');

    // Section header: also trigger divider
    if (el.classList.contains('section-header')) {
      el.classList.add('in-view');
    }

    // Counters
    const numEl = el.querySelector('.pc-num');
    if (numEl && !numEl.dataset.done) {
      numEl.dataset.done = '1';
      animateCount(numEl);
    }

    io.unobserve(el);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

function observeAll() {
  document.querySelectorAll(
    '.anim-up,.anim-left,.anim-right,.anim-scale,.section-header,.promise-card'
  ).forEach(el => io.observe(el));
}

// ---- COUNTER ANIMATION ----
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const dec = !Number.isInteger(target) || target <= 10;
  const dur = 1800;
  const fps = 1000 / 60;
  const frames = Math.round(dur / fps);
  const ease = t => 1 - Math.pow(1 - t, 3);
  let f = 0;
  const interval = setInterval(() => {
    f++;
    const val = target * ease(f / frames);
    el.textContent = dec ? val.toFixed(1) : Math.floor(val).toLocaleString('en-IN');
    if (f >= frames) {
      clearInterval(interval);
      el.textContent = dec ? target.toFixed(1) : target.toLocaleString('en-IN');
    }
  }, fps);
}

// ---- COLLECTION TABS ----
document.querySelectorAll('.col-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.col-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ---- CONTACT FORM ----
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = '✅ Sent! We\'ll call you shortly.';
  btn.style.background = '#10b981';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Enquiry';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
}

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- CARD HOVER 3D TILT ----
document.querySelectorAll('.product-card,.col-card,.testi-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transition = 'transform .1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease, box-shadow .4s ease, border-color .3s ease';
  });
});

// ---- INIT ----
initAnimations();
observeAll();

console.log('%c🔴 Tivora Electronics — Built for Kerala', 'color:#e63946;font-weight:800;font-size:13px');
