console.log("run");
const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
const allToDos = [
  { text: "first", done: false, archived: false, id: uuid() },
  { text: "second", done: true, archived: false, id: uuid() },
  { text: "dont know", done: false, archived: false, id: uuid() },
  { text: "ok", done: false, archived: true, id: uuid() },
  { text: "all Right", done: false, archived: false, id: uuid() },
  { text: "stay True", done: false, archived: false, id: uuid() },
];

const app = document.getElementById("todos");
app.addEventListener("click", (el) => {
  if (el.target.className === "close") {
    archiveToDo(el.target.parentElement.id);
    return;
  }
  if (el.target.className === "delete_forever") {
    removePermanently(el.target.parentElement.parentElement.id);
    return;
  }
  if (el.target.className === "back_to_active") {
    backToActive(el.target.parentElement.parentElement.id);
    return;
  }
  toggleToDo(el.target.id);
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
            ${el.text}
            <img src="./icons/clear-white-18dp.svg" class="close">
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
                ${el.text}
                <div>
                <img src="./icons/delete_forever-white-18dp.svg" class="delete_forever"><img src="./icons/settings_backup_restore-white-18dp.svg" class="back_to_active">
                </div>
                </li>
                `;
        app.innerHTML += res;
      }
    });
  }
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
