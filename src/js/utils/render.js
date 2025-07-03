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
      !column.editable && e.preventDefault();
    });

    inputEl.addEventListener('change', (e)=>{
      column.onCheckBoxChange?.(e, inputEl.checked);
    });

    cell.classList.add(Fancy.cls.CELL_BOOLEAN);

    cell.appendChild(inputEl);
  },
  order(params){
    const {
      cell,
      rowIndex
    } = params;

    // For copy CTRL + C
    if(!cell){
      return Number(rowIndex) + 1;
    }

    cell.classList.add(Fancy.cls.CELL_ORDER);

    cell.innerHTML = rowIndex + 1;
  }
}
