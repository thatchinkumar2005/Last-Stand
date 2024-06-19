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
      imgSrc: "Assets/ZombieSprites/WalkLeft.png",
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
    this.currentSprite = "walkLeft";
    this.dir = "right";
    this.sprites = {
      idleLeft: {
        imgSrc: "Assets/ZombieSprites/IdleLeft.png",
        framesMax: 8,
      },
      idleRight: {
        imgSrc: "Assets/ZombieSprites/IdleRight.png",
        framesMax: 8,
      },
      walkLeft: {
        imgSrc: "Assets/ZombieSprites/WalkLeft.png",
        framesMax: 8,
      },
      walkRight: {
        imgSrc: "Assets/ZombieSprites/WalkRight.png",
        framesMax: 8,
      },

      attackLeft: {
        imgSrc: "Assets/ZombieSprites/AttackLeft.png",
        framesMax: 4,
      },
      attackRight: {
        imgSrc: "Assets/ZombieSprites/AttackRight.png",
        framesMax: 4,
      },

      hurtLeft: {
        imgSrc: "Assets/ZombieSprites/HurtLeft.png",
        framesMax: 3,
      },
      hurtRight: {
        imgSrc: "Assets/ZombieSprites/HurtRight.png",
        framesMax: 3,
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

    //other animations
    if (this.attacking) {
      if (this.dir === "left") {
        this.switchSprites("attackLeft");
      } else if (this.dir === "right") {
        this.switchSprites("attackRight");
      }
    } else if (this.hurt) {
      if (this.dir === "left") {
        this.switchSprites("hurtLeft");
      } else if (this.dir === "right") {
        this.switchSprites("hurtRight");
      }
      setTimeout(() => {
        this.hurt = false;
      }, 200);
    } else {
      if (this.dir === "left") {
        this.switchSprites("walkLeft");
      } else if (this.dir === "right") {
        this.switchSprites("walkRight");
      }
    }

    //placed Items collision

    placedItems.forEach((i, ind) => {
      if (
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width &&
        this.position.y + this.height > i.position.y &&
        this.position.y < i.position.y + i.height
      ) {
        if (i.name === "trap") {
          this.health = 0;
          i.switchSprites("attack");
          console.log(i.image);
          setTimeout(() => {
            placedItems.splice(ind, 1);
          }, 500);
          return;
        }
        if (this.position.x < i.position.x) {
          console.log("left");
          this.position.x = i.position.x - this.width;
          this.velocity.x = 0;
          if (this.dir === "left") {
            this.switchSprites("idleLeft");
          } else if (this.dir === "right") {
            this.switchSprites("idleRight");
          }
        } else if (this.position.x > i.position.x) {
          console.log("right");
          this.position.x = i.position.x + i.width;
          this.velocity.x = 0;
          if (this.dir === "left") {
            this.switchSprites("idleLeft");
          } else if (this.dir === "right") {
            this.switchSprites("idleRight");
          }
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
          if (i.velocity.x === 0) this.switchSprites("idle");
        } else if (this.position.x > i.position.x) {
          console.log("right");
          this.position.x = i.position.x + i.width;
          this.velocity.x = 0;
          if (i.velocity.x === 0) this.switchSprites("idle");
        }
      }
    });

    const diff = player.position.x - this.position.x;
    const i = diff > 0 ? 1 : diff === 0 ? 0 : -1;
    this.velocity.x = this.velocityMag * i;

    if (this.velocity.x > 0) {
      this.dir = "right";
    } else if (this.velocity.x < 0) {
      this.dir = "left";
    }

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
      if (player.skill !== "infinity") player.health -= this.damage;
      this.attacking = false;
      scoreBoard.refresh({ player });
    }, 500);
  }

  switchSprites(sprite) {
    switch (sprite) {
      case "idleLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "idleRight":
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
      case "walkRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "attackLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "attackRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "hurtLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "hurtRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
    }
  }
}

