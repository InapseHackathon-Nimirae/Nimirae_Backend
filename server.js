var express = require('express')
var bodyParser = require('body-parser')
var passport = require('passport')
var AppFacebookStrategy = require('passport-facebook-token')
var multer = require('multer')
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

app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, ()=>{
    console.log('Server Running At '+PORT+' Port!')
})

require('./routes/vision')(app, multer, RandomString, google_vision_cli, request, cheerio)
require('./routes/auth')(app, db, RandomString, passport, AppFacebookStrategy)