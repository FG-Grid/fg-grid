(()=>{

  const  {
    ANIMATE_CELLS_POSITION,
    CELL,
    HEADER_CELL,
    FILTER_BAR_CELL,
    ROW
  } = Fancy.cls;

  /**
   * @mixin GridMixinColumn
   */

  const GridMixinColumn = {
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
    },

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

      me.activeCell && me.clearActiveCell();

      return {
        columnIndex: columnsToRemove[0]
      };
    },

    isPossibleToHideColumn(){
      const me = this;
      const numOfHiddenColumns = me.columns.reduce((sum, column) => sum + (column.hidden? 1: 0), 0);

      return me.columns.length - numOfHiddenColumns !== 1;
    },

    removeColumn(column){
      const me = this;

      const {
        columnIndex: hiddenColumnIndex
      } = me.hideColumn(column, false);

      me.columns.splice(hiddenColumnIndex, 1);
      me.clearColumFromLinks(column);

      delete me.$rowGroupColumn.elSortOrder;
      delete me.$rowGroupColumn.filterCellEl;
      delete me.$rowGroupColumn.headerCellEl;
      delete me.$rowGroupColumn.left;

      me.scroller.generateNewRange(false);
      me.reSetVisibleHeaderColumnsIndex();
      me.reSetVisibleBodyColumnsIndex();
      me.reCalcColumnsPositions();
    },

    clearColumFromLinks(column){
      delete column.elFilter;
      delete column.elMenu;
      delete column.elSortAsc;
      delete column.elSortDesc;
      delete column.elSortOrder;
      delete column.filterCellEl;
      delete column.filterField;
      delete column.headerCellEl;
    },

    getColumn(index){
      const me = this;

      return me.columns.find(column => column.index === index);
    },

    getColumnById(id){
      return this.columnIdsMap.get(id);
    },

    getNextVisibleColumnIndex(index){
      const me = this;

      for(let i = index + 1;i<me.columns.length;i++){
        const column = me.columns[i];
        if(column.hidden !== true){
          return i;
        }
      }
    },

    getPrevVisibleColumnIndex(index){
      const me = this;

      for(let i = index - 1;i>-1;i--){
        const column = me.columns[i];
        if(column.hidden !== true){
          return i;
        }
      }
    },

    getAutoColumnIdSeed(){
      const me = this;

      if(me.columnIdSeed === undefined){
        me.columnIdSeed = 0;
      } else {
        me.columnIdSeed++;
      }

      return me.columnIdSeed;
    },

    generateColumnIds(columns, updateMaps = true){
      const me = this;

      const columnIdsMap = new Map();
      const columnIdsSeedMap = new Map();

      columns.forEach(column => {
        const index = (column.index || column.title || '').toLocaleLowerCase();
        if(!column.id){
          let seed = columnIdsSeedMap.get(index);

          if(seed === undefined){
            column.id = index || me.getAutoColumnIdSeed();
            seed = 0;
          } else {
            column.id = `${index}-${seed}`;
          }

          seed++;
          columnIdsSeedMap.set(index, seed);
        } else {
          let seed = columnIdsSeedMap.get(index);

          if(seed === undefined){
            seed = 0;
          }

          seed++;
          columnIdsSeedMap.set(index, seed);
        }

        columnIdsMap.set(column.id, column);
      });

      if(updateMaps){
        me.columnIdsMap = columnIdsMap;
        me.columnIdsSeedMap = columnIdsSeedMap;
      }

      return {
        columnIdsMap,
        columnIdsSeedMap
      }
    },

    setColumns(columns){
      const me = this;

      columns = Fancy.deepClone(columns);

      me.animatingColumnsPosition = true;
      me.gridEl.classList.add(ANIMATE_CELLS_POSITION);

      me.$setColumns(columns);

      me.scroller.generateNewRange(false);
      me.reCalcColumnsPositions();
      me.updateWidth();

      me.terminateNotExistedCells();
      me.reSetVisibleHeaderColumnsIndex();
      me.reSetVisibleBodyColumnsIndex();

      me.renderMissedCells();
      me.updateCellPositions();

      setTimeout(() => {
        me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
        delete me.animatingColumnsPosition;
      }, 300);
    },

    renderMissedCells(){
      const me = this;
      let columnStart = me.scroller.columnViewStart;
      let columnEnd = me.scroller.columnViewEnd;

      const columnIndexes = [];

      for(let i = columnStart; i <= columnEnd; i++){
        const column = me.columns[i];

        if(column.hidden){
          continue
        }

        if(!column.headerCellEl){
          columnIndexes.push(i);
        }
      }

      me.addColumnCells(columnIndexes);
    },

    terminateNotExistedCells(){
      const me = this;
      const cells = me.headerEl.querySelectorAll(`.${HEADER_CELL}`);

      cells.forEach(cell => {
        const columnId = cell.getAttribute('col-id');
        const column = me.getColumnById(columnId);
        const isColumnVisible = me.scroller.isColumnVisible(column);

        if(!column || !isColumnVisible){
          cell.remove();
          if(column && column.filterCellEl){
            column.filterCellEl.remove();
          }

          const filterCellEl = me.filterBarEl?.querySelector?.(`.${FILTER_BAR_CELL}[col-id="${columnId}"]`);
          filterCellEl?.remove();

          const bodyCells = me.bodyEl.querySelectorAll(`.${CELL}[col-id="${columnId}"]`);
          bodyCells.forEach(bodyCell => {
            bodyCell.remove();
          })
        }

        if(column && !isColumnVisible){
          me.clearColumFromLinks(column);
        }
      });
    },

    $setColumns(newColumns){
      const me = this;
      const columnsToAdd = new Map();
      const columnsToRemoveIds = new Set();

      const {
        columnIdsMap: newColumnsIdMap,
        columnIdsSeedMap: newColumnsIdsSeedMap
      } = me.generateColumnIds(newColumns, false);

      me.columns.forEach(column => {
        if(newColumnsIdMap.has(column.id)){
          const newColumn = newColumnsIdMap.get(column.id);

          if(typeof newColumn.width === 'number' && newColumn.width !== column.width){
            column.width = newColumn.width;
          }
        } else {
          columnsToRemoveIds.add(column.id);
        }
      });

      const newColumnsOrderMap = new Map();
      newColumns.forEach((newColumn, index)=>{
        if(!me.columnIdsMap.has(newColumn.id)){
          me.prepareColumn(newColumn, me.defaults);

          columnsToAdd.set(newColumn.id, newColumn);
        }

        newColumnsOrderMap.set(index, newColumn.id);
      });

      columnsToRemoveIds.forEach(id => {
        const column = me.getColumnById(id);
        const index = (column.index || column.title || '').toLocaleLowerCase();
        me.columnIdsMap.delete(id);
        let seed = me.columnIdsSeedMap.get(index);

        if(typeof seed === 'number'){
          seed--;
          if(seed === 0){
            me.columnIdsSeedMap.delete(index);
          } else {
            me.columnIdsSeedMap.set(index, seed);
          }
        }
      });

      columnsToAdd.forEach((column, key) => {
        me.columnIdsMap.set(key, column);
        me.columnIdsSeedMap.set(key, newColumnsIdsSeedMap.get(key));
      });

      const orderedColumns = [];
      newColumnsOrderMap.forEach((columnId, index) => {
        const column = me.getColumnById(columnId);

        orderedColumns[index] = column;
      });

      me.columns = orderedColumns;
    },

    prepareColumn(column, defaults = {}){
      const me = this;
      const store = me.store;

      switch (column.type){
        case 'boolean':
          column.render = Fancy.render.boolean;
          column.onCheckBoxChange = (event, value) => {
            const inputEl= event.target;
            const cell = inputEl.closest(`.${CELL}`);
            const row = cell.closest(`.${ROW}`);
            const itemId = row.getAttribute('row-id');

            me.store.setById(itemId, column.index, value);
          }
          break;
        case 'currency':
          Object.assign(column, {
            format: Fancy.format.currency,
            type: 'number',
            $type: 'currency'
          });
          break;
        case 'order':
          Object.assign(column, {
            sortable: false,
            render: Fancy.render.order,
            width: column.width || 45,
            resizable: false,
            menu: false,
            draggable: false
          });
          me.columnOrder = column;

          if(store?.rowGroups.length || me?.rowGroupBar){
            console.error('Order column is not supported for row grouping');
          }
          break;
      }

      if(column.width === undefined){
        column.width = me.defaultColumnWidth;
      }

      if(column.minWidth && column.width < column.minWidth){
        column.width = column.minWidth;
      }

      if(!column.title){
        column.title = Fancy.capitalizeFirstLetter(column.index || '');
      }

      Object.keys(defaults).forEach(key => {
        if(column[key] === undefined){
          column[key] = defaults[key];
        }
      });
    }
  }

  Object.assign(Grid.prototype, GridMixinColumn);

})();
