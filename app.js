const express = require("express");
const { connectToDB } = require("./config/db");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/error");
require("dotenv").config();

// connect to db
connectToDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

app.use(helmet());
app.use(cors());

// routes
app.use("/api/course/review", require("./routes/review"));
app.use("/api/course", require("./routes/course"));
app.use("/api/course-category", require("./routes/courseCategory"));
app.use("/api/user", require("./routes/user"));
app.use("/api/course/section", require("./routes/courseSection"));
app.use("/api/course/section/lesson", require("./routes/lesson"));
app.use("/api/course/enrollment", require("./routes/enrollment"));
app.use("/api/course/quizz", require("./routes/quizz"));
app.use("/api/course/quizz/question", require("./routes/question"));
app.use("/api/course/quizz/quizAttemp", require("./routes/quizAttemp"));
app.use("/api/order", require("./routes/order"));


// error handling

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on PORT ${PORT}`);
});