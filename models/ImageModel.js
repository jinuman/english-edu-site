const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

// Create field
const ImageSchema = new Schema({
    thumbnail: String,     // 이미지 파일명
    answer: String,        // 딥러닝으로 생성된 답안
    user_answer: String,   // 유저가 입력한 답안
    created_at: {          // 작성일
        type: Date,
        default: Date.now()
    },
    username: String       // 작성자
});

// virtual 변수는 호출되면 실행하는 함수
// Object create 의 get, set과 비슷함
// set : 변수의 값을 바꾸거나 셋팅하면 호출
// get : getDate 변수를 호출하는 순간 날짜 월일이 찍힌다.
ImageSchema.virtual('getDate').get(function () {
    let date = new Date(this.created_at);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 0부터 시작하므로 +1 해준다.
        day: date.getDate()
    };
});

// model: Collection name (이름 : images), field: primary key, startAt: 1부터 시작
// primary key will increment by 1 for each new record.
ImageSchema.plugin(autoIncrement.plugin, {
    model: 'images',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('images', ImageSchema);