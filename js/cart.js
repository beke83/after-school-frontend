// Cart helper — plain JavaScript, no Vue.
// Every page has its own Vue app, so the cart is saved in localStorage to share it
// between lessons.html and lesson.html (and keep it after a refresh).
// The cart is an array of lesson ids, one per space booked: Maths twice = [1, 1].
//
// Booked spaces (after checkout) are saved too, under a second key. This is a
// TEMPORARY stand-in for the back-end: later, checkout will POST /orders and
// PUT /lessons/:id, and the real spaces will come from MongoDB instead.
(function () {
  var CART_KEY = 'classbar-cart';
  var BOOKED_KEY = 'classbar-booked';

  // Read a saved id list. localStorage can throw or hold junk, so guard both.
  function read(key) {
    try {
      var ids = JSON.parse(localStorage.getItem(key));
      return Array.isArray(ids) ? ids.filter(Number.isInteger) : [];
    } catch (e) {
      return [];
    }
  }

  function write(key, ids) {
    try { localStorage.setItem(key, JSON.stringify(ids)); } catch (e) { /* ignore */ }
  }

  function load() { return read(CART_KEY); }
  function save(ids) { write(CART_KEY, ids); }

  // Remember spaces that were checked out, so they stay taken after a refresh
  function addBooked(ids) { write(BOOKED_KEY, read(BOOKED_KEY).concat(ids)); }

  // How many spaces of one lesson are in a list of ids
  function countOf(ids, lessonId) {
    return ids.filter(function (id) { return id === lessonId; }).length;
  }

  // Copy the lessons and take off the spaces that are in the cart OR already booked
  // (never below 0)
  function applyToLessons(lessons, ids) {
    var taken = ids.concat(read(BOOKED_KEY));
    return lessons.map(function (lesson) {
      var copy = Object.assign({}, lesson);
      copy.space = Math.max(0, lesson.space - countOf(taken, lesson.id));
      return copy;
    });
  }

  window.Cart = { load: load, save: save, addBooked: addBooked, countOf: countOf, applyToLessons: applyToLessons };
})();
