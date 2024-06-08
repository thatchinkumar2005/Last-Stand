import { settings } from "../../GLOBAL/settings.js";
import { c, canvas } from "../index.js";

export class Pellet {
  constructor({ position, radius, velocity }) {
    this.position = position;
    this.radius = radius;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();
  }

  update({ weapon }) {
    console.log("hello");
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.radius > canvas.height) {
      delete this;
      weapon.projectile = null;
    } else {
      this.velocity.y += settings.gravity;
    }

    this.draw();
  }
}
