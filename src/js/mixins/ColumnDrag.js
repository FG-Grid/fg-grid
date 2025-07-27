(() => {
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
  const { span, div, EL } = Fancy;

  /**
   * @mixin GridMixinColumnDrag
   */
  const GridMixinColumnDrag = {
    onColumnGroupDragMouseMove(event){
      const me = this;

      if(me.columnDragging){
        const columnDragging = me.columnDragging;
        const dragColumnCellEl = EL(columnDragging.dragColumnCellEl);
        const {
          pageX,
          pageY
        } = event;

        dragColumnCellEl.prop('left', (pageX - OFFSET_DRAG_CELL) + 'px');
        dragColumnCellEl.prop('top', (pageY - OFFSET_DRAG_CELL) + 'px');

        if(!me.debouceColumnDraggingFn){
          me.debouceColumnDraggingFn = Fancy.debounce(me.onColumnGroupDragging, 50);
        }
        me.debouceColumnDraggingFn(event);
      } else {
        me.isEditing && me.hideActiveEditor();

        const deltaX = Math.abs(event.pageX - me.columnDragDownX);
        const deltaY = Math.abs(event.pageY - me.columnDragDownY);

        if(deltaX > me.deltaStartColumnDrag || deltaY > me.deltaStartColumnDrag){
          const column = me.columnDragMouseDownColumn;

          me.columnDragging = {
            column,
            dragColumnCellEl: me.createDragColumnCellEl(column)
          };

          me.gridEl.classList.add(COLUMN_DRAGGING);
        }
      }
    },
    onColumnGroupDragging(event){
      const me = this;

      if(me.animatingColumnsPosition || me.activeRowGroupBarItemEl) return;

      const cursorInColumnIndex = me.isCursorInAnotherColumnForColumnGroup(event);

      if(cursorInColumnIndex !== undefined && me.columnDragMouseDownColumnIndex !== cursorInColumnIndex){
        if(me.columns[cursorInColumnIndex]?.type === 'order') return;
        const columnDragMouseDownColumnIndex = me.columnDragMouseDownColumnIndex;

        me.columnDragMouseDownColumn.children.forEach((groupColumn, i) => {
          if(cursorInColumnIndex < columnDragMouseDownColumnIndex){
            me.moveColumn(columnDragMouseDownColumnIndex + i, cursorInColumnIndex + i);
          } else {
            me.moveColumn(columnDragMouseDownColumnIndex, cursorInColumnIndex);
          }
        });

        if(cursorInColumnIndex < columnDragMouseDownColumnIndex){
          me.columnDragMouseDownColumnIndex = cursorInColumnIndex;
        } else {
          me.columnDragMouseDownColumnIndex = me.columnsIdIndexMap.get(me.columnDragMouseDownColumn.id);
        }
      }
    },
    onColumnDragMouseMove(event){
      const me = this;

      if(me.columnDragging){
        const columnDragging = me.columnDragging;
        const dragColumnCellEl = EL(columnDragging.dragColumnCellEl);
        const {
          pageX,
          pageY
        } = event;

        dragColumnCellEl.prop('left', (pageX - OFFSET_DRAG_CELL) + 'px');
        dragColumnCellEl.prop('top', (pageY - OFFSET_DRAG_CELL) + 'px');

        if(me.rowGroupBar && me.isCursorInRowGroupBar(event, columnDragging.rowGroupBarElRect)){
          if(!columnDragging.inBar){
            columnDragging.inBar = true;
            let isColumnPresentedInRowGroupBar = false;

            me.rowGroupBarItemColumns?.forEach(column => {
              if(column.title === columnDragging.column.title){
                isColumnPresentedInRowGroupBar = true;
              }
            });

            if((isColumnPresentedInRowGroupBar && !columnDragging.dragItemFromRowGroupBar) || columnDragging.column.$isRowGroupColumn){
              dragColumnCellEl.cls(FAKE_COLUMN_CELL_DRAGGING_DENY);
              dragColumnCellEl.removeCls(FAKE_COLUMN_CELL_DRAGGING_ALLOW);
            } else {
              dragColumnCellEl.cls(FAKE_COLUMN_CELL_DRAGGING_ALLOW);
              dragColumnCellEl.removeCls(FAKE_COLUMN_CELL_DRAGGING_DENY);

              if(!columnDragging.dragItemFromRowGroupBar){
                me.onRowGroupBarMouseEnter(event);
                me.hideColumn(me.columnDragging.column, true);
              }
            }

            columnDragging.rowGroupBarItemsRect = me.getRowGroupBarItemsRect();
          } else {
            const cursorInRowGroupBarItem = me.isCursorInAnotherRowGroupBarItem(event, columnDragging.rowGroupBarItemsRect);
            const activeRowGroupIndex = Number(me.activeRowGroupBarItemEl.getAttribute('row-group-order-index'));
            if(cursorInRowGroupBarItem !== undefined && cursorInRowGroupBarItem !== activeRowGroupIndex){
              me.changeRowGroupBarItemOrder(activeRowGroupIndex, cursorInRowGroupBarItem);
            }
          }
        } else if(columnDragging.inBar) {
          delete columnDragging.inBar;

          if(columnDragging.dragItemFromRowGroupBar){
            dragColumnCellEl.removeCls(FAKE_COLUMN_CELL_DRAGGING_ALLOW, FAKE_COLUMN_CELL_DRAGGING_DENY);
            dragColumnCellEl.cls(FAKE_COLUMN_CELL_DRAGGING_ALLOW);
          } else {
            if (!dragColumnCellEl.containCls(FAKE_COLUMN_CELL_DRAGGING_DENY)) {
              me.showColumn(columnDragging.column, true);
              me.onRowGroupBarMouseLeave(event);
            }
            dragColumnCellEl.removeCls(FAKE_COLUMN_CELL_DRAGGING_ALLOW, FAKE_COLUMN_CELL_DRAGGING_DENY);
          }
        } else {
          if(!me.debouceColumnDraggingFn){
            me.debouceColumnDraggingFn = Fancy.debounce(me.onColumnDragging, 50);
          }
          me.debouceColumnDraggingFn(event);
        }
      } else {
        me.isEditing && me.hideActiveEditor();

        const deltaX = Math.abs(event.pageX - me.columnDragDownX);
        const deltaY = Math.abs(event.pageY - me.columnDragDownY);

        if(deltaX > me.deltaStartColumnDrag || deltaY > me.deltaStartColumnDrag){
          const column = me.columnDragMouseDownColumn;

          me.columnDragging = {
            column,
            dragColumnCellEl: me.createDragColumnCellEl(column)
          };

          if(me.rowGroupBar) (me.columnDragging.rowGroupBarItemsRect = me.getRowGroupBarItemsRect());

          me.gridEl.classList.add(COLUMN_DRAGGING);

          if(me.rowGroupBar) (me.columnDragging.rowGroupBarElRect = me.getRowGroupBarElRect());
        }
      }
    },
    createDragColumnCellEl(column){
      const cell = div([FAKE_COLUMN_CELL_DRAGGING, 'fg-theme-' + this.theme]);

      const textEl = span();
      textEl.innerHTML = column.title;

      const svgGroup = Fancy.svg.group;
      const groupLogoEl = span([SVG_ITEM, SVG_GROUP]);
      groupLogoEl.innerHTML = svgGroup;

      const dragSvgEl = span([SVG_ITEM, SVG_DRAG]);
      dragSvgEl.innerHTML = Fancy.svg.groupCellDrag;

      const blockSvgEl = span([SVG_ITEM, SVG_BLOCK]);
      blockSvgEl.innerHTML = Fancy.svg.block;

      cell.append(blockSvgEl, groupLogoEl, dragSvgEl, textEl);
      document.body.appendChild(cell);

      return cell;
    },
    isCursorInRowGroupBar({ pageX, pageY }, barRect){
      return pageX < barRect.bottomX && pageX > barRect.x && pageY < barRect.rightY && pageY > barRect.y;
    },
    isCursorInAnotherRowGroupBarItem({ pageX }, barItemsRect){
      if(barItemsRect.length === 0) return;

      for(let i = 0, iL = barItemsRect.length;i<iL;i++){
        const itemRect = barItemsRect[i];

        if(pageX > itemRect.x && pageX < itemRect.rightX) return i;
      }

      if(pageX < barItemsRect[0].x) return 0;
      if(pageX > barItemsRect[barItemsRect.length - 1].rightX) return barItemsRect.length - 1;
    },
    isCursorInAnotherColumnForColumnGroup({ pageX }){
      const me = this;
      const headerRect = me.headerEl.getBoundingClientRect();
      const columnsViewRange = me.scroller.columnsViewRange;

      pageX -= headerRect.x;
      pageX += me.scroller.scrollLeft;

      for(let i = 0, iL = columnsViewRange.length;i<iL;i++){
        const columnIndex = columnsViewRange[i];
        const column = me.columns[columnIndex];

        if(column.parent && column.parent.columnGroup.id && me.columnDragMouseDownColumn.columnGroup.id){}
        else if(pageX >= column.left && pageX <= column.left + column.width){
          return columnIndex;
        }
      }
    },
    isCursorInAnotherColumn({ pageX }){
      const me = this;
      const headerRect = me.headerEl.getBoundingClientRect();
      const columnsViewRange = me.scroller.columnsViewRange;

      pageX -= headerRect.x;
      pageX += me.scroller.scrollLeft;

      for(let i = 0, iL = columnsViewRange.length;i<iL;i++){
        const columnIndex = columnsViewRange[i];
        const column = me.columns[columnIndex];

        if(pageX >= column.left && pageX <= column.left + column.width) return columnIndex;
      }
    },
    onColumnDragging(event){
      const me = this;

      if(me.animatingColumnsPosition || me.columnDragging?.inBar) return;

      const cursorInColumnIndex = me.isCursorInAnotherColumn(event);

      if(cursorInColumnIndex !== undefined && me.columnDragMouseDownColumnIndex !== cursorInColumnIndex){
        if(me.columns[cursorInColumnIndex]?.type === 'order') return;

        me.moveColumn(me.columnDragMouseDownColumnIndex, cursorInColumnIndex);
        me.columnDragMouseDownColumnIndex = cursorInColumnIndex;
      }
    },
    moveColumn(columnIndex, toIndex){
      const me = this;

      me.animatingColumnsPosition = true;
      me.gridEl.classList.add(ANIMATE_CELLS_POSITION);

      const columnsViewRange = me.scroller.columnsViewRange;

      const reRenderColumns = [];

      if(columnsViewRange.length > 1){
        if(columnIndex > columnsViewRange.at(-1)){
          const lastColumnIndexInViewRange = me.scroller.columnsViewRange.at(-1);
          me.removeColumnCells([lastColumnIndexInViewRange]);
          reRenderColumns.push(toIndex);
        }

        if(toIndex > columnsViewRange.at(-1) && columnIndex >= columnsViewRange[0]){
          me.removeColumnCells([columnIndex]);
          const lastColumnIndexInViewRange = me.scroller.columnsViewRange.at(-1);
          reRenderColumns.push(lastColumnIndexInViewRange);
        }

        if(columnIndex < columnsViewRange[0] && me.isColumnIndexInViewRange(toIndex)) {
          const firstColumnIndexInViewRange = me.scroller.columnsViewRange[0];
          me.removeColumnCells([firstColumnIndexInViewRange]);
          reRenderColumns.push(toIndex);
        }

        if(toIndex < columnsViewRange[0] && me.isColumnIndexInViewRange(columnIndex)){
          const firstColumnIndexInViewRange = me.scroller.columnsViewRange[0];
          me.removeColumnCells([columnIndex]);
          reRenderColumns.push(firstColumnIndexInViewRange);
        }
      }

      const column = me.columns.splice(columnIndex, 1)[0];

      me.columns.splice(toIndex, 0, column);
      let oldOrders = [];

      if(me.columnsLevel > 1){
        const columnLevel2 = me.columns2.splice(columnIndex, 1)[0];
        me.columns2.splice(toIndex, 0, columnLevel2);

        me.updateColumnGroupLevel2();
      }

      me.reSetVisibleHeaderColumnsIndex();
      if(columnIndex<toIndex){
        for(let i=columnIndex, iL = toIndex;i<=iL;i++) oldOrders.push(i);

        const removedIndex = oldOrders.shift();
        oldOrders.push(removedIndex);

        me.reSetVisibleBodyColumnsIndex(columnIndex, toIndex, oldOrders);
      } else {
        for(let i=toIndex, iL=columnIndex;i<=iL;i++) oldOrders.push(i);

        const removedIndex = oldOrders.pop();
        oldOrders.unshift(removedIndex);

        me.reSetVisibleBodyColumnsIndex(toIndex, columnIndex, oldOrders);
      }

      me.reSetColumnsIdIndexMap();
      me.scroller.generateNewRange(false);
      me.reCalcColumnsPositions();
      me.updateCellPositions();

      reRenderColumns.length && me.addColumnCells(reRenderColumns);

      setTimeout(() => {
        me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
        delete me.animatingColumnsPosition;
      }, 300);
    }
  };

  Object.assign(Grid.prototype, GridMixinColumnDrag);
})();
