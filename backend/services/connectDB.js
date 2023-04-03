const mongoose = require("mongoose");

const connectDataBase = () => {
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(
            (data) => {
                console.log(`mongodb connected with server :: ${data.connection.host}`)
            }
        )
        .catch(err =>
            console.log("mongodb connection error ", err)
        )
}

module.exports = {
    connectDataBase
}