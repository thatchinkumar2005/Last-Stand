import { settings } from "../../GLOBAL/settings.js";
import randRange from "../../utills/randRange.js";
import { c, canvas, placedItems, scoreBoard, zombies } from "../index.js";

export class NormalZombie {
  constructor({
    position,
    velocity = { x: 0, y: 0 },
    width = 70,
    height = 140,
  }) {
    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.velocityMag = randRange(1, 3);
    this.health = 100;
    this.attacking = false;
  }

  draw() {
    c.fillStyle = "green";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.fillRect(
      this.position.x - 10,
      this.position.y - 30,
      (20 + this.width) * (this.health / 100),
      10
    );
  }

  update({ player }) {
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height > canvas.height) {
      this.velocity.y = -this.velocity.y * settings.losses;
      this.position.y = canvas.height - this.height;
      this.onGround = true;
    } else {
      this.velocity.y += settings.gravity;
    }

    const diff = player.position.x - this.position.x;
    const i = diff > 0 ? 1 : diff === 0 ? 0 : -1;

    this.velocity.x = this.velocityMag * i;

    //placed Items collision

    placedItems.forEach((i) => {
      if (
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width &&
        this.position.y + this.height > i.position.y &&
        this.height < i.position.y + i.height
      ) {
        if (this.onGround) {
          if (this.position.x < i.position.x) {
            console.log("left");
            this.position.x = i.position.x - this.width;
          } else if (this.position.x > i.position.x) {
            console.log("right");
            this.position.x = i.position.x + i.width;
          }
        } else {
          this.position.y = i.position.y - this.height;
          this.velocity.y = 0;
          this.onItem = true;
        }
      }
    });

    zombies.forEach((i) => {
      if (
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width &&
        this.position.y + this.height > i.position.y &&
        this.height < i.position.y + i.height
      ) {
        if (this.position.x < i.position.x) {
          console.log("left");
          this.position.x = i.position.x - this.width - 2;
        } else if (this.position.x > i.position.x) {
          console.log("right");
          this.position.x = i.position.x + i.width + 2;
        }
      }
    });

    if (this.health <= 0) {
      zombies.splice(zombies.indexOf(this), 1);
      player.score++;
      scoreBoard.refresh({ player });
      delete this;
    }

    if (
      this.position.x + this.width > player.position.x &&
      this.position.x < player.position.x + player.width &&
      this.position.y + this.height > player.position.y &&
      !this.attacking
    ) {
      this.attack({ player });
      this.attacking = true;
    }
  }

  attack({ player }) {
    setTimeout(() => {
      console.log("attacked");
      player.health--;
      this.attacking = false;
      scoreBoard.refresh({ player });
    }, 2000);
  }
}
