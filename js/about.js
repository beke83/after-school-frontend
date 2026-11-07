// About page Vue app (Vue 3, Options API).
const { createApp } = Vue;

createApp({
  data() {
    return {
      // Current theme; starts from whatever js/theme.js already applied to <html>
      isDark: Theme.isDark(),

      // FAQ items come from js/faq-data.js; `open` tracks which answers are shown
      faqs: FAQ_DATA.map(item => ({ ...item, open: false }))
    };
  },

  methods: {
    // Flip light/dark, update <html>, and remember the choice in localStorage
    toggleTheme() {
      this.isDark = !this.isDark;
      Theme.apply(this.isDark, true);
    },

    // Show or hide one FAQ answer
    toggleFaq(faq) {
      faq.open = !faq.open;
    }
  },

  mounted() {
    // If the user hasn't chosen a theme, follow the OS when it changes
    Theme.watchSystem(dark => { this.isDark = dark; });
  }
}).mount('#app');
