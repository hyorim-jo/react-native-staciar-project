window.stories = [];
let speechRecognition = null;
const storyIllustrations = {};

let totalHeight = 0;
let canvas;

const GEMINI_API_KEY = "AIzaSyCdRCsNcDdeSGbWKWCifksW2a-AqiICLmw";

function preload() {
    const savedBookStory = JSON.parse(localStorage.getItem('bookData') || '{}');
    if (savedBookStory.stories) {
        window.stories = savedBookStory.stories;
    } 
}

function setup() {   
    // 캔버스 생성
    canvas = createCanvas(402, 5000);
    canvas.parent('canvas-container');

    textFont('Pretendard Variable');
    textAlign(LEFT, TOP);

    button("다음 이야기 만들기 →");

    select('#story-section').style('display', 'block');
    select('#speaking-section').style('display', 'none');
}

function draw() {
    background('rgba(255, 249, 243, 1)');

    drawStories();
    // 2번 실행하면 저장 버튼 생성
    if (window.stories.length > 2) {
        createSaveButton();
    }

    noLoop();
}

function getTotalStoryHeight() {
    const x = 24;
    let yPosition = 87;
    const maxWidth = 355;
    const lineHeight = 30;

    window.stories.forEach(story => {
        const parts = parseStory(story);

        parts.forEach(part => {
            if (part.type === 'text') {
                const sentences = part.content.split(/(?<=[.!?])\s+/);
                sentences.forEach(sentence => {
                    const lines = wrapText(sentence, maxWidth);
                    yPosition += lines.length * lineHeight + 43;
                });
            }
            else if (part.type === 'image') {
                yPosition += IMAGE_HEIGHT + IMAGE_MARGIN;
            }
        });
    });

    return yPosition + 88;
}

function parseStory(storyText) {
    const parts = [];
    const segments = storyText.split(/(\[삽화\]\s*([^\[]*))/);

    let tempDescription = null;

    segments.forEach(segment => {
        if (!segment.trim()) return;
        
        // [삽화] 태그 
        if (segment.startsWith('[삽화]')) {
            const description = segment.replace('[삽화]', '').trim();
            if (description) {
                parts.push({ type: 'image', description });
            } else { 
                tempDescription = { type: 'image', description: '' };
            }
        } 
        //  [삽화] 태그가 있었으나 설명이 없던 경우
        else if (tempDescription) {
            tempDescription.description = segment.trim();
            parts.push(tempDescription);
            tempDescription = null;
        } 
        // 일반 텍스트 
        else {
            parts.push({ type: 'text', content: segment });
        }
    });
 
    if (tempDescription) {
        parts.push(tempDescription);
    }

    return parts;
}

function drawStories() {
    const x = 24;
    let yPosition = 87;
    const maxWidth = 355; 
    console.log(totalHeight);

    window.stories.forEach(story => {
        const parts = parseStory(story);
        console.log("parts: ", parts);

        parts.forEach(part => {
            if (part.type === 'text') {
                // 문장 분할
                const sentences = part.content.split(/(?<=[.!?])\s+/);

                sentences.forEach(sentence => {
                    sentence.includes('!') ? highlightText() : storyText();

                    const lines = wrapText(sentence, maxWidth);
                    lines.forEach(line => {
                        text(line, x, yPosition);
                        yPosition += textLeading();
                    });
                    yPosition += 43; 
                    totalHeight = yPosition;
                });
            }
            else if (part.type === 'image') {
                // 삽화 그리기 
                const p5Img = storyIllustrations[part.description];
                if (p5Img) {
                    image(p5Img, x, yPosition, maxWidth, maxWidth);
                } else {
                    // 삽화 생성 실패 
                    fill('rgba(0, 0, 0, 0.1)');
                    noStroke();
                    rect(x, yPosition, 355, 204, 12);
                }
                yPosition += maxWidth;
                totalHeight = yPosition;
            }  
        });
    });

    if (totalHeight > height) {
    resizeCanvas(width, Math.max(874, totalHeight));
  } 
}

function storyText() {
    textFont('Gowun Batang');
    textSize(20);
    textStyle(NORMAL);
    fill(51);
}

function highlightText() {
    textFont('Gowun Batang');
    textSize(24);
    textStyle(BOLD);
    fill(51);
}

function wrapText(str, maxWidth) {
    const words = str.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = textWidth(currentLine + ' ' + word);
        width < maxWidth
            ? currentLine += ' ' + word
            : (lines.push(currentLine), currentLine = word);
    }
    lines.push(currentLine);
    return lines;
}

function button(contents) {
    let btnWidth = 354;
    let btnHeight = 64;
    let btnX = (width - btnWidth) / 2;
    let btnY = 787;

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
        // 스토리 숨기고
        select('#story-section').hide();

        // 로티 이미지 보여주기
        select('#speaking-section').show();
        initLottie();

        // AI 대화
        AIConversation();
    });
}

function createSaveButton() {
    console.log("저장 버튼 생성");
    // 중복 생성 방지
    if (select('#save-btn')) return;

    let saveBtn = createButton('<img src="../assets/save.png" alt="저장하기" style="width:76px; height:76px; vertical-align:middle;">');
    saveBtn.style('background', 'none');
    saveBtn.style('border', 'none');
    saveBtn.style('cursor', 'pointer');
    saveBtn.position(width - 31 - 76, 688);

    saveBtn.mousePressed(() => {
        const bookTitle = JSON.parse(localStorage.getItem('bookData')).bookTitle || '동화책';  

        console.log(bookTitle);

        const book = {
            bookTitle: bookTitle,
            stories: window.stories 
        };
        saveJSON(book, `${bookTitle}.json`);
        window.location.href = "./bookShelf.html";
    });
}

async function generateIllustration(description) {
    // 삽화 생성
    console.log(description);
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `
                        1. Create a bright, cheerful, child-friendly illustration for a fairy tale targeting 4-7 year olds. Depict: ${description}
                            
                        2. 반드시 이미지를 생성합니다. ` }]
                    }],
                    generationConfig: {
                        "responseModalities": [
                            TEXT, IMAGE]
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API 요청 실패 (${response.status}): ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log(data);

        // 이미지 데이터 추출
        const candidate = data.candidates[0];
        const imagePart = candidate.content.parts.find(part => part.inlineData);
        const imageData = imagePart.inlineData.data;
        const base64Data = `data:image/png;base64,${imageData}`;

        // p5.Image 객체 생성
        return await createP5ImageFromBase64(base64Data);
    } catch (error) {
        console.error('이미지 생성 실패:', error);
        return null;
    }
}

function createP5ImageFromBase64(base64) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const p5Img = createImage(img.width, img.height);
            p5Img.drawingContext.drawImage(img, 0, 0);
            resolve(p5Img);
        };
        img.src = base64;
    });
}
