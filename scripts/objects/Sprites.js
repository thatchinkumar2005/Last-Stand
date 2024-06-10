import { c } from "../index.js";

export class Sprite {
  constructor({
    position,
    imgSrc,
    framesMax = 1,
    scale = 1,
    scaleXY = {
      x: 1,
      y: 1,
    },
    offSet = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imgSrc;
    this.scale = scale;

    this.framesMax = framesMax;

    this.currentFrame = 0;

    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offSet = offSet;
    this.scaleXY = scaleXY;
  }

  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offSet.x,
      this.position.y - this.offSet.y,
      (this.image.width / this.framesMax) * this.scale * this.scaleXY.x,
      this.image.height * this.scale * this.scaleXY.y
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.framesMax - 1) {
        this.currentFrame++;
        console.log(this.currentFrame);
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}
