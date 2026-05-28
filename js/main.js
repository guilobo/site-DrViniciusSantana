/* ============================================================
   Dr. Vinicius Santana — EvidênciaMed
   main.js — Animations, Navbar, Mobile Menu, Parallax
   ============================================================ */

(function () {
  'use strict';

  /* ── NAVBAR scroll state + logo swap ─────────────────── */
  const navbar     = document.getElementById('navbar');
  const logoImg    = document.getElementById('logo-img');
  const logoSource = logoImg && logoImg.closest('picture') && logoImg.closest('picture').querySelector('source');
  const logoClara      = logoImg    && logoImg.dataset.clara;
  const logoEscura     = logoImg    && logoImg.dataset.escura;
  const logoClaraWebp  = logoSource && logoSource.dataset.claraWebp;
  const logoEscuraWebp = logoSource && logoSource.dataset.escuraWebp;

  let scrollTicking = false;
  function handleScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY > 72;
      navbar.classList.toggle('scrolled', scrolled);
      if (logoImg) {
        logoImg.src = scrolled ? logoEscura : logoClara;
        if (logoSource) logoSource.srcset = scrolled ? logoEscuraWebp : logoClaraWebp;
      }
      scrollTicking = false;
    });
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── HAMBURGER mobile menu ────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  function closeMenu() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* close on link click */
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* close on outside click */
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  /* close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── SMOOTH SCROLL for anchor links ──────────────────── */
  /* navH cacheado — evita forced reflow lendo offsetHeight a cada clique */
  let navH = 80;
  function cacheNavH() { navH = navbar.offsetHeight + 16; }
  window.addEventListener('load',   cacheNavH);
  window.addEventListener('resize', cacheNavH, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── INTERSECTION OBSERVER — scroll reveals ───────────── */
  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        /* unobserve after first reveal for performance */
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── HERO entrance — trigger immediately after load ───── */
  window.addEventListener('load', () => {
    /* animate hero elements on load, not on scroll */
    const heroEls = document.querySelectorAll('.hero .reveal-up, .hero .reveal-right');
    heroEls.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 120 + i * 130);
    });
  });

  /* ── PARALLAX — hero watermark ───────────────────────── */
  const watermark = document.querySelector('.hero-watermark');
  if (watermark) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      /* subtle parallax — moves slower than scroll */
      watermark.style.transform = `translateY(calc(-50% + ${y * 0.12}px))`;
    }, { passive: true });
  }

  /* ── ACTIVE NAV LINK on scroll ───────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ── SERVICE CARDS — staggered reveal ─────────────────── */
  const srvGrid = document.querySelector('.services-grid');
  if (srvGrid) {
    const srvObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.srv-card').forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 80);
        });
        srvObserver.disconnect();
      }
    }, { threshold: 0.15 });
    srvObserver.observe(srvGrid);
  }

  /* ── CREDENTIAL CARDS — staggered reveal ──────────────── */
  const credGrid = document.querySelector('.about-credentials');
  if (credGrid) {
    const credObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.cred-card').forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 90);
        });
        credObserver.disconnect();
      }
    }, { threshold: 0.2 });
    credObserver.observe(credGrid);
  }

  /* ── WHATSAPP FLOAT — hide on footer ─────────────────── */
  const waFloat = document.querySelector('.whatsapp-float');
  const footer  = document.querySelector('.footer');
  if (waFloat && footer) {
    const footerObs = new IntersectionObserver((entries) => {
      waFloat.style.opacity = entries[0].isIntersecting ? '0' : '1';
      waFloat.style.pointerEvents = entries[0].isIntersecting ? 'none' : 'auto';
    }, { threshold: 0 });
    footerObs.observe(footer);
  }

})();
