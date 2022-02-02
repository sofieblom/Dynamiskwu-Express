const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const todoTasks = require("./data/todoTasks");

const port = 3000;
const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.use(express.static("public"));

app.use(express.json());

// log requests
app.use(morgan("common"));

app.use(express.urlencoded({ extended: true }));

// get max id so when you add a new todo it will get the right id
function getMaxId() {
  let maxId = 0;
  for (const item of todoTasks) {
    if (item.id > maxId) {
      maxId = item.id;
    }
  }
  return maxId + 1;
}

// Sort todo-list by newest
function sortTodoNewest() {
  todoTasks.sort(
    (firstItem, secondItem) => secondItem.created - firstItem.created
  );
}

// Sort todo-list by oldest
function sortTodoOldest() {
  todoTasks.sort(
    (firstItem, secondItem) => firstItem.created - secondItem.created
  );
}

// set 'home' to the firstpage, and add your todo list.
app.get("/", (req, res) => {
  res.render("home", { todoTasks });
});

// toggle true/false on your "done" property
app.get("/task/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const task = todoTasks.find((t) => t.id === id);

  task.done = task.done ? false : true;

  res.redirect("/");
});

// add new task to your todo
app.post("/", (req, res) => {
  const id = getMaxId(todoTasks);

  const newTask = {
    id: id,
    description: req.body.description,
    created: new Date(),
    done: false,
  };

  todoTasks.push(newTask);
  res.redirect("/");
});

// get the sort by newest
app.get("/task/sort-newest", (req, res) => {
  sortTodoNewest();
  res.redirect("/");
});

// get the sort by oldest
app.get("/task/sort-oldest", (req, res) => {
  sortTodoOldest();
  res.redirect("/");
});

// show all tasks
app.get("/task/all", (req, res) => {
  res.redirect("/");
});

// show done tasks
app.get("/task/done", (req, res) => {
  doneTasks = todoTasks.filter((todo) => todo.done === true);
  res.render("tasks-done", { doneTasks });
});

// show undone tasks
app.get("/task/not-done", (req, res) => {
  undoneTasks = todoTasks.filter((todo) => todo.done === false);
  res.render("tasks-undone", { undoneTasks });
});

// get the single task
app.get("/task/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = todoTasks.find((t) => t.id === id);

  res.render("tasks-single", task);
});

// edit your task
app.get("/task/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const task = todoTasks.find((t) => t.id === id);

  res.render("tasks-edit", task);
});

// post your task-edit
app.post("/task/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todoTasks.findIndex((i) => i.id === id);

  let editTask = {
    id: id,
    created: new Date(),
    description: req.body.description,
    done: false,
  };

  todoTasks.splice(index, 1, editTask);
  res.redirect("/");
});

// get delete task - page
app.get("/task/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const task = todoTasks.find((t) => t.id === id);

  res.render("tasks-delete", task);
});

// confirm delete, post form and redirect to firstpage
app.post("/task/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todoTasks.findIndex((i) => i.id === id);

  todoTasks.splice(index, 1);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
