export default class Modal {
  modal: HTMLElement | null;
  _state: boolean = false;
  title: string;
  actions: ModalAction[];

  constructor(title: string, actions: ModalAction[]) {
    this.title = title;
    this.actions = actions;

    this._draw();
  }

  _draw() {
    // Modals container
    const container = document.getElementsByClassName('modal__heap')[0];

    /**
     *  <div class="modal">
     *    <div class="modal__body">
     *      <div class="modal__title">Delete item?</div>
     *      <div class="modal__actions">
     *        <button class="button-js-yes">yes</button>
     *        <button class="button-js-no">no</button>
     */
    this.modal = document.createElement('div');
    const modalBody = document.createElement('div');
    const modalTitle = document.createElement('div');
    const modalActions = document.createElement('div');

    this.modal.classList.add('modal');
    modalBody.classList.add('modal__body');
    modalTitle.classList.add('modal__title');
    modalActions.classList.add('modal__actions');

    modalTitle.innerText = this.title;

    /**
     * Init actions buttons, init listeners
     */
    this.actions.forEach((action) => {
      const button = document.createElement('button');

      button.dataset.key = action.key;
      button.className = `button button-js-${action.key}`;
      button.innerText = action.text;
      button.addEventListener('click', action.callback);

      modalActions.appendChild(button);
    });

    modalBody.appendChild(modalTitle);
    modalBody.appendChild(modalActions);

    this.modal.appendChild(modalBody);

    container.appendChild(this.modal);
  }

  _terminate() {
    const { modal } = this;

    modal.querySelectorAll('button').forEach((button) => {
      const { key } = button.dataset;
      const action = this.actions.find((action) => action.key === key);

      button.removeEventListener('click', action.callback);
    });

    modal.remove();
  }

  set state(value: boolean) {
    if (value) {
      this.modal.classList.add('modal--open');
    } else {
      this.modal.classList.remove('modal--open');
    }

    this._state = value;
  }
}

interface ModalAction {
  key: string;
  text: string;
  callback: (e: Event) => void;
}
