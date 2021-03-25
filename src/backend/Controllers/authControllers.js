const Post = require("../Models/postModel");

module.exports.get_orders = async (req, res) => {
  const posts = await Post.find();
  res.json({
    msg: "Posts fetched successfully",
    posts: posts,
  });
};
module.exports.post_orders = (req, res) => {
  const url=req.protocol+"://"+req.get("host");
  var {title, content} = req.body;
  let post = Post({
    title,
    content,
    imagePath:url+"/images/"+req.file.filename
  });
  post.save().then((result) => {
    res.json({Done: title, post: result});
  });
};
module.exports.delete_post = (req, res) => {
  const id = req.params.id;
  Post.deleteOne({_id: id})
    .then(() => res.status(200).json({message: "Post Deleted"}))
    .catch(() => {
      res.status(301).json({message: "Post Is Not Deleted"});
    });
};
module.exports.update_Post = (req, res) => {
  let imagePath=req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://'+ req.get("host");
    imagePath = url + "/images/"+req.file.filename
  }
  const id = req.params.id;
  const {title, content} = req.body;
  const post = {title: title, content: content,imagePath:imagePath};
  Post.updateOne({_id: id}, post).then((result) => {
    res.status(201).json({message: "updated "});
  });
};
//gate single post
module.exports.get_post = (req, res) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(201).json(post)
    } else {
      res.status(301).json({message: "post not FOund"})
    }
  });
};
