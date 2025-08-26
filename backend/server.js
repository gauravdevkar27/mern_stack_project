const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./routes/auth.routes'); 
const todo = require('./routes/ToDo.routes');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

//api routes should come before static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve static files
app.use('/api', auth);
app.use('/api/todo', todo);

// Database connection
mongoose.connect(process.env.DB_URL).then((result) => {
    console.log("DB Connected Successfully");
}).catch(err => {
    console.log(err);
})
// Start server
app.listen(PORT, () => {
    console.log(`Server started at port : ${PORT}`);
})