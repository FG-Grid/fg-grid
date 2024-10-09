(()=>{
  const {
    CELL,
    CELL_ORDER,
    CELL_WRAPPER,
    CELL_SELECTION,
    ROW,
    ROW_ODD,
    ROW_EVEN,
    ROW_SELECTED,
    ROW_GROUP,
    ROW_GROUP_VALUE_CELL,
    ROW_GROUP_CELL,
    ROW_GROUP_CELL_SELECTION,
    ROW_GROUP_CELL_VALUE,
    ROW_GROUP_CELL_AMOUNT,
    ROW_GROUP_CELL_EXPANDER,
    ROW_GROUP_EXPANDED_CELL,
    ROW_HOVER,
    INPUT_CHECKBOX,
    SVG_ITEM,
    SVG_CHEVRON_RIGHT
  } = Fancy.cls;

  const GridMixinBody = {
    addColumnCells(columnIndexes = []) {
      const me = this;
      const startRow = me.scroller.getStartRow();
      const endRow = me.scroller.getEndRow();

      columnIndexes.forEach(columnIndex => {
        let i = startRow;

        me.appendHeaderCell(columnIndex);

        if (me.filterBar) {
          me.appendFilterBarCell(columnIndex);
        }

        for (; i < endRow; i++) {
          me.appendCell(i, columnIndex);
        }
      });
    },

    appendCell(rowIndex, columnIndex) {
      const me = this;
      const item = me.store.getItemByRowIndex(rowIndex);
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if(rowEl.classList.contains(ROW_GROUP)){
        const column = me.columns[columnIndex];
        if(me.rowGroupType === 'column' && column.$rowGroups){
          const cell = me.createCellGroupTypeColumn(rowIndex, item, columnIndex);
          rowEl.appendChild(cell);
        }
        return;
      }

      const cell = me.createCell(rowIndex, columnIndex);

      rowEl.appendChild(cell);
    },

    createCell(rowIndex, columnIndex) {
        const me = this;
        const store = me.store;
        const item = store.getItemByRowIndex(rowIndex);
        const column = me.columns[columnIndex];
        let value = item[column.index];
        let cellInner;

        const cell = document.createElement('div');

        cell.setAttribute('col-index', columnIndex);
        cell.setAttribute('col-id', column.id);
        cell.classList.add(CELL);
        cell.style.width = column.width + 'px';
        cell.style.left = column.left + 'px';

        if(column.format){
          value = column.format({
            item,
            column,
            rowIndex,
            columnIndex,
            value,
            cell
          });
        }

        if(column.render){
          cellInner = column.render({
            item,
            column,
            rowIndex,
            columnIndex,
            value,
            cell
          })
        }
        else{
          cellInner = value;
        }

        if(column.$rowGroups || column.rowGroupIndent){
          cell.classList.add(ROW_GROUP_VALUE_CELL);
        }

        if(column.checkboxSelection){
          const wrapperEl = document.createElement('div');
          wrapperEl.classList.add(CELL_WRAPPER);

          if(column.rowGroupIndent){
            wrapperEl.style.setProperty('--grid-group-level', `${store.rowGroups.length + 1}`);
          }

          const checkBoxEl = me.generateRowGroupCheckBoxEl(item);
          checkBoxEl.addEventListener('click', this.onRowCellSelectionClick.bind(this));
          wrapperEl.appendChild(checkBoxEl);

          const valueEl = me.generateSimpleValueEl(cellInner);
          wrapperEl.appendChild(valueEl);

          cell.appendChild(wrapperEl);
          cell.classList.add(CELL_SELECTION);
        }
        else if(column.$rowGroups){
          const wrapperEl = document.createElement('div');
          wrapperEl.classList.add(CELL_WRAPPER);

          if(column.rowGroupIndent){
            wrapperEl.style.setProperty('--grid-group-level', `${store.rowGroups.length}`);
          }

          const valueEl = document.createElement('span');
          valueEl.classList.add('fg-cell-value');

          if(cellInner === ''){
            cellInner = '&nbsp;';
          }
          valueEl.innerHTML = cellInner ?? '&nbsp;';

          wrapperEl.appendChild(valueEl);

          cell.appendChild(wrapperEl);
        }
        else if (cellInner !== undefined) {
          if(cellInner === ''){
            cellInner = '&nbsp;';
          }

          cell.innerHTML = cellInner ?? '&nbsp;';
        }

        return cell;
    },

    createCellGroupTypeColumn(rowIndex, item, columnIndex) {
      const me = this;
      const column = me.columns[columnIndex];

      if(column.$rowGroups){
        const cell = me.generateGroupCell(rowIndex, item, column);

        cell.setAttribute('col-index', columnIndex);
        cell.setAttribute('col-id', column.id);
        cell.style.left = column.left + 'px';
        cell.style.width = column.width + 'px';

        return cell;
      } else {
        const column = me.columns[columnIndex];
        let value = item.$agValues[column.index] || '';
        const cell = document.createElement('div');
        let cellInner;

        if(column.format){
          value = column.format({
            item,
            column,
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            value,
            cell
          });
        }

        if(column.render){
          cellInner = column.render({
            item,
            column,
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            value,
            cell
          })
        }
        else {
          cellInner = value;
        }

        cell.setAttribute('col-index', columnIndex);
        cell.setAttribute('col-id', column.id);
        cell.classList.add(CELL);
        cell.style.width = column.width + 'px';
        cell.style.left = column.left + 'px';

        if(cellInner !== undefined){
          cell.innerHTML = cellInner;
        }

        return cell;
      }
    },

    createCellGroupTypeRow(rowIndex, item) {
      const cell = this.generateGroupCell(rowIndex, item);

      cell.style.left = '0px';

      return cell;
    },

    generateSimpleValueEl(cellInner){
      const valueEl = document.createElement('span');
      valueEl.classList.add('fg-cell-value');

      if(cellInner === ''){
        cellInner = '&nbsp;';
      }
      valueEl.innerHTML = cellInner ?? '&nbsp;';

      return valueEl;
    },

    generateGroupCell(rowIndex, item, column = {}){
      const me = this;
      const cell = document.createElement('div');
      cell.classList.add(ROW_GROUP_CELL);

      if(item.expanded){
        cell.classList.add(ROW_GROUP_EXPANDED_CELL);
      }

      const expanderEl = me.generateRowGroupExpanderEl(item);
      cell.appendChild(expanderEl);

      if(me.checkboxSelection || column.checkboxSelection){
        const selectionEl = me.generateRowGroupSelectionEl(item);
        cell.appendChild(selectionEl);
        cell.classList.add(CELL_SELECTION);
      }

      const valueEl = me.generateValueEl(item, rowIndex);
      cell.appendChild(valueEl);

      const amountEl = me.generateAmountEl(item);
      cell.appendChild(amountEl);

      return cell;
    },

    generateAmountEl(item){
      const amountEl = document.createElement('span');
      amountEl.classList.add(ROW_GROUP_CELL_AMOUNT);
      amountEl.innerHTML = ` (${item.amount})`;

      return amountEl;
    },

    generateValueEl(item, rowIndex){
      const displayGroupValue = item.$rowDisplayGroupValue;
      const valueEl = document.createElement('span');
      valueEl.classList.add(ROW_GROUP_CELL_VALUE);

      if(this.groupValueRender){
        const displayValue = this.groupValueRender({
          el: valueEl,
          value: displayGroupValue,
          item,
          rowIndex
        });

        if(displayValue){
          valueEl.innerHTML = displayValue;
        }
      }
      else {
        valueEl.innerHTML = displayGroupValue;
      }

      return valueEl;
    },

    generateRowGroupExpanderEl(item){
      const svgChevronRight = Fancy.svg.chevronRight;
      const expanderEl = document.createElement('span');

      expanderEl.classList.add(ROW_GROUP_CELL_EXPANDER, SVG_ITEM, SVG_CHEVRON_RIGHT);
      expanderEl.style.setProperty('--grid-group-level', item.$groupLevel);
      expanderEl.innerHTML = svgChevronRight;
      expanderEl.addEventListener('click', this.onRowGroupExpanderClick.bind(this));

      return expanderEl;
    },

    generateRowGroupCheckBoxEl(item){
      const selected = item.$selected || false;
      const checkboxEl = document.createElement('input');
      checkboxEl.classList.add(INPUT_CHECKBOX);
      checkboxEl.setAttribute('type', 'checkbox');
      checkboxEl.checked = selected;

      return checkboxEl;
    },

    generateRowGroupSelectionEl(item){
      const selectionEl = document.createElement('span');
      const checkBoxEl = this.generateRowGroupCheckBoxEl(item);
      checkBoxEl.addEventListener('click', this.onRowGroupCellSelectionClick.bind(this));

      selectionEl.classList.add(ROW_GROUP_CELL_SELECTION);
      selectionEl.appendChild(checkBoxEl);

      return selectionEl;
    },

    removeColumnCells(columnIndexes = []) {
      const me = this;

      columnIndexes.forEach((columnIndex) => {
        const headerCell = me.headerEl.querySelector(`[col-index="${columnIndex}"]`);

        if(!headerCell){
          return;
        }

        headerCell.remove?.();

        if (me.filterBar) {
          const filterCell = me.filterBarEl.querySelector(`[col-index="${columnIndex}"]`);

          filterCell.remove?.();
        }

        me.renderedRowsIdMap.forEach(rowEl => {
          if (rowEl.classList.contains(ROW_GROUP)) {
            return
          }

          const cell = rowEl.querySelector(`[col-index="${columnIndex}"]`);

          cell.remove?.();
        });
      });
    },

    renderRow(index, item, style = {}) {
      const me = this;
      const rowEl = document.createElement('div');

      if (!item) {
        console.warn(`row ${index} does not exist`);
        return;
      }

      rowEl.classList.add(ROW, index % 2 === 1 ? ROW_ODD : ROW_EVEN);

      if(item.$selected){
        rowEl.classList.add(ROW_SELECTED)
      }

      rowEl.style.transform = `translateY(${index * me.rowHeight}px)`;
      for(const p in style){
        rowEl.style[p] = style[p];
      }
      rowEl.setAttribute('row-id', item.id);

      rowEl.addEventListener('mouseenter', this.onRowMouseEnter.bind(this));

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const cell = me.createCell(index, i);
        const column = me.columns[i];

        if (!column.hidden) {
          rowEl.appendChild(cell);
        }
      }

      me.bodyInnerContainerEl.appendChild(rowEl);
      me.renderedRowsIdMap.set(item.id, rowEl);

      return rowEl;
    },

    renderRowGroup(index, item, style = {}) {
      const me = this;
      const rowEl = document.createElement('div');
      const rowGroupType = me.rowGroupType;

      if (!item) {
        console.warn(`row ${index} does not exist`);
        return;
      }

      rowEl.classList.add(ROW_GROUP, index % 2 === 1 ? ROW_ODD : ROW_EVEN);

      if(item.$selected){
        rowEl.classList.add(ROW_SELECTED)
      }

      rowEl.style.transform = `translateY(${index * me.rowHeight}px)`;
      for(const p in style){
        rowEl.style[p] = style[p];
      }
      rowEl.setAttribute('row-id', item.id);
      rowEl.setAttribute('row-group', item.$rowGroupValue.replaceAll('-', '$').split('/').join('-'));

      rowEl.addEventListener('mouseenter', this.onRowMouseEnter.bind(this));

      if (rowGroupType === 'column') {
        let columnStart = me.scroller.columnViewStart,
          columnEnd = me.scroller.columnViewEnd;

        for (let i = columnStart; i <= columnEnd; i++) {
          const column = me.columns[i];

          if (!column.hidden) {
            const cell = me.createCellGroupTypeColumn(index, item, i);
            rowEl.appendChild(cell);
          }
        }
      } else if (rowGroupType === 'row') {
        const cell = me.createCellGroupTypeRow(index, item);
        rowEl.appendChild(cell);
      }

      me.bodyInnerContainerEl.appendChild(rowEl);
      me.renderedRowsIdMap.set(item.id, rowEl);

      return rowEl;
    },

    renderRowOnPrevPosition(item, smoothPositionAnimate) {
      const me = this;
      const rowEl = document.createElement('div');
      const prevIndex = me.store.prevIdRowIndexesMap.get(item.id);
      const index = item.rowIndex;

      if (!item) {
        console.warn(`row ${item.index} does not exist`);
        return;
      }

      let positionY;

      if (smoothPositionAnimate) {
        positionY = me.getSmoothPositionY(item, true);
      } else {
        positionY = prevIndex * me.rowHeight;
      }

      if(item.$selected){
        rowEl.classList.add(ROW_SELECTED)
      }

      rowEl.classList.add(ROW, index % 2 === 1 ? ROW_ODD : ROW_EVEN);

      rowEl.style.transform = `translateY(${positionY}px)`;
      rowEl.setAttribute('row-id', item.id);
      rowEl.addEventListener('mouseenter', this.onRowMouseEnter.bind(this));

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if (column.hidden) {
          continue
        }

        const cell = me.createCell(index, i);

        rowEl.appendChild(cell);
      }

      me.bodyInnerContainerEl.appendChild(rowEl);
      me.renderedRowsIdMap.set(item.id, rowEl);
    },

    updateCellPositions(columnIndex) {
      const me = this;

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      if (columnIndex !== undefined && columnStart < columnIndex) {
        columnStart = columnIndex;
      }

      // Update Header Cells
      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if (column.hidden) {
          continue
        }

        if(!column.headerCellEl){
          me.appendHeaderCell(i);
        }

        column.headerCellEl.style.left = column.left + 'px';
        column.headerCellEl.style.width = column.width + 'px';

        if (column.filterCellEl) {
          column.filterCellEl.style.left = column.left + 'px';
          column.filterCellEl.style.width = column.width + 'px';
        }
      }

      // Update Body Cells
      me.renderedRowsIdMap.forEach((rowEl, id) => {
        const cells = rowEl.querySelectorAll(`.${CELL}`);
        cells.forEach(cell => {

          const columnIndex = cell.getAttribute('col-index');
          const column = me.columns[columnIndex];
          cell.style.left = column.left + 'px';

          cell.style.width = column.width + 'px';
        });

        if(me.rowGroupType === 'column'){
          const groupCells = rowEl.querySelectorAll(`.${ROW_GROUP_CELL}`);

          groupCells.forEach(cell => {
            const columnIndex = cell.getAttribute('col-index');
            const column = me.columns[columnIndex];

            cell.style.left = column.left + 'px';
            cell.style.width = column.width + 'px';
          });
        }
      });
    },

    renderVisibleRows() {
      const me = this;
      const startRow = me.scroller.getStartRow();
      const endRow = me.scroller.getEndRow();

      me.actualRowsIdSet = new Set();

      let i = startRow;

      for (; i < endRow; i++) {
        const item = me.store.getItemByRowIndex(i);

        if (!item) {
          console.warn(`Item with index equals to ${i} does not exist`);
          continue;
        }

        if (!me.renderedRowsIdMap.has(item.id)) {
          if (item.$isGroupRow) {
            me.renderRowGroup(i, item);
          } else {
            me.renderRow(i, item);
          }
        }

        me.actualRowsIdSet.add(item.id);
      }
    },

    terminateVisibleRows(){
      const me = this;

      me.renderedRowsIdMap.forEach((row, key) => {
        me.removeRowById(key);
      });
    },

    // For smooth filtering
    fakeHideRow(item) {
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if (!rowEl) {
        console.warn(`Row el for row index ${item.rowIndex} does not exist`);
        return;
      }

      rowEl.style.opacity = '0';
    },

    // For smooth animating
    fakeRowPosition(item) {
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if (!rowEl) {
        console.warn(`Row el for row index ${item.rowIndex} does not exist`);
        return;
      }

      const positionY = me.getSmoothPositionY(item);

      rowEl.style.transform = `translateY(${positionY}px)`;

      if(me.columnOrder){
        const orderCell = rowEl.querySelector(`.${CELL_ORDER}`);

        if(orderCell){
          orderCell.innerHTML = item.rowIndex + 1;
        }
      }
    },

    getSmoothPositionY(item, prevPosition) {
      const me = this;
      const bufferPosition = me.rowHeight * me.scroller.bufferRows;

      let rowIndex = item.rowIndex;

      if (prevPosition) {
        rowIndex = me.store.prevIdRowIndexesMap.get(item.id);
      }

      let positionY = rowIndex * me.rowHeight;

      if (positionY < me.scroller.scrollTop - bufferPosition) {
        positionY = me.scroller.scrollTop - bufferPosition;
      } else if (positionY > me.scroller.scrollTop + me.height + bufferPosition) {
        positionY = me.scroller.scrollTop + me.height + bufferPosition;
      }

      return positionY;
    },

    updateRowPosition(item) {
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if (!rowEl) {
        console.warn(`Row el for row index ${item.rowIndex} does not exist`);
        return;
      }

      rowEl.style.transform = `translateY(${item.rowIndex * me.rowHeight}px)`;
    },

    removeNotNeededRows() {
      const me = this;

      me.renderedRowsIdMap.forEach((rowEl, id) => {
        if (!me.actualRowsIdSet.has(id)) {
          me.removeRowById(id);
        }
      });
    },

    onRowMouseEnter(event) {
      const me = this;

      if (me.columnResizing) {
        return;
      }

      event.target.classList.add(ROW_HOVER);

      event.target.addEventListener('mouseleave', me.onRowMouseLeave.bind(this), {
        once: true
      });
    },

    onRowMouseLeave(event) {
      const me = this;

      event.target.classList.remove(ROW_HOVER);
    },

    onRowGroupExpanderClick(e, b) {
      const me = this;

      if(me.grouping){
        return;
      }

      const cell = e.target.closest(`.${ROW_GROUP_CELL}`);
      const row = cell.closest(`.${ROW_GROUP}`);
      const $rowGroupValue = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');

      if (cell.classList.contains(ROW_GROUP_EXPANDED_CELL)) {
        me.collapse($rowGroupValue);
      } else {
        me.expand($rowGroupValue);
      }
    },

    updateRowGroupCellExpandedCls(group){
      const me = this;
      const cell = me.bodyEl.querySelector(`div[row-group="${group.replaceAll('-', '$').replaceAll('/', '-')}"] .${ROW_GROUP_CELL}`);

      if (cell.classList.contains(ROW_GROUP_EXPANDED_CELL)) {
        cell.classList.remove(ROW_GROUP_EXPANDED_CELL);
      } else {
        cell.classList.add(ROW_GROUP_EXPANDED_CELL);
      }
    },

    updateAllRowGroupCellsExtendedCls(){
      const me = this;
      const rows = me.bodyEl.querySelectorAll(`.${ROW_GROUP}`);

      rows.forEach(row => {
        const $rowGroupValue = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');
        const cell = row.querySelector(`.${ROW_GROUP_CELL}`);
        const expanded = me.store.expandedGroups[$rowGroupValue];
        const hasExpandedCls = cell.classList.contains(ROW_GROUP_EXPANDED_CELL);

        if(expanded && !hasExpandedCls){
          cell.classList.add(ROW_GROUP_EXPANDED_CELL);
        }
        else if(!expanded && hasExpandedCls){
          cell.classList.remove(ROW_GROUP_EXPANDED_CELL);
        }
      })
    },

    reSetVisibleBodyColumnsIndex(from, to, oldOrders){
      const me = this;
      const cellsMap = {};
      const cellsGroupMap = {};

      if(from === undefined){
        const columnsViewRange = me.scroller.columnsViewRange;

        for(let i = 0, iL = columnsViewRange.length;i<iL;i++) {
          const columnIndex = columnsViewRange[i];
          const column = me.columns[columnIndex];

          const cells = me.bodyEl.querySelectorAll(`.${CELL}[col-id="${column.id}"]`);
          cells.forEach(cell => {
            if(Number(cell.getAttribute('col-index')) !== columnIndex){
              cell.setAttribute('col-index', columnIndex);
            }
          });

          if(me.rowGroupType === 'column'){
            const cells = me.bodyEl.querySelectorAll(`.${ROW_GROUP_CELL}[col-index="${i}"]`);

            cells.forEach(cell => {
              if(Number(cell.getAttribute('col-index')) !== columnIndex){
                cell.setAttribute('col-index', columnIndex);
              }
            });
          }
        }

        return;
      }

      for(let i = from;i <= to;i++){
          const cells = me.bodyEl.querySelectorAll(`.${CELL}[col-index="${i}"]`);
          cellsMap[i] = cells;

          if(me.rowGroupType === 'column'){
            const cells = me.bodyEl.querySelectorAll(`.${ROW_GROUP_CELL}[col-index="${i}"]`);

            if(cells.length){
              cellsGroupMap[i] = cells;
            }
          }
      }

      for(let i = from, j = 0;i <= to;i++, j++){
        const oldIndex = oldOrders[j];
        const newIndex = from + j;

        cellsMap[oldIndex].forEach(cell => {
          cell.setAttribute('col-index', newIndex);
        });

        cellsGroupMap[oldIndex]?.forEach(cell => {
          cell.setAttribute('col-index', newIndex);
        });
      }
    }
  }

  Object.assign(Grid.prototype, GridMixinBody);

})();
