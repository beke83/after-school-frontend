// Lessons page Vue app (Vue 3, Options API).
const { createApp } = Vue;

// Every class starts with this many spaces (used for the 5-dot indicator)
const MAX_SPACES = 5;

// How long the "Added ✓" label stays on a button, in milliseconds
const ADDED_FEEDBACK_MS = 1000;

// Timer for the "Added ✓" label. Kept outside data() because the page never displays it,
// so it doesn't need to be reactive.
let addedTimer = null;

createApp({
  // data() returns the reactive state used in lessons.html
  data() {
    // Saved cart from js/cart.js (shared with the details page through localStorage)
    const savedCart = Cart.load();

    return {
      // Current theme; starts from whatever js/theme.js already applied to <html>
      isDark: Theme.isDark(),

      // Copy the dummy array from js/lessons-data.js into reactive data.
      // Each lesson is copied too, so changing `space` later won't touch the original,
      // and spaces already in the saved cart are taken off.
      lessons: Cart.applyToLessons(dummyLessons, savedCart),

      maxSpaces: MAX_SPACES,

      // The cart holds lesson ids, one entry per space booked.
      // Booking Maths (id 1) twice and Art (id 4) once gives [1, 1, 4].
      cart: savedCart,

      // Id of the lesson whose button should show "Added ✓" right now (null = none)
      lastAddedId: null,

      // Sorting state. sortBy holds a lesson field name; both are bound in lessons.html
      sortBy: 'topic',     // 'topic' | 'location' | 'price' | 'space'
      sortOrder: 'asc',    // 'asc' | 'desc'

      // Options for the <select> (value = lesson field, label = what the user sees)
      sortOptions: [
        { value: 'topic',    label: 'Subject' },
        { value: 'location', label: 'Location' },
        { value: 'price',    label: 'Price' },
        { value: 'space',    label: 'Spaces' }
      ],

      orderOptions: [
        { value: 'asc',  label: 'Ascending',  icon: 'fa-arrow-up-short-wide' },
        { value: 'desc', label: 'Descending', icon: 'fa-arrow-down-wide-short' }
      ]
    };
  },

  computed: {
    lessonCount() {
      return this.lessons.length;
    },

    // A sorted COPY of the lessons, used by the v-for in lessons.html.
    // Vue tracks which reactive data this function reads (lessons, sortBy, sortOrder).
    // When any of them changes — e.g. the user picks "Price" — Vue re-runs it
    // automatically and the cards re-render. Otherwise the cached result is reused.
    sortedLessons() {
      const field = this.sortBy;
      const direction = this.sortOrder === 'asc' ? 1 : -1;

      // [...this.lessons] copies the array, because .sort() changes the array it is called on
      return [...this.lessons].sort((a, b) => {
        const x = a[field];
        const y = b[field];

        // Strings (topic, location) compare alphabetically; numbers (price, space) by value
        const result = typeof x === 'string' ? x.localeCompare(y) : x - y;

        // Descending flips the sign. Ties fall back to topic A–Z so the order is predictable.
        return result * direction || a.topic.localeCompare(b.topic);
      });
    },

    // e.g. "Sorted by price, ascending · 12 lessons"
    sortSummary() {
      const label = this.sortOptions.find(o => o.value === this.sortBy).label.toLowerCase();
      const order = this.sortOrder === 'asc' ? 'ascending' : 'descending';
      return `Sorted by ${label}, ${order} · ${this.lessonCount} lessons`;
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

    // Cycle red → yellow → green for the icon tiles, based on the lesson id
    // (not the position, so a lesson keeps its colour after sorting)
    tileClass(id) {
      return [
        'bg-red-light text-red-dark dark:bg-night-raised dark:text-red',
        'bg-yellow-light text-yellow-dark dark:bg-night-raised dark:text-yellow',
        'bg-green-light text-green-deep dark:bg-night-raised dark:text-green'
      ][(id - 1) % 3];
    },

    // "No spaces left" / "1 space left" / "5 spaces left"
    spacesLabel(space) {
      if (space === 0) return 'No spaces left';
      return space + (space === 1 ? ' space' : ' spaces') + ' left';
    },

    // True while the lesson still has a space; used by :disabled on the button
    canAddToCart(lesson) {
      return lesson.space > 0;
    },

    // Book one space: add the id to the cart and take one space off the lesson.
    // `lesson` is the same reactive object that lives in this.lessons (sortedLessons
    // copies the array, not the objects), so changing lesson.space here changes the
    // real data. Vue's reactivity tracks every place the template reads lesson.space —
    // the "x spaces left" text, the 5 dots, the "Full" tag, the button label and
    // :disabled — and re-renders just those parts straight away. No manual DOM updates.
    addToCart(lesson) {
      // Guard: the button is disabled at 0, but never trust the UI alone
      if (!this.canAddToCart(lesson)) return;

      this.cart.push(lesson.id);
      lesson.space--;
      Cart.save(this.cart);   // so the details page and a refresh see the same cart

      // Show "Added ✓" on this button, then clear it after ~1 second.
      // clearTimeout first, so fast repeat clicks restart the timer instead of
      // an older timer clearing the label too early.
      this.lastAddedId = lesson.id;
      clearTimeout(addedTimer);
      addedTimer = setTimeout(() => { this.lastAddedId = null; }, ADDED_FEEDBACK_MS);
    }
  },

  mounted() {
    // If the user hasn't chosen a theme, follow the OS when it changes
    Theme.watchSystem(dark => { this.isDark = dark; });
  }
}).mount('#app');
