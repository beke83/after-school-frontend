// Lesson details page Vue app (Vue 3, Options API).
// The page is opened as lesson.html?id=5 — we read the id from the URL's query string,
// because there is no Vue Router (each page is its own .html file).
const { createApp } = Vue;

const MAX_SPACES = 5;

createApp({
  data() {
    return {
      // Current theme; starts from whatever js/theme.js already applied to <html>
      isDark: Theme.isDark(),

      // Filled in created() once we know which id is in the URL
      lesson: null,     // { id, topic, location, price, space, icon }
      details: null,    // { summary, ages, day, time, weeks, tutor, syllabus, bring }

      maxSpaces: MAX_SPACES
    };
  },

  computed: {
    // Price split over the course length, e.g. £100 over 10 weeks = £10
    pricePerWeek() {
      return Math.round(this.lesson.price / this.details.weeks);
    },

    // Up to 3 other lessons: same location first, then the cheapest of the rest
    relatedLessons() {
      const others = dummyLessons.filter(l => l.id !== this.lesson.id);
      const sameLocation = others.filter(l => l.location === this.lesson.location);
      const rest = others
        .filter(l => l.location !== this.lesson.location)
        .sort((a, b) => a.price - b.price);
      return [...sameLocation, ...rest].slice(0, 3);
    }
  },

  methods: {
    // Flip light/dark, update <html>, and remember the choice in localStorage
    toggleTheme() {
      this.isDark = !this.isDark;
      Theme.apply(this.isDark, true);
    },

    // Same colour rule as the lessons page, so a lesson keeps its colour everywhere
    tileClass(id) {
      return [
        'bg-red-light text-red-dark dark:bg-night-raised dark:text-red',
        'bg-yellow-light text-yellow-dark dark:bg-night-raised dark:text-yellow',
        'bg-green-light text-green-deep dark:bg-night-raised dark:text-green'
      ][(id - 1) % 3];
    },

    spacesLabel(space) {
      return space + (space === 1 ? ' space' : ' spaces') + ' left';
    }
  },

  // created() runs before the page is drawn, so the right lesson shows straight away
  created() {
    const id = Number(new URLSearchParams(window.location.search).get('id'));
    const found = dummyLessons.find(l => l.id === id);

    if (found) {
      this.lesson = { ...found };
      this.details = dummyLessonDetails[id];
      document.title = found.topic + ' in ' + found.location + ' — Classbar';
    }
    // If nothing matched, lesson stays null and the template shows "not found" (v-else)
  },

  mounted() {
    // If the user hasn't chosen a theme, follow the OS when it changes
    Theme.watchSystem(dark => { this.isDark = dark; });
  }
}).mount('#app');
