(() => {
  /**
   * @mixes StoreMixinEdit
   * @mixes StoreMixinFilter
   * @mixes StoreMixinRowGroup
   * @mixes StoreMixinSelection
   * @mixes StoreMixinSort
   */
  class Store {
    data = [];
    sortedData = undefined;
    filteredData = undefined;
    sorters = [];
    filters = [];
    rowGroups = [];
    rowGroupExpanded = [];
    aggregations = [];
    idRowIndexesMap = null;
    idItemMap = null;
    selectedItemsMap = null;
    selectedRowGroupsChildren = null;

    idSeed = 0;

    prevAction = '';

    constructor({ data, rowGroups, rowGroupExpanded, aggregations, defaultRowGroupSort, onChange, dataIndexes }) {
      const me = this;

      me.prevAction = '';

      me.data = data || [];
      me.rowGroups = rowGroups || [];
      me.rowGroupExpanded = rowGroupExpanded || [];
      me.aggregations = aggregations || [];
      me.defaultRowGroupSort = defaultRowGroupSort || [];
      me.selectedItemsMap = new Map();
      me.selectedRowGroupsChildren = {};
      me.groupDetails = {};
      me.onChange = onChange;

      if(dataIndexes){
        me.dataIndexes = dataIndexes;
      }

      if (me.data.length && me.rowGroups.length) {
        me.lightSetIds();
        me.rowGroupData();
        me.setIndexAndItemsMaps();
      } else {
        me.setIds();
      }
    }
    setData(data){
      const me = this;

      me.sortedData = undefined;
      me.filteredData = undefined;
      me.data = data;
      me.selectedItemsMap = new Map();
      me.selectedRowGroupsChildren = {};

      if (me.data.length && me.rowGroups.length) {
        me.lightSetIds();

        // Potential problem
        if(me.filters.length){
          //me.reFilter(false);
          me.reFilter();
        }

        me.rowGroupData();
        me.setIndexAndItemsMaps();
      } else {
        me.setIds();

        me.filters.length && me.reFilter(false);
        me.sorters.length && me.reSort();
      }
    }
    lightSetIds() {
      const me = this;

      me.idSeed = 0;

      me.data.forEach(item => {
        if (item.id === undefined) {
          item.id = me.generateId();
        } else if (typeof item.id === 'number') {
          item.id = String(item.id);
        }
      });
    }
    // For row groups only
    setIndexAndItemsMaps() {
      const me = this;

      if (!me.idItemMap) {
        me.idItemMap = {};
      }
      me.updateIndexes();
    }
    updateIndexes() {
      const me = this;
      const data = me.displayedData || me.data;
      //const data = me.displayedData || me.filteredData || me.data;

      if(!me.$isOriginalDataIndexesSet){
        me.data.forEach((item, index) => {
          item.originalRowIndex = index;
          me.idItemMap[item.id] = item;
        });
        me.$isOriginalDataIndexesSet = true;
      }

      me.idRowIndexesMap = new Map();

      data.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        me.idItemMap[item.id] = item;

        item.rowIndex = index;
        item.originalRowIndex = index;
      });
    }
    updateDataIndexes(items){
      const me = this;
      if(me.dataIndexes){
        const toUpdate = {};
        for(let p in me.dataIndexes){
          toUpdate[p] = [];
        }
        items.forEach((item) => {
          for(let p in me.dataIndexes){
            toUpdate[p].push(item[p]);
          }
        });

        for(let p in me.dataIndexes){
          toUpdate[p] = [...new Set(toUpdate[p])];
        }

        me.setDataIndexes(toUpdate);
      }
    }
    setDataIndexes(toUpdate) {
      const me = this;
      if(me.dataIndexes) {
        const data = me.data;
        const dataLength = data.length;

        if(toUpdate){
          for (let p in toUpdate) {
            toUpdate[p].forEach(value => {
              me.dataIndexes[p][value] = [];
            });
          }

          for(let j = 0;j<dataLength;j++) {
            const item = data[j];
            for (let p in toUpdate) {
              toUpdate[p].forEach(value => {
                if(item[p] === value){
                  me.dataIndexes[p][value].push(item.id);
                }
              });
            }
          }

          return;
        }

        for (let p in me.dataIndexes) {
          me.dataIndexes[p] = {};
        }

        for(let i = 0;i<dataLength;i++) {
          const item = data[i];

          for(let p in me.dataIndexes){
            if(!me.dataIndexes[p][item[p]]){
              me.dataIndexes[p][item[p]] = [];
            }
            me.dataIndexes[p][item[p]].push(item.id);
          }
        }
      }
    }
    setIds() {
      const me = this;
      const data = me.data;

      me.idRowIndexesMap = new Map();
      me.idItemMap = {};

      me.idSeed = 0;

      let i = 0;
      const iL = me.data.length;
      if(me.dataIndexes){
        for(let p in me.dataIndexes){
          me.dataIndexes[p] = {};
        }

        for(;i<iL;i++){
          const item = data[i];
          if (item.id === undefined) {
            item.id = String(this.idSeed++);
            item.originalRowIndex = i;
          }
          else{
            item.id = String(item.id);
          }

          for(let p in me.dataIndexes){
            if(!me.dataIndexes[p][item[p]]){
              me.dataIndexes[p][item[p]] = [];
            }
            me.dataIndexes[p][item[p]].push(item.id);
          }

          me.idRowIndexesMap.set(item.id, i);
          //me.idItemMap.set(item.id, item);
          me.idItemMap[item.id] = item;
        }
      } else {
        for(;i<iL;i++){
          const item = data[i];
          if (item.id === undefined) {
            item.id = String(this.idSeed++);
            item.originalRowIndex = i;
          }
          else{
            item.id = String(item.id);
          }

          me.idRowIndexesMap.set(item.id, i);
          me.idItemMap[item.id] = item;
        }
      }
    }
    generateId() {
      return String(this.idSeed++);
    }
    getDataTotal() {
      return this.data.length;
    }
    getDisplayedDataTotal() {
      const me = this;
      const {
        sorters,
        filters,
        rowGroups
      } = me;

      if (sorters.length || filters.length || rowGroups.length) {
        return this.displayedData?.length || 0;
      }

      return me.getDataTotal();
    }
    getItemByRowIndex(rowIndex) {
      const me = this;
      const {
        sorters,
        filters,
        rowGroups
      } = me;
      let item;

      if (sorters.length || filters.length || rowGroups.length) {
        //item = me.sortedData[rowIndex];
        item = me.displayedData[rowIndex];
      } else {
        item = me.data[rowIndex];
      }

      return item;
    }
    memorizePrevRowIndexesMap() {
      this.prevIdRowIndexesMap = this.idRowIndexesMap;
    }
    getPrevVisibleRowIndex(rowIndex){
      const me = this;
      const data = me.displayedData || me.data;

      for(let i = rowIndex - 1;i>-1;i--){
        const row = data[i];
        if (row.$isGroupRow !== true) return i;
      }
    }
    getNextVisibleRowIndex(rowIndex){
      const me = this;
      const totalDisplayed = me.getDisplayedDataTotal();
      const data = me.displayedData || me.data;

      for(let i = rowIndex + 1;i<totalDisplayed;i++){
        const row = data[i];
        if (row.$isGroupRow !== true) return i;
      }
    }
    spliceToData(rowIndex, removeNumber, toData, data){
      const me = this;
      if(data.length > 100_000){
        const CHUNK = 10_000;
        let pos = rowIndex + 1;

        if (removeNumber > 0) {
          toData.splice(pos, removeNumber);
        }

        for (let i = 0; i < data.length; i += CHUNK) {
          const chunkSize = Math.min(CHUNK, data.length - i);
          toData.splice(
            pos,
            0,
            ...data.slice(i, i + chunkSize)
          );
          pos += chunkSize;
        }
      } else {
        toData.splice(rowIndex + 1, removeNumber, ...data);
      }
    }
  }

  Fancy.Store = Store;
})();
