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
        res.status(200).json({users: users.map(user => user.serialize())}
        );
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

app.get('/users/:id', (req, res) => {
    User
      .findById(req.params.id)
      .then(user => res.status(201).json(user.serialize()))
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

  app.post('/exercises', (req, res) => {
    const requiredFields = [ 'day', 'muscleGroup', 'muscle', 'name', 'weight', 'sets', 'reps' ];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
       Exercise
      .create(req.body)
      .then(exercise => {
         res.status(201).json(exercise.serialize())
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });

  app.put('/users/:id', (req,res) => {
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }

    const updated = {};
    const updatableFields = ['firstName', 'lastName', 'userName'];
    updatableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });
    User
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updateUser => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'something went wrong' }));
  });

  app.put('/exercises/:id', (req,res) => {
    if(!(req.params.id &&  req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id must match'
      });
    }

    const updated = {};
    const updatableFields = [ 'day', 'muscleGroup', 'muscle', 'name', 'weight', 'sets', 'reps' ];
    updatableFields.forEach(field => {
      if (field in req.body) {
        updatable[field] = req.body[field];
      }
    });
    Exercise
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updateExercise => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'something went wrong' }));
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