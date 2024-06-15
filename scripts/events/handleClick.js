import { inventory, mouse, placedItems } from "../index.js";
import { state } from "../../GLOBAL/state.js";
import { Block } from "../objects/Blocks.js";
import { items } from "../../GLOBAL/defensiveItems.js";
import { Trap } from "../objects/Trap.js";

export default function click({ weapon }) {
  if (state.phase === "prepare") {
    switch (inventory.selectedItem) {
      case "block":
        const block = new Block({
          position: { x: mouse.x, y: mouse.y },
        });
        placedItems.push(block);
        items[inventory.selectedItem].count--;
        if (items[inventory.selectedItem].count <= 0)
          inventory.selectedItem = null;
        break;
      case "trap":
        const trap = new Trap({
          position: { x: mouse.x, y: mouse.y },
        });
        placedItems.push(trap);
        items[inventory.selectedItem].count--;
        if (items[inventory.selectedItem].count <= 0)
          inventory.selectedItem = null;
        break;
    }
  }
  if (state.phase === "play") {
    if (state.fireMode === "single") weapon.fire();
  }
}
