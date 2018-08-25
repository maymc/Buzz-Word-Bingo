const express = require('express');
const app = express();
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

//GET request
app.get('/', (req, res) => {
  console.log("\nServing `index.html`");
  res.sendFile(__dirname + '/public/index.html');
  // console.log("request method:", req.method);
  // console.log("request path:", req.path);
  // console.log("response:", res);
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

// //PUT
// app.put('/buzzwords', urlencodedParser, (req, res) => {

// })
// //DELETE
// app.put('/buzzwords', urlencodedParser, (req, res) => {

// })
// //POST
// app.put('/reset', urlencodedParser, (req, res) => {

// })
// //POST
// app.put('/heard', urlencodedParser, (req, res) => {

// })

// //POST /api/users gets JSON bodies
// app.post('/api/users', jsonParser, (req, res) => {
//   //create user in req.body
// })






// Server is listening
const server = app.listen(8001, () => {
  console.log("server address: ", server.address());
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});