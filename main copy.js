// imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 4000;
// const URI = process.env.DB_URI;
const URI = "mongodb+srv://exhibit_a:1Nish2Andy3@cluster0.glwfnpi.mongodb.net/?retryWrites=true&w=majority";

const dbName = "YogaDB";
const studentCollection = "Students";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db(dbName);
const students = db.collection(studentCollection);

const testCount = async (students) => {
  const estimate = await students.estimatedDocumentCount();
  console.log(`Estimated number of documents in the students collection: ${estimate}`);
}

const testFind = async () => {
  const findQuery = { name: { $eq: "Bhavani" } };

  try {
    const student = await students.findOne(findQuery);
    if (student === null) {
      console.log("Couldn't find any.\n");
    } else {
      console.log(`Found one:\n${JSON.stringify(student)}\n`);
    }
  } catch (err) {
    console.error(`Something went wrong trying to find the documents: ${err}\n`);
  }
}

const testFindMany = async () => {
  // Query for students that have a colour = 11

  const query = { colour: { $eq: 11 } };
  const options = {
    // Sort returned documents in ascending order by name (A->Z)
    sort: { name: 1 },
    // Include only the `title` and `imdb` fields in each returned document
    projection: { _id: 0, name: 1, startYr: 1, sType: 1},
  };
  // Execute query 
  const cursor = students.find(query, options);
  // Print a message if no documents were found
  if ((await students.countDocuments(query)) === 0) {
    console.log("No documents found!");
  }
  // Print returned documents
  for await (const doc of cursor) {
    console.dir(doc);
  }
}

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
  image: "image file name",
}

const testInsert = async () => {

  try {
    console.log(`About to insert`);
    await students.insertOne(testStu);
    console.log(`After attempt to insert`);
  } catch (err) {
    console.log(`Something went wrong: ${err}\n`);
  }
}


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db(dbName).command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // just a test line to know what to open

    // client.once('open', (err) => console.log('error'));

    // COUNT STUDENTS 
    await testCount(students);

    // FIND ONE
    // await testFind();

    // FIND MANY
    // await testFindMany();

    // TEST INSERT
    // await testInsert();
  

  } finally {
    // Ensures that the client will close when you finish/error
    console.log('in finally');

    // TEST NOT CLOSING TO SEE IF IT FIXES ERROR
    // await client.close();
  }
}
run()
.then(console.log('before finall'))
.catch(console.dir);


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

// set template engine
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
})

// rout prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
})