/* motion.js — Cinematic animation orchestration for AVIEL Health
   Uses GSAP + ScrollTrigger + Lenis (all loaded via script tags before this file)
*/

// ── 1. Smooth Scrolling with Lenis ───────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
});

// Tick Lenis inside GSAP's ticker so they stay in sync
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);

// Make anchor links work with Lenis smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -74, duration: 1.4 });
    }
  });
});

// ── 2. Header — hide on scroll down, reveal on scroll up ─────────────────────
let lastScrollY = 0;
const header = document.querySelector('header.site');

lenis.on('scroll', ({ scroll }) => {
  if (scroll > lastScrollY && scroll > 100) {
    header.style.transform = 'translateY(-100%)';
    header.style.transition = 'transform 0.35s ease';
  } else {
    header.style.transform = 'translateY(0)';
    header.style.transition = 'transform 0.25s ease';
  }
  lastScrollY = scroll;
});

// ── 3. Hero entrance — cinematic text reveal ──────────────────────────────────
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .fromTo('main .hero h1',
    { y: 60, opacity: 0, visibility: 'visible' },
    { y: 0, opacity: 1, duration: 1.1, delay: 0.15 }
  )
  .fromTo('main .hero .lede',
    { y: 36, opacity: 0, visibility: 'visible' },
    { y: 0, opacity: 1, duration: 1.0 },
    '-=0.75'
  )
  .fromTo('main .hero .cta-row',
    { y: 24, opacity: 0, visibility: 'visible' },
    { y: 0, opacity: 1, duration: 0.8 },
    '-=0.65'
  );

// ── 4. Scroll-triggered reveals (scoped to main only) ─────────────────────────
document.querySelectorAll(
  'main .card, main .timeline-item, main .fgrid > div, main section h2, main .pillars .pill, main .pillar'
).forEach((el, i) => {
  gsap.fromTo(
    el,
    { y: 48, opacity: 0, visibility: 'visible' },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power2.out',
      delay: (i % 4) * 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
    }
  );
});

// ── 5. Stats counter animation ────────────────────────────────────────────────
document.querySelectorAll('.stat .num').forEach((el) => {
  const finalText = el.textContent.trim();
  const numMatch = finalText.match(/[\d,]+/);
  if (!numMatch) return;

  const finalNum = parseInt(numMatch[0].replace(/,/g, ''), 10);
  if (isNaN(finalNum) || finalNum > 9999) return;

  const prefix = finalText.replace(/[\d,]+.*/, '');
  const suffix = finalText.replace(/.*[\d,]+/, '');

  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      gsap.fromTo(
        { val: 0 },
        {
          val: finalNum,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = prefix + Math.round(this.targets()[0].val).toLocaleString() + suffix;
          }
        }
      );
    },
  });
});
