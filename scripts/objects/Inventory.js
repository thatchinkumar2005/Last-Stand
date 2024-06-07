export default class Inventory {
  constructor({ items }) {
    this.items = items;
    this.selectedItem = null;

    const inventory = document.querySelector("#inventory");
    this.items.forEach((i) => {
      const item = document.createElement("div");
      item.classList.add(i.name, "inventoryItem");
      inventory.appendChild(item);

      item.onclick = () => {
        this.selectedItem = i.name;
      };
    });
  }
}
