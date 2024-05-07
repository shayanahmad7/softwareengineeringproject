const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const mealsSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
  
  },
  restaurant: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true
  },
  calories:{
    type: Number,
    required: true
  },
  protein:{
    type: Number,
    required:true
  },
  fat:{
    type:Number,
    required:true
  },
   carbs: {
    type: Number, 
    required: true
  },
  description: {
    type: String, // Store weight in kilograms
    required: true
  },
  price: {
    type: Number, // Store goal weight in kilograms
    required: false
  },
  link: {
    type: String,
    required: true
  },
  // add other fields as needed
});

module.exports = mongoose.model('Meals', mealsSchema, 'Meals');
