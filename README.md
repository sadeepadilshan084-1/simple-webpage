# Todo & Reminders (Simple Web App)

A minimal, modern-looking single-page web app for managing todos and time-based reminders. It stores data in `localStorage` and uses the browser Notification API for reminders.

Files
- index.html
- styles.css
- app.js

How to run
1. Open `index.html` in a modern browser (Chrome/Edge/Firefox).
2. Allow notifications when prompted if you want reminder popups.
3. Add tasks with an optional due date/time — when the due time passes you'll receive a notification.

Notes
- The app checks for due reminders every 15 seconds while the page is open.
- Reminders are stored with tasks; if you close the page and reopen later missed reminders will fire immediately if their due time has passed and they weren't notified yet.

Want more?
- I can add sound alerts, edit tasks, or persist to a backend. Tell me which next.
