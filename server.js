const express = require("express");
const path = require("path");
const fs = require("fs");
const db = require("./db/db.json")
// var index = require("public/assets/index.js")

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 2020;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML Routes
// =============================================================
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.json(db)
});

// API Routes
// =============================================================
app.post("/api/notes", function (req, res) {
  let newNote = req.body;

  if (db.length === 0) {
    newNote.id = 1;
  } else {
    newNote.id = db[db.length - 1].id + 1
  }

  db.push(newNote)
  console.log(newNote);

  fs.writeFile('db/db.json', JSON.stringify(db), function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("Success!");

    res.json(newNote);
  });
});


app.delete("/api/notes/:id", function (req, res) {
  const chosen = req.params.id;
  const notes = req.body;
  console.log(chosen);

  // Deleting Note by ID
  for (let i = 0; i < db.length; i++) {
    if (chosen == db[i].id) {
      db.splice(i, 1);
    }
  }
  console.log(db);

  fs.writeFile('db/db.json', JSON.stringify(db), function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("Success!");
    res.sendStatus(200);
  });


});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on: http://localhost:" + PORT);
});
