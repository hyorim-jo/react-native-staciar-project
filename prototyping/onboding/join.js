let backIcon;

let profileImg;
let cameraIcon;

let fileInput;
let nameInput;

function preload() {
  backIcon = loadImage('../assets/back.png');
  profileImg = loadImage('../assets/profile.png');
  cameraIcon = loadImage('../assets/camera.png');
}

function setup() {
  createCanvas(402, 874);
  textFont('Pretendard Variable');

  // 파일 업로드 버튼(숨김)
  fileInput = createFileInput(handleFile);
  fileInput.position(-1000, -1000);
  fileInput.style('display', 'none');

  textinput();
  button("등록하기");
}

function draw() {
  background('#ffffff');
  drawJoin();
  noLoop();
}

function mousePressed() {
  // 프로필 이미지 업로드
  if (mouseX > camX && mouseX < camX + cameraIcon.width &&
    mouseY > camY && mouseY < camY + cameraIcon.height) {
    fileInput.elt.click();
  }
}

function handleFile(file) {
  if (file.type === 'image') {
    profileImg = loadImage(file.data, function (img) {
      redraw();
    });
  }
}

function drawJoin() {
  header();

  title('<span style="color:#f48f17">주인공</span>의<br>사진과 이름을<br>등록해주세요.');
  subtext("동화 속 주인공이 되는 데 필요해요.<br>나중에 수정할 수 있어요.");

  imgUpload();
}

function header() {
  image(backIcon, 24, 32, backIcon.width, backIcon.height);
}

function title(contents) {
  createP(contents)
    .position(36, 88)
    .style('font-family', 'Pretendard Variable')
    .style("font-weight", 600)
    .style("font-size", "32px")
    .style("color", "rgba(51, 51, 51, 1)")
    .style("margin", 0);
}

function subtext(contents) {
  createP(contents)
    .position(36, 230)
    .style('font-family', 'Pretendard Variable')
    .style("font-weight", 400)
    .style("font-size", "14px")
    .style('color', 'rgba(153, 153, 153, 1)')
    .style("margin", 0);
}

let camX;
let camY;

function imgUpload() {
  // 프로필 이미지
  let imgX = width / 2;
  let imgY = 358 + 100;

  // 원형 마스크 적용
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(imgX, imgY, 100, 0, Math.PI * 2);
  drawingContext.clip();

  // 이미지 그리기
  imageMode(CENTER);
  image(profileImg, imgX, imgY, 201, 201);

  // 클리핑 해제
  drawingContext.restore();

  // 카메라 아이콘
  camX = imgX + 100 - 43;
  camY = imgY + 100 - 43;
  imageMode(CORNER);
  image(cameraIcon, camX, camY, 43, 43);
}

function textinput() {
  nameInput = createInput('');
  nameInput.position(50, 607);
  nameInput.size(295, 40);

  nameInput.style('border', 'none')
    .style('border-bottom', '1px solid rgba(218, 218, 218, 1)')
    .style('outline', 'none')
    .style('background', 'none');

  // placeholder
  nameInput.attribute('placeholder', '이름');
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      input::placeholder {
        color: rgba(170, 170, 170, 1);
        font-family: Pretendard Variable;
        font-size: 20px;
      }
    </style>
  `);

  // 입력했을 때
  nameInput.style('font-family', 'Pretendard Variable')
    .style("font-weight", 600)
    .style('font-size', '20px')
    .style('color', 'rgba(51, 51, 51, 1)')
    .style('padding', '0 0 10px 10px');

  drawX();
}

function drawX() {
  strokeWeight(1);
  stroke('rgba(170, 170, 170, 1)');

  let x1 = 325;
  let y1 = 622;
  let size = 12;
  line(x1, y1, x1 + size, y1 + size);
  line(x1 + size, y1, x1, y1 + size);
}

function button(contents) {
  let btnWidth = 354;
  let btnHeight = 64;
  let btnX = (width - btnWidth) / 2;
  let btnY = height - (24 + btnHeight);

  let btn = createButton(contents);
  btn.position(btnX, btnY);
  btn.size(btnWidth, btnHeight);
  btn.style('background-color', 'rgba(217, 217, 217, 1)');
  btn.style('color', 'white');
  btn.style('border', 'none');
  btn.style('border-radius', '12px');
  btn.style('font-family', 'Pretendard Variable');
  btn.style('font-size', '20px');
  btn.style('font-weight', '600');
  btn.style('cursor', 'pointer');

  btn.mouseOver(function () {
    btn.style('background-color', '#F48F17');
  });

  btn.mouseOut(function () {
    btn.style('background-color', 'rgba(217, 217, 217, 1)');
  });

  btn.mousePressed(function () {
    // 이미지를 base64로 변환
    let canvas = createGraphics(profileImg.width, profileImg.height);
    canvas.image(profileImg, 0, 0);
    let imgData = canvas.elt.toDataURL('image/png');

    // JSON으로 저장
    let userData = {
      name: nameInput.value(),
      profileImg: imgData
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log("회원 정보 저장 완료:", userData);

    // 페이지 이동
    window.location.href = "./setting.html";
  });
}