export default class Inventory {
  constructor({ items }) {
    this.items = items;
    this.selectedItem = null;
    const inventory = document.querySelector("#inventory");
    this.domElement = inventory;
    this.items.forEach((i) => {
      if (i.count === 0) return;
      const item = document.createElement("div");
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
  }

  refresh() {
    this.domElement.innerHTML = "";
    this.items.forEach((i) => {
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
