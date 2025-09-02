const { Course } = require("./models/Course");
const { courses } = require("./data");
const { connectToDB } = require("./config/db");
require("dotenv").config();

// connection to db
connectToDB();

// import Course (seeding database: import many data at once)
const importCourses = async () => {
    try {
        await Course.insertMany(courses); // store many data in db at once
        console.log("Courses imported");
    } catch (error) {
        console.log(error);
        process.exit(); // disconnect seeder.js file to db
    }
}

// remove Course
const removeCourses = async () => {
    try {
        await Course.deleteMany(); // delete all data from Course
        console.log("Courses removed");
    } catch (error) {
        console.log(error);
        process.exit(); // disconnect seeder.js file to db
    }
}

if (process.argv[2] === "-import") { // write this command to run the code: node seeder -import => process.argv[2] means that array number 2 is -import see the commad you will see the -import in the array number 2
    importCourses();
} else if (process.argv[2] === "-remove") {
    removeCourses();
}