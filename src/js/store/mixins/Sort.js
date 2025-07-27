(() => {
  /**
   * @mixin StoreMixinSort
   */
  const StoreMixinSort = {
    reSort() {
      const me = this;
      let data;

      if (me.filteredData) {
        data = me.filteredData.slice();
      } else {
        data = me.data.slice();
      }

      me.sorters.forEach(sorter => {
        data = me.sortData(data, sorter.column, sorter.dir);
      });

      me.sortedData = data;
      me.idRowIndexesMap = new Map();

      me.sortedData.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        item.rowIndex = index;
      });

      me.displayedData = me.sortedData;
    },
    sort(column, dir = 'ASC', multi) {
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
        me.sorters = me.sorters.filter(sorter => sorter.column.id !== column.id);
      }

      me.sorters.push({
        column,
        dir
      });

      switch (dir) {
        case 'ASC':
        case 'DESC':
          if (me.rowGroups.length) {
            me.sortedData = me.filters.length ? me.sortGroupDataForFiltering(column, dir) : me.sortGroupData(column, dir);
          } else {
            me.sortedData = me.sortData(data, column, dir);
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
    sortGroupData(column, dir) {
      const me = this;
      const sortedData = me.displayedData.slice();

      for (const group in me.expandedGroupsWithDataChildren) {
        if (me.isParentCollapsed(group)) continue;

        const groupData = me.groupsChildren[group].slice();
        const groupDetails = me.groupDetails[group];
        const rowIndex = me.idRowIndexesMap.get(groupDetails.id);
        let sortedGroupData = groupData;

        if (me.sorters.length) {
          me.sorters.forEach(sorter => {
            sortedGroupData = me.sortData(sortedGroupData, sorter.column, sorter.dir);
          });
        } else {
          sortedGroupData = me.sortData(groupData, column, dir);
        }

        sortedData.splice(rowIndex + 1, sortedGroupData.length, ...sortedGroupData);
      }

      return sortedData;
    },
    sortGroupDataForFiltering(column, dir) {
      const me = this;
      const sortedData = me.displayedData.slice();

      for (const group in me.expandedGroupsWithDataChildrenForFiltering) {
        if (me.isParentCollapsed(group)) continue;

        const groupData = me.groupsChildrenForFiltering[group].slice();
        const groupDetails = me.groupDetailsForFiltering[group];
        const rowIndex = me.idRowIndexesMap.get(groupDetails.id);
        let sortedGroupData = groupData;

        if (me.sorters.length) {
          me.sorters.forEach(sorter => {
            sortedGroupData = me.sortData(sortedGroupData, sorter.column, sorter.dir);
          });
        } else {
          sortedGroupData = me.sortData(groupData, column, dir);
        }

        sortedData.splice(rowIndex + 1, sortedGroupData.length, ...sortedGroupData);
      }

      return sortedData;
    },
    sortPieceOfData(data) {
      const me = this;

      me.sorters.forEach(sorter => {
        data = me.sortData(data, sorter.column, sorter.dir);
      });

      return data;
    },
    sortData(data, column, dir) {
      let sortedData = [];

      switch (dir) {
        case 'ASC':
          switch (column.type) {
            case 'number':
              sortedData = data.sort((a, b) => {
                if (column.getter) {
                  a = column.getter({
                    item: a
                  });

                  b = column.getter({
                    item: b
                  });
                }
                else {
                  a = a[column.index];
                  b = b[column.index];
                }

                if (a === null) (a = Number.MIN_SAFE_INTEGER);
                if (b === null) (b = Number.MIN_SAFE_INTEGER);

                return a - b;
              });
              break;
            case 'string':
              sortedData = data.sort((a, b) => {
                if (column.getter) {
                  a = column.getter({
                    item: a
                  }) || '';

                  b = column.getter({
                    item: b
                  }) || '';
                }
                else {
                  a = a[column.index] || '';
                  b = b[column.index] || '';
                }

                if (!a.localeCompare) console.error(`FG-Grid: ${a} is not a string`);

                return a.localeCompare(b);
              });
              break;
            case 'boolean':
              sortedData = data.sort((a, b) => {
                if (column.getter) {
                  a = column.getter({
                    item: a
                  }) || false;
                  b = column.getter({
                    item: b
                  }) || false;
                }
                else {
                  a = a[column.index] || false;
                  b = b[column.index] || false;
                }

                return (a === b) ? 0 : a ? 1 : -1;
              });
              break;
          }
          break;
        case 'DESC':
          switch (column.type) {
            case 'number':
              sortedData = data.sort((a, b) => {
                if(column.getter){
                  a = column.getter({
                    item: a
                  });

                  b = column.getter({
                    item: b
                  });
                }
                else {
                  a = a[column.index];
                  b = b[column.index];
                }

                if (a === null) (a = Number.MIN_SAFE_INTEGER);
                if (b === null) (b = Number.MIN_SAFE_INTEGER);

                return b - a;
              });
              break;
            case 'string':
              sortedData = data.sort((a, b) => {
                if(column.getter){
                  a = column.getter({
                    item: a
                  }) || '';

                  b = column.getter({
                    item: b
                  }) || '';
                }
                else {
                  a = a[column.index] || '';
                  b = b[column.index] || '';
                }

                return b.localeCompare(a);
              });
              break;
            case 'boolean':
              sortedData = data.sort((a, b) => {
                if (column.getter) {
                  a = column.getter({
                    item: a
                  }) || false;
                  b = column.getter({
                    item: b
                  }) || false;
                }
                else {
                  a = a[column.index] || false;
                  b = b[column.index] || false;
                }

                return (a === b) ? 0 : a ? -1 : 1;
              });
              break;
          }
          break;
      }

      return sortedData;
    },
    clearSort(column, multi) {
      const me = this;

      me.sortedData = [];

      if (column && multi) {
        me.sorters = me.sorters.filter(sorter => sorter.column.id !== column.id);
      } else {
        me.sorters = [];
      }

      if (!me.rowGroups.length) (me.idRowIndexesMap = new Map());

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
          !me.filteredData && me.reFilter(false);

          me.filteredData.forEach((item, index) => {
            me.idRowIndexesMap.set(item.id, index);
            item.rowIndex = index;
          });

          me.displayedData = me.filteredData;
        }
      } else {
        if (me.rowGroups.length) {
          // Here is problem and bug
          // Wrong setting rowIndex
          /*
          for (const group in me.expandedGroupsWithDataChildren) {
            const groupData = me.groupsChildren[group];

            groupData.forEach(item => {
              me.idRowIndexesMap.set(item.id, item.originalRowIndex);
              item.rowIndex = item.originalRowIndex;
            });
          }*/

          me.sortGroups();
          me.simpleReGenerateDisplayedGroupedData();
          me.updateIndexes();
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
    }
  };

  Object.assign(Fancy.Store.prototype, StoreMixinSort);
})();
