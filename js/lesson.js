// Lesson details page Vue app (Vue 3, Options API).
// The page is opened as lesson.html?id=5 — we read the id from the URL's query string,
// because there is no Vue Router (each page is its own .html file).
const { createApp } = Vue;

const MAX_SPACES = 5;

// How long the "Added ✓" label stays on the button, in milliseconds
const ADDED_FEEDBACK_MS = 1000;

// Timer for the "Added ✓" label (not shown on the page, so not reactive)
let addedTimer = null;

createApp({
  data() {
    return {
      // Current theme; starts from whatever js/theme.js already applied to <html>
      isDark: Theme.isDark(),

      // Mobile menu (phones only): open/closed, toggled by the menu button in the navbar
      menuOpen: false,

      // Shown in the footer: © {{ year }} Classbar
      year: new Date().getFullYear(),

      // Filled in created() once we know which id is in the URL
      lesson: null,     // { id, topic, location, price, space, icon }
      details: null,    // { summary, ages, day, time, weeks, tutor, syllabus, bring }

      // Same cart as the lessons page, loaded from localStorage by js/cart.js
      cart: Cart.load(),

      // true for ~1 second after clicking Add to cart
      justAdded: false,

      maxSpaces: MAX_SPACES
    };
  },

  computed: {
    // Price split over the course length, e.g. £100 over 10 weeks = £10
    pricePerWeek() {
      return Math.round(this.lesson.price / this.details.weeks);
    },

    // How many spaces of THIS lesson are already in the cart
    inCartCount() {
      return Cart.countOf(this.cart, this.lesson.id);
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
        'bg-yellow-light text-ink dark:bg-night-raised dark:text-yellow',
        'bg-green-light text-green-deep dark:bg-night-raised dark:text-green'
      ][(id - 1) % 3];
    },

    spacesLabel(space) {
      if (space === 0) return 'No spaces left';
      return space + (space === 1 ? ' space' : ' spaces') + ' left';
    },

    canAddToCart() {
      return this.lesson.space > 0;
    },

    // Same rules as the lessons page: guard, add the id, take a space off, save.
    // this.lesson is reactive, so the dots, text and button update straight away.
    addToCart() {
      if (!this.canAddToCart()) return;

      this.cart.push(this.lesson.id);
      this.lesson.space--;
      Cart.save(this.cart);

      // Show "Added ✓" for ~1 second (restart the timer on fast repeat clicks)
      this.justAdded = true;
      clearTimeout(addedTimer);
      addedTimer = setTimeout(() => { this.justAdded = false; }, ADDED_FEEDBACK_MS);
    }
  },

  // created() runs before the page is drawn, so the right lesson shows straight away
  created() {
    const id = Number(new URLSearchParams(window.location.search).get('id'));
    const found = dummyLessons.find(l => l.id === id);

    if (found) {
      // Copy the lesson and take off any spaces already in the saved cart
      this.lesson = Cart.applyToLessons([found], this.cart)[0];
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
