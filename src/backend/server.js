var express = require('express');
const mongoose = require('mongoose');
var authroutes = require('./Routes/routes');
var cors = require('cors');
var app = express();
app.use(express.json({extended: false}));
//it allows server
app.use("/images", express.static('images'));


app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use(cors());
app.use("/post", authroutes);

var url = "mongodb+srv://bidwaigr:bidwaigr123@cluster0.d6op1.mongodb.net/node_auth?retryWrites=true&w=majority";
app.listen(3000, async () => {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }).then(() =>
    console.log("Connected to DB")
  ).catch(
    () =>
      console.log("SOmeTHing Error While Connecting DB")
  );
});
