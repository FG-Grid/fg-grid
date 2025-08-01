(() => {
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
    HEADER_CELL_COLUMN_GROUP,
    HEADER_CELL_COLUMN_GROUP_CHILD,
    HEADER_CELL_SPAN_HEIGHT,
    HEADER_CELL_STICKY,
    BODY,
    COLUMN_RESIZING,
    COLUMN_DRAGGING,
    COLUMNS_MENU,
    COLUMNS_MENU_ITEM,
    COLUMNS_MENU_ITEM_TEXT,
    COLUMNS_MENU_ITEM_GROUP_TEXT,
    FILTER_INDICATOR_CONTAINER,
    SORT_ASC,
    SORT_DESC,
    SORT_ORDER,
    SORT_INDICATOR_CONTAINER,
    INPUT_CHECKBOX,
    ROW_GROUP_BAR_ITEM_ACTIVE
  } = Fancy.cls;

  const { div, span, input } = Fancy;

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

        if(me.columnsLevel > 1){
          const cellGroup = me.createGroupHeaderCell(i, 1);
          cellGroup && me.headerInnerGroup1ContainerEl.appendChild(cellGroup);
        }
      }
    },
    appendHeaderCell(columnIndex) {
      const me = this;
      const rowEl = me.headerInnerContainerEl;
      const cell = me.createHeaderCell(columnIndex);

      rowEl.appendChild(cell);

      if(me.columnsLevel > 1){
        const cellGroup = me.createGroupHeaderCell(columnIndex, 1);
        cellGroup && me.headerInnerGroup1ContainerEl.appendChild(cellGroup);
      }
    },
    createHeaderCell(columnIndex) {
      const me = this;
      const column = me.columns[columnIndex];
      const headerRowHeight = me.headerRowHeight;
      const cellHeight = column.columnGroupSpanHeight ? headerRowHeight * 2 : headerRowHeight;
      const cell = div(HEADER_CELL, {
        width: column.width + 'px',
        left: column.left + 'px',
        height: cellHeight + 'px'
      });
      const value = column.title;

      if(column.headerCellEl){
        column.headerCellEl.remove();
        delete column.headerCellEl;
      }

      if(column.sortable){
        if(column.type){
          cell.classList.add(HEADER_CELL_SORTABLE);
        } else {
          console.warn('FG-Grid: Column has property sortable=true, but does not have type');
          console.warn('FG-Grid: Add type for column to enable sorting', column);
        }
      }

      if(column.resizable === false){
        cell.classList.add(HEADER_CELL_NOT_RESIZABLE);
      }

      column.sticky && cell.classList.add(HEADER_CELL_STICKY);
      column.extraCls && cell.classList.add(column.extraCls);

      column.parent && cell.classList.add(HEADER_CELL_COLUMN_GROUP_CHILD);
      column.columnGroupSpanHeight && cell.classList.add(HEADER_CELL_SPAN_HEIGHT);

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

      label.append(cellText, filterContainer, sortContainer);

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

      column.menu !== false && cell.appendChild(elMenu);
      column.resizable !== false && cell.appendChild(cellResize);

      cell.addEventListener('mousedown', me.onCellMouseDown.bind(this));

      column.headerCellEl = cell;

      return cell;
    },
    createGroupHeaderCell(columnIndex, level) {
      const me = this;
      let column;

      if(level === 1){
        column = me['columns' + (level + 1)][columnIndex];
      }

      if(column.ignore){
        return false;
      }

      if(column.headerCellEl){
        return false;
      }

      const cell = div([HEADER_CELL, HEADER_CELL_COLUMN_GROUP], {
        width: column.width + 'px',
        left: column.left + 'px',
        height: me.headerRowHeight + 'px',
        display: column.spanning ? 'none': undefined
      });
      const value = column.title;

      column.resizable === false && cell.classList.add(HEADER_CELL_NOT_RESIZABLE);
      column.sticky && cell.classList.add(HEADER_CELL_STICKY);

      cell.setAttribute('col-index', columnIndex);
      cell.setAttribute('col-id', column.id);

      const label = div(HEADER_CELL_LABEL);
      const cellText = div(HEADER_CELL_TEXT);
      cellText.innerHTML = value;

      const cellResize = div(HEADER_CELL_RESIZE);
      cellResize.addEventListener('mousedown', me.onResizeMouseDown.bind(this));

      label.appendChild(cellText);

      cell.appendChild(label);

      column.resizable !== false && cell.appendChild(cellResize);

      cell.addEventListener('mousedown', me.onCellGroupMouseDown.bind(this));

      column.headerCellEl = cell;

      return cell;
    },
    onCellGroupMouseDown(event){
      const me = this;

      const cell = event.target.classList.contains(HEADER_CELL)? event.target : event.target.closest(`.${HEADER_CELL}`);
      const columnIndex = Number(cell.getAttribute('col-index'));
      const column = me.columns2[columnIndex];

      if(column.draggable === false){
        return;
      }

      me.columnDragDownX = event.pageX;
      me.columnDragDownY = event.pageY;
      me.columnDragMouseDownColumn = column;
      me.columnDragMouseDownColumnIndex = columnIndex;

      if(column.children.length < column.columnGroup.children.length){
        const childrenOutSideChildren = column.columnGroup.children.filter($column => {
          return !column.children.some($$column => {
            return $$column.id === $column.id;
          });
        });

        childrenOutSideChildren.forEach($column => {
          const toIndex = columnIndex + column.children.length;
          me.moveColumn(me.columnsIdIndexMap.get($column.id), toIndex);
        });
      }

      me.onColumnGroupDragMouseMoveFn = me.onColumnGroupDragMouseMove.bind(this);
      document.addEventListener('mousemove', me.onColumnGroupDragMouseMoveFn);

      document.addEventListener('mouseup', () => {
        delete me.columnDragDownX;
        delete me.columnDragDownY;
        delete me.columnDragMouseDownColumn;
        delete me.debouceColumnDraggingFn;

        setTimeout(() => {
          me.gridEl.classList.remove(COLUMN_DRAGGING);
          me.columnDragging?.dragColumnCellEl.remove();
          delete me.columnDragging;

          if(me.$requiresReSetGroupColumn && me.rowGroupType === 'column'){
            delete me.$requiresReSetGroupColumn;
            if(me.rowGroupBarItemColumns.length === 1){
              let indexToAddColumn = 0;
              me.$rowGroupColumn.hidden = true;
              if(me.columns[0].type === 'order'){
                me.columns.splice(1, 0, me.$rowGroupColumn);
                indexToAddColumn = 1;
              } else {
                me.columns.unshift(me.$rowGroupColumn);
              }

              setTimeout(() => {
                me.scroller.generateNewRange(false);
                me.reSetVisibleHeaderColumnsIndex();
                me.showColumn(me.columns[indexToAddColumn]);
              },1);
            }
          }
        }, 1);

        document.removeEventListener('mousemove', me.onColumnGroupDragMouseMoveFn);
      }, {
        once: true
      });
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

        setTimeout(() => {
          me.activeRowGroupBarItemEl?.classList.remove(ROW_GROUP_BAR_ITEM_ACTIVE);

          me.gridEl.classList.remove(COLUMN_DRAGGING);
          me.columnDragging?.dragColumnCellEl.remove();
          delete me.columnDragging;

          if(me.$requiresReSetGroupColumn && me.rowGroupType === 'column'){
            delete me.$requiresReSetGroupColumn;
            if(me.rowGroupBarItemColumns.length === 1){
              let indexToAddColumn = 0;
              me.$rowGroupColumn.hidden = true;
              if(me.columns[0].type === 'order'){
                me.columns.splice(1, 0, me.$rowGroupColumn);
                if(me.columnsLevel > 1){
                  me.columns[1].columnGroupSpanHeight = true;
                }
                indexToAddColumn = 1;
              } else {
                me.columns.unshift(me.$rowGroupColumn);
                if(me.columnsLevel > 1){
                  me.columns[0].columnGroupSpanHeight = true;
                }
              }

              if(me.columnsLevel > 1){
                me.columns2.unshift({
                  ignore: true
                });

                me.generateColumnId(me.columns2[0]);
                me.columns[0].columnGroupSpanHeight = true;
              }

              setTimeout(() => {
                me.scroller.generateNewRange(false);
                me.reSetColumnsIdIndexMap();
                me.reSetVisibleHeaderColumnsIndex();

                //me.scroller.generateNewRange();
                //me.reCalcColumnsPositions();
                //me.updateWidth();
                //me.updateCellPositions();

                me.showColumn(me.columns[indexToAddColumn]);
              },1);
            }
          }

          if(me.rowGroupBarItemColumns && me.rowGroupBarItemColumns.length !== me.store.rowGroups.length) me.reConfigRowGroups();
        }, 1);

        document.removeEventListener('mousemove', me.onColumnDragMouseMoveFn);
      }, {
        once: true
      });
    },
    onResizeMouseDown(event) {
      const me = this;
      const gridEl = me.gridEl;
      const cell = event.target.closest(`.${HEADER_CELL}`);
      const columnIndex = Number(cell.getAttribute('col-index'));
      const column = me.columns[columnIndex];

      event.preventDefault();
      event.stopPropagation();

      me.isEditing && me.hideActiveEditor();

      if(column.resizable === false){
        return;
      }

      me.columnResizing = true;

      me.resizeDownX = event.pageX;

      if(cell.classList.contains(HEADER_CELL_COLUMN_GROUP)){
        me.resizeColumnGroup = me.columns2[columnIndex];
        me.resizeColumnGroupChildrenWidths = me.resizeColumnGroup.children
          .map(column => !column.hidden && column.width)
          .filter(value => value !== false);
      }

      me.resizeDownColumnWidth = column.width;
      me.resizeDownColumnIndex = columnIndex;

      me.onResizeMouseMoveFn = me.onResizeMouseMove.bind(this);

      document.addEventListener('mouseup', me.onResizeMouseUp.bind(this), {
        once: true
      });
      document.body.addEventListener('mousemove', me.onResizeMouseMoveFn);

      gridEl.classList.add(COLUMN_RESIZING);
      gridEl.style.cursor = 'ew-resize';
      gridEl.style.userSelect = 'none';
      gridEl.querySelectorAll(`.${HEADER_CELL}`).forEach(cell => {
        cell.style.cursor = 'ew-resize';
      });
      gridEl.querySelectorAll(`.${BODY}`).forEach(bodyEl => {
        bodyEl.style.cursor = 'ew-resize';
      });
    },
    onResizeMouseUp() {
      const me = this;

      me.columnResizing = false;
      delete me.resizeColumnGroup;
      delete me.resizeDownX;
      delete me.resizeDownColumnWidth;
      delete me.resizeDownColumnIndex;

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

      if (me.resizeColumnGroup) {
        const children = me.resizeColumnGroup.children.filter(column => column.hidden !== true);
        const resizeColumnGroupChildrenWidths = me.resizeColumnGroupChildrenWidths;
        children.forEach((column, i) => {
          column.width = resizeColumnGroupChildrenWidths[i] + deltaX/children.length;
        });
      } else {
        column.width = newWidth;
      }

      if(column.parent){
        column.parent.firstColumn.width = column.parent.firstColumn.children.reduce((value, column, i) => {
          const groupLevel2Column = me.columns2[i];
          if(groupLevel2Column.spanning){
            groupLevel2Column.width = column.width;
            groupLevel2Column.left = column.left;
            groupLevel2Column.headerCellEl.style.left = column.left + 'px';
            groupLevel2Column.headerCellEl.style.width = column.width + 'px';
          }

          if(column.hidden){
            return value;
          }

          return value + column.width;
        }, 0);
        column.parent.firstColumn.headerCellEl.style.width = column.parent.firstColumn.width + 'px';
      }

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
            column.parent ? `<div class="${COLUMNS_MENU_ITEM_GROUP_TEXT}">${column.parent.title}</div>`: '',
            `<div class="${COLUMNS_MENU_ITEM_TEXT}">${column.title}</div>`,
          '</div>'
        ].join('');
      }).join('');

      column.elMenuList = el;
      document.body.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '1';
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

          console.warn('FG-Grid: Hiding column was prevented because it requires at least 1 visible column');

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
      if (!e.target.closest(`.${COLUMNS_MENU}`) && !e.target.closest(`.${HEADER_CELL_MENU}`)) {
        this.destroyHeaderCellMenuList(column);
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
        });
      }
      delete me.activeElMenuList;
    },
    isColumnIndexInViewRange(columnIndex){
      const me = this;
      const columnsViewRange = me.scroller.columnsViewRange;

      if(columnsViewRange.length < 2){
        return true;
      }

      return columnsViewRange[0] <= columnIndex && columnIndex <= columnsViewRange.at(-1);
    },
    reSetVisibleHeaderColumnsIndex(){
      const me = this;
      const columnsViewRange = me.scroller.columnsViewRange;

      for(let i = 0, iL = columnsViewRange.length;i<iL;i++){
        const columnIndex = columnsViewRange[i];
        const column = me.columns[columnIndex];
        const headerCellEl = column.headerCellEl;
        const filterCellEl = column.filterCellEl;

        if(column.hidden) continue;

        if(headerCellEl && Number(headerCellEl.getAttribute('col-index')) !== columnIndex){
          headerCellEl.setAttribute('col-index', columnIndex);
        }

        if(me.columnsLevel > 1){
          const columnGroup = me.columns2[columnIndex];
          const headerCellEl = columnGroup?.headerCellEl;

          if(headerCellEl && Number(headerCellEl.getAttribute('col-index')) !== columnIndex){
            headerCellEl.setAttribute('col-index', columnIndex);
          }
        }

        if(filterCellEl && Number(filterCellEl.getAttribute('col-index')) !== columnIndex){
          filterCellEl.setAttribute('col-index', columnIndex);
        }
      }
    },
    prepareGroupHeaderColumns(config){
      const me = this;
      let levels = [];

      me.columnsGroups = {};

      const goThroughColumns = (columns, level, index = 0) => {
        let hasChildren = columns.some(column => column.children !== undefined);

        columns.forEach(column => {
          levels[level] = levels[level] || [];

          if(column.children){
            me.generateColumnId(column);
            me.columnsGroups[column.id] = column;

            let iL = index + column.children.length;
            goThroughColumns(column.children, level + 1, index, column);
            let spanned = false;
            let firstColumn;
            let i = 0;
            for(;index<iL;index++,i++){
              if(!spanned){
                levels[level][index] = {
                  columnGroup: column,
                  ...column
                };

                levels[level][index].children = [...column.children];
                delete levels[level][index].id;
                firstColumn = levels[level][index];
                // Link to self
                levels[level][index].firstColumn = levels[level][index];
              } else {
                levels[level][index] = {
                  firstColumn,
                  spanning: true,
                  columnGroup: column,
                  ...column
                };
                delete levels[level][index].children;
                delete levels[level][index].id;
              }
              levels[level][index].child = column.children[i];
              spanned = true;
            }
          } else {
            if(hasChildren){
              levels[level + 1] = levels[level + 1] || [];
              column.columnGroupSpanHeight = true;
              levels[level + 1][index] = column;
              levels[level][index] = {
                ignore: true
              };
            } else {
              if(level > 0) (column.parent = true);

              levels[level][index] = column;
            }

            index++;
          }
        });
      };

      goThroughColumns(config.columns, 0);

      levels = levels.reverse();
      levels.forEach((columns, level) => {
        if(level === 0){
          config.columns = columns;
        } else {
          config[`columns${level + 1}`] = columns;
        }

        columns.forEach((column, columnIndex) => {
          if(column.parent === true){
            column.parent = levels[level + 1][columnIndex];
          }
        });
      });

      config.columnsLevel = levels.length;
    }
  };

  Object.assign(Grid.prototype, GridMixinHeader);
})();
