const mongoose = require('mongoose');
require('dotenv').config();

// Enable strict query behavior (optional)
mongoose.set('strictQuery', true);

// Construct the connection string dynamically
const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(connectionString); // Check the constructed connection string

const connect = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log("Connect success");
    } catch (err) {
        console.log("Connect fail");
        console.error(err);
    }
};

module.exports = { connect };
