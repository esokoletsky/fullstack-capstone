'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
//mongoose.promise = global.Promise;

const should = chai.should();

const { User, Exercise } = require("../models");
const {app, runServer, closeServer} = require('../server');
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

 // seedExcercises();
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
              let newExcercise = new Excercise();
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

describe('Client Exercise API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedDatabase();
  });

  afterEach(function () {

    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

describe('GET endpoint', function () {

  it('should return all existing users', function () {
    let res;
    return chai.request(app)
      .get('/users')
      .then(_res => {
        res = _res;
        console.log(res.body);
        res.should.have.status(200);
        res.body.users.should.have.lengthOf.at.least(1);
        res.should.have.status(200);
        res.body.users.should.be.json;
        res.body.users.should.be.a('array');
        res.body.users.should.have.lengthOf.at.least(1);

        res.body.users.forEach(function (user) {
          user.should.be.a('object');
          user.should.include.keys('id', 'clientName', 'userName'); 

        return User.count();
      })
      .then(count => {
        res.body.users.should.have.lengthOf(count);
      });
  });

  /*
  it('should return users with right fields', function () {

    let resPost;
    return chai.request(app)
      .get('/users')
      .then(function (res) {

        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.should.have.lengthOf.at.least(1);
        res.body.forEach(function (post) {
          post.should.be.a('object');
          post.should.include.keys('firstName', 'lastName', 'userName');
        });

        resPost = res.body[0];
        return User.findById(resPost.id);
      })
      .then(post => {
        resPost.firstName.should.equal(post.firstName);
        resPost.lastName.should.equal(post.lastName);
        resPost.userName.should.equal(post.userName);
      });
  });
  */

});

});

});