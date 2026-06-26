/* ============================================================
   AItema LP — JavaScript
   ============================================================ */

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
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    heroVideo.play().catch(() => {
      // autoplay blocked — muted loop retry
      heroVideo.muted = true;
      heroVideo.play().catch(() => {});
    });
  }

  // ─── Typewriter animation ──────────────────────────────────────
  // 改行位置を '\n' で指定（表示時に <br> に変換）
  const LINES = [
    '作って終わりの',
    'ホームページは、',
    'もういらない。',
  ];
  const FULL_TEXT  = LINES.join('\n');
  const displayEl  = document.getElementById('typewriter-display');
  const cursorEl   = document.getElementById('typewriter-cursor');

  // Elements revealed after typing completes
  const revealAfterType = [
    document.getElementById('hero-subtitle'),
    document.getElementById('hero-desc'),
    document.getElementById('hero-ctas'),
    document.getElementById('hero-proof'),
  ];

  const BASE_SPEED    = 68;
  const PAUSE_CHARS   = { '。': 400, '、': 240, '\n': 200 };
  const INITIAL_DELAY = 700;

  let charIndex = 0;

  // 文字列を HTML 形式でレンダリング（\n → <br>）
  function renderText(text) {
    return text.split('\n').join('<br>');
  }

  function typeNextChar() {
    if (charIndex >= FULL_TEXT.length) {
      onTypingComplete();
      return;
    }

    const char = FULL_TEXT[charIndex];
    charIndex++;
    displayEl.innerHTML = renderText(FULL_TEXT.slice(0, charIndex));

    const delay = BASE_SPEED + (PAUSE_CHARS[char] ?? 0) + (Math.random() * 28 - 14);
    setTimeout(typeNextChar, Math.max(18, delay));
  }

  function onTypingComplete() {
    // カーソルは少し点滅した後に非表示
    setTimeout(() => {
      if (cursorEl) {
        cursorEl.style.transition = 'opacity 0.4s ease';
        cursorEl.style.opacity = '0';
      }
    }, 1200);

    // サブ要素をスタガー表示
    revealAfterType.forEach((el, i) => {
      if (!el) return;
      setTimeout(() => el.classList.add('visible'), 350 + i * 180);
    });
  }

  // Kick off typing after initial delay
  setTimeout(typeNextChar, INITIAL_DELAY);

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

  console.log('%c🚀 AItema LP — Typewriter Ready', 'color:#4F8EF7;font-size:14px;font-weight:700;');
});
