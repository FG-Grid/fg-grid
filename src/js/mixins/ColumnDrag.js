(()=> {

  const {
    ANIMATE_CELLS_POSITION,
    COLUMN_DRAGGING,
    FAKE_COLUMN_CELL_DRAGGING,
    FAKE_COLUMN_CELL_DRAGGING_ALLOW,
    FAKE_COLUMN_CELL_DRAGGING_DENY,
    SVG_ITEM,
    SVG_BLOCK,
    SVG_GROUP,
    SVG_DRAG
  } = Fancy.cls;

  const OFFSET_DRAG_CELL = 10;

  /**
   * @mixin GridMixinColumnDrag
   */

  const GridMixinColumnDrag = {
    onColumnDragMouseMove(event){
      const me = this;

      if(me.columnDragging){
        const columnDragging = me.columnDragging;
        const dragColumnCellEl = columnDragging.dragColumnCellEl;
        const {
          pageX,
          pageY
        } = event;

        dragColumnCellEl.style.setProperty('left', (pageX - OFFSET_DRAG_CELL) + 'px');
        dragColumnCellEl.style.setProperty('top', (pageY - OFFSET_DRAG_CELL) + 'px');

        if(me.rowGroupBar && me.isCursorInRowGroupBar(event, columnDragging.rowGroupBarElRect)){
          if(!columnDragging.inBar){
            columnDragging.inBar = true;
            let isColumnPresentedInRowGroupBar = false;

            me.rowGroupBarItemColumns?.forEach(column => {
              if(column.title === columnDragging.column.title){
                isColumnPresentedInRowGroupBar = true;
              }
            });

            if((isColumnPresentedInRowGroupBar && !columnDragging.dragItemFromRowGroupBar) || columnDragging.column.$rowGroups){
              dragColumnCellEl.classList.add(FAKE_COLUMN_CELL_DRAGGING_DENY);
              dragColumnCellEl.classList.remove(FAKE_COLUMN_CELL_DRAGGING_ALLOW);
            }
            else {
              dragColumnCellEl.classList.add(FAKE_COLUMN_CELL_DRAGGING_ALLOW);
              dragColumnCellEl.classList.remove(FAKE_COLUMN_CELL_DRAGGING_DENY);

              if(!columnDragging.dragItemFromRowGroupBar){
                me.onRowGroupBarMouseEnter(event);
                me.hideColumn(me.columnDragging.column, true);
              }
            }
          }
          else{
            const cursorInRowGroupBarItem = me.isCursorInAnotherRowGroupBarItem(event, columnDragging.rowGroupBarItemsRect);
            const activeRowGroupIndex = Number(me.activeRowGroupBarItemEl.getAttribute('row-group-order-index'));
            if(cursorInRowGroupBarItem !== undefined && cursorInRowGroupBarItem !== activeRowGroupIndex){
              me.changeRowGroupBarItemOrder(activeRowGroupIndex, cursorInRowGroupBarItem);
            }
          }
        }
        else if(columnDragging.inBar) {
          delete columnDragging.inBar;

          if(columnDragging.dragItemFromRowGroupBar){
            dragColumnCellEl.classList.remove(FAKE_COLUMN_CELL_DRAGGING_ALLOW, FAKE_COLUMN_CELL_DRAGGING_DENY);
            dragColumnCellEl.classList.add(FAKE_COLUMN_CELL_DRAGGING_ALLOW);
          } else {
            if (!dragColumnCellEl.classList.contains(FAKE_COLUMN_CELL_DRAGGING_DENY)) {
              me.showColumn(columnDragging.column, true);
              me.onRowGroupBarMouseLeave(event);
            }
            dragColumnCellEl.classList.remove(FAKE_COLUMN_CELL_DRAGGING_ALLOW, FAKE_COLUMN_CELL_DRAGGING_DENY);
          }
        }
        else{
          if(!me.debouceColumnDraggingFn){
            me.debouceColumnDraggingFn = Fancy.debounce(me.onColumnDragging, 50);
          }
          me.debouceColumnDraggingFn(event);
        }
      }
      else{
        if(me.isEditing){
          me.hideActiveEditor();
        }

        const deltaX = Math.abs(event.pageX - me.columnDragDownX);
        const deltaY = Math.abs(event.pageY - me.columnDragDownY);

        if(deltaX > me.deltaStartColumnDrag || deltaY > me.deltaStartColumnDrag){
          const column = me.columnDragMouseDownColumn;

          me.columnDragging = {
            column,
            dragColumnCellEl: me.createDragColumnCellEl(column)
          };

          if(me.rowGroupBar){
            me.columnDragging.rowGroupBarItemsRect = me.getRowGroupBarItemsRect();
          }

          me.gridEl.classList.add(COLUMN_DRAGGING);

          if(me.rowGroupBar){
            me.columnDragging.rowGroupBarElRect = me.getRowGroupBarElRect();
          }
        }
      }
    },

    createDragColumnCellEl(column){
      const cell = document.createElement('div');

      const textEl = document.createElement('span');
      const cellText = column.title;
      textEl.innerHTML = cellText

      const svgGroup = Fancy.svg.group;
      const groupLogoEl = document.createElement('span');
      groupLogoEl.classList.add(SVG_ITEM, SVG_GROUP);
      groupLogoEl.innerHTML = svgGroup;

      const dragSvgEl = document.createElement('span');
      dragSvgEl.classList.add(SVG_ITEM, SVG_DRAG);
      dragSvgEl.innerHTML = Fancy.svg.groupCellDrag;

      const blockSvgEl = document.createElement('span');
      blockSvgEl.classList.add(SVG_ITEM, SVG_BLOCK);
      blockSvgEl.innerHTML = Fancy.svg.block;

      cell.appendChild(blockSvgEl);
      cell.appendChild(groupLogoEl);
      cell.appendChild(dragSvgEl);
      cell.appendChild(textEl);
      cell.classList.add(FAKE_COLUMN_CELL_DRAGGING, 'fg-theme-' + this.theme);
      document.body.appendChild(cell);

      return cell;
    },

    isCursorInRowGroupBar({pageX, pageY}, barRect){
      return pageX < barRect.bottomX && pageX > barRect.x && pageY < barRect.rightY && pageY > barRect.y;
    },

    isCursorInAnotherRowGroupBarItem({pageX}, barItemsRect){
      if(barItemsRect.length === 0){
        return;
      }

      for(let i = 0, iL = barItemsRect.length;i<iL;i++){
        const itemRect = barItemsRect[i];

        if(pageX > itemRect.x && pageX < itemRect.rightX){
          return i;
        }
      }

      if(pageX < barItemsRect[0].x){
        return 0;
      }

      if(pageX > barItemsRect[barItemsRect.length - 1].rightX){
        return barItemsRect.length - 1;
      }
    },

    isCursorInAnotherColumn({pageX}){
      const me = this;
      const headerRect = me.headerEl.getBoundingClientRect();
      const columnsViewRange = me.scroller.columnsViewRange;

      pageX -= headerRect.x;

      for(let i = 0, iL = columnsViewRange.length;i<iL;i++){
        const columnIndex = columnsViewRange[i];
        const column = me.columns[columnIndex];

        if(pageX >= column.left && pageX <= column.left + column.width){
          return columnIndex;
        }
      }
    },

    onColumnDragging(event){
      const me = this;

      if(me.animatingColumnsPosition || me.activeRowGroupBarItemEl){
        return;
      }

      const cursorInColumnIndex = me.isCursorInAnotherColumn(event);

      if(cursorInColumnIndex !== undefined && me.columnDragMouseDownColumnIndex !== cursorInColumnIndex){
        me.moveColumn(me.columnDragMouseDownColumnIndex, cursorInColumnIndex);
        me.columnDragMouseDownColumnIndex = cursorInColumnIndex;
      }
    },

    moveColumn(columnIndex, toIndex){
      const me = this;

      me.animatingColumnsPosition = true;
      me.gridEl.classList.add(ANIMATE_CELLS_POSITION);

      const column = me.columns.splice(columnIndex, 1)[0];

      me.columns.splice(toIndex, 0, column);
      let oldOrders = [];

      me.reSetVisibleHeaderColumnsIndex();
      if(columnIndex<toIndex){
        for(let i=columnIndex, iL = toIndex;i<=iL;i++){
          oldOrders.push(i);
        }

        const removedIndex = oldOrders.shift();
        oldOrders.push(removedIndex);

        me.reSetVisibleBodyColumnsIndex(columnIndex, toIndex, oldOrders);
      }
      else{
        for(let i=toIndex, iL=columnIndex;i<=iL;i++){
          oldOrders.push(i);
        }

        const removedIndex = oldOrders.pop();
        oldOrders.unshift(removedIndex);

        me.reSetVisibleBodyColumnsIndex(toIndex, columnIndex, oldOrders);
      }

      me.scroller.generateNewRange(false);
      me.reCalcColumnsPositions();
      me.updateCellPositions();

      setTimeout(() => {
        me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
        delete me.animatingColumnsPosition;
      }, 300);
    }
  }

  Object.assign(Grid.prototype, GridMixinColumnDrag);

})();
