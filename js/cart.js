// Cart helper — plain JavaScript, no Vue.
// Every page has its own Vue app, so the cart is saved in localStorage to share it
// between lessons.html and lesson.html (and keep it after a refresh).
// The cart is an array of lesson ids, one per space booked: Maths twice = [1, 1].
// This is temporary: later the spaces will be saved in MongoDB when an order is placed.
(function () {
  var KEY = 'classbar-cart';

  // Read the saved cart. localStorage can throw or hold junk, so guard both.
  function load() {
    try {
      var ids = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(ids) ? ids.filter(Number.isInteger) : [];
    } catch (e) {
      return [];
    }
  }

  function save(ids) {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) { /* ignore */ }
  }

  // How many spaces of one lesson are in the cart
  function countOf(ids, lessonId) {
    return ids.filter(function (id) { return id === lessonId; }).length;
  }

  // Copy the lessons and take off the spaces already in the cart (never below 0)
  function applyToLessons(lessons, ids) {
    return lessons.map(function (lesson) {
      var copy = Object.assign({}, lesson);
      copy.space = Math.max(0, lesson.space - countOf(ids, lesson.id));
      return copy;
    });
  }

  window.Cart = { load: load, save: save, countOf: countOf, applyToLessons: applyToLessons };
})();
