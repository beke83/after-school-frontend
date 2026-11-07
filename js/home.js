// Home page Vue app (Vue 3, Options API, loaded from the CDN as the global `Vue`).
const { createApp } = Vue;

createApp({
  // data() returns the reactive state. Anything here can be used in index.html
  // with {{ }} interpolation or directives like v-for / v-bind.
  data() {
    return {
      // "How it works" steps, rendered with v-for
      steps: [
        {
          title: 'Pick a lesson',
          text: 'Browse maths, music, coding, sport and more. Filter by subject, location or price.',
          icon: 'fa-magnifying-glass',
          tag: 'browse',
          colour: 'red'
        },
        {
          title: 'Add to cart',
          text: 'Each class has 5 spaces. Add one for every child — we keep count for you.',
          icon: 'fa-cart-plus',
          tag: 'choose',
          colour: 'yellow'
        },
        {
          title: 'Check out',
          text: 'Pop in a name and phone number and the spaces are yours. No account needed.',
          icon: 'fa-circle-check',
          tag: 'booked',
          colour: 'green'
        }
      ],

      // "Popular subjects" grid, rendered with v-for
      subjects: [
        { name: 'Maths',    icon: 'fa-calculator',      colour: 'yellow', blurb: 'Times tables to GCSE prep.' },
        { name: 'English',  icon: 'fa-book-open',       colour: 'red',    blurb: 'Reading, writing and spelling.' },
        { name: 'Science',  icon: 'fa-flask',           colour: 'green',  blurb: 'Hands-on experiments.' },
        { name: 'Coding',   icon: 'fa-code',            colour: 'yellow', blurb: 'Scratch, Python and web.' },
        { name: 'Music',    icon: 'fa-music',           colour: 'red',    blurb: 'Piano, guitar and singing.' },
        { name: 'Art',      icon: 'fa-palette',         colour: 'green',  blurb: 'Drawing, painting, making.' },
        { name: 'Football', icon: 'fa-futbol',          colour: 'yellow', blurb: 'Skills, drills and matches.' },
        { name: 'Chess',    icon: 'fa-chess-knight',    colour: 'red',    blurb: 'Think three moves ahead.' }
      ],

      // Stats strip
      stats: [
        { value: '10+', label: 'subjects to choose from' },
        { value: '5',   label: 'spaces per class' },
        { value: '6',   label: 'local locations' }
      ],

      year: new Date().getFullYear()
    };
  },

  // computed values are cached and update automatically when the data they use changes.
  computed: {
    subjectCount() {
      return this.subjects.length;
    }
  },

  // methods are plain functions the template can call.
  methods: {
    // Map a colour name to the matching .tag class from css/styles.css
    tagClass(colour) {
      return 'tag-' + colour;
    },

    // Soft background for the subject icon square, e.g. "bg-yellow-light"
    iconBg(colour) {
      return {
        yellow: 'bg-yellow-light text-yellow-dark',
        red: 'bg-red-light text-red-dark',
        green: 'bg-green-light text-green-deep'
      }[colour];
    }
  }
}).mount('#app');
