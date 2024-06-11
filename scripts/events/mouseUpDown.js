import { state } from "../../GLOBAL/state.js";
import { mouse } from "../index.js";

export default function mouseUpDown({ e, weapon }) {
  if (e.type === "mousedown") {
    mouse.clicked = true;
  }
  if (e.type === "mouseup") {
    mouse.clicked = false;
  }
  console.log(mouse.clicked);
}
