//Any return method already has res.end so don't need one
//Response handlers explains this

//Repsonse methods is important. 
//res.json
//If you res.json() an object it will return a JSON parsed object

//Express.router - don't need to understand this yet for buzzwordbingo. Can figure this out afterwards

//For our case, learnining HTTP servers is to go down through every single item. 

//Stuff from here will be similar across frameworks

//Middleware example/demo (elemental demo)
//First create the public files
//Complex way first then simplify
//npm install express

//Express uses fs module behind the scenes, Uses a bunch of modules behind the scenes and creates an abstraction layer on top of everything we had ot do.
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8089;
const qs = require('querystring');
const bp = require('body-parser');

console.log('dirname: ', __dirname);

//Refactored this to app.use
// const logMethodAndURL = (req, res, next) => {
//   console.log(`${req.method} request at: ${req.url}`);
//   //next just tells middleware to execute next guy in the chain
//   next();
// };

app.use((req, res, next) => {
  console.log(`${req.method} request at: ${req.url}`);
  next();
});

app.use(bp.urlencoded({ extended: true }));

//able to serve all files in public
app.use(express.static('public'));

//Refactored this into bodyparser
// app.use((req, res, next) => {
//   let body = [];
//   //Data comes in as chunks. Node using event handling to create triggers that tells that data is coming in and when to stop sending data so you have to manually do a 'end' to tell it that there is no more data coming so you can start parsing. You can't put 'next' outside of 'end'. Gotta setup traps for your signal.
//   req.on('data', data => {
//     body.push(data);
//   }).on('end', () => {
//     body = Buffer.concat(body).toString();
//     body = qs.parse(body);
//     console.log('body inside of middleware:', body);
//     req.body = body;
//     next();
//   })
// })

//Things are loading slow because it is loading from the hard drive. We will learn about caching

// app.get('/', (req, res) => {
//   // res.send('hello world');
//   //takes in a path, dirname is an absolute path. it is safer.
//   res.sendFile(__dirname + '/public/index.html');
// });

app.get('/css/styles.css', (req, res) => {
  res.sendFile(__dirname + '/public/styles.css');
})

//turns route name into a variable. Whatever name you give it it will be turned into an element ('element');
app.get('/:element', (req, res) => {
  const { element } = req.params;
  console.log('req.params.element: ', req.params.element);
  res.sendFile(__dirname + `/public/${element}.html`)
})

// app.get('/hydrogen.html', (req, res) => {
//   res.sendFile(__dirname + '/public/hydrogen.html');
// })

// app.get('/helium.html', (req, res) => {
//   res.sendFile(__dirname + '/public/helium.html');
// })

//POST is the exact same as the http thing
app.post('/elements', (req, res) => {
  // console.log("req.url", req.url);
  // console.log('req.method', req.method);
  // console.log('req.body', req.body);

  //This part we will use middleware instead.
  //Middleware will intercept request. Your request goes through a bunch of functions.
  // let body = [];
  // req.on('data', data => {
  //   body.push(data);
  // }).on('end', () => {
  //   body = Buffer.concat(body).toString();
  //   body = qs.parse(body);
  //   console.log('body:', body);
  // })

  console.log('body inside of post route handler:', req.body);
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
    <title>The Elements - Hydrogen</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
    <h1>Hydrogen</h1>
    <h2>H</h2>
    <h3>Atomic number 1</h3>
    <p>${elementName} is a chemical element with chemical symbol H and atomic number 1. With an atomic weight of 1.00794 u, ${elementName}
      is the lightest element on the periodic table. Its monatomic form (${elementSymbol}) is the most abundant chemical substance in the
      universe, constituting roughly 75% of all baryonic mass. Non-remnant stars are mainly composed of hydrogen in its plasma
      state. The most common isotope of ${elementName}, termed protium (name rarely used, symbol 1H), has a single proton and zero
      neutrons.</p>
    <p><a href="/">back</a></p>
  </body>
  </html>`

  fs.writeFile(`./public/${elementName}.html`, markup, err => {
    res.sendFile(__dirname + `/public/${elementName}.html`)
  });

  //res.sendStatus(200);
});


//A catch all
app.get("*", (req, res) => {

})


//Callback function after server has started
app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}`);
});



