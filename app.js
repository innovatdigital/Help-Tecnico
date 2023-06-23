const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session');
const path = require('path')
const main = require('./routes/main')
const checkout = require('./routes/checkoutRouter')
const login = require('./routes/loginRouter')
const platform = require('./routes/platformRouter')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config()
const ejs = require('ejs');
const fs = require('fs')
const https = require('https')
const app = express();
const helmet = require('helmet');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser());

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, "js")));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
 
app.use("/", main)
app.use("/login", login)
app.use("/checkout", checkout)
app.use("/platform", platform)

app.use((req, res, next) => {
  res.status(404).render('layouts/notFound')
});

app.use(helmet());

const dbConnect = () => {
  try{
    mongoose.set("strictQuery", false);
    const conn = mongoose.connect(process.env.MONGODB_URL)
    console.log('Database connected successful!')
  }catch(error){
    console.log('Database connected error.')
  }
}

dbConnect()

// Dev server
const options = {
  key: fs.readFileSync("./keys/localhost-key.pem"),
  cert: fs.readFileSync("./keys/localhost.pem"),
};

https.createServer(options, app).listen(5500, () => {
  console.log('Server listening on port ' + 5500);
});

// Production server

// app.listen(3000, () => {
//   console.log('Server listening on port 3000')
// })