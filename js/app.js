/* ============================================================
   AItema LP — JavaScript
   ============================================================ */

/* --vh fix: アドレスバー表示/非表示によるリサイズを防ぐ */
(function () {
  function setVH() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  setVH();
  window.addEventListener('orientationchange', function () {
    setTimeout(setVH, 100);
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll effect ───────────────────────────────────
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ─── Hamburger / Mobile menu ────────────────────────────────
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburgerBtn.classList.remove('open');
    });
  });

  // ─── Smooth scroll ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── Video autoplay fallback ─────────────────────────────────
  [document.getElementById('hero-video'), document.getElementById('vision-video')].forEach(video => {
    if (!video) return;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  });

  // ─── Hero sub-elements: stagger fade-in on load ────────────────
  // タイトル（#hero-title）はCSSアニメーションで浮かび上がる
  // サブ要素はタイトルアニメーション完了後にスタガーで表示
  const heroSubElements = [
    document.getElementById('hero-subtitle'),
    document.getElementById('hero-desc'),
    document.getElementById('hero-ctas'),
    document.getElementById('hero-proof'),
  ];

  heroSubElements.forEach((el, i) => {
    if (!el) return;
    // 2行目カットイン完了（0.72s delay + 0.88s duration ≈ 1.6s）後にスタガー
    setTimeout(() => el.classList.add('visible'), 1680 + i * 180);
  });

  // ─── Scroll Reveal ──────────────────────────────────────────
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const parent   = entry.target.parentElement;
          const siblings = [...parent.querySelectorAll('[data-reveal]')];
          const idx      = siblings.indexOf(entry.target);
          const delay    = (idx % 6) * 80;

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── FAQ Accordion ──────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-item').forEach(other => {
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        question.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });

  // ─── Ripple on CTA buttons ───────────────────────────────────
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes rippleAnim { to { transform: scale(100); opacity: 0; } }`;
  document.head.appendChild(rippleStyle);

  document.querySelectorAll('.btn-primary, .btn-cta-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; width:4px; height:4px; border-radius:50%;
        background:rgba(255,255,255,0.35); transform:scale(0);
        left:${e.clientX - rect.left}px; top:${e.clientY - rect.top}px;
        animation:rippleAnim 0.6s ease-out forwards; pointer-events:none;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // ─── Tilt effect on cards ────────────────────────────────────
  if (window.innerWidth > 768) {
    document.querySelectorAll('.feature-item, .target-card, .pricing-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s ease, border-color 0.3s ease';
        card.style.transform = '';
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease, border-color 0.3s ease';
      });
    });
  }

  // ─── Active nav on scroll ────────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const navStyle = document.createElement('style');
  navStyle.textContent = `.nav-link.active { color: var(--col-text-primary); background: rgba(79,142,247,0.08); }`;
  document.head.appendChild(navStyle);

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.4 }).observe !== undefined &&
  sections.forEach(s => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const a = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (a) a.classList.add('active');
        }
      });
    }, { threshold: 0.4 }).observe(s);
  });

  // ─── Dynamic year ────────────────────────────────────────────
  const footerCopy = document.querySelector('.footer-copy');
  if (footerCopy) {
    footerCopy.textContent = footerCopy.textContent.replace('2025', new Date().getFullYear());
  }

  console.log('%c🚀 AItema LP — Ready', 'color:#4F8EF7;font-size:14px;font-weight:700;');
});
