// landing.js - small UX polish for landing page
(function(){
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('menuBtn');
  const header = document.getElementById('siteHeader');
  const yearEl = document.getElementById('year');
  const overlay = document.getElementById('routeLoginOverlay');
  const closeLogin = document.getElementById('routeLoginClose');
  const guestBtn = document.getElementById('routeGuestBtn');
  const loginBtn = document.getElementById('routeLoginBtn');
  let pendingHref = null;

  // Mobile menu toggle
  btn?.addEventListener('click', ()=>{
    nav?.classList.toggle('open');
  });

  // Close menu when clicking a link (mobile)
  nav?.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', ()=> nav.classList.remove('open'));
  });

  // Header shadow on scroll
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 4) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Footer year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Subtle reveal animations
  const items = document.querySelectorAll('.feature, .cat, .teaser-card, .review');
  items.forEach(el => el.classList.add('reveal-init'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('reveal');
        ent.target.classList.remove('reveal-init');
        io.unobserve(ent.target);
      }
    });
  },{ threshold: 0.12 });
  items.forEach(el => io.observe(el));

  // ---------- Route guard: show login prompt when leaving to index/dashboard ----------
  function isLoggedIn() {
    try {
      if (localStorage.getItem('isLoggedIn') === 'true') return true;
      const u = window.__fb?.auth?.currentUser; // from firebase.js if loaded elsewhere
      return !!u;
    } catch { return false; }
  }

  function wantsGuard(url) {
    if (!url) return false;
    const u = url.toLowerCase();
    return u.endsWith('index.html') || u.includes('dashboard') || u.endsWith('/');
  }

  function openRouteLogin(href) {
    pendingHref = href;
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeRouteLogin() {
    if (overlay) {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) return;
    if (wantsGuard(href) && !isLoggedIn()) {
      e.preventDefault();
      openRouteLogin(href);
    }
  });

  closeLogin?.addEventListener('click', ()=> closeRouteLogin());
  overlay?.addEventListener('click', (e)=>{ if (e.target === overlay) closeRouteLogin(); });
  guestBtn?.addEventListener('click', (e)=>{
    e.preventDefault();
    closeRouteLogin();
    if (pendingHref) window.location.href = pendingHref;
  });
  loginBtn?.addEventListener('click', ()=>{
    // default anchor nav to login.html
    closeRouteLogin();
  });
})();
