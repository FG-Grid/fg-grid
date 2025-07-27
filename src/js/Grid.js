(() => {
  const {
    GRID,
    GRID_CELLS_RIGHT_BORDER,
    ROW_ANIMATION,
    HEADER,
    HEADER_INNER,
    HEADER_ROW,
    HEADER_ROW_COLUMN_GROUP,
    BODY,
    BODY_INNER,
    BODY_INNER_CONTAINER,
    EDITORS_CONTAINER,
    TOUCH
  } = Fancy.cls;

  const lang = {
    group: 'Group',
    groupBarDragEmpty: 'Drag columns here to generate row groups',
    sign: {
      clear: 'Clear',
      contains: 'Contains',
      notContains: 'Not Contains',
      equals: 'Equals',
      notEquals: 'Not Equals',
      empty: 'Empty',
      notEmpty: 'Not Empty',
      startsWith: 'Starts with',
      endsWith: 'Ends with',
      regex: 'Regex',
      greaterThan: 'Greater Than',
      lessThan: 'Less Than',
      positive: 'Positive',
      negative: 'Negative'
    }
  };

  const div = Fancy.div;
  /**
   * @mixes GridMixinBody
   * @mixes GridMixinColumn
   * @mixes GridMixinColumnDrag
   * @mixes GridMixinEdit
   * @mixes GridMixinFilter
   * @mixes GridMixinHeader
   * @mixes GridMixinKeyNavigation
   * @mixes GridMixinRowGroup
   * @mixes GridMixinRowGroupBar
   * @mixes GridMixinScroll
   * @mixes GridMixinSelection
   * @mixes GridMixinSort
   */
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

    filterBar = false;
    cellsRightBorder = false;
    columnLines = false;
    rowGroupBar = false;

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
      me.columnsIdIndexMap = new Map();

      config = me.prepareConfig(config);

      Object.assign(me, config);

      me.reSetColumnsIdIndexMap();
      me.checkInitialSize();
      me.checkSize();
      me.initScroller();
      me.render();
      const scroller = me.scroller;
      scroller.calcMaxScrollTop();
      scroller.calcVisibleRows();
      me.renderVisibleRows();
      me.renderVisibleHeaderCells();
      me.filterBar && me.renderVisibleFilterBarCells();
      me.activeCell && me.initKeyNavigation();

      me.ons();
    }
    initContainer(renderTo){
      const me = this;

      if(renderTo.tagName){
        me.containerEl = renderTo;
      } else if(typeof renderTo === 'string'){
        me.containerEl = document.getElementById(renderTo);

        if(!me.containerEl){
          me.containerEl = document.querySelector(renderTo);
        }
      }

      !me.containerEl && console.error('FG-Grid: Could not find renderTo element');
    }
    initId(id){
      const me = this;

      if (id) (me.id = id);

      if(!me.id){
        me.id = `fg-grid-${Fancy.gridIdSeed}`;
        Fancy.gridIdSeed++;
      }

      Fancy.gridsMap.set(me.id, me);
    }
    render() {
      const me = this;
      const gridCls = [GRID, 'fg-theme-' + me.theme];

      me.rowAnimation && gridCls.push(ROW_ANIMATION);
      (me.cellsRightBorder || me.columnLines) && gridCls.push(GRID_CELLS_RIGHT_BORDER);
      Fancy.isTouchDevice && gridCls.push(TOUCH);
      const gridEl = div(gridCls);

      gridEl.setAttribute('id', me.id);

      me.containerEl.appendChild(gridEl);
      me.gridEl = gridEl;

      me.rowGroupBar && me.renderRowGroupBar();
      me.renderHeader();
      me.filterBar && me.renderFilterBar();
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
      const headerRowHeight = me.headerRowHeight;
      const columnsLevel = me.columnsLevel;
      const headerHeight = columnsLevel * headerRowHeight + 1;
      const columnsWidth = me.getTotalColumnsWidth();
      const scrollBarWidth = me.scroller.scrollBarWidth;

      const headerEl = div(HEADER, {
        height: headerHeight + 'px'
      });

      const headerInnerEl = div(HEADER_INNER, {
        width: (columnsWidth + scrollBarWidth) + 'px'
      });

      if(columnsLevel > 1){
        const headerInnerGroup1ContainerEl = div([HEADER_ROW, HEADER_ROW_COLUMN_GROUP], {
          height: headerRowHeight + 'px',
          width: columnsWidth + 'px'
        });
        headerInnerEl.appendChild(headerInnerGroup1ContainerEl);
        me.headerInnerGroup1ContainerEl = headerInnerGroup1ContainerEl;
      }

      const headerInnerContainerEl = div(HEADER_ROW, {
        height: headerRowHeight + 'px',
        width: columnsWidth + 'px'
      });

      headerInnerEl.appendChild(headerInnerContainerEl);
      headerEl.appendChild(headerInnerEl);
      me.gridEl.appendChild(headerEl);

      me.headerInnerContainerEl = headerInnerContainerEl;
      me.headerInnerEl = headerInnerEl;
      me.headerEl = headerEl;
    }
    renderBody() {
      const me = this;
      const bodyEl = div(BODY);
      const bodyInnerEl = div(BODY_INNER);
      const bodyInnerContainerEl = div(BODY_INNER_CONTAINER,{
        width: me.getTotalColumnsWidth() + 'px',
        height: me.store.rowGroups.length? (me.store.getDisplayedDataTotal() * me.rowHeight) + 'px':
          (me.store.getDataTotal() * me.rowHeight) + 'px'
      });
      const editorsContainerEl = div(EDITORS_CONTAINER);

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
      } else {
        me.bodyInnerContainerEl.style.height = (store.getDataTotal() * me.rowHeight) + 'px';
      }
    }
    animatedRemoveDomRowById(id){
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(id);

      if(rowEl){
        rowEl.style.opacity = 0;
        setTimeout(() => rowEl.remove(), 200);
      }

      me.actualRowsIdSet.delete(id);
      me.renderedRowsIdMap.delete(id);
    }
    removeDomRowById(id){
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(id);

      rowEl?.remove();

      me.actualRowsIdSet.delete(id);
      me.renderedRowsIdMap.delete(id);
    }
    prepareConfig(config) {
      const me = this;
      let rowGroups = [];
      let aggregations = [];

      const $lang = Fancy.deepClone(lang);

      if(config.lang){
        for(let p in config.lang){
          if(typeof config.lang[p] !== 'object'){
            $lang[p] = config.lang[p];
          }
        }

        if(config.lang.sign){
          for(let p in config.lang.sign){
            $lang.sign[p] = config.lang.sign[p];
          }
        }

        me.$defaultRowGroupColumn.title = $lang.group;
      }

      me.lang = $lang;
      delete config.lang;

      if(config.columns){
        config.columns = Fancy.deepClone(config.columns);
        me.prepareGroupHeaderColumns(config);

        let left = 0;
        let newRowGroupsOrder = false;

        me.generateColumnIds(config.columns);
        config.columns2 && me.generateColumnIds(config.columns2);

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
            $isRowGroupColumn: true
          }, me.$defaultRowGroupColumn);

          rowGroupColumn.id = rowGroupColumn.id || me.getAutoColumnIdSeed();

          Object.assign(rowGroupColumn, config.rowGroupColumn);
          me.$rowGroupColumn = rowGroupColumn;
          if(rowGroups.length && me.$rowGroupColumn){
            if(config.columns[0].type === 'order'){
              config.columns.splice(1, 0, rowGroupColumn);
            } else {
              config.columns.unshift(rowGroupColumn);
            }
          }
        }

        let prevGroupColumn;
        config.columns.forEach((column, columnIndex) => {
          if(column.type === 'order'){
            if((rowGroups.length || config.rowGroupBar) && config.rowGroupType !== 'column'){
              console.error('FG-Grid: Order column is not supported for row grouping with rowGroupType equals to "row"');
              console.error('FG-Grid: For order column use rowGroupType equals to "column"');
            }
          }

          me.prepareColumn(column, config.defaults);

          if (column.checkboxSelection) {
            config.checkboxSelection = true;
          }

          if(column.agFn){
            aggregations.push({
              index: column.index,
              fn: column.agFn
            });
          }

          column.left = left;

          if(config.columnsLevel > 1){
            const groupColumnAtIndex = config.columns2[columnIndex];

            if(groupColumnAtIndex.spanning){
              prevGroupColumn.width += column.width;
              groupColumnAtIndex.left = left;
              groupColumnAtIndex.width = column.width;
            } else if(groupColumnAtIndex.ignore !== true){
              prevGroupColumn = groupColumnAtIndex;
              groupColumnAtIndex.left = left;
              groupColumnAtIndex.width = column.width;
            }
          }

          if(!column.hidden){
            left += column.width;
          }
        });
      }

      const storeConfig = {
        data: structuredClone(config.data),
        defaultRowGroupSort: config.defaultRowGroupSort || me.defaultRowGroupSort
      };

      if(rowGroups.length){
        Object.assign(storeConfig, {
          rowGroups,
          aggregations,
          rowGroupExpanded: config.rowGroupExpanded || []
        });
        delete config.rowGroupExpanded;
      }

      me.initStore(storeConfig);

      delete config.data;

      return config;
    }
    initStore(config) {
      this.store = new Fancy.Store(config);
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
      return this.columns.reduce((sum, column) => {
        return sum + (column.hidden? 0: column.width);
      }, 0);
    }
    reCalcColumnsPositions(){
      const me = this;

      me.columns.reduce((left, column, columnIndex) => {
        column.left = left;

        if(me.columnsLevel > 1){
          const columnLevel2 = me.columns2[columnIndex];
          columnLevel2.left = left;
        }

        return left + (column.hidden? 0: column.width);
      }, 0);
    }
    checkInitialSize(){
      const me = this;

      if(me.width){
        me.initialWidth = me.width;
        delete me.width;
        me.containerEl.style.width = me.initialWidth + 'px';
      }

      if(me.height){
        me.initialHeight = me.height;
        delete me.height;
        me.containerEl.style.height = me.initialHeight + 'px';
      }
    }
    checkSize(){
      const me = this;
      const rect = me.containerEl.getBoundingClientRect();
      let changed = false;

      if(!me.initialWidth || me.width !== rect.width){
        me.width = rect.width;
        changed = true;
      }

      if(me.initialHeight || me.height !== rect.height){
        me.height = rect.height;
        changed = true;
      }

      return changed;
    }
    setData(data){
      const me = this;
      const store = me.store;

      store.$dontDropExpandedGroups = true;

      store.setData(structuredClone(data));
      me.updateHeaderCheckboxSelection();
      me.reRender();
      delete store.$dontDropExpandedGroups;
    }
    reRender(){
      const me = this;
      const store = me.store;
      const scroller = me.scroller;

      if(me.store.rowGroups.length){
        me.reConfigRowGroups();
      } else {
        me.terminateVisibleRows();
        scroller.calcMaxScrollTop();
        scroller.updateScrollTop();
        scroller.calcViewRange();
        scroller.setVerticalSize();
        scroller.updateHorizontalScrollSize();
        me.updateVisibleHeight();

        scroller.calcVisibleRows();

        me.renderVisibleRows();
        store.memorizePrevRowIndexesMap();
      }
    }
    destroy(){
      this.touchScroller.destroy();
      this.gridEl.remove();
    }
    onBodyCellClick(){
      this.hideActiveEditor();
    }
    remove(rows){
      const me = this;
      const store = me.store;
      rows = me.$processRowsToRemove(rows);

      if (rows.length === 0) return;

      let itemsToRemove = [];
      let dataItemsToRemove = [];
      let rowGroups = new Map();

      for(let i = 0;i<rows.length;i++){
        const row = rows[i];

        me.animatedRemoveDomRowById(row.id);

        let item = store.removeItemById(row.id);
        itemsToRemove.push(item);
        if(item.$rowGroupValue){
          let values = rowGroups.get(item.$rowGroupValue) || [];
          values.push(item.id);
          rowGroups.set(item.$rowGroupValue, values);

          store.selectRowItem(item, false);
        }

        if (item.$isGroupRow !== true) dataItemsToRemove.push(item);
      }

      const passedGroupForAgUpdate = {};
      rowGroups.forEach((items, groupValue) => {
        const splitted = groupValue.split('/');

        for(let i = 0;i<splitted.length;i++){
          const name = splitted.slice(0, splitted.length - i).join('/');
          const groupDetails = store.groupDetails[name];
          let groupRemove = false;

          groupDetails.amount -= items.length;
          if(groupDetails.$hasChildrenGroups === false){
            groupDetails.childrenAmount -= items.length;
          }

          if(groupDetails.amount === 0){
            groupDetails.childrenAmount = 0;
            me.animatedRemoveDomRowById(groupDetails.id);
            delete store.groupDetails[name];
            delete store.expandedGroupsWithDataChildren[name];
            delete store.groupsChildren[name];

            groupRemove = true;
            let item = me.store.removeItemById(groupDetails.id);
            itemsToRemove.push(item);

            const parentGroup = splitted.slice(0, splitted.length - i - 1).join('/');
            const parentGroupDetails = store.groupDetails[parentGroup];
            store.groupsChildren[parentGroup] = store.groupsChildren[parentGroup].filter(item => {
              return item.id !== groupDetails.id;
            });
            if(parentGroupDetails) {
              parentGroupDetails.childrenAmount--;
            }
            store.clearGroup(name);
          } else {
            store.groupsChildren[name] = store.groupsChildren[name].filter(item => {
              return items.includes(item.id) === false;
            });
          }

          if(store.groupDetailsForFiltering){
            const groupDetailsForFiltering = store.groupDetailsForFiltering[name];
            groupDetailsForFiltering.amount -= items.length;
            if(groupDetailsForFiltering.amount <= 0){
              groupDetailsForFiltering.childrenAmount = 0;
              me.animatedRemoveDomRowById(groupDetailsForFiltering.id);
              delete store.groupDetailsForFiltering[name];
              delete store.expandedGroupsWithDataChildrenForFiltering[name];
              delete store.groupsChildrenForFiltering[name];

              if(!groupRemove){
                let item = me.store.removeItemById(groupDetails.id);
                itemsToRemove.push(item);
              }

              const parentGroup = splitted.slice(0, splitted.length - i - 1).join('/');
              store.groupsChildrenForFiltering[parentGroup] = store.groupsChildrenForFiltering[parentGroup].filter(item => {
                return item.id !== groupDetails.id;
              });
            } else {
              store.groupsChildrenForFiltering[name] = store.groupsChildrenForFiltering[name].filter(item => {
                return items.includes(item.id) === false;
              });
            }
          }

          if(!passedGroupForAgUpdate[name]){
            store.agGroupUpdateData(name, dataItemsToRemove);
            passedGroupForAgUpdate[name] = true;
          }
        }
      });

      const rowIndexes = dataItemsToRemove.sort((a, b) => a.originalDataRowIndex - b.originalDataRowIndex);
      rowIndexes.forEach((item, index) => {
        store.data.splice(item.originalDataRowIndex - index, 1);
      });
      delete store.$isOriginalDataIndexesSet;

      if(store.displayedData?.length){
        // Filter items that are in collapsed groups
        const displayedItemsToRemove = itemsToRemove.filter(item => {
          if (!item.$rowGroupValue) return true;

          return !store.isItemInCollapsedGroup(item);
        });
        const rowIndexes = displayedItemsToRemove.sort((a, b) => a.rowIndex - b.rowIndex);

        rowIndexes.forEach((item, index) => {
          store.displayedData.splice(item.rowIndex - index, 1);
        });
      }

      if(rowGroups.size){
        me.updateRowGroupAmount();
        me.updateRowGroupAggregations();
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
      delete store.$isOriginalDataIndexesSet;

      if(store.rowGroups.length){
        let rowGroups = {};
        items.forEach(item => {
          rowGroups[item.$rowGroupValue] = rowGroups[item.$rowGroupValue] || [];
          rowGroups[item.$rowGroupValue].push(item);
        });

        for(let group in rowGroups){
          const splitted = group.split('/');

          for(let i = 0;i<splitted.length;i++) {
            const name = splitted.slice(0, splitted.length - i).join('/');

            store.agGroupUpdateData(name, rowGroups[group], '+');
          }
        }

        me.updateRowGroupAmount();
        me.updateRowGroupAggregations();
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
        if (!cell) return;

        const columnIndex = Number(cell.getAttribute('col-index'));
        const newCell = me.createCell(rowIndex, columnIndex);

        if (cell.innerHTML === newCell.innerHTML) return;

        cell.remove();
        cell = newCell;
        const cellStyle = cell.style;
        if(me.flashChanges && !cell.style.backgroundColor){
          cellStyle.transition = 'background-color 2000ms';
          cellStyle.backgroundColor = flashChangesColors[store.selectedItemsMap.has(id)?1:0];

          setTimeout(() => cellStyle.backgroundColor = '');

          setTimeout(() => {
            cellStyle.transition = '';
            cellStyle.backgroundColor = '';
          }, 2000);
        }
        row.appendChild(cell);
      };

      if(typeof index === 'object'){
        for(let p in index){
          store.setById(id, p, index[p]);

          let cell = row?.querySelector(`div[col-id="${p}"]`);
          rerenderCell(cell);
        }
      } else {
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
