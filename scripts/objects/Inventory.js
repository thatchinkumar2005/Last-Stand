import { state } from "../../GLOBAL/state.js";
import { weaponConfig } from "../../GLOBAL/weaponConfig.js";
import { Weapon } from "./Weapons.js";

export default class Inventory {
  constructor({ items, player }) {
    this.items = items;
    this.selectedItem = null;
    const inventory = document.querySelector("#inventory");
    this.domElement = inventory;
    this.player = player;
    const weapon = new Weapon({
      position: {
        x: 0,
        y: 0,
      },
      height: 30,
      width: 100,
      config: weaponConfig.AR,
      player,
    });
    this.weapon = weapon;
  }

  refresh() {
    const phase = state.phase;
    this.domElement.innerHTML = "";
    if (phase === "prepare") {
      this.items[phase].forEach((i) => {
        if (i.count === 0) return;
        const item = document.createElement("div");
        item.innerHTML = i.name;
        item.classList.add(i.name, "inventoryItem");
        this.domElement.appendChild(item);

        item.onclick = () => {
          if (i.count < 0) {
            i.count = 0;
            this.selectedItem = null;
          }
          this.selectedItem = i.name;
          this.domElement.style.display = "none";
        };
      });
    } else if (phase === "play") {
      for (let weapon in weaponConfig) {
        const item = document.createElement("div");
        item.classList.add(weapon, "inventoryItem");
        item.innerHTML = `<img src="Assets/weapons/${weapon}.png"/>`;
        item.onclick = () => {
          console.log(weapon.name);
          const weaponObj = new Weapon({
            position: {
              x: 0,
              y: 0,
            },
            angle: 0,
            height: 30,
            width: 100,
            config: weaponConfig[weapon],
          });
          delete this.weapon;
          this.weapon = weaponObj;
          this.weapon.player = this.player;
          console.log(this.weapon.name);
          this.toggle();
        };
        this.domElement.appendChild(item);
      }
    }
  }

  show() {
    this.domElement.style.display = "flex";
  }
  hide() {
    this.domElement.style.display = "none";
  }
  toggle() {
    this.domElement.style.display =
      this.domElement.style.display === "none" ? "flex" : "none";
  }
}
