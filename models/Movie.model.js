const {Schema, model} = require("mongoose");

const movieSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please add a title"]
  },
  image: String,
  genre: String,
  plot: String,
  cast: [{type: Schema.Types.ObjectId, ref: "Celebrity"}],
  donor: {type: Schema.Types.ObjectId, ref: "User"}
});

const Movie = model("Movie", movieSchema);

module.exports = Movie;