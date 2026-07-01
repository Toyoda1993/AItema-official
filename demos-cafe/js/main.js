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

/* ===== プリローダー ===== */
// タイミング: delay 0.4s + stroke 1.8s + fill 0.5s + pause 0.3s = 3.0s
const preloader = document.getElementById('preloader');
setTimeout(() => {
  preloader.classList.add('fade-out');
  preloader.addEventListener('transitionend', () => {
    preloader.style.display = 'none';
  }, { once: true });
}, 3000);

/* ===== ナビ：スクロールで背景切り替え ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ===== ハンバーガーメニュー ===== */
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinks = document.querySelector('.nav-links');

hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('active');
  navLinks.classList.toggle('mobile-open');
  document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
});

// 閉じるボタン
document.getElementById('menu-close-btn').addEventListener('click', closeMenu);

// メニューリンクをクリックしたら閉じる
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

function closeMenu() {
  hamburgerBtn.classList.remove('active');
  navLinks.classList.remove('mobile-open');
  document.body.style.overflow = '';
}

/* ===== スクロールフェードイン（IntersectionObserver） ===== */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => observer.observe(el));
