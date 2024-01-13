const { Schema, model } = require("mongoose");

const userSchema = new Schema(
{
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
},
{
  timestamps: true
}
);

const User = model("User", userSchema);

module.exports = User;