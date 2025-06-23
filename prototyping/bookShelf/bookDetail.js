let backIcon;
let menuIcon; 
let shareIcon; 

let iconImgs = [];
let iconNames = ["홈", "검색", "책 만들기", "나의 책장", "나의 프로필"];

let keyword = ["즐거운", "도전적인", "웃긴", "소방관"];
let coverImage; 

function preload() {
    backIcon = loadImage('../assets/back.png');
    menuIcon = loadImage('../assets/menu.png'); 
    shareIcon = loadImage('../assets/share.png'); 

    iconImgs.push(loadImage('../assets/footerIcons/home.png'));
    iconImgs.push(loadImage('../assets/footerIcons/search.png'));
    iconImgs.push(loadImage('../assets/footerIcons/plus.png'));
    iconImgs.push(loadImage('../assets/footerIcons/book.png'));
    iconImgs.push(loadImage('../assets/footerIcons/profile.png'));

    coverImage = loadImage('../assets/bookCover/cover2.png');
}

function setup() {
    createCanvas(402, 874);
    background(255);
    textFont('Pretendard Variable');

    header();

    bookCover();

    strokeWeight(1);
    stroke('rgba(51, 51, 51, 0.1)');
    line(50, 393, 50 + 300, 393);

    drawKeyword(keyword);

    Title("나는 소방관이 될 거예요!", 45, 451);
    author("엄마랑 하율이랑"); 
    image(shareIcon, 327, 454, shareIcon.width, shareIcon.height);

    strokeWeight(1);
    stroke('rgba(51, 51, 51, 0.1)');
    line(50, 529, 50 + 300, 529);

    subTitle("줄거리", 48, 549)

    contentText("하율이는 꿈 세상을 지키는 멋진 소방관이에요.\n잠에서 일어나보니 기침이 콜록콜록, 동물 친구들이\n사는 숲에서 연기는 모락모락, 어디선가 도움이 필요\n해요! 빨간 소방차가 삐뽀삐뽀 소리를 내며 하율이를\n기다리고 있어요. ...", 48, 592);

    strokeWeight(1);
    stroke('rgba(51, 51, 51, 0.1)');
    line(50, 716, 50 + 300, 716);
    navigation();
}

function draw() { 
    smallButton("책 읽기", 48, 734);
    smallButton("저장하기", 211, 734); 
}

function header() {
    image(backIcon, 24, 32, backIcon.width, backIcon.height);
    image(menuIcon, width - menuIcon.width - 24, 32, menuIcon.width, menuIcon.height);
}

function navigation() {
    // 그림자
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = -2;
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.06)';

    fill('rgba(255, 255, 255, 1)');
    noStroke();
    let boxWidth = width;
    let boxHeight = 76;
    let boxX = 0;
    let boxY = height - boxHeight;
    rect(boxX, boxY, boxWidth, boxHeight, 24, 24, 0, 0);

    drawingContext.shadowColor = 'rgba(0, 0, 0, 0)';

    navigationIcon(boxX, boxY);
}

function navigationIcon(boxX, boxY) {
    let iconX = boxX + 30;
    let iconY = boxY + 17;

    for (let i = 0; i < 5; i++) {
        image(iconImgs[i], iconX, iconY, iconImgs[i].width, iconImgs[i].height);

        createP(iconNames[i])
            .position(iconX + iconImgs[i].width / 2 + 1, iconY + iconImgs[i].height + 6)
            .style('font-family', 'Pretendard Variable')
            .style("font-weight", 500)
            .style("font-size", "10px")
            .style("color", "rgba(170, 170, 170, 1)")
            .style("margin", 0)
            .style("text-align", "center")
            .style("transform", "translateX(-50%)");

        iconX += 60 + iconImgs[i].width;
    }
}

function bookCover() {
    // 책 표지
    let boxWidth = 250;
    let boxHeight = 250;
    let boxX = 116;
    let boxY = 131;

    fill('rgba(217, 217, 217, 1)');
    noStroke();
    rect(boxX, boxY, boxWidth, boxHeight, 2.5, 8, 8, 2.5);

    image(coverImage, boxX, boxY, boxWidth, boxHeight);
}

function drawKeyword(array) {
    let x = 43;
    let y = 411;

    array.forEach((item, i) => {
        let btn = createButton(`${item}`);
        btn.position(x, y)
            .style("font-family", "Pretendard Variable")
            .style("font-weight", 700)
            .style("font-size", "10px")
            .style("color", "rgba(255, 249, 243, 1)")
            .style("background", "rgba(255, 176, 81, 1)")
            .style('border', '0px')
            .style('border-radius', '13px')
            .style('padding', '7px 10px');

        x += 8 + btn.elt.offsetWidth;
    });
}

function author(contents) {
    fill('rgba(170, 170, 170, 1)'); 
    textSize(16);
    text("지은이", 48, 490);
 
    fill('rgba(102, 102, 102, 1)');  
    text(contents, 100, 490);
}

function Title(contents, x, y) {
    fill('rgba(51, 51, 51, 1)');
    textSize(24);
    textAlign(LEFT, TOP);
    text(contents, x, y);
}

function subTitle(contents, x, y) {
    fill('rgba(51, 51, 51, 1)');
    textSize(20);
    textAlign(LEFT, TOP);
    text(contents, x, y);
}

function smallTitle(contents, x, y) {
    fill('rgba(153, 153, 153, 1)');
    textSize(12);
    textAlign(LEFT, TOP);
    text(contents, x, y);
}

function subtext(contents, x = 36, y = 230) {
    fill('rgba(153, 153, 153, 1)');
    textSize(14);
    textAlign(LEFT, TOP);
    text(contents, x, y);
}

function contentText(contents, x, y) {
    fill('rgba(102, 102, 102, 1)');
    textSize(15);
    textAlign(LEFT, TOP);
    text(contents, x, y);
}

function smallButton(contents, btnX, btnY) {
    let btnWidth = 147;
    let btnHeight = 43;
 
    let isHover =
        mouseX >= btnX && mouseX <= btnX + btnWidth &&
        mouseY >= btnY && mouseY <= btnY + btnHeight;

    // 버튼 배경 색상 결정
    if (isHover) {
        fill('rgba(244, 143, 23, 1)'); 
        cursor(HAND);  
    } else {
        fill('rgba(170, 170, 170, 1)'); 
        cursor(ARROW); 
    }

    noStroke();
    rect(btnX, btnY, btnWidth, btnHeight, 12);
 
    fill('#ffffff');
    textAlign(CENTER, CENTER);
    textSize(16);
    text(contents, btnX + btnWidth / 2, btnY + btnHeight / 2);
}
