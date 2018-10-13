module.exports = auth

function auth(app, db, RandomString, passport, AppFacebookStrategy) {

    passport.serializeUser((user, done)=>{
        console.log("serialize")
        done(null, user);
    });

    passport.deserializeUser((user, done)=>{
        console.log("deserialize")
        done(null, user);
    });

    passport.use(new AppFacebookStrategy({
        clientID : '2002484689811189',
        clientSecret : '5fb87a325205dc830b24307f7d64a69b'
    }, (accessToken, refreshToken, profile, done)=>{
        console.log('======== APP PROFILE ========')
        console.log(profile)
        done(null, profile)
    }));

    app.get('/login', passport.authenticate('facebook-token'), (req, res)=>{
        console.log("USER_TOKEN ==== " + req.param('access_token'));
        if(req.user){
            console.log(req.user)
            db.User.findOne({
                usertoken : req.param('access_token')
            }, (err, data)=>{
                if(err) throw err
                else if(data){
                    res.send(401, data)
                }
                else{
                    var user = new db.User({
                        username : req.user.displayName,
                        usertoken : req.param('access_token')
                    })
                    user.save((err)=>{
                        if(err) throw err
                        else{
                            res.send(200, user)
                        }
                    })
                }
            })
        }
        else if(!req.user){
            res.send(401, "Can't find User On Facebook. It May Be Unusable.");
        }
    });

}