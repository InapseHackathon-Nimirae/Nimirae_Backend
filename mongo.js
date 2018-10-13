var mongoose = require('mongoose')

var db = mongoose.connect("mongodb://localhost/13th_APPJAM", (err)=>{
    if(err){
        console.log('DB Error!')
        throw err
    }
    else {
        console.log("DB Connect Success!")
    }
})

var KcalSchema = new mongoose.Schema({
    title : {
        type : String
    },
    date : {
        type : String
    },
    kcal : {
        type : String
    }
})

var UserSchema = new mongoose.Schema({
    username : {
        type : String
    },
    usertoken : {
        type : String
    }
})

var User = mongoose.model('user',UserSchema)
var Kcal = mongoose.model('kcal', KcalSchema)

exports.User = User
exports.Kcal = Kcal
exports.db = db