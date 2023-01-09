let baseHue = 0.0;
let baseBri = 0.0;
let treeColor;
let leafColor;
let bug_num;
let leaf_num;
let growCow, growMush;
let growTree;

function getBaseHueValue() {
  io().on("screen", function (rotation_msg) {
    // console.log(rotation_msg); // 可用來觀看是否收到Server來的訊息
    baseHue = rotation_msg.x;
  });  
  return  baseHue;
}
  
function reload(){
  io().on("screen", function (reload_button) {
    // console.log(rotation_msg); // 可用來觀看是否收到Server來的訊息
   if(reload_button.x == 1){
    location.reload();
    console.log("重新整理");
   }
  });  
}

function getMultiValue() {
  io().on("screen", function (multi_msg) {
    growCow = multi_msg.Temp;
    growMush = multi_msg.Humidity;
    console.log(multi_msg);
  });
  return growCow, growMush;
}

async function setup() {
  createCanvas(displayWidth, displayHeight);
  background(30);

  colorMode(HSB);

  getBaseHueValue();
  getMultiValue();
  reload();
 // img = loadImage('images/fox01.jpg');

  // draw landscape
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {

      let noiseY = y + noise(x * 0.003, y * 0.004, -2000) * 300.0;

      let landHue = baseHue + noise(x * 0.005, y * 0.01, 1000) * 60;
      let landSat = noise(x * 0.001, y * 0.002, 1600) * 30 + 30;
      let landBri = baseBri + noise(x * 0.003, y * 0.002, -2000) * 80 + 20;
      // let landBri = baseBri;

      if (landHue > 360)
        landHue -= 360;        
        
      let treeAreaNoise = noise(x * 0.006, y * 0.008, 8000);

      if (treeAreaNoise < 0.35) {
        if (random() < 0.006) {
          let treeSizeT = 1.0 - treeAreaNoise / 0.4 + random(0.0, 0.3);


          // noStroke();
          // noFill();
          // stroke(0, 0, 100, 1.0);
          // noFill();
          // fill(0, 0, random(0, 10));
          stroke(landHue, random(80, 100), landBri);
          fill(0, 0, random(80, 100));

          treeColor = color(landHue, random(80, 100), landBri);
          leafColor = color(landHue, random(30, 60), 100);
          drawTree(x, noiseY, 180 + random(-10, 10), int(40 * treeSizeT * random(0.6, 2.0)), int(20 * treeSizeT * random(0.6, 1.2)));
        }
      }
      let circleAreaNoise = noise(x * 0.006, y * 0.008, 8000);
      if (circleAreaNoise < 0.6) {
        if (random() < 0.01) {        
          drawcircle_left(x + random(-100, -30), noiseY + random(-30, -10), random(5, 10));
        }
      }

      let cowArea = random(0, 1);
      if (cowArea < 0.5) {
        if (random() < 0.003) {         
          // drawCow (x+random(-90,-50), noiseY-75);
          drawrightCow (x+random(-70,-50), noiseY-75);
          
        }
        if (random() < 0.003) {         
          drawCow (x+random(-70,-50), noiseY-75);
          // drawrightCow (x+random(-90,-50), noiseY-75);
        }
      }
      
      let grassLandNoise = noise(x * 0.01, y * 0.02, 6000);

      if (grassLandNoise < 0.8) {
        let grassLandT = 1.0 - grassLandNoise / 0.8 + random(0.0, 0.3);

        let grassHue = landHue + random(-80, 80);
        let grassSat = random(60, 100);
        let grassBri = random(80, 100);

        stroke(0, 0, 100, 0.3);
        fill(grassHue, grassSat, grassBri);
        // stroke(grassHue, grassSat, grassBri);
        noFill();
        let grassDir = 180 + lerp(-30, 30, noise(x * 0.1, y * 0.1, 3000));
        drawGrass(x, noiseY, grassDir, 20 * grassLandT, 6 * grassLandT, color(grassHue, grassSat, grassBri));
      }


      stroke(landHue, landSat, landBri, 0.6);
      fill(landHue, landSat, random(10, 30));
      circle(x, noiseY, 10);
    }
    await sleep(100);
  }
}

function draw() {
  //image(img, 0, height / 2, img.width / 2, img.height / 2);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawTree(_x, _y, _startDir, _growNodes, _nodeWidth) {
  let nowDir = _startDir;
  let posX = _x;
  let posY = _y;

  for (let i = 0; i < _growNodes; i++) {
    let t = 1.0 - i / _growNodes;
    posX += sin(radians(nowDir)) * _nodeWidth;
    posY += cos(radians(nowDir)) * _nodeWidth;

    push();

    translate(posX, posY);
    rotate(radians(-nowDir));
    scale(t);

    rect(-0.5 * _nodeWidth, -0.5 * _nodeWidth, _nodeWidth, _nodeWidth);

    if(t<0.15){//原來0.15
      stroke('#fbff8a');
      fill('#fbff8a');
      ellipse(posX,posY,50,100);//bird bug
    }

    if (t < 0.6) {//原來0.6
      let leafCount = 3;
      
      for (let leafInedx = 0; leafInedx < leafCount; leafInedx++) {
        let xPos = random(-12, 12) * _nodeWidth * t;
        let yPos = random(-6, 6) * _nodeWidth * t;

        stroke('white');
        fill(leafColor);
        circle(xPos, yPos, _nodeWidth * random(0.8, 2.0));           
        
      }
    }

    pop();

    if (t < 0.55) { //原0.6
      if (random() < 0.2) {
        let splitDir = random(-60.0, 60.0);

        let remainNodes = _growNodes - i;
        drawTree(posX, posY, nowDir - splitDir, remainNodes + random(0, 3), _nodeWidth * t);
      }
    }


    nowDir += noise(posX * 0.001, posY * 0.006, 3000) * 10 - 5;
  }
}

