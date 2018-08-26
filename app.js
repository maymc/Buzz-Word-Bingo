const express = require('express');
const app = express();
const PORT = process.env.PORT || 8001;
const qs = require("querystring");
const bodyParser = require('body-parser');

// //Tell Express to use a static directory that we define as the location to look for requests
// //app.use(express.static('public'));

// //Storage for buzzword objects
// let buzzWordsArr = [];
// console.log("buzzWordsarr: ", buzzWordsArr);

// //Create application/json parser
// //This is a function
// let jsonParser = bodyParser.json();
// //console.log("\njsonParser: ", jsonParser);

// //Create application/x-www-form-urlencoded parser
// //'extended = true means the object's key-value pairs' value can be any type, not just string or array
// //This is a function
// let urlencodedParser = bodyParser.urlencoded({ extended: true });
// //console.log("\nurlencodedParser: ", urlencodedParser);

// console.log("request method:", req.method);
// console.log("request path:", req.path);
// console.log("response:", res);

//GET "/" request
app.get("/", (req, res) => {
  console.log("\nServing `index.html`");

  //This takes in a path. `dirname` is an absolute path. It is safer to use that and then add the rest of the path that you want.
  res.sendFile(__dirname + '/public/index.html');
});

//GET "/buzzword" request
//Array containing objects
let buzzWords = [];
let buzzWordsCount = 0;

app.get("/buzzwords", (req, res) => {
  console.log("\nGetting buzzwords...");
  res.json(buzzWords);
})

//POST "/buzzword" route
app.post("/buzzword", (req, res) => {

  //Push chunk into the buzzwords array. Chunk is a buffer
  let body = [];
  req.on("data", chunk => {
    body.push(chunk);
    //console.log("chunk: ", body);
  }).on("end", () => {
    //Converts buffer to a string
    body = Buffer.concat(body).toString();
    let parsedBuzzWords = qs.parse(body);

    if (`${parsedBuzzWords.buzzword}` !== "" && `${parsedBuzzWords.points}` !== "" && `${parsedBuzzWords.heard}` !== "" && buzzWords.length !== 5) {
      buzzWords.push(parsedBuzzWords);
      console.log("\nbuzzWords Arr: ", buzzWords);
      res.send(`{"success": true}`);
    }
    else {
      console.log("\nError with entering a buzzword.")
      res.send(`{"success": false}`);
    }
  });

});

//PUT "/buzzword" route
app.put("/buzzword", (req, res) => {
  let bodyPUT = [];

  req.on("data", chunk => {
    bodyPUT.push(chunk);

  }).on("end", () => {
    //Converts buffer to a string
    bodyPUT = Buffer.concat(bodyPUT).toString();
    let parsedBuzzWordsPUT = qs.parse(bodyPUT);

    if (`${parsedBuzzWordsPUT.buzzword}` !== "" && `${parsedBuzzWordsPUT.points}` !== "" && `${parsedBuzzWordsPUT.heard}` !== "") {
      //Iterate through the buzzword array and find the buzzword that matches the one requested and update the points
      console.log("\n**Old buzzWords: ", buzzWords);
      buzzWords.forEach(element => {
        if (element.buzzword === parsedBuzzWordsPUT.buzzword) {
          element.points = parsedBuzzWordsPUT.points;
          res.send(`{"success": true}`);
        }
      })
      console.log("\n**Updated buzzWords: ", buzzWords);
    }
    else {
      console.log("\nError with updating the buzzword.")
      res.send(`{"success": false}`);
    }

  })
})



//GET request - catch all for other requests not specified
app.get('*', (req, res) => {
  //Error message
  console.log("\nError: File could not be found. Invalid request.");
  res.sendStatus(404);
});



// Server is listening
const server = app.listen(PORT, () => {
  console.log("Server address: ", server.address());
  const host = server.address().address;

  console.log(`App listening at http://${host}:${PORT}`);
});