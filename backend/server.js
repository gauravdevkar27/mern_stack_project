const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./routes/auth.routes'); 
const todo = require('./routes/ToDo.routes');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', auth);
app.use('/api/todo', todo);
mongoose.connect(process.env.DB_URL).then((result) => {
    console.log("DB Connected Successfully");
}).catch(err => {
    console.log(err);
})

app.listen(PORT, () => {
    console.log(`Server started at port : ${PORT}`);
})