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

// DUMMY DATA — will be replaced by fetch() to the Express API (GET /lessons) later.
// Extra information for the lesson details page (lesson.html?id=...), keyed by lesson id.
// These fields are NOT in the `lessons` collection yet; later they could come from
// GET /lessons/:id or a separate `lessonDetails` collection.
const dummyLessonDetails = {
  1:  { summary: 'Build confidence with numbers through games, puzzles and plenty of practice.',
        ages: '7–11', day: 'Monday', time: '4:00–5:00pm', weeks: 10, tutor: 'Ms Patel',
        syllabus: ['Times tables and mental maths', 'Fractions, decimals and percentages', 'Shapes, angles and measuring', 'Word problems step by step', 'Mini SATs-style quizzes'],
        bring: ['Pencil and ruler', 'A calculator (optional)'] },
  2:  { summary: 'Reading, writing and spelling sessions that make stories fun to tell.',
        ages: '6–11', day: 'Tuesday', time: '4:00–5:00pm', weeks: 10, tutor: 'Mr Okafor',
        syllabus: ['Reading for meaning', 'Spelling patterns and phonics', 'Grammar and punctuation', 'Creative story writing', 'Speaking with confidence'],
        bring: ['A reading book', 'Notebook and pen'] },
  3:  { summary: 'Learn to read music and play your first songs on keyboard, guitar or voice.',
        ages: '7–14', day: 'Wednesday', time: '4:30–5:30pm', weeks: 12, tutor: 'Mrs Duarte',
        syllabus: ['Rhythm and beat', 'Reading simple notation', 'Keyboard basics', 'Singing in tune', 'End-of-term mini concert'],
        bring: ['Water bottle', 'Own instrument (optional)'] },
  4:  { summary: 'Drawing, painting and making — explore materials and find your style.',
        ages: '5–11', day: 'Thursday', time: '3:45–4:45pm', weeks: 8, tutor: 'Ms Laurent',
        syllabus: ['Sketching shapes and shading', 'Colour mixing with paint', 'Collage and mixed media', 'Clay modelling', 'Build a mini portfolio'],
        bring: ['An old T-shirt or apron'] },
  5:  { summary: 'From Scratch to Python — build games, animations and simple websites.',
        ages: '8–14', day: 'Monday', time: '4:30–6:00pm', weeks: 10, tutor: 'Mr Chen',
        syllabus: ['Thinking like a programmer', 'Loops, conditions and variables', 'Make a game in Scratch', 'First steps in Python', 'Build a one-page website'],
        bring: ['Laptop (we can lend one)'] },
  6:  { summary: 'Hands-on experiments that explain how the world around us works.',
        ages: '7–12', day: 'Friday', time: '4:00–5:00pm', weeks: 10, tutor: 'Dr Mensah',
        syllabus: ['Being a scientist: fair tests', 'Forces and magnets', 'Plants and the human body', 'Materials and changing states', 'Light, sound and electricity'],
        bring: ['Notebook', 'Clothes that can get messy'] },
  7:  { summary: 'Learn the rules, then the tactics — and think three moves ahead.',
        ages: '6–14', day: 'Wednesday', time: '4:00–5:00pm', weeks: 8, tutor: 'Mr Novak',
        syllabus: ['How each piece moves', 'Opening principles', 'Tactics: forks and pins', 'Simple checkmates', 'Friendly club tournament'],
        bring: ['Nothing — boards provided'] },
  8:  { summary: 'Skills, drills and small-sided matches with qualified coaches.',
        ages: '6–12', day: 'Tuesday', time: '4:30–5:30pm', weeks: 10, tutor: 'Coach Ade',
        syllabus: ['Warm-ups and fitness', 'Passing and first touch', 'Dribbling and shooting', 'Positions and teamwork', 'Weekly mini matches'],
        bring: ['Trainers or boots', 'Shin pads', 'Water bottle'] },
  9:  { summary: 'Games, improvisation and scripts that build confidence on and off stage.',
        ages: '7–14', day: 'Thursday', time: '4:30–5:45pm', weeks: 10, tutor: 'Ms Reid',
        syllabus: ['Drama games and warm-ups', 'Voice and movement', 'Improvisation', 'Working with a script', 'Showcase for families'],
        bring: ['Comfortable clothes'] },
  10: { summary: 'Small-group lessons for beginners and improvers in a heated pool.',
        ages: '5–11', day: 'Saturday', time: '9:00–9:45am', weeks: 10, tutor: 'Coach Silva',
        syllabus: ['Water confidence and floating', 'Kicking and breathing', 'Front crawl', 'Backstroke', '25m swim badge'],
        bring: ['Swimsuit and towel', 'Goggles', 'Swim hat'] },
  11: { summary: 'Speak, sing and play your way into French with a native speaker.',
        ages: '6–11', day: 'Friday', time: '4:00–5:00pm', weeks: 10, tutor: 'Mme Bernard',
        syllabus: ['Greetings and introductions', 'Numbers, colours and days', 'Food and ordering in a café', 'Family and hobbies', 'Short role-plays'],
        bring: ['Notebook and pen'] },
  12: { summary: 'Design, build and code robots that move, sense and solve challenges.',
        ages: '9–14', day: 'Saturday', time: '10:00–11:30am', weeks: 12, tutor: 'Ms Ibrahim',
        syllabus: ['What makes a robot?', 'Motors, sensors and circuits', 'Block coding for robots', 'Team design challenge', 'Robot obstacle race'],
        bring: ['Nothing — kits provided'] }
};
