const app = require("./app");
const dotenv = require('dotenv');
const { connectDataBase } = require("./services/connectDB");

dotenv.config({path : 'backend/config/config.env'});

// Handling uncaught exceptions
process.on("uncaughtException", (err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to uncaught exceptions");
    process.exit(1);
})

//connect to database
connectDataBase();

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening at port :: ${process.env.PORT}`);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejections");
    server.close(()=>{
        process.exit(1);
    })
})
