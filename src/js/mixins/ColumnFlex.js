(() => {
  /**
	 * @mixin GridMixinColumnFlex
	 */
  const GridMixinColumnFlex = {
    calcFlexColumns(config, width){
      const me = this;
      const scrollBarWidth = 17;
      const flexAmount = me.flexAmount;
      let columns = me.columns;
      let columnsLevel = me.columnsLevel;
      let columns2 = me.columns2;

      if(config){
        columns = config.columns;
        columnsLevel = config.columnsLevel;
        columns2 = config.columns2;
      }

      let left = 0;
      let columnsWidthWithoutFlex = 0;

      if(width === undefined){
        const rect = me.containerEl.getBoundingClientRect();
        width = rect.width;
      }

      columns.forEach((column) => {
        if(!column.flex){
          columnsWidthWithoutFlex += column.width;
        }
      });

      let flexWidth = width - columnsWidthWithoutFlex - scrollBarWidth;

      let oneFlexWidth = flexWidth / flexAmount;
      let prevGroupColumn;
      columns.forEach((column, columnIndex) => {
        column.left = left;

        if(column.flex){
          let newColumnWidth = oneFlexWidth * column.flex;
          let minColumnWidth = column.minWidth || me.minColumnWidth;
          let maxColumnWidth = column.maxWidth;

          if(newColumnWidth < minColumnWidth){
            newColumnWidth = minColumnWidth;
          } else if(maxColumnWidth && newColumnWidth > maxColumnWidth){
            newColumnWidth = maxColumnWidth;
          }

          column.width = newColumnWidth;
        }

        if(columnsLevel > 1){
          const groupColumnAtIndex = columns2[columnIndex];

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
  };

  Object.assign(Grid.prototype, GridMixinColumnFlex);
})();
