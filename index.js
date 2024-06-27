const express = require("express");
const app = express();
const PORT = 3030;
const routesCars = require("./routes/cars")
const cors = require("cors");
const DB = require("./database/DB");

// connect to the db
DB.connect("mongodb://localhost:27017")
    .then(()=>{
        console.log("You succesfully connected to the DB");
    })
    .catch((errors)=>{
        console.log("Error happened with connection to the db", errors);
    })

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/cars", routesCars);

app.listen(PORT, (err)=>{
    if(err) return console.log("Error Exist");
    console.log("SERVER IS WORKING ON "+ PORT);
})