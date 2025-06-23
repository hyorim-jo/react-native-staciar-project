let objImgs = [];
let objText = [];
let currentIndex = 0;

function preload() {
  objImgs.push(loadImage('./assets/objects/object1.png'));
  objImgs.push(loadImage('./assets/objects/object2.png'));
  objImgs.push(loadImage('./assets/objects/object3.png'));

  objText.push("아이의 사진, 이름과 키워드 등록만으로\n재밌는 동화책이 만들어져요.");
  objText.push("AI와 대화하며 동화의 내용을\n추가하고, 확장시킬 수 있어요.");
  objText.push("결말을 본 뒤 완성된 동화책을\n저장하거나 공유할 수 있어요.");
}

function setup() {
  createCanvas(402, 874);
  textFont('Pretendard Variable');
  
  title('<span style="color:#f48f17">나의 주인공</span>' + '<span style="color:#333">,<br>우리 아이로<br>동화책을 만들어요!</span>');
  button("시작하기");
}

function draw() {
  background('#ffffff');
  swipe();
  noLoop();
}

function mousePressed() {
  if (mouseX > boxX && mouseX < boxX + boxWidth &&
    mouseY > boxY && mouseY < boxY + boxHeight) {
    currentIndex = (currentIndex + 1) % objImgs.length;
  }
  redraw();
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

let boxWidth = 302;
let boxHeight = 262;
let boxX;
let boxY;

function swipe() {
  // 그림자
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 4;
  drawingContext.shadowBlur = 12;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.08)';

  // 스와이프 배경
  fill('#FFF9F3');
  stroke('rgba(255, 176, 81, 0.75)');
  boxX = (width - boxWidth) / 2;
  boxY = (height - boxHeight) / 2;
  rect(boxX, boxY, boxWidth, boxHeight, 16);

  drawingContext.shadowColor = 'rgba(0, 0, 0, 0)'

  // 카드 이미지
  let img = objImgs[currentIndex];
  let imgX = (width - img.width) / 2;
  let imgY = boxY + 45;
  image(img, imgX, imgY, img.width, img.height);

  // 카드 텍스트
  fill('#666');
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text(objText[currentIndex], imgX, boxY + 184);

  swipeDot(boxX, boxY, boxWidth, boxHeight);
}

function swipeDot(boxX, boxY, boxWidth, boxHeight) {
  let dotX = (boxX + boxWidth / 2) - 12 - 20;
  let dotY = boxY + boxHeight + 33 + 10;

  for (let i = 0; i < 3; i++) {
    if (i === currentIndex) {
      fill('#F48F17'); // 현재 선택된 점
    } else {
      fill('rgba(170, 170, 170, 1)'); // 나머지 점
    }
    circle(dotX, dotY, 10);
    dotX += 10 + 12;
  }
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

  btn.mouseOut(function() {
    btn.style('background-color', 'rgba(217, 217, 217, 1)');
  });

  btn.mousePressed(function () {
    window.location.href = "./pages/join.html";
  });
}