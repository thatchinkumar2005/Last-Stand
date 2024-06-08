import { state } from "../../GLOBAL/state.js";

export default function keyDown(e, keys, Inventory) {
  console.log(e.key);
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "Control":
      keys.Control.pressed = true;
      break;
    case " ":
      keys.space.pressed = true;
      if (state.phase === "prepare") {
        state.phase = "play";
        Inventory.items = [];
      }
      break;
    case "Shift":
      const inventory = document.querySelector("#inventory");
      inventory.style.display =
        inventory.style.display === "none" ? "flex" : "none";
      console.log(inventory);
      inventory.classList.add("show");
      Inventory.refresh();
      break;

    case "Escape":
      Inventory.selectedItem = null;
      break;
  }
}
