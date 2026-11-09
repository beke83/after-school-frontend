// About page Vue app (Vue 3, Options API).
const { createApp } = Vue;

createApp({
  // data() returns the reactive state used in about.html
  data() {
    return {
      // Current theme; starts from whatever js/theme.js already applied to <html>
      isDark: Theme.isDark(),

      // DUMMY DATA — will be replaced by fetch() to the Express API (GET /lessons) later.
      // "How booking works" steps, rendered with v-for. The last one is the featured card.
      steps: [
        { id: 1, title: 'Browse',      icon: 'fa-magnifying-glass', text: 'Search and sort lessons by subject, location, price or spaces.' },
        { id: 2, title: 'Add to cart', icon: 'fa-cart-plus',        text: 'Add one space per child. Every class has 5 spaces.' },
        { id: 3, title: 'Check out',   icon: 'fa-lock',             text: 'Just a name and phone number — no account needed.' },
        { id: 4, title: 'Attend',      icon: 'fa-flag-checkered',   text: 'Turn up after school and enjoy the lesson.' }
      ],

      // DUMMY DATA — will be replaced by fetch() to the Express API (GET /lessons) later.
      // FAQ items. `open` says whether the answer is showing; all start closed.
      faqs: [
        { id: 1, open: false, question: 'How many spaces per lesson?',
          answer: 'Every lesson has 5 spaces, so groups stay small and every child gets attention. When they are gone, the lesson shows as "Full".' },
        { id: 2, open: false, question: 'Can I book more than one space?',
          answer: 'Yes. Click "Add to cart" once for each child — two children in Maths means adding Maths twice. You can also book several different lessons in one checkout.' },
        { id: 3, open: false, question: 'How do I cancel?',
          answer: 'Call us on the number in your confirmation at least 48 hours before the first lesson and we will free up your space.' },
        { id: 4, open: false, question: 'Where are lessons held?',
          answer: 'At 6 local venues: Hendon, Colindale, Brent Cross, Golders Green, Mill Hill and Edgware. Each lesson card shows its location.' },
        { id: 5, open: false, question: 'How do I pay?',
          answer: 'You reserve your space online with just a name and phone number, then pay at the first lesson. Online payment is coming soon.' },
        { id: 6, open: false, question: 'Who teaches the lessons?',
          answer: 'Experienced, DBS-checked tutors and coaches who specialise in their subject. You can see each tutor on the lesson details page.' }
      ]
    };
  },

  methods: {
    // Flip light/dark, update <html>, and remember the choice in localStorage
    toggleTheme() {
      this.isDark = !this.isDark;
      Theme.apply(this.isDark, true);
    },

    // Open the clicked question, or close it if it's already open.
    // Only one FAQ is open at a time: remember what this one should become,
    // close every FAQ, then set this one. Because each `faq` object is reactive,
    // changing faq.open makes Vue re-run its v-show and the chevron's :class.
    toggleFaq(faq) {
      const willOpen = !faq.open;
      this.faqs.forEach(item => { item.open = false; });
      faq.open = willOpen;
    }
  },

  mounted() {
    // If the user hasn't chosen a theme, follow the OS when it changes
    Theme.watchSystem(dark => { this.isDark = dark; });
  }
}).mount('#app');
