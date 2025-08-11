(() => {
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
        if (column.hidden) continue;

        if(column.filterCellEl && column.filter && !column.filterField){
          column.filterCellEl.remove();
          delete column.filterCellEl;
        } else if(column.filterCellEl){
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

      if (column.filter && !column.filterField) {
        const filter = column.filters || {};
        let sign = '',
          value = '';

        if (filter.sign) {
          sign = filter.sign;
          value = filter.value;
        }

        column.filterField = new Fancy.FilterField({
          renderTo: cell,
          theme: me.theme,
          lang: me.lang,
          disabled: column.type === 'boolean',
          onChange: me.onFilterFieldChange.bind(this),
          onChangeValues: me.onFilterFieldValuesChange.bind(this),
          column,
          sign,
          value,
          items: column.filter.items,
          onFocus: me.onFilterFieldFocus.bind(this),
          grid: me
        });
      }

      column.filterCellEl = cell;

      return cell;
    },
    onFilterFieldFocus(){
      this.isEditing && this.hideActiveEditor();
    },
    onFilterFieldValuesChange(value, sign, column){
      const me = this;

      column.filters = {
        sign,
        value
      };

      if (value.length === 0) {
        me.clearFilter(column, sign);
      } else {
        me.filter(column, value, sign);
      }
    },
    onFilterFieldChange(value, sign, column, signWasChanged) {
      const me = this;

      signWasChanged && me.store.removeFilter(column, undefined, false);

      if(sign === '=' && value === ''){
        delete column.filters;
      }
      else {
        column.filters = {
          sign,
          value
        };
      }

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
    clearFilter(column, sign) {
      const me = this;
      const store = me.store;

      me.columns.forEach($column => {
        if(!column){
          delete $column.filters;
          $column.filterField?.clearValue();
          return;
        }

        if ($column.id === column.id) {
          if (sign && column.filters) {
            delete column.filters[sign];
          } else {
            delete column.filters;
          }
        }
      });

      if(store.rowGroups.length){
        me.beforeGrouping();
        store.clearFilterForGrouping(column, sign);
        me.afterGrouping();
        me.updateRowGroupAmount();
        me.updateHeaderCells();
        store.aggregations?.length && me.updateRowGroupAggregations();
        return;
      }

      store.clearFilter(column, sign);

      me.updateAfterFilter();
    },
    filter(column, value, sign = '=') {
      const me = this;
      const store = me.store;

      me.hideActiveEditor();

      switch (value){
        case '=':
        case '<':
        case '>':
        case '!=':
        case '==':
        case '!==':
        case '_a':
        case 'a_':
        case 'regex':
        case 'empty':
        case '!empty':
        case '+':
        case '-':
          if(String(sign).length >=2 ){
            console.warn('FG-Grid: It looks like in method filter, value and sign have wrong argument positions');
          }
      }

      if(store.rowGroups.length){
        me.beforeGrouping();
        me.filterForRowGrouping(column, value, sign);
        me.afterGrouping();
        me.updateRowGroupAmount();
        me.updateHeaderCells();
        me.filterBar && me.updateFilterBarCells();
        store.aggregations?.length && me.updateRowGroupAggregations();
        return;
      }

      store.filter(column, value, sign, me.filterBar === true);
      me.updateFiltersInColumns(column, value, sign);
      me.updateAfterFilter();
      me.filterBar && me.updateFilterBarCells();
    },
    filterForRowGrouping(column, value, sign = '='){
      const me = this;

      me.store.filterForRowGrouping(column, value, sign, me.filterBar === true);
      me.updateFiltersInColumns(column, value, sign);
    },
    updateFiltersInColumns(filterColumn, value, sign){
      this.columns.forEach(column => {
        if (column.id === filterColumn.id) {
          column.filters = {
            sign,
            value
          };
        }
      });
    },
    updateAfterFilter() {
      const me = this;
      const scroller = me.scroller;

      scroller.calcMaxScrollTop();
      scroller.updateScrollTop();
      scroller.calcViewRange();
      scroller.setVerticalSize();
      scroller.updateHorizontalScrollSize();
      me.updateVisibleHeight();

      me.renderVisibleRowsAfterFilter();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();
    },
    renderVisibleRowsAfterFilter() {
      const me = this;
      const scroller = me.scroller;
      const startRow = scroller.getStartRow();
      const endRow = scroller.getEndRow();

      me.actualRowsIdSet = new Set();

      let i = startRow;

      for (; i < endRow; i++) {
        const item = me.store.getItemByRowIndex(i);

        if (!item) {
          console.warn(`FG-Grid: Item with index equals to ${i} does not exist`);
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
            itemsToRemove.forEach(item => me.removeDomRowById(item.id));

            me.filtering = false;
          }, 500);
        });
      });
    },
    updateFilterBarCells() {
      const me = this;

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if (column.hidden) continue;

        if (Object.entries(column.filters || {}).length) {
          const filterField = column.filterField;
          const filter = column.filters;

          if(filterField && filterField.sign !== filter.sign){
            if(Array.isArray(filter.value)){
              filterField.updateUI('List');
              const keysAsString = filter.value.join(',');

              if(filter.value.length === 0) {
                filterField.input.value = '';
              } else {
                filterField.input.value = `(${filter.value.length}) ${keysAsString}`;
              }
              continue;
            }

            if (!(filter.sign === '=' && filterField.sign === '')) filterField.setSign(filter.sign);
            filterField.setValue(filter.value, false);
          }
        }
      }
    }
  };

  Object.assign(Grid.prototype, GridMixinFilter);
})();
