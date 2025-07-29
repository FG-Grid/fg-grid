(() => {
  /**
   * @mixin GridMixinSort
   */
  const GridMixinSort = {
    sort(sortingColumn, dir = 'ASC', multi) {
      const me = this;

      if (me.sorting) return;

      me.isEditing && me.hideActiveEditor();

      me.sorting = true;

      let sorterOrdersMap = {};

      me.store.sort(sortingColumn, dir, multi);

      if (multi) {
        me.store.sorters.forEach((sorter, index) => {
          sorterOrdersMap[sorter.column.id] = index + 1;
        });
      }

      me.columns.forEach(column => {
        if (column.id === sortingColumn.id){
          column.sort = dir;

          if (multi && me.store.sorters.length !== 1) {
            column.sortOrder = sorterOrdersMap[column.id];
          } else {
            delete column.sortOrder;
          }
        } else {
          if (!multi) delete column.sort;

          if (sorterOrdersMap[column.id]) {
            column.sortOrder = sorterOrdersMap[column.id];
          } else {
            delete column.sortOrder;
          }
        }
      });

      me.renderVisibleRowsAfterSort();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();

      me.activeCell && me.clearActiveCell();
    },

    multiSort(column, dir) {
      this.sort(column, dir, true);
    },

    clearSort($column, multi) {
      const me = this;

      let i = 0;

      for (; i < me.columns.length; i++) {
        const column = me.columns[i];

        if (!$column || !multi) {
          delete column.sort;
          delete column.sortOrder;
        } else if (column.id === $column.id) {
          delete column.sort;
          delete column.sortOrder;
        }
      }

      me.store.clearSort($column, multi);

      if (multi) {
        let sorterOrdersMap = {};

        me.store.sorters.forEach((sorter, index) => {
          sorterOrdersMap[sorter.column.id] = index + 1;
        });

        me.columns.forEach(column => {
          if (sorterOrdersMap[column.id]) {
            column.sortOrder = sorterOrdersMap[column.id];
          }
        });
      }

      me.renderVisibleRowsAfterSort();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();

      me.activeCell && me.clearActiveCell();
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
          console.warn(`FG-Grid: Item with index equals to ${i} does not exist`);
        } else {
          if (!me.renderedRowsIdMap.has(item.id)) me.renderRowOnPrevPosition(item, true);

          me.actualRowsIdSet.add(item.id);
        }
      }

      const itemsToRemove = [];

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          me.renderedRowsIdMap.forEach((rowEl, id) => {
            const item = me.store.idItemMap.get(id);

            !me.actualRowsIdSet.has(item.id) && itemsToRemove.push(item);

            //me.updateRowPosition(item);
            me.fakeRowPosition(item);
          });

          clearTimeout(me.timeOutRemoveRows);

          me.timeOutRemoveRows = setTimeout(() => {
            itemsToRemove.forEach(item => me.removeDomRowById(item.id));

            me.sorting = false;
          }, 500);
        });
      });
    }
  };

  Object.assign(Grid.prototype, GridMixinSort);
})();
