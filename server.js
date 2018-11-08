"use strict"
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const faker = require('faker');
app.use(express.static('public'));
app.use(express.json());
app.get("/getMyJSON", (req, res) => {
    res.json(MockData);
});

const { DATABASE_URL, PORT } = require('./config');
const { User, Exercise } = require("./models")

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/users', (req, res) => {
    User
      .find()
      .then(users => {
        res.json({users: users.map(user => user.serialize())}
        );
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

app.get('/users:id', (req, res) => {
    User
      .find()
      .then(users => {
        res.json(users.map(user => user.serialize()));
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

  app.get('/exercises', (req, res) => {
    Exercise
      .find()
      .then(exercises => {
        res.json({exercises: exercises.map(exercise => exercise.serialize())}
        );
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

  app.post('/users', (req, res) => {
    const requiredFields = [ 'firstName','lastName', 'userName' ];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    User
      .create(req.body)
      .then(user => res.status(201).json(user.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });
  

let server; 

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}


function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}


if (require.main === module) {
  runServer().catch(err => console.error(err));
};

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};