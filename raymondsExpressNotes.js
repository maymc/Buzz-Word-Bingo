const express = require('express');
const app = express();
const PORT = process.env.PORT || 8089;
const qs = require('querystring');
const bp = require('body-parser');
const fs = require('fs');

app.use((req, res, next) => {
  console.log(`${req.method} request at: ${req.url}`);
  next();
});

app.use(bp.urlencoded({ extended: true }));

app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

// app.get('/css/styles.css', (req, res) => {
//   res.sendFile(__dirname + '/public/styles.css');
// });

// app.get('/:element', (req, res) => {
//   const { element } = req.params;
//   res.sendFile(__dirname + `/public/${element}`);
// });

// app.get('/hydrogen.html', (req, res) => {
//   res.sendFile(__dirname + '/public/hydrogen.html');
// });

// app.get('/helium.html', (req, res) => {
//   res.sendFile(__dirname + '/public/helium.html');
// });

app.post('/elements', (req, res) => {
  console.log('BODY INSIDE OF POST ROUTE HANDLER', req.body);
  const {
    elementName,
    elementSymbol,
    elementDescription,
    elementNumber
  } = req.body;

  const markup = `<!DOCTYPE html>
                  <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <title>The Elements - ${elementName}</title>
                    <link rel="stylesheet" href="/css/styles.css">
                  </head>
                  <body>
                    <h1>${elementName}</h1>
                    <h2>${elementSymbol}</h2>
                    <h3>Atomic number ${elementNumber}</h3>
                    <p>${elementDescription}</p>
                    <p><a href="/">back</a></p>
                  </body>
                  </html>`;

  fs.writeFile(`./public/${elementName}.html`, markup, err => {
    res.sendFile(__dirname + `/public/${elementName}.html`);
  });
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/404.html');
});

app.listen(PORT, () => {
  console.log(`Server has starting on port: ${PORT}`);
});