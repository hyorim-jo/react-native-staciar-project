let bgImage;
let icon;

function preload() {
    // 배경 이미지 
    bgImage = loadImage('./assets/home.png');

    // 앱 아이콘 이미지 
    icon = loadImage(`./assets/icon.png`);
}

function setup() {
    createCanvas(402, 874);
}

function draw() {
    image(bgImage, 0, 0, width, height);

    image(icon, 174, 368, 56, 56);
}

function mousePressed() {
    // 아이콘 클릭 감지 
    if (mouseX > 174 &&
        mouseX < 174 + 56 &&
        mouseY > 368 &&
        mouseY < 368 + 56) {
        window.location.href = './onboding.html';
        return;
    }
} 
