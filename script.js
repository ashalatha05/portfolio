/* =============================================
   PORTFOLIO script.js
   Cursor trail · Dark mode · Mobile menu
   3D tilt · Sound effects · Typing · Parallax
   ============================================= */

/* ── 1. CURSOR TRAIL (canvas paint dots) ── */
const canvas = document.getElementById('trail-canvas');
const ctx    = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

const trail = [];
const MAX_TRAIL = 28;
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  trail.push({ x: mx, y: my, life: 1.0 });
  if (trail.length > MAX_TRAIL) trail.shift();
});

function drawTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < trail.length; i++) {
    const t    = trail[i];
    const frac = i / trail.length;
    t.life    -= 0.04;
    if (t.life <= 0) continue;

    ctx.beginPath();
    ctx.arc(t.x, t.y, frac * 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,60,0,${t.life * frac * 0.6})`;
    ctx.fill();
  }
  requestAnimationFrame(drawTrail);
}
drawTrail();


/* ── 2. SMOOTH CURSOR ── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';
});
(function animCursor() {
  curX += (mx - curX) * 0.12;
  curY += (my - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a,button,.tilt-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width='55px'; cursor.style.height='55px'; });
  el.addEventListener('mouseleave', () => { cursor.style.width='38px'; cursor.style.height='38px'; });
});


/* ── 3. DARK MODE TOGGLE ── */
const themeBtn = document.getElementById('themeBtn');
let dark = false;
themeBtn.addEventListener('click', () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeBtn.textContent = dark ? '☀️' : '🌙';
  playSound('theme');
});


/* ── 4. SOUND EFFECTS ── */
let soundOn = false;
const soundBtn = document.getElementById('soundBtn');
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

soundBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  soundBtn.textContent = soundOn ? '🔊' : '🔇';
  if (!audioCtx) audioCtx = new AudioCtx();
  if (soundOn) playSound('on');
});

function playSound(type) {
  if (!soundOn && type !== 'on') return;
  if (!audioCtx) return;

  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'hover') {
    osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.type = 'sine';
  } else if (type === 'click') {
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    osc.type = 'square';
  } else if (type === 'theme') {
    osc.frequency.setValueAtTime(dark ? 200 : 800, now);
    osc.frequency.exponentialRampToValueAtTime(dark ? 100 : 1200, now + 0.2);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    osc.type = 'sine';
  } else if (type === 'on') {
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    osc.type = 'sine';
  }

  osc.start(now);
  osc.stop(now + 0.3);
}

// Add hover & click sounds to interactive elements
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => playSound('hover'));
  el.addEventListener('click',      () => playSound('click'));
});


/* ── 5. MOBILE MENU ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  playSound('click');
});
mobileClose.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
});
document.querySelectorAll('.mm-link').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


/* ── 6. 3D TILT on cursor inside card ── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const cx  = r.left + r.width  / 2;
    const cy  = r.top  + r.height / 2;
    const rx  = ((e.clientY - cy) / (r.height / 2)) * -10;
    const ry  = ((e.clientX - cx) / (r.width  / 2)) *  10;
    card.style.transform    = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    card.style.boxShadow    = `${-ry}px ${rx}px 25px rgba(255,60,0,0.12)`;
    card.style.transition   = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    card.style.boxShadow  = 'none';
    card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.6s ease';
  });
});


/* ── 7. PARALLAX HERO NAME ── */
const nameLines = document.querySelectorAll('.nm-line');
document.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  nameLines.forEach(l => {
    const d  = parseFloat(l.dataset.depth) || 0.03;
    l.style.transform = `translate(${dx * d * 50}px, ${dy * d * 25}px)`;
  });
});


/* ── 8. TYPING ANIMATION ── */
const phrases = ['Aspiring Software Developer','Python & Java Programmer','AWS Certified','Full Stack Learner','Building Real Things...'];
let pi=0, ci=0, del=false;
function type() {
  const p = phrases[pi];
  document.getElementById('typed').textContent = p.slice(0, ci);
  if (!del) { ci++; if (ci > p.length) { del=true; setTimeout(type,1400); return; } }
  else       { ci--; if (ci < 0)       { del=false; pi=(pi+1)%phrases.length; setTimeout(type,400); return; } }
  setTimeout(type, del ? 35 : 75);
}
type();


/* ── 9. SKILL BARS ── */
const fills = document.querySelectorAll('.sk-fill');
new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.style.width = e.target.dataset.w + '%'; });
}, { threshold: 0.4 }).observe
? (() => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.style.width = e.target.dataset.w + '%'; });
  }, { threshold: 0.4 });
  fills.forEach(f => obs.observe(f));
})() : null;


/* ── 10. SCROLL REVEAL ── */
document.querySelectorAll('section>*:not(.sec-num)').forEach((el,i) => {
  el.classList.add('reveal-up');
  el.style.transitionDelay = (i % 3) * 0.1 + 's';
});
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-up').forEach(el => revObs.observe(el));


/* ── 11. ACTIVE NAV ── */
const secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
  document.querySelectorAll('.nav-ul a').forEach(a => {
    const active = a.getAttribute('href') === '#' + cur;
    a.style.color   = active ? 'var(--accent)' : '';
    a.style.opacity = active ? '1' : '0.7';
  });
});


/* ── 12. MARQUEE pause on hover ── */
const marquee = document.querySelector('.marquee');
if (marquee) {
  marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState='paused');
  marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState='running');
}


/* ── 13. MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-raw,.btn-outline,.nav-cv').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
    btn.style.transform  = `translate(${dx}px,${dy}px)`;
    btn.style.transition = 'none';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform  = 'translate(0,0)';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
  });
});


/* ── 14. CONTACT FORM ── */
function submitForm(e) {
  e.preventDefault();
  const inputs  = e.target.querySelectorAll('input,textarea');
  const name    = inputs[0].value.trim();
  const email   = inputs[1].value.trim();
  const message = inputs[2].value.trim();
  const btn     = e.target.querySelector('button');
  if (!name || !email || !message) return;
  window.location.href = `mailto:ashalathapathivada@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
  btn.textContent = 'Sent ✓';
  btn.style.background = '#00cc44';
  btn.style.borderColor = '#00cc44';
  setTimeout(() => { btn.textContent='Send It →'; btn.style.background=''; btn.style.borderColor=''; }, 3000);
}