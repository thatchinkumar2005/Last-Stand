import { c, canvas, keys, mouse } from "../index.js";
import { Projectile } from "./Projectiles.js";
import { Sprite } from "./Sprites.js";

export class Weapon extends Sprite {
  constructor({ position = { x: 0, y: 0 }, height, width, angle = 0, config }) {
    super({
      position,
      imgSrc: `Assets/weapons/${config.name}Right.png`,
      framesMax: 1,
      scale: 2.5,
      offSet: {
        x: 8,
        y: 40,
      },
    });
    this.currentSprite = "right";
    this.position = position;
    this.angle = angle;
    this.height = height;
    this.width = width;
    this.config = config;
    this.lastFired = 0;
    this.name = config.name;
    this.projectiles = [];
    this.sprites = {
      left: {
        imgSrc: `Assets/weapons/${config.name}Left.png`,
        framesMax: 1,
      },
      right: {
        imgSrc: `Assets/weapons/${config.name}Right.png`,
        framesMax: 1,
      },
    };

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].imgSrc;
    }
  }
  drawHB() {
    c.fillStyle = "grey";
    c.fillRect(0, 0, this.width, this.height);
  }

  update() {
    this.position = {
      x: this.player.position.x + this.player.width / 2,
      y: this.player.position.y + (this.player.dir === "right" ? 80 : 110),
    };

    let mouseAngle = Math.atan2(mouse.y - this.position.y, canvas.width / 8);

    if (this.player.dir === "right") {
      this.switchSprites("right");
      this.angle = mouseAngle;
    }
    if (this.player.dir === "left") {
      this.switchSprites("left");
      this.angle = Math.PI - mouseAngle;
    }

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
    const currentTime = Date.now();
    if (
      currentTime - this.lastFired >=
      (this.player.skill === "increasedFireRate"
        ? 50
        : this.config.fireInterval)
    ) {
      const proj = new Projectile({
        position: {
          x: this.position.x + this.width * Math.cos(this.angle),
          y: this.position.y + this.width * Math.sin(this.angle),
        },
        radius: this.config.bulletRadius,
        velocity: {
          x: this.config.bulletVelocity * Math.cos(this.angle),
          y: this.config.bulletVelocity * Math.sin(this.angle),
        },
        config: this.config,
      });
      this.projectiles.push(proj);
      this.lastFired = currentTime; // Update the last fired time
    }
  }

  switchSprites(sprite) {
    switch (sprite) {
      case "left":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "right":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
    }
  }
}
