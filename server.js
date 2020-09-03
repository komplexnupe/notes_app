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

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
// 
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Read the db.json file and return all saved notes as JSON
app.get("/api/notes", function (req, res) {
  res.json(db)
});

// Receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
  let newNote = req.body;
  newNote.id = db[db.length - 1].id + 1
db.push(newNote)
  console.log(newNote);
  // fs.writeFileSync('db/db.json', JSON.stringify(newNote));

  fs.writeFile('db/db.json', JSON.stringify(db), function(err){
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

  for(let i = 0; i < db.length; i++){
    if(chosen == db[i].id){
      console.log("hey");
      db.splice(i,1);
    }
  }
  console.log(db);

  fs.writeFile('db/db.json', JSON.stringify(db), function(err){
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
