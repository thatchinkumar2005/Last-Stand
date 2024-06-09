import handlePause from "../events/handlePauseButton.js";

export class ScoreBoard {
  constructor({ initScore = 0 }) {
    this.score = initScore;
    const scoreBoard = document.querySelector("#scoreBoard");
    const healthBar = document.querySelector("#healthBar");
    const scoreDOM = document.querySelector("#score");
    const pauseBtn = document.querySelector("#pauseButton");

    this.domElement = {
      scoreBoard,
      healthBar,
      score: scoreDOM,
      pauseBtn,
    };

    this.domElement.scoreBoard.style.display = "flex";

    this.domElement.pauseBtn.onclick = handlePause;
  }

  refresh({ player }) {
    this.domElement.score.innerHTML = player.score;
    this.domElement.healthBar.style.width = `${player.health}%`;
  }
}
