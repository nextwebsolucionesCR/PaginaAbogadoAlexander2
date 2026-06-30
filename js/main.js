/* =========================================
   1. THEME TOGGLE (Dark/Light Mode)
   ========================================= */
const themeBtn = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

let initialTheme = 'light';
if (savedTheme === 'dark' || savedTheme === 'light') {
  initialTheme = savedTheme;
} else {
  initialTheme = systemPrefersDark ? 'dark' : 'light';
}

document.body.classList.toggle('dark-mode', initialTheme === 'dark');

function updateThemeUI(isDark) {
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  if (themeBtn) {
    themeBtn.textContent = isDark ? '☀' : '☾';
    themeBtn.setAttribute('aria-pressed', String(isDark));
    themeBtn.setAttribute('aria-label', isDark ? 'Modo claro' : 'Modo oscuro');
  }
}

updateThemeUI(initialTheme === 'dark');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode', isDark);
    updateThemeUI(isDark);
  });
}


/* =========================================
   2. MULTI-LANGUAGE (i18n)
   ========================================= */
// Translations are loaded from translations.js
const langSelect = document.getElementById('lang-select');
const DEFAULT_LANG = 'es';
let currentLang = localStorage.getItem('language') || DEFAULT_LANG;

if (!translations[currentLang] && translations['es']) currentLang = DEFAULT_LANG;

if (langSelect) {
  langSelect.value = currentLang;
  langSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
  });
}

function updateLanguage(lang) {
  if (!translations[lang]) lang = DEFAULT_LANG;

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      const translation = translations[lang][key];
      if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && element.hasAttribute('placeholder')) {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    }
  });

  localStorage.setItem('language', lang);
  currentLang = lang;
}

updateLanguage(currentLang);


/* =========================================
   3. SERVICES ACCORDION (index.html)
   ========================================= */
const serviceHeaders = document.querySelectorAll('.service-header');
serviceHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.service-item').forEach(i => i.classList.remove('active'));

    // If it wasn't active, open it
    if (!isActive) {
      item.classList.add('active');
    }
  });
});


/* =========================================
   4. TESTIMONIALS CYCLER (Pull-quotes)
   ========================================= */
const quotes = document.querySelectorAll('.testimonial-quote');
if (quotes.length > 0) {
  let currentQuote = 0;
  setInterval(() => {
    quotes[currentQuote].classList.remove('active');
    currentQuote = (currentQuote + 1) % quotes.length;
    quotes[currentQuote].classList.add('active');
  }, 6000); // cycle every 6 seconds
}


/* =========================================
   5. GOOGLE MAPS FACADE
   ========================================= */
const mapContainer = document.getElementById('map-container');
if (mapContainer) {
  const loadMap = () => {
    if (mapContainer.classList.contains('loaded')) return;
    const iframe = document.createElement('iframe');
    iframe.src = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15714.2882855112!2d-85.43572345!3d10.6313098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2scr!4v1717171717171!5m2!1sen!2scr";
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.style.zIndex = "1";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";

    mapContainer.appendChild(iframe);
    mapContainer.classList.add('loaded');

    // Hide the placeholder text/button
    const btn = mapContainer.querySelector('.btn-editorial');
    if (btn) btn.style.display = 'none';
  };

  mapContainer.addEventListener('click', loadMap);

  // Optionally, load on intersection
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMap();
        observer.disconnect();
      }
    }, { rootMargin: '200px' });
    observer.observe(mapContainer);
  }
}


/* =========================================
   6. COOKIES BANNER
   ========================================= */
const cookiesBanner = document.getElementById('cookies-editorial');
const btnAcceptCookies = document.getElementById('btn-accept');
const btnRejectCookies = document.getElementById('btn-reject');

if (cookiesBanner && !localStorage.getItem('cookiesAccepted')) {
  setTimeout(() => {
    cookiesBanner.classList.add('show');
  }, 1000);
}

if (btnAcceptCookies) {
  btnAcceptCookies.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookiesBanner.classList.remove('show');
  });
}

if (btnRejectCookies) {
  btnRejectCookies.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'false');
    cookiesBanner.classList.remove('show');
  });
}


/* =========================================
   7. SERVICES FILTERING (servicios.html)
   ========================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const serviceRows = document.querySelectorAll('.service-row');

if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Manage active visual state
      filterBtns.forEach(b => b.style.opacity = '0.5');
      btn.style.opacity = '1';

      const activeFilter = btn.getAttribute('data-filter');

      serviceRows.forEach(row => {
        const category = row.getAttribute('data-category');
        if (activeFilter === 'all' || category === activeFilter) {
          row.style.display = 'flex';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* =========================================
   8. MOBILE MENU TOGGLE
   ========================================= */
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpening = !navMenu.classList.contains('open');
    if (isOpening) {
      navMenu.classList.add('open');
      menuToggle.textContent = '✕';
      document.querySelector('.header').classList.add('menu-open');
    } else {
      navMenu.classList.remove('open');
      menuToggle.textContent = '☰';
      setTimeout(() => {
        document.querySelector('.header').classList.remove('menu-open');
      }, 800);
    }
  });

  // Close menu when clicking a link (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.textContent = '☰';
      setTimeout(() => {
        document.querySelector('.header').classList.remove('menu-open');
      }, 800);
    });
  });
}

/* =========================================
   9. SCROLL REVEAL & PARALLAX
   ========================================= */
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0 && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
} else {
  // Fallback for older browsers
  revealElements.forEach(el => el.classList.add('active'));
}

// Parallax for watermarks
const watermarks = document.querySelectorAll('.stat-watermark');
if (watermarks.length > 0) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    watermarks.forEach((wm, index) => {
      // Index 0 (top) moves up faster (-0.15), Index 1 (bottom) moves up slower (-0.05). 
      // They pull away from each other and never hit the bottom cutoff.
      const speed = index === 0 ? -0.15 : -0.05;
      wm.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });
}
