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
    ANIMATE_CELLS_POSITION,
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

    $defaultRowGroupColumn = {
      title: 'Group',
      width: 120,
      sortable: false,
      type: 'string',
      rowGroupIndent: true,
      render(params){
        const {
          value
        } = params;

        return value || '';
      }
    };

    constructor(config) {
      const me = this;

      me.actualRowsIdSet = new Set();
      me.renderedRowsIdMap = new Map();

      config = me.prepareConfig(config);

      Object.assign(me, config);

      //me.initScroller();
      me.containerEl = document.getElementById(me.renderTo);

      me.checkSize();
      me.initScroller();
      me.render();
      me.scroller.calcVisibleRows();
      me.renderVisibleRows();
      me.renderVisibleHeaderCells();
      if(me.filterBar){
        me.renderVisibleFilterBarCells();
      }

      me.ons();
    }

    render() {
      const me = this;
      const gridEl = document.createElement('div');

      gridEl.classList.add(GRID);
      if(me.rowAnimation){
        gridEl.classList.add(ROW_ANIMATION);
      }

      if(me.cellsRightBorder){
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

      bodyInnerEl.appendChild(bodyInnerContainerEl);
      bodyEl.appendChild(bodyInnerEl);
      me.gridEl.appendChild(bodyEl);

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

    removeRowById(id){
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
          switch (column.type){
            case 'boolean':
              column.render = Fancy.render.boolean;
              break;
            case 'currency':
              column.format = Fancy.format.currency;
              column.type = 'number';
              break;
            case 'order':
              column.sortable = false;
              column.render = Fancy.render.order;
              column.width = column.width || 45;
              column.resizable = false;
              me.columnOrder = column;
              if(rowGroups.length || config.rowGroupBar){
                console.error('Order column is not supported for row grouping');
              }
              break;
          }

          if(column.width === undefined){
            column.width = this.defaultColumnWidth;
          }

          if(column.minWidth && column.width < column.minWidth){
            column.width = column.minWidth;
          }

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

          if(!column.title){
            column.title = capitalizeFirstLetter(column.index || '');
          }

          if(config.defaults){
            Object.keys(config.defaults).forEach(key => {
              if(column[key] === undefined){
                column[key] = config.defaults[key];
              }
            });
          }
        });
      }

      const storeConfig = {
        data: config.data,
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
      me.gridEl.addEventListener('wheel', me.onMouseWheel.bind(this));

      me.headerInnerContainerEl.addEventListener('click', me.onHeaderCellClick.bind(this));
      me.headerInnerContainerEl.addEventListener('mousedown', me.onHeaderMouseDown.bind(this));
    }

    getTotalColumnsWidth() {
      return this.columns.reduce((sum, column)=>{
        return sum + (column.hidden? 0: column.width)
      }, 0);
    }

    showColumn(column, animate){
      const me = this;

      if(animate){
        me.animatingColumnsPosition = true;
        me.gridEl.classList.add(ANIMATE_CELLS_POSITION);
      }

      delete column.hidden;

      me.scroller.generateNewRange();
      me.reCalcColumnsPositions();
      me.updateWidth();
      me.updateCellPositions();

      if(animate){
        setTimeout(() => {
          me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
          delete me.animatingColumnsPosition;
        }, 300);
      }
    }

    hideColumn(column, animate){
      const me = this;

      if(!me.isPossibleToHideColumn()){
        console.warn('Hiding column was prevented because it requires at least 1 visible column');
        return false;
      }

      if(animate && !me.animatingColumnsPosition){
        me.animatingColumnsPosition = true;
        me.gridEl.classList.add(ANIMATE_CELLS_POSITION);
      }

      column.hidden = true;

      const {
        columnsToRemove
      } = me.scroller.generateNewRange();
      me.reCalcColumnsPositions();
      me.updateWidth();
      me.updateCellPositions();

      if(animate && me.animatingColumnsPosition){
        setTimeout(() => {
          me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
          delete me.animatingColumnsPosition;
        }, 300);
      }

      return {
        columnIndex: columnsToRemove[0]
      };
    }

    removeColumn(column){
      const me = this;

      const {
        columnIndex: hiddenColumnIndex
      } = me.hideColumn(column, false);

      me.columns.splice(hiddenColumnIndex, 1);
      delete column.elFilter;
      delete column.elMenu;
      delete column.elSortAsc;
      delete column.elSortDesc;
      delete me.$rowGroupColumn.elSortOrder;
      delete me.$rowGroupColumn.filterCellEl;
      delete me.$rowGroupColumn.headerCellEl;
      delete me.$rowGroupColumn.left;

      me.scroller.generateNewRange(false);
      me.reSetVisibleHeaderColumnsIndex();
      me.reSetVisibleBodyColumnsIndex();
      me.reCalcColumnsPositions();
    }

    isPossibleToHideColumn(){
      const me = this;
      const numOfHiddenColumns = me.columns.reduce((sum, column) => sum + (column.hidden? 1: 0), 0);

      return me.columns.length - numOfHiddenColumns !== 1;
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

    getColumn(index){
      const me = this;

      return me.columns.find(column => column.index === index);
    }

    generateColumnIds(columns){
      const me = this;

      me.columnIdsMap = new Map();
      me.columnIdsSeedMap = new Map();

      columns.forEach(column => {
        if(!column.id){
          const index = (column.index || column.title || '').toLocaleLowerCase();
          let seed = me.columnIdsSeedMap.get(index);

          if(seed === undefined){
            column.id = index || me.getAutoColumnIdSeed();
          }
          else{
            column.id = `${index}-${seed}`;
          }

          seed++;
          me.columnIdsSeedMap.set(index, seed);
        }

        me.columnIdsMap.set(column.id, column);
      });
    }

    getAutoColumnIdSeed(){
      const me = this;

      if(me.columnIdSeed === undefined){
        me.columnIdSeed = 0;
      }
      else{
        me.columnIdSeed++;
      }

      return me.columnIdSeed;
    }

    setData(data){
      const me = this;

      me.store.setData(data);
      me.reRender();
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
  }

  window.Grid = Grid;
  Fancy.Grid = Grid;

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

})();
