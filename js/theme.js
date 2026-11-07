// Theme (light/dark) helper — plain JavaScript, no Vue.
// Loaded in <head> BEFORE the page renders, so the `dark` class is already on
// <html> when the browser first paints. That stops a white "flash" in dark mode.
(function () {
  var KEY = 'classbar-theme';
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  // localStorage can throw (private windows, blocked storage) so always guard it.
  function getSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* ignore */ }
  }

  // Saved choice wins; otherwise follow the operating system setting.
  function prefersDark() {
    var saved = getSaved();
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return media.matches;
  }

  // Add or remove the `dark` class that Tailwind's dark: variants look for.
  function apply(dark, remember) {
    document.documentElement.classList.toggle('dark', dark);
    if (remember) save(dark ? 'dark' : 'light');
  }

  // Run straight away (this is what prevents the flash).
  apply(prefersDark(), false);

  // Small API the Vue apps use.
  window.Theme = {
    isDark: prefersDark,
    apply: apply,
    // Follow OS changes, but only if the user hasn't picked a theme themselves.
    watchSystem: function (callback) {
      media.addEventListener('change', function (e) {
        if (getSaved() === null) {
          apply(e.matches, false);
          callback(e.matches);
        }
      });
    }
  };
})();
