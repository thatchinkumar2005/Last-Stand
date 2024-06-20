import { settings } from "../../GLOBAL/settings.js";
import { state } from "../../GLOBAL/state.js";
import playAudio from "../../utills/playAudio.js";
import { c, canvas, keys, placedItems } from "../index.js";
import { Sprite } from "./Sprites.js";

class Player extends Sprite {
  constructor({
    position = { x: 0, y: 0 },
    height = 180,
    width = 70,
    initSprite = { imgSrc: "Assets/PlayerSprites/IdleRight.png", framesMax: 8 },
  }) {
    super({
      position,
      imgSrc: initSprite.imgSrc,
      framesMax: initSprite.framesMax,
      offSet: {
        x: 145,
        y: 165,
      },
      scale: 2.7,
    });
    this.position = position;
    this.height = height;
    this.width = width;
    this.velocity = { x: 0, y: 0 };
    this.health = 100;
    this.score = 0;
    this.dir = "right";
    this.skill = null;
    this.jetPack = {
      canFly: true,
      flying: false,
      fuel: 100,
    };
    this.sprites = {
      idleRight: {
        imgSrc: "Assets/PlayerSprites/IdleRight.png",
        framesMax: 8,
      },
      idleLeft: {
        imgSrc: "Assets/PlayerSprites/IdleLeft.png",
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
      jumpRight: {
        imgSrc: "Assets/PlayerSprites/JumpRight.png",
        framesMax: 8,
      },
      jumpLeft: {
        imgSrc: "Assets/PlayerSprites/JumpLeft.png",
        framesMax: 8,
      },
    };
    this.currentSprite = "idleRight";

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
    this.drawFuel();
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
      if (this.dir === "left") {
        this.switchSprites("idleLeft");
      } else if (this.dir === "right") {
        this.switchSprites("idleRight");
      }
    }

    //JetPack
    if (this.jetPack.fuel <= 0) {
      this.jetPack.canFly = false;
    } else {
      this.jetPack.canFly = true;
    }
    if (keys.w.pressed && !keys.space.pressed && this.jetPack.canFly) {
      playAudio({ path: "Assets/jetpack.mp3" });
      this.onGround = false;
      this.jetPack.fuel -= 1;
      this.velocity.y -= 1.1 * settings.gravity;
    }
    if (!keys.w.pressed && this.jetPack.fuel < 100) {
      this.jetPack.fuel += 1;
    }
    console.log(this.jetPack.fuel);
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
          //collision with block if not jumping
          if (this.position.x < i.position.x) {
            console.log("left");
            this.position.x = i.position.x - this.width;
          } else if (this.position.x > i.position.x) {
            console.log("right");
            this.position.x = i.position.x + i.width;
          }
        } else {
          //jump on top of block if jump is pressed
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

  drawFuel() {
    c.fillStyle = "red";
    c.fillRect(
      this.position.x - 10,
      this.position.y - 50,
      (this.jetPack.fuel / 100) * (this.width + 20),
      10
    );
  }

  switchSprites(sprite) {
    switch (sprite) {
      case "idleRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "idleLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "runRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "runLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "walkRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "walkLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "jumpRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "jumpLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
    }
  }
}

export { Player };
