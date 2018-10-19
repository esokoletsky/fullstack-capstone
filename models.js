'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const routineSchema = mongoose.Schema(
{
    userName: {
        type: "string",
        unique: true
    },
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

routineSchema.methods.serialize = function() {
    return {
      id: this._id,
      day: this.day,
      muscleGroup: this.muscleGroup,
      targetExercise: this.targetExercise  
    };
    };

const Routine = mongoose.model('Routine', routineSchema);

module.exports = {Routine};