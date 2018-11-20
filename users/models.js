'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;


const userSchema = mongoose.Schema({
    firstName: "string",
    lastName: "string",
    userName: {
        type: "string",
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

userSchema.virtual('clientName').get(function() {
    return `${this.firstName} ${this.lastName}`.trim();
  });

  userSchema.methods.serialize = function() {
    return {
        id: this._id,
        clientName: this.clientName,
        userName: this.userName
    };
};

const User = mongoose.model("User", userSchema);

module.exports = {User};