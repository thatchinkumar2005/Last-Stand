export default class Inventory {
  constructor({ items }) {
    this.items = items;
    this.selectedItem = null;

    this.items.forEach((i) => {
      if (i.count === 0) return;
      const item = document.createElement("div");
      item.classList.add(i.name, "inventoryItem");
      inventory.appendChild(item);

      item.onclick = () => {
        if (i.count < 0) {
          i.count = 0;
          this.selectedItem = null;
        }
        this.selectedItem = i.name;
        inventory.style.display = "none";
      };
    });
  }

  refresh() {
    const inventory = document.querySelector("#inventory");
    inventory.innerHTML = "";
    this.items.forEach((i) => {
      if (i.count === 0) return;
      const item = document.createElement("div");
      item.innerHTML = i.name;
      item.classList.add(i.name, "inventoryItem");
      inventory.appendChild(item);

      item.onclick = () => {
        if (i.count < 0) {
          i.count = 0;
          this.selectedItem = null;
        }
        this.selectedItem = i.name;
        inventory.style.display = "none";
      };
    });
  }
}
