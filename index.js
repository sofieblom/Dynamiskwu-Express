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

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
