// ═══ VMMOD LANDING · SCRIPT ═══

(function () {
  if (!document.documentElement.getAttribute('data-theme')) {
    document.documentElement.setAttribute(
      'data-theme',
      localStorage.getItem('vmmod-theme') || 'dark'
    );
  }
})();

// Particle burst on theme toggle
function spawnThemeParticles(originEl, isDark) {
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const palettes = {
    light: ['#ffd700', '#ffb347', '#ff8c42', '#fff176', '#ffe082'],
    dark:  ['#00d4ff', '#7c3aed', '#ff6b35', '#00ff88', '#c084fc']
  };
  const colors = palettes[isDark ? 'dark' : 'light'];
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

// ═══ Переключение темы без вспышек ═══
// Механика:
// 1) Вешаем класс `theme-switching` на <html>. Он глобально отключает
//    backdrop-filter, filter: blur, mask-image, box-shadow и все transition
//    у проблемных блоков (nav, hero-orb, hero-grid, feature-card, mockup-window,
//    vip-card, download-bg-orb, feat-glow и т.д.) — именно они дают вспышки.
// 2) Оверлей цвета текущего фона перекрывает страницу, под ним меняем тему.
// 3) Оверлей плавно исчезает, класс снимается — эффекты возвращаются.
let themeBusy = false;

function toggleTheme() {
  if (themeBusy) return;
  themeBusy = true;

  const html = document.documentElement;
  const overlay = document.getElementById('themeOverlay');
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';

  // 1) Отключаем все эффекты, которые могут дать вспышку
  html.classList.add('theme-switching');

  // 2) Оверлей текущего фона (непрозрачный)
  overlay.style.transition = 'none';
  overlay.style.backgroundColor = isDark ? '#0a0c10' : '#fdf8f2';
  overlay.style.opacity = '1';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const styleEl = document.getElementById('boot-bg');
      if (styleEl) styleEl.remove();

      // 3) Меняем тему под оверлеем
      html.setAttribute('data-theme', next);
      localStorage.setItem('vmmod-theme', next);

      // Частицы вокруг кнопки
      const originEl = document.getElementById('themeToggle');
      if (originEl) spawnThemeParticles(originEl, next === 'dark');

      // 4) Плавно убираем оверлей, затем снимаем класс
      requestAnimationFrame(() => {
        overlay.style.transition = 'opacity .32s ease';
        overlay.style.opacity = '0';

        setTimeout(() => {
          overlay.style.transition = 'none';
          html.classList.remove('theme-switching');
          themeBusy = false;
        }, 340);
      });
    });
  });
}

// Nav scroll effect + scroll-to-top button visibility
const nav = document.getElementById('nav');
const btnToTop = document.getElementById('btnToTop');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  if (btnToTop) btnToTop.classList.toggle('visible', window.scrollY > 400);
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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