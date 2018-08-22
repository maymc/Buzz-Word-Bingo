const express = require('express');
const app = express();

//GET request
app.get('/', (req, res) => {
  res.send('Hello World! This works!');
  console.log("request method:", req.method);
  console.log("request path:", req.path);
  //console.log("response:", res);
});







// Server is listening
const server = app.listen(8001, () => {
  console.log("server address: ", server.address());
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});