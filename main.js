console.log("run");
const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
const loadState = () => {
  // load current state from storage
  return JSON.parse(localStorage.getItem("todos"));
};
const allToDos = loadState() || [];
const saveState = () => {
  // save current state to storage
  localStorage.setItem("todos", JSON.stringify(allToDos));
};

const app = document.getElementById("todos");
app.addEventListener("click", (el) => {
  if (el.target.dataset.role === "close") {
    archiveToDo(el.target.parentElement.id);
    return;
  }
  if (el.target.dataset.role === "delete_forever") {
    removePermanently(el.target.parentElement.parentElement.id);
    return;
  }
  if (el.target.dataset.role === "back_to_active") {
    backToActive(el.target.parentElement.parentElement.id);
    return;
  }
  console.log(el.target.className)
  if(el.target.className==="todo_item__text"){
  toggleToDo(el.target.parentElement.id);}
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
            <span class="todo_item__text">${el.text}</span>
            <svg class="svg_icon svg_icon__close" data-role="close" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            	<use xlink:href="#img-clear-white-18dp"></use>
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
            	<use xlink:href="#img-delete-forever-white-18dp"></use>
            </svg><svg class="svg_icon svg_icon__back" data-role="back_to_active" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMinYMin">
            <use xlink:href="#img-settings-backup-restore-white-18dp"></use>
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
  allToDos.map((el) => {
    if (el.id == todoID && !el.archived) {
      el.done ? (el.done = false) : (el.done = true);
    }
  });
  render(isArchivedVisible);
};

const archiveToDo = (todoID) => {
  // makeToDo archived
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
  allToDos.map((el) => {
    if (el.id === todoID) {
      el.archived = false;
    }
  });
  render(isArchivedVisible);
};

const removePermanently = (todoID) => {
  // ----------
  allToDos.map((el, i) => {
    if (el.id === todoID) {
      allToDos.splice(i, 1);
    }
  });
  render(isArchivedVisible);
};

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
