// Lessons page Vue app (Vue 3, Options API). Lesson list and cart come later.
const { createApp } = Vue;

createApp({
  data() {
    return {
      // Current theme; starts from whatever js/theme.js already applied to <html>
      isDark: Theme.isDark()
    };
  },

  methods: {
    // Flip light/dark, update <html>, and remember the choice in localStorage
    toggleTheme() {
      this.isDark = !this.isDark;
      Theme.apply(this.isDark, true);
    }
  },

  mounted() {
    // If the user hasn't chosen a theme, follow the OS when it changes
    Theme.watchSystem(dark => { this.isDark = dark; });
  }
}).mount('#app');
