(()=> {
  const {
    CELL,
    CELL_SELECTION,
    CELL_SELECTED,
    ACTIVE_CELL,
    ACTIVE_CELL_ROW,
    ROW,
    ROW_SELECTED,
    ROW_GROUP,
    ROW_GROUP_CELL_SELECTION,
    INPUT_CHECKBOX,
    BODY
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

    selectRow(cell){
      const me = this;
      const columnIndex = Number(cell.getAttribute('col-index'));
      const row = cell.closest(`.${ROW}`);
      const itemId = row.getAttribute('row-id');
      const column = me.columns[columnIndex];
      const store = me.store;
      const item = store.idItemMap.get(itemId);
      const selected = !item.$selected;
      const group = item.$rowGroupValue;
      const rowCheckBoxes = row.querySelectorAll(`div.${CELL_SELECTION} input.${INPUT_CHECKBOX}`);

      store.selectRowItem(item, selected);

      if(selected){
        row.classList.add(ROW_SELECTED);
        rowCheckBoxes.forEach(checkBox => {
          checkBox.checked = true;
        });
      }
      else{
        row.classList.remove(ROW_SELECTED);
        rowCheckBoxes.forEach(checkBox => {
          checkBox.checked = false;
        });
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

    onBodyCellMouseDown(event) {
      const me = this;
      const target = event.target;
      const cell = target.closest(`.${CELL}`);

      me.hideActiveEditor();

      Fancy.gridsMap.forEach(grid => {
        grid.active = false;
      });
      me.active = true;

      if(me.activeCell){
        me.setActiveCell(cell);
        requestAnimationFrame(()=> {
          document.addEventListener('mousedown', (event) => {
            if (!event.target.closest(`div.${BODY}`)) {
              me.clearActiveCell();
              me.clearSelectionRange();
            }

          }, {
            once: true
          });
        });
      }

      if(me.selectingCells){
        me.isSelectingCells = true;
        document.addEventListener('mouseup', ()=>{
          delete me.isSelectingCells;
        }, {
          once: true
        });
      }
    },

    onBodyCellMouseEnter(event){
      const me = this;
      const target = event.target;
      const cell = target.closest(`.${CELL}`);

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined || me.isSelectingCells !== true){
        return;
      }

      const columnIndex = Number(cell.getAttribute('col-index'));
      const row = cell.closest(`.${ROW}`);
      const itemId = row.getAttribute('row-id');

      me.secondActiveCell = cell;
      me.secondActiveCellColumnIndex = columnIndex;
      me.secondActiveCellRowId = itemId;

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },

    setShiftCellUp(){
      const me = this;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined){
        return;
      }

      const secondActiveCellRowIndex = me.store.idRowIndexesMap.get(me.secondActiveCellRowId);
      const prevRowIndex = grid.store.getPrevVisibleRowIndex(secondActiveCellRowIndex);

      if(prevRowIndex === undefined){
        return;
      }

      const itemId = grid.store.getItemByRowIndex(prevRowIndex).id;

      me.secondActiveCell = me.getCell(prevRowIndex, me.secondActiveCellColumnIndex);
      me.secondActiveCellRowId = itemId;

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },

    setShiftCellDown(){
      const me = this;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined){
        return;
      }

      const secondActiveCellRowIndex = me.store.idRowIndexesMap.get(me.secondActiveCellRowId);
      const nextRowIndex = grid.store.getNextVisibleRowIndex(secondActiveCellRowIndex);

      if(nextRowIndex === undefined){
        return;
      }

      const itemId = grid.store.getItemByRowIndex(nextRowIndex).id;

      me.secondActiveCell = me.getCell(nextRowIndex, me.secondActiveCellColumnIndex);
      me.secondActiveCellRowId = itemId;

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },

    setShiftCellLeft(){
      const me = this;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined){
        return;
      }

      const columnIndex = me.getPrevVisibleColumnIndex(me.secondActiveCellColumnIndex);
      const rowIndex = grid.store.idRowIndexesMap.get(me.secondActiveCellRowId);

      if(columnIndex === undefined){
        return;
      }

      me.secondActiveCellColumnIndex = columnIndex;
      me.secondActiveCell = me.getCell(rowIndex, columnIndex);

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },

    setShiftCellRight(){
      const me = this;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined){
        return;
      }

      const columnIndex = me.getNextVisibleColumnIndex(me.secondActiveCellColumnIndex);
      const rowIndex = grid.store.idRowIndexesMap.get(me.secondActiveCellRowId);

      if(columnIndex === undefined){
        return;
      }

      me.secondActiveCellColumnIndex = columnIndex;
      me.secondActiveCell = me.getCell(rowIndex, columnIndex);

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },

    clearActiveCell(){
      const me = this;

      me.activeCellEl?.classList.remove(ACTIVE_CELL);
      me.activeCellRowEl?.classList.remove(ACTIVE_CELL_ROW);

      delete me.activeCellEl;
      delete me.activeCellRowEl;
      delete me.activeCellColumnIndex;
      delete me.activeCellColumn;
      delete me.activeCellRowId;

      // if(me.$signalActiveCell){
      //   me.$signalControllerActiveCell.abort();
      // }
    },

    setActiveCell(cell){
      const me = this;
      const row = cell.closest(`.${ROW}`);

      const prevRowIndex = Number(me.activeCellRowEl?.getAttribute('row-index'));
      const newRowIndex = Number(row.getAttribute('row-index'));

      const columnIndex = Number(cell.getAttribute('col-index'));
      const itemId = row.getAttribute('row-id');
      const column = me.columns[columnIndex];

      if(me.selectionCellsRange){
        me.clearSelectionRange();
      }

      me.activeCellEl?.classList.remove(ACTIVE_CELL);
      me.activeCellEl = cell;
      me.activeCellEl.classList.add(ACTIVE_CELL);

      me.activeCellRowEl?.classList.remove(ACTIVE_CELL_ROW);
      me.activeCellRowEl = row;
      me.activeCellRowEl.classList.add(ACTIVE_CELL_ROW);

      me.activeCellColumnIndex = columnIndex;
      me.activeCellColumn = column;
      me.activeCellRowId = itemId;

      me.secondActiveCell = cell;
      me.secondActiveCellColumnIndex = columnIndex;
      me.secondActiveCellRowId = itemId;

      const rect = me.bodyEl.getBoundingClientRect();
      const rowTop = Fancy.getTranslateY(row);
      const rowRect = row.getBoundingClientRect();

      if(rect.height + me.scroller.scrollTop < rowTop + rowRect.height){
        const delta = newRowIndex - prevRowIndex;
        me.scroller.deltaChange(-rowRect.height * delta);
      }
      else if(me.scroller.scrollTop > rowTop){
        const delta = prevRowIndex - newRowIndex;
        me.scroller.deltaChange(delta * rowRect.height);
      }
      else if(rect.width + me.scroller.scrollLeft < column.left + column.width){
        const delta = (column.left + column.width) - (rect.width + me.scroller.scrollLeft);
        me.scroller.horizontalDeltaChange(-delta - me.scroller.scrollBarWidth - 2);
      }
      else if(me.scroller.scrollLeft > column.left){
        const delta = me.scroller.scrollLeft - column.left;
        me.scroller.horizontalDeltaChange(delta + 2);
      }
    },

    scrollToCell(cell){
      const me = this;
      const row = cell.closest(`.${ROW}`);
      const rect = me.bodyEl.getBoundingClientRect();
      const rowTop = Fancy.getTranslateY(row);
      const rowRect = row.getBoundingClientRect();
      const columnIndex = Number(cell.getAttribute('col-index'));
      const column = me.columns[columnIndex];

      if(rect.height + me.scroller.scrollTop < rowTop + rowRect.height){
        const delta = me.rowHeight;
        me.scroller.deltaChange(-delta);
      }
      else if(me.scroller.scrollTop > rowTop){
        const delta = me.rowHeight;
        me.scroller.deltaChange(delta);
      }
      else if(rect.width + me.scroller.scrollLeft < column.left + column.width){
        const delta = (column.left + column.width) - (rect.width + me.scroller.scrollLeft);
        me.scroller.horizontalDeltaChange(-delta - me.scroller.scrollBarWidth - 2);
      }
      else if(me.scroller.scrollLeft > column.left){
        const delta = me.scroller.scrollLeft - column.left;
        me.scroller.horizontalDeltaChange(delta + 2);
      }
    },

    hasActiveCell(){
      const me = this;

      return me.activeCellColumn !== undefined && me.activeCellRowId !== undefined && me.activeCellColumnIndex !== undefined;
    },

    scrollToNotVisibleNewActiveCell(newRowIndex, columnIndex){
      const me = this;

      const delta = me.scroller.scrollTop - (newRowIndex - 1) * me.rowHeight;
      me.$preventActiveCellRender = true;
      me.scroller.deltaChange(delta);
      setTimeout(()=>{
        const cell = me.getCell(newRowIndex, columnIndex);
        if (cell) {
          me.setActiveCell(cell);
        }
      },0);
    },

    setActiveCellUp(){
      const me = this;
      const columnIndex = me.activeCellColumnIndex;
      const row = me.activeCellRowEl;
      const rowIndex = Number(row.getAttribute('row-index'));
      const newRowIndex = me.store.getPrevVisibleRowIndex(rowIndex);

      if(newRowIndex === rowIndex || newRowIndex === undefined){
        if(newRowIndex === undefined && me.scroller.scrollTop !== 0){
          me.scroller.deltaChange(rowIndex * me.rowHeight);
        }

        return;
      }

      const cell = me.getCell(newRowIndex, columnIndex);
      if(cell){
        me.setActiveCell(cell);
      }
      else {
        me.scrollToNotVisibleNewActiveCell(newRowIndex, columnIndex);
      }
    },

    setActiveCellDown(){
      const me = this;
      const columnIndex = me.activeCellColumnIndex;
      const row = me.activeCellRowEl;
      const rowIndex = Number(row.getAttribute('row-index'));
      const totalDisplayed = me.store.getDisplayedDataTotal();
      const newRowIndex = me.store.getNextVisibleRowIndex(rowIndex);

      if(newRowIndex === rowIndex || newRowIndex === undefined){
        if(newRowIndex === undefined){
          const delta = totalDisplayed - rowIndex;
          me.scroller.deltaChange(-delta * me.rowHeight);
        }

        return false;
      }

      const cell = me.getCell(newRowIndex, columnIndex);
      if(cell) {
        me.setActiveCell(cell);
      }
      else {
        me.scrollToNotVisibleNewActiveCell(newRowIndex, columnIndex);
      }

      return cell;
    },

    setActiveCellLeft(){
      const me = this;
      const columnIndex = me.activeCellColumnIndex;
      const newColumnIndex = me.getPrevVisibleColumnIndex(columnIndex);
      const row = me.activeCellRowEl;
      const rowIndex = Number(row.getAttribute('row-index'));

      if(newColumnIndex === columnIndex || newColumnIndex === undefined){
        return;
      }

      const cell = me.getCell(rowIndex, newColumnIndex);
      if(cell){
        me.setActiveCell(cell);
      }
      else{
        me.scrollToNotVisibleNewActiveCell(rowIndex, newColumnIndex);
      }
    },

    setActiveCellRight(){
      const me = this;
      const row = me.activeCellRowEl;
      const rowIndex = Number(row.getAttribute('row-index'));
      const columnIndex = me.activeCellColumnIndex;
      const newColumnIndex = me.getNextVisibleColumnIndex(columnIndex);

      if(newColumnIndex === columnIndex || newColumnIndex === undefined){
        return false;
      }

      const cell = me.getCell(rowIndex, newColumnIndex);
      if(cell){
        me.setActiveCell(cell);
      }
      else{
        me.scrollToNotVisibleNewActiveCell(rowIndex, newColumnIndex);
      }

      return cell;
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
    },

    generateCellsSelectionRange(){
      const me = this;
      const activeCellRowIndex = me.store.idRowIndexesMap.get(me.activeCellRowId);
      const secondActiveCellRowIndex = me.store.idRowIndexesMap.get(me.secondActiveCellRowId);
      const rows = [];
      const columns = [];

      if(activeCellRowIndex <= secondActiveCellRowIndex){
        rows[0] = activeCellRowIndex;
        rows[1] = secondActiveCellRowIndex;
      }
      else {
        rows[0] = secondActiveCellRowIndex;
        rows[1] = activeCellRowIndex;
      }

      if(me.activeCellColumnIndex <= me.secondActiveCellColumnIndex){
        columns[0] = me.activeCellColumnIndex;
        columns[1] = me.secondActiveCellColumnIndex;
      }
      else{
        columns[0] = me.secondActiveCellColumnIndex;
        columns[1] = me.activeCellColumnIndex;
      }

      me.selectionCellsRange = {
        rows,
        columns
      };
    },

    selectCellsFromRange(){
      const me = this;
      const selectedCells = me.bodyEl.querySelectorAll(`div.${CELL_SELECTED}`);

      selectedCells.forEach(cell => {
        if(me.isCellInSelectedRange(cell) === false){
          cell.classList.remove(CELL_SELECTED);
        }
      });

      const {
        rows,
        columns
      } = me.selectionCellsRange;

      if(rows[0] < me.scroller.startRow){
        rows[0] = me.scroller.startRow;
      }

      if(rows[1] > me.scroller.endRow){
        rows[1] = me.scroller.endRow;
      }

      if(columns[0] < me.scroller.columnViewStart){
        columns[0] = me.scroller.columnViewStart;
      }

      if(columns[1] > me.scroller.columnViewEnd){
        columns[1] = me.scroller.columnViewEnd;
      }

      for(let i = rows[0];i<=rows[1];i++){
        for(let j = columns[0];j<=columns[1];j++){
          const cell = me.bodyEl.querySelector(`div.${ROW}[row-index="${i}"] div.${CELL}[col-index="${j}"]`);

          if(cell && !cell.classList.contains(CELL_SELECTED)) {
            cell.classList.add(CELL_SELECTED);
          }
        }
      }
    },

    isCellInSelectedRange(cell){
      const me = this;
      const columnIndex = Number(cell.getAttribute('col-index'));
      const row = cell.closest(`.${ROW}`);

      if(!row){
        return false;
      }

      const rowIndex = Number(row.getAttribute('row-index'));
      const {
        rows,
        columns
      } = me.selectionCellsRange;

      return rowIndex >= rows[0] && rowIndex <= rows[1] && columnIndex >= columns[0] && columnIndex <= columns[1];
    },

    clearSelectionRange(){
      const me = this;
      const selectedCells = me.bodyEl.querySelectorAll(`div.${CELL_SELECTED}`);

      selectedCells.forEach(cell => {
        cell.classList.remove(CELL_SELECTED);
      });

      delete me.selectionCellsRange;
    },

    copySelectedCells(){
      const me = this;
      const text = me.getTextFromSelectionRange();

      Fancy.copyText(text);
    },

    getTextFromSelectionRange(){
      const me = this;
      const {
        rows,
        columns
      } = me.selectionCellsRange || {
        rows: [],
        columns: []
      };
      const data = [];

      for(let i = rows[0];i<=rows[1];i++){
        let item = me.store.getItemByRowIndex(i);
        const rowData = [];

        for(let j = columns[0];j<=columns[1];j++){
          const column = me.columns[j];
          let cellInner;
          let value = item[column.index];

          if(column.render){
            cellInner = column.render({
              item,
              column,
              rowIndex: i,
              columnIndex: j,
              value
            })
          }
          else {
            cellInner = value;
          }

          rowData.push(cellInner);
        }

        data.push(rowData);
      }

      return data.map(row => row.join('\t')).join('\n');
    },

    insertCopiedCells(){
      const me = this;
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.focus();
      document.addEventListener('paste', (event) => {
        const text = event.clipboardData.getData('text');
        if(document.body.contains(textarea)){
          document.body.removeChild(textarea);
        }

        const rows = text.split('\n');
        const data = rows.map(row => {
          const columns = row.split('\t');
          return [columns[0], Number(columns[1]), Number(columns[2])];
        });

        const activeRowIndex = Number(me.activeCellRowEl.getAttribute('row-index'));

        data.forEach((dataRow, itemRowIndex)=>{
          const rowIndex = activeRowIndex + itemRowIndex;
          const item = me.store.getItemByRowIndex(rowIndex);
          const rowEl = me.bodyEl.querySelector(`.${ROW}[row-index="${rowIndex}"]`);

          dataRow.forEach((value, itemColumnIndex)=>{
            const columnIndex = me.activeCellColumnIndex + itemColumnIndex;
            const column = me.columns[columnIndex];

            me.store.setById(item.id,column.index, value);

            let cell = rowEl.querySelector(`[col-index="${columnIndex}"]`);

            cell?.remove();

            cell = me.createCell(rowIndex, columnIndex);
            rowEl.appendChild(cell);
          });
        });


      });
    }
  }

  Object.assign(Grid.prototype, GridMixinSelection);
})();
