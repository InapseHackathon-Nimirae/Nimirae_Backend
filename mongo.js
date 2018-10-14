var mongoose = require('mongoose')

var db = mongoose.connect("mongodb://localhost/inapse", (err)=>{
    if(err){
        console.log('DB Error!')
        throw err
    }
    else {
        console.log("DB Connect Success!")
    }
})

var AccountSchema = new mongoose.Schema({
    title : {
        type : String
    },
    date : {
        type : String
    },
    price : {
        type : String
    },
    usertoken : {
        type : String
    }
})

var KcalSchema = new mongoose.Schema({
    date : {
        type : String
    },
    kcal : {
        type : String
    },
    usertoken : {
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
var Account = mongoose.model('account', AccountSchema)

exports.User = User
exports.Kcal = Kcal
exports.Account = Account
exports.db = db