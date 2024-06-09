export class GameOverCard {
  constructor() {
    const gameOverCard = document.querySelector("#gameOver");
    const scoreCard = document.querySelector(".score");
    const highScoreCard = document.querySelector(".highscore");
    this.DOMelement = { gameOverCard, scoreCard, highScoreCard };
  }

  refresh({ player }) {
    this.DOMelement.scoreCard.innerHTML = `SCORE : ${player.score}`;
    let highScore = Number(localStorage.getItem("highscore"));
    if (!highScore) {
      highScore = player.score;
      localStorage.setItem("highscore", highScore);
    } else if (player.score > highScore) {
      highScore = player.score;
    }
    this.DOMelement.highScoreCard.innerHTML = `HIGH SCORE : ${highScore}`;
  }
  show() {
    this.DOMelement.gameOverCard.style.display = "flex";
  }
}
