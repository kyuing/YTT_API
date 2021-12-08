// npm i --save nodemon express mongoose morgan dotenv path fs axios request-promise request body-parser handlebars vercel python-shell
//https://dev.to/andrewbaisden/how-to-deploy-a-node-express-app-to-vercel-2aa
//https://stackoverflow.com/questions/56199111/visual-studio-code-cmd-error-cannot-be-loaded-because-running-scripts-is-disabl
const express = require("express"),
  mongoose = require("mongoose"),
  dotenv = require("dotenv"),
  bodyParser = require("body-parser"),
  logger = require("morgan");

// const {spawn} = require('child_process');

var app = express();
var port = process.env.PORT || 5500;

// Middlewares
dotenv.config();
app.use(logger('tiny'));   // app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.json())
app.use(require("./routes"));

app.listen(port, function (err) {
  // console.log("Listening on port: " + port);
  console.log(`Listening on  ${port} `);
});


//https://mongoosejs.com/docs/documents.html
const dbURI = process.env.DB_URL;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("connected to db"))
  .catch((err) => console.log(err));
