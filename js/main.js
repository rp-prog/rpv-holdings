const nav = document.getElementById('nav');
const btn = document.getElementById('menuBtn');
const loader = document.getElementById('loader');
const bar = document.getElementById('progress');
const crest = document.getElementById('heroCrest');
const system = document.getElementById('system');
const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursorDot');
const spotlight = document.getElementById('spotlight');
const sky = document.getElementById('sky');
const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
const look = { x: 0, y: 0, tx: 0, ty: 0 };
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
window.addEventListener('load', () => { setTimeout(() => loader && loader.classList.add('hide'), 700); });
function inHero() { return window.scrollY < innerHeight * 0.92; }
function render() {
  look.x += (look.tx - look.x) * 0.08;
  look.y += (look.ty - look.y) * 0.08;
  const y = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  nav.classList.toggle('scrolled', y > 16);
  if (bar) bar.style.width = `${(y / max) * 100}%`;
  if (inHero()) {
    if (system) system.style.transform = `translate3d(${look.x * 36}px, ${look.y * 24}px, 0)`;
    if (crest) crest.style.transform = `rotateX(${-look.y * 12}deg) rotateY(${look.x * 16}deg)`;
    if (spotlight && finePointer) spotlight.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
  }
  requestAnimationFrame(render);
}
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  if (!inHero()) return;
  look.tx = (e.clientX / innerWidth - 0.5) * 2;
  look.ty = (e.clientY / innerHeight - 0.5) * 2;
  if (cursor) cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  if (dot) dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
}, { passive: true });
if (!reduce) requestAnimationFrame(render);
if (btn) btn.addEventListener('click', () => nav.classList.toggle('open'));
if (nav) nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
document.querySelectorAll('a, button, input, textarea').forEach((el) => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));
});
const glowables = [...document.querySelectorAll('.card, .cell, .fact, .strip div, .contact-card, form')];
glowables.forEach((el) => {
  el.classList.add('glowable');
  const on = () => { glowables.forEach((n) => n.classList.remove('lit')); el.classList.add('lit'); };
  el.addEventListener('mouseenter', on);
  el.addEventListener('mouseleave', () => el.classList.remove('lit'));
  el.addEventListener('touchstart', on, { passive: true });
});
if (sky && !reduce) {
  const ctx = sky.getContext('2d');
  const stars = [];
  const rebuild = () => {
    const box = sky.getBoundingClientRect();
    sky.width = Math.max(1, box.width);
    sky.height = Math.max(1, box.height);
    stars.length = 0;
    const n = Math.min(finePointer ? 160 : 60, Math.floor((sky.width * sky.height) / 16000));
    for (let i = 0; i < n; i++) stars.push({ x: Math.random(), y: Math.random(), z: Math.random(), r: Math.random() * 1.2 + 0.2, phase: Math.random() * Math.PI * 2, speed: 0.01 + Math.random() * 0.016, gold: Math.random() > 0.7 });
  };
  rebuild();
  window.addEventListener('resize', rebuild);
  const draw = () => {
    const w = sky.width, h = sky.height;
    ctx.clearRect(0, 0, w, h);
    stars.forEach((s) => {
      s.phase += s.speed;
      const tw = 0.25 + Math.abs(Math.sin(s.phase)) * 0.75;
      const depth = 0.35 + s.z * 0.65;
      ctx.beginPath();
      ctx.fillStyle = s.gold ? `rgba(232,208,150,${tw * depth})` : `rgba(214,228,245,${tw * depth})`;
      ctx.arc(s.x * w, s.y * h, s.r * depth, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
