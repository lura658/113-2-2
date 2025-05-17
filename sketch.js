let video;
let poseNet;
let poses = [];
let leftHandY = 0;
let rightHandY = 0;
let gameState = "start";
let questionIndex = 0;
let score = 0;
let questions = [
  { question: "什麼是教育科技？", correct: "左手" },
  { question: "教學設計是屬於？", correct: "右手" },
  { question: "教育APP開發與哪項有關？", correct: "左手" },
];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
  textAlign(CENTER, CENTER);
  textSize(24);
}

function modelReady() {
  console.log("PoseNet ready");
}

function draw() {
  image(video, 0, 0, width, height);

  if (poses.length > 0) {
    let pose = poses[0].pose;
    if (pose.leftWrist && pose.rightWrist) {
      leftHandY = pose.leftWrist.y;
      rightHandY = pose.rightWrist.y;

      // Draw hands
      fill(255, 0, 0);
      ellipse(pose.leftWrist.x, pose.leftWrist.y, 20);
      fill(0, 0, 255);
      ellipse(pose.rightWrist.x, pose.rightWrist.y, 20);

      // Game logic
      if (gameState === "question") {
        let q = questions[questionIndex];
        text(q.question, width / 2, 40);
        text("舉左手表示「左手」，舉右手表示「右手」", width / 2, 80);

        if (leftHandY < 200) {
          checkAnswer("左手");
        } else if (rightHandY < 200) {
          checkAnswer("右手");
        }
      }
    }
  }

  if (gameState === "start") {
    fill(255);
    text("舉起任一隻手開始遊戲", width / 2, height / 2);
    if (poses.length > 0) {
      let pose = poses[0].pose;
      if (pose.leftWrist.y < 200 || pose.rightWrist.y < 200) {
        gameState = "question";
      }
    }
  } else if (gameState === "end") {
    fill(255);
    text("遊戲結束！你的得分是：" + score, width / 2, height / 2);
  }
}

function checkAnswer(ans) {
  let correct = questions[questionIndex].correct;
  if (ans === correct) {
    score++;
  }
  questionIndex++;
  if (questionIndex >= questions.length) {
    gameState = "end";
  }
}
