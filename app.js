const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session');
const path = require('path')

const authRouter = require('./routes/authRouter')
const adminRouter = require('./routes/adminRouter')
const companyRouter = require('./routes/companyRouter')
const technicianRouter = require('./routes/technicianRouter')

const cookieParser = require('cookie-parser');
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const ejs = require('ejs');
const fs = require('fs')
const https = require('https')
const app = express();
const helmet = require('helmet');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser());

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'js')));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
 
app.use("/", authRouter)
app.use("/admin", adminRouter)
app.use("/company", companyRouter)
app.use("/technician", technicianRouter)

app.use((req, res, next) => {
  res.status(404).render('layouts/not-found')
});

app.use(helmet());

const dbConnect = () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = mongoose.connect(process.env.MONGODB_URL)
    console.log('Database connected successful!')
  } catch(error) {
    console.log('Database connected error.')
  }
}

dbConnect()

if (process.env.MODE == "DEV") {
  const options = {
    key: fs.readFileSync("./keys/localhost-key.pem"),
    cert: fs.readFileSync("./keys/localhost.pem"),
  };
  
  https.createServer(options, app).listen(5500, () => {
    console.log('Server listening on port ' + 5500);
  });
} else if (process.env.MODE == "PROD") {
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on port 3000')
  })
}