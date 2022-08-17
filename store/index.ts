import { createForme, initStore } from '@statirjs/core';
import { nanoid } from 'nanoid';

import Inventory from '../classes/Inventory';

const inventory = createForme(
  {
    inventory: null as Inventory | null,
  },
  () => ({
    actions: {
      init(state, inventoryInstance: Inventory) {
        return {
          inventory: inventoryInstance,
        };
      },
    },
  })
);

const items = createForme({
  items: [
    {
      id: nanoid(),
      name: 'Duel Swords',
      icon: 'swords',
      stacked: false,
      stack: null,
    },
    {
      id: nanoid(),
      name: 'Crown of Sambadi',
      icon: 'crown',
      stacked: false,
      stack: null,
    },
    {
      id: nanoid(),
      name: 'Vodka Supreme',
      icon: 'elixir',
      stacked: true,
      stack: 5,
    },
  ],
});

export const store = initStore({
  formes: {
    inventory,
    items,
  },
});
