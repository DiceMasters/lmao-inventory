// Import stylesheets
import './style.css';

// Import instances
import Inventory from './classes/Inventory';
import Item from './classes/Item';

// Import store
import { store } from './store';

const { items } = store.state.items;

items.forEach((el) => {
  const item = new Item(el.id, el.name, el.icon, el.stacked);
});

/**
 * Init Global Inventory State
 */
store.dispatch.inventory.init(new Inventory(9));
