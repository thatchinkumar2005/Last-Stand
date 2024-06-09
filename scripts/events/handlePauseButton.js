import { state } from "../../GLOBAL/state.js";

export default function handlePause() {
  state.isPaused = !state.isPaused;
}
