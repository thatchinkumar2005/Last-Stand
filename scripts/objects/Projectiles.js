import { settings } from "../../GLOBAL/settings.js";
import { c, canvas, placedItems, zombies } from "../index.js";

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
      weapon.projectiles.splice(weapon.projectiles.indexOf(this), 1);
    } else {
      this.velocity.y += settings.gravity;
    }

    placedItems.forEach((i) => {
      if (
        this.position.x + this.radius > i.position.x &&
        this.position.x - this.radius < i.position.x + i.width &&
        this.position.y + this.radius > i.position.y
      ) {
        delete this;
        weapon.projectiles.splice(weapon.projectiles.indexOf(this), 1);
      }
    });

    zombies.forEach((i) => {
      if (
        this.position.x + this.radius > i.position.x &&
        this.position.x - this.radius < i.position.x + i.width &&
        this.position.y + this.radius > i.position.y
      ) {
        delete this;
        weapon.projectiles.splice(weapon.projectiles.indexOf(this), 1);
        i.health -= 10;
      }
    });

    this.draw();
  }
}
