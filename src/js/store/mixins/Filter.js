(() => {
  /**
   * @mixin StoreMixinFilter
   */
  const StoreMixinFilter = {
    removeFilter(column, sign, removePrevFilterColumn = true){
      const me = this;

      if (sign) {
        me.filters = me.filters.filter(filter => {
          if (filter.column.id === column.id && filter.sign === sign) return false;
          return true;
        });
      } else if(column) {
        me.filters = me.filters.filter(filter => filter.column.id!== column.id);
      } else {
        me.filters = [];
      }

      if(removePrevFilterColumn !== false){
        delete me.prevFilterColumn;
      }
    },
    clearFilter(column, sign) {
      const me = this;

      me.removeFilter(column, sign);

      me.reFilter(false);
      me.reSort();

      if(!column || me.filters.length === 0){
        delete me.prevAction;
        delete me.prevFilterColumn;
      }
    },
    clearFilterForGrouping(column, sign) {
      const me = this;
      const data = me.data.slice();

      me.removeFilter(column, sign);

      me.filteredData = me.filters.reduce((filteredData, filter) => {
        return me.filterData(filteredData, filter.column, filter.value, filter.sign);
      }, data);

      me.rowGroupDataForFiltering();
      me.sortGroupsForFiltering();
      me.generateDisplayedGroupedDataForFiltering();
      me.updateIndexes();

      if (me.filters.length === 0) {
        delete me.filteredData;
      }

      me.prevAction = 'filter';
    },
    reFilter(useSortedDataIfPossible = true) {
      const me = this;
      let data;

      if (useSortedDataIfPossible && me.prevAction === 'sort' && me.sortedData) {
        data = me.sortedData.slice();
      } else {
        data = me.data.slice();
      }

      me.filteredData = me.filters.reduce((filteredData, filter) => {
        return me.filterData(filteredData, filter.column, filter.value, filter.sign);
      }, data);
      me.displayedData = me.filteredData;

      me.updateIndexMapAfterFilter();

      if (me.filters.length === 0) {
        delete me.filteredData;
      }

      me.prevAction = 'filter';
    },
    filter(column, value, sign = '=', oneFilterPerColumn = false) {
      const me = this;
      let data;
      let totalReFilterRequired = false;

      if (me.prevAction === 'sort' && me.sortedData) {
        data = me.sortedData.slice();
      } else if (me.prevAction === 'filter' && me.prevFilterColumn?.id !== column.id && me.filteredData) {
        data = me.filteredData.slice();
      } else if (me.prevAction === 'filter' && me.prevFilterColumn?.id === column.id) {
        totalReFilterRequired = true;
      } else {
        data = me.data.slice();
      }

      me.removeFilter(column, sign);

      if(oneFilterPerColumn){
        me.filters = me.filters.filter(filter => filter.column.id!== column.id);
      }

      if (value !== null) {
        me.filters.push({
          column,
          value,
          sign
        });
      }

      if (totalReFilterRequired) {
        me.reFilter();
        me.reSort();
        me.prevAction = 'filter';
        me.prevFilterColumn = column;
        return;
      }

      me.filteredData = me.filterData(data, column, value, sign);
      me.displayedData = me.filteredData;

      me.updateIndexMapAfterFilter();

      me.prevAction = 'filter';
      me.prevFilterColumn = column;
    },
    filterForRowGrouping(column, value, sign = '=', oneFilterPerColumn = false) {
      const me = this;
      const data = me.data.slice();

      me.removeFilter(column, sign);

      if(oneFilterPerColumn){
        me.filters = me.filters.filter(filter => filter.column.id!== column.id);
      }

      if (value !== null) {
        me.filters.push({
          column,
          value,
          sign
        });
      }

      me.filteredData = me.filters.reduce((filteredData, filter) => {
        return me.filterData(filteredData, filter.column, filter.value, filter.sign);
      }, data);

      me.rowGroupDataForFiltering();
      me.sortGroupsForFiltering();
      me.generateDisplayedGroupedDataForFiltering();
      me.updateIndexes();

      me.prevAction = 'filter';
      me.prevFilterColumn = column;
    },
    updateIndexMapAfterFilter() {
      const me = this;

      me.memorizePrevRowIndexesMap();
      me.idRowIndexesMap = new Map();

      me.filteredData.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        item.rowIndex = index;
      });
    },
    filterData(data, column, value, sign) {
      let filteredData = [];

      value = String(value).toLocaleLowerCase();

      const getItemValue = (item) => {
        let itemValue;
        if(column.getter){
          itemValue = column.getter({
            item,
            column
          });
        }
        else {
          itemValue = item[column.index];
        }

        return itemValue;
      };

      switch (sign) {
        // Contains
        case '=':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return itemValue.includes(value);
          });
          break;
        // Not Contains
        case '!=':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return !itemValue.includes(value);
          });
          break;
        // Equals
        case '==':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return itemValue === value;
          });
          break;
        // Not Equals
        case '!==':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return itemValue !== value;
          });
          break;
        // Greater Than
        case '>':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            return itemValue > value;
          });
          break;
        // Less Than
        case '<':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            return itemValue < value;
          });
          break;
        // Starts with
        case 'a_':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return itemValue.startsWith(value);
          });
          break;
        // Ends with
        case '_a':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return itemValue.endsWith(value);
          });
          break;
        // Regex
        case 'regex':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return new RegExp(value).test(itemValue);
          });
          break;
        // Empty
        case 'empty':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            switch (itemValue) {
              case undefined:
              case null:
              case '':
                return true;
            }

            return false;
          });
          break;
        // Not Empty
        case '!empty':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            switch (itemValue) {
              case undefined:
              case null:
              case '':
                return false;
            }

            return true;
          });
          break;
        // Positive
        case '+':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            return itemValue >= 0;
          });
          break;
        // Negative
        case '-':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            return itemValue < 0;
          });
          break;
      }

      return filteredData;
    }
  };

  Object.assign(Fancy.Store.prototype, StoreMixinFilter);
})();
