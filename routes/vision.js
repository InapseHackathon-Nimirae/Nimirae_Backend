module.exports = vision

function vision(app, multer, RandomString, google_vision_cli, request, cheerio){

    var storage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, './img')
        },
        filename: (req, file, cb)=>{
            cb(null, RandomString.generate(10)+'.'+file.mimetype.split('/')[1])
        }
    })

    var upload = multer({ storage: storage })

    app.post('/vision/img', upload.single('file'), (req, res)=>{
        google_vision_cli.textDetection(req.file.path)
            .then(results => {
                console.log(results);
                // var kcal_array = []
                // var ocr_text = results[0].fullTextAnnotation.text
                // var ocr_array = ocr_text.split("\n")
                // console.log(results)
                // results[0].textAnnotations.forEach((result, i) => {
                //     console.log(i + " " +result.description);
                // })
                //
                // for(var i=0; i<ocr_array.length; i++){
                //     var url = encodeURI('http://www.dietshin.com/calorie/calorie_search.asp?keyword='+ocr_array[i])
                //
                //     var response = request('GET', url);
                //     var body = response.getBody('utf8')
                //
                //     const $ = cheerio.load(body)
                //
                //     kcal_text = $('#container > div.contents.calorieDc > table > tbody > tr:nth-child(1) > td:nth-child(2)').text()
                //
                //     if(kcal_text != ""){
                //         console.log(kcal_text)
                //         console.log(kcal_text.split(" ")[0])
                //         kcal_array.push({'name':ocr_array[i], 'kcal':kcal_text.split(" ")[0]})
                //     }
                // }
                // console.log(kcal_array)
                // res.status(200).send({text:kcal_array})
            })
            .catch(err => {
                console.error('ERROR:', err);
            });

    })

}