'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
// const faker = require('faker');
// const mongoose = require('mongoose');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

describe('check-root', function() {
    
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