'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
mongoose.promise = global.Promise;

const should = chai.should();

const { TEST_DATABASE_URL } = require('../config');
const { User } = require("../users/models");
const {app, runServer, closeServer} = require('../server');

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
    return seedUsers();
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

describe('User API resource', function() {
  
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

    describe('POST endpoints', function() {
       it('Should reject users with missing userName', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            password,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('userName');
          });
      }); 
       it('Should reject users with missing password', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('password');
          });
      }); 
       it('Should reject users with non-string userName', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName: 1234,
            password,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('userName');
          });
      }); 
       it('Should reject users with non-string password', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName,
            password: 1234,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('password');
          });
      }); 
       it('Should reject users with non-string first name', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName,
            password,
            firstName: 1234,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('firstName');
          });
      }); 
       it('Should reject users with non-string last name', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName,
            password,
            firstName,
            lastName: 1234
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('lastName');
          });
      }); 
       it('Should reject users with non-trimmed userName', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName: ` ${userName} `,
            password,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
            expect(res.body.location).to.equal('userName');
          });
      }); 
       it('Should reject users with non-trimmed password', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName,
            password: ` ${password} `,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
            expect(res.body.location).to.equal('password');
          });
      }); 
       it('Should reject users with empty userName', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName: '',
            password,
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('userName');
          });
      }); 
       it('Should reject users with password less than ten characters', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName,
            password: '123456789',
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 10 characters long'
            );
            expect(res.body.location).to.equal('password');
          });
      }); 
       it('Should reject users with password greater than 72 characters', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName,
            password: new Array(73).fill('a').join(''),
            firstName,
            lastName
          })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at most 72 characters long'
            );
            expect(res.body.location).to.equal('password');
          });
      }); 
       it('Should reject users with duplicate userName', function() {
        // Create an initial user
        return User.create({
          userName,
          password,
          firstName,
          lastName
        })
          .then(() =>
            // Try to create a second user with the same userName
            chai.request(app).post('/users').send({
              userName,
              password,
              firstName,
              lastName
            })
          )
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'userName already taken'
            );
            expect(res.body.location).to.equal('userName');
          });
      }); 
       it('Should create a new user', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName,
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'userName',
              'firstName',
              'lastName'
            );
            expect(res.body.userName).to.equal(userName);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({
              userName
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      }); 
       it('Should trim firstName and lastName', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            userName,
            password,
            firstName: ` ${firstName} `,
            lastName: ` ${lastName} `
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'userName',
              'firstName',
              'lastName'
            );
            expect(res.body.userName).to.equal(userName);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({
              userName
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
          });
      }); 
    
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
          .then(function (user) {
            user.userName.should.equal(newUser.userName);
            user.firstName.should.equal(newUser.firstName);
            user.lastName.should.equal(newUser.lastName);
          });
      });
    
    });

    describe('PUT endpoints', function() {

      it('should update fields in your User send over', function() {
        const updateData = {
          firstName: 'Joe',
          lastName: 'Shmoe',
          userName: 'JShmoe'
        };
     
        return User
         .findOne()
         .then(user => {
           updateData.id = user.id;
     
           return chai.request(app)
           .put(`/users/${user.id}`)
           .send(updateData);
         })
         .then(res => {
           res.should.have.status(204);
           return User.findById(updateData.id);
         })
         .then(user => {
           user.firstName.should.equal(updateData.firstName);
           user.lastName.should.equal(updateData.lastName);
           user.userName.should.equal(updateData.userName);
         });
      });
     });
  

    describe('GET endpoints', function () {

      it('should return an individual user id', function () {
        let user;
        return User
        .findOne()
        .then(_user => {
          user = _user;
          return chai.request(app).get(`/users/${user.id}`);
        })
        .then(res => {
          res.should.have.status(201);
          res.body.id.should.equal(user.id);
          res.body.clientName.should.equal(`${user.firstName} ${user.lastName}`.trim());
          res.body.userName.should.equal(user.userName);
          
        })
    
    
      })
    
      it('should return users with right fields', function () {
    
        let res;
        return chai.request(app)
          .get('/users')
          .then(function (_res) {
            res = _res;
            res.should.have.status(200);
            res.should.be.json;
            res.body.users.should.be.a('array');
            res.body.users.should.have.lengthOf.at.least(1);
            res.body.users.forEach(function (user) {
              user.should.be.a('object');
              user.should.include.keys('clientName', 'userName', 'id' );
            });
            
            return User.count();
          })
          .then(count => {
            res.body.users.should.have.lengthOf(count);
        });
      });
    });    
  });
