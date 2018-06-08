# english-edu

### 개요
- 이미지로 배우는 새로운 방식의 영어교육 플랫폼
- 이미지는 하나의 상황이라고 할 수 있고, 그 상황을 영어로 설명할 수 있는 능력 배양
- Deep Learning(im2txt model - Show and Tell), Web Server(nodejs)

---
### 사용 방법
- 이미지를 추가하고 전송을 누르면 딥러닝으로 도출된 정답이 나온다.
- 힌트를 보면서 힌트에 맞는 영어 단어를 입력해 나가면서 문장을 완성해 나가면 된다.
#### Deep Learning

```
1. Repo clone - git clone
2. Install java 8
3. Install miniconda3 for virtual environment
4. Install bazel
5. Install pip, python version 3.5
6. conda create -n [name] python=3.5
7. source activate [name] in order for virtual environment
7. Install tensorflow 1.0
8. npm install
9. npm start
8. 혹시 안된다면 new_checkpoint_saver.py를 실행하고 다시 run
```
혹시 잘 안되시면 Issues 란에 글 남겨주세요.
If it doesn't work well, please create an issue for the project.

## 참고
https://github.com/tensorflow/models
https://github.com/KranthiGV/Pretrained-Show-and-Tell-model
