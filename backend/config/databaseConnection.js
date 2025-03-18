const mongoose = require('mongoose');

async function dbConn(){
    try{
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to DB succesfuly");
    } catch(err){
        console.log(`DB connection err: ${err}`);
    }
};

module.exports = dbConn;