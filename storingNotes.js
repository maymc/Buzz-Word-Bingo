//You can store data in the global area, with these routes, your client can controlthis data structure

const express = require('express');
const app = express();
const bp = require('body-parser');

const nextId = 3;
const spells = [
  {
    id: 1,
    name: 'Magic Missiles',
    damage: 10
  },
  {
    id: 2,
    name: 'frost siheld',
    damage: -100
  }
]

app.get("/getallspells", (req, res) => {
  //res.json all it does is, you can put in a javascript obect in there and turns it into a json string
  //if you are only sending data to your client then use res.json.
  //prior to this we were using sendFile. When we were doing xhr, we had to turn something into a string and then get data from it
  //in the future we are building clients. Call certain data from certain end points, it doesn't give you html
  //you can res.json('hellow wor;d'). 
  //res.json is a response type like res.sendFile. You can't have two responses for a request.
  //all of these requests has res.end under the hood. It is baked into 
  //Convenience methods to send different types 
  //Postman is just to test your server
  //res.json can send it an object or js, etc
  //OIt will serialize it. you don't need to do json.stringify, it does it for you
  //res.send(just sends a string)

  //So it makes an object "viewable "by turning it into a string? Usually it would be undefined by by using res.json its readable by the client?
  res.json(spells);
});

//Colon id is so that in your route, you can do like '/spell/1', you make the variable to catch the parameter you don't know
app.get('spell/:id', (req, res) => {
  //destructure is by this line
  const { id } = req.params;

  //this is just a filter method that retusn a new array of everything filtered. If callback returns true then the item it is on will be in the filtered array
  const resData = spells.filter(item => {
    // console.log('item.id', item.id);
    // console.log('id', id);
    return item.id == id;
  })
  console.log('resData:', resData);
  res.json(resData[0]);
});

app.post('/addspell', (req, res) => {
  console.log('req.body', req.body);
  let spellObject = req.body;
  spellObject.id = nextId;
  //pushes into the array
  spells.push(spellObject);
  //redirects to /spell/:id method
  res.redirect(`/spell/${nextId}`);
  nextId++;
});

app.delete()

app.listen(8090, () => {
  console.log('App is up');
})

//CRUD = create, read, update, delete

//through these routes in postman, we can manipulate the data structure (the array)




////////////////////////////////////////////////////////
//Raymond's notes
const express = require('express');
const app = express();
const bp = require('body-parser');

app.use(bp.urlencoded({ extended: true }));

let nextId = 3;
const spells = [
  {
    id: 1,
    name: 'Magic Missiles',
    damage: 10
  },
  {
    id: 2,
    name: 'Frost Shield',
    damage: -100
  }
];

app.get('/getallspells', (req, res) => {
  res.json(spells);
});

app.get('/spell/:id/', (req, res) => {
  const { id } = req.params;
  // const resData = spells.filter(item => item.id === id);
  const resData = spells.filter(item => {
    return item.id == id;
  });

  console.log('resData', resData);
  res.json(resData[0]);
});

app.post('/addspell', (req, res) => {
  console.log('req.body', req.body);
  let spellObject = req.body;
  spellObject.id = nextId;
  spells.push(spellObject);
  res.redirect(`/spell/${nextId}`);
  nextId++;
});

app.delete('/removespell/:id', (req, res) => {
  //...
})

app.listen(8090, () => {
  console.log('APP IZ UP');
});