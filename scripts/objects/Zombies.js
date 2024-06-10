import { settings } from "../../GLOBAL/settings.js";
import randRange from "../../utills/randRange.js";
import { c, canvas, placedItems, scoreBoard, zombies } from "../index.js";
import { Sprite } from "./Sprites.js";

export class NormalZombie extends Sprite {
  constructor({
    position,
    velocity = { x: 0, y: 0 },
    width = 70,
    height = 140,
    initSprite = {
      imgSrc: "Assets/ZombieSprites/Walk.png",
      framesMax: 8,
    },
  }) {
    super({
      position,
      imgSrc: initSprite.imgSrc,
      framesMax: initSprite.framesMax,
      scale: 3,
      offSet: {
        x: 120,
        y: 140,
      },
    });
    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.velocityMag = randRange(1, 3);
    this.health = 100;
    this.damage = 10;
    this.attacking = false;
    this.currentSprite = "walk";
    this.sprites = {
      idle: {
        imgSrc: "Assets/ZombieSprites/Idle.png",
        framesMax: 8,
      },
      walk: {
        imgSrc: "Assets/ZombieSprites/Walk.png",
        framesMax: 8,
      },

      attack: {
        imgSrc: "Assets/ZombieSprites/Attack_2.png",
        framesMax: 4,
      },
    };
    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].imgSrc;
    }
  }

  drawHB() {
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
    this.animateFrames();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height > canvas.height) {
      this.velocity.y = -this.velocity.y * settings.losses;
      this.position.y = canvas.height - this.height;
      this.onGround = true;
    } else {
      this.velocity.y += settings.gravity;
    }

    //placed Items collision

    placedItems.forEach((i) => {
      if (
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width &&
        this.position.y + this.height > i.position.y &&
        this.position.y < i.position.y + i.height
      ) {
        if (this.position.x < i.position.x) {
          console.log("left");
          this.position.x = i.position.x - this.width;
          this.velocity.x = 0;
          this.switchSprites("idle");
        } else if (this.position.x > i.position.x) {
          console.log("right");
          this.position.x = i.position.x + i.width;
          this.velocity.x = 0;
        }
      }
    });

    zombies.forEach((i) => {
      if (
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width &&
        this.position.y + this.height > i.position.y &&
        this.position.y < i.position.y + i.height
      ) {
        if (this.position.x < i.position.x) {
          console.log("left");
          this.position.x = i.position.x - this.width;
          this.velocity.x = 0;
        } else if (this.position.x > i.position.x) {
          console.log("right");
          this.position.x = i.position.x + i.width;
          this.velocity.x = 0;
        }
      }
    });

    const diff = player.position.x - this.position.x;
    const i = diff > 0 ? 1 : diff === 0 ? 0 : -1;
    this.velocity.x = this.velocityMag * i;

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
      this.position.y < player.position.y + player.height &&
      !this.attacking
    ) {
      this.attack({ player });
      this.attacking = true;
    }
  }

  attack({ player }) {
    setTimeout(() => {
      console.log("attacked");
      player.health -= this.damage;
      this.attacking = false;
      scoreBoard.refresh({ player });
    }, 500);
  }

  switchSprites(sprite) {
    switch (sprite) {
      case "idle":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
      case "walk":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
      case "attack":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
        }
        break;
    }
  }
}
