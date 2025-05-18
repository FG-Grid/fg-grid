(()=> {
  const {
    CELL,
    ROW,
    EDITING
  } = Fancy.cls;

  const GridMixinEdit = {
    onBodyCellDBLClick(event){
      const me = this;
      const target = event.target;
      const cell = target.closest(`.${CELL}`);

      me.openEditorForCell(cell);
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
        }

        value = column.getter(params);
        valueBeforeEdit = value;
      }

      const memorizeChange = (value)=>{
        // Re-get cell on case of scroll
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
          }

          column.setter(params);
        }
        else {
          me.store.setById(itemId, column.index, value);
        }
        cell?.remove();

        cell = me.createCell(rowIndex, columnIndex);
        me.activeCellEl = cell;
        row.appendChild(cell);

        if(column.setter){
          me.rowCellsUpdateWithColumnIndex(row);
        }
        else {
          me.rowCellsUpdateWithColumnRender(row);
        }
      }

      if(startValue !== undefined){
        value = startValue;

        memorizeChange(value);
      }

      if(column.editorField){
        switch (column.type){
          case 'string':
          case 'number':
          case 'date':
            me.setStatusEditing(true);

            column.editorField.setValue(value);
            column.editorField.show({
              width: `${column.width}px`,
              left: `${column.left}px`,
              transform: `translateY(${rowTop - 1}px)`,
            });
            column.editorField.focus();

            me.activeEditor = column.editorField;
            break;
        }
      }
      else{
        switch(column.type){
          case 'string':
          case 'number':
          case 'date':
            me.setStatusEditing(true);
            column.editorField = new Fancy[Fancy.capitalizeFirstLetter(`${column.type}Field`)]({
              renderTo: me.editorsContainerEl,
              value,
              style: {
                position: 'absolute',
                width: `${column.width}px`,
                left: `${column.left}px`,
                transform: `translateY(${rowTop - 1}px)`,
                height: `${me.rowHeight + 1}px`
              },
              onChange(value, fromTyping){
                if(fromTyping === false){
                  return;
                }

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
                  setTimeout(()=>{
                    delete me.$preventOpeningEditor;
                  }, 100);
                }
              },
              onESC(){
                memorizeChange(valueBeforeEdit);
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

      if(value){
        me.gridEl.classList.add(EDITING);
        me.editingCell = me.activeCellEl;
      }
      else{
        me.gridEl.classList.remove(EDITING);
        delete me.editingCell;
      }
    },

    rowCellsUpdateWithColumnIndex(row){
      const me = this;
      const rowIndex = row.getAttribute('row-index');
      const cells = row.querySelectorAll(`.${CELL}`)

      cells.forEach(cell => {
        const columnIndex = Number(cell.getAttribute('col-index'));
        const column = me.columns[columnIndex];

        if(column.index === undefined){
          return;
        }

        cell?.remove();

        cell = me.createCell(rowIndex, columnIndex);
        row.appendChild(cell);
      });
    },

    rowCellsUpdateWithColumnRender(row){
      const me = this;
      const rowIndex = row.getAttribute('row-index');
      const cells = row.querySelectorAll(`.${CELL}`)

      cells.forEach(cell => {
        const columnIndex = Number(cell.getAttribute('col-index'));
        const column = me.columns[columnIndex];

        if(column.render === undefined){
          return;
        }

        cell?.remove();

        cell = me.createCell(rowIndex, columnIndex);
        row.appendChild(cell);
      });
    }
  }

  Object.assign(Grid.prototype, GridMixinEdit);
})();
