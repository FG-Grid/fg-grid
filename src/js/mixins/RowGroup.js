(() => {
  const { ROW_GROUP, ROW_GROUP_CELL_AMOUNT } = Fancy.cls;

  /**
   * @mixin GridMixinRowGroup
   */
  const GridMixinRowGroup = {
    toggleExpand(group) {
      const me = this;

      me.beforeGrouping();

      if (me.grouping) return;

      me.store.toggleExpand(group);

      me.afterGrouping();
    },
    expand(group) {
      const me = this;
      const store = me.store;

      if (me.grouping) return;
      if (store.expandedGroups[group]) return false;

      me.beforeGrouping();

      me.grouping = true;

      if(store.filters.length){
        store.expandForFiltering(group);
      } else {
        store.expand(group);
      }

      me.updateRowGroupCellExpandedCls(group);
      me.afterGrouping();
    },
    expandAll() {
      const me = this;

      me.beforeGrouping();

      if (me.grouping) return;

      me.grouping = true;

      me.store.expandAll();

      me.updateAllRowGroupCellsExtendedCls();
      me.afterGrouping();
    },
    collapse(group) {
      const me = this;
      const store = me.store;

      if (me.grouping) return;

      if (!store.expandedGroups[group]) return false;

      me.beforeGrouping();

      me.grouping = true;

      if(store.filters.length){
        store.collapseForFiltering(group);
      } else {
        store.collapse(group);
      }

      me.updateRowGroupCellExpandedCls(group);
      me.afterGrouping();
    },
    collapseAll() {
      const me = this;

      me.beforeGrouping();

      if (me.grouping) return;

      me.grouping = true;

      me.store.collapseAll();

      me.updateAllRowGroupCellsExtendedCls();
      me.afterGrouping();
    },
    beforeGrouping(){
      const me = this;

      me.isEditing && me.hideActiveEditor();
      me.activeCell && me.clearActiveCell();
    },
    afterGrouping() {
      const me = this;
      const scroller = me.scroller;

      scroller.calcMaxScrollTop();
      scroller.updateScrollTop();
      scroller.calcViewRange();
      scroller.setVerticalSize();
      scroller.updateHorizontalScrollSize();
      me.updateVisibleHeight();

      me.renderVisibleRowsAfterGrouping();
      me.store.memorizePrevRowIndexesMap();
    },
    renderVisibleRowsAfterGrouping() {
      const me = this;
      const startRow = me.scroller.getStartRow();
      const endRow = me.scroller.getEndRow();
      const newExpendedRowEls = [];

      me.actualRowsIdSet = new Set();

      let i = startRow;

      for (; i < endRow; i++) {
        const item = me.store.getItemByRowIndex(i);

        if (!item) {
          console.warn(`FG-Grid: Item with index equals to ${i} does not exist`);
        } else {
          if (!me.renderedRowsIdMap.has(item.id)) {
            //me.renderRowOnPrevPosition(item, true);
            //me.renderRowOnPrevPosition(item);
            if (item.$isGroupRow) {
              newExpendedRowEls.push(me.renderRowGroup(i, item, {
                'z-index': 0,
                opacity: 0
              }));
            } else {
              newExpendedRowEls.push(me.renderRow(i, item, {
                'z-index': 0,
                opacity: 0
              }));
            }
          }

          me.actualRowsIdSet.add(item.id);
        }
      }

      const itemsToRemove = [];

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          me.renderedRowsIdMap.forEach((rowEl, id) => {
            const item = me.store.idItemMap.get(id);

            if (!me.actualRowsIdSet.has(item.id)) itemsToRemove.push(item);

            me.updateRowPosition(item);
            me.fakeRowPosition(item);
          });

          itemsToRemove.forEach(item => {
            const rowEl = me.renderedRowsIdMap.get(item.id);
            rowEl.style.zIndex = '0';
            rowEl.style.opacity = '0';
          });

          clearTimeout(me.timeOutRemoveRows);

          newExpendedRowEls.forEach(rowEl => {
            rowEl.style.opacity = 1;
          });

          me.timeOutRemoveRows = setTimeout(() => {
            itemsToRemove.forEach(item => me.removeDomRowById(item.id));

            newExpendedRowEls.forEach(rowEl => {
              rowEl.style['z-index'] = '';
              rowEl.style.opacity = '';
            });

            me.grouping = false;
          }, 500);
        });
      });
    },
    updateRowGroupAmount() {
      const me = this;
      const store = me.store;
      const filters = store.filters;
      const rowAmounts = me.bodyEl.querySelectorAll(`.${ROW_GROUP_CELL_AMOUNT}`);

      rowAmounts.forEach(amountEl => {
        const row = amountEl.closest(`.${ROW_GROUP}`);
        const $rowGroupValue = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');
        const groupDetail = filters.length? store.groupDetailsForFiltering[$rowGroupValue]:store.groupDetails[$rowGroupValue];

        //if(filters.length || !groupDetail){
        if(!groupDetail) return;

        let amount = ` (${groupDetail.amount})`;
        const domAmount = Number(amountEl.innerHTML);

        if(domAmount !== groupDetail.amount){
          amountEl.innerHTML = amount;
        }
      });
    },
    updateRowGroupAggregations(){
      const me = this;
      const store = me.store;
      const filters = store.filters;

      // Aggregations work only for rowGroupType equals to 'column'
      if(me.rowGroupType === 'row') return;

      store.aggregations.forEach(ag => {
        const rowGroups = me.bodyEl.querySelectorAll(`.${ROW_GROUP}`);
        rowGroups.forEach(row => {
          const $rowGroupValue = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');
          const groupDetail = filters.length? store.groupDetailsForFiltering[$rowGroupValue]:store.groupDetails[$rowGroupValue];

          // Group was removed because all children were removed
          if(!groupDetail) return;

          const item = me.getItemById(groupDetail.id);

          const oldCell = row.querySelector(`div[col-id="${ag.index}"]`);
          const columnIndex = Number(oldCell.getAttribute('col-index'));
          const rowIndex = row?.getAttribute('row-index');

          const newCell = me.createCellGroupTypeColumn(rowIndex, item, columnIndex);
          if(oldCell.innerHTML != newCell.innerHTML){
            oldCell.remove();
            row.appendChild(newCell);
          }
        });
      });
    },
    reConfigRowGroups(){
      const me = this;
      const store = me.store;
      const scroller = me.scroller;
      let rowGroups = [];

      me.grouping = true;

      me.terminateVisibleRows();

      if(me.rowGroupBarItemColumns?.length !== undefined){
        me.rowGroupBarItemColumns.forEach(column => {
          rowGroups.push(column.index);
        });
      } else {
        rowGroups = store.rowGroups;
      }

      store.reConfigRowGroups(rowGroups);

      scroller.calcMaxScrollTop();
      scroller.updateScrollTop();
      scroller.calcViewRange();
      scroller.setVerticalSize();
      scroller.updateHorizontalScrollSize();
      me.updateVisibleHeight();

      scroller.calcVisibleRows();

      me.renderVisibleRows();
      store.memorizePrevRowIndexesMap();

      me.grouping = false;
    }
  };

  Object.assign(Grid.prototype, GridMixinRowGroup);
})();
