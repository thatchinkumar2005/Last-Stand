export class ScoreBoard {
  constructor({ initScore = 0 }) {
    this.score = initScore;
    const scoreBoard = document.querySelector("#scoreBoard");
    const healthBar = document.querySelector("#healthBar");
    const scoreDOM = document.querySelector("#score");

    this.domElement = {
      scoreBoard,
      healthBar,
      score: scoreDOM,
    };

    this.domElement.scoreBoard.style.display = "flex";
  }

  refresh({ player }) {
    this.domElement.score.innerHTML = player.score;
    this.domElement.healthBar.style.width = `${player.health}%`;
  }
}
