const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  goals:{
    type: [String],
    required: true
  },
  restrictions:{
    type: [String],
    required:true
  },
  allergies:{
    type:[String],
    required:true
  }, height: {
    type: Number, // Store height in centimeters
    required: true
  },
  weight: {
    type: Number, // Store weight in kilograms
    required: true
  },
  goalWeight: {
    type: Number, // Store goal weight in kilograms
    required: false
  },
  sex: {
    type: String,
    enum: ['male', 'female'], // Restrict to these two options
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },targets: {//target calories, carbs, fat, protein
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    protein: { type: Number, required: true }
  }

  // add other fields as needed
});

module.exports = mongoose.model('User', userSchema,'User');