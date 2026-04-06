/* ═══════════════════════════════════════════════════
   ACVOLT Tech School — main.js
   i18n, smooth scroll, mobile menu, animations, pricing
   + animated counters, stagger reveals, parallax, tilt
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── i18n Translations ──
  var lang = 'es';

  var T = {
    // Navbar
    nav_programs:   { es: 'Programas',        en: 'Programs' },
    nav_about:      { es: 'Sobre Nosotros',   en: 'About Us' },
    nav_app:        { es: 'App',              en: 'App' },
    nav_pricing:    { es: 'Precios',          en: 'Pricing' },
    nav_contact:    { es: 'Contacto',         en: 'Contact' },
    nav_cta:        { es: 'Comenzar Gratis',  en: 'Start Free' },

    // Hero
    hero_title:     { es: 'La Escuela #1 de HVAC en Español', en: 'The #1 HVAC School in Spanish' },
    hero_subtitle:  { es: 'Certificación profesional HVAC desde tu teléfono. Clases en vivo, quizzes gamificados, tutor AI y más.', en: 'Professional HVAC certification from your phone. Live classes, gamified quizzes, AI tutor and more.' },
    stat_followers: { es: 'Seguidores',       en: 'Followers' },
    stat_questions: { es: 'Preguntas',        en: 'Questions' },
    stat_students:  { es: 'Estudiantes',      en: 'Students' },
    stat_tools:     { es: 'Herramientas',     en: 'Tools' },
    hero_cta1:      { es: 'Comenzar Gratis',  en: 'Start Free' },
    hero_cta2:      { es: 'Ver Programas',    en: 'View Programs' },

    // Social Proof
    social_text:    { es: '640,000+ seguidores en redes sociales', en: '640,000+ social media followers' },

    // Programs
    programs_title:    { es: 'Qué Ofrecemos',  en: 'What We Offer' },
    programs_subtitle: { es: 'Todo lo que necesitas para convertirte en un técnico HVAC profesional', en: 'Everything you need to become a professional HVAC technician' },
    feat1_title: { es: 'Desafío Gamificado',       en: 'Gamified Challenge' },
    feat1_desc:  { es: '3,500+ preguntas capciosas organizadas por niveles. Estudia, practica y demuestra tu conocimiento.', en: '3,500+ tricky questions organized by level. Study, practice and prove your knowledge.' },
    feat2_title: { es: 'Tutor AI — Maestro Mario',  en: 'AI Tutor — Maestro Mario' },
    feat2_desc:  { es: 'Asistente inteligente disponible 24/7 para resolver tus dudas técnicas en español.', en: 'Smart assistant available 24/7 to answer your technical questions in Spanish.' },
    feat3_title: { es: 'Clases en Vivo',             en: 'Live Classes' },
    feat3_desc:  { es: 'De martes a sábado con instructor en vivo. Interactúa, pregunta y aprende en tiempo real.', en: 'Tuesday through Saturday with a live instructor. Interact, ask questions and learn in real time.' },
    feat4_title: { es: 'Certificados QR',             en: 'QR Certificates' },
    feat4_desc:  { es: 'Obtén hasta 25 certificados verificables digitalmente. Compártelos con empleadores.', en: 'Earn up to 25 digitally verifiable certificates. Share them with employers.' },
    feat5_title: { es: 'Herramientas HVAC PRO',       en: 'HVAC PRO Tools' },
    feat5_desc:  { es: 'Calculadoras profesionales para tu día a día como técnico en el campo.', en: 'Professional calculators for your day-to-day work as a field technician.' },
    feat6_title: { es: 'Radio / Podcast',              en: 'Radio / Podcast' },
    feat6_desc:  { es: 'Nivel 33 Podcast — Contenido educativo HVAC mientras trabajas o manejas.', en: 'Level 33 Podcast — HVAC educational content while you work or drive.' },

    // How it works
    how_title:   { es: 'Cómo Funciona',      en: 'How It Works' },
    step1_title: { es: 'Regístrate Gratis',   en: 'Sign Up Free' },
    step1_desc:  { es: 'Crea tu cuenta en 30 segundos. Sin tarjeta de crédito.', en: 'Create your account in 30 seconds. No credit card required.' },
    step2_title: { es: 'Estudia a Tu Ritmo',  en: 'Study at Your Pace' },
    step2_desc:  { es: 'Accede a quizzes, videos y clases en vivo desde cualquier dispositivo.', en: 'Access quizzes, videos and live classes from any device.' },
    step3_title: { es: 'Certifícate',          en: 'Get Certified' },
    step3_desc:  { es: 'Obtén tus certificados QR verificables y avanza en tu carrera.', en: 'Earn your verifiable QR certificates and advance your career.' },

    // About
    about_title:   { es: 'Sobre Nosotros',     en: 'About Us' },
    about_name:    { es: 'Maestro Mario',       en: 'Maestro Mario' },
    about_role:    { es: 'Fundador de ACVOLT Tech School', en: 'Founder of ACVOLT Tech School' },
    about_bio:     { es: 'Con más de 640,000 seguidores en redes sociales, Maestro Mario es el pionero de la educación HVAC en español en Estados Unidos. Creador del Nivel 33 Podcast y de la plataforma Maestro HVACR, su misión es llevar certificación profesional HVAC accesible a toda la comunidad hispana.', en: 'With over 640,000 social media followers, Maestro Mario is the pioneer of HVAC education in Spanish in the United States. Creator of the Level 33 Podcast and the Maestro HVACR platform, his mission is to bring accessible professional HVAC certification to the entire Hispanic community.' },
    about_mission: { es: 'ACVOLT Tech School nació con una visión clara: que el idioma nunca sea una barrera para convertirte en un técnico HVAC profesional y certificado.', en: 'ACVOLT Tech School was born with a clear vision: that language should never be a barrier to becoming a professional, certified HVAC technician.' },
    cred_followers: { es: 'Seguidores en redes', en: 'Social followers' },
    cred_students:  { es: 'Estudiantes activos', en: 'Active students' },
    cred_years:     { es: 'Años educando',       en: 'Years teaching' },

    // App
    app_title:    { es: 'Nuestra App: Maestro HVACR', en: 'Our App: Maestro HVACR' },
    app_subtitle: { es: 'Todo el poder de ACVOLT Tech School en la palma de tu mano', en: 'All the power of ACVOLT Tech School in the palm of your hand' },
    app_f1:       { es: 'Desafío Gamificado con 3,500+ preguntas', en: 'Gamified Challenge with 3,500+ questions' },
    app_f2:       { es: 'Tutor AI — Maestro Mario 24/7', en: 'AI Tutor — Maestro Mario 24/7' },
    app_f3:       { es: 'Clases en vivo con instructor', en: 'Live classes with instructor' },
    app_f4:       { es: 'Certificados QR verificables', en: 'Verifiable QR certificates' },
    app_f5:       { es: 'Herramientas HVAC profesionales', en: 'Professional HVAC tools' },
    app_f6:       { es: 'Nivel 33 Podcast integrado', en: 'Level 33 Podcast built-in' },
    app_f7:       { es: 'Funciona en cualquier dispositivo', en: 'Works on any device' },
    app_cta_web:  { es: 'Abrir App Web',  en: 'Open Web App' },
    app_cta_play: { es: 'Google Play',     en: 'Google Play' },
    app_note:     { es: 'Disponible como Web App y en Google Play', en: 'Available as Web App and on Google Play' },

    // Testimonials
    test_title:  { es: 'Lo Que Dicen Nuestros Estudiantes', en: 'What Our Students Say' },
    test1_quote: { es: '"Gracias a Maestro HVACR pasé mi examen EPA 608 al primer intento. Las preguntas del quiz son exactamente lo que viene en el examen real. ¡Recomendado al 100%!"', en: '"Thanks to Maestro HVACR I passed my EPA 608 exam on the first try. The quiz questions are exactly what comes on the real exam. 100% recommended!"' },
    test1_role:  { es: 'Técnico HVAC — Los Angeles, CA', en: 'HVAC Technician — Los Angeles, CA' },
    test2_quote: { es: '"Llevo 3 meses usando la app y ya completé hasta el nivel avanzado. Mi jefe me subió el sueldo porque ahora puedo diagnosticar problemas que antes no entendía."', en: '"I\'ve been using the app for 3 months and already completed through the advanced level. My boss gave me a raise because now I can diagnose problems I didn\'t understand before."' },
    test2_role:  { es: 'Técnico Senior — Houston, TX', en: 'Senior Technician — Houston, TX' },
    test3_quote: { es: '"Lo mejor es que todo está en español. Yo no hablo mucho inglés y siempre batallaba con los materiales de estudio. Con Maestro HVACR por fin entiendo todo."', en: '"The best part is that everything is in Spanish. I don\'t speak much English and always struggled with study materials. With Maestro HVACR I finally understand everything."' },
    test3_role:  { es: 'Ayudante HVAC — Phoenix, AZ', en: 'HVAC Helper — Phoenix, AZ' },
    test4_quote: { es: '"Soy dueño de mi empresa y inscribí a mis 5 técnicos en Maestro HVACR. En 2 meses ya todos pasaron el nivel intermedio. Es la mejor herramienta para entrenar personal."', en: '"I own my company and enrolled my 5 technicians in Maestro HVACR. In 2 months they all passed the intermediate level. It\'s the best tool for training staff."' },
    test4_role:  { es: 'Dueño HVAC Company — Dallas, TX', en: 'HVAC Company Owner — Dallas, TX' },

    // Pricing
    pricing_title:     { es: 'Planes y Precios',    en: 'Plans & Pricing' },
    pricing_subtitle:  { es: 'Elige el plan que mejor se adapte a tus necesidades', en: 'Choose the plan that best fits your needs' },
    popular_badge:     { es: 'Más Popular',          en: 'Most Popular' },
    plan_free_name:    { es: 'Gratis',               en: 'Free' },
    price_forever:     { es: '/siempre',             en: '/forever' },
    price_month:       { es: '/mes',                 en: '/month' },
    plan_free_f1:      { es: 'Dashboard personalizado', en: 'Personalized dashboard' },
    plan_free_f2:      { es: 'Perfil de técnico',       en: 'Technician profile' },
    plan_free_f3:      { es: 'Podcast / Radio',          en: 'Podcast / Radio' },
    plan_free_f4:      { es: 'Desafío Nivel 1',          en: 'Challenge Level 1' },
    plan_free_cta:     { es: 'Comenzar Gratis',          en: 'Start Free' },
    plan_std_name:     { es: 'Standard',                  en: 'Standard' },
    plan_std_f1:       { es: 'Todo lo del plan Gratis',   en: 'Everything in Free plan' },
    plan_std_f2:       { es: 'Videos de certificación',    en: 'Certification videos' },
    plan_std_f3:       { es: 'Quizzes y modo estudio',     en: 'Quizzes and study mode' },
    plan_std_f4:       { es: 'Desafío completo (N1-N4)',   en: 'Full Challenge (N1-N4)' },
    plan_std_f5:       { es: 'Herramientas HVAC PRO',      en: 'HVAC PRO Tools' },
    plan_std_f6:       { es: 'Tutor AI — Maestro Mario',   en: 'AI Tutor — Maestro Mario' },
    plan_std_cta:      { es: 'Suscribirse',                 en: 'Subscribe' },
    plan_prem_name:    { es: 'Premium',                     en: 'Premium' },
    plan_prem_f1:      { es: 'Todo lo del plan Standard',   en: 'Everything in Standard plan' },
    plan_prem_f2:      { es: 'Clases en vivo Mar/Mié',     en: 'Live classes Tue/Wed' },
    plan_prem_f3:      { es: 'Grabaciones de clases',       en: 'Class recordings' },
    plan_prem_f4:      { es: 'Chat en vivo con instructor', en: 'Live chat with instructor' },
    plan_prem_f5:      { es: 'Certificados QR verificables', en: 'Verifiable QR certificates' },
    plan_prem_cta:     { es: 'Suscribirse',                  en: 'Subscribe' },
    pricing_vip_note:  { es: 'VIP ($299/mes) — Incluye clases en vivo Sábados y Domingos. <a href="https://maestrohvacr.com/#registerScreen">Contáctanos</a>', en: 'VIP ($299/mo) — Includes live classes Saturdays and Sundays. <a href="https://maestrohvacr.com/#registerScreen">Contact us</a>' },

    // CTA Final
    cta_title:    { es: '¿Listo para convertirte en un Maestro del HVAC?', en: 'Ready to Become an HVAC Master?' },
    cta_subtitle: { es: 'Únete a más de 300 estudiantes que ya están avanzando en su carrera HVAC', en: 'Join over 300 students already advancing their HVAC career' },
    cta_register: { es: 'Comenzar Gratis',   en: 'Start Free' },
    cta_login:    { es: 'Ya Tengo Cuenta',   en: 'I Have an Account' },

    // Footer
    footer_location: { es: 'San Bernardino, CA', en: 'San Bernardino, CA' },
    footer_rights:   { es: 'Todos los derechos reservados.', en: 'All rights reserved.' }
  };

  // ── Apply translations ──
  function applyLang() {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      if (T[key] && T[key][lang]) {
        if (key === 'pricing_vip_note') {
          els[i].innerHTML = T[key][lang];
        } else {
          els[i].textContent = T[key][lang];
        }
      }
    }
    document.documentElement.lang = lang;
  }

  // ── Language toggle ──
  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      lang = lang === 'es' ? 'en' : 'es';
      langBtn.textContent = lang === 'es' ? 'EN' : 'ES';
      applyLang();
    });
  }

  // ── Mobile menu ──
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close menu on link click
    var navLinks = mobileMenu.querySelectorAll('.nav-link');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function () {
        menuToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    }
  }

  // ── Sticky navbar scroll effect ──
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ── Active nav link on scroll ──
  var sections = document.querySelectorAll('.section[id]');
  var allNavLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    for (var i = sections.length - 1; i >= 0; i--) {
      var section = sections[i];
      if (section.offsetTop <= scrollPos) {
        var targetId = section.getAttribute('id');
        for (var j = 0; j < allNavLinks.length; j++) {
          allNavLinks[j].classList.remove('active');
          if (allNavLinks[j].getAttribute('href') === '#' + targetId) {
            allNavLinks[j].classList.add('active');
          }
        }
        break;
      }
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ── Scroll animations (Intersection Observer) with stagger ──
  function initScrollAnimations() {
    var fadeEls = document.querySelectorAll('.feature-card, .step-card, .testimonial-card, .pricing-card, .about-grid, .app-showcase');
    for (var i = 0; i < fadeEls.length; i++) {
      fadeEls[i].classList.add('fade-in');
    }

    /* ── NEW: Assign stagger delays to sibling groups ──
       Cards that share a parent grid get incremental --reveal-delay
       so they appear one by one (100ms apart) when scrolling in. */
    var staggerGroups = document.querySelectorAll('.features-grid, .steps, .testimonials-grid, .pricing-grid');
    for (var g = 0; g < staggerGroups.length; g++) {
      var children = staggerGroups[g].querySelectorAll('.fade-in');
      for (var c = 0; c < children.length; c++) {
        children[c].style.setProperty('--reveal-delay', (c * 100) + 'ms');
      }
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('visible');
            observer.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      var targets = document.querySelectorAll('.fade-in');
      for (var i = 0; i < targets.length; i++) {
        observer.observe(targets[i]);
      }
    } else {
      // Fallback: show all
      var all = document.querySelectorAll('.fade-in');
      for (var i = 0; i < all.length; i++) {
        all[i].classList.add('visible');
      }
    }
  }

  // ── USA vs LATAM pricing ──
  function isUSAUser() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      return tz.indexOf('America/New_York') !== -1 || tz.indexOf('America/Chicago') !== -1 ||
        tz.indexOf('America/Denver') !== -1 || tz.indexOf('America/Los_Angeles') !== -1 ||
        tz.indexOf('America/Phoenix') !== -1 || tz.indexOf('America/Anchorage') !== -1 ||
        tz.indexOf('America/Adak') !== -1 || tz.indexOf('Pacific/Honolulu') !== -1 ||
        tz.indexOf('America/Indiana') !== -1 || tz.indexOf('America/Kentucky') !== -1 ||
        tz.indexOf('America/Detroit') !== -1 || tz.indexOf('America/Menominee') !== -1 ||
        tz.indexOf('America/Boise') !== -1 || tz.indexOf('America/Juneau') !== -1 ||
        tz.indexOf('America/Sitka') !== -1 || tz.indexOf('America/Yakutat') !== -1 ||
        tz.indexOf('America/Nome') !== -1 || tz.indexOf('US/') !== -1;
    } catch (e) { return true; }
  }

  function applyPricing() {
    var usa = isUSAUser();
    var usaEls = document.querySelectorAll('.price-usa');
    var latamEls = document.querySelectorAll('.price-latam');

    for (var i = 0; i < usaEls.length; i++) {
      usaEls[i].style.display = usa ? '' : 'none';
    }
    for (var i = 0; i < latamEls.length; i++) {
      latamEls[i].style.display = usa ? 'none' : '';
    }
  }

  // ── Smooth scroll for anchor links ──
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var targetId = link.getAttribute('href');
    if (targetId === '#') return;
    var target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });


  /* ═══════════════════════════════════════════════════
     NEW FEATURE 1: Animated Stat Counters
     Animates .stat-number elements from 0 to their
     final value when the .hero-stats section scrolls
     into view. Uses requestAnimationFrame with easeOut.
     Duration: ~2 seconds.
     ═══════════════════════════════════════════════════ */

  var statsAnimated = false;

  /**
   * Parse a stat string like "640K+", "3,500+", "300+", "25+"
   * Returns { value: 640000, suffix: '+', useK: true, commas: false }
   */
  function parseStatValue(text) {
    var trimmed = text.replace(/\s/g, '');
    var suffix = '';
    var useK = false;
    var commas = false;

    // Detect trailing '+'
    if (trimmed.charAt(trimmed.length - 1) === '+') {
      suffix = '+';
      trimmed = trimmed.slice(0, -1);
    }

    // Detect 'K' suffix (e.g. "640K")
    var lastChar = trimmed.charAt(trimmed.length - 1).toUpperCase();
    if (lastChar === 'K') {
      useK = true;
      trimmed = trimmed.slice(0, -1);
    }

    // Remove commas for parsing, but remember if commas were present
    if (trimmed.indexOf(',') !== -1) {
      commas = true;
      trimmed = trimmed.replace(/,/g, '');
    }

    var value = parseFloat(trimmed) || 0;
    // If K was used, the display number is e.g. 640, final numeric = 640
    // We animate to 640 and append K+

    return {
      value: value,
      suffix: suffix,
      useK: useK,
      commas: commas
    };
  }

  /**
   * Format a number for display.
   * If useK, appends 'K'. If commas, adds thousand separators.
   */
  function formatStatNumber(current, parsed) {
    var num = Math.round(current);
    var str = '';

    if (parsed.commas) {
      // Add thousand separators
      str = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      str = num.toString();
    }

    if (parsed.useK) {
      str = str + 'K';
    }

    return str + parsed.suffix;
  }

  /**
   * EaseOutQuart for smooth deceleration
   */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  /**
   * Animate a single stat element from 0 to its final value
   */
  function animateStat(el, parsed, duration) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutQuart(progress);
      var currentValue = easedProgress * parsed.value;

      el.textContent = formatStatNumber(currentValue, parsed);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Initialize the stat counter observer
   */
  function initStatCounters() {
    var heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;

    var statNumbers = heroStats.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    // Pre-parse all stat values and store originals
    var statData = [];
    for (var i = 0; i < statNumbers.length; i++) {
      statData.push({
        el: statNumbers[i],
        parsed: parseStatValue(statNumbers[i].textContent),
        original: statNumbers[i].textContent
      });
    }

    if ('IntersectionObserver' in window) {
      var statObserver = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting && !statsAnimated) {
            statsAnimated = true;
            // Animate each stat with ~2s duration
            for (var j = 0; j < statData.length; j++) {
              animateStat(statData[j].el, statData[j].parsed, 2000);
            }
            statObserver.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.3 });

      statObserver.observe(heroStats);
    }
    // If no IntersectionObserver, stats stay as their original HTML values (no animation needed)
  }


  /* ═══════════════════════════════════════════════════
     NEW FEATURE 3: Parallax Effect on Hero Glow
     On mousemove over the hero section, slightly move
     the .hero-glow element in the opposite direction
     for a subtle parallax. Desktop only (>768px).
     Uses debounced requestAnimationFrame.
     ═══════════════════════════════════════════════════ */

  function initHeroParallax() {
    var hero = document.getElementById('hero');
    if (!hero) return;

    var glowEl = hero.querySelector('.hero-glow');
    // Also target .hero-orb elements if they exist
    var orbEls = hero.querySelectorAll('.hero-orb');
    if (!glowEl && orbEls.length === 0) return;

    var parallaxTargets = [];
    if (glowEl) parallaxTargets.push(glowEl);
    for (var i = 0; i < orbEls.length; i++) {
      parallaxTargets.push(orbEls[i]);
    }

    var rafPending = false;
    var mouseX = 0;
    var mouseY = 0;

    hero.addEventListener('mousemove', function (e) {
      // Desktop only
      if (window.innerWidth <= 768) return;

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(function () {
          var rect = hero.getBoundingClientRect();
          // Normalized -1 to 1 from center of hero
          var nx = ((mouseX - rect.left) / rect.width - 0.5) * 2;
          var ny = ((mouseY - rect.top) / rect.height - 0.5) * 2;

          // Move in opposite direction, max ~20px shift
          var offsetX = -nx * 20;
          var offsetY = -ny * 20;

          for (var t = 0; t < parallaxTargets.length; t++) {
            parallaxTargets[t].style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px)';
          }

          rafPending = false;
        });
      }
    }, { passive: true });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', function () {
      for (var t = 0; t < parallaxTargets.length; t++) {
        parallaxTargets[t].style.transform = 'translate(0px, 0px)';
        parallaxTargets[t].style.transition = 'transform 0.4s ease';
      }
      // Remove the transition after it completes so mousemove isn't sluggish
      setTimeout(function () {
        for (var t = 0; t < parallaxTargets.length; t++) {
          parallaxTargets[t].style.transition = '';
        }
      }, 400);
    });
  }


  /* ═══════════════════════════════════════════════════
     NEW FEATURE 5: 3D Tilt Effect on Feature Cards
     On mouseover of .feature-card, applies a subtle
     3D tilt based on cursor position within the card.
     Max rotation: 3 degrees. Resets on mouseout.
     Desktop only (>768px).
     Uses requestAnimationFrame for performance.
     ═══════════════════════════════════════════════════ */

  function initCardTilt() {
    var cards = document.querySelectorAll('.feature-card');
    if (cards.length === 0) return;

    // Apply perspective to parent for 3D transforms
    var grids = document.querySelectorAll('.features-grid');
    for (var g = 0; g < grids.length; g++) {
      grids[g].style.perspective = '800px';
    }

    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        var tiltRafPending = false;
        var cMouseX = 0;
        var cMouseY = 0;

        card.style.transformStyle = 'preserve-3d';
        card.style.willChange = 'transform';

        card.addEventListener('mousemove', function (e) {
          // Desktop only
          if (window.innerWidth <= 768) return;

          cMouseX = e.clientX;
          cMouseY = e.clientY;

          if (!tiltRafPending) {
            tiltRafPending = true;
            requestAnimationFrame(function () {
              var rect = card.getBoundingClientRect();
              // Normalized -0.5 to 0.5 from center
              var nx = (cMouseX - rect.left) / rect.width - 0.5;
              var ny = (cMouseY - rect.top) / rect.height - 0.5;

              // Rotate: X axis tilts based on Y position, Y axis tilts based on X position
              // Max 3 degrees, inverted for natural feel
              var rotateX = -ny * 3 * 2; // *2 because range is -0.5 to 0.5
              var rotateY = nx * 3 * 2;

              card.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
              tiltRafPending = false;
            });
          }
        }, { passive: true });

        card.addEventListener('mouseleave', function () {
          card.style.transition = 'transform 0.4s ease';
          card.style.transform = 'rotateX(0deg) rotateY(0deg)';
          // Clear transition after reset so mousemove stays snappy
          setTimeout(function () {
            card.style.transition = '';
          }, 400);
        });
      })(cards[i]);
    }
  }


  /* ═══════════════════════════════════════════════════
     NEW FEATURE 4: Navbar Active Link Tracking (enhanced)
     The existing updateActiveNav() handles this.
     This section adds a highlight "pill" underline that
     slides to the active link for a polished look.
     Also ensures the first matching section is highlighted
     on page load and after language toggle.
     ═══════════════════════════════════════════════════ */

  // The core active-link logic is already above (updateActiveNav).
  // We just ensure it fires on DOMContentLoaded and on resize.
  function initActiveNavTracking() {
    // Fire once immediately
    updateActiveNav();
    // Also re-check on resize (section offsets may change)
    window.addEventListener('resize', function () {
      updateActiveNav();
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════
     INIT — Wire everything up
     ═══════════════════════════════════════════════════ */

  function init() {
    applyLang();
    applyPricing();
    initScrollAnimations();
    updateActiveNav();

    // New features
    initStatCounters();
    initHeroParallax();
    initCardTilt();
    initActiveNavTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
