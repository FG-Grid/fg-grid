(()=> {
  const {
    FILTER_BAR,
    FILTER_BAR_CELL,
    FILTER_BAR_INNER,
    FILTER_BAR_INNER_CONTAINER
  } = Fancy.cls;

  const div = Fancy.div;

  /**
   * @mixin GridMixinFilter
   */

  const GridMixinFilter = {
    renderVisibleFilterBarCells() {
      const me = this;

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if(column.hidden){
          continue;
        }

        const cell = me.createFilterBarCell(i);

        me.filterBarInnerContainerEl.appendChild(cell);
      }
    },

    renderFilterBar() {
      const me = this;

      const filterBarEl = div(FILTER_BAR,{
        height: (this.headerRowHeight + 1) + 'px'
      });

      const filterBarInnerEl = div(FILTER_BAR_INNER, {
        width: (me.getTotalColumnsWidth() + me.scroller.scrollBarWidth) + 'px'
      });

      const filterBarInnerContainerEl = div(FILTER_BAR_INNER_CONTAINER, {
        height: me.headerRowHeight + 'px',
        width: me.getTotalColumnsWidth() + 'px'
      });

      filterBarInnerEl.appendChild(filterBarInnerContainerEl);
      filterBarEl.appendChild(filterBarInnerEl);
      me.gridEl.appendChild(filterBarEl);

      me.filterBarInnerContainerEl = filterBarInnerContainerEl;
      me.filterBarInnerEl = filterBarInnerEl;
      me.filterBarEl = filterBarEl;
    },

    createFilterBarCell(columnIndex) {
      const me = this;
      const column = me.columns[columnIndex];
      const cell = div(FILTER_BAR_CELL, {
        width: column.width + 'px',
        left: column.left + 'px'
      });

      cell.setAttribute('col-index', columnIndex);
      cell.setAttribute('col-id', column.id);

      if (column.filter) {
        const filters = Object.entries(column.filters || {});
        let sign = '',
          value = '';

        if (filters.length) {
          sign = filters[0][0];
          value = filters[0][1].value;
        }

        const field = new Fancy.FilterField({
          renderTo: cell,
          onChange: me.onFilterFieldChange.bind(this),
          column,
          sign: sign,
          value: value
        });

        column.filterField = field;
      }

      column.filterCellEl = cell;

      return cell;
    },

    onFilterFieldChange(value, sign, column) {
      const me = this;

      column.filters = {};

      if (value === '') {
        me.clearFilter(column, sign);
      } else {
        me.filter(column, value, sign);
      }
    },

    appendFilterBarCell(columnIndex) {
      const me = this;
      const rowEl = me.filterBarInnerContainerEl;
      const cell = me.createFilterBarCell(columnIndex);

      rowEl.appendChild(cell);
    },

    clearFilter(index, sign) {
      const me = this;
      const store = me.store;

      if(store.rowGroups.length){
        me.beforeGrouping();
        store.clearFilterForGrouping(index, sign);
        me.afterGrouping();
        me.updateRowGroupAmount();
        me.updateHeaderCells();
        return;
      }

      store.clearFilter(index, sign);

      me.columns.forEach(column => {
        if (column.index === index) {
          if (sign && column.filters) {
            delete column.filters[sign];
          } else {
            delete column.filters;
          }
        }
      })

      me.updateAfterFilter();
    },

    filter(column, value, sign = '=') {
      const me = this;
      const store = me.store;

      if(store.rowGroups.length){
        me.beforeGrouping();
        me.filterForRowGrouping(column, value, sign);
        me.afterGrouping();
        me.updateRowGroupAmount();
        me.updateHeaderCells();
        return;
      }

      store.filter(column, value, sign);
      me.updateFiltersInColumns(column, value, sign);
      me.updateAfterFilter();
    },

    filterForRowGrouping(column, value, sign = '='){
      const me = this;

      me.store.filterForRowGrouping(column, value, sign);
      me.updateFiltersInColumns(column, value, sign);
    },

    updateFiltersInColumns(index, value, sign){
      this.columns.forEach(column => {
        if (column.index === index) {
          column.filters = column.filters || {};
          column.filters[sign] = column.filters[sign] || {};
          column.filters[sign].value = value;
        }
      });
    },

    updateAfterFilter() {
      const me = this;

      me.scroller.calcMaxScrollTop();
      me.scroller.updateScrollTop();
      me.scroller.calcViewRange();
      me.scroller.setVerticalSize();
      me.scroller.updateHorizontalScrollSize();
      me.updateVisibleHeight();

      me.renderVisibleRowsAfterFilter();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();
    },

    renderVisibleRowsAfterFilter() {
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
          !me.renderedRowsIdMap.has(item.id) && me.renderRowOnPrevPosition(item, true);
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
              me.fakeHideRow(item);
            } else {
              me.fakeRowPosition(item);
            }
          });

          clearTimeout(me.timeOutRemoveRows);

          me.timeOutRemoveRows = setTimeout(() => {
            itemsToRemove.forEach(item => {
              me.removeDomRowById(item.id);
            });

            me.filtering = false;
          }, 500);
        });
      });
    }
  }

  Object.assign(Grid.prototype, GridMixinFilter);

})();
