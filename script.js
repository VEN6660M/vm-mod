// ═══ VMMOD LANDING · SCRIPT ═══

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu toggle
function toggleMenu() {
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  burger.classList.toggle('open');
  mobile.classList.toggle('open');
}

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.feature-card, .step, .vip-card, .download-inner').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealObserver.observe(el);
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (!burger.contains(e.target) && !mobile.contains(e.target)) {
    burger.classList.remove('open');
    mobile.classList.remove('open');
  }
});
