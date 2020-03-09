//importing modules
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();

const route = require('./routes/route');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ContactList');

// on connection
mongoose.connection.on('connected', ()=>{
    console.log('Connected to database MongoDB @ 27017');
});

// in case of error we want to know
mongoose.connection.on('error', (err)=>{
    if (err) {
        console.log('Error in Database connection: ' + err);
    }
});

// port no
const port = 3000;

//adding middleware = cors
app.use(cors());

//adding body - parser parse JSON data
app.use(bodyparser.json());

//static files
app.use(express.static(path.join(__dirname, 'Public')));

//routes
app.use('/api', route);

//testing server
app.get('/', (req, res) => {
    res.send('foobar');
});
app.listen(port, () => {
    console.log('Server started at port:', +port);
});

