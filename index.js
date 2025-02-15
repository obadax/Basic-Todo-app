import express from "express";
import bodyParser from "body-parser";
import  pg  from "pg";
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "example@",
  port: 5433,
});
db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    items = (await db.query("SELECT * FROM items ORDER BY id ASC")).rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.error("Error: ", error);
  }
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (error) {
    console.error("Error: ", error);
  }
});

app.post("/edit", async (req, res) => {
  const updatedItem = req.body.updatedItemTitle;
  const updatedItemId = req.body.updatedItemId;
  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [
      updatedItem,
      updatedItemId,
    ]);
    res.redirect("/");
  } catch (error) {
    console.error("Error: ", error);
  }
});

app.post("/delete", async(req, res) => {
  const deleteItemId = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [deleteItemId]);
    res.redirect("/");
  } catch (error) {
    console.error("Error: ", error);
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
