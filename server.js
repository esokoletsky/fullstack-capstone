"use strict"
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const faker = require('faker');
app.use(express.static('public'));

app.get("/getMyJSON", (req, res) => {
    res.json(MockData);
});

const { DATABASE_URL, PORT } = require('./config');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
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

module.exports = {app, runServer, closeServer};