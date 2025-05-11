(()=> {
  const {
    ROW_GROUP,
    ROW_GROUP_CELL_AMOUNT
  } = Fancy.cls;

  const GridMixinRowGroup = {
    toggleExpand(group) {
      const me = this;

      if (me.grouping) {
        return;
      }

      me.store.toggleExpand(group);

      me.updateAfterGrouping();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    expand(group) {
      const me = this;

      if (me.grouping) {
        return;
      }

      me.grouping = true;

      if(me.store.filters.length){
        me.store.expandForFiltering(group);
      }
      else {
        me.store.expand(group);
      }

      me.updateRowGroupCellExpandedCls(group);
      me.updateAfterGrouping();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    expandAll() {
      const me = this;

      if (me.grouping) {
        return;
      }

      me.grouping = true;

      me.store.expandAll();

      me.updateAllRowGroupCellsExtendedCls();
      me.updateAfterGrouping();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    collapse(group) {
      const me = this;

      if (me.grouping) {
        return;
      }

      me.grouping = true;

      if(me.store.filters.length){
        me.store.collapseForFiltering(group);
      }
      else {
        me.store.collapse(group);
      }

      me.updateRowGroupCellExpandedCls(group);
      me.updateAfterGrouping();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    collapseAll() {
      const me = this;

      if (me.grouping) {
        return;
      }

      me.grouping = true;

      me.store.collapseAll();

      me.updateAllRowGroupCellsExtendedCls();
      me.updateAfterGrouping();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    updateAfterGrouping() {
      const me = this;

      me.scroller.calcMaxScrollTop();
      me.scroller.updateScrollTop();
      me.scroller.calcViewRange();
      me.scroller.setVerticalSize();
      me.scroller.updateHorizontalScrollSize();
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
          console.warn(`Item with index equals to ${i} does not exist`);
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

            if (!me.actualRowsIdSet.has(item.id)) {
              itemsToRemove.push(item);
            }

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
            itemsToRemove.forEach(item => {
              me.removeRowById(item.id);
            });

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
      const rowAmounts = me.bodyEl.querySelectorAll(`.${ROW_GROUP_CELL_AMOUNT}`);

      rowAmounts.forEach(amountEl => {
        const row = amountEl.closest(`.${ROW_GROUP}`);
        const $rowGroupValue = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');
        const groupDetail = store.groupDetailsForFiltering[$rowGroupValue];

        if(store.filters.length && !groupDetail){
          return;
        }

        let amount = store.filters.length? groupDetail.amount:store.groupDetails[$rowGroupValue].amount;
        amount = ` (${amount})`;
        const domAmount = Number(amountEl.innerHTML);

        if(domAmount !== amount){
          amountEl.innerHTML = amount;
        }
      })
    },

    reConfigRowGroups(){
      const me = this;
      const store = me.store;
      const rowGroups = [];

      me.grouping = true;

      me.terminateVisibleRows();

      me.rowGroupBarItemColumns.forEach(column => {
        rowGroups.push(column.index);
      });

      store.reConfigRowGroups(rowGroups);

      me.scroller.calcMaxScrollTop();
      me.scroller.updateScrollTop();
      me.scroller.calcViewRange();
      me.scroller.setVerticalSize();
      me.scroller.updateHorizontalScrollSize();
      me.updateVisibleHeight();

      me.scroller.calcVisibleRows();

      me.renderVisibleRows();
      me.store.memorizePrevRowIndexesMap();

      me.grouping = false;
    }
  }

  Object.assign(Grid.prototype, GridMixinRowGroup);

})();
