const mongoose = require("mongoose");

const userDetails = mongoose.Schema({
  name: { type: "string", required: true },
  email: { type: "string", required: true },
  password: { type: "string", required: true },
  confirmPassword: { type: "string", required: true },
});

module.exports = mongoose.model("userDetails", userDetails);
