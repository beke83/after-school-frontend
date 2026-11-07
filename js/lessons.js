// Lessons page Vue app (Vue 3, Options API).
const { createApp } = Vue;

// Every class starts with this many spaces (used for the 5-dot indicator)
const MAX_SPACES = 5;

createApp({
  // data() returns the reactive state used in lessons.html
  data() {
    return {
      // Current theme; starts from whatever js/theme.js already applied to <html>
      isDark: Theme.isDark(),

      // Copy the dummy array from js/lessons-data.js into reactive data.
      // Each lesson is copied too, so changing `space` later won't touch the original.
      lessons: dummyLessons.map(lesson => ({ ...lesson })),

      maxSpaces: MAX_SPACES
    };
  },

  computed: {
    lessonCount() {
      return this.lessons.length;
    },

    // The cheapest lesson gets the "featured" card (green border in dark mode)
    featuredId() {
      return this.lessons.reduce((best, l) => (l.price < best.price ? l : best)).id;
    }
  },

  methods: {
    // Flip light/dark, update <html>, and remember the choice in localStorage
    toggleTheme() {
      this.isDark = !this.isDark;
      Theme.apply(this.isDark, true);
    },

    // Cycle red → yellow → green for the icon tiles, based on the card's position
    tileClass(index) {
      return [
        'bg-red-light text-red-dark dark:bg-night-raised dark:text-red',
        'bg-yellow-light text-yellow-dark dark:bg-night-raised dark:text-yellow',
        'bg-green-light text-green-deep dark:bg-night-raised dark:text-green'
      ][index % 3];
    },

    // "1 space left" / "5 spaces left"
    spacesLabel(space) {
      return space + (space === 1 ? ' space' : ' spaces') + ' left';
    }
  },

  mounted() {
    // If the user hasn't chosen a theme, follow the OS when it changes
    Theme.watchSystem(dark => { this.isDark = dark; });
  }
}).mount('#app');
