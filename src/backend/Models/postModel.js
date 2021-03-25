var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  },  imagePath: {
    type: String,
    required: false
  },
});

// This creates our model from the above schema, using mongoose's model method
var Post = mongoose.model("note", PostSchema);

// Export the Article model
module.exports = Post;
