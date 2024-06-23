import { state } from "../../GLOBAL/state.js";
import playAudio from "../../utills/playAudio.js";
import { inventory } from "../index.js";

export default class SideBar {
  constructor() {
    this.domElement = {
      sideBar: document.querySelector("#sideBar"),
      title: document.querySelector("#sideBarTitle"),
      skill: document.querySelector("#skill"),
      weapon: document.querySelector("#weapon"),
    };
    this.domElement.sideBar.addEventListener("mouseenter", () => {
      playAudio({ path: "Assets/hover.mp3" });
    });
    this.domElement.sideBar.onclick = () => {
      inventory.refresh();
      inventory.toggle();
    };
  }

  refresh() {
    console.log("refreshed");
    if (state.phase === "prepare") {
      console.log("hello");
      this.domElement.title.innerHTML = "Prepare For Waves";
    } else if (state.phase === "play") {
      this.domElement.title.innerHTML = `wave ${state.wave}`;
      this.domElement.weapon.innerHTML = `<img src="Assets/weapons/ARRight.png"/>`;
    }
  }
}
