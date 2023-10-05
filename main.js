// imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;
// const URI = process.env.DB_URI;
const URI = "mongodb+srv://exhibit_a:1Nish2Andy3@cluster0.glwfnpi.mongodb.net/?retryWrites=true&w=majority";

const dbName = "YogaDB";
const studentCollection = "Students";

mongoose.connect(URI, {useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to the database'));

const testStu = {
  num: 123,
  name: "new name",
  email: "new email",
  sType: "yoga",
  phone: "123456",
  package: 12,
  wk: ["1","3"],
  colour: 11,
  startYr: 2011,
  startMth: 11,
  startDay: 11,
  classesNishCancelled: 0,
  birthday: "birthday stuff",
  studentImageFileName: "image file name",
}


// middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
})

app.use(express.static('uploads'));

// set template engine
app.set('view engine', 'ejs');

// rout prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
})