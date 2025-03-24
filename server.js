const express = require("express");
const {connectDb} = require('./src/config/db')

const app = express();

app.use(express.json());

connectDb()

app.listen(4000, () => console.log("server started on 4000 port"));