const express = require('express');
const router = express.Router();
const ImageModel = require('../models/ImageModel');
const exec = require('child_process').exec;
const fs = require('fs');
const multer = require('multer');
const path = require('path');


let filename = 'image-' + Date.now() + '.jpg';
//이미지 저장되는 위치 설정
let uploadDir = path.join(__dirname, '../uploads/');

let storage = multer.diskStorage({
    destination: function (req, file, callback) { //이미지가 저장되는 도착지 지정
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) { // image-날짜.jpg(png) 저장
        callback(null, filename);
    }
});

//multer setting
let upload = multer({
    storage: storage,
    limits: {   // 파일 제한: 20개, 1G
        files: 20,
        filesize: 5 * 1024 * 1024
    },
    dest: uploadDir
});

router.get('/', (req, res) => {
    ImageModel.find((err, image) => {
        res.render('learn/learnForm', {image: image});
    });
});

// DB에 저장
router.post('/', upload.single('thumbnail'), (req, res) => {
    // console.log(req.file);
    let image = new ImageModel({
        thumbnail: (req.file) ? req.file.filename : "",
        answer: req.body.answer,
        user_answer: req.body.user_answer,
        // username : req.user.username //글 작성시 username에 접근
    });
    image.save((err) => {
        res.redirect('/learn/albums');
    });
});

// GET publicAlbums page
router.get('/albums', (req, res) => {
    ImageModel.find((err, images) => { //첫번째 인자는 err, 두번째는 받을 변수명
        res.render('learn/publicAlbums',
            {images: images} // DB에서 받은 images 를 imgaes 변수명으로 내보냄
        );
    });
});

let result = {
    before: "", // 처음 보여주는 문장
    hint1: "",  // 힌트더보기 한번 클릭 시
    hint2: "",  // 힌트더보기 두번 클릭 시
    hint3: "",  // 힌트더보기 세번 클릭 시
    fullStr: "" // 풀 문장
}
// ajax request part and deep learning
router.post('/api/photo', (req, res) => {

    // if (done == true){
    // console.log(req.files); // undefined?? ajax라서
    let dst = path.join(uploadDir, filename); // IMAGE_FILE 경로
    let ws = fs.createWriteStream(dst, {encoding: 'binary'});
    req.pipe(ws);
    ws.on("finish", () => {
        console.log('이미지 전송 완료 --> 텍스트로 변환');
        console.log('경로: ' + dst);
        exec("sh generate.sh " + dst, (err, stdout, stderr) => {

            //Print stdout/stderr to console
            console.log('@@@@@@@@ 예측 시작.. @@@@@@@@\n');
            // console.log('@# error? ' + stderr);
            console.log('!!러닝된 결과: ' + stdout);
            // console.log(typeof(stdout));
            let words = stdout.trim().split(' ');
            let str = ["", "", "", "", ""];
            let randomNum = [];
            for (let i = 0; i < 4; i++) {
                randomNum[i] = Math.floor(Math.random() * words.length);
                for (let j = 0; j < i; j++) {
                    if (randomNum[i] === randomNum[j]) {
                        i--;
                    }
                }
            }
            console.log('first randomNum', randomNum);

            function checkRandom(n) {
                for (let i = 0; i < randomNum.length; i++) {
                    if (n === randomNum[i]) {
                        return true;
                    }
                }
                return false;
            }

            let cnt = 0;
            while (true) {
                if (cnt === 5) {
                    break;
                }
                if (cnt === 0) {
                    for (let i = 0; i < words.length; i++) {
                        if (checkRandom(i)) {
                            str[cnt] = str[cnt] + "{" +
                                words[i].toString().length + "글자}" + ' ';
                        } else {
                            str[cnt] = str[cnt] + words[i] + ' ';
                        }
                    }
                    cnt = cnt + 1;
                } else if (cnt === 1) {
                    randomNum.pop();
                    for (let i = 0; i < words.length; i++) {
                        if (checkRandom(i)) {
                            str[cnt] = str[cnt] + "{" +
                                words[i].toString().length + "글자}" + ' ';
                        } else {
                            str[cnt] = str[cnt] + words[i] + ' ';
                        }
                    }
                    cnt = cnt + 1;
                } else if (cnt === 2) {
                    randomNum.pop();
                    for (let i = 0; i < words.length; i++) {
                        if (checkRandom(i)) {
                            str[cnt] = str[cnt] + "{" +
                                words[i].toString().length + "글자}" + ' ';
                        } else {
                            str[cnt] = str[cnt] + words[i] + ' ';
                        }
                    }
                    cnt = cnt + 1;
                } else if (cnt === 3) {
                    randomNum.pop();
                    for (let i = 0; i < words.length; i++) {
                        if (checkRandom(i)) {
                            str[cnt] = str[cnt] + "{" +
                                words[i].toString().length + "글자}" + ' ';
                        } else {
                            str[cnt] = str[cnt] + words[i] + ' ';
                        }
                    }
                    cnt = cnt + 1;
                } else if (cnt === 4) {
                    for (let i = 0; i < words.length; i++) {
                        str[cnt] = str[cnt] + words[i] + ' ';
                    }
                    cnt = cnt + 1;
                }
            }
            console.log('final@@', randomNum);
            // 전송 시 result 에 str[] 저장
            result = {
                before: str[0], // 처음 보여주는 문장
                hint1: str[1],  // 힌트더보기 한번 클릭 시
                hint2: str[2],  // 힌트더보기 두번 클릭 시
                hint3: str[3],  // 힌트더보기 세번 클릭 시
                fullStr: str[4] // 풀 문장
            };
            console.log(result);
            //res.render('cmd', { title: 'ML-Result', data: stdout });
            console.log('######## 완료!! ########');
            res.send(result);  // wow 로 넘어간다.
        });
    });
});

// 힌트 더보기
router.get('/api/hint', (req, res) => {
    res.send(result);
});

// 전체보기
router.get('/api/all', (req, res) => {
    res.send(result);
});

module.exports = router;