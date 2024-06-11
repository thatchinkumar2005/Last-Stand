import { inventory, mouse, placedItems } from "../index.js";
import { state } from "../../GLOBAL/state.js";
import { Block } from "../objects/Blocks.js";

export default function click({ weapon }) {
  if (state.phase === "prepare") {
    switch (inventory.selectedItem) {
      case "block":
        const item = new Block({
          position: { x: mouse.x, y: mouse.y },
          otherItems: structuredClone(placedItems),
        });
        placedItems.push(item);
        let index = 0;

        for (let item in inventory.items.prepare) {
          if (item.name === inventory.selectedItem) {
            index = inventory.items.prepare.indexOf(item);
            break;
          }
        }
        inventory.items.prepare[index].count--;
        if (inventory.items.prepare[index].count === 0)
          inventory.selectedItem = null;
        console.log(inventory.items);
        break;
    }
  }
  if (state.phase === "play") {
    if (state.fireMode === "single") weapon.fire();
  }
}
