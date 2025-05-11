(()=> {

  const GridMixinSort = {
    sort(index, dir = 'ASC', type = 'string', multi) {
      const me = this;

      if (me.sorting) {
        return;
      }

      me.sorting = true;

      let sorterOrdersMap = {};

      me.store.sort(index, dir, type, multi);

      if (multi) {
        me.store.sorters.forEach((sorter, index) => {
          sorterOrdersMap[sorter.index] = index + 1;
        });
      }

      me.columns.forEach(column => {
        if (column.index === index) {
          column.sort = dir;

          if (column.type) {
            type = column.type;
          }

          if (multi && me.store.sorters.length !== 1) {
            column.sortOrder = sorterOrdersMap[column.index];
          } else {
            delete column.sortOrder;
          }
        } else {
          if (!multi) {
            delete column.sort;
          }

          if (sorterOrdersMap[column.index]) {
            column.sortOrder = sorterOrdersMap[column.index];
          } else {
            delete column.sortOrder;
          }
        }
      });

      me.renderVisibleRowsAfterSort();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    multiSort(index, dir, type) {
      const me = this;

      me.sort(index, dir, type, true);
    },

    clearSort(index, multi) {
      const me = this;

      let i = 0;

      for (; i < me.columns.length; i++) {
        const column = me.columns[i];

        if (!index || !multi) {
          delete column.sort;
          delete column.sortOrder;
        } else if (column.index === index) {
          delete column.sort;
          delete column.sortOrder;
        }
      }

      me.store.clearSort(index, multi);

      me.renderVisibleRowsAfterSort();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    renderVisibleRowsAfterSort() {
      const me = this;
      const startRow = me.scroller.getStartRow();
      const endRow = me.scroller.getEndRow();

      me.actualRowsIdSet = new Set();

      let i = startRow;

      for (; i < endRow; i++) {
        const item = me.store.getItemByRowIndex(i);

        if (!item) {
          console.warn(`Item with index equals to ${i} does not exist`);
        } else {
          if (!me.renderedRowsIdMap.has(item.id)) {
            me.renderRowOnPrevPosition(item, true);
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

            // me.updateRowPosition(item);
            me.fakeRowPosition(item);
          });

          clearTimeout(me.timeOutRemoveRows);

          me.timeOutRemoveRows = setTimeout(() => {
            itemsToRemove.forEach(item => {
              me.removeRowById(item.id);
            });

            me.sorting = false;
          }, 500);
        });
      });
    }
  }

  Object.assign(Grid.prototype, GridMixinSort);

})();
