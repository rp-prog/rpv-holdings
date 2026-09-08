const nav = document.getElementById('nav');
const btn = document.getElementById('menuBtn');
const loader = document.getElementById('loader');
const bar = document.getElementById('progress');
const crest = document.getElementById('heroCrest');
const system = document.getElementById('system');
const mini = document.getElementById('scrollCrest');
const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursorDot');
const spotlight = document.getElementById('spotlight');
const sky = document.getElementById('sky');
const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
const look = { x: 0, y: 0, tx: 0, ty: 0 };
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.addEventListener('load', () => { setTimeout(() => loader && loader.classList.add('hide'), 800); });
const live = [...document.querySelectorAll('.card, .cell, .fact, .strip div, .contact-card, form, h2, .portrait')];
const magnets = [...document.querySelectorAll('.btn, .nav-cta, .contact-card')];
function render() {
  look.x += (look.tx - look.x) * 0.08;
  look.y += (look.ty - look.y) * 0.08;
  const y = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const p = y / max;
  nav.classList.toggle('scrolled', y > 20);
  if (bar) bar.style.width = `${p * 100}%`;
  const spin = y * 0.18;
  if (system) system.style.transform = `translate3d(${look.x * 48}px, ${look.y * 32}px, 0)`;
  if (crest) crest.style.transform = `rotateX(${-look.y * 14}deg) rotateY(${look.x * 18}deg) rotateZ(${spin}deg)`;
  if (mini) {
    mini.classList.toggle('show', y > 240);
    mini.style.transform = `translate3d(${look.x * 14}px, ${look.y * 10}px, 0) rotate(${spin}deg)`;
  }
  if (spotlight) spotlight.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
  live.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const view = (r.top + r.height / 2) / innerHeight - 0.5;
    const dx = (mouse.x - (r.left + r.width / 2)) / Math.max(r.width, 1);
    const dy = (mouse.y - (r.top + r.height / 2)) / Math.max(r.height, 1);
    const near = Math.abs(dx) < 1.15 && Math.abs(dy) < 1.35;
    const driftX = look.x * (8 + (i % 5)) - view * 22;
    const driftY = look.y * 6 + view * 28 + Math.sin((p * 9) + i) * 4;
    el.style.transform = near
      ? `translate3d(${driftX + dx * 8}px, ${driftY + dy * 6}px, 0) rotateX(${(-dy * 6).toFixed(2)}deg) rotateY(${(dx * 7).toFixed(2)}deg)`
      : `translate3d(${driftX}px, ${driftY}px, 0)`;
  });
  magnets.forEach((el) => {
    const r = el.getBoundingClientRect();
    const dx = mouse.x - (r.left + r.width / 2);
    const dy = mouse.y - (r.top + r.height / 2);
    el.style.transform = Math.hypot(dx, dy) < 150 ? `translate(${dx * 0.12}px, ${dy * 0.12}px)` : '';
  });
  requestAnimationFrame(render);
}
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  look.tx = (e.clientX / innerWidth - 0.5) * 2;
  look.ty = (e.clientY / innerHeight - 0.5) * 2;
  if (cursor) cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  if (dot) dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
}, { passive: true });
if (!reduce) requestAnimationFrame(render);
if (btn) btn.addEventListener('click', () => nav.classList.toggle('open'));
if (nav) nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
  });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 90}ms`; io.observe(el); });
document.querySelectorAll('a, button, input, textarea').forEach((el) => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));
});
if (sky && !reduce) {
  const ctx = sky.getContext('2d');
  const stars = [];
  const rebuild = () => {
    sky.width = innerWidth; sky.height = innerHeight; stars.length = 0;
    const n = Math.min(240, Math.floor((innerWidth * innerHeight) / 13000));
    for (let i = 0; i < n; i++) {
      stars.push({ x: Math.random(), y: Math.random(), z: Math.random(), r: Math.random() * 1.3 + 0.15, phase: Math.random() * Math.PI * 2, speed: 0.008 + Math.random() * 0.018, gold: Math.random() > 0.7 });
    }
  };
  rebuild();
  window.addEventListener('resize', rebuild);
  const draw = () => {
    const w = sky.width, h = sky.height;
    ctx.clearRect(0, 0, w, h);
    const p = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    stars.forEach((s) => {
      s.phase += s.speed;
      const tw = 0.2 + Math.abs(Math.sin(s.phase)) * 0.8;
      const depth = 0.3 + s.z * 0.7;
      const sx = ((s.x + look.x * 0.01 * s.z) % 1 + 1) % 1 * w;
      const sy = ((s.y + p * (0.07 + s.z * 0.14)) % 1 + 1) % 1 * h;
      ctx.beginPath();
      ctx.fillStyle = s.gold ? `rgba(232,208,150,${tw * depth})` : `rgba(214,228,245,${tw * depth})`;
      ctx.arc(sx, sy, s.r * depth, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
