# 🎓 College Life OS

A lightweight, single-page dashboard for managing college life — attendance, assignments, timetable, events, and notices — all in one place. Built with plain HTML, CSS, and JavaScript, with no frameworks or backend required.

## ✨ Features

- **📊 Attendance Tracker** — Add subjects and mark yourself Present/Absent per class. Attendance percentage is calculated automatically and color-coded against the standard 75% eligibility requirement.
- **📅 Timetable** — A Monday–Friday weekly schedule grid. Any subject (including labs) typed into the timetable is automatically synced to the Attendance tracker — no need to add subjects twice.
- **📝 Assignments** — Add assignments with a due date and tag them to a subject pulled live from your attendance/timetable subject list.
- **🎉 Events** — Add and remove college events and activities with a title and short description.
- **📢 Notices** — A simple space for important announcements.
- **🏠 Dashboard** — At-a-glance overview: overall attendance (hero stat + progress bar), a per-subject attendance ledger, assignment/event counts, and a live timeline of today's classes based on the current day of the week.
- **💾 Persistent storage** — All data (subjects, assignments, events, timetable) is saved to the browser's `localStorage`, so it survives page refreshes without needing a server or database.

## 🛠️ Tech Stack

- **HTML5** — page structure
- **CSS3** — custom styling (Google Fonts: Fraunces + Work Sans), no CSS framework
- **Vanilla JavaScript** — all interactivity and logic, no libraries or build step

This is a **frontend-only** project. There is no backend or database — data is stored locally in each browser via `localStorage`, so it does not sync across devices.

## 📁 File Structure

```
college-life-os/
├── index.html      # Page structure and layout
├── style.css       # All styling
├── script.js       # App logic (navigation, data, rendering)
└── README.md       # This file
```

## 🚀 Running Locally

No installation or build step needed.

**Option 1 — Just open it:**
Double-click `index.html` and it will open in your default browser.

**Option 2 — VS Code + Live Server (recommended for development):**
1. Open the project folder in VS Code
2. Install the "Live Server" extension
3. Click "Go Live" in the bottom-right status bar
4. The site opens at `http://127.0.0.1:5500` and auto-refreshes on save

## 🌐 Deploying

Since this is a static site (no backend), it can be deployed for free on any static hosting service:

- **GitHub Pages** — push this repo to GitHub, then enable Pages in the repo settings
- **Vercel** — import the GitHub repo at [vercel.com](https://vercel.com) and deploy in a few clicks
- **Netlify** — drag and drop the project folder at [netlify.com](https://netlify.com)

## 📌 Notes & Limitations

- Data is stored per-browser via `localStorage` — it will not sync between your phone and laptop, or between different browsers on the same device.
- The "Import Timetable" photo upload is a placeholder; automatic timetable reading from an image is not yet implemented.

## 🔮 Possible Future Improvements

- Backend + database (e.g. Node.js + MongoDB, or Firebase) for cross-device sync and login
- OCR-based timetable import from an uploaded photo
- Push/email reminders for upcoming assignment deadlines
- Export attendance/assignment data as PDF or CSV

## 📄 License

Personal project — free to use, modify, and adapt.
