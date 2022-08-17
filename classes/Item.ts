import { store } from './../store';

export default class Item {
  id: string;
  name: string;
  icon: string;
  stacked: boolean;
  el: HTMLElement | null = null;

  constructor(id: string, name: string, icon: string, stacked: boolean) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.stacked = stacked;
    this.el = document.createElement('div');

    this._draw();
    this._initListeners();
    this._append();
  }

  _draw() {
    const iconClass = `item--${this.icon}`;

    if (this.el) {
      this.el.classList.add('item');
      this.el.classList.add(iconClass);
      this.el.setAttribute('title', this.name);
      this.el.setAttribute('data-id', this.id);
    }
  }

  _append() {
    const heap = document.getElementsByClassName('heap')[0];

    if (this.el) {
      heap.appendChild(this.el);
    }
  }

  _initListeners() {
    if (this.el) {
      this.el.addEventListener('click', this._take);
    }
  }

  _take(event: MouseEvent) {
    const { target } = event;
    const { inventory } = store.state.inventory;

    inventory.add((target as HTMLElement).dataset.id);
  }
}