export class ClimberZombie extends Sprite {
  constructor({
    position,
    velocity = { x: 0, y: 0 },
    width = 150,
    height = 90,
    initSprite = {
      imgSrc: "Assets/ClimberZombies/WalkLeft.png",
      framesMax: 10,
    },
  }) {
    super({
      position,
      imgSrc: initSprite.imgSrc,
      framesMax: initSprite.framesMax,
      scale: 3,
      offSet: {
        x: 100,
        y: 200,
      },
    });
    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.velocityMag = randRange(1, 2);
    this.health = 100;
    this.damage = 5;
    this.attacking = false;
    this.currentSprite = "walkLeft";
    this.dir = "right";
    this.sprites = {
      idleLeft: {
        imgSrc: "Assets/ClimberZombies/IdleLeft.png",
        framesMax: 9,
      },
      idleRight: {
        imgSrc: "Assets/ClimberZombies/IdleRight.png",
        framesMax: 9,
      },
      walkLeft: {
        imgSrc: "Assets/ClimberZombies/WalkLeft.png",
        framesMax: 10,
      },
      walkRight: {
        imgSrc: "Assets/ClimberZombies/WalkRight.png",
        framesMax: 10,
      },

      attackLeft: {
        imgSrc: "Assets/ClimberZombies/AttackLeft.png",
        framesMax: 4,
      },
      attackRight: {
        imgSrc: "Assets/ClimberZombies/AttackRight.png",
        framesMax: 4,
      },

      hurtLeft: {
        imgSrc: "Assets/ClimberZombies/HurtLeft.png",
        framesMax: 5,
      },
      hurtRight: {
        imgSrc: "Assets/ClimberZombies/HurtRight.png",
        framesMax: 5,
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
    } else if (!this.onItem) {
      this.velocity.y += settings.gravity;
    }

    //other animations
    if (this.attacking) {
      if (this.dir === "left") {
        this.switchSprites("attackLeft");
      } else if (this.dir === "right") {
        this.switchSprites("attackRight");
      }
    } else if (this.hurt) {
      if (this.dir === "left") {
        this.switchSprites("hurtLeft");
      } else if (this.dir === "right") {
        this.switchSprites("hurtRight");
      }
      setTimeout(() => {
        this.hurt = false;
      }, 200);
    } else {
      if (this.dir === "left") {
        this.switchSprites("walkLeft");
      } else if (this.dir === "right") {
        this.switchSprites("walkRight");
      }
    }

    //placed Items collision

    placedItems.forEach((i, ind) => {
      if (
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width &&
        this.position.y + this.height > i.position.y &&
        this.position.y < i.position.y + i.height
      ) {
        if (i.name === "trap") {
          this.health = 0;
          i.switchSprites("attack");
          console.log(i.image);
          setTimeout(() => {
            placedItems.splice(ind, 1);
          }, 500);
          return;
        }
        if (this.position.y + this.height > i.position.y) {
          this.velocity.y = 0;
          this.position.y = i.position.y - this.height;
          this.onItem = true;
        }
      } else {
        this.onItem = false;
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
          if (i.velocity.x === 0) this.switchSprites("idle");
        } else if (this.position.x > i.position.x) {
          console.log("right");
          this.position.x = i.position.x + i.width;
          this.velocity.x = 0;
          if (i.velocity.x === 0) this.switchSprites("idle");
        }
      }
    });

    const diff = player.position.x - this.position.x;
    const i = diff > 0 ? 1 : diff === 0 ? 0 : -1;
    this.velocity.x = this.velocityMag * i;

    if (this.velocity.x > 0) {
      this.dir = "right";
    } else if (this.velocity.x < 0) {
      this.dir = "left";
    }

    if (this.dir === "left") {
      this.offSet.x = 65;
      this.offSet.y = 200;
    } else {
      this.offSet.x = 100;
      this.offSet.y = 200;
    }
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
      if (player.skill !== "infinity") player.health -= this.damage;
      this.attacking = false;
      scoreBoard.refresh({ player });
    }, 500);
  }

  switchSprites(sprite) {
    switch (sprite) {
      case "idleLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "idleRight":
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
      case "walkRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "attackLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "attackRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "hurtLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "hurtRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
    }
  }
}

