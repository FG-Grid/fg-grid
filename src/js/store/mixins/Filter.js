(()=> {

  const StoreFilter = {
    clearFilter(index, sign) {
      const me = this;

      me.filters = me.filters.filter(filter => filter.index !== index);
      me.prevFilterIndex = '';

      me.reFilter(false);
      me.reSort();
    },

    clearFilterForGrouping(index, sign) {
      const me = this;
      const data = me.data.slice();

      me.filters = me.filters.filter(filter => filter.index !== index);
      me.prevFilterIndex = '';

      me.filteredData = me.filters.reduce((filteredData, filter) => {
        return me.filterData(filteredData, filter.index, filter.value, filter.sign);
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
        return me.filterData(filteredData, filter.index, filter.value, filter.sign);
      }, data);
      me.displayedData = me.filteredData;

      me.updateIndexMapAfterFilter();

      if (me.filters.length === 0) {
        delete me.filteredData;
      }

      me.prevAction = 'filter';
    },

    filter(index, value, sign = '=') {
      const me = this;
      let data;
      let totalReFilterRequired = false;

      if (me.prevAction === 'sort' && me.sortedData) {
        data = me.sortedData.slice();
      } else if (me.prevAction === 'filter' && me.prevFilterIndex !== index && me.filteredData) {
        data = me.filteredData.slice();
      } else if (me.prevAction === 'filter' && me.prevFilterIndex === index) {
        totalReFilterRequired = true;
      } else {
        data = me.data.slice();
      }

      me.filters = me.filters.filter(filter => filter.index !== index);

      if (value !== null) {
        me.filters.push({
          index,
          value,
          sign
        });
      }

      if (totalReFilterRequired) {
        me.reFilter();
        me.reSort();
        return;
      }

      me.filteredData = me.filterData(data, index, value, sign);
      me.displayedData = me.filteredData;

      me.updateIndexMapAfterFilter();

      me.prevAction = 'filter';
      me.prevFilterIndex = index;
    },

    filterForRowGrouping(index, value, sign = '=') {
      const me = this;
      const data = me.data.slice();

      me.filters = me.filters.filter(filter => filter.index !== index);

      if (value !== null) {
        me.filters.push({
          index,
          value,
          sign
        });
      }

      me.filteredData = me.filters.reduce((filteredData, filter) => {
        return me.filterData(filteredData, filter.index, filter.value, filter.sign);
      }, data);

      me.rowGroupDataForFiltering();
      me.sortGroupsForFiltering();
      me.generateDisplayedGroupedDataForFiltering();
      me.updateIndexes();

      me.prevAction = 'filter';
      me.prevFilterIndex = index;
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

    filterData(data, index, value, sign) {
      let filteredData = [];

      value = String(value).toLocaleLowerCase();

      switch (sign) {
        // Contains
        case '=':
          filteredData = data.filter(item => {
            const itemValue = String(item[index]).toLocaleLowerCase();

            return itemValue.includes(value);
          });
          break;
        // Not Contains
        case '!=':
          filteredData = data.filter(item => {
            const itemValue = String(item[index]).toLocaleLowerCase();

            return !itemValue.includes(value);
          });
          break;
        // Equals
        case '==':
          filteredData = data.filter(item => {
            const itemValue = String(item[index]).toLocaleLowerCase();

            return itemValue === value;
          });
          break;
        // Not Equals
        case '!==':
          filteredData = data.filter(item => {
            const itemValue = String(item[index]).toLocaleLowerCase();

            return itemValue !== value;
          });
          break;
        // Greater Than
        case '>':
          filteredData = data.filter(item => {
            const itemValue = item[index];

            return itemValue > value;
          });
          break;
        // Less Than
        case '<':
          filteredData = data.filter(item => {
            const itemValue = item[index];

            return itemValue < value;
          });
          break;
        // Starts with
        case '_a':
          filteredData = data.filter(item => {
            const itemValue = String(item[index]).toLocaleLowerCase();

            return itemValue.startsWith(value);
          });
          break;
        // Ends with
        case 'a_':
          filteredData = data.filter(item => {
            const itemValue = String(item[index]).toLocaleLowerCase();

            return itemValue.endsWith(value);
          });
          break;
        // Regex
        case 'regex':
          filteredData = data.filter(item => {
            const itemValue = String(item[index]).toLocaleLowerCase();

            return new RegExp(value).test(itemValue);
          });
          break;
        // Empty
        case 'empty':
          filteredData = data.filter(item => {
            const itemValue = item[index];

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
            const itemValue = item[index];

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
            const itemValue = item[index];

            return itemValue >= 0;
          });
          break;
        // Negative
        case '-':
          filteredData = data.filter(item => {
            const itemValue = item[index];

            return itemValue < 0;
          });
          break;
      }

      return filteredData;
    }
  }

  Object.assign(Fancy.Store.prototype, StoreFilter);

})();
