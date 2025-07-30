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

    constructor({ data, rowGroups, rowGroupExpanded, aggregations, defaultRowGroupSort }) {
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
        me.idItemMap = new Map();
      }
      me.updateIndexes();
    }
    updateIndexes() {
      const me = this;
      const data = me.displayedData || me.data;
      //const data = me.displayedData || me.filteredData || me.data;

      if(!me.$isOriginalDataIndexesSet){
        me.data.forEach((item, index) => {
          item.originalDataRowIndex = index;
          me.idItemMap.set(item.id, item);
        });
        me.$isOriginalDataIndexesSet = true;
      }

      me.idRowIndexesMap = new Map();

      data.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        me.idItemMap.set(item.id, item);

        item.rowIndex = index;
        item.originalRowIndex = index;
      });
    }
    setIds() {
      const me = this;

      me.idRowIndexesMap = new Map();
      me.idItemMap = new Map();

      me.idSeed = 0;

      me.data.forEach((item, index) => {
        if (item.id === undefined) {
          item.id = me.generateId();
          item.originalRowIndex = index;
        }
        else{
          item.id = String(item.id);
        }

        me.idRowIndexesMap.set(item.id, index);
        me.idItemMap.set(item.id, item);
      });
    }
    generateId() {
      return 'id-' + this.idSeed++;
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
  }

  Fancy.Store = Store;
})();