export class Creeper extends Sprite {
  constructor({
    position,
    velocity = { x: 0, y: 0 },
    width = 70,
    height = 140,
    initSprite = {
      imgSrc: "Assets/Creeper/WalkLeft.png",
      framesMax: 7,
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
    this.attacked = false;
    this.explode = false;
    this.inRange = false;
    this.currentSprite = "walkLeft";
    this.dir = "right";
    this.sprites = {
      idleLeft: {
        imgSrc: "Assets/Creeper/IdleLeft.png",
        framesMax: 5,
      },
      idleRight: {
        imgSrc: "Assets/Creeper/IdleRight.png",
        framesMax: 5,
      },
      walkLeft: {
        imgSrc: "Assets/Creeper/WalkLeft.png",
        framesMax: 7,
      },
      walkRight: {
        imgSrc: "Assets/Creeper/WalkRight.png",
        framesMax: 7,
      },

      hurtLeft: {
        imgSrc: "Assets/Creeper/HurtLeft.png",
        framesMax: 3,
      },
      hurtRight: {
        imgSrc: "Assets/Creeper/HurtRight.png",
        framesMax: 3,
      },
      explode: {
        imgSrc: "Assets/Creeper/Explode.png",
        framesMax: 8,
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

    //other animations
    if (this.hurt) {
      if (this.dir === "left") {
        this.switchSprites("hurtLeft");
      } else if (this.dir === "right") {
        this.switchSprites("hurtRight");
      }
      setTimeout(() => {
        this.hurt = false;
      }, 200);
    } else if (this.explode) {
      this.switchSprites("explode");
    } else if (this.attacked) {
      if (this.dir === "left") {
        this.switchSprites("idleLeft");
      } else if (this.dir === "right") {
        this.switchSprites("idleRight");
      }
    } else {
      if (this.dir === "left") {
        this.switchSprites("walkLeft");
      } else if (this.dir === "right") {
        this.switchSprites("walkRight");
      }
    }

    //placed Items collision

    placedItems.forEach((i, ind) => {
      if (
        this.position.x + this.width > i.position.x &&
        this.position.x < i.position.x + i.width &&
        this.position.y + this.height > i.position.y &&
        this.position.y < i.position.y + i.height
      ) {
        if (i.name === "trap") {
          this.health = 0;
          i.switchSprites("attack");
          console.log(i.image);
          setTimeout(() => {
            placedItems.splice(ind, 1);
          }, 500);
          return;
        }
        if (this.position.x < i.position.x) {
          console.log("left");
          this.position.x = i.position.x - this.width;
          this.velocity.x = 0;
          if (this.dir === "left") {
            this.switchSprites("idleLeft");
          } else if (this.dir === "right") {
            this.switchSprites("idleRight");
          }
        } else if (this.position.x > i.position.x) {
          console.log("right");
          this.position.x = i.position.x + i.width;
          this.velocity.x = 0;
          if (this.dir === "left") {
            this.switchSprites("idleLeft");
          } else if (this.dir === "right") {
            this.switchSprites("idleRight");
          }
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
          if (i.velocity.x === 0) this.switchSprites("idle");
        } else if (this.position.x > i.position.x) {
          console.log("right");
          this.position.x = i.position.x + i.width;
          this.velocity.x = 0;
          if (i.velocity.x === 0) this.switchSprites("idle");
        }
      }
    });

    const diff = player.position.x - this.position.x;
    const i = diff > 0 ? 1 : diff === 0 ? 0 : -1;
    if (!this.attacked) this.velocity.x = this.velocityMag * i;

    if (this.velocity.x > 0) {
      this.dir = "right";
    } else if (this.velocity.x < 0) {
      this.dir = "left";
    }

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
      this.inRange = true;
    } else {
      this.inRange = false;
    }
  }

  attack({ player }) {
    if (!this.attacked) {
      this.velocity.x = 0;
      this.attacked = true;
      setTimeout(() => {
        if (this.inRange) {
          if (player.skill !== "infinity") player.health -= 30;
        }
        this.explode = true;
        setTimeout(() => {
          zombies.splice(zombies.indexOf(this), 1);
          delete this;
          scoreBoard.refresh({ player });
        }, 1000);
      }, 1000);
    }
  }

  switchSprites(sprite) {
    switch (sprite) {
      case "idleLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "idleRight":
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
      case "walkRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;

      case "hurtLeft":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "hurtRight":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
      case "explode":
        if (this.currentSprite !== sprite) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.currentSprite = sprite;
        }
        break;
    }
  }
}
