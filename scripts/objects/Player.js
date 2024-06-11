import { settings } from "../../GLOBAL/settings.js";
import { state } from "../../GLOBAL/state.js";
import { c, canvas, keys, placedItems } from "../index.js";
import { Sprite } from "./Sprites.js";

class Player extends Sprite {
  constructor({
    position = { x: 0, y: 0 },
    height = 140,
    width = 70,
    initSprite = { imgSrc: "Assets/PlayerSprites/Idle.png", framesMax: 8 },
  }) {
    super({
      position,
      imgSrc: initSprite.imgSrc,
      framesMax: initSprite.framesMax,
      offSet: {
        x: 100,
        y: 147,
      },
      scale: 2.2,
    });
    this.position = position;
    this.height = height;
    this.width = width;
    this.velocity = { x: 0, y: 0 };
    this.health = 100;
    this.score = 0;
    this.dir = "right";
    this.sprites = {
      idle: {
        imgSrc: "Assets/PlayerSprites/Idle.png",
        framesMax: 8,
      },
      runRight: {
        imgSrc: "Assets/PlayerSprites/RunRight.png",
        framesMax: 8,
      },
      runLeft: {
        imgSrc: "Assets/PlayerSprites/RunLeft.png",
        framesMax: 8,
      },
      walkRight: {
        imgSrc: "Assets/PlayerSprites/WalkRight.png",
        framesMax: 8,
      },
      walkLeft: {
        imgSrc: "Assets/PlayerSprites/WalkLeft.png",
        framesMax: 8,
      },
      jump: {
        imgSrc: "Assets/PlayerSprites/Jump.png",
        framesMax: 8,
      },
    };
    this.currentSprite = "idle";

    for (const sprite in this.sprites) {
      const image = new Image();
      image.src = this.sprites[sprite].imgSrc;
      this.sprites[sprite].image = image;
    }
  }

  drawHB() {
    c.fillStyle = "Red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.animateFrames();

    //velocity implementation
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //gravity
    if (this.position.y + this.height > canvas.height) {
      this.velocity.y = -this.velocity.y * settings.losses;
      this.position.y = canvas.height - this.height;
      this.onGround = true;
    } else {
      this.velocity.y += settings.gravity;
    }

    //keys controll
    this.velocity.x = 0;
    if (keys.d.pressed && !keys.Control.pressed) {
      this.velocity.x = settings.walkSpeed;
      this.switchSprites("walkRight");
      this.dir = "right";
    } else if (keys.a.pressed && !keys.Control.pressed) {
      this.velocity.x = -settings.walkSpeed;
      this.switchSprites("walkLeft");
      this.dir = "left";
    } else if (keys.Control.pressed && keys.d.pressed) {
      this.velocity.x = settings.runSpeed;
      this.switchSprites("runRight");
      this.dir = "right";
    } else if (keys.Control.pressed && keys.a.pressed) {
      this.velocity.x = -settings.runSpeed;
      this.switchSprites("runLeft");
      this.dir = "left";
    } else if (keys.Control.pressed && !keys.a.pressed && !keys.d.pressed) {
      this.velocity.x = 0;
      this.switchSprites("idle");
    } else {
      this.switchSprites("idle");
    }
    if (keys.space.pressed && (this.onGround || this.onItem)) {
      this.velocity.y = -15;
      this.onGround = false;
      this.onItem = false;
    }

    if (!(this.onGround || this.onItem)) {
      this.switchSprites("jump");
    }
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

    if (this.health <= 0) {
      state.gameOver = true;
    }
  }

  switchSprites(sprite) {
    switch (sprite) {
      case "idle":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "runRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites.runRight.image;
          this.framesMax = this.sprites.runRight.framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "runLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites.runLeft.image;
          this.framesMax = this.sprites.runLeft.framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "walkRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites.walkRight.image;
          this.framesMax = this.sprites.walkRight.framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "walkLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites.walkLeft.image;
          this.framesMax = this.sprites.walkLeft.framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "jump":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.currentSprite = sprite;
        }
        break;
    }
  }
}

export { Player };
