const express = require('express');
const app = express();
const PORT = process.env.PORT || 8001;
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

//GET request
app.get('/', (req, res) => {
  console.log("\nServing `index.html`");

  //This takes in a path. `dirname` is an absolute path. It is safer to use that and then add the rest of the path that you want.
  res.sendFile(__dirname + '/public/index.html');
});

// app.get('/buzzwords', (req, res) => {
//   console.log(buzzWordsArr);
//   res.send(`{"success": true}`);
//   res.sendFile(__dirname + '/public/index.html');
// })

// //POST /buzzwords gets urlencoded bodies
// app.post('/buzzwords', urlencodedParser, (req, res) => {
//   res.send(`{"success": true}`)
// });

// //POST /api/users gets JSON bodies
// app.post('/api/users', jsonParser, (req, res) => {
//   //create user in req.body
// })

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