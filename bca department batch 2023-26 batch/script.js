// ============================================================
//  BCA DEPARTMENT BATCH 2023-26 — WEBSITE SCRIPT
// ============================================================

// ---- DOM References ----
const welcomeScreen  = document.getElementById('welcome-screen');
const welcomeOverlay = document.getElementById('welcome-overlay');
const mainSite       = document.getElementById('main-site');
const particlesCont  = document.getElementById('particles');

// ---- Generate Floating Particles on Welcome Screen ----
function createParticles() {
  const colors = ['#6c63ff', '#ff6584', '#43e97b', '#00d2ff', '#f093fb'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size  = Math.random() * 5 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left  = Math.random() * 100;
    const dur   = Math.random() * 10 + 8;
    const delay = Math.random() * 10;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${left}%;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    particlesCont.appendChild(p);
  }
}
createParticles();

// ---- Welcome Screen Click → Animation → Main Site ----
welcomeScreen.addEventListener('click', () => {
  // 1) Hide welcome screen
  welcomeScreen.style.transition = 'opacity 0.6s ease';
  welcomeScreen.style.opacity    = '0';
  setTimeout(() => {
    welcomeScreen.classList.add('hidden');

    // 2) Show overlay animation
    welcomeOverlay.classList.remove('hidden');

    // 3) After animation completes, hide overlay and show main site
    setTimeout(() => {
      welcomeOverlay.style.transition = 'opacity 0.8s ease';
      welcomeOverlay.style.opacity    = '0';
      setTimeout(() => {
        welcomeOverlay.classList.add('hidden');
        mainSite.classList.remove('hidden');
        mainSite.style.opacity    = '0';
        mainSite.style.transition = 'opacity 0.8s ease';
        setTimeout(() => {
          mainSite.style.opacity = '1';
          // Trigger scroll-based animations
          initScrollAnimations();
        }, 50);
      }, 800);
    }, 4000); // overlay stays for 4 seconds
  }, 600);
});

// ---- Scroll-based Reveal Animations ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.faculty-card, .memory-card, .about-stats .stat, .video-frame'
  ).forEach(el => {
    el.style.opacity  = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Apply in-view style
document.addEventListener('animationend', () => {});
const styleTag = document.createElement('style');
styleTag.textContent = `.in-view { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(styleTag);

// ---- Farewell Section — Animate on Scroll ----
function initFarewellObserver() {
  const farewell = document.querySelector('.farewell-section');
  if (!farewell) return;

  const farewellObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('farewell-visible');
        farewellObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  farewellObserver.observe(farewell);
}

// Wait until main site is shown, then observe farewell
const mainSiteObserver = new MutationObserver(() => {
  if (!mainSite.classList.contains('hidden')) {
    initFarewellObserver();
    mainSiteObserver.disconnect();
  }
});
mainSiteObserver.observe(mainSite, { attributes: true, attributeFilter: ['class'] });

// ---- Smooth Navbar Active Link ----
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  let current     = '';

  sections.forEach(sec => {
    const top    = sec.offsetTop - 100;
    const height = sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#6c63ff' : '';
  });
});

// ---- Memory cards — tilt effect on mouse move ----
document.querySelectorAll('.memory-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotX   = ((y - cy) / cy) * 6;
    const rotY   = ((x - cx) / cx) * -6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- Faculty Cards — subtle glow on hover ----
document.querySelectorAll('.faculty-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = 'rgba(108, 99, 255, 0.6)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = '';
  });
});
