(() => {
  const {
    CELL,
    CELL_VALUE,
    CELL_ORDER,
    CELL_WRAPPER,
    CELL_SELECTION,
    CELL_SELECTED,
    ACTIVE_CELL,
    ACTIVE_CELL_ROW,
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

  const { div, span, input } = Fancy;

  /**
   * @mixin GridMixinBody
   */
  const GridMixinBody = {
    addColumnCells(columnIndexes = []) {
      const me = this;
      const startRow = me.scroller.getStartRow();
      const endRow = me.scroller.getEndRow();

      columnIndexes.forEach(columnIndex => {
        let i = startRow;

        me.appendHeaderCell(columnIndex);
        me.filterBar && me.appendFilterBarCell(columnIndex);

        for (; i < endRow; i++) me.appendCell(i, columnIndex);
      });
    },
    appendCell(rowIndex, columnIndex) {
      const me = this;
      const item = me.store.getItemByRowIndex(rowIndex);
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if(rowEl.classList.contains(ROW_GROUP)){
        const column = me.columns[columnIndex];
        if(me.rowGroupType === 'column' && column.$isRowGroupColumn){
          const cell = me.createCellGroupTypeColumn(rowIndex, item, columnIndex);
          rowEl.appendChild(cell);
        }
        return;
      }

      const cell = me.createCell(rowIndex, columnIndex);

      rowEl.appendChild(cell);
    },
    createCell(rowIndex, columnIndex, allowActiveCellSet = true) {
      const me = this;
      const store = me.store;
      const item = store.getItemByRowIndex(rowIndex);
      const column = me.columns[columnIndex];
      let value = item[column.index];
      let cellInner;
      const cell = div(CELL,{
        width: column.width + 'px',
        left: column.left + 'px'
      });
      const params = {
        item,
        column,
        rowIndex,
        columnIndex,
        value,
        cell
      };

      if(column.$type === 'currency'){
        column.currency && (params.currency = column.currency);
        column.minDecimal !== undefined && (params.minDecimal = column.minDecimal);
        column.maxDecimal !== undefined && (params.maxDecimal = column.maxDecimal);
      }

      cell.setAttribute('col-index', columnIndex);
      cell.setAttribute('col-id', column.id);

      if(allowActiveCellSet && me.activeCell && me.$preventActiveCellRender !== true && item.id === me.activeCellRowId && columnIndex === me.activeCellColumnIndex){
        cell.classList.add(ACTIVE_CELL);
        me.activeCellEl = cell;
      }

      if(column.cellStyle) {
        let cellExtraStyles;
        switch(typeof column.cellStyle){
          case 'function':
            cellExtraStyles = column.cellStyle(params) || {};
            break;
          case 'object':
            cellExtraStyles = column.cellStyle;
            break;
        }

        for (const p in cellExtraStyles) {
          cell.style[p] = cellExtraStyles[p];
        }
      }

      if(column.cellCls){
        if(typeof column.cellCls === 'string'){
          cell.classList.add(column.cellCls);
        } else if(Array.isArray(column.cellCls)){
          cell.classList.add(...column.cellCls);
        } else if(typeof column.cellCls === 'function'){
          let cls = column.cellCls(params);
          if(typeof cls === 'string') (cls = [cls]);

          cls && cell.classList.add(...cls);
        }
      }

      if(column.cellClsRules){
        for(const cls in column.cellClsRules){
          const fn = column.cellClsRules[cls];

          fn(params) && cell.classList.add(cls);
        }
      }

      if(column.format) (value = column.format(params));
      cellInner = column.render? cellInner = column.render(params): value;

      if(column.$isRowGroupColumn || column.rowGroupIndent) cell.classList.add(ROW_GROUP_VALUE_CELL);

      if(column.checkboxSelection){
        const wrapperEl = div(CELL_WRAPPER);

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
      } else if(column.$isRowGroupColumn){
        const wrapperEl = div(CELL_WRAPPER);

        if(column.rowGroupIndent){
          wrapperEl.style.setProperty('--grid-group-level', `${store.rowGroups.length}`);
        }

        const valueEl = span(CELL_VALUE);

        if(cellInner === '') (cellInner = '&nbsp;');
        valueEl.innerHTML = cellInner ?? '&nbsp;';

        wrapperEl.appendChild(valueEl);

        cell.appendChild(wrapperEl);
      } else if (cellInner !== undefined) {
        if(cellInner === '') (cellInner = '&nbsp;');

        cell.innerHTML = cellInner ?? '&nbsp;';
      }

      if(me.activeCell){
        cell.addEventListener('mousedown', me.onBodyCellMouseDown.bind(this));
        if(me.selectingCells){
          cell.addEventListener('mouseenter', me.onBodyCellMouseEnter.bind(this));

          if(me.selectionCellsRange && cell){
            requestAnimationFrame(() => {
              me.isCellInSelectedRange(cell) && cell.classList.add(CELL_SELECTED);
            });
          }
        }
      }

      column.editable && cell.addEventListener('dblclick', me.onBodyCellDBLClick.bind(this));
      cell.addEventListener('click', me.onBodyCellClick.bind(this));

      return cell;
    },
    createCellGroupTypeColumn(rowIndex, item, columnIndex) {
      const me = this;
      const column = me.columns[columnIndex];

      if(column.$isRowGroupColumn){
        const cell = me.generateGroupCell(rowIndex, item, column);

        cell.setAttribute('col-index', columnIndex);
        cell.setAttribute('col-id', column.id);
        cell.style.left = column.left + 'px';
        cell.style.width = column.width + 'px';

        return cell;
      } else {
        const column = me.columns[columnIndex];
        let value = item.$agValues[column.index] || '';
        const cell = div(CELL,{
          width: column.width + 'px',
          left: column.left + 'px'
        });
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
          });
        } else {
          cellInner = value;
        }

        cell.setAttribute('col-index', columnIndex);
        cell.setAttribute('col-id', column.id);

        if(cellInner !== undefined) (cell.innerHTML = cellInner);

        return cell;
      }
    },
    createCellGroupTypeRow(rowIndex, item) {
      const cell = this.generateGroupCell(rowIndex, item);

      cell.style.left = '0px';

      return cell;
    },
    generateSimpleValueEl(cellInner){
      const valueEl = span(CELL_VALUE);

      if(cellInner === '') (cellInner = '&nbsp;');
      valueEl.innerHTML = cellInner ?? '&nbsp;';

      return valueEl;
    },
    generateGroupCell(rowIndex, item, column = {}){
      const me = this;
      const cell = div(ROW_GROUP_CELL);

      item.expanded && cell.classList.add(ROW_GROUP_EXPANDED_CELL);

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
      const amountEl = span(ROW_GROUP_CELL_AMOUNT);
      amountEl.innerHTML = ` (${item.amount})`;

      return amountEl;
    },
    generateValueEl(item, rowIndex){
      const displayGroupValue = item.$rowDisplayGroupValue;
      const valueEl = span(ROW_GROUP_CELL_VALUE);

      if(this.groupValueRender){
        const displayValue = this.groupValueRender({
          el: valueEl,
          value: displayGroupValue,
          item,
          rowIndex
        });

        if(displayValue) (valueEl.innerHTML = displayValue);
      } else {
        valueEl.innerHTML = displayGroupValue;
      }

      return valueEl;
    },
    generateRowGroupExpanderEl(item){
      const svgChevronRight = Fancy.svg.chevronRight;
      const expanderEl = span([ROW_GROUP_CELL_EXPANDER, SVG_ITEM, SVG_CHEVRON_RIGHT]);

      expanderEl.style.setProperty('--grid-group-level', item.$groupLevel);
      expanderEl.innerHTML = svgChevronRight;
      expanderEl.addEventListener('click', this.onRowGroupExpanderClick.bind(this));

      return expanderEl;
    },
    generateRowGroupCheckBoxEl(item){
      const selected = item.$selected || false;
      const checkboxEl = input(INPUT_CHECKBOX);
      checkboxEl.setAttribute('type', 'checkbox');
      checkboxEl.checked = selected;

      if(item.selectedStatus === 'partly') (checkboxEl.indeterminate = true);

      return checkboxEl;
    },
    generateRowGroupSelectionEl(item){
      const selectionEl = span(ROW_GROUP_CELL_SELECTION);
      const checkBoxEl = this.generateRowGroupCheckBoxEl(item);
      checkBoxEl.addEventListener('click', this.onRowGroupCellSelectionClick.bind(this));

      selectionEl.appendChild(checkBoxEl);

      return selectionEl;
    },
    removeColumnCells(columnIndexes = []) {
      const me = this;

      columnIndexes.forEach((columnIndex) => {
        const headerCell = me.headerInnerContainerEl.querySelector(`[col-index="${columnIndex}"]`);

        if(!headerCell) return;

        headerCell.remove?.();

        if (me.filterBar) {
          const filterCell = me.filterBarEl.querySelector(`[col-index="${columnIndex}"]`);

          filterCell.remove?.();
        }

        me.renderedRowsIdMap.forEach(rowEl => {
          if (rowEl.classList.contains(ROW_GROUP)) return;

          const cell = rowEl.querySelector(`[col-index="${columnIndex}"]`);

          cell?.remove();
        });
      });
    },
    renderRow(index, item, style = {}) {
      const me = this;

      if (!item) {
        console.warn(`FG-Grid: row ${index} does not exist`);
        return;
      }

      const rowEl = div(ROW,{
        transform: `translateY(${index * me.rowHeight}px)`,
        ...style
      });
      const params = {
        rowIndex: index,
        item
      };

      rowEl.classList.add(index % 2 === 1 ? ROW_ODD : ROW_EVEN);

      if(me.activeCell && me.$preventActiveCellRender !== true && item.id === me.activeCellRowId){
        rowEl.classList.add(ACTIVE_CELL_ROW);
        me.activeCellRowEl = rowEl;
      }

      me.applyExtraRowStyles(rowEl, params);

      item.$selected && rowEl.classList.add(ROW_SELECTED);

      rowEl.setAttribute('row-id', item.id);
      rowEl.setAttribute('row-index', index);

      rowEl.addEventListener('mouseenter', this.onRowMouseEnter.bind(this));

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const cell = me.createCell(index, i);
        const column = me.columns[i];

        !column.hidden && rowEl.appendChild(cell);
      }

      me.bodyInnerContainerEl.appendChild(rowEl);
      me.renderedRowsIdMap.set(item.id, rowEl);

      return rowEl;
    },
    applyExtraRowStyles(rowEl, params){
      const me = this;

      if(me.rowStyle){
        if(typeof me.rowStyle === 'function'){
          const rowStyles = me.rowStyle(params) || {};

          for(const p in rowStyles){
            rowEl.style[p] = rowStyles[p];
          }
        }
      }

      if(me.rowCls){
        if(typeof me.rowCls === 'function'){
          let cls = me.rowCls(params) || [];

          if(typeof cls === 'string') (cls = [cls]);

          rowEl.classList.add(...cls);
        }
      }

      if(me.rowClsRules){
        if(typeof me.rowClsRules === 'object'){
          for(const cls in me.rowClsRules){
            const fn = me.rowClsRules[cls];

            fn(params) && rowEl.classList.add(cls);
          }
        }
      }
    },
    renderRowGroup(index, item, style = {}) {
      const me = this;
      const rowGroupType = me.rowGroupType;

      if (!item) {
        console.warn(`FG-Grid: row ${index} does not exist`);
        return;
      }

      const rowEl = div(ROW_GROUP, style);

      rowEl.classList.add(index % 2 === 1 ? ROW_ODD : ROW_EVEN);
      item.$selected && rowEl.classList.add(ROW_SELECTED);

      rowEl.style.transform = `translateY(${index * me.rowHeight}px)`;
      rowEl.setAttribute('row-id', item.id);
      rowEl.setAttribute('row-index', index);
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

      if (!item) {
        console.warn(`FG-Grid: row ${item.index} does not exist`);
        return;
      }

      const rowEl = div(ROW);
      const prevIndex = me.store.prevIdRowIndexesMap.get(item.id);
      const index = item.rowIndex;

      let positionY;

      if (smoothPositionAnimate) {
        positionY = me.getSmoothPositionY(item, true);
      } else {
        positionY = prevIndex * me.rowHeight;
      }

      item.$selected && rowEl.classList.add(ROW_SELECTED);

      const params = {
        rowIndex: index,
        item
      };

      rowEl.classList.add(index % 2 === 1 ? ROW_ODD : ROW_EVEN);
      me.applyExtraRowStyles(rowEl, params);

      rowEl.style.transform = `translateY(${positionY}px)`;
      rowEl.setAttribute('row-id', item.id);
      rowEl.setAttribute('row-index', index);
      rowEl.addEventListener('mouseenter', this.onRowMouseEnter.bind(this));

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if (column.hidden) continue;

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

        if(me.columnsLevel > 1){
          const columnLevel2 = me.columns2[i];
          const headerCellEl = columnLevel2.headerCellEl;
          if(headerCellEl){
            headerCellEl.style.left = columnLevel2.left + 'px';
            headerCellEl.style.width = columnLevel2.width + 'px';
          }
        }

        if (column.hidden) continue;

        !column.headerCellEl && me.appendHeaderCell(i);

        column.headerCellEl.style.left = column.left + 'px';
        column.headerCellEl.style.width = column.width + 'px';

        if(column.parent){
          const parent = column.parent;
          parent.headerCellEl.style.left = parent.left + 'px';
          parent.headerCellEl.style.width = parent.width + 'px';
        }

        if (column.filterCellEl) {
          column.filterCellEl.style.left = column.left + 'px';
          column.filterCellEl.style.width = column.width + 'px';
        }
      }

      // Update Body Cells
      me.renderedRowsIdMap.forEach(rowEl => {
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
          console.warn(`FG-Grid: Item with index equals to ${i} does not exist`);
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
      this.renderedRowsIdMap.forEach((row, key) => this.removeDomRowById(key));
    },
    // For smooth filtering
    fakeHideRow(item) {
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if (!rowEl) {
        console.warn(`FG-Grid: Row el for row index ${item.rowIndex} does not exist`);
        return;
      }

      rowEl.style.opacity = '0';
    },
    // For smooth animating
    fakeRowPosition(item) {
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if (!rowEl) {
        console.warn(`FG-Grid: Row el for row index ${item.rowIndex} does not exist`);
        return;
      }

      const positionY = me.getSmoothPositionY(item);

      rowEl.style.transform = `translateY(${positionY}px)`;
      rowEl.setAttribute('row-index', item.rowIndex);

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
        console.warn(`FG-Grid: Row el for row index ${item.rowIndex} does not exist`);
        return;
      }

      rowEl.style.transform = `translateY(${item.rowIndex * me.rowHeight}px)`;
      rowEl.setAttribute('row-index', item.rowIndex);
    },
    removeNotNeededRows() {
      const me = this;

      me.renderedRowsIdMap.forEach((rowEl, id) => {
        !me.actualRowsIdSet.has(id) && me.removeDomRowById(id);
      });
    },
    onRowMouseEnter(event) {
      const me = this;

      if (me.columnResizing) return;

      event.target.classList.add(ROW_HOVER);

      event.target.addEventListener('mouseleave', me.onRowMouseLeave.bind(this), {
        once: true
      });
    },
    onRowMouseLeave(event) {
      event.target.classList.remove(ROW_HOVER);
    },
    onRowGroupExpanderClick(event) {
      const me = this;

      if (me.grouping) return;

      const cell = event.target.closest(`.${ROW_GROUP_CELL}`);
      const row = cell.closest(`.${ROW_GROUP}`);
      const $rowGroupValue = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');

      if (cell.classList.contains(ROW_GROUP_EXPANDED_CELL)) {
        me.collapse($rowGroupValue);
      } else {
        me.expand($rowGroupValue);
      }
    },
    updateRowGroupCellExpandedCls(group){
      const cell = this.bodyEl.querySelector(`div[row-group="${group.replaceAll('-', '$').replaceAll('/', '-')}"] .${ROW_GROUP_CELL}`);
      cell.classList.toggle(ROW_GROUP_EXPANDED_CELL);
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
      });
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

          if (cells.length) (cellsGroupMap[i] = cells);
        }
      }

      for(let i = from, j = 0;i <= to;i++, j++){
        const oldIndex = oldOrders[j];
        const newIndex = from + j;

        cellsMap[oldIndex].forEach(cell => cell.setAttribute('col-index', newIndex));
        cellsGroupMap[oldIndex]?.forEach(cell => cell.setAttribute('col-index', newIndex));
      }
    },
    getCell(rowIndex, columnIndex) {
      return this.bodyEl.querySelector(`div.${ROW}[row-index="${rowIndex}"] div.${CELL}[col-index="${columnIndex}"]`);
    },
    updateOrderColumn(){
      const me = this;

      if(me.columnOrder){
        const cells = me.bodyEl.querySelectorAll(`div.${CELL_ORDER}`);

        cells.forEach(cell => {
          const row = cell.closest(`.${ROW}`);
          if (!row) return;
          const itemId = row.getAttribute('row-id');
          const item = me.store.idItemMap.get(itemId);

          if (!item) return;

          cell.innerHTML = item.rowIndex + 1;
        });
      }
    }
  };

  Object.assign(Grid.prototype, GridMixinBody);
})();
