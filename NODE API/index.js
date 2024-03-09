require("dotenv").config();
 const path = require("path")
 

require("./db");
const route = require('./v1/routes/index')
const cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static(path.join(__dirname, 'uploads')))

const port = process.env.PORT;

// app.use( require('./token/varifyToken'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cors());
app.listen(port, console.log("Server is running at port ", port));

app.use("/", route);