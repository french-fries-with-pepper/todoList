console.log("run");
const allToDos = [
    {text:"first",done:false,archived:false,id:1},
    {text:"second",done:true,archived:false,id:2},
    {text:"dont know",done:false,archived:false,id:3},
    {text:"ok",done:false,archived:true,id:4},
    {text:"all Right",done:false,archived:false,id:5},
    {text:"stay True",done:false,archived:false,id:16},
];

const app = document.getElementById("todos");
app.addEventListener("click",(el)=>{
    toggleToDo(el.target.id)
})

const render = () => {
    // render allTodos in app
    app.innerHTML="";
    allToDos.map(el =>{
        if(!el.archived){
            const res = `
            <li 
              class="todo_item ${el.done?"done":"not_done"}"
              id="${el.id}"
            >
            ${el.text}
            </li>
            `
            app.innerHTML+=res;
        }
    })
}

const addToDo = (todo) =>{
    // add todo to all todos, then render
}

const toggleToDo = (todoID) => {
    allToDos.map(el=>{
        if(el.id==todoID){
            el.done?el.done=false:el.done=true
        }
    })
    render()
}

const archiveToDo = (todoID) => {
    // makeToDo archived
}

render();