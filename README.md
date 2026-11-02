# CSE343 Lab 4 - Todo App

Open `index.html` in a browser. The compiled `app.js` is included, so no installation is needed to use the app.

## Features

- Add a task with the Add button or Enter; whitespace-only tasks are ignored.
- Check a task to complete it and uncheck it to make it active again.
- Double-click task text to edit. Enter saves, Escape cancels, and clicking away saves. Keyboard users can focus task text and press Enter or F2.
- Filter All, Active, or Completed tasks.
- Delete individual tasks, clear completed tasks, or clear all tasks.
- The footer counts unfinished tasks across all filters.
- Tasks are saved in this browser using localStorage when available.

The two tasks shown in the lab screenshot appear on first use. Clearing all tasks keeps the list empty on later visits.

## TypeScript

`app.ts` is the typed source; `app.js` is the browser-ready compiler output. After changing the TypeScript source, run:

```sh
npm install
npm run build
```

The project uses an interface, a class, arrow callbacks, array methods, template literals, and spread syntax from the lab material. Styling and scripts are kept in separate files. No frameworks or external runtime dependencies are required.
