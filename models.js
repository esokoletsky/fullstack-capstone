'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

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


const exerciseSchema = mongoose.Schema(
{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },    
    day: {type: "string", required: true },
    muscleGroup: {type: "string", required: true },
    muscle: {type: "string", required: true },
    name: {type: "string", required: true },    
    weight: {type: "number", required: true },
    sets: {type: "number", required: true },
    reps: {type: "number", required: true }

});

userSchema.virtual('clientName').get(function() {
    return `${this.firstName} ${this.lastName}`.trim();
  });

exerciseSchema.methods.serialize = function() {
    return {
      id: this._id,
      day: this.day,
      muscleGroup: this.muscleGroup,
      muscle: this.muscle,
      name: this.name,    
      weight: this.weight,
      sets: this.sets,
      reps: this.reps
    };
    };

    userSchema.methods.serialize = function() {
        return {
            id: this._id,
            clientName: this.clientName,
            userName: this.userName
        };
    }    

    exerciseSchema.pre('find', function(next) {
        this.populate('user');
        next();
      });
      
      exerciseSchema.pre('findOne', function(next) {
        this.populate('user');
        next();
      });

const Exercise = mongoose.model('Exercise', exerciseSchema);
const User = mongoose.model("User", userSchema);

module.exports = {User, Exercise};