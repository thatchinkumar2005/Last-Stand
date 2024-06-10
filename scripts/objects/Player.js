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
    this.sprites = {
      idle: {
        imgSrc: "Assets/PlayerSprites/Idle.png",
        framesMax: 8,
      },
      run: {
        imgSrc: "Assets/PlayerSprites/Run.png",
        framesMax: 8,
      },
      walk: {
        imgSrc: "Assets/PlayerSprites/Walk.png",
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
    this.switchSprites("idle");
    if (keys.d.pressed && !keys.Control.pressed) {
      this.velocity.x = settings.walkSpeed;
      this.switchSprites("walk");
    } else if (keys.a.pressed && !keys.Control.pressed) {
      this.velocity.x = -settings.walkSpeed;
      this.switchSprites("walk");
    } else if (keys.Control.pressed && keys.d.pressed) {
      this.velocity.x = settings.runSpeed;
      this.switchSprites("run");
    } else if (keys.Control.pressed && keys.a.pressed) {
      this.velocity.x = -settings.runSpeed;
      this.switchSprites("run");
    } else if (keys.Control.pressed && !keys.a.pressed && !keys.d.pressed) {
      this.velocity.x = 0;
      this.switchSprites("idle");
    }
    if (keys.space.pressed && (this.onGround || this.onItem)) {
      this.switchSprites("jump");
      this.velocity.y = -15;
      this.onGround = false;
      this.onItem = false;
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
        if (this.currentSprite !== "idle") {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "run":
        if (this.currentSprite !== "run") {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "walk":
        if (this.currentSprite !== "walk") {
          this.image = this.sprites.walk.image;
          this.framesMax = this.sprites.walk.framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "jump":
        if (this.currentSprite !== "jump") {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.currentSprite = sprite;
        }
        break;
    }
  }
}

export { Player };
