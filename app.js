const express = require('express');
const app = express();
const PORT = process.env.PORT || 8001;
const bodyParser = require('body-parser');
let userTotalScore = 0;

//Print out what the current request and uri is
app.use((req, res, next) => {
  console.log(`\n--> ${req.method} request at ${req.url}`);
  next();
});

//Tells Express to use a static directory that we define as the location to look for requests. Express will look for the url that matches the GET request in the public directory
app.use(express.static('public'));

//For parsing application/x-www-form-urlencoded. 'extended = true' means the object's key-value pairs' value can be any type, not just string or array. This is a function. It replaces the code needed to parse the buffer for request body and returns the already parsed information/object as "req.body".
app.use(bodyParser.urlencoded({ extended: true }));

//GET "/buzzwords" route
let buzzWords = [];   //Array containing objects

app.get("/buzzwords", (req, res) => {
  console.log("\nbuzzWords arr:\n", buzzWords);
  //This parses incoming requests w/JSON payloads and is based on body-parser. Only parses JSON and a new body object containing the parsed data is populated on the req object after the middleware (ie. req.body) or an empty object ({}) if there was no body to parse
  res.json(buzzWords);
})

//POST "/buzzwords" route
app.post("/buzzwords", (req, res) => {
  //body-parser puts buzzword in req.body
  console.log("req.body:", req.body);

  if (req.body.buzzword !== "" && req.body.points !== "" && buzzWords.length !== 5) {
    buzzWords.push(req.body);
    console.log("\nbuzzWords Arr:\n", buzzWords);
    res.send(`{"success": true}`);
  }
  else {
    console.log("\nERROR with creating a buzzword object.")
    res.send(`{"success": false}`);
  }
});

//PUT "/buzzwords" route
app.put("/buzzwords", (req, res) => {
  //body-parser puts buzzword in req.body
  let wordFoundFlag = false;

  if (req.body.buzzword !== "" && req.body.points !== "") {
    //Iterate through the buzzword array and find the buzzword that matches the one requested and update the points
    buzzWords.forEach(element => {
      if (element.buzzword === req.body.buzzword) {
        console.log("\n**Old buzzWords:\n", buzzWords);
        element.points = req.body.points;
        console.log("\n**Updated buzzWords:\n", buzzWords);
        wordFoundFlag = true;
        return wordFoundFlag;
      }
      else {
        console.log("\nERROR: Specified buzzword not found in your list.");
        wordFoundFlag = false;
        return wordFoundFlag;
      }
    })
    res.send(`{"success": ${wordFoundFlag}}`);
  }
  else {
    console.log("\nError with entering a buzzword.")
    res.send(`{"success": false}`);
  }
});

//DELETE "/buzzwords" route
app.delete("/buzzwords", (req, res) => {
  //body-parser puts buzzword into req.body
  let deletedFlag = false;

  buzzWords.forEach(element => {
    if (element.buzzword === req.body.buzzword) {
      console.log("\nbuzzWords before DELETE:\n", buzzWords);
      buzzWords = buzzWords.filter(element => {
        return element.buzzword !== req.body.buzzword;
      });
      console.log("\nbuzzWords after DELETE:\n", buzzWords);
      deletedFlag = true;
      return deletedFlag;
    }
    else {
      console.log("\nError with deleting buzzword.");
      deletedFlag = false;
      return deletedFlag;
    }
  });
  res.send(`{"success": ${deletedFlag}}`);
});

//POST "/reset" route
app.post("/reset", (req, res) => {
  //body-parser puts body information into req.body
  console.log("here", req.body);
  if (req.body.reset === "true") {
    //Resets the server, all buzzwords are removed and total score is reset to 0
    buzzWords = [];
    userTotalScore = 0;
    console.log("\nbuzzWords after reset: ", buzzWords);
    console.log("\nUser score after reset: ", userTotalScore);
    res.send(`{"success": true}`);
  }
  else {
    console.log("\nERROR: Cannot reset.");
    res.send(`{"success": false}`);
  }
});

//POST "/heard" route
app.post("/heard", (req, res) => {
  //body-parser puts body information into req.body

  //Marks that a buzzword has been heard and should update the total score. Returns the new total score if successful otherwise returns just false
  let wordHeardFlag = false;

  buzzWords.some(element => {
    if (element.buzzword === req.body.buzzword) {
      userTotalScore += Number(element.points);
      wordHeardFlag = true;
      return userTotalScore;
    }
    else {
      wordHeardFlag = false;
      return wordHeardFlag;
    }
  })
  if (wordHeardFlag) {
    console.log(`\nHeard: "${req.body.buzzword}"\nUpdate User Total Score: ${userTotalScore}`)
    res.send(`{"totalScore": ${userTotalScore}}`)
  }
  else {
    console.log("\nERROR: Not one of your buzzwords.")
    res.send(`{"success": ${wordHeardFlag}}`)
  }
});

//GET request - catch all for other requests not specified
app.get('*', (req, res) => {
  //Error message
  console.log("\nERROR: File could not be found. Invalid request.");
  res.sendStatus(404);
});

// Server is listening
const server = app.listen(PORT, () => {
  console.log("Server address: ", server.address());
  const host = server.address().address;

  console.log(`App listening at http://${host}:${PORT}`);
});