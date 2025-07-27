(() => {
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

  /**
   * @mixin GridMixinSelection
   */
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
      row.classList[selected? 'add' : 'remove' ](ROW_SELECTED);

      column.headerCheckboxSelection && me.updateHeaderCheckboxSelection(column);
      group && me.updateRowGroupRowsAndCheckBoxes();
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
      row.classList[selected?'add':'remove'](ROW_SELECTED);
      rowCheckBoxes.forEach(checkBox => checkBox.checked = selected);

      column.headerCheckboxSelection && me.updateHeaderCheckboxSelection(column);
      group && me.updateRowGroupRowsAndCheckBoxes();
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
      row.classList[selected?'add':'remove'](ROW_SELECTED);

      me.updateHeaderCheckboxesSelection();

      store.groupsChildren[group].forEach(child => {
        const childRow = me.bodyEl.querySelector(`[row-id="${child.id}"]`);

        if(!childRow) return;

        const childRowCheckBox = childRow.querySelector(`.${INPUT_CHECKBOX}`);
        childRow.classList[selected?'add':'remove'](ROW_SELECTED);
        if(childRowCheckBox){
          childRowCheckBox.checked = selected;
        }
      });

      if(group){
        me.updateRowGroupRowsAndCheckBoxes();
        me.updateRowsAndCheckBoxes();
      }
    },
    updateHeaderCheckboxesSelection(){
      const me = this;

      me.scroller.columnsViewRange.forEach(columnIndex => {
        const column = me.columns[columnIndex];
        column.headerCheckboxSelection && me.updateHeaderCheckboxSelection(column);
      });
    },
    updateRowGroupRowsAndCheckBoxes(){
      const me = this;
      const store = me.store;

      me.bodyEl.querySelectorAll(`.${ROW_GROUP}`).forEach(row => {
        const group = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');
        const checkBoxEl = row.querySelector(`.${ROW_GROUP_CELL_SELECTION} .${INPUT_CHECKBOX}`);
        const groupDetail = store.filters.length? store.groupDetailsForFiltering[group] : store.groupDetails[group];

        if (!groupDetail) return;

        const groupSelectedStatus = groupDetail.selectedStatus;

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
        if(!item) console.error(`FG-Grid: store.idItemMap does not contain ${itemId}`);

        const selected = item.$selected;
        const checkBoxEl = row.querySelector(`.${CELL_SELECTION} .${INPUT_CHECKBOX}`);
        row.classList[selected?'add':'remove'](ROW_SELECTED);

        if(selected){
          if(checkBoxEl) (checkBoxEl.checked = true);
        } else {
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
        const setActivateCell = () => {
          me.setActiveCell(cell);
          requestAnimationFrame(() => {
            document.addEventListener('mousedown', (event) => {
              if (!event.target.closest(`div.${BODY}`)) {
                me.clearActiveCell();
                me.clearSelectionRange();
              }

            }, {
              once: true
            });
          });
        };

        if(target.getAttribute('type') === 'checkbox'){
          target.addEventListener('click', () => {
            setActivateCell();
          }, {
            once: true
          });
        }
        else{
          setActivateCell();
        }
      }

      if(me.selectingCells){
        me.isSelectingCells = true;
        document.addEventListener('mouseup', () => {
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

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined || me.isSelectingCells !== true) return;

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
      const store = me.store;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined) return;

      const secondActiveCellRowIndex = store.idRowIndexesMap.get(me.secondActiveCellRowId);
      const prevRowIndex = store.getPrevVisibleRowIndex(secondActiveCellRowIndex);

      if(prevRowIndex === undefined) return;

      const itemId = store.getItemByRowIndex(prevRowIndex).id;

      me.secondActiveCell = me.getCell(prevRowIndex, me.secondActiveCellColumnIndex);
      me.secondActiveCellRowId = itemId;

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },
    setShiftCellDown(){
      const me = this;
      const store = me.store;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined) return;

      const secondActiveCellRowIndex = store.idRowIndexesMap.get(me.secondActiveCellRowId);
      const nextRowIndex = store.getNextVisibleRowIndex(secondActiveCellRowIndex);

      if (nextRowIndex === undefined) return;

      const itemId = store.getItemByRowIndex(nextRowIndex).id;

      me.secondActiveCell = me.getCell(nextRowIndex, me.secondActiveCellColumnIndex);
      me.secondActiveCellRowId = itemId;

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },
    setShiftCellLeft(){
      const me = this;
      const store = me.store;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined) return;

      const columnIndex = me.getPrevVisibleColumnIndex(me.secondActiveCellColumnIndex);
      const rowIndex = store.idRowIndexesMap.get(me.secondActiveCellRowId);

      if (columnIndex === undefined) return;

      me.secondActiveCellColumnIndex = columnIndex;
      me.secondActiveCell = me.getCell(rowIndex, columnIndex);

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },
    setShiftCellRight(){
      const me = this;
      const store = me.store;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined) return;

      const columnIndex = me.getNextVisibleColumnIndex(me.secondActiveCellColumnIndex);
      const rowIndex = store.idRowIndexesMap.get(me.secondActiveCellRowId);

      if (columnIndex === undefined) return;

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
    },
    setActiveCell(cell){
      const me = this;
      const scroller = me.scroller;
      const row = cell.closest(`.${ROW}`);

      const prevRowIndex = Number(me.activeCellRowEl?.getAttribute('row-index'));
      const newRowIndex = Number(row.getAttribute('row-index'));

      const columnIndex = Number(cell.getAttribute('col-index'));
      const itemId = row.getAttribute('row-id');
      const column = me.columns[columnIndex];

      me.selectionCellsRange && me.clearSelectionRange();

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

      if(rect.height + scroller.scrollTop < rowTop + rowRect.height){
        const delta = newRowIndex - prevRowIndex;
        scroller.deltaChange(-rowRect.height * delta);
      }
      else if(scroller.scrollTop > rowTop){
        const delta = prevRowIndex - newRowIndex;
        scroller.deltaChange(delta * rowRect.height);
      }
      else if(rect.width + scroller.scrollLeft < column.left + column.width){
        const delta = (column.left + column.width) - (rect.width + scroller.scrollLeft);
        scroller.horizontalDeltaChange(-delta - scroller.scrollBarWidth - 2);
      }
      else if(scroller.scrollLeft > column.left){
        const delta = scroller.scrollLeft - column.left;
        scroller.horizontalDeltaChange(delta + 2);
      }
    },
    scrollToCell(cell){
      const me = this;
      const scroller = me.scroller;
      const row = cell.closest(`.${ROW}`);
      const rect = me.bodyEl.getBoundingClientRect();
      const rowTop = Fancy.getTranslateY(row);
      const rowRect = row.getBoundingClientRect();
      const columnIndex = Number(cell.getAttribute('col-index'));
      const column = me.columns[columnIndex];

      if(rect.height + scroller.scrollTop < rowTop + rowRect.height){
        const delta = me.rowHeight;
        scroller.deltaChange(-delta);
      }
      else if(scroller.scrollTop > rowTop){
        const delta = me.rowHeight;
        scroller.deltaChange(delta);
      }
      else if(rect.width + scroller.scrollLeft < column.left + column.width){
        const delta = (column.left + column.width) - (rect.width + scroller.scrollLeft);
        scroller.horizontalDeltaChange(-delta - scroller.scrollBarWidth - 2);
      }
      else if(scroller.scrollLeft > column.left){
        const delta = scroller.scrollLeft - column.left;
        scroller.horizontalDeltaChange(delta + 2);
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
      setTimeout(() => {
        const cell = me.getCell(newRowIndex, columnIndex);
        cell && me.setActiveCell(cell);
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
      if (cell) {
        me.setActiveCell(cell);
      } else {
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

      if(newColumnIndex === columnIndex || newColumnIndex === undefined) return;

      const cell = me.getCell(rowIndex, newColumnIndex);
      if(cell){
        me.setActiveCell(cell);
      } else{
        me.scrollToNotVisibleNewActiveCell(rowIndex, newColumnIndex);
      }

      return cell;
    },
    setActiveCellRight(){
      const me = this;
      const row = me.activeCellRowEl;
      const rowIndex = Number(row.getAttribute('row-index'));
      const columnIndex = me.activeCellColumnIndex;
      const newColumnIndex = me.getNextVisibleColumnIndex(columnIndex);

      if(newColumnIndex === columnIndex || newColumnIndex === undefined) return false;

      const cell = me.getCell(rowIndex, newColumnIndex);
      if(cell){
        me.setActiveCell(cell);
      } else {
        me.scrollToNotVisibleNewActiveCell(rowIndex, newColumnIndex);
      }

      return cell;
    },
    updateHeaderCheckboxSelection(column){
      const me = this;
      if(!column){
        me.scroller.columnsViewRange.forEach(columnIndex => {
          const column = me.columns[columnIndex];

          column.headerCheckboxSelection && me.updateHeaderCheckboxSelection(column);
        });

        return;
      }

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
      store.rowGroups.length && me.updateRowGroupRowsAndCheckBoxes();
      me.updateRowsAndCheckBoxes();
    },
    getSelection(){
      const items = [];

      this.store.selectedItemsMap.forEach(item => !item.$isGroupRow && items.push(item));

      return items;
    },
    generateCellsSelectionRange(){
      const me = this;
      const store = me.store;
      const activeCellRowIndex = store.idRowIndexesMap.get(me.activeCellRowId);
      const secondActiveCellRowIndex = store.idRowIndexesMap.get(me.secondActiveCellRowId);
      const rows = [];
      const columns = [];

      if(activeCellRowIndex <= secondActiveCellRowIndex){
        rows[0] = activeCellRowIndex;
        rows[1] = secondActiveCellRowIndex;
      } else {
        rows[0] = secondActiveCellRowIndex;
        rows[1] = activeCellRowIndex;
      }

      if(me.activeCellColumnIndex <= me.secondActiveCellColumnIndex){
        columns[0] = me.activeCellColumnIndex;
        columns[1] = me.secondActiveCellColumnIndex;
      } else {
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

      if(rows[0] < me.scroller.startRow) (rows[0] = me.scroller.startRow);
      if(rows[1] > me.scroller.endRow) (rows[1] = me.scroller.endRow);

      if(columns[0] < me.scroller.columnViewStart) (columns[0] = me.scroller.columnViewStart);
      if(columns[1] > me.scroller.columnViewEnd) (columns[1] = me.scroller.columnViewEnd);

      for(let i = rows[0];i<=rows[1];i++){
        for(let j = columns[0];j<=columns[1];j++){
          const cell = me.bodyEl.querySelector(`div.${ROW}[row-index="${i}"] div.${CELL}[col-index="${j}"]`);

          if (cell && !cell.classList.contains(CELL_SELECTED)) cell.classList.add(CELL_SELECTED);
        }
      }
    },
    isCellInSelectedRange(cell){
      const me = this;
      const columnIndex = Number(cell.getAttribute('col-index'));
      const row = cell.closest(`.${ROW}`);

      if(!row) return false;

      const rowIndex = Number(row.getAttribute('row-index'));
      const {
        rows,
        columns
      } = me.selectionCellsRange;

      return rowIndex >= rows[0] && rowIndex <= rows[1] && columnIndex >= columns[0] && columnIndex <= columns[1];
    },
    clearSelectionRange(){
      const selectedCells = this.bodyEl.querySelectorAll(`div.${CELL_SELECTED}`);

      selectedCells.forEach(cell => cell.classList.remove(CELL_SELECTED));

      delete this.selectionCellsRange;
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

      const getCellInner = (options) => {
        const column = options.column;
        const value = options.value;
        let cellInner;

        if(column.getter){
          cellInner = column.getter(options);
        }
        else if(column.render){
          // For cases when column.render uses dom cell
          try {
            cellInner = column.render(options);
          } catch (e) {
            cellInner = value;
          }
        }
        else {
          cellInner = value;
        }

        return cellInner;
      };

      if(rows.length === 0 && me.activeCellEl){
        const row = me.activeCellEl.closest(`.${ROW}`);
        if (!row) return;

        const itemId = row.getAttribute('row-id');
        const item = me.store.idItemMap.get(itemId);
        const columnIndex = Number(me.activeCellEl.getAttribute('col-index'));
        const column = me.columns[columnIndex];
        const rowIndex = row.getAttribute('row-index');
        const value = item[column.index];
        const cellInner = getCellInner({
          item,
          column,
          rowIndex,
          columnIndex,
          value
        });

        return cellInner;
      }

      for(let i = rows[0];i<=rows[1];i++){
        let item = me.store.getItemByRowIndex(i);
        const rowData = [];

        for(let j = columns[0];j<=columns[1];j++){
          const column = me.columns[j];
          const value = item[column.index];
          const cellInner = getCellInner({
            item,
            column,
            rowIndex: i,
            columnIndex: j,
            value
          });

          rowData.push(cellInner);
        }

        data.push(rowData);
      }

      return data.map(row => row.join('\t')).join('\n');
    },
    insertCopiedCells(){
      const me = this;
      const textarea = document.createElement('textarea');
      textarea.style.display = 'none';
      document.body.appendChild(textarea);
      textarea.focus();

      const getRowsOffSet = (rowIndex, offset = 0) => {
        const row = me.bodyEl.querySelector(`div[row-index="${rowIndex + offset}"]`);

        if (!row) return offset;
        if (row.classList.contains(ROW_GROUP)) return getRowsOffSet(rowIndex, offset + 1);

        return offset;
      };

      document.addEventListener('paste', (event) => {
        const text = event.clipboardData.getData('text');
        if(document.body.contains(textarea)){
          document.body.removeChild(textarea);
        }

        const rows = text.split('\n');
        const data = rows.map(row => {
          const rowData = row.split('\t');

          return rowData;
        });

        const activeRowIndex = Number(me.activeCellRowEl.getAttribute('row-index'));
        let rowOffset = 0;

        data.forEach((dataRow, itemRowIndex) => {
          const extraRowsOffset = getRowsOffSet(activeRowIndex + itemRowIndex + rowOffset);
          rowOffset += extraRowsOffset;

          const rowIndex = activeRowIndex + itemRowIndex + rowOffset;
          const item = me.store.getItemByRowIndex(rowIndex);

          if(!item) return;

          const rowEl = me.bodyEl.querySelector(`.${ROW}[row-index="${rowIndex}"]`);

          let columnIndex = me.activeCellColumnIndex - 1;

          dataRow.forEach(value => {
            columnIndex = me.getNextVisibleColumnIndex(columnIndex);

            const column = me.columns[columnIndex];

            if(!column || !column.editable) return;

            me.store.setById(item.id,column.index, value);

            if(!rowEl || !column) return;

            let cell = rowEl.querySelector(`[col-index="${columnIndex}"]`);

            cell?.remove();

            cell = me.createCell(rowIndex, columnIndex);
            rowEl.appendChild(cell);
          });
        });
      });
    },
    setBlankForSelectedCells(){
      const me = this;
      const store = me.store;
      const {
        rows,
        columns
      } = me.selectionCellsRange || {
        rows: [],
        columns: []
      };

      const getCellSetterValue = (options) => {
        const column = options.column;
        let value = options.value;

        if(column.setter){
          value = column.setter(options);
        }

        return value;
      };

      if(rows.length === 0 && me.activeCellEl){
        const rowEl = me.activeCellEl.closest(`.${ROW}`);
        if(!rowEl) return;

        const rowIndex = rowEl.getAttribute('row-index');
        const itemId = rowEl.getAttribute('row-id');
        const item = store.idItemMap.get(itemId);
        const columnIndex = Number(me.activeCellEl.getAttribute('col-index'));
        const column = me.columns[columnIndex];
        const value = getCellSetterValue({
          item,
          column,
          rowIndex,
          columnIndex,
          value: ''
        });

        store.setById(itemId ,column.index, value);

        me.activeCellEl.remove();

        const cell = me.createCell(rowIndex, columnIndex);
        rowEl.appendChild(cell);
        me.activeCellEl = cell;

        return;
      }

      for(let i = rows[0];i<=rows[1];i++){
        const rowIndex = i;
        let item = store.getItemByRowIndex(i);
        const rowEl = me.bodyEl.querySelector(`.${ROW}[row-index="${rowIndex}"]`);

        for(let j = columns[0];j<=columns[1];j++){
          const column = me.columns[j];
          const columnIndex = j;

          const value = getCellSetterValue({
            item,
            column,
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            value: ''
          });

          store.setById(item.id ,column.index, value);

          if(!rowEl || !column) return;

          let cell = rowEl.querySelector(`[col-index="${columnIndex}"]`);

          cell?.remove();

          cell = me.createCell(rowIndex, columnIndex);
          rowEl.appendChild(cell);
        }
      }
    }
  };

  Object.assign(Grid.prototype, GridMixinSelection);
})();
