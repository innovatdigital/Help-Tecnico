const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const mercadopago = require('mercadopago');
const main = require('./routes/main')
const checkout = require('./routes/checkoutRouter')
const dotenv = require('dotenv').config()
const login = require('./routes/loginRouter')
const platform = require('./routes/platformRouter')
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const fs = require('fs')
const jwt = require('jsonwebtoken');
const https = require('https')
const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser());

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, "js")));
 
app.use("/", main)
app.use("/login", login)
app.use("/checkout", checkout)
app.use("/platform", platform)

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

// const options = {
//   key: fs.readFileSync("localhost-key.pem"),
//   cert: fs.readFileSync("localhost.pem"),
// };

// https.createServer(options, app).listen(5500, () => {
//   console.log('Server listening on port ' + 5500);
// });

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})