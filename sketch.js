let video;
let poseNet;
let poses = [];

let leftHandX = 0;
let rightHandX = 0;

let ball;
let score = 0;
let questionSet = [
  { q: "VR 是什麼的縮寫？", a: "Virtual Reality" },
  { q: "AR 是什麼的縮寫？", a: "Augmented Reality" },
  { q: "MOOCs 是什麼？", a: "Massive Open Online Courses" }
];
let currentQuestion;
let gameState = "intro"; // intro, playing, question
let answerInput;

function setup() {
  console.log("ml5:", ml5);
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", gotPoses);

  ball = new Ball();
  currentQuestion = random(questionSet);

  answerInput = createInput("");
  answerInput.position(width / 2 - 100, height / 2);
  answerInput.size(200);
  answerInput.hide();
  answerInput.input(() => {
    if (answerInput.value().toLowerCase() === currentQuestion.a.toLowerCase()) {
      score += 5;
      answerInput.hide();
      currentQuestion = random(questionSet);
      gameState = "playing";
      ball.reset();
    }
  });
}

function modelReady() {
  console.log("PoseNet ready!");
}

function gotPoses(results) {
  poses = results;

  if (poses.length > 0) {
    let pose = poses[0].pose;

    if (pose.leftWrist.confidence > 0.2) {
      leftHandX = pose.leftWrist.x;
    }
    if (pose.rightWrist.confidence > 0.2) {
      rightHandX = pose.rightWrist.x;
    }
  }
}

function draw() {
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  if (gameState === "intro") {
    fill(0, 150);
    rect(0, 0, width, height);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("教育科技知識球\n請用雙手接球", width / 2, height / 2 - 50);
    textSize(16);
    text("按任意鍵開始", width / 2, height / 2 + 50);
  } else if (gameState === "playing") {
    drawHands();
    ball.update();
    ball.display();
    checkCatch();

    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text("分數: " + score, 10, 10);
  } else if (gameState === "question") {
    fill(0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(currentQuestion.q, width / 2, height / 2 - 40);
    answerInput.show();
  }
}

function drawHands() {
  fill(0, 255, 0);
  noStroke();
  ellipse(leftHandX, height - 20, 80, 20);
  ellipse(rightHandX, height - 20, 80, 20);
}

function checkCatch() {
  if (
    dist(ball.x, ball.y, leftHandX, height - 20) < 40 ||
    dist(ball.x, ball.y, rightHandX, height - 20) < 40
  ) {
    gameState = "question";
    answerInput.value("");
  } else if (ball.y > height) {
    ball.reset();
  }
}

class Ball {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(100, width - 100);
    this.y = 0;
    this.speed = 4;
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(255, 204, 0);
    ellipse(this.x, this.y, 30, 30);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("知識球", this.x, this.y);
  }
}

function keyPressed() {
  if (gameState === "intro") {
    gameState = "playing";
  }
}
