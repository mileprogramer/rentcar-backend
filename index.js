const express = require("express");
const app = express();
const routesCars = require("./routes/cars")
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/cars", routesCars);

app.listen(3030, (err)=>{
    if(err) return console.log("POSTOJI GRESKA");
    console.log("SERVER JE POKRENUT");
})