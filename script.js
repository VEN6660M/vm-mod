// ═══ VMMOD LANDING · SCRIPT ═══

(function () {
  if (!document.documentElement.getAttribute('data-theme')) {
    document.documentElement.setAttribute(
      'data-theme',
      localStorage.getItem('vmmod-theme') || 'dark'
    );
  }
})();

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

// Выезжающее меню категорий внутри превью программы (моб.)
function toggleMockupMenu() {
  const sidebar = document.getElementById('mockupSidebar');
  const overlay = document.getElementById('mockupSidebarOverlay');
  const btn = document.getElementById('mockupMenuBtn');
  if (!sidebar) return;
  const open = !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', open);
  if (overlay) overlay.classList.toggle('open', open);
  if (btn) {
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }
}

// Закрывать меню категорий при выборе категории
document.querySelectorAll('#mockupSidebar .mockup-cat').forEach((cat) => {
  cat.addEventListener('click', () => {
    const sidebar = document.getElementById('mockupSidebar');
    if (sidebar && sidebar.classList.contains('open')) toggleMockupMenu();
  });
});

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