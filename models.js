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

const exerciseSchema = mongoose.Schema(
{
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },    
    day: {type: string, required: true },
    muscleGroup: {type: string, required: true },
    muscle: {type: string, required: true },
    name: {type: string, required: true },    
    weight: {type: number, required: true },
    sets: {type: number, required: true },
    reps: {type: number, required: true }

});

exerciseSchema.virtual('clientName').get(function() {
    return `${this.client.firstName} ${this.client.lastName}`.trim();
  });

exerciseSchema.methods.serialize = function() {
    return {
      id: this._id,
      day: this.day,
      muscleGroup: this.muscleGroup,
      name: this.name,    
      weight: this.weight,
      sets: this.sets,
      reps: this.reps
    };
    };

    clientSchema.methods.serialize = function() {
        return {
            clientName: this.clientName,
            userName: this.userName
        };
    }    

    exerciseSchema.pre('find', function(next) {
        this.populate('client');
        next();
      });
      
      exercisechema.pre('findOne', function(next) {
        this.populate('client');
        next();
      });

const Exercise = mongoose.model('Exercise', exerciseSchema);
const Client = mongoose.model("Client", clientSchema);

module.exports = {Exercise, Client};