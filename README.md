# Classbar — After-School Lessons (Front-end)

A Vue 3 web app where parents and students browse, search, sort and book after-school lessons. Built for CST3144 Full Stack Development.

## Links

| What | Link |
|---|---|
| Live site (GitHub Pages) | `https://beke83.github.io/after-school-frontend/` *(placeholder — confirm once Pages is enabled)* |
| Front-end repository | https://github.com/beke83/after-school-frontend |
| Back-end repository | `https://github.com/beke83/<back-end-repo>` *(placeholder)* |
| Back-end API (Render) | `https://<your-app>.onrender.com` *(placeholder)* |

## Features

- **Lessons page** with 12 lessons shown as cards: subject, location, price, spaces left (5-dot indicator).
- **Search as you type** across subject, location, price and spaces.
- **Sorting** by subject, location, price or spaces, ascending or descending.
- **Add to cart.** Every lesson has 5 spaces. The button turns into "Fully booked" at 0 and a red "Full" tag appears.
- **Cart view** on the same page: one row per lesson with quantity and line total, "Remove" one space at a time, and a cart total.
- **Checkout** with name and phone fields, validated with regular expressions (letters only / digits only). The Checkout button stays disabled until both are valid. A confirmation summary is shown after ordering.
- **Lesson details page** (`lesson.html?id=…`) with the syllabus, schedule, tutor, what to bring and related lessons. Lessons can be added to the cart there too.
- **About page** with the booking steps and an FAQ accordion.
- **Light and dark mode**: follows the device setting, can be switched in the navbar, and is remembered. There's no flash of the wrong theme on load.
- **Responsive**: phone menu, layouts for phone, tablet and desktop.
- The cart and booked spaces are kept in `localStorage` between pages for now, until the back-end is connected.

> **Data:** the lessons are currently dummy data in `js/lessons-data.js`, using the same fields as the back-end (`id, topic, location, price, space, icon`). They will be replaced by `fetch()` calls to the Express API: `GET /lessons`, `GET /search?q=`, `POST /orders`, `PUT /lessons/:id`.

## Tech stack

| Technology | Used for |
|---|---|
| **Vue 3** (CDN, Options API) | All page logic: `data`, `computed`, `methods`, `watch`, lifecycle hooks, `v-for`, `v-if`, `v-show`, `v-model`, `v-on`, `v-bind` |
| **Tailwind CSS** (Play CDN) | Styling, with a custom colour palette and `darkMode: 'class'` |
| **Font Awesome 6** (cdnjs) | Icons |
| **Google Fonts**: Inter, JetBrains Mono | Text and the small code-style labels |
| **localStorage** | Remembering the theme, cart and booked spaces |
| **GitHub Pages** | Hosting |

There are **no build tools** (no npm, Vite, webpack or `.vue` files), **no Vue Router** and **no other JavaScript libraries** (no axios or jQuery). Every page is a plain `.html` file and all paths are relative, so the site works on GitHub Pages.

**Planned back-end** (separate repository): Node.js + **Express.js**, **MongoDB Atlas** with the native driver (no Mongoose), hosted on **Render**, tested with **Postman**.

## Folder structure

```
frontend/
├── index.html          Home page: hero, how it works, popular subjects, stats, call to action
├── lessons.html        Lessons: search, sort, lesson cards, cart view and checkout
├── lesson.html         Details for one lesson (opened as lesson.html?id=5)
├── about.html          About Classbar: booking steps and FAQ
├── css/
│   └── styles.css      Colour variables, shared components, dark-mode styles
├── js/
│   ├── theme.js        Applies light/dark before the page draws; saves the choice
│   ├── cart.js         Saves the cart and booked spaces in localStorage
│   ├── lessons-data.js Dummy lessons + lesson details (to be replaced by the API)
│   ├── home.js         Vue app for index.html
│   ├── lessons.js      Vue app for lessons.html
│   ├── lesson.js       Vue app for lesson.html
│   └── about.js        Vue app for about.html
├── images/
│   └── favicon.svg     Three-bar logo icon
└── README.md
```

## Run it locally

No install or build step is needed.

**Option 1: open the file.** Double-click `index.html`. It opens in your browser and everything works, because all paths are relative.

**Option 2: use a small local server** (closer to how GitHub Pages serves it). From the `frontend` folder, run either:

```bash
python -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000.

To reset the demo (cart and booked spaces), open DevTools → Application → Local Storage and delete `classbar-cart` and `classbar-booked`.

## AI use declaration

AI tools were used to help with parts of this project. The full declaration (what was used, what for, and how the output was checked) is in [AI-DECLARATION.md](AI-DECLARATION.md).
