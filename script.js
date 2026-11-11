// ═══ VMMOD LANDING · SCRIPT ═══

// Theme toggle
(function () {
  const saved = localStorage.getItem('vmmod-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

// Particle burst on theme toggle
function spawnThemeParticles(originEl, isDark) {
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // Dark→Light: warm gold/orange sparks; Light→Dark: cyan/purple stars
  const palettes = {
    light: ['#ffd700', '#ffb347', '#ff8c42', '#fff176', '#ffe082'],
    dark:  ['#00d4ff', '#7c3aed', '#ff6b35', '#00ff88', '#c084fc']
  };
  const colors = palettes[isDark ? 'dark' : 'light'];

  // Shapes: ★ ✦ ✸ · ◆
  const shapes = ['★', '✦', '✸', '•', '◆', '✶'];

  const COUNT = 18;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'theme-particle';
    el.textContent = shapes[Math.floor(Math.random() * shapes.length)];

    const angle = (360 / COUNT) * i + (Math.random() - .5) * 22;
    const dist  = 55 + Math.random() * 90;
    const rad   = angle * Math.PI / 180;
    const tx    = Math.cos(rad) * dist;
    const ty    = Math.sin(rad) * dist;
    const size  = 10 + Math.random() * 12;
    const dur   = .55 + Math.random() * .35;
    const delay = Math.random() * .08;

    el.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      font-size: ${size}px;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      text-shadow: 0 0 6px currentColor;
      --tx: ${tx}px; --ty: ${ty}px;
      --dur: ${dur}s;
      animation-delay: ${delay}s;
      border-radius: 0;
    `;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay + .1) * 1000);
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';

  // Spawn particles from the toggle button
  const btn = document.getElementById('themeToggle');
  if (btn) spawnThemeParticles(btn, isDark);

  // Flash overlay
  const flash = document.getElementById('theme-flash');
  flash.classList.remove('flash-active');
  void flash.offsetWidth;

  // Enable smooth transition for all elements
  html.classList.add('theme-transitioning');
  html.setAttribute('data-theme', next);
  localStorage.setItem('vmmod-theme', next);

  // Trigger flash
  flash.classList.add('flash-active');

  // Cleanup
  setTimeout(() => {
    html.classList.remove('theme-transitioning');
    flash.classList.remove('flash-active');
  }, 520);
}

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
