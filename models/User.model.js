const { Schema, model } = require("mongoose");

const userSchema = new Schema(
{
  username: {
    type: String,
    trim: true,
    // match: [/^[a-zA-Z0-9]{4,12$}/, "Numbers and letters only, must be between 4 and 12 characters long."],
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    // match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  standarduser: {
    type: Boolean,
    default: true
  },
  readonly: {
    type: Boolean,
    default: false
  }

},
{
  timestamps: true
}
);

const User = model("User", userSchema);

module.exports = User;