const express = require('express');
const router = express.Router();
const exec = require('child_process').exec;
const fs = require('fs');
const multer = require('multer');
const path = require('path');

let filename = 1;
//이미지 저장되는 위치 설정
let uploadDir = path.join(__dirname, '../uploads/');

//multer setting
let upload = multer({
    dest: uploadDir
});

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/api/photo', (req, res) => {

    // if (done == true){
    // console.log(req.files); // undefined?? ajax라서
    let dst = path.join(uploadDir, filename++ + ".jpg"); // IMAGE_FILE 경로
    let ws = fs.createWriteStream(dst, {encoding: 'binary'});
    req.pipe(ws);
    ws.on("finish", () => {
        console.log('이미지 전송 완료 --> 텍스트로 변환');
        console.log('경로: ' + dst);
        exec("sh generate.sh " + dst, (err, stdout, stderr) => {

            //Print stdout/stderr to console
            console.log('@@@@@@@@ Predicting Start .. @@@@@@@@\n');
            console.log('@# error? ' + stderr);
            console.log('!! result : ' + stdout);

            //Simple response to user whenever localhost:3000 is accessed
            //res.render('cmd', { title: 'ML-Result', data: stdout });
            console.log('######## Complete!! ########');
            res.send(stdout);  // data 로 넘어간다.
        });
    });
    // }

});

module.exports = router;