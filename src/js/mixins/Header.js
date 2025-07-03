(()=> {
  const {
    ANIMATE_CELLS_POSITION,
    HIDDEN,
    HEADER_CELL,
    HEADER_CELL_LABEL,
    HEADER_CELL_MENU,
    HEADER_CELL_SELECTION,
    HEADER_CELL_SORTABLE,
    HEADER_CELL_NOT_RESIZABLE,
    HEADER_CELL_TEXT,
    HEADER_FILTER_EL,
    HEADER_CELL_RESIZE,
    BODY,
    COLUMN_RESIZING,
    COLUMN_DRAGGING,
    COLUMNS_MENU,
    COLUMNS_MENU_ITEM,
    COLUMNS_MENU_ITEM_TEXT,
    FILTER_INDICATOR_CONTAINER,
    SORT_ASC,
    SORT_DESC,
    SORT_ORDER,
    SORT_INDICATOR_CONTAINER,
    INPUT_CHECKBOX,
    ROW_GROUP_BAR_ITEM_ACTIVE
  } = Fancy.cls;

  const {
    div,
    span,
    input
  } = Fancy;

  /**
   * @mixin GridMixinHeader
   */

  const GridMixinHeader = {
    deltaStartColumnDrag: 10,
    onHeaderMouseDown(event) {
      event.preventDefault();
    },

    onHeaderCellClick(event) {
      const me = this;
      const cellLabel = event.target.closest(`.${HEADER_CELL_LABEL}`);
      const cellMenu = event.target.closest(`.${HEADER_CELL_MENU}`);
      const multi = event.shiftKey;

      if(me.columnDragging){
        return;
      }

      if(cellLabel){
        const cell = cellLabel.closest(`.${HEADER_CELL}`);
        const columnIndex = cell.getAttribute('col-index');
        const column = me.columns[columnIndex];

        if (!column.sortable || !column.type) {
          return;
        }

        switch (column.sort) {
          case 'ASC':
            if (multi) {
              me.multiSort(column, 'DESC');
            } else {
              me.sort(column, 'DESC');
            }
            break;
          case 'DESC':
            me.clearSort(column, multi);
            break;
          case undefined:
            if (multi) {
              me.multiSort(column, 'ASC');
            } else {
              me.sort(column, 'ASC');
            }
            break;
        }
      }

      if (cellMenu) {
        const cell = cellMenu.closest(`.${HEADER_CELL}`);
        const columnIndex = cell.getAttribute('col-index');
        const column = me.columns[columnIndex];

        if (!column.elMenuList) {
          me.destroyHeaderCellMenuList();
          requestAnimationFrame(() => {
            me.showHeaderCellMenuList(event, column, columnIndex);
          });
        } else {
          me.destroyHeaderCellMenuList(column);
        }
      }
    },

    renderVisibleHeaderCells() {
      const me = this;

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if (column.hidden) {
          continue;
        }

        const cell = me.createHeaderCell(i);

        me.headerInnerContainerEl.appendChild(cell);
      }
    },

    appendHeaderCell(columnIndex) {
      const me = this;
      const rowEl = me.headerInnerContainerEl;
      const cell = me.createHeaderCell(columnIndex);

      rowEl.appendChild(cell);
    },

    createHeaderCell(columnIndex) {
      const me = this;
      const column = me.columns[columnIndex];
      const cell = div(HEADER_CELL, {
        width: column.width + 'px',
        left: column.left + 'px'
      });
      const value = column.title;

      if(column.sortable && column.type){
        cell.classList.add(HEADER_CELL_SORTABLE);
      }

      if(column.resizable === false){
        cell.classList.add(HEADER_CELL_NOT_RESIZABLE);
      }

      cell.setAttribute('col-index', columnIndex);
      cell.setAttribute('col-id', column.id);

      const label = div(HEADER_CELL_LABEL);
      const cellText = div(HEADER_CELL_TEXT);
      cellText.innerHTML = value;

      const filterContainer = span(FILTER_INDICATOR_CONTAINER);

      const elFilter = span(HEADER_FILTER_EL);
      if(!Object.entries(column.filters || {}).length){
        elFilter.classList.add(HIDDEN);
      }
      elFilter.innerHTML = Fancy.svg.filter;
      filterContainer.appendChild(elFilter);
      column.elFilter = elFilter;

      const sortContainer = span(SORT_INDICATOR_CONTAINER);

      const elSortOrder = span(SORT_ORDER);
      if(!column.sortOrder){
        elSortOrder.classList.add(HIDDEN);
      } else {
        elSortOrder.innerHTML = column.sortOrder;
      }
      sortContainer.appendChild(elSortOrder);
      column.elSortOrder = elSortOrder;

      const elSortAsc = span(SORT_ASC);
      if(column.sort !== 'ASC'){
        elSortAsc.classList.add(HIDDEN);
      }
      elSortAsc.innerHTML = Fancy.svg.sortAsc;
      sortContainer.appendChild(elSortAsc);
      column.elSortAsc = elSortAsc;

      const elSortDesc = span();
      elSortDesc.classList.add(SORT_DESC);
      if(column.sort !== 'DESC'){
        elSortDesc.classList.add(HIDDEN);
      }
      elSortDesc.innerHTML = Fancy.svg.sortDesc;
      sortContainer.appendChild(elSortDesc);
      column.elSortDesc = elSortDesc;

      const cellResize = div(HEADER_CELL_RESIZE);
      cellResize.addEventListener('mousedown', me.onResizeMouseDown.bind(this));

      label.appendChild(cellText);
      label.appendChild(filterContainer);
      label.appendChild(sortContainer);

      const elMenu = div(HEADER_CELL_MENU);
      elMenu.innerHTML = Fancy.svg.menu;

      column.elMenu = elMenu;

      if(column.headerCheckboxSelection && column.checkboxSelection){
        const elSelection = div(HEADER_CELL_SELECTION);

        const checkboxEl = input(INPUT_CHECKBOX);
        checkboxEl.setAttribute('type', 'checkbox');
        checkboxEl.addEventListener('click', me.onHeaderCheckboxSelectionClick.bind(this));

        elSelection.appendChild(checkboxEl);

        column.headerCheckboxSelectionEl = checkboxEl;

        cell.appendChild(elSelection);

        me.updateHeaderCheckboxSelection(column);
      }

      cell.appendChild(label);

      if(column.menu !== false){
        cell.appendChild(elMenu);
      }

      if(column.resizable !== false){
        cell.appendChild(cellResize);
      }

      cell.addEventListener('mousedown', me.onCellMouseDown.bind(this));

      column.headerCellEl = cell;

      return cell;
    },

    onCellMouseDown(event){
      const me = this;
      const isTargetHeaderCellMenu = event.target.closest(`.${HEADER_CELL_MENU}`);

      if(isTargetHeaderCellMenu){
        return;
      }

      const cell = event.target.classList.contains(HEADER_CELL)? event.target : event.target.closest(`.${HEADER_CELL}`);
      const columnIndex = Number(cell.getAttribute('col-index'));
      const column = me.columns[columnIndex];

      if(column.draggable === false){
        return;
      }

      me.columnDragDownX = event.pageX;
      me.columnDragDownY = event.pageY;
      me.columnDragMouseDownColumn = column;
      me.columnDragMouseDownColumnIndex = columnIndex;

      me.onColumnDragMouseMoveFn = me.onColumnDragMouseMove.bind(this);
      document.addEventListener('mousemove', me.onColumnDragMouseMoveFn);

      document.addEventListener('mouseup', () => {
        delete me.columnDragDownX;
        delete me.columnDragDownY;
        delete me.columnDragMouseDownColumn;
        delete me.debouceColumnDraggingFn;

        setTimeout(()=>{
          if(me.activeRowGroupBarItemEl){
            me.activeRowGroupBarItemEl.classList.remove(ROW_GROUP_BAR_ITEM_ACTIVE);
          }

          me.gridEl.classList.remove(COLUMN_DRAGGING);
          me.columnDragging?.dragColumnCellEl.remove();
          delete me.columnDragging;

          if(me.$requiresReSetGroupColumn && me.rowGroupType === 'column'){
            delete me.$requiresReSetGroupColumn;
            if(me.rowGroupBarItemColumns.length === 1){
              setTimeout(()=>{
                let indexToAddColumn = 0;
                me.$rowGroupColumn.hidden = true;
                if(me.columns[0].type === 'order'){
                  me.columns.splice(1, 0, me.$rowGroupColumn);
                  indexToAddColumn = 1;
                } else {
                  me.columns.unshift(me.$rowGroupColumn);
                }

                me.scroller.generateNewRange(false);
                me.reSetVisibleHeaderColumnsIndex();

                //me.scroller.generateNewRange();
                //me.reCalcColumnsPositions();
                //me.updateWidth();
                //me.updateCellPositions();
                me.showColumn(me.columns[indexToAddColumn]);
              },1);
            }
          }

          if(me.rowGroupBarItemColumns && me.rowGroupBarItemColumns.length !== me.store.rowGroups.length){
            me.reConfigRowGroups();
          }
        }, 1);

        document.removeEventListener('mousemove', me.onColumnDragMouseMoveFn);
      }, {
        once: true
      })
    },

    onResizeMouseDown(event) {
      const me = this;
      const cell = event.target.closest(`.${HEADER_CELL}`);
      const columnIndex = Number(cell.getAttribute('col-index'));
      const column = me.columns[columnIndex];

      event.preventDefault();
      event.stopPropagation();

      if(column.resizable === false){
        return;
      }

      me.columnResizing = true;

      me.resizeDownX = event.pageX;
      me.resizeDownColumnWidth = column.width;
      me.resizeDownColumnIndex = columnIndex;

      me.onResizeMouseMoveFn = me.onResizeMouseMove.bind(this);

      document.addEventListener('mouseup', me.onResizeMouseUp.bind(this), {
        once: true
      });
      document.body.addEventListener('mousemove', me.onResizeMouseMoveFn);

      me.gridEl.classList.add(COLUMN_RESIZING);
      me.gridEl.style.cursor = 'ew-resize';
      me.gridEl.style.userSelect = 'none';
      me.gridEl.querySelectorAll(`.${HEADER_CELL}`).forEach(cell => {
        cell.style.cursor = 'ew-resize';
      });
      me.gridEl.querySelectorAll(`.${BODY}`).forEach(bodyEl => {
        bodyEl.style.cursor = 'ew-resize';
      });
    },

    onResizeMouseUp() {
      const me = this;

      me.columnResizing = false;

      me.gridEl.classList.remove(COLUMN_RESIZING);
      me.gridEl.style.cursor = '';
      me.gridEl.style.userSelect = '';
      document.body.querySelectorAll(`.${HEADER_CELL}`).forEach(cell => {
        cell.style.cursor = '';
      });
      me.gridEl.querySelectorAll(`.${BODY}`).forEach(bodyEl => {
        bodyEl.style.cursor = '';
      });
      document.body.removeEventListener('mousemove', me.onResizeMouseMoveFn);
    },

    onResizeMouseMove(event) {
      const me = this;
      const deltaX = event.pageX - me.resizeDownX;
      const column = me.columns[me.resizeDownColumnIndex];
      const minColumnWidth = column.minWidth || me.minColumnWidth;

      let newWidth = me.resizeDownColumnWidth + deltaX;

      if (newWidth < minColumnWidth) {
        newWidth = minColumnWidth;
      }

      column.width = newWidth;

      requestAnimationFrame(() => {
        me.reCalcColumnsPositions();
        me.updateCellPositions(me.resizeDownColumnIndex);
        me.updateWidth();
      });
    },

    updateHeaderCells() {
      const me = this;

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if(column.hidden){
          continue;
        }

        if (Object.entries(column.filters || {}).length) {
          column.elFilter.classList.remove(HIDDEN);
        } else {
          column.elFilter.classList.add(HIDDEN);
        }

        if (column.sortOrder) {
          column.elSortOrder.innerHTML = column.sortOrder;
          column.elSortOrder.classList.remove(HIDDEN);
        } else if (!column.elSortOrder.classList.contains(HIDDEN)) {
          column.elSortOrder.classList.add(HIDDEN);
        }

        if (column.sort === 'ASC') {
          column.elSortAsc.classList.remove(HIDDEN);
        } else if (!column.elSortAsc.classList.contains(HIDDEN)) {
          column.elSortAsc.classList.add(HIDDEN);
        }

        if (column.sort === 'DESC') {
          column.elSortDesc.classList.remove(HIDDEN);
        } else if (!column.elSortDesc.classList.contains(HIDDEN)) {
          column.elSortDesc.classList.add(HIDDEN);
        }
      }
    },

    showHeaderCellMenuList(event, column) {
      const me = this;
      const elMenuRect = column.elMenu.getBoundingClientRect();
      const top = elMenuRect.top - 1 + elMenuRect.height;
      const left = elMenuRect.left;
      const el = div([COLUMNS_MENU, 'fg-theme-' + me.theme], {
        top: `${top}px`,
        left: `${left}px`
      });

      el.innerHTML = me.columns.map((column, index) => {
        if(column.$isRowGroupColumn){
          return '';
        }

        return [
          `<div col-index="${index}" class="${COLUMNS_MENU_ITEM}">`,
            `<input type="checkbox" ${column.hidden ? '' : 'checked'}>`,
            `<div class="${COLUMNS_MENU_ITEM_TEXT}">${column.title}</div>`,
          '</div>'
        ].join('');
      }).join('');

      column.elMenuList = el;
      document.body.appendChild(el);
      setTimeout(()=>{
        el.style.opacity = `1`;
        me.activeElMenuList = el;
      }, 0);

      el.addEventListener('click', me.onClickHeaderMenuItem.bind(this));

      me.onDocClickForHeaderCellMenuFn = me.onDocClickForHeaderCellMenu.bind(this, column);
      document.addEventListener('mousedown', me.onDocClickForHeaderCellMenuFn);
    },

    onClickHeaderMenuItem(e) {
      const me = this;
      const menuItem = e.target.closest(`.${COLUMNS_MENU_ITEM}`);

      if (menuItem && !me.animatingColumnsPosition) {
        const inputCheckBox = menuItem.querySelector('input');
        const columnIndex = Number(menuItem.getAttribute('col-index'));
        const column = me.columns[columnIndex];
        const isInputTarget = e.target.tagName.toLowerCase() === 'input';

        if (!me.isPossibleToHideColumn() &&
          ((!isInputTarget && inputCheckBox.checked) || (isInputTarget && !inputCheckBox.checked))
        ) {
          if (isInputTarget) {
            e.preventDefault();
          }

          console.warn('Hiding column was prevented because it requires at least 1 visible column');

          return;
        }

        me.animatingColumnsPosition = true;
        me.gridEl.classList.add(ANIMATE_CELLS_POSITION);

        if (!isInputTarget) {
          inputCheckBox.checked = !inputCheckBox.checked;
        }

        if (inputCheckBox.checked) {
          me.showColumn(column);
        } else {
          me.hideColumn(column);
        }

        setTimeout(() => {
          me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
          delete me.animatingColumnsPosition;
        }, 300);
      }
    },

    onDocClickForHeaderCellMenu(column, e) {
      const me = this;

      if (!e.target.closest(`.${COLUMNS_MENU}`) && !e.target.closest(`.${HEADER_CELL_MENU}`)) {
        me.destroyHeaderCellMenuList(column);
      }
    },

    destroyHeaderCellMenuList(column) {
      const me = this;

      document.removeEventListener('mousedown', me.onDocClickForHeaderCellMenuFn);

      if(column) {
        column.elMenuList?.remove();
        delete column.elMenuList;
      }
      else if(me.activeElMenuList){
        me.scroller.columnsViewRange.forEach(columnIndex => {
          const column = me.columns[columnIndex];
          if(column.elMenuList){
            column.elMenuList.remove();
            delete column.elMenuList;
          }
        })
      }
      delete me.activeElMenuList;
    },

    reSetVisibleHeaderColumnsIndex(){
      const me = this;
      const columnsViewRange = me.scroller.columnsViewRange;

      for(let i = 0, iL = columnsViewRange.length;i<iL;i++){
        const columnIndex = columnsViewRange[i];
        //const columnIndex = i;
        const column = me.columns[columnIndex];
        const headerCellEl = column.headerCellEl;
        const filterCellEl = column.filterCellEl;

        if(column.hidden){
          continue;
        }

        if(headerCellEl){
          if(Number(headerCellEl.getAttribute('col-index')) !== columnIndex){
            headerCellEl.setAttribute('col-index', columnIndex);
          }
        }

        if(filterCellEl){
          if(Number(filterCellEl.getAttribute('col-index')) !== columnIndex){
            filterCellEl.setAttribute('col-index', columnIndex);
          }
        }
      }
    }
  }

  Object.assign(Grid.prototype, GridMixinHeader);

})();
