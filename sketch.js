let handpose;
let video;
let predictions = [];
let objects = [];
let score = 0;
let level = 1;
let numObjects = 10;
let baseSize = 30;
let gameComplete = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', results => {
    predictions = results;
  });

  video.hide();
  startLevel(level);
}

function modelReady() {
  console.log("Model ready!");
}

function startLevel(level) {
  objects = [];
  let size = baseSize - (level - 1) * 5;
  for (let i = 0; i < numObjects; i++) {
    objects.push({
      x: random(width),
      y: random(height),
      size: size,
      color: [0, 255, 0],
      hit: false
    });
  }
}

function draw() {
  if (!gameComplete) {
    image(video, 0, 0, width, height);
    drawKeypoints();

    let allHit = true;
    for (let obj of objects) {
      fill(obj.color);
      noStroke();
      ellipse(obj.x, obj.y, obj.size);

      for (let i = 0; i < predictions.length; i++) {
        const prediction = predictions[i];
        for (let j = 0; j < prediction.landmarks.length; j++) {
          const keypoint = prediction.landmarks[j];
          let d = dist(keypoint[0], keypoint[1], obj.x, obj.y);
          if (d < obj.size / 2 + 10 && !obj.hit) {
            obj.color = [255, 0, 0];
            obj.hit = true;
            score++;
          }
        }
      }

      if (!obj.hit) {
        allHit = false;
      }
    }

    if (allHit) {
      level++;
      if (level <= 6) {
        startLevel(level);
      } else {
        gameComplete = true;
      }
    }

    fill(255,255,0);
    textSize(32);
    textStyle(BOLD);
    text('Score: ' + score, 10, 40);
    text('Level: ' + level, 10, 80);
    
  } else {
    background(0);
    fill(255);
    textSize(64);
    textAlign(CENTER, CENTER);
    text('Game Voltooid!', width / 2, height / 2);
  }
}

function drawKeypoints() {
  for (let i = 0; i < predictions.length; i++) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j++) {
      const keypoint = prediction.landmarks[j];
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}
