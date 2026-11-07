// DUMMY DATA — will be replaced by fetch() to the Express API (GET /lessons) later.
// Field names match the MongoDB `lessons` documents: { id, topic, location, price, space, icon }.
// Loaded before js/lessons.js, which copies this array into data().
const dummyLessons = [
  { id: 1,  topic: 'Maths',    location: 'Hendon',        price: 100, space: 5, icon: 'fa-solid fa-calculator' },
  { id: 2,  topic: 'English',  location: 'Colindale',     price: 90,  space: 5, icon: 'fa-solid fa-book-open' },
  { id: 3,  topic: 'Music',    location: 'Brent Cross',   price: 120, space: 5, icon: 'fa-solid fa-music' },
  { id: 4,  topic: 'Art',      location: 'Golders Green', price: 80,  space: 5, icon: 'fa-solid fa-palette' },
  { id: 5,  topic: 'Coding',   location: 'Mill Hill',     price: 110, space: 5, icon: 'fa-solid fa-code' },
  { id: 6,  topic: 'Science',  location: 'Edgware',       price: 95,  space: 5, icon: 'fa-solid fa-flask' },
  { id: 7,  topic: 'Chess',    location: 'Hendon',        price: 60,  space: 5, icon: 'fa-solid fa-chess-knight' },
  { id: 8,  topic: 'Football', location: 'Colindale',     price: 70,  space: 5, icon: 'fa-solid fa-futbol' },
  { id: 9,  topic: 'Drama',    location: 'Brent Cross',   price: 85,  space: 5, icon: 'fa-solid fa-masks-theater' },
  { id: 10, topic: 'Swimming', location: 'Golders Green', price: 115, space: 5, icon: 'fa-solid fa-person-swimming' },
  { id: 11, topic: 'French',   location: 'Mill Hill',     price: 90,  space: 5, icon: 'fa-solid fa-language' },
  { id: 12, topic: 'Robotics', location: 'Edgware',       price: 125, space: 5, icon: 'fa-solid fa-robot' }
];
