const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

//Load  env vars
dotenv.config({ path: "./config/config.env" });

//Load Models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: true,
  // useUnifiedTopology: true,
});

//Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    console.log("Bootcamp and Courses Created".green.inverse);
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    console.log("Database Clear Successfully".red.inverse);
  } catch (error) {
    console.log(error);
  }
};

//Run -i = importData
//Run -d = deleteData
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

// we run this file by typing
// node seeder -i
//OR
// node seeder -d
