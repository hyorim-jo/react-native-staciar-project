let data;
let allButtons = [];

function preload() {
  data = loadJSON("../DB/setting.json");
}

function setup() {
  createCanvas(402, 874);
  textFont('Pretendard Variable');
  button("등록하기");
}

function draw() {
  background('#ffffff');
  setting();
  noLoop();
}

function setting() {
  title('<span style="color:#f48f17">주인공</span>은<br>평소에 어떤 동화를<br>좋아하나요?');
  subtext("동화의 분위기와 캐릭터를 설정할 수 있어요.<br>부족한 부분은 <b>직접 이야기</b>하며 만들어 볼까요?");

  createCategoryButtons(data.mood, 36, 344, "분위기");
  createCategoryButtons(data.character, 36, 563, "캐릭터");
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
    .style("color", "rgba(153, 153, 153, 1)")
    .style("margin", 0);
}

function createCategoryButtons(array, startX, startY, title) {
  let x = startX;
  let y = startY;

  createP(title).position(x, y - 38)
    .style("font-family", "Pretendard Variable")
    .style("font-weight", 600)
    .style("font-size", "16px").style("margin", 0);

  array.forEach((item, i) => {
    let btn = createButton(`${item.label} ${item.emoji}`);
    btn.position(x, y)
      .style("font-family", "Pretendard Variable")
      .style("font-weight", 600)
      .style("font-size", "16px")
      .style("color", "rgba(153, 153, 153, 1)")
      .style('border', '0px')
      .style('border-radius', '24px')
      .style('padding', '7px 12px');

    btn.checked = false;

    btn.mousePressed(() => {
      btn.checked = !btn.checked;
      if (btn.checked) {
        btn.style('background-color', 'rgba(253, 231, 209, 1)');
        btn.style('color', 'rgba(244, 134, 2, 1)');
        btn.style('border', '1.4px solid rgba(253, 161, 51, 1)');

      } else {
        btn.style('background-color', '');
        btn.style('color', 'rgba(153, 153, 153, 1)');
        btn.style('border', '0px');
      }
      console.log(`${title} 선택됨: ${item.label}, 체크 상태: ${btn.checked}`);
    });

    // 버튼 정보 저장
    allButtons.push({
      button: btn,
      label: item.label,
      category: title
    });

    x += 12 + btn.elt.offsetWidth;
    if ((i + 1) % 3 == 0) {
      x = startX;
      y += 13 + btn.elt.offsetHeight;
    }
  });
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
    // 선택된 버튼들 로컬에 저장(json)
    let selected = allButtons.filter(b => b.button.checked)
      .map(b => ({ category: b.category, label: b.label }));

    localStorage.setItem('selectedCategories', JSON.stringify(selected));
    console.log('선택된 카테고리 저장:', selected);

    // 페이지 이동
    window.location.href = "./cover.html";
  });
}