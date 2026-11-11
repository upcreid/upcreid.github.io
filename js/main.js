(function () {
  var root = document.documentElement;

  // --- theme toggle ---
  var themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      var themeColor = document.querySelector('[data-theme-color]');
      if (themeColor) {
        themeColor.content = next === 'dark' ? '#24273a' : '#eff1f5';
      }
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // --- language switcher ---
  var langSwitch = document.querySelector('[data-lang-switch]');
  if (langSwitch) {
    var langButton = langSwitch.querySelector('.lang-switch__button');
    langButton.addEventListener('click', function (event) {
      event.stopPropagation();
      var open = langSwitch.dataset.open === 'true';
      langSwitch.dataset.open = open ? 'false' : 'true';
      langButton.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    document.addEventListener('click', function () {
      langSwitch.dataset.open = 'false';
      langButton.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        langSwitch.dataset.open = 'false';
        langButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- search panel ---
  var panel = document.querySelector('[data-search-panel]');
  var toggle = document.querySelector('[data-search-toggle]');
  var input = document.querySelector('[data-search-input]');

  function openSearch() {
    if (!panel) return;
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (input) input.focus();
  }

  function closeSearch() {
    if (!panel) return;
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (panel && toggle) {
    toggle.addEventListener('click', function () {
      if (panel.hidden) openSearch();
      else closeSearch();
    });
    document.addEventListener('keydown', function (event) {
      var isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isShortcut) {
        event.preventDefault();
        if (panel.hidden) openSearch();
        else closeSearch();
        return;
      }
      if (event.key === 'Escape' && !panel.hidden) closeSearch();
    });
  }

  // --- mermaid blocks get a container ---
  document.querySelectorAll('pre > code[data-lang="mermaid"]').forEach(function (code) {
    var pre = code.parentElement;
    var div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = code.textContent;
    pre.replaceWith(div);
  });
})();
