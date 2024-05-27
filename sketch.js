let handpose;
let video;
let predictions = [];
let objects = [];
let score = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', results => {
    predictions = results;
  });

  video.hide();

  for (let i = 0; i < 10; i++) {
    objects.push({
      x: random(width),
      y: random(height),
      size: 30,
      color: [0, 255, 0],
      hit: false
    });
  }
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();

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
  }

  
  fill(255);
  textSize(32);
  text('Score: ' + score, 10, 40);
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
