export class GameOverCard {
  constructor() {
    const gameOverCard = document.querySelector("#gameOver");
    this.DOMelement = gameOverCard;
  }

  show() {
    this.DOMelement.style.display = "flex";
  }
}
