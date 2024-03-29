//  Add your code here
const { Schema, model } = require("mongoose");

const celebritySchema = new Schema({
  name: String,
  image: String,
  occupation: String,
  catchPhrase: String,
  movie: [{type: Schema.Types.ObjectId, ref: "Movie"}]
  // movie: {type: Schema.Types.ObjectId, ref: "Movie"}
});

const Celebrity = model("Celebrity", celebritySchema);

module.exports = Celebrity;
