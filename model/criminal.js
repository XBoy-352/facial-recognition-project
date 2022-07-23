const mongoose = require("mongoose");

//Creatng Criminal Schema
const criminalSchema = new mongoose.Schema({
  name: { type: String, default: null },
  crime: { type: String},
  wanted_Since: { type: String },
  regional_Police: { type: String },
  url: { type: String },
}
);

module.exports = mongoose.model("criminal", criminalSchema);