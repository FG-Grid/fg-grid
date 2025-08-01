(() => {
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
      me.columnsLevel > 1 && column.parent && me.updateColumnGroupLevel2();

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
        console.warn('FG-Grid: Hiding column was prevented because it requires at least 1 visible column');
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
      me.columnsLevel > 1 && column.parent && me.updateColumnGroupLevel2();

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

      if(me.columnsLevel > 1){
        me.columns2.splice(hiddenColumnIndex, 1);
      }

      delete me.$rowGroupColumn.elSortOrder;
      delete me.$rowGroupColumn.filterCellEl;
      delete me.$rowGroupColumn.headerCellEl;
      delete me.$rowGroupColumn.left;

      me.reSetColumnsIdIndexMap();
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
      return this.columns.find(column => column.index === index);
    },
    getColumnById(id){
      let column = this.columnIdsMap.get(id);

      if(!column){
        column = this.columnIdsMap.get(Number(id));
      }

      return column;
    },
    getNextVisibleColumnIndex(index){
      const columns = this.columns;

      for(let i = index + 1;i<columns.length;i++){
        if (columns[i].hidden !== true) return i;
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
      const columnIdsMap = updateMaps === false? new Map() : me.columnIdsMap || new Map();
      const columnIdsSeedMap = updateMaps === false? new Map() : me.columnIdsSeedMap || new Map();

      columns.forEach(column => {
        const index = (column.index || column.title || '').toLocaleLowerCase();

        if(!column.id){
          let seed = columnIdsSeedMap.get(index);

          if(seed === undefined){
            column.id = index || me.getAutoColumnIdSeed();
            seed = 0;
          } else if(index) {
            column.id = `${index}-${seed}`;
          } else {
            column.id = `id-${seed}`;
          }

          seed++;
          columnIdsSeedMap.set(index, seed);
        } else {
          let seed = columnIdsSeedMap.get(index);
          if (seed === undefined) (seed = 0);

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
      };
    },
    generateColumnId(column){
      const me = this;
      const columnIdsMap = me.columnIdsMap || new Map();
      const columnIdsSeedMap = me.columnIdsSeedMap || new Map();
      const index = (column.index || column.title || '').toLocaleLowerCase();

      if(!column.id){
        let seed = columnIdsSeedMap.get(index);

        if(seed === undefined){
          column.id = index || me.getAutoColumnIdSeed();
          seed = 0;
        } else if(index) {
          column.id = `${index}-${seed}`;
        } else {
          column.id = `id-${seed}`;
        }

        seed++;
        columnIdsSeedMap.set(index, seed);
      } else {
        let seed = columnIdsSeedMap.get(index);

        if (seed === undefined) (seed = 0);

        seed++;
        columnIdsSeedMap.set(index, seed);
      }

      columnIdsMap.set(column.id, column);

      me.columnIdsMap = columnIdsMap;
      me.columnIdsSeedMap = columnIdsSeedMap;
    },
    setColumns(columns){
      const me = this;

      columns = Fancy.deepClone(columns);

      me.animatingColumnsPosition = true;
      me.gridEl.classList.add(ANIMATE_CELLS_POSITION);

      delete me.columnIdSeed;
      me.columnIdsSeedMap.clear();

      me.$setColumns(columns);
      me.reSetColumnsIdIndexMap();

      me.scroller.generateNewRange(false);
      me.reCalcColumnsPositions();
      me.updateWidth();

      me.terminateNotExistedCells();
      me.reSetVisibleHeaderColumnsIndex();
      me.reSetVisibleBodyColumnsIndex();

      me.renderMissedCells();
      me.updateCellPositions();
      me.filterBar && me.renderVisibleFilterBarCells();

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

        if (column.hidden) continue;

        !column.headerCellEl && columnIndexes.push(i);
      }

      me.addColumnCells(columnIndexes);
    },
    terminateNotExistedCells(){
      const me = this;
      const cells = me.headerEl.querySelectorAll(`.${HEADER_CELL}`);

      //debugger

      cells.forEach(cell => {
        const columnId = cell.getAttribute('col-id');
        const column = me.getColumnById(columnId);
        const isColumnVisible = me.scroller.isColumnVisible(column);

        if(!column || !isColumnVisible){
          console.log(column, cell);
          debugger

          cell.remove();
          column && column.filterCellEl?.remove();

          const filterCellEl = me.filterBarEl?.querySelector?.(`.${FILTER_BAR_CELL}[col-id="${columnId}"]`);
          filterCellEl?.remove();

          const bodyCells = me.bodyEl.querySelectorAll(`.${CELL}[col-id="${columnId}"]`);
          bodyCells.forEach(bodyCell => bodyCell.remove());
        }

        column && !isColumnVisible && me.clearColumFromLinks(column);
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

          if(newColumn.hidden && !column.hidden){
            me.hideColumn(column);
          } else if(column.hidden && !newColumn.hidden){
            me.showColumn(column);
          }

          if(column.filter && !newColumn.filter && column.filter){
            delete column.filter;
            column.filterField.destroy();
            delete column.filterField;
          } else if(!column.filter && newColumn.filter) {
            column.filter = true;
          }

          for(let p in newColumn){
            switch (p){
              case 'id':
              case 'filter':
              case 'hidden':
              case 'width':
                continue;
            }
            column[p] = newColumn[p];
          }
        } else {
          columnsToRemoveIds.add(column.id);
        }
      });

      const newColumnsOrderMap = new Map();
      newColumns.forEach((newColumn, index) => {
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
        orderedColumns[index] = me.getColumnById(columnId);
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
          };
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
            menu: false,
            draggable: false,
            filter: false
          });
          me.columnOrder = column;

          if(store?.rowGroups.length || me?.rowGroupBar) console.error('FG-Grid: Order column is not supported for row grouping');
          break;
      }

      if(column.width === undefined) (column.width = me.defaultColumnWidth);
      if(column.minWidth && column.width < column.minWidth) (column.width = column.minWidth);

      if(!column.title) {
        column.title = Fancy.capitalizeFirstLetter(column.index || '');
      }

      Object.keys(defaults).forEach(key => {
        if(column[key] === undefined) (column[key] = defaults[key]);
      });
    },
    updateColumnGroupLevel2(){
      const me = this;

      let i = 0;
      let iL = me.columns2.length;
      // TODO: optimization from to(i, iL)
      // It can be from range
      // Usual view range does not suit
      for(;i<iL;i++) {
        const columnLevel2 = me.columns2[i];
        const prevColumn = me.columns2[i - 1];

        if (columnLevel2.ignore) continue;

        if(!prevColumn || prevColumn.ignore || (prevColumn.columnGroup && columnLevel2.columnGroup && prevColumn.columnGroup.id !== columnLevel2.columnGroup.id)){
          delete columnLevel2.spanning;

          let j = i;
          let jL = iL;
          const children = [];
          for(;j<jL;j++){
            const _columnLevel2 = me.columns2[j];

            if(_columnLevel2.columnGroup && _columnLevel2.columnGroup.id === columnLevel2.columnGroup.id){
              me.columns2[i].firstColumn = columnLevel2;
              children.push(me.columns[j]);

              if(children.length !== 1){
                delete me.columns2[j].children;
                if(me.columns2[j].headerCellEl){
                  me.columns2[j].headerCellEl.style.display = 'none';
                }
              }
            } else {
              break;
            }
          }

          columnLevel2.children = children;
          const width = children.reduce((result, column) => {
            if (column.hidden) return result;

            return result + column.width;
          }, 0);
          columnLevel2.width = width;
          if(width === 0 && columnLevel2.headerCellEl){
            columnLevel2.headerCellEl.style.display = 'none';
          } else if(!columnLevel2.hidden && columnLevel2.headerCellEl){
            columnLevel2.headerCellEl.style.display = '';
            columnLevel2.headerCellEl.style.width = width + 'px';
          }
        }
      }
    },
    reSetColumnsIdIndexMap() {
      const me = this;

      me.columnsIdIndexMap = new Map();
      me.columns.forEach((column, index) => {
        me.columnsIdIndexMap.set(column.id, index);
      });

      me.columns2?.forEach((column, index) => {
        me.columnsIdIndexMap.set(column.id, index);
      });
    }
  };

  Object.assign(Grid.prototype, GridMixinColumn);
})();
