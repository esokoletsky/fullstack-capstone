'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const { Client } = require("../models")
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

/*describe('check-root', function() {
    
    before(function() {
        return runServer();
      });
    
      after(function() {
        return closeServer();
      });

      it('should return a 200 status', function() {
          return chai.request(app)
          .get('/')
          .then(function(res){
            res.should.have.status(200);
            res.should.be.html;
           // res.body.should.be.a('object');
           // res.body.message.should.equal('Hello world');
          });
      });

      
});
*/

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedDatabase(){
  for(var j = 0; j < 20; j++){
      seedUser();
  }

  seedExcercises();
}

function seedUser(){
  return User.create({
   firstName: faker.name.firstName(),
   lastName: faker.name.lastName(),
   userName: faker.internet.userName()
});
}

function seedExcercises(){
  return User.find().exec().
  then(users => {
      for(var i = 0; i < users.length; i++){
          for(var j = 0; j < 5; j++){
              let newExcercise = new Excercise({});
              seedExcercise(users[i]._id, newExcercise);
          }
      }
  })
}

function seedExcercise(userId, excercise) {
return Excercise.create({
   day: faker.lorem.text(),
   muscleGroup: faker.lorem.text(),
   muscle: faker.lorem.text(),
   name: faker.lorem.text(),
  weight: faker.lorem.number(),
  sets: faker.lorem.number(),
  reps: faker.lorem.number(),
   user: userId });
}