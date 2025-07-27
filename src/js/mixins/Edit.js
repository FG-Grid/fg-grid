(() => {
  const { CELL, ROW, EDITING } = Fancy.cls;

  /**
   * @mixin GridMixinEdit
   */
  const GridMixinEdit = {
    onBodyCellDBLClick(event){
      const cell = event.target.closest(`.${CELL}`);

      this.openEditorForCell(cell);
    },
    openEditorForCell(cell, startValue){
      const me = this;
      let columnIndex = Number(cell.getAttribute('col-index'));
      let column = me.columns[columnIndex];
      let row = cell.closest(`.${ROW}`);
      let itemId = row.getAttribute('row-id');
      let rowIndex = row.getAttribute('row-index');
      let item = me.store.idItemMap.get(itemId);
      const rowTop = Fancy.getTranslateY(row);
      let value = item[column.index];
      let valueBeforeEdit = value;

      if(column.editable !== true){
        me.hideActiveEditor();
        return;
      }

      if(column.getter){
        const params = {
          item,
          column,
          rowIndex,
          columnIndex,
          value,
          cell
        };

        value = column.getter(params);
        valueBeforeEdit = value;
      }

      const memorizeChange = (value) => {
        // Re-get cell on a case of scroll
        if(me.activeCellEl){
          cell = me.activeCellEl;
          row = cell.closest(`.${ROW}`);
          columnIndex = Number(cell.getAttribute('col-index'));
          column = me.columns[columnIndex];
          rowIndex = row.getAttribute('row-index');
          itemId = row.getAttribute('row-id');
          item = me.store.idItemMap.get(itemId);
        }

        if(column.setter){
          const params = {
            item,
            column,
            rowIndex,
            columnIndex,
            value,
            cell,
            newValue: value
          };

          column.setter(params);
        } else {
          me.store.setById(itemId, column.index, value);
        }
        cell?.remove();

        cell = me.createCell(rowIndex, columnIndex);
        me.activeCellEl = cell;
        row.appendChild(cell);

        if(column.setter){
          me.rowCellsUpdateWithColumnIndex(row);
        } else {
          me.rowCellsUpdateWithColumnRender(row,false, false);
        }

        if(item.$rowGroupValue && column.agFn){
          const splitted = item.$rowGroupValue.split('/');

          for(let i = 0;i<splitted.length;i++){
            const groupName = splitted.slice(0, splitted.length - i).join('/');

            me.store.agGroupUpdateData(groupName, [item], 'update');
            me.updateRowGroupAggregations();
          }
        }
      };

      if(startValue !== undefined){
        value = startValue;

        memorizeChange(value);
      }

      const type = column.type || 'string';

      if(column.editorField){
        switch (type){
          case 'string':
          case 'number':
          case 'date':
            me.setStatusEditing(true);

            column.editorField.valueBeforeEdit = valueBeforeEdit;
            column.editorField.setValue(value);
            column.editorField.show({
              width: `${column.width}px`,
              left: `${column.left}px`,
              transform: `translateY(${rowTop - 1}px)`
            });
            column.editorField.focus();

            me.activeEditor = column.editorField;
            break;
        }
      } else {
        switch(type){
          case 'string':
          case 'number':
          case 'date':
            me.setStatusEditing(true);
            column.editorField = new Fancy[Fancy.capitalizeFirstLetter(`${type}Field`)]({
              renderTo: me.editorsContainerEl,
              valueBeforeEdit,
              value,
              style: {
                position: 'absolute',
                width: `${column.width}px`,
                left: `${column.left}px`,
                transform: `translateY(${rowTop - 1}px)`,
                height: `${me.rowHeight + 1}px`
              },
              onChange(value, fromTyping){
                if(fromTyping === false) return;

                memorizeChange(value);
              },
              onEnter(){
                me.hideActiveEditor();
                let activeCell = false;
                switch (me.editorEnterAction){
                  case 'down':
                    activeCell = me.setActiveCellDown();
                    break;
                  case 'right':
                    activeCell = me.setActiveCellRight();
                    break;
                }

                if(activeCell === false){
                  me.$preventOpeningEditor = true;
                  setTimeout(() => delete me.$preventOpeningEditor, 100);
                }
              },
              onESC(){
                memorizeChange(this.valueBeforeEdit);
                me.hideActiveEditor();
              }
            });
            column.editorField.focus();

            me.activeEditor = column.editorField;
            break;
          default:
            me.hideActiveEditor();
        }
      }
    },
    hideActiveEditor(){
      const me = this;

      if(me.activeEditor){
        me.activeEditor.hide();
        delete me.activeEditor;
        me.setStatusEditing(false);
      }
    },
    setStatusEditing(value){
      const me = this;

      me.isEditing = value;
      me.gridEl.classList[value? 'add' : 'remove'](EDITING);

      if(value){
        me.editingCell = me.activeCellEl;
      } else {
        delete me.editingCell;
      }
    },
    rowCellsUpdateWithColumnIndex(row){
      const me = this;
      const rowIndex = row.getAttribute('row-index');
      const cells = row.querySelectorAll(`.${CELL}`);

      cells.forEach(cell => {
        const columnIndex = Number(cell.getAttribute('col-index'));
        const column = me.columns[columnIndex];

        if(column.index === undefined) return;

        cell?.remove();

        cell = me.createCell(rowIndex, columnIndex);
        row.appendChild(cell);
      });
    },
    rowCellsUpdateWithColumnRender(row, flash, allowActiveCellSet = true){
      const me = this;
      const rowIndex = row.getAttribute('row-index');
      const itemId = row.getAttribute('row-id');
      const cells = row.querySelectorAll(`.${CELL}`);

      cells.forEach(cell => {
        const columnIndex = Number(cell.getAttribute('col-index'));
        const column = me.columns[columnIndex];

        if(column.render === undefined || column.type === 'order' || column.index === 'id') return;

        const newCell = me.createCell(rowIndex, columnIndex, allowActiveCellSet);
        if(cell.innerHTML === newCell.innerHTML) return;
        cell?.remove();
        cell = newCell;

        const cellStyle = cell.style;

        if(flash && !cell.style.backgroundColor){
          cellStyle.transition = 'background-color 2000ms';
          cellStyle.backgroundColor = me.flashChangesColors[me.store.selectedItemsMap.has(itemId)?1:0];

          setTimeout(() => cellStyle.backgroundColor = '');

          setTimeout(() => {
            cellStyle.transition = '';
            cellStyle.backgroundColor = '';
          }, 2000);
        }
        row.appendChild(cell);
      });
    },
    updateAfterAddRemove(){
      const me = this;
      const scroller = me.scroller;

      scroller.calcMaxScrollTop();
      scroller.updateScrollTop();
      scroller.calcViewRange();
      scroller.setVerticalSize();
      scroller.updateHorizontalScrollSize();
      me.updateVisibleHeight();

      me.updateVisibleRowsAfterRemove();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();
    },

    updateVisibleRowsAfterRemove() {
      const me = this;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          me.renderedRowsIdMap.forEach((rowEl, id) => {
            const item = me.store.idItemMap.get(id);

            me.actualRowsIdSet.has(item.id) && me.updateRowPosition(item);
          });
        });
      });
    },

    $processRowsToRemove(rows){
      switch (Fancy.typeOf(rows)){
        case 'string':
          rows = [{
            id: rows
          }];
          break;
        case 'object':
          rows = [rows];
          break;
        case 'array':
          rows = rows.map((value) => {
            if(typeof value === 'string'){
              return {
                id: value
              };
            }

            return value;
          });
          break;
      }

      return rows;
    }
  };

  Object.assign(Grid.prototype, GridMixinEdit);
})();
