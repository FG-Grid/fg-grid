(()=> {
  const {
    GRID,
    GRID_CELLS_RIGHT_BORDER,
    ROW_ANIMATION,
    HEADER,
    HEADER_INNER,
    HEADER_INNER_CONTAINER,
    BODY,
    BODY_INNER,
    BODY_INNER_CONTAINER,
    EDITORS_CONTAINER,
    TOUCH
  } = Fancy.cls;

  class Grid {
    theme = 'default';
    defaultColumnWidth = 120;

    headerRowHeight = 32;
    rowHeight = 28;
    rowAnimation = true;

    minColumnWidth = 35;

    rowGroupType = 'row';
    // asc-string desc-string asc-amount desc-amount
    defaultRowGroupSort = 'desc-amount';

    rowGroupBarSeparator = false;

    actualRowsIdSet;
    renderedRowsIdMap;

    activeCell = true;
    selectingCells = true;

    editorEnterAction = 'stay'; // 'stay' | 'down' | 'right'

    startEditByTyping = true;
    flashChanges = true;
    flashChangesColors = ['#e0e5e9','beige'];

    $defaultRowGroupColumn = {
      title: 'Group',
      width: 120,
      sortable: false,
      type: 'string',
      rowGroupIndent: true,
      editable: false,
      render(params){
        const {
          value
        } = params;

        return value || '';
      }
    };

    constructor(config, extraConfig) {
      const me = this;

      if(extraConfig){
        extraConfig.renderTo = config;
        config = extraConfig;
      }

      me.initContainer(config.renderTo);
      me.initId(config.id);

      me.actualRowsIdSet = new Set();
      me.renderedRowsIdMap = new Map();

      config = me.prepareConfig(config);

      Object.assign(me, config);

      me.checkSize();
      me.initScroller();
      me.render();
      me.scroller.calcMaxScrollTop();
      me.scroller.calcVisibleRows();
      me.renderVisibleRows();
      me.renderVisibleHeaderCells();
      if(me.filterBar){
        me.renderVisibleFilterBarCells();
      }

      if(me.activeCell){
        me.initKeyNavigation();
      }

      me.ons();
    }

    initContainer(renderTo){
      const me = this;

      if(renderTo.tagName){
        me.containerEl = renderTo;
      }
      else if(typeof renderTo === 'string'){
        me.containerEl = document.getElementById(renderTo);

        if(!me.containerEl){
          me.containerEl = document.querySelector(renderTo);
        }
      }

      if(!me.containerEl){
        console.error(`Could not find renderTo element`);
      }
    }

    initId(id){
      const me = this;

      if(id){
        me.id = id;
      }

      if(!me.id){
        me.id = `fg-grid-${Fancy.gridIdSeed}`;
        Fancy.gridIdSeed++;
      }

      Fancy.gridsMap.set(me.id, me);
    }

    render() {
      const me = this;
      const gridEl = document.createElement('div');

      gridEl.setAttribute('id', me.id);
      gridEl.classList.add(GRID);
      if(me.rowAnimation){
        gridEl.classList.add(ROW_ANIMATION);
      }

      if(me.cellsRightBorder || me.columnLines){
        gridEl.classList.add(GRID_CELLS_RIGHT_BORDER);
      }

      if(Fancy.isTouchDevice){
        gridEl.classList.add(TOUCH);
      }

      gridEl.classList.add('fg-theme-' + me.theme);

      me.containerEl.appendChild(gridEl);
      me.gridEl = gridEl;

      if(me.rowGroupBar){
        me.renderRowGroupBar();
      }

      me.renderHeader();

      if(me.filterBar){
        me.renderFilterBar();
      }

      me.renderBody();

      me.scroller.render();
    }

    updateWidth(){
      const me = this;
      const width = me.getTotalColumnsWidth();
      const headerWidth = width + me.scroller.scrollBarWidth;
      const bodyWidth = width;

      me.headerInnerEl.style.width = headerWidth + 'px';
      me.headerInnerContainerEl.style.width = width + 'px';
      me.bodyInnerContainerEl.style.width = bodyWidth + 'px';

      if(me.filterBar){
        me.filterBarInnerEl.style.width = headerWidth + 'px';
        me.filterBarInnerContainerEl.style.width = width + 'px';
      }

      me.scroller.setHorizontalSize();
    }

    renderHeader() {
      const me = this;

      const headerEl = document.createElement('div');
      headerEl.classList.add(HEADER);
      headerEl.style.height = (this.headerRowHeight + 1) + 'px';

      const headerInnerEl = document.createElement('div');
      headerInnerEl.classList.add(HEADER_INNER);
      headerInnerEl.style.width = (me.getTotalColumnsWidth() + me.scroller.scrollBarWidth) + 'px';

      const headerInnerContainerEl = document.createElement('div');
      headerInnerContainerEl.classList.add(HEADER_INNER_CONTAINER);
      headerInnerContainerEl.style.height = me.headerRowHeight + 'px';
      headerInnerContainerEl.style.width = me.getTotalColumnsWidth() + 'px';

      headerInnerEl.appendChild(headerInnerContainerEl);
      headerEl.appendChild(headerInnerEl);
      me.gridEl.appendChild(headerEl);

      me.headerInnerContainerEl = headerInnerContainerEl;
      me.headerInnerEl = headerInnerEl;
      me.headerEl = headerEl;
    }

    renderBody() {
      const me = this;

      const bodyEl = document.createElement('div');

      bodyEl.classList.add(BODY);

      const bodyInnerEl = document.createElement('div');
      bodyInnerEl.classList.add(BODY_INNER);

      const bodyInnerContainerEl = document.createElement('div');

      bodyInnerContainerEl.classList.add(BODY_INNER_CONTAINER);
      if(me.store.rowGroups.length){
        bodyInnerContainerEl.style.height = (me.store.getDisplayedDataTotal() * me.rowHeight) + 'px';
      }
      else {
        bodyInnerContainerEl.style.height = (me.store.getDataTotal() * me.rowHeight) + 'px';
      }
      bodyInnerContainerEl.style.width = me.getTotalColumnsWidth() + 'px';

      const editorsContainerEl = document.createElement('div');

      editorsContainerEl.classList.add(EDITORS_CONTAINER);

      bodyInnerContainerEl.appendChild(editorsContainerEl);
      bodyInnerEl.appendChild(bodyInnerContainerEl);
      bodyEl.appendChild(bodyInnerEl);
      me.gridEl.appendChild(bodyEl);

      me.editorsContainerEl = editorsContainerEl;
      me.bodyInnerContainerEl = bodyInnerContainerEl;
      me.bodyInnerEl = bodyInnerEl;
      me.bodyEl = bodyEl;
    }

    updateVisibleHeight(){
      const me = this;
      const store = me.store;
      const {
        filters,
        rowGroups
      } = store;

      if(filters.length || rowGroups.length){
        me.bodyInnerContainerEl.style.height = (store.getDisplayedDataTotal() * me.rowHeight) + 'px';
      }
      else{
        me.bodyInnerContainerEl.style.height = (store.getDataTotal() * me.rowHeight) + 'px';
      }
    }

    animatedRemoveDomRowById(id){
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(id);

      if(rowEl){
        rowEl.style.opacity = 0;
        setTimeout(()=>{
          rowEl.remove();
        }, 200);
      }
      else {
        console.warn(`Row El with id = ${id} was not found`);
      }

      me.actualRowsIdSet.delete(id);
      me.renderedRowsIdMap.delete(id);
    }

    removeDomRowById(id){
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(id);

      if(rowEl){
        rowEl.remove();
      }
      else {
        console.warn(`Row El with id = ${id} was not found`);
      }

      me.actualRowsIdSet.delete(id);
      me.renderedRowsIdMap.delete(id);
    }

    prepareConfig(config) {
      const me = this;
      let rowGroups = [];
      let aggregations = [];

      if(config.columns){
        config.columns = Fancy.deepClone(config.columns);

        let left = 0;
        let newRowGroupsOrder = false;

        me.generateColumnIds(config.columns);

        if(config.rowGroupType === 'column') {
          config.rowGroupColumn = config.rowGroupColumn || {};
        }

        config.columns.forEach(column => {
          if(column.rowGroup){
            column.hidden = true;
            rowGroups.push(column.index);

            if(column.rowGroupOrder !== undefined){
              newRowGroupsOrder = newRowGroupsOrder || [];
              newRowGroupsOrder[column.rowGroupOrder] = column.index;
            }
          }
        });

        if(newRowGroupsOrder){
          const groupsToMerge = structuredClone(rowGroups).filter(group => !newRowGroupsOrder.includes(group));

          rowGroups.forEach((group, index) => {
            if(newRowGroupsOrder[index] === undefined){
              group = groupsToMerge.shift();
              newRowGroupsOrder[index] = group;
            }
          });

          newRowGroupsOrder = newRowGroupsOrder.concat(groupsToMerge);
          rowGroups = newRowGroupsOrder;
        }

        if(config.rowGroupColumn){
          let rowGroupColumn = Object.assign({
            $rowGroups: rowGroups
          }, me.$defaultRowGroupColumn);

          rowGroupColumn.id = rowGroupColumn.id || me.getAutoColumnIdSeed();

          Object.assign(rowGroupColumn, config.rowGroupColumn);
          me.$rowGroupColumn = rowGroupColumn;
          if(rowGroups.length && me.$rowGroupColumn){
            config.columns.unshift(rowGroupColumn);
          }
        }

        config.columns.forEach(column => {
          switch(column.type){
            case 'order':
              if(rowGroups.length || config.rowGroupBar){
                console.error('Order column is not supported for row grouping');
              }
              break;
          }

          me.prepareColumn(column, config.defaults);

          if(column.checkboxSelection){
            config.checkboxSelection = true;
          }

          if(column.agFn){
            aggregations.push({
              index: column.index,
              fn: column.agFn
            })
          }

          column.left = left;
          if(!column.hidden){
            left += column.width;
          }
        });
      }

      const storeConfig = {
        data: structuredClone(config.data),
        defaultRowGroupSort: config.defaultRowGroupSort || me.defaultRowGroupSort
      }

      if(rowGroups.length){
        storeConfig.rowGroups = rowGroups;
        storeConfig.aggregations = aggregations;

        storeConfig.rowGroupExpanded = config.rowGroupExpanded || [];
      }

      me.initStore(storeConfig);

      delete config.data;

      return config;
    }

    initStore(config) {
      const me = this;

      me.store = new Fancy.Store(config);
    }

    ons() {
      const me = this;

      me.debouceClearWheelScrollingFn = Fancy.debounce(me.clearWheelScrolling, 50);
      me.bodyEl.addEventListener('wheel', me.onMouseWheel.bind(this));
      me.touchScroller = new Fancy.TouchScroller(me.bodyEl, {
        onTouchScroll: me.onTouchScroll.bind(this)
      });

      me.headerInnerContainerEl.addEventListener('click', me.onHeaderCellClick.bind(this));
      me.headerInnerContainerEl.addEventListener('mousedown', me.onHeaderMouseDown.bind(this));
    }

    getTotalColumnsWidth() {
      return this.columns.reduce((sum, column)=>{
        return sum + (column.hidden? 0: column.width)
      }, 0);
    }

    reCalcColumnsPositions(){
      const me = this;

      me.columns.reduce((left, column) => {
        column.left = left;

        return left + (column.hidden? 0: column.width);
      }, 0);
    }

    checkSize(){
      const me = this;
      let changed = false;

      if(me.width && me.height){
        //return;
      }

      const rect = me.containerEl.getBoundingClientRect();

      if(me.width !== rect.width){
        changed = true;
      }

      if(me.height !== rect.height){
        changed = true;
      }

      me.width = rect.width;
      me.height = rect.height;

      return changed;
    }

    setData(data){
      const me = this;

      me.store.$dontDropExpandedGroups = true;

      me.store.setData(structuredClone(data));
      me.reRender();
      delete me.store.$dontDropExpandedGroups;
    }

    reRender(){
      const me = this;
      const store = me.store;

      if(me.store.rowGroups.length){
        me.reConfigRowGroups();
      }
      else{
        me.terminateVisibleRows();
        me.scroller.calcMaxScrollTop();
        me.scroller.updateScrollTop();
        me.scroller.calcViewRange();
        me.scroller.setVerticalSize();
        me.scroller.updateHorizontalScrollSize();
        me.updateVisibleHeight();

        me.scroller.calcVisibleRows();

        me.renderVisibleRows();
        me.store.memorizePrevRowIndexesMap();
      }
    }

    destroy(){
      const me = this;

      me.touchScroller.destroy();

      me.gridEl.remove();
    }

    onBodyCellClick(event){
      const me = this;

      me.hideActiveEditor();
    }

    remove(rows){
      const me = this;
      const store = me.store;

      if(typeof rows === 'string'){
        rows = [{
          id: rows
        }]
      }
      else if(typeof rows === 'object'){
        rows = [rows];
      }
      else if(Array.isArray(rows)){
        rows = rows.map((value)=>{
          if(typeof value === 'string'){
            return {
              id: value
            }
          }

          return value;
        });
      }

      if(rows.length === 0){
        return;
      }

      let itemsToRemove = [];
      let rowGroups = new Map();

      for(let i = 0;i<rows.length;i++){
        const row = rows[i];

        me.animatedRemoveDomRowById(row.id);

        let item = me.store.removeItemById(row.id);
        itemsToRemove.push(item);
        if(item.$rowGroupValue){
          let values = rowGroups.get(item.$rowGroupValue) || [];
          values.push(item.id);
          rowGroups.set(item.$rowGroupValue, values);

          store.selectRowItem(item, false);
        }
      }

      rowGroups.forEach((items, groupValue, c) => {
        const splitted = groupValue.split('/');

        for(let i = 0;i<splitted.length;i++){
          const name = splitted.slice(0, splitted.length - i).join('/');
          const groupDetails = store.groupDetails[name];

          groupDetails.amount -= items.length;
          if(groupDetails.amount === 0){
            groupDetails.childrenAmount = 0;
            me.animatedRemoveDomRowById(groupDetails.id);
            delete me.store.groupDetails[name];
            delete me.store.expandedGroupsWithDataChildren[name];
            delete me.store.groupsChildren[name];

            let item = me.store.removeItemById(groupDetails.id);
            itemsToRemove.push(item);

            const parentGroup = splitted.slice(0, splitted.length - i - 1).join('/');
            store.groupsChildren[parentGroup] = store.groupsChildren[parentGroup].filter(item => {
               return item.id !== groupDetails.id;
            });
          }
          else {
            store.groupsChildren[name] = store.groupsChildren[name].filter(item => {
              return items.includes(item.id) === false;
            });
          }
        }
      });

      const rowIndexes = itemsToRemove.sort((a,b) => a.originalRowIndex - b.originalRowIndex);
      rowIndexes.forEach((item,index) => {
        me.store.data.splice(item.originalRowIndex - index, 1)
      });

      if(me.store.displayedData?.length){
        const rowIndexes = itemsToRemove.sort((a,b) => a.rowIndex - b.rowIndex);

        rowIndexes.forEach((item,index) => {
          me.store.displayedData.splice(item.rowIndex - index, 1)
        });
      }

      if(rowGroups.size){
        me.updateRowGroupAmount();
        me.updateRowGroupRowsAndCheckBoxes();
      }

      store.updateIndexes();

      me.scroller.calcVisibleRows();
      me.renderVisibleRows();
      me.updateAfterAddRemove();

      me.updateHeaderCheckboxesSelection();

      me.updateOrderColumn();
    }

    add(items, position){
      const me = this;
      const store = me.store;

      store.add(items, position);

      if(store.rowGroups.length){
        me.updateRowGroupAmount();
        me.updateRowGroupRowsAndCheckBoxes();
      }

      me.scroller.calcVisibleRows();
      me.renderVisibleRows();
      me.updateAfterAddRemove();

      me.updateHeaderCheckboxesSelection();

      me.updateOrderColumn();
    }

    setById(id, index, value){
      const me = this;
      const store = me.store;
      const row = me.renderedRowsIdMap.get(id);
      const flashChangesColors = me.flashChangesColors;
      const rowIndex = row?.getAttribute('row-index');

      const rerenderCell = (cell) => {
        if(!cell){
          return;
        }

        const columnIndex = Number(cell.getAttribute('col-index'));

        const newCell = me.createCell(rowIndex, columnIndex);

        if(cell.innerHTML === newCell.innerHTML){
          return;
        }

        cell.remove();
        cell = newCell;
        const cellStyle = cell.style;
        if(me.flashChanges && !cell.style.backgroundColor){
          cellStyle.transition = 'background-color 2000ms';
          cellStyle.backgroundColor = flashChangesColors[store.selectedItemsMap.has(id)?1:0];

          setTimeout(()=>{
            cellStyle.backgroundColor = '';
          });

          setTimeout(()=>{
            cellStyle.transition = '';
            cellStyle.backgroundColor = '';
          }, 2000);
        }
        row.appendChild(cell);
      }

      if(typeof index === 'object'){
        for(let p in index){
          store.setById(id, p, index[p]);

          let cell = row?.querySelector(`div[col-id="${p}"]`);
          rerenderCell(cell);
        }
      }
      else {
        store.setById(id, index, value);

        let cell = row?.querySelector(`div[col-id="${index}"]`);
        rerenderCell(cell);
      }

      row && me.rowCellsUpdateWithColumnRender(row, me.flashChanges);
    }

    getItemById(id) {
      return this.store.idItemMap.get(id);
    }
  }

  window.Grid = Grid;
  Fancy.Grid = Grid;

})();