function drawGrass(_x, _y, _startDir, _growNodes, _nodeWidth, _grassColor) {
  let nowDir = _startDir;
  let posX = _x;
  let posY = _y;

  let grassHue = hue(_grassColor);
  let grassSat = saturation(_grassColor);
  let grassBri = brightness(_grassColor);

  for (let i = 0; i < _growNodes; i++) {
    let t = 1.0 - i / _growNodes;
    posX += sin(radians(nowDir)) * _nodeWidth;
    posY += cos(radians(nowDir)) * _nodeWidth;

    push();

    translate(posX, posY);
    rotate(radians(-nowDir));
    scale(t);

    let newBri = lerp(0.3, 1.2, 1.0 - t) * grassBri;
    fill(grassHue, grassSat, newBri);
    rect(-0.5 * _nodeWidth, -0.5 * _nodeWidth, _nodeWidth, _nodeWidth);

    pop();
    nowDir += noise(posX * 0.001, posY * 0.006, 3000) * 10 - 5;
  }
}

function drawcircle_left(_x, _y, _cirNodes) {

  let x = _x;
  let y = _y;
  //number of circles
  let circles = _cirNodes;

  if(growMush >=60){
    //for each circle
    for (let total = 0; total < circles; total = total + 1) {
      //compute circle diameter based on reverse index (circles-total) (or max-current)
      let diameter = (circles - total) * 2;
      noStroke();    
      fill(total * 20);
      //render the circle
      ellipse(x - 10 + noise(4,20,100), y -10 + total * 5, diameter, diameter);
      // ellipse(x - total * 5, y + total * 5, diameter, diameter);
      // ellipse(x - total * 7, y + total * 5, diameter, diameter);  
    }
  }
}

function drawCow(x,y){
  if(growCow > 20){
    push()
    //身體
    translate(x,y)
    fill(255)
    noStroke()
    rect(0,0,50,25,5)
    randomColor1(random(0,4))
    rect(5,0,12,15,5)
    rect(25,10,10,10,5)
    rect(45,5,5,10,5)
    // 後腳
    fill(255)
    push()
      translate(3,20)
      push()
        rotate(sin(frameCount/35))
        rect(0,0,5,20,5)
      pop()
      push()
        translate(5,0)
        rotate(sin(frameCount/20+PI))
        rect(0,0,5,20,5)
      pop()
    pop()
    // 前腳
    push()
      translate(40,20)
      push()
        rotate(sin(frameCount/35))
        rect(0,0,5,20,5)
      pop()
      push()
        translate(5,0)
        rotate(sin(frameCount/20+PI))
        rect(0,0,5,20,5)
      pop()
    pop()
    //頭部
    translate(-22,-5)
    rect(0,0,20,25,5)
    randomColor1(random(0,4))
    rect(0,15,20,10,5)
    fill(0,60)
    ellipse(6,20,6)
    ellipse(14,20,6)
    fill(0)
    ellipse(5,8,3)
    ellipse(15,8,3)
    randomColor1(random(0,4))//耳朵顏色
    rect(0,-8,3,10,10)
    rect(16,-8,3,10,10)
  pop()
  
  }
}

function drawrightCow(x,y){
  if(growCow > 20){
    push()
    //身體
    translate(x,y)
    fill(255)
    noStroke()
    rect(0,0,50,25,5)
    randomColor1(random(0,4))
    rect(5,0,12,15,5)
    rect(25,10,10,10,5)
    rect(45,5,5,10,5)
    // 後腳
    fill(255)
    push()
      translate(3,20)
      push()
        rotate(sin(frameCount/35))
        rect(0,0,5,20,5)
      pop()
      push()
        translate(5,0)
        rotate(sin(frameCount/20+PI))
        rect(0,0,5,20,5)
      pop()
    pop()
    // 前腳
    push()
      translate(40,20)
      push()
        rotate(sin(frameCount/35))
        rect(0,0,5,20,5)
      pop()
      push()
        translate(5,0)
        rotate(sin(frameCount/20+PI))
        rect(0,0,5,20,5)
      pop()
    pop()
    //頭部
    translate(40,0)
    rect(0,0,20,25,5)
    randomColor1(random(0,4))//鼻子顏色
    rect(0,15,20,10,5)
    fill(255)//鼻孔顏色
    ellipse(6,20,6)
    ellipse(14,20,6)
    fill(0)
    ellipse(5,8,3)
    ellipse(15,8,3)
    randomColor1(random(0,4))//耳朵顏色
    rect(0,-8,3,10,10)
    rect(16,-8,3,10,10)
  pop()
  }
}

function randomColor1(_x){
  let mode_i =floor(_x);
  // console.log(mode_i);
  if(mode_i = 0){
    fill("#7595BF");
  }else if (mode_i = 1){
    fill(random(0,200),random(0,200),random(0,200));
    // fill("#F2C84B");
  }else if (mode_i = 2){
    fill("#F2CB9B");
  }else if (mode_i = 3){
    fill("#F28749");
  }else{
    fill(random(255),random(255),random(255));
  }
}