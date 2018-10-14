module.exports = vision

function vision(app, db, multer, RandomString, google_vision_cli, request, cheerio, moment){

    var storage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, './img')
        },
        filename: (req, file, cb)=>{
            cb(null, RandomString.generate(10)+'.'+file.mimetype.split('/')[1])
        }
    })

    var upload = multer({ storage: storage })

    app.post('/upload', upload.single('file'), (req, res)=>{
        console.log(req.file)

    app.post('/upload', upload.single('file'), (req, res)=> {
        console.log(req.file)
        google_vision_cli.textDetection(req.file.path).then(results => {
                console.log(results);
                var total_kcal = 0
                var total_price = 0
                var ocr_text = results[0].fullTextAnnotation.text
                var ocr_array = ocr_text.split("\n")
                console.log(ocr_array)

                var re = /^[1-9],[\b\d]*/;

                for (var i = 0; i < ocr_array.length; i++) {
                    if (re.test(ocr_array[i])) {
                        var price_text = ocr_array[i].replace(",", "")
                        var price_text = price_text.replace(" ", "")

                        price_text = Number(price_text)
                        if (total_price < price_text) {
                            total_price = price_text
                        }
                    }
                }

                console.log("Total : " + total_price)

                for (var i = 0; i < ocr_array.length; i++) {
                    var url = encodeURI('http://www.dietshin.com/calorie/calorie_search.asp?keyword=' + ocr_array[i])

                    var response = request('GET', url);
                    var body = response.getBody('utf8')

                    const $ = cheerio.load(body)

                    kcal_text = $('#container > div.contents.calorieDc > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()

                    if (kcal_text != "") {
                        console.log(kcal_text)
                        total_kcal = total_kcal + Number(kcal_text.split(" ")[0])
                    }
                }
                console.log(total_kcal)
                var time = moment().format('YYYY-MM-DD HH:mm:ss')
                account_db = new db.Account({
                    title: "얼그레이 TL",
                    price: 5100,
                    date: time,
                    usertoken: req.body.access_token
                })
                kcal_db = new db.Kcal({
                    kcal: total_kcal,
                    date: time,
                    usertoken: req.body.access_token
                })

                kcal_db.save((err) => {
                    if (err) throw err
                    else {
                        account_db.save((err) => {
                            if (err) throw err
                            else {
                                send_data = {username: req.body.username, usertoken: req.body.access_token}
                                db.Account.find({
                                    usertoken: req.body.access_token
                                }, (err, data) => {
                                    if (err) throw err
                                    else if (data[0]) {
                                        send_data.account = data
                                    }
                                    else {
                                        send_data.account = []
                                    }
                                    db.Kcal.find({
                                        usertoken: req.body.access_token
                                    }, (err, datas) => {
                                        if (err) throw err
                                        else if (datas[0]) {
                                            send_data.kcal = datas
                                        }
                                        else {
                                            send_data.kcal = []
                                        }
                                        res.status(200).send(send_data)
                                    })
                                })

                            }
                        })
                    }
                })
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    })

    app.get('/call', (req, res)=>{
        var send_data = {usertoken : req.param("access_token")}
        db.Account.find({
            usertoken : req.param("access_token")
        }, (err, data)=>{
            if(err) throw err
            else if(data[0]){
                send_data.account = data
            }
            else{
                send_data.account = []
            }
            db.Kcal.find({
                usertoken : req.param("access_token")
            }, (err, datas)=>{
                if(err) throw err
                else if(datas[0]){
                    send_data.kcal = datas
                }
                else {
                    send_data.kcal = []
                }
                res.status(200).send(send_data)
            })
        })
    })

    app.post('/dummy', (req, res)=>{
        var body = req.body
        var time = moment().format('YYYY-MM-DD HH:mm:ss')

        account_db = new db.Account({
            title : body.title,
            price : body.price,
            date : time,
            usertoken : body.usertoken
        })
        kcal_db= new db.Kcal({
            kcal : body.kcal,
            date : time,
            usertoken : body.usertoken
        })

        kcal_db.save((err)=>{
            if(err) throw err
            else{
                account_db.save((err)=>{
                    if(err) throw err
                    else{
                        res.status(200).send("asdf")
                    }
                })
            }
        })

    })

}