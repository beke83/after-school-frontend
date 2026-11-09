// Home page Vue app (Vue 3, Options API, loaded from the CDN as the global `Vue`).
const { createApp } = Vue;

createApp({
  // data() returns the reactive state. Anything here can be used in index.html
  // with {{ }} interpolation or directives like v-for / v-bind.
  data() {
    return {
      // Current theme; starts from whatever js/theme.js already applied to <html>
      isDark: Theme.isDark(),

      // Mobile menu (phones only): open/closed, toggled by the menu button in the navbar
      menuOpen: false,

      // Text typed into the subject search box (bound with v-model)
      search: '',

      // DUMMY DATA — will be replaced by fetch() to the Express API (GET /lessons) later.
      // "How it works" steps, rendered with v-for
      steps: [
        { title: 'Pick a lesson', text: 'Browse maths, music, coding, sport and more.',  icon: 'fa-magnifying-glass', tag: 'browse', colour: 'red' },
        { title: 'Add to cart',   text: 'Every class has 5 spaces — add one per child.', icon: 'fa-cart-plus',        tag: 'choose', colour: 'yellow' },
        { title: 'Check out',     text: 'Just a name and phone number. No account.',      icon: 'fa-circle-check',     tag: 'booked', colour: 'green', featured: true }
      ],

      // DUMMY DATA — will be replaced by fetch() to the Express API (GET /lessons) later.
      // "Popular subjects" grid, rendered with v-for
      subjects: [
        { name: 'Maths',    icon: 'fa-calculator',   colour: 'yellow', blurb: 'Times tables to GCSE prep.' },
        { name: 'English',  icon: 'fa-book-open',    colour: 'red',    blurb: 'Reading, writing and spelling.' },
        { name: 'Science',  icon: 'fa-flask',        colour: 'green',  blurb: 'Hands-on experiments.' },
        { name: 'Coding',   icon: 'fa-code',         colour: 'yellow', blurb: 'Scratch, Python and web.', featured: true },
        { name: 'Music',    icon: 'fa-music',        colour: 'red',    blurb: 'Piano, guitar and singing.' },
        { name: 'Art',      icon: 'fa-palette',      colour: 'green',  blurb: 'Drawing, painting, making.' },
        { name: 'Football', icon: 'fa-futbol',       colour: 'yellow', blurb: 'Skills, drills and matches.' },
        { name: 'Chess',    icon: 'fa-chess-knight', colour: 'red',    blurb: 'Think three moves ahead.' }
      ],

      // DUMMY DATA — will be replaced by fetch() to the Express API (GET /lessons) later.
      // Stats strip
      stats: [
        { value: '10+', label: 'subjects to choose from' },
        { value: '5',   label: 'spaces per class', featured: true },
        { value: '6',   label: 'local locations' }
      ],

      year: new Date().getFullYear()
    };
  },

  // computed values are cached and update automatically when the data they use changes.
  computed: {
    subjectCount() {
      return this.subjects.length;
    },

    // Subjects whose name contains the search text (case-insensitive)
    filteredSubjects() {
      const term = this.search.trim().toLowerCase();
      return this.subjects.filter(s => s.name.toLowerCase().includes(term));
    }
  },

  // methods are plain functions the template can call.
  methods: {
    // Flip light/dark, update <html>, and remember the choice in localStorage
    toggleTheme() {
      this.isDark = !this.isDark;
      Theme.apply(this.isDark, true);
    },

    clearSearch() {
      this.search = '';
    },

    // Map a colour name to the matching .tag class from css/styles.css
    tagClass(colour) {
      return 'tag-' + colour;
    },

    // Icon square colours for light and dark mode
    iconBg(colour) {
      return {
        yellow: 'bg-yellow-light text-ink dark:bg-night-raised dark:text-yellow',
        red:    'bg-red-light text-red-dark dark:bg-night-raised dark:text-red',
        green:  'bg-green-light text-green-deep dark:bg-night-raised dark:text-green'
      }[colour];
    }
  },

  // mounted() runs once the app is on the page — a good place to add listeners.
  mounted() {
    // If the user hasn't chosen a theme, follow the OS when it changes
    Theme.watchSystem(dark => { this.isDark = dark; });
  }
}).mount('#app');
