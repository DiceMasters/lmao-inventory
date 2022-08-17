item.addEventListener('dragstart', (event: DragEvent) => {
  const { target } = event;

  (target as HTMLElement).classList.add('selected');
});
item.addEventListener('dragover', (event: DragEvent) => {
  // Находим перемещаемый элемент
  const activeElement = inventoryCellContainer.querySelector(`.selected`);
  // Находим элемент, над которым в данный момент находится курсор
  const currentElement = event.target;
  /**
   * Проверяем, что событие сработало:
   * 1. не на том элементе, который мы перемещаем,
   * 2. на элементе с классом item (меняем местами предметы)
   * 3. на элементе с классом inventory-cell (перемещаем на свободную ячейку)
   */
  const isMoveable =
    activeElement !== currentElement &&
    (currentElement as HTMLElement).classList.contains(`inventory-cell`);
  const isReplaceble =
    activeElement !== currentElement &&
    (currentElement as HTMLElement).classList.contains(`item`);

  // Если нет, прерываем выполнение функции
  if (!isMoveable && !isReplaceble) {
    return;
  }

  if (isReplaceble) {
    this.replace(activeElement as HTMLElement, currentElement as HTMLElement);
  }

  if (isMoveable) {
    this.move(activeElement as HTMLElement, currentElement as HTMLElement);
  }
});
item.addEventListener('dragend', (event: DragEvent) => {
  this._redraw();

  const { target } = event;

  (target as HTMLElement).classList.remove('selected');
});
