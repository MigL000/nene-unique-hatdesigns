(function () {
  'use strict';

  var LANGS = ['sv', 'en', 'da', 'no', 'es'];
  var DEFAULT_LANG = 'sv';
  var STORAGE_KEY = 'nene_lang';

  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function resolve(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  function t(lang, key) {
    var dict = window.NENE_I18N[lang] || window.NENE_I18N[DEFAULT_LANG];
    var value = resolve(dict, key);
    if (value === null) value = resolve(window.NENE_I18N[DEFAULT_LANG], key);
    return value === null ? '' : value;
  }

  function applyTranslations(lang) {
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = t(lang, el.getAttribute('data-i18n'));
      if (value) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var value = t(lang, el.getAttribute('data-i18n-placeholder'));
      if (value) el.setAttribute('placeholder', value);
    });

    var titleKey = document.body.getAttribute('data-title-key');
    if (titleKey) {
      var title = t(lang, titleKey);
      if (title) document.title = title;
    }

    renderProducts(lang);
    renderInspiration();
    updateLangUI(lang);
  }

  function renderProducts(lang) {
    var grid = document.querySelector('[data-product-grid]');
    if (!grid) return;
    var category = grid.getAttribute('data-product-grid');
    var items = (window.NENE_PRODUCTS && window.NENE_PRODUCTS[category]) || [];
    var soldLabel = t(lang, 'common.soldLabel');

    grid.innerHTML = items.map(function (item) {
      var desc = t(lang, 'products.' + item.descKey);
      if (item.size) desc = desc.replace('{size}', item.size);
      var soldBadge = item.sold ? '<span class="badge-sold">' + soldLabel + '</span>' : '';
      return (
        '<article class="product-card" data-reveal>' +
          '<div class="product-media">' +
            soldBadge +
            '<img src="images/' + item.img + '" alt="' + desc.replace(/"/g, '&quot;') + '" loading="lazy" />' +
          '</div>' +
          '<div class="product-info">' +
            '<div class="product-price">' + item.price + ' kr</div>' +
            '<p class="product-desc">' + desc + '</p>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    var countEl = document.querySelector('[data-product-count]');
    if (countEl) countEl.textContent = items.length;

    initReveal();
    initLightbox();
  }

  function renderInspiration() {
    var grid = document.querySelector('[data-gallery-grid]');
    if (!grid || grid.childElementCount > 0) return;
    var images = window.NENE_INSPIRATION || [];
    grid.innerHTML = images.map(function (img) {
      return '<figure><img src="images/' + img + '" alt="Nene Unique Hatdesigns" loading="lazy" /></figure>';
    }).join('');
    initLightbox();
  }

  function updateLangUI(lang) {
    document.querySelectorAll('[data-lang-current]').forEach(function (el) {
      el.textContent = lang.toUpperCase();
    });
    document.querySelectorAll('.lang-menu button').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    });
  }

  function initLangSwitch() {
    var switchEl = document.querySelector('.lang-switch');
    if (!switchEl) return;
    var toggle = switchEl.querySelector('.lang-toggle');
    var menu = switchEl.querySelector('.lang-menu');

    if (menu && !menu.dataset.built) {
      var dict = window.NENE_I18N[getLang()];
      menu.innerHTML = LANGS.map(function (code) {
        return '<button type="button" data-lang="' + code + '">' + dict.languageNames[code] + '</button>';
      }).join('');
      menu.dataset.built = 'true';
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      switchEl.classList.toggle('is-open');
    });

    menu.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      var lang = btn.getAttribute('data-lang');
      saveLang(lang);
      applyTranslations(lang);
      switchEl.classList.remove('is-open');
    });

    document.addEventListener('click', function () {
      switchEl.classList.remove('is-open');
    });
  }

  function initMobileMenu() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.menu-toggle');
    if (!header || !toggle) return;
    toggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll', isOpen);
    });
    document.querySelectorAll('.main-nav > a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
      });
    });
    document.querySelectorAll('.main-nav .dropdown a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
      });
    });
    document.querySelectorAll('.dropdown-trigger').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
      });
    });
    var dropdownCaret = document.querySelector('.dropdown-caret');
    if (dropdownCaret) {
      dropdownCaret.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var expanded = dropdownCaret.parentElement.classList.toggle('is-expanded');
        dropdownCaret.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
    }
  }

  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header || !document.body.classList.contains('has-hero')) return;
    function onScroll() {
      header.classList.toggle('is-solid', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]:not(.is-visible), [data-reveal-group]:not(.is-visible)');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  function initLightbox() {
    var lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;
    var lightboxImg = lightbox.querySelector('img');

    lightbox._items = Array.prototype.slice.call(document.querySelectorAll('.product-media img, .gallery-grid img'));

    var prevBtn = lightbox.querySelector('.lightbox-prev');
    if (!prevBtn) {
      prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'lightbox-nav lightbox-prev';
      prevBtn.setAttribute('aria-label', 'Föregående bild');
      prevBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      lightbox.appendChild(prevBtn);
    }
    var nextBtn = lightbox.querySelector('.lightbox-next');
    if (!nextBtn) {
      nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'lightbox-nav lightbox-next';
      nextBtn.setAttribute('aria-label', 'Nästa bild');
      nextBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      lightbox.appendChild(nextBtn);
    }

    function openImage(idx) {
      var items = lightbox._items;
      if (idx < 0 || idx >= items.length) return;
      lightbox._currentIndex = idx;
      var img = items[idx];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
      document.body.classList.add('no-scroll');
      prevBtn.classList.toggle('is-hidden', idx <= 0);
      nextBtn.classList.toggle('is-hidden', idx >= items.length - 1);
    }
    lightbox._openImage = openImage;

    lightbox._items.forEach(function (img, idx) {
      if (img.dataset.lightboxBound) return;
      img.dataset.lightboxBound = 'true';
      img.parentElement.addEventListener('click', function () {
        lightbox._openImage(idx);
      });
    });

    if (!lightbox.dataset.bound) {
      lightbox.dataset.bound = 'true';
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightboxImg || e.target.closest('.lightbox-nav')) return;
        closeLightbox();
      });
      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        lightbox._openImage(lightbox._currentIndex - 1);
      });
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        lightbox._openImage(lightbox._currentIndex + 1);
      });
      document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightbox._openImage(lightbox._currentIndex - 1);
        if (e.key === 'ArrowRight') lightbox._openImage(lightbox._currentIndex + 1);
      });
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }
  }

  function initActiveNav() {
    var current = (location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.main-nav a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('is-active');
      }
    });
  }

  function initFooterYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  function initBackToTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Till toppen');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
    document.body.appendChild(btn);

    function toggle() {
      btn.classList.toggle('is-visible', window.scrollY > 480);
    }
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;
    var success = form.querySelector('.form-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          form.reset();
          if (success) success.classList.add('is-visible');
        } else {
          window.location.href = 'mailto:info@nene.nu';
        }
      }).catch(function () {
        window.location.href = 'mailto:info@nene.nu';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lang = getLang();
    initLangSwitch();
    initMobileMenu();
    initHeaderScroll();
    initActiveNav();
    initFooterYear();
    initContactForm();
    initBackToTop();
    applyTranslations(lang);
    initReveal();
  });
})();
