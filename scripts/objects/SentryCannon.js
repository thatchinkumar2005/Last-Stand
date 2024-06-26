import { settings } from "../../GLOBAL/settings.js";
import playAudio from "../../utills/playAudio.js";
import { c, canvas, placedItems, zombies } from "../index.js";
import { Projectile } from "./Projectiles.js";
import { Sprite } from "./Sprites.js";

export default class SentryCannon extends Sprite {
  constructor({
    position,
    velocity = { x: 0, y: 0 },
    height = 150,
    width = 70,
    initSprite = {
      imgSrc: "Assets/SentryCannonRight.png",
      framesMax: 1,
    },
  }) {
    super({
      position,
      imgSrc: initSprite.imgSrc,
      framesMax: initSprite.framesMax,
      scale: 0.025,
      scaleXY: {
        x: 0.6,
        y: 1.2,
      },
      offSet: {
        x: 20,
        y: 46,
      },
    });
    this.position = position;
    this.velocity = velocity;
    this.height = height;
    this.otherItems = JSON.parse(JSON.stringify(placedItems));
    this.width = width;
    this.name = "sentryCannon";
    this.lastFired = 0;
    this.projectiles = [];
    this.dir = position.x + width / 2 > canvas.width / 2 ? "right" : "left";
    if (this.dir === "right") {
      this.image.src = "Assets/SentryCannonLeft.png";
    }
  }

  drawHB() {
    c.fillStyle = "orange";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height >= canvas.height) {
      this.velocity.y = -this.velocity.y * settings.losses;
      this.position.y = canvas.height - this.height;
    } else {
      this.velocity.y += settings.gravity;
    }

    //collision with other placedItems
    this.otherItems.forEach((i) => {
      if (
        this.position.y + this.height > i.position.y &&
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width &&
        i.position.y + i.height > this.position.y
      ) {
        this.velocity.y = 0;
        this.position.y = i.position.y - this.height;
        return;
      }
    });

    if (this.projectiles.length > 0) {
      this.projectiles.forEach((p) => {
        p.update({ weapon: this });
      });
    }

    zombies.forEach((z) => {
      const dist = Math.hypot(
        this.position.x - z.position.x,
        this.position.y - z.position.y
      );

      if (dist < 300) {
        this.fire();
      }
      return;
    });
  }

  fire() {
    const currentTime = Date.now();
    if (currentTime - this.lastFired >= 3000) {
      playAudio({ path: "Assets/cannon.mp3" });
      const proj = new Projectile({
        position: {
          x:
            this.dir === "right"
              ? this.position.x + this.width
              : this.position.x,
          y: this.position.y,
        },
        radius: 20,
        velocity: {
          x: this.dir === "right" ? 20 : -20,
          y: 0,
        },
        config: { damage: 100 },
      });
      this.projectiles.push(proj);
      this.lastFired = currentTime; // Update the last fired time
    }
  }
}
