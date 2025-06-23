let backIcon;
let menuIcon;

let iconImgs = [];
let iconNames = ["홈", "검색", "책 만들기", "나의 책장", "나의 프로필"];

let coverImgs = [];
let books = [
    {
        title: "별의별책",
        x: 56, y: 184,
        img: null, // coverImgs[0]로 나중에 할당
        link: "bookDetail.html?book=star"
    },
    {
        title: "나는 소방관이 될 거<br>예요",
        x: 232, y: 184,
        img: null, // coverImgs[1]
        link: "bookDetail.html?book=firefighter"
    },
    {
        title: "방구쟁이 이하율",
        x: 56, y: 402,
        img: null, // coverImgs[2]
        link: "bookDetail.html?book=bangoo"
    }
];

function preload() {
    backIcon = loadImage('../assets/back.png');
    menuIcon = loadImage('../assets/menu.png');

    iconImgs.push(loadImage('../assets/footerIcons/home.png'));
    iconImgs.push(loadImage('../assets/footerIcons/search.png'));
    iconImgs.push(loadImage('../assets/footerIcons/plus.png'));
    iconImgs.push(loadImage('../assets/footerIcons/book.png'));
    iconImgs.push(loadImage('../assets/footerIcons/profile.png'));

    coverImgs.push(loadImage('../assets/bookCover/cover1.png'));
    coverImgs.push(loadImage('../assets/bookCover/cover2.png'));
    coverImgs.push(loadImage('../assets/bookCover/cover3.png'));

    books[0].img = coverImgs[0];
    books[1].img = coverImgs[1];
    books[2].img = coverImgs[2];
}

function setup() {
    createCanvas(402, 874);
    background(255);
    textFont('Pretendard Variable');
}

function draw() {
    header();
    Title("나의 책장");

    books.forEach(book => bookCover(book));
    navigation();

    noLoop();
}

function header() {
    image(backIcon, 24, 32, backIcon.width, backIcon.height);
    image(menuIcon, width - menuIcon.width - 24, 32, menuIcon.width, menuIcon.height);
}

function Title(contents, x = 36, y = 122) {
    createP(contents)
        .position(x, y)
        .style('font-family', 'Pretendard Variable')
        .style("font-weight", 600)
        .style("font-size", "20px")
        .style("color", "rgba(51, 51, 51, 1)")
        .style("margin", 0);
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

function bookCover(book) {
    // 책 표지
    fill('rgba(244, 143, 23, 1)');
    noStroke();
    let boxWidth = 110;
    let boxHeight = 110;
    rect(book.x, book.y, boxWidth, boxHeight, 2.5, 8, 8, 2.5);

    if (book.img) {
        image(book.img, book.x, book.y, boxWidth, boxHeight);
    }

    createP(book.title)
        .position(book.x, book.y + boxHeight + 12)
        .style('font-family', 'Pretendard Variable')
        .style("font-weight", 600)
        .style("font-size", "14px")
        .style("color", "rgba(51, 51, 51, 1)")
        .style("margin", 0);
}

function mousePressed() { 
    let boxWidth = 110, boxHeight = 110;
    for (let book of books) {
        if (
            mouseX >= book.x && mouseX <= book.x + boxWidth &&
            mouseY >= book.y && mouseY <= book.y + boxHeight
        ) {
            window.location.href = book.link;
            return;
        }
    }
}
