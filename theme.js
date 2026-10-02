/* Carregado antes do CSS para restaurar a escolha sem piscar o tema claro. */
(() => {
  'use strict';
  const storageKey = 'geoeduca-theme';
  const root = document.documentElement;
  let theme = 'light';
  try {
    if (localStorage.getItem(storageKey) === 'dark') theme = 'dark';
  } catch (_) { /* A opção também funciona quando o armazenamento está bloqueado. */ }
  let button;
  function apply(nextTheme) {
    theme = nextTheme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#0a1220' : '#0B0A32';
    if (button) {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
      button.title = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
    }
    window.dispatchEvent(new CustomEvent('geoeduca:themechange', {detail: {theme}}));
  }
  apply(theme);
  document.addEventListener('DOMContentLoaded', () => {
    button = document.getElementById('theme-toggle');
    if (!button) return;
    button.hidden = false;
    apply(theme);
    button.addEventListener('click', () => {
      apply(theme === 'dark' ? 'light' : 'dark');
      try { localStorage.setItem(storageKey, theme); } catch (_) { /* Preferência mantida nesta página. */ }
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey) apply(event.newValue);
  });
})();
