const app = require("./app");
const dotenv = require('dotenv');
const { connectDataBase } = require("./services/connectDB");

dotenv.config({path : 'backend/config/config.env'});

//connect to database
connectDataBase();

app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening at port :: ${process.env.PORT}`);
});

