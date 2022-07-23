const mongoose = require("mongoose");

//Creating Missing Schema
const missingSchema = new mongoose.Schema({
  name: { type: String, default: null },
  missingSince: { type: String},
  address: { type: String },
  contact: { type: String },
  url: { type: String },
},
);

module.exports = mongoose.model("missing", missingSchema);