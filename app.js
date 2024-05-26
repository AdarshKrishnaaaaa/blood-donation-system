var bodyParser = require('body-parser');
const express = require("express"); 
const cors = require('cors');
const cookieParser = require("cookie-parser");

const userRoute = require('./routes/user');
const apiRoute = require('./routes/api');
const admRoute = require('./routes/admin');

const app = express(); 
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended : true })); // to support URL-encoded bodies

app.use(express.static('assets'));
app.set('view engine', 'pug');

app.use('/user', userRoute);
app.use('/api', apiRoute);
app.use('/admin', admRoute);

app.listen(PORT, () => {
    console.log('Nisha - Blood Camp webapp running at http://localhost:3000/');
});