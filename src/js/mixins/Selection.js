(()=> {
  const {
    CELL,
    CELL_SELECTION,
    ROW,
    ROW_SELECTED,
    ROW_GROUP,
    ROW_GROUP_CELL_SELECTION,
    INPUT_CHECKBOX
  } = Fancy.cls;

  const GridMixinSelection = {
    onRowCellSelectionClick(event) {
      const me = this;
      const inputEl = event.target;
      const cell = inputEl.closest(`.${CELL}`);
      const columnIndex = Number(cell.getAttribute('col-index'));
      const row = cell.closest(`.${ROW}`);
      const itemId = row.getAttribute('row-id');
      const column = me.columns[columnIndex];
      const store = me.store;
      const item = store.idItemMap.get(itemId);
      const selected = !item.$selected;
      const group = item.$rowGroupValue;

      store.selectRowItem(item, selected);

      if(selected){
        row.classList.add(ROW_SELECTED);
      }
      else{
        row.classList.remove(ROW_SELECTED);
      }

      if(column.headerCheckboxSelection){
       me.updateHeaderCheckboxSelection(column);
      }

      if(group){
        me.updateRowGroupRowsAndCheckBoxes();
      }
    },

    onRowGroupCellSelectionClick(event){
      const me = this;
      const inputEl = event.target;
      const row = inputEl.closest(`.${ROW_GROUP}`);
      const itemId = row.getAttribute('row-id');
      const store = me.store;
      const item = store.idItemMap.get(itemId);
      const selected = !item.$selected;
      const group = item.$rowGroupValue;

      store.selectGroupRowItems(item, selected);

      if(selected){
        row.classList.add(ROW_SELECTED);
      }
      else{
        row.classList.remove(ROW_SELECTED);
      }

      me.scroller.columnsViewRange.forEach(columnIndex => {
        const column = me.columns[columnIndex];
        if(column.headerCheckboxSelection){
          me.updateHeaderCheckboxSelection(column);
        }
      });

      store.groupsChildren[group].forEach(child => {
        const childRow = me.bodyEl.querySelector(`[row-id="${child.id}"]`);

        if(!childRow){
          return;
        }

        const childRowCheckBox = childRow.querySelector(`.${INPUT_CHECKBOX}`);

        if(selected){
          childRow.classList.add(ROW_SELECTED);
          if(childRowCheckBox){
            childRowCheckBox.checked = true;
          }
        }
        else{
          childRow.classList.remove(ROW_SELECTED);
          if(childRowCheckBox){
            childRowCheckBox.checked = false;
          }
        }
      });

      if(group){
        me.updateRowGroupRowsAndCheckBoxes();
        me.updateRowsAndCheckBoxes();
      }
    },

    updateRowGroupRowsAndCheckBoxes(){
      const me = this;
      const store = me.store;

      me.bodyEl.querySelectorAll(`.${ROW_GROUP}`).forEach(row => {
        const group = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');
        const checkBoxEl = row.querySelector(`.${ROW_GROUP_CELL_SELECTION} .${INPUT_CHECKBOX}`)
        const groupSelectedStatus = store.groupDetails[group].selectedStatus;

        switch (groupSelectedStatus){
          case false:
            row.classList.remove(ROW_SELECTED);
            checkBoxEl.indeterminate = false;
            checkBoxEl.checked = false;
            break;
          case 'full':
            row.classList.add(ROW_SELECTED);
            checkBoxEl.checked = true;
            checkBoxEl.indeterminate = false;
            break;
          case 'partly':
            row.classList.remove(ROW_SELECTED);
            checkBoxEl.indeterminate = true;
            break;
        }
      });
    },

    updateRowsAndCheckBoxes(){
      const me = this;
      const store = me.store;

      me.bodyEl.querySelectorAll(`.${ROW}`).forEach(row => {
        const itemId = row.getAttribute('row-id');
        const item = store.idItemMap.get(itemId);
        if(!item){
          console.error(`store.idItemMap does not contain ${itemId}`);
        }
        const selected = item.$selected;
        const checkBoxEl = row.querySelector(`.${CELL_SELECTION} .${INPUT_CHECKBOX}`);

        if(selected){
          row.classList.add(ROW_SELECTED);
          if(checkBoxEl){
            checkBoxEl.checked = true;
          }
        }
        else{
          row.classList.remove(ROW_SELECTED);
          if(checkBoxEl){
            checkBoxEl.indeterminate = false;
            checkBoxEl.checked = false;
          }
        }
      });
    },

    updateHeaderCheckboxSelection(column){
      const me = this;
      const store = me.store;
      const checkBoxEl = column.headerCheckboxSelectionEl;
      const selectedAmount = store.selectedItemsMap.size;

      if(selectedAmount){
        if(store.getDataTotal() === selectedAmount){
          checkBoxEl.checked = true;
          checkBoxEl.indeterminate = false;
        }
        else {
          checkBoxEl.indeterminate = true;
        }
      }
      else{
        checkBoxEl.indeterminate = false;
        checkBoxEl.checked = false;
      }
    },

    onHeaderCheckboxSelectionClick(event){
      const me = this;
      const store = me.store;
      const inputEl = event.target;
      const selected = inputEl.checked;

      store.selectAll(selected);

      if(store.rowGroups.length){
        me.updateRowGroupRowsAndCheckBoxes();
      }
      me.updateRowsAndCheckBoxes();
    },

    getSelection(){
      const me = this;
      const store = me.store;
      const items = [];

      store.selectedItemsMap.forEach(item => {
        if(!item.$isGroupRow){
          items.push(item);
        }
      });

      return items;
    }
  }

  Object.assign(Grid.prototype, GridMixinSelection);
})();
