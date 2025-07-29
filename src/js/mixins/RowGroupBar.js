(() => {
  const {
    COLUMN_DRAGGING,
    ROW_GROUPING,
    ROW_GROUP_BAR,
    ROW_GROUP_BAR_EMPTY_TEXT,
    ROW_GROUP_BAR_ITEM_CONTAINER,
    ROW_GROUP_BAR_ITEM,
    ROW_GROUP_BAR_ITEM_TEXT,
    ROW_GROUP_BAR_ITEM_ACTIVE,
    SVG_ITEM,
    SVG_GROUP,
    SVG_DRAG,
    SVG_CHEVRON_RIGHT,
    SVG_REMOVE
  } = Fancy.cls;

  const { div, span } = Fancy;

  /**
   * @mixin GridMixinRowGroupBar
   */
  const GridMixinRowGroupBar = {
    renderRowGroupBar() {
      const me = this;

      const rowGroupBarEl = div(ROW_GROUP_BAR, {
        height: (this.headerRowHeight + 1) + 'px'
      });

      const svgGroup = Fancy.svg.group;
      const groupLogoEl = span([SVG_ITEM, SVG_GROUP]);
      groupLogoEl.innerHTML = svgGroup;

      rowGroupBarEl.appendChild(groupLogoEl);

      const emptyTextEl = span([ROW_GROUP_BAR_EMPTY_TEXT]);
      emptyTextEl.innerHTML = me.lang.groupBarDragEmpty;

      rowGroupBarEl.appendChild(emptyTextEl);

      me.gridEl.appendChild(rowGroupBarEl);

      me.rowGroupBarEmptyTextEl = emptyTextEl;
      me.rowGroupBarEl = rowGroupBarEl;

      me.renderRowGroupBarItems();
    },
    renderRowGroupBarItems(){
      const me = this;

      me.store.rowGroups.forEach(group => {
        me.addGroupInBar(me.getColumn(group), false);
      });
      delete me.activeRowGroupBarItemEl;
    },
    // Syntactic mouseenter because the cursor is over dragging cell
    onRowGroupBarMouseEnter(){
      this.addGroupInBar(this.columnDragging.column);
    },
    addGroupInBar(column, isItemActive = true){
      const me = this;
      const rowGroupBarItemEl = me.generateRowGroupBarItemEl(column);
      isItemActive && rowGroupBarItemEl.classList.add(ROW_GROUP_BAR_ITEM_ACTIVE);

      me.activeRowGroupBarItemEl = rowGroupBarItemEl;
      me.rowGroupBarItems = me.rowGroupBarItems || [];
      me.rowGroupBarItemColumns = me.rowGroupBarItemColumns || [];

      me.rowGroupBarEl.appendChild(rowGroupBarItemEl);
      me.rowGroupBarItems.push(rowGroupBarItemEl);
      me.rowGroupBarItemColumns.push(column);

      if(me.columnDragging && me.rowGroupType === 'column'){
        if(me.rowGroupBarItemColumns.length <= 1){
          me.$requiresReSetGroupColumn = true;
        }
      }

      me.gridEl.classList.add(ROW_GROUPING);

      me.rowGroupBarEmptyTextEl.style.setProperty('display', 'none');
    },
    generateRowGroupBarItemEl(column){
      const me = this;

      const containerEl = div(ROW_GROUP_BAR_ITEM_CONTAINER);
      containerEl.setAttribute('row-group-order-index', String(me.rowGroupBarItems?.length || 0));

      const groupItemEl = span(ROW_GROUP_BAR_ITEM);

      const dragSvgEl = span([SVG_ITEM, SVG_DRAG]);
      dragSvgEl.innerHTML = Fancy.svg.groupCellDrag;
      groupItemEl.appendChild(dragSvgEl);

      dragSvgEl.addEventListener('mousedown', me.onRowGroupBarItemDragElMouseDown.bind(me));

      const groupItemText = span(ROW_GROUP_BAR_ITEM_TEXT);
      groupItemText.innerHTML = column.title;
      groupItemEl.appendChild(groupItemText);

      const removeSvgEl = span([SVG_ITEM, SVG_REMOVE]);
      removeSvgEl.innerHTML = Fancy.svg.remove;
      removeSvgEl.addEventListener('click', me.onRowGroupBarItemRemoveClick.bind(me));
      groupItemEl.appendChild(removeSvgEl);

      if(me.rowGroupBarItems?.length){
        const svgChevronRight = Fancy.svg.chevronRight;
        const chevronEl = span([SVG_ITEM, SVG_CHEVRON_RIGHT]);

        chevronEl.innerHTML = svgChevronRight;

        me.rowGroupBarSeparator && containerEl.appendChild(chevronEl);
      }

      containerEl.appendChild(groupItemEl);

      return containerEl;
    },
    onRowGroupBarItemDragElMouseDown(event){
      const me = this;
      const groupItemEl = event.target.closest(`.${ROW_GROUP_BAR_ITEM_CONTAINER}`);
      const rowGroupOrderIndex = Number(groupItemEl.getAttribute('row-group-order-index'));
      const column = me.rowGroupBarItemColumns[rowGroupOrderIndex];

      groupItemEl.classList.add(ROW_GROUP_BAR_ITEM_ACTIVE);
      me.activeRowGroupBarItemEl = groupItemEl;
      me.isEditing && me.hideActiveEditor();

      me.columnDragging = {
        column,
        inBar: true,
        dragColumnCellEl: me.createDragColumnCellEl(column),
        rowGroupBarElRect: me.getRowGroupBarElRect(),
        dragItemFromRowGroupBar: true,
        rowGroupBarItemsRect: me.getRowGroupBarItemsRect(),
        originalRowGroupItemOrderIndex: rowGroupOrderIndex
      };

      me.gridEl.classList.add(COLUMN_DRAGGING);
      me.onColumnDragMouseMoveFn = me.onColumnDragMouseMove.bind(this);
      document.body.addEventListener('mousemove', me.onColumnDragMouseMoveFn);
      document.addEventListener('mouseup', () => {
        const columnDragging = me.columnDragging;
        const {
          dragItemFromRowGroupBar,
          changedRowGroupItemOrderIndex,
          originalRowGroupItemOrderIndex,
          inBar
        } = me.columnDragging;

        if(dragItemFromRowGroupBar && !inBar){
          me.showColumn(columnDragging.column, true);
          //me.onRowGroupBarMouseLeave(event);
          me.removeGroupInBar(columnDragging.column);
          setTimeout(() => {
            me.reConfigRowGroups();

            if (me.store.rowGroups.length === 0 && me.$rowGroupColumn) me.removeColumn(me.$rowGroupColumn);
          }, 1);
        } else {
          me.activeRowGroupBarItemEl.classList.remove(ROW_GROUP_BAR_ITEM_ACTIVE);

          if(changedRowGroupItemOrderIndex !== undefined && changedRowGroupItemOrderIndex !== originalRowGroupItemOrderIndex){
            setTimeout(() => me.reConfigRowGroups(), 1);
          }
        }

        me.gridEl.classList.remove(COLUMN_DRAGGING);
        columnDragging?.dragColumnCellEl.remove();
        delete me.columnDragMouseDownColumn;
        delete me.columnDragging;
        delete me.activeRowGroupBarItemEl;

        document.body.removeEventListener('mousemove', me.onColumnDragMouseMoveFn);
      }, {
        once: true
      });
    },
    // Syntactic mouse leave because cursor is over dragging cell
    onRowGroupBarMouseLeave(){
      this.removeGroupInBar(this.columnDragging.column);
    },
    removeGroupInBar(column){
      const me = this;

      if(column){
        const columnIndex = me.rowGroupBarItemColumns.findIndex((item) => item.id === column.id);
        const prevGroupItem = me.rowGroupBarItems.splice(columnIndex, 1)[0];

        me.rowGroupBarItemColumns.splice(columnIndex, 1);
        prevGroupItem.remove();
        me.reSetRowGroupOrderIndex();
      } else {
        const prevGroupItem = me.rowGroupBarItems.pop();

        me.rowGroupBarItemColumns.pop();
        prevGroupItem.remove();
      }

      delete me.activeRowGroupBarItemEl;

      if(!me.rowGroupBarItems || me.rowGroupBarItems?.length === 0){
        me.rowGroupBarEmptyTextEl.style.setProperty('display', '');

        me.gridEl.classList.remove(ROW_GROUPING);
      }
    },
    onRowGroupBarItemRemoveClick(event){
      const me = this;
      const groupItemEl = event.target.closest(`.${ROW_GROUP_BAR_ITEM_CONTAINER}`);
      const rowGroupOrderIndex = Number(groupItemEl.getAttribute('row-group-order-index'));
      const groupItemToRemove = me.rowGroupBarItems.splice(rowGroupOrderIndex, 1)[0];
      const column = me.rowGroupBarItemColumns.splice(rowGroupOrderIndex, 1)[0];

      me.isEditing && me.hideActiveEditor();

      groupItemToRemove.remove();
      me.showColumn(column, true);

      delete me.activeRowGroupBarItemEl;

      if(!me.rowGroupBarItems || me.rowGroupBarItems?.length === 0){
        me.rowGroupBarEmptyTextEl.style.setProperty('display', '');
        me.gridEl.classList.remove(ROW_GROUPING);
      }

      me.reSetRowGroupOrderIndex();
      me.reConfigRowGroups();

      if (me.store.rowGroups.length === 0 && me.$rowGroupColumn) me.removeColumn(me.$rowGroupColumn);
    },
    reSetRowGroupOrderIndex(){
      this.rowGroupBarItems.forEach((item, index) => {
        if(item.getAttribute('row-group-order-index') !== String(index)){
          item.setAttribute('row-group-order-index', index);
        }
      });
    },
    getRowGroupBarElRect() {
      const barRect = this.rowGroupBarEl.getBoundingClientRect();

      return {
        x: barRect.x,
        y: barRect.y,
        bottomX: barRect.x + barRect.width,
        rightY: barRect.y + barRect.height
      };
    },

    getRowGroupBarItemsRect(){
      const itemsRect = [];

      this.rowGroupBarItems?.forEach(item => {
        const rect = item.getBoundingClientRect();

        itemsRect.push({
          x: rect.x,
          y: rect.y,
          rightX: rect.x + rect.width,
          bottomY: rect.y + rect.height
        });
      });

      return itemsRect;
    },

    changeRowGroupBarItemOrder(from, to){
      const me = this;
      const fromEl = me.rowGroupBarItems[from];
      const toEl = me.rowGroupBarItems[to];
      const fromColumn = me.rowGroupBarItemColumns[from];
      const toColumn = me.rowGroupBarItemColumns[to];

      fromEl.querySelector(`.${ROW_GROUP_BAR_ITEM_TEXT}`).innerHTML = toColumn.title;
      toEl.querySelector(`.${ROW_GROUP_BAR_ITEM_TEXT}`).innerHTML = fromColumn.title;

      fromEl.classList.remove(ROW_GROUP_BAR_ITEM_ACTIVE);
      toEl.classList.add(ROW_GROUP_BAR_ITEM_ACTIVE);

      me.activeRowGroupBarItemEl = toEl;

      me.columnDragging.rowGroupBarItemsRect = me.getRowGroupBarItemsRect();
      me.columnDragging.changedRowGroupItemOrderIndex = to;

      me.rowGroupBarItemColumns[from] = toColumn;
      me.rowGroupBarItemColumns[to] = fromColumn;
    }
  };

  Object.assign(Grid.prototype, GridMixinRowGroupBar);
})();
