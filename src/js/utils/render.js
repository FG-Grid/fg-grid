Fancy.render = {
  boolean(params){
    const {
      column,
      value,
      cell
    } = params;

    if(value === ''){
      return;
    }

    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'checkbox');
    inputEl.checked = value;

    inputEl.addEventListener('click', (e) => {
      if(!column.editable){
        e.preventDefault();
      }
    });

    cell.classList.add(Fancy.cls.CELL_BOOLEAN);

    cell.appendChild(inputEl);
  },
  order(params){
    const {
      item,
      cell,
      rowIndex
    } = params;

    if(item.$isGroupRow){
      return;
    }

    cell.classList.add(Fancy.cls.CELL_ORDER);

    cell.innerHTML = rowIndex + 1;
  }
}
