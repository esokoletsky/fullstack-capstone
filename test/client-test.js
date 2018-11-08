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



function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedDatabase(){
  return seedUsers()
  .then((data)=>{
    seedExcercises()
  });
  }


function seedUsers(){
  console.info('seeding users');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: faker.internet.userName(),
    });
  }
  return User.insertMany(seedData);
}

function seedExcercises() {
  console.info('seeding exercises');
  const seedData = [];
  for (let i = 1; i <= 10; i++){ 
  seedData.push({
    day: faker.lorem.text(),
    muscleGroup: faker.lorem.text(),
    muscle: faker.lorem.text(),
    name: faker.lorem.text(),
    weight: faker.random.number(),
    sets: faker.random.number(),
    reps: faker.random.number(),
   });
}
 return Exercise.insertMany(seedData);
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

describe('GET endpoints', function () {

  it('should return all existing users', function () {
    let res;
    return chai.request(app)
      .get('/users')
      .then(_res => {
        res = _res;
        res.should.have.status(200);
        res.body.users.should.have.lengthOf.at.least(1);

        return User.count();
      })
      .then(count => {
        res.body.users.should.have.lengthOf(count);
      });
  });


  it('should return users with right fields', function () {

    let resPost;
    return chai.request(app)
      .get('/users')
      .then(function (res) {

        res.should.have.status(200);
        res.should.be.json;
        res.body.users.should.be.a('array');
        res.body.users.should.have.lengthOf.at.least(1);
        res.body.users.forEach(function (post) {
        post.should.be.a('object');
        post.should.include.keys('clientName', 'userName', 'id' );
        });

        resPost = res.body.users[0];
        return User.findById(resPost.id);
      })
      .then(post => {
        resPost.userName.should.equal(post.userName);
        resPost.id.should.equal(post.id);
        resPost.clientName.should.equal(post.clientName);
      });
  });

  it('should return all existing exercises', function () {
    let res;
    return chai.request(app)
      .get('/exercises')
      .then(_res => {
        res = _res;
        res.should.have.status(200);
        res.body.exercises.should.have.lengthOf.at.least(1);

        return Exercise.count();
      })
      .then(count => {
        res.body.exercises.should.have.lengthOf(count);
      });
  });

  it('should return exercises with right fields', function () {

    let resPost;
    return chai.request(app)
      .get('/exercises')
      .then(function (res) {

        res.should.have.status(200);
        res.should.be.json;
        res.body.exercises.should.be.a('array');
        res.body.exercises.should.have.lengthOf.at.least(1);
        res.body.exercises.forEach(function (post) {
        post.should.be.a('object');
        post.should.include.keys('id', 'day', 'muscleGroup', 'muscle', 'name', 'weight', 'sets', 'reps');
        });
        resPost = res.body.exercises[0];
        return Exercise.findById(resPost.id);
      })
      .then(post => {
        resPost.id.should.equal(post.id);
        resPost.day.should.equal(post.day);
        resPost.muscleGroup.should.equal(post.muscleGroup);
        resPost.muscle.should.equal(post.muscle);
        resPost.name.should.equal(post.name);
        resPost.weight.should.equal(post.weight);
        resPost.sets.should.equal(post.sets);
        resPost.reps.should.equal(post.reps);
      });
  });

});

describe('POST endpoint', function () {

  it('should add a new user', function () {

    const newUser = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: faker.internet.userName(),
    };

    return chai.request(app)
      .post('/users')
      .set('content-type', 'application/json')
      .send(newUser)
      .then(function (res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys 
        ( 'id', 'clientName', 'userName' );
        res.body.userName.should.equal(newUser.userName);
        res.body.id.should.not.be.null;
        res.body.clientName.should.equal(
          `${newUser.firstName} ${newUser.lastName}`);
        return User.findById(res.body.id);
      })
      .then(function (post) {
        post.userName.should.equal(newUser.userName);
        post.firstName.should.equal(newUser.firstName);
        post.lastName.should.equal(newUser.lastName);
      });
  });
});

});