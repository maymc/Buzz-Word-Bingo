const express = require('express');
const app = express();
const PORT = process.env.PORT || 8001;
const qs = require("querystring");
const bodyParser = require('body-parser');
let userTotalScore = 0;

app.use((req, res, next) => {
  console.log(`\n--> ${req.method} request at ${req.url}`);
  next();
});

//Tell Express to use a static directory that we define as the location to look for requests
app.use(express.static('public'));

//For parsing application/x-www-form-urlencoded. 'extended = true' means the object's key-value pairs' value can be any type, not just string or array. This is a function. It replaces the code needed to parse the buffer for request bodies and returns the already parsed information/object as "req.body".
app.use(bodyParser.urlencoded({ extended: true }));

//GET "/buzzword" request
let buzzWords = [];   //Array containing objects

app.get("/buzzwords", (req, res) => {
  console.log("\nGetting buzzwords...");
  //This parses incoming requests w/JSON payloads and is based on body-parser. Only parses JSON and a new body object containing the parsed data is populated on the req object after the middleware (ie. req.body) or an empty object ({}) if there was no body to parse
  res.json(buzzWords);
})

//POST "/buzzwords" route
app.post("/buzzwords", (req, res) => {
  console.log("req.body:", req.body);

  if (req.body.buzzword !== "" && req.body.points !== "" && req.body.heard !== "" && buzzWords.length !== 5) {
    buzzWords.push(req.body);
    console.log("\nbuzzWords Arr:\n", buzzWords);
    res.send(`{"success": true}`);
  }
  else {
    console.log("\nError with entering a buzzword.")
    res.send(`{"success": false}`);
  }
});

//PUT "/buzzwords" route
app.put("/buzzwords", (req, res) => {
  let bodyPUT = [];
  let wordFoundFlag = false;

  req.on("data", chunk => {
    bodyPUT.push(chunk);

  }).on("end", () => {
    //Converts buffer to a string
    bodyPUT = Buffer.concat(bodyPUT).toString();
    let parsedBuzzWordsPUT = qs.parse(bodyPUT);

    if (`${parsedBuzzWordsPUT.buzzword}` !== "" && `${parsedBuzzWordsPUT.points}` !== "" && `${parsedBuzzWordsPUT.heard}` !== "") {
      //Iterate through the buzzword array and find the buzzword that matches the one requested and update the points
      buzzWords.forEach(element => {
        if (element.buzzword === parsedBuzzWordsPUT.buzzword) {
          console.log("\n**Old buzzWords:\n", buzzWords);
          element.points = parsedBuzzWordsPUT.points;
          console.log("\n**Updated buzzWords:\n", buzzWords);
          wordFoundFlag = true;
          return wordFoundFlag;
        }
        else {
          console.log("\nERROR: Word not found.");
          wordFoundFlag = false;
          return wordFoundFlag;
        }
      })
      res.send(`{success: ${wordFoundFlag}}`);
    }
    else {
      console.log("\nError with entering a buzzword.")
      res.send(`{"success": false}`);
    }

  });
});

//DELETE "/buzzwords" route
app.delete("/buzzwords", (req, res) => {

  let bodyDELETE = [];
  let deletedFlag = false;

  req.on("data", chunk => {
    bodyDELETE.push(chunk);
  }).on("end", () => {
    //Converts buffer to a string
    bodyDELETE = Buffer.concat(bodyDELETE).toString();
    let parsedBuzzWordsDELETE = qs.parse(bodyDELETE);

    buzzWords.forEach(element => {
      if (element.buzzword === parsedBuzzWordsDELETE.buzzword) {
        console.log("\nbuzzWords before DELETE:\n", buzzWords);
        buzzWords = buzzWords.filter(element => {
          return element.buzzword !== parsedBuzzWordsDELETE.buzzword;
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
    res.send(`{success: ${deletedFlag}}`);
  });
});

//POST "/reset" route
app.post("/reset", (req, res) => {
  //Resets the server, all buzzwords are removed and total score is reset to 0
  buzzWords = [];
  userTotalScore = 0;
  console.log("\nbuzzWords after reset: ", buzzWords);
  console.log("\nuser score after reset: ", userTotalScore);
  res.send(`{success: true}`);
});

//POST "/heard" route
app.post("/heard", (req, res) => {
  //Marks that a buzzword has been heard and should update the total score. Returns the new total score if successful otherwise returns just false
  let bodyHEARD = [];
  let wordHeardFlag = false;

  req.on("data", chunk => {
    bodyHEARD.push(chunk);
  }).on("end", () => {
    //Converts buffer to a string
    bodyHEARD = Buffer.concat(bodyHEARD).toString();
    let parsedBuzzWordsHEARD = qs.parse(bodyHEARD);

    buzzWords.forEach(element => {
      if (element.buzzword === parsedBuzzWordsHEARD.buzzword) {
        userTotalScore += Number(parsedBuzzWordsHEARD.points);
        wordHeardFlag = true;
        return userTotalScore;
      }
      else {
        wordHeardFlag = false;
        return wordHeardFlag;
      }
    })
    if (wordHeardFlag) {
      console.log("\nNew Updated Score: ", userTotalScore)
      res.send(`New Total Score: ${userTotalScore}`)
    }
    else {
      console.log("\nERROR: buzzword not heard")
      res.send(`{success: ${wordHeardFlag}}`)
    }
  });
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