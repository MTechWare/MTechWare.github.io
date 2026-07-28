/* ─── MTechWare Site Settings ───
   Shared theme + accent color picker for all site pages.
   Persists to localStorage and applies via CSS variables.
   (Not used by mlibrary-app.html — the app has its own theming.) */
(function () {
  'use strict';

  var KEY = 'mtechware-settings';
  var DEFAULTS = { theme: 'dark', accent: '#ff8000', background: 'grid' };
  var BACKGROUNDS = ['grid', 'dots', 'glow', 'gradient', 'solid'];

  var ACCENTS = [
    { name: 'Orange', value: '#ff8000' },
    { name: 'Red', value: '#ff6b6b' },
    { name: 'Purple', value: '#a78bfa' },
    { name: 'Blue', value: '#4da6ff' },
    { name: 'Green', value: '#34d399' },
    { name: 'Teal', value: '#2dd4bf' },
    { name: 'Pink', value: '#ff6bd6' },
    { name: 'Gold', value: '#ffb347' }
  ];

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {
        theme: ['dark', 'light', 'system'].indexOf(saved.theme) !== -1 ? saved.theme : DEFAULTS.theme,
        accent: /^#[0-9a-fA-F]{6}$/.test(saved.accent || '') ? saved.accent : DEFAULTS.accent,
        background: BACKGROUNDS.indexOf(saved.background) !== -1 ? saved.background : DEFAULTS.background
      };
    } catch (e) {
      return { theme: DEFAULTS.theme, accent: DEFAULTS.accent, background: DEFAULTS.background };
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch (e) { /* private mode */ }
  }

  var settings = load();
  var root = document.documentElement;
  var lightQuery = window.matchMedia('(prefers-color-scheme: light)');

  function resolvedTheme() {
    if (settings.theme === 'system') return lightQuery.matches ? 'light' : 'dark';
    return settings.theme;
  }

  function apply() {
    root.setAttribute('data-theme', resolvedTheme());
    root.setAttribute('data-bg', settings.background);
    root.style.setProperty('--accent', settings.accent);
    /* Derived shades — pages that define these get recolored too */
    root.style.setProperty('--accent-hover', 'color-mix(in srgb, ' + settings.accent + ' 85%, #000)');
    root.style.setProperty('--accent-glow', 'color-mix(in srgb, ' + settings.accent + ' 6%, transparent)');
    root.style.setProperty('--accent-border', 'color-mix(in srgb, ' + settings.accent + ' 30%, transparent)');
    root.style.setProperty('--accent2', settings.accent);
  }

  apply();
  lightQuery.addEventListener('change', function () {
    if (settings.theme === 'system') apply();
  });

  /* ─── Global style overrides (light theme + accent-tinted hardcoded colors) ─── */
  var css = [
    'html[data-theme="light"] { --bg:#f6f5f2; --surface:#ffffff; --surface2:#efeee9; --border:#d8d5cd; --text:#1a1d23; --muted:#6b7280; }',
    'html[data-theme="light"] body { background-image: linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px); }',
    'html[data-theme="light"] body::before { opacity: 0.15; }',
    'nav { background: color-mix(in srgb, var(--bg) 85%, transparent) !important; }',
    '.hero-glow { background: radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 70%) !important; }',
    '.cta-banner::before { background: radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--accent) 5%, transparent) 0%, transparent 70%) !important; }',
    '.badge-live { background: color-mix(in srgb, var(--accent) 10%, transparent) !important; color: var(--accent) !important; border-color: color-mix(in srgb, var(--accent) 30%, transparent) !important; }',
    '.btn-primary:hover { background: color-mix(in srgb, var(--accent) 85%, #000) !important; }',
    '.animated-logo stop { stop-color: var(--accent); }',

    /* ─── Background styles ─── */
    'html[data-bg="grid"] body { background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px) !important; background-size: 40px 40px !important; }',
    'html[data-theme="light"][data-bg="grid"] body { background-image: linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px) !important; }',
    'html[data-bg="dots"] body { background-image: radial-gradient(rgba(255,255,255,0.22) 1.5px, transparent 1.5px) !important; background-size: 26px 26px !important; }',
    'html[data-theme="light"][data-bg="dots"] body { background-image: radial-gradient(rgba(0,0,0,0.2) 1.5px, transparent 1.5px) !important; }',
    'html[data-bg="glow"] body { background-image: radial-gradient(1100px 700px at 50% 0%, color-mix(in srgb, var(--accent) 13%, var(--bg)) 0%, var(--bg) 72%) !important; background-size: cover !important; background-attachment: fixed !important; }',
    'html[data-bg="gradient"] body { background-image: linear-gradient(160deg, color-mix(in srgb, var(--accent) 14%, var(--bg)) 0%, var(--bg) 45%, color-mix(in srgb, var(--accent) 8%, var(--bg)) 100%) !important; background-size: cover !important; background-attachment: fixed !important; }',
    'html[data-bg="solid"] body { background-image: none !important; }',

    /* ─── Settings button + panel ─── */
    '#mtw-settings-btn { position: fixed; bottom: 1.4rem; right: 1.4rem; z-index: 10000; width: 46px; height: 46px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: color 0.2s, border-color 0.2s, transform 0.3s; box-shadow: 0 4px 16px rgba(0,0,0,0.25); }',
    '#mtw-settings-btn:hover { color: var(--accent); border-color: var(--accent); transform: rotate(45deg); }',
    '#mtw-settings-btn svg { width: 22px; height: 22px; }',
    '#mtw-settings-panel { position: fixed; bottom: 4.6rem; right: 1.4rem; z-index: 10000; width: 264px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.1rem 1.2rem 1.2rem; font-family: "Syne", sans-serif; color: var(--text); box-shadow: 0 12px 40px rgba(0,0,0,0.35); display: none; }',
    '#mtw-settings-panel.open { display: block; animation: mtwPanelIn 0.18s ease; }',
    '@keyframes mtwPanelIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }',
    '#mtw-settings-panel h6 { font-family: "Space Mono", monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--accent); margin: 0 0 0.8rem; }',
    '#mtw-settings-panel .mtw-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin: 0.9rem 0 0.5rem; font-weight: 600; }',
    '.mtw-theme-row { display: flex; gap: 0.4rem; }',
    '.mtw-theme-row button { flex: 1; padding: 0.45rem 0; border-radius: 6px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: "Syne", sans-serif; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }',
    '.mtw-theme-row button:hover { color: var(--text); border-color: var(--muted); }',
    '.mtw-theme-row button.active { background: var(--accent); border-color: var(--accent); color: #000; }',
    '.mtw-bg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; }',
    '.mtw-bg-grid button { padding: 0.45rem 0; border-radius: 6px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: "Syne", sans-serif; font-size: 0.74rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }',
    '.mtw-bg-grid button:hover { color: var(--text); border-color: var(--muted); }',
    '.mtw-bg-grid button.active { background: var(--accent); border-color: var(--accent); color: #000; }',
    '.mtw-swatches { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }',
    '.mtw-swatches button { width: 100%; aspect-ratio: 1; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.15s, border-color 0.15s; padding: 0; }',
    '.mtw-swatches button:hover { transform: scale(1.12); }',
    '.mtw-swatches button.active { border-color: var(--text); }',
    '.mtw-custom-row { display: flex; align-items: center; gap: 0.6rem; margin-top: 0.7rem; }',
    '.mtw-custom-row input[type="color"] { width: 34px; height: 26px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface2); cursor: pointer; padding: 2px; }',
    '.mtw-custom-row span { font-size: 0.78rem; color: var(--muted); }',
    '#mtw-reset { margin-top: 1rem; width: 100%; padding: 0.45rem 0; border-radius: 6px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: "Space Mono", monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.15s; }',
    '#mtw-reset:hover { color: var(--accent); border-color: var(--accent); }'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id = 'mtw-settings-style';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ─── UI ─── */
  function buildUI() {
    var btn = document.createElement('button');
    btn.id = 'mtw-settings-btn';
    btn.setAttribute('aria-label', 'Site settings');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="3"></circle>' +
      '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' +
      '</svg>';

    var panel = document.createElement('div');
    panel.id = 'mtw-settings-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Site settings');

    var swatchesHTML = ACCENTS.map(function (a) {
      return '<button type="button" data-accent="' + a.value + '" title="' + a.name + '" aria-label="' + a.name + '" style="background:' + a.value + '"></button>';
    }).join('');

    panel.innerHTML =
      '<h6>⬡ Settings</h6>' +
      '<div class="mtw-label">Theme</div>' +
      '<div class="mtw-theme-row">' +
      '<button type="button" data-theme="dark">Dark</button>' +
      '<button type="button" data-theme="light">Light</button>' +
      '<button type="button" data-theme="system">Auto</button>' +
      '</div>' +
      '<div class="mtw-label">Background</div>' +
      '<div class="mtw-bg-grid">' +
      '<button type="button" data-bg="grid">Grid</button>' +
      '<button type="button" data-bg="dots">Dots</button>' +
      '<button type="button" data-bg="glow">Glow</button>' +
      '<button type="button" data-bg="gradient">Gradient</button>' +
      '<button type="button" data-bg="solid">Solid</button>' +
      '</div>' +
      '<div class="mtw-label">Accent Color</div>' +
      '<div class="mtw-swatches">' + swatchesHTML + '</div>' +
      '<div class="mtw-custom-row">' +
      '<input type="color" id="mtw-custom-color" aria-label="Custom accent color" value="' + settings.accent + '">' +
      '<span>Custom color</span>' +
      '</div>' +
      '<button type="button" id="mtw-reset">Reset Defaults</button>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    var themeBtns = panel.querySelectorAll('.mtw-theme-row button');
    var bgBtns = panel.querySelectorAll('.mtw-bg-grid button');
    var swatchBtns = panel.querySelectorAll('.mtw-swatches button');
    var customInput = panel.querySelector('#mtw-custom-color');

    function syncUI() {
      themeBtns.forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-theme') === settings.theme);
      });
      bgBtns.forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-bg') === settings.background);
      });
      swatchBtns.forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-accent').toLowerCase() === settings.accent.toLowerCase());
      });
      customInput.value = settings.accent;
    }

    themeBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        settings.theme = b.getAttribute('data-theme');
        apply(); save(); syncUI();
      });
    });

    bgBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        settings.background = b.getAttribute('data-bg');
        apply(); save(); syncUI();
      });
    });

    swatchBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        settings.accent = b.getAttribute('data-accent');
        apply(); save(); syncUI();
      });
    });

    customInput.addEventListener('input', function () {
      settings.accent = customInput.value;
      apply(); save(); syncUI();
    });

    panel.querySelector('#mtw-reset').addEventListener('click', function () {
      settings = { theme: DEFAULTS.theme, accent: DEFAULTS.accent, background: DEFAULTS.background };
      apply(); save(); syncUI();
    });

    function setOpen(open) {
      panel.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!panel.classList.contains('open'));
    });

    document.addEventListener('click', function (e) {
      if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    syncUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
