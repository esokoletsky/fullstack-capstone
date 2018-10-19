'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const clientSchema = mongoose.Schema({
    firstName: "string",
    lastName: "string",
    userName: {
        type: "string",
        unique: true
    }
});

const routineSchema = mongoose.Schema(
{
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },    
    id: ObjectId,
    day: "string",
    muscleGroup: "string",
    muscle: "string",
    targetExercise: {
    weight: number,
    sets: number,
    reps: number
    }
});

routineSchema.virtual('authorName').get(function() {
    return `${this.client.firstName} ${this.client.lastName}`.trim();
  });

routineSchema.methods.serialize = function() {
    return {
      id: this._id,
      day: this.day,
      muscleGroup: this.muscleGroup,
      targetExercise: this.targetExercise  
    };
    };

    routineSchema.pre('find', function(next) {
        this.populate('client');
        next();
      });
      
      routineSchema.pre('findOne', function(next) {
        this.populate('client');
        next();
      });

const Routine = mongoose.model('Routine', routineSchema);
const Client = mongoose.model("Client", clientSchema);

module.exports = {Routine, Client};