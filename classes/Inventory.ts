// <reference types="">

import { store } from './../store';
import interact from 'interactjs';
import Modal from './Modal';

export default class Inventory {
  cellQuantity: number;
  cells: InventoryCell[];
  interactUtils: InventoryCellCoords = {
    x: 0,
    y: 0,
  };

  constructor(quantity: number, inventoryCellsInitials?: InventoryCell[]) {
    /**
     * TODO: Add initial inventory support
     */
    if (quantity > 0) {
      this.cellQuantity = quantity;
      this.cells = [];

      for (let i = 0; i < quantity; i++) {
        const cell = new InventoryCell(null, i);

        this.cells.push(cell);
      }

      this._draw();
    }
  }

  _draw() {
    /**
     * <div class="inventory__wrapper">
     *  <div class="inventory">
     *   <div class="inventory-cell">
     */
    const wrapper = document.createElement('div');
    const inventory = document.createElement('div');

    wrapper.classList.add('inventory__wrapper');
    inventory.classList.add('inventory');

    this._initCells(inventory);

    wrapper.appendChild(inventory);

    const app = document.getElementById('app');

    /**
     * TODO: Вывести все функции отрисовки в отедльный класс инициализации
     */
    app.insertBefore(wrapper, app.childNodes[0]);
  }

  _redraw() {
    const inventoryHTML = document.getElementsByClassName('inventory')[0];

    inventoryHTML.innerHTML = '';
    this._initCells(inventoryHTML as HTMLElement, true);
  }

  _initCells(inventory: HTMLElement, redraw: boolean = false) {
    this.cells.forEach((cell, index) => {
      const cellElement = document.createElement('div');

      cellElement.classList.add('inventory-cell');
      cellElement.setAttribute('data-index', index.toString());

      if (cell.item) {
        const item = document.createElement('div');
        const { items } = store.state.items;
        const icon = items.find((icon) => icon.id === cell.item);

        /**
         * Init icon class
         */
        item.classList.add('item', `item--${icon.icon}`);
        item.draggable = true;

        /**
         * Init quantity drawing
         */
        if (cell.quantity > 1) {
          const quantity = document.createElement('span');

          quantity.classList.add('inventory-cell__quantity');
          quantity.innerText = cell.quantity.toString();

          item.appendChild(quantity);
        }

        cellElement.appendChild(item);
      }

      inventory.appendChild(cellElement);

      this._initCellInteract(cellElement);
      this._initItemInteract(cellElement);
    });
  }

  _initCellInteract(cell: HTMLElement) {
    interact(cell).dropzone({
      ondrop: (event) => {
        const dropCellIndex = (event.target as HTMLElement).dataset.index;
        const draggableItemCellIndex = (event.relatedTarget as HTMLElement)
          .parentElement.dataset.index;

        [this.cells[dropCellIndex], this.cells[draggableItemCellIndex]] = [
          this.cells[draggableItemCellIndex],
          this.cells[dropCellIndex],
        ];

        this._redraw();
      },
    });
  }

  _initItemInteract(cell: HTMLElement) {
    const item = cell.firstChild;

    if (item) {
      interact(item).draggable({
        listeners: {
          move: (event) => {
            this.interactUtils.x += event.dx;
            this.interactUtils.y += event.dy;

            event.target.style.transform = `translate(${this.interactUtils.x}px, ${this.interactUtils.y}px)`;
          },
          start(event) {
            event.target.classList.add('hide');
          },
          end: (event) => {
            event.target.classList.remove('hide');
            this.interactUtils.x = 0;
            this.interactUtils.y = 0;

            if (event.relatedTarget === null) {
              const parentIndex = (event.target as HTMLElement).parentElement
                .dataset.index;
              const modal = new Modal('Delete Item?', [
                {
                  key: 'delete',
                  text: 'Yes',
                  callback: () => {
                    this._modalDeleteCallback(modal, Number(parentIndex));
                  },
                },
                {
                  key: 'cancel',
                  text: 'No',
                  callback: () => {
                    this._modalCancelCallback(modal);
                  },
                },
              ]);

              modal.state = true;
            }
          },
        },
      });
    }
  }

  _modalDeleteCallback(modal: Modal, parentIndex: number) {
    this.remove(parentIndex);
    this._terminateModal(modal);
    this._redraw();
  }

  _modalCancelCallback(modal: Modal) {
    this._terminateModal(modal);
    this._redraw();
  }

  _terminateModal(modal: Modal) {
    modal.state = false;
    modal._terminate();
    modal = null;
  }

  add(itemId: string) {
    const { items } = store.state.items;
    const addibleItem = items.find((item) => item.id === itemId);

    let stackedItemNotExist = false;

    if (addibleItem.stacked) {
      const index = this.cells.findIndex(
        (cell) => cell.item === itemId && !cell.isFull
      );

      if (index !== -1) {
        this.cells[index].quantity++;
      } else {
        stackedItemNotExist = true;
      }
    }

    if (!addibleItem.stacked || stackedItemNotExist) {
      for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i].isEmpty) {
          this.cells[i].item = itemId;
          this.cells[i].quantity = 1;
          this.cells[i].stack = addibleItem.stack;

          break;
        }
      }
    }

    this._redraw();
  }

  remove(index: number) {
    const { cells } = this;

    this.cells = cells.map((cell) => {
      if (cell.index === index) {
        cell.item = null;
        cell.quantity = 0;
        cell.stack = 1;
      }

      return cell;
    });

    this._redraw();
  }
}

export class InventoryCell {
  index: number;
  _item: string | null;
  _quantity: number;
  stack: number | null;

  constructor(
    item: string | null,
    cellConstructorArrayPosition: number,
    stack: number | null = 1,
    inventoryRows: number = 3
  ) {
    this.index = cellConstructorArrayPosition;
    this._item = item;
    this._quantity = 0;
    this.stack = stack;
  }

  get isEmpty() {
    return !this._item;
  }

  get isFull() {
    return this._quantity === this.stack;
  }

  get item() {
    return this._item;
  }

  set item(id: string) {
    this._item = id;
  }

  get quantity() {
    if (this._quantity !== NaN) {
      return this._quantity;
    }

    return 0;
  }

  set quantity(q: number) {
    this._quantity = q;
  }
}

export interface InventoryCellCoords {
  x: number;
  y: number;
}
