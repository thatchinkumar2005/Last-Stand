import { state } from "../../GLOBAL/state.js";
import { inventory, sideBar } from "../index.js";

export default function keyDown({ e, keys }) {
  console.log(e.key);
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      console.log("w on");
      keys.w.pressed = true;
      break;
    case "Control":
      keys.Control.pressed = true;
      break;
    case " ":
      keys.space.pressed = true;
      if (state.phase === "prepare") {
        state.phase = "play";
        sideBar.refresh();
        inventory.items = [];
      }
      break;
    case "Shift":
      inventory.toggle();
      console.log(inventory);
      inventory.refresh();
      break;

    case "Escape":
      inventory.selectedItem = null;
      break;
    case "F10":
      state.fireMode = state.fireMode === "single" ? "auto" : "single";
      console.log(state.fireMode);
      break;
  }
}
