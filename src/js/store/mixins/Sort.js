(()=> {

  const StoreSort = {
    reSort() {
      const me = this;
      let data;

      if (me.filteredData) {
        data = me.filteredData.slice();
      } else {
        data = me.data.slice();
      }

      me.sorters.forEach(sorter => {
        data = me.sortData(data, sorter.index, sorter.dir, sorter.type);
      });

      me.sortedData = data;

      me.idRowIndexesMap = new Map();

      me.sortedData.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        item.rowIndex = index;
      });

      me.displayedData = me.sortedData;
    },

    sort(index, dir = 'ASC', type, multi) {
      const me = this;
      let data;

      if (me.prevAction === 'sort' && me.sortedData) {
        data = me.sortedData.slice();
      } else if (me.filteredData) {
        data = me.filteredData.slice();
      } else {
        data = me.data.slice();
      }

      if (!me.prevIdRowIndexesMap) {
        me.prevIdRowIndexesMap = me.idRowIndexesMap;
      }

      if (!multi) {
        me.sorters = [];
      } else {
        me.sorters = me.sorters.filter(sorter => sorter.index !== index);
      }

      me.sorters.push({
        index,
        dir,
        type: type
      });

      switch (dir) {
        case 'ASC':
        case 'DESC':
          if (me.rowGroups.length) {
            me.sortedData = me.filters.length ? me.sortGroupDataForFiltering(index, dir, type) : me.sortGroupData(index, dir, type);
          } else {
            me.sortedData = me.sortData(data, index, dir, type);
          }
          break;
      }

      me.idRowIndexesMap = new Map();

      me.sortedData.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        item.rowIndex = index;
      });

      me.displayedData = me.sortedData;
      me.prevAction = 'sort';
    },

    sortGroupData(index, dir, type) {
      const me = this;
      const sortedData = me.displayedData.slice();

      for (const group in me.expandedGroupsWithDataChildren) {
        if (me.isParentCollapsed(group)) {
          continue;
        }

        const groupData = me.groupsChildren[group].slice();
        const groupDetails = me.groupDetails[group];
        const rowIndex = me.idRowIndexesMap.get(groupDetails.id);
        let sortedGroupData = groupData;

        if (me.sorters.length) {
          me.sorters.forEach(sorter => {
            sortedGroupData = me.sortData(sortedGroupData, sorter.index, sorter.dir, sorter.type);
          });
        } else {
          sortedGroupData = me.sortData(groupData, index, dir, type);
        }

        sortedData.splice(rowIndex + 1, sortedGroupData.length, ...sortedGroupData);
      }

      return sortedData;
    },

    sortGroupDataForFiltering(index, dir, type) {
      const me = this;
      const sortedData = me.displayedData.slice();

      for (const group in me.expandedGroupsWithDataChildrenForFiltering) {
        if (me.isParentCollapsed(group)) {
          continue;
        }

        const groupData = me.groupsChildrenForFiltering[group].slice();
        const groupDetails = me.groupDetailsForFiltering[group];
        const rowIndex = me.idRowIndexesMap.get(groupDetails.id);
        let sortedGroupData = groupData;

        if (me.sorters.length) {
          me.sorters.forEach(sorter => {
            sortedGroupData = me.sortData(sortedGroupData, sorter.index, sorter.dir, sorter.type);
          });
        } else {
          sortedGroupData = me.sortData(groupData, index, dir, type);
        }

        sortedData.splice(rowIndex + 1, sortedGroupData.length, ...sortedGroupData);
      }

      return sortedData;
    },

    sortPieceOfData(data) {
      const me = this;

      me.sorters.forEach(sorter => {
        data = me.sortData(data, sorter.index, sorter.dir, sorter.type);
      });

      return data;
    },

    sortData(data, index, dir, type) {
      let sortedData = [];

      switch (dir) {
        case 'ASC':
          switch (type) {
            case 'number':
              sortedData = data.sort((a, b) => {
                a = a[index];
                b = b[index];

                if (a === null) {
                  a = Number.MIN_SAFE_INTEGER;
                }

                if (b === null) {
                  b = Number.MIN_SAFE_INTEGER;
                }

                return a - b;
              });
              break;
            case 'string':
              sortedData = data.sort((a, b) => {
                a = a[index] || '';
                b = b[index] || '';

                if (!a.localeCompare) {
                  console.error(`${a} is not a string`);
                }

                return a.localeCompare(b);
              });
              break;
            case 'boolean':
              sortedData = data.sort((a, b) => {
                a = a[index] || false;
                b = b[index] || false;

                return (a === b) ? 0 : a ? 1 : -1;
              });
              break;
          }
          break;
        case 'DESC':
          switch (type) {
            case 'number':
              sortedData = data.sort((a, b) => {
                a = a[index];
                b = b[index];

                if (a === null) {
                  a = Number.MIN_SAFE_INTEGER;
                }

                if (b === null) {
                  b = Number.MIN_SAFE_INTEGER;
                }

                return b - a;
              });
              break;
            case 'string':
              sortedData = data.sort((a, b) => {
                a = a[index] || '';
                b = b[index] || '';

                return b.localeCompare(a);
              });
              break;
            case 'boolean':
              sortedData = data.sort((a, b) => {
                a = a[index] || false;
                b = b[index] || false;

                return (a === b) ? 0 : a ? -1 : 1;
              });
              break;
          }
          break;
      }

      return sortedData;
    },

    clearSort(index, multi) {
      const me = this;

      me.sortedData = [];

      if (index && multi) {
        me.sorters = me.sorters.filter(sorter => sorter.index !== index);
      } else {
        me.sorters = [];
      }

      if (!me.rowGroups.length) {
        me.idRowIndexesMap = new Map();
      }

      if (me.sorters.length) {
        if (me.rowGroups.length) {
          me.sortedData = me.filters.length ? me.sortGroupDataForFiltering() : me.sortGroupData();

          me.idRowIndexesMap = new Map();

          me.sortedData.forEach((item, index) => {
            me.idRowIndexesMap.set(item.id, index);
            item.rowIndex = index;
          });

          me.displayedData = me.sortedData;
          me.prevAction = 'sort';
        } else {
          me.reSort();
        }
      } else if (me.filters.length) {
        if (me.rowGroups.length) {
          me.rowGroupDataForFiltering();
          me.sortGroupsForFiltering();
          // Problem
          // It requires some other reading sorted groups
          // Looks at how sorting goes
          me.generateDisplayedGroupedDataForFiltering(true);
          me.updateIndexes();

          me.prevAction = 'filter';
        } else {
          if(!me.filteredData){
            me.reFilter(false);
          }

          me.filteredData.forEach((item, index) => {
            me.idRowIndexesMap.set(item.id, index);
            item.rowIndex = index;
          });

          me.displayedData = me.filteredData;
        }
      } else {
        if (me.rowGroups.length) {
          for (const group in me.expandedGroupsWithDataChildren) {
            const groupData = me.groupsChildren[group];

            groupData.forEach(item => {
              me.idRowIndexesMap.set(item.id, item.originalRowIndex);
              item.rowIndex = item.originalRowIndex;
            });
          }

          me.sortGroups();
          me.simpleReGenerateDisplayedGroupedData();
        } else {
          me.data.forEach((item, index) => {
            me.idRowIndexesMap.set(item.id, index);
            item.rowIndex = index;
          });
        }
      }

      if (me.sorters.length === 0) {
        delete me.sortedData;
      }
    },

    isParentCollapsed(group) {
      const me = this;
      const splitted = group.split('/');
      let iL = splitted.length - 1;

      for (let i = 0; i < iL; i++) {
        splitted.pop();
        if (!me.expandedGroups[splitted.join('/')]) {
          return true;
        }
      }

      return false;
    }
  }

  Object.assign(Fancy.Store.prototype, StoreSort);

})();
