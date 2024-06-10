import { c, mouse } from "../index.js";
import { Pellet } from "./Projectiles.js";

export class Weapon {
  constructor({ position = { x: 0, y: 0 }, height, width, angle }) {
    this.position = position;
    this.angle = angle;
    this.height = height;
    this.width = width;
    this.bullets = 100;
    this.projectiles = [];
  }
  draw() {
    c.save();

    c.translate(this.position.x, this.position.y); //shift origin center of shortside

    c.rotate(this.angle);

    c.fillStyle = "grey";
    c.fillRect(0, -this.height / 2, this.width, this.height);

    c.restore();
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

    this.draw();
    c.restore();

    if (this.projectiles.length > 0) {
      this.projectiles.forEach((p) => {
        p.update({ weapon: this });
      });
    }
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
