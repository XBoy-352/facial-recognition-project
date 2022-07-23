const mongoose = require("mongoose");
const sequencing = require("./sequencing");
const autoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  _id: Number,
  user_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  url : {type: String},
  token: { type: String },
},
  { _id: false }
);

//For autoIncrement of user ID
userSchema.plugin(autoIncrement);

module.exports = mongoose.model("user", userSchema);