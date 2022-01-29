const express = require("express");
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

app.use(express.urlencoded({ extended: true }));

// set 'home' to the firstpage, and add the todo's
app.get("/", (req, res) => {
  res.render("home", { todoTasks });
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

  let newTask = {
    id: id,
    created: new Date(),
    description: req.body.description,
    done: false,
  };

  todoTasks.splice(index, 1, newTask);
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
