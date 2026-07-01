/* ===== ローディング画面 ===== */
const loadingScreen = document.getElementById('loading-screen');
const loaderBar = document.getElementById('loader-bar');
let progress = 0;

const loadInterval = setInterval(() => {
  progress += Math.random() * 12 + 3;
  if (progress > 90) progress = 90;
  loaderBar.style.width = progress + '%';
}, 180);

window.addEventListener('load', () => {
  clearInterval(loadInterval);
  loaderBar.style.width = '100%';
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => loadingScreen.remove(), 700);
  }, 500);
});

/* ===== ナビ：スクロールで背景切り替え ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== ハンバーガーメニュー ===== */
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMobile = document.getElementById('nav-mobile');
const mobileCloseBtn = document.getElementById('mobile-close-btn');

hamburgerBtn.addEventListener('click', () => {
  navMobile.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeMobileMenu() {
  navMobile.classList.remove('open');
  document.body.style.overflow = '';
}

mobileCloseBtn.addEventListener('click', closeMobileMenu);
navMobile.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ===== スクロールフェードイン ===== */
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));
