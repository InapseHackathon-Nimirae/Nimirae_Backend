var express = require('express')
var bodyParser = require('body-parser')
var passport = require('passport')
var AppFacebookStrategy = require('passport-facebook-token')
var multer = require('multer')
var moment = require('moment')
var morgan = require('morgan')
var request = require('sync-request')
var cheerio = require('cheerio')
var RandomString = require('randomstring')
var google_vision = require('@google-cloud/vision')
const google_vision_cli = new google_vision.ImageAnnotatorClient();
var app = express()
var db = require('./mongo')
var PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
    extended : false
}))

app.use(morgan('dev'))
app.use(passport.initialize());
app.use(passport.session());
app.use("/static", express.static('static'))

app.listen(PORT, ()=>{
    console.log('Server Running At '+PORT+' Port!')
})

require('./routes/vision')(app, db, multer, RandomString, google_vision_cli, request, cheerio, moment)
require('./routes/auth')(app, db, RandomString, passport, AppFacebookStrategy)