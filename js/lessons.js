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
    // Saved cart from js/cart.js (shared with the details page through localStorage).
    // Ids that don't match a lesson (e.g. old saved data) are dropped.
    const savedCart = Cart.load().filter(id => dummyLessons.some(l => l.id === id));

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

      // Which view is showing: false = lesson list, true = cart (switched with v-if / v-else).
      // lessons.html?view=cart (the link on the details page) opens straight on the cart.
      showCart: new URLSearchParams(window.location.search).get('view') === 'cart' && savedCart.length > 0,

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
    },

    // Groups the cart ids into one row per lesson for the cart view.
    // [1, 1, 4] becomes:
    //   [{ lesson: Maths, quantity: 2, lineTotal: 200 }, { lesson: Art, quantity: 1, lineTotal: 80 }]
    // Rows stay in the order each lesson was first added.
    cartItems() {
      const counts = new Map();                       // id -> how many times it appears
      for (const id of this.cart) {
        counts.set(id, (counts.get(id) || 0) + 1);
      }

      const items = [];
      for (const [id, quantity] of counts) {
        const lesson = this.lessons.find(l => l.id === id);   // look the lesson up by id
        if (lesson) {
          items.push({ lesson, quantity, lineTotal: lesson.price * quantity });
        }
      }
      return items;
    },

    // Sum of every line total (a number; formatPrice() adds the £ and pence)
    cartTotal() {
      return this.cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
    }
  },

  // watch runs a function whenever a piece of data changes.
  // deep: true is needed because push() and splice() change the array's contents,
  // not the array itself. Saving here means addToCart and removeFromCart don't each
  // have to remember to save.
  watch: {
    cart: {
      handler(ids) {
        Cart.save(ids);
      },
      deep: true
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
      lesson.space--;          // the cart watcher saves to localStorage

      // Show "Added ✓" on this button, then clear it after ~1 second.
      // clearTimeout first, so fast repeat clicks restart the timer instead of
      // an older timer clearing the label too early.
      this.lastAddedId = lesson.id;
      clearTimeout(addedTimer);
      addedTimer = setTimeout(() => { this.lastAddedId = null; }, ADDED_FEEDBACK_MS);
    },

    // Remove ONE space of a lesson: [1, 1, 4] → removeFromCart(1) → [1, 4].
    // indexOf finds the first matching id and splice(index, 1) removes just that entry.
    removeFromCart(lessonId) {
      const index = this.cart.indexOf(lessonId);
      if (index === -1) return;            // not in the cart: nothing to do

      this.cart.splice(index, 1);

      // Give the space back to the class (reactive, so its card updates too)
      const lesson = this.lessons.find(l => l.id === lessonId);
      if (lesson) lesson.space++;

      // Leave the cart view once it's empty. This check lives HERE rather than in a
      // watcher on purpose: removing the last item is the only time we want to jump
      // back. Checkout (next step) will also empty the cart, but there we want to
      // stay on the cart view to show a confirmation — a watcher would fire then too.
      if (this.cart.length === 0) {
        this.showCart = false;
      }
    },

    // Switch between the lesson list and the cart (the navbar button)
    toggleCart() {
      if (!this.showCart && this.cart.length === 0) return;   // nothing to show yet
      this.showCart = !this.showCart;
      window.scrollTo({ top: 0, behavior: 'smooth' });       // new view starts at the top
    },

    // 280 → "£280.00"
    formatPrice(amount) {
      return '£' + amount.toFixed(2);
    }
  },

  mounted() {
    // If the user hasn't chosen a theme, follow the OS when it changes
    Theme.watchSystem(dark => { this.isDark = dark; });
  }
}).mount('#app');
