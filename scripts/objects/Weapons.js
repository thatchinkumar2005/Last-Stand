import { c, mouse } from "../index.js";
import { Pellet } from "./Projectiles.js";
import { Sprite } from "./Sprites.js";

export class Weapon extends Sprite {
  constructor({
    position = { x: 0, y: 0 },
    height,
    width,
    angle,
    initSprite = { imgSrc: "Assets/weapons/weapon.png", framesMax: 1 },
  }) {
    super({
      position,
      imgSrc: initSprite.imgSrc,
      framesMax: initSprite.framesMax,
      scale: 2.5,
      offSet: {
        x: 8,
        y: 40,
      },
    });
    this.position = position;
    this.angle = angle;
    this.height = height;
    this.width = width;
    this.bullets = 100;
    this.projectiles = [];
  }
  drawHB() {
    c.fillStyle = "grey";
    c.fillRect(0, 0, this.width, this.height);
  }

  update() {
    this.position = {
      x: this.player.position.x + this.player.width / 2,
      y: this.player.position.y + 60,
    };

    let mouseAngle = Math.atan2(
      mouse.y - this.position.y,
      mouse.x - this.position.x
    );

    this.angle = mouseAngle;

    if (this.projectiles.length > 0) {
      this.projectiles.forEach((p) => {
        p.update({ weapon: this });
      });
    }
    const prevPosition = this.position;
    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.angle);
    this.position = { x: 0, y: 0 };
    this.draw();
    this.animateFrames();
    c.restore();
    this.position = prevPosition;
  }

  fire() {
    const proj = new Pellet({
      position: {
        x: this.position.x + this.width * Math.cos(this.angle),
        y: this.position.y + this.width * Math.sin(this.angle),
      },
      radius: 10,
      velocity: {
        x: 40 * Math.cos(this.angle),
        y: 40 * Math.sin(this.angle),
      },
    });

    this.projectiles.push(proj);
  }
}
