; (function () {
  const uuid = () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  const loadState = () => JSON.parse(localStorage.getItem("todos"));
  const loadTheme = () => JSON.parse(localStorage.getItem("theme"));
  const allToDos = loadState() || [];
  let currentTheme = loadTheme() || "light";
  const saveState = () => localStorage.setItem("todos", JSON.stringify(allToDos));
  const saveTheme = () => localStorage.setItem("theme", JSON.stringify(currentTheme));


  const darkTheme = {
    "--bg-main": "rgb(21, 35, 44)",
    "--fg-main": "rgb(228, 195, 135)",
    "--fg-secondary": "silver",
    "--neom-shadow": "7px 7px 14px #121d25, -7px -7px 14px #182933",
    "--neom-inset-shadow":
      "inset 5px 5px 11px #121d25, inset -5px -5px 11px #182933",
    "--done-icon": " url(./icons/done-white-18dp.svg)",
  };
  const lightTheme = {
    "--bg-main": "#bed3e2",
    "--fg-main": "#2f4c5e",
    "--fg-secondary": "#676c71",
    "--neom-shadow": "7px 7px 14px #a2b3c0, -7px -7px 14px #dbf3ff",
    "--neom-inset-shadow":
      "inset 5px 5px 11px #a2b3c0, inset -5px -5px 11px #dbf3ff",
    "--done-icon": " url(./icons/done-dark-18dp.svg)",
  };

  const useTheme = (theme) => {
    const root = document.documentElement;
    for (let key in theme) {
      root.style.setProperty(key, theme[key]);
    }
  };

  const toggleTheme = () => {
    if (currentTheme === "light") {
      currentTheme = "dark";
      useTheme(darkTheme);
      saveTheme();
    } else {
      currentTheme = "light";
      useTheme(lightTheme);
      saveTheme();
    }
  }

  //unsafe -nesting level can be very big, but not here.
  const findParentId = (el) => {
    if (!el) return null;
    if (el.id) return el.id;
    return findParentId(el.parentElement);
  }

  const app = document.getElementById("todos");
  app.addEventListener("click", (ev) => {
    const el = ev.target;
    switch (el.dataset.role) {
      case "close":
        archiveToDo(findParentId(el));
        break;
      case "delete_forever":
        removePermanently(findParentId(el));
        break;
      case "back_to_active":
        backToActive(findParentId(el));
        break;
      case "toggle_todo":
        toggleToDo(findParentId(el));
        break;
      default:
        break;
    }
    return;
  });

  const inp = document.getElementById("input");
  inp.addEventListener("submit", (e) => {
    e.preventDefault();
    addToDo(e.target.firstElementChild.value);
    e.target.firstElementChild.value = "";
  });

  const archivedShowBtn = document.getElementById("toggleArchive");
  archivedShowBtn.firstElementChild.checked = false;
  archivedShowBtn.addEventListener("change", () => {
    toggleToDoView();
  });

  const toggleThemeBtn = document.getElementById("theme_icon");
  toggleThemeBtn.addEventListener("click", () => { toggleTheme() });

  let isArchivedVisible = false;
  const render = (showArchived = false) => {
    // render allTodos in app
    app.innerHTML = "";
    allToDos.map((el) => {
      if (!el.archived) {
        const res = `
            <li 
              class="todo_item  ${el.done ? "done" : "not_done"}"
              id="${el.id}"
            >
            <span data-role="toggle_todo" class="todo_item__text">${el.text}</span>
            <svg data-role="close" class="svg_icon svg_icon__close" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            	<use data-role="close" xlink:href="#img-clear-white-18dp"></use>
            </svg>
            </li>
            `;
        app.innerHTML += res;
      }
    });
    if (showArchived) {
      allToDos.map((el) => {
        if (el.archived) {
          const res = `
                <li 
                  class="todo_item archived ${el.done ? "done" : "not_done"}"
                  id="${el.id}"
                >
                <span class="todo_item__text">${el.text}</span>
                <div class="todo_item__icon_container">
                <svg class="svg_icon" data-role="delete_forever" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            	<use data-role="delete_forever" xlink:href="#img-delete-forever-white-18dp"></use>
            </svg><svg class="svg_icon svg_icon__back" data-role="back_to_active" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            <use data-role="back_to_active" xlink:href="#img-settings-backup-restore-white-18dp"></use>
          </svg>
                </div>
                </li>
                `;
          app.innerHTML += res;
        }
      });
    }
    saveState();
  };

  const addToDo = (todo) => {
    // add todo to all todos, then render
    if (!(todo.length === 0 || !todo.trim()))
      allToDos.push({ text: todo, done: false, archived: false, id: uuid() });
    render(isArchivedVisible);
  };

  const toggleToDo = (todoID) => {
    if (!todoID) return;
    allToDos.map((el) => {
      if (el.id === todoID && !el.archived) {
        el.done ? (el.done = false) : (el.done = true);
      }
    });
    render(isArchivedVisible);
  };

  const archiveToDo = (todoID) => {
    // makeToDo archived
    if (!todoID) return;
    allToDos.map((el) => {
      if (el.id === todoID) {
        el.archived = true;
      }
    });
    render(isArchivedVisible);
  };

  const toggleToDoView = () => {
    isArchivedVisible = !isArchivedVisible;
    render(isArchivedVisible);
  };

  const backToActive = (todoID) => {
    // should move item to active
    if (!todoID) return;
    allToDos.map((el) => {
      if (el.id === todoID) {
        el.archived = false;
      }
    });
    render(isArchivedVisible);
  };

  const removePermanently = (todoID) => {
    // ----------
    if (!todoID) return;
    allToDos.map((el, i) => {
      if (el.id === todoID) {
        allToDos.splice(i, 1);
      }
    });
    render(isArchivedVisible);
  };


  currentTheme === "light" ? useTheme(lightTheme) : useTheme(darkTheme);
  render();

  /* service worker part */
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(function (registration) {
        console.log("Registration successful, scope is:", registration.scope);
      })
      .catch(function (error) {
        console.log("Service worker registration failed, error:", error);
      });
  }
})();