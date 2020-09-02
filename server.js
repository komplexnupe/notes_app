const express = require("express");
const path = require("path");
const fs = require("fs");
// var index = require("public/assets/index.js")

// Sets up the Express App
// =============================================================
const app = express();
const PORT = 2020;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Read the db.json file and return all saved notes as JSON
app.get("/api/notes", function (req, res) {
  fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;
    let savedNote = JSON.parse(data);
    return res.json(savedNote);
  });
});

// Receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
  let newNote = req.body;

  console.log(newNote);
  // fs.writeFileSync('db/db.json', JSON.stringify(newNote));

  fs.appendFile('db/db.json', JSON.stringify(newNote) + "\n", function(err){
    if (err) {
        return console.log(err);
      }
    
      console.log("Success!");
    
    });
  res.json(newNote);
});


app.delete("/api/notes/:id", function (req, res) {
  var chosen = req.params.id;

  console.log(chosen);



});
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on: http://localhost:" + PORT);
});
