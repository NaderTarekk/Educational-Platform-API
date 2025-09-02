const mongoose = require("mongoose");

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");
    } catch {
        console.log("Connection failed to MongoDB");
    }
}

module.exports = { connectToDB };