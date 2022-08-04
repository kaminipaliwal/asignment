const express = require("express");
const app = express();
const port = 3001;

const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1/employeesDetails';

const api = require('./routes/api');

const bodyParser = require('body-parser');
var busboy = require('connect-busboy');
app.use(busboy());

var cors = require('cors');
app.use(cors());
app.options("*", cors());
app.use(express.json())

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology:true});
const con = mongoose.connection

con.on('open', () => {
    console.log("db connected....");
})
app.get("/",(req,res)=> {
    res.send("Hello World");
})

app.use('/api',api)

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`);
})