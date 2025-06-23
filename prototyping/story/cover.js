let userData;
let selectedCategories;

let bookData = {};
let generatedContent = {};
let generatedCover = null;

const GEMINI_API_KEY = "AIzaSyCdRCsNcDdeSGbWKWCifksW2a-AqiICLmw";

function preload() { 
    // 로컬 스토리지에서 데이터 불러오기
    userData = JSON.parse(localStorage.getItem('userData') || '{}');
    selectedCategories = JSON.parse(localStorage.getItem('selectedCategories') || '[]'); 
}

async function setup() {
    createCanvas(402, 874);
    textFont('Pretendard Variable');
    button("다음 이야기 만들기 →");

    await generateStoryIntro();
    generatedCover = await generateStoryCover();

    redraw();
}

function draw() {
    background('#ffffff');
    cover();
    noLoop();
}

function cover() {
    title('입력한 내용으로<br><span style="color:#f48f17">첫 이야기</span>가 만들어졌어요!');

    smallTitle("생성된 표지 이미지", 36, 200);
    coverImg();
    drawLine(36, 430, 330);

    smallTitle("이야기 키워드", 36, 456);
    keyword(generatedContent.storyKeywords);

    smallTitle("책 제목", 36, 498);
    subTitle(generatedContent.bookTitle, 36, 518);
    drawLine(36, 565, 330);

    smallTitle("첫 이야기", 36, 585);
    contentText(generatedContent.firstStory, 36, 605);
    drawLine(36, 687, 330);

    subtext("첫 이야기가 맘에 드시나요?<br>이대로 <b>같이 동화책을 만들어 볼까요?</b>", 36, 713);
}

function title(contents) {
    createP(contents)
        .position(36, 88)
        .style('font-family', 'Pretendard Variable')
        .style("font-weight", 700)
        .style("font-size", "32px")
        .style("color", "rgba(51, 51, 51, 1)")
        .style("margin", 0);
}

function subTitle(contents, x, y) {
    createP(contents)
        .position(x, y)
        .style('font-family', 'Pretendard Variable')
        .style("font-weight", 600)
        .style("font-size", "24px")
        .style("color", "rgba(51, 51, 51, 1)")
        .style("margin", 0);
}

function smallTitle(contents, x, y) {
    createP(contents)
        .position(x, y)
        .style('font-family', 'Pretendard Variable')
        .style("font-weight", 600)
        .style("font-size", "12px")
        .style("color", "rgba(153, 153, 153, 1)")
        .style("margin", 0);
}

function contentText(contents, x, y) {
    createP(contents)
        .position(x, y)
        .style('font-family', 'Pretendard Variable')
        .style("font-weight", 400)
        .style("font-size", "15px")
        .style("color", "rgba(102, 102, 102, 1)")
        .style("margin", 0)
        .style("line-height", "21px")
        // 줄바꿈
        .style("width", "330px")
        .style("word-break", "break-word");
}

function subtext(contents, x = 36, y = 230) {
    createP(contents)
        .position(x, y)
        .style('font-family', 'Pretendard Variable')
        .style("font-weight", 400)
        .style("font-size", "14px")
        .style("color", "rgba(102, 102, 102, 1)")
        .style("margin", 0)
        .style("line-height", "18px");
}

function coverImg() {
    let boxWidth = 330;
    let boxHeight = 190;
    let boxX = (width - boxWidth) / 2;
    let boxY = 222;
    let cornerRadius = 12;

    if (generatedCover != null) {
        // 생성된 이미지 
        console.log("이미지 생성 성공", generatedCover);
        push();
        drawingContext.beginPath();
        drawingContext.moveTo(boxX + cornerRadius, boxY);
        drawingContext.arcTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + boxHeight, cornerRadius);
        drawingContext.arcTo(boxX + boxWidth, boxY + boxHeight, boxX, boxY + boxHeight, cornerRadius);
        drawingContext.arcTo(boxX, boxY + boxHeight, boxX, boxY, cornerRadius);
        drawingContext.arcTo(boxX, boxY, boxX + boxWidth, boxY, cornerRadius);
        drawingContext.closePath();
        drawingContext.clip();
        image(generatedCover, boxX, boxY, boxWidth, boxHeight);
        pop();
    } else {
        // 이미지 생성 실패
        console.log("생성 된 이미지 없음");
        fill('rgba(0, 0, 0, 0.1)');
        noStroke();
        rect(boxX, boxY, boxWidth, boxHeight, 12);
    }
}

function keyword(array) {
    let x = 110;
    let y = 450;

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

function drawLine(x, y, width) {
    strokeWeight(1);
    stroke('rgba(51, 51, 51, 0.1)');
    line(x, y, x + width, y);
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
        // 생성 된 동화 내용 로컬에 저장 
        saveAsJsonFile();
        window.location.href = "./story.html";
    });
}

function saveAsJsonFile() {
    const bookData = {
        mainCharacter: userData.name,
        bookTitle: generatedContent.bookTitle,
        storyKeywords: generatedContent.storyKeywords,
        generatedIntro: generatedContent.generatedIntro,
        stories: [ generatedContent.firstStory ] 
    };
    localStorage.setItem('bookData', JSON.stringify(bookData));
}

async function generateStoryIntro() {
    // 동화 생성 프롬프트
    const prompt = `
    아이 이름: ${userData.name || '주인공'}
    동화 분위기: ${selectedCategories.filter(c => c.category === '분위기').map(c => c.label).join(', ')}
    주인공 캐릭터: ${selectedCategories.filter(c => c.category === '캐릭터').map(c => c.label).join(', ')}
    
    위 정보를 바탕으로 4-7세 아이를 위한 동화책을 만들어주세요.
    출력 형식은 JSON으로 다음과 같아야 합니다:
    {
      "bookTitle": "동화책 제목",
      "storyKeywords": ["키워드1", "키워드2"] (3-4개),
      "firstStory": "동화의 첫 부분 (1-2문장)",
      "generatedIntro": "동화의 도입부 (2-4문장)"
    }
    
    반드시 JSON 형식으로만 응답해주세요.
  `;

    try {
        // Gemini API 호출
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000
                    }
                })
            }
        );

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;

        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}') + 1;
        const jsonContent = content.substring(jsonStart, jsonEnd);

        generatedContent = JSON.parse(jsonContent);
    } catch (error) {
        console.error('API 호출 실패:', error);
        generatedContent = {
            bookTitle: "다시 시도해주세요",
            storyKeywords: ["Keyword1", "Keyword2"],
            firstStory: "firstStory",
            generatedIntro: "generatedIntro"
        };
    }
}

async function generateStoryCover() {
    // 동화 표지 생성 
    // Gemini API 이미지 생성 모델 
    // https://ai.google.dev/gemini-api/docs/image-generation?hl=ko#javascript

    const prompt = `
    bookTitle: ${generatedContent.bookTitle}
    firstStory: ${generatedContent.firstStory}
    storyKeywords: ${generatedContent.storyKeywords}
    
    Create a bright, cheerful, child-friendly book cover illustration for a fairy tale targeting 4-7 year olds.
  `;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
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
        const imageBase64 = `data:image/png;base64,${imageData}`;

        // p5.Image 객체 생성
        return await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const p5Img = createImage(img.width, img.height);
                p5Img.drawingContext.drawImage(img, 0, 0);
                resolve(p5Img);
            };
            img.src = imageBase64;
        });
    } catch (error) {
        console.error('이미지 생성 실패:', error);
        return null;
    }
}