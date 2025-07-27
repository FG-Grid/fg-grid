(() => {
  const {
    BODY_VERTICAL_SCROLL,
    BODY_VERTICAL_SCROLL_CONTAINER,
    BODY_VERTICAL_SCROLL_SIZE,
    BODY_HORIZONTAL_SCROLL,
    BODY_HORIZONTAL_SCROLL_CONTAINER,
    BODY_HORIZONTAL_SCROLL_SIZE,
    SCROLLBAR_INVISIBLE
  } = Fancy.cls;

  const div = Fancy.div;

  class Scroller {
    startRow = 0;
    endRow = 0;

    scrollTop = 0;
    scrollLeft = 0;
    maxScrollTop = 0;

    topBufferRows = 10;
    bufferRows = 30;
    extraBufferRows = 20;

    columnViewStart = 0;
    columnViewEnd = 0;
    columnsViewRange = [];

    scrollBarWidth = 17;

    isDomInvisibleScrollbar = false;

    constructor(config) {
      const me = this;

      me.grid = config.grid;

      me.calcScrollBarWidth();
      me.calcViewRange();

      me.initResizeObserver();
    }
    deltaChange(delta) {
      const me = this;

      if(!me.isVerticalVisible()){
        me.scrollTop = 0;
        me.verticalScrollContainerEl.scrollTop = 0;
        return false;
      }

      let changed = false;
      let scrollTop = me.scrollTop - delta;

      if (scrollTop < 0) (scrollTop = 0);
      if (scrollTop > me.maxScrollTop) (scrollTop = me.maxScrollTop);
      if (me.scrollTop !== scrollTop) (changed = true);

      me.scrollTop = scrollTop;
      me.verticalScrollContainerEl.scrollTop = scrollTop;

      return changed;
    }
    horizontalDeltaChange(delta){
      const me = this;

      if(!me.isHorizontalVisible()){
        me.scrollLeft = 0;
        me.horizontalScrollContainerEl.scrollLeft = 0;
        return false;
      }

      let changed = false;
      let scrollLeft = me.scrollLeft - delta;

      if (scrollLeft < 0) (scrollLeft = 0);

      if (me.horizontalScrollContainerEl.scrollLeft !== scrollLeft) (changed = true);

      me.horizontalScrollContainerEl.scrollLeft = scrollLeft;
      me.scrollLeft = me.horizontalScrollContainerEl.scrollLeft;

      return changed;
    }
    calcVisibleRows() {
      const me = this;
      let requiresRenderMoreRows = false;
      const newBufferRows = Math.ceil(me.grid.height / me.grid.rowHeight) + me.extraBufferRows;

      if (me.bufferRows < newBufferRows) (requiresRenderMoreRows = true);

      me.bufferRows = newBufferRows;

      return requiresRenderMoreRows;
    }
    calcMaxScrollTop() {
      const me = this;

      me.maxScrollTop = me.grid.store.getDisplayedDataTotal() * me.grid.rowHeight - me.grid.bodyEl.getBoundingClientRect().height;

      if (me.maxScrollTop < 0) (me.maxScrollTop = 0);
    }
    updateScrollTop() {
      const me = this;

      if(me.scrollTop > me.maxScrollTop){
        me.scrollTop = me.maxScrollTop;
        me.verticalScrollContainerEl.scrollTop = me.maxScrollTop;
      }
    }
    getStartRow() {
      this.calcStartRow();

      return this.startRow;
    }
    calcStartRow() {
      const me = this;
      let startRow = Math.round(me.scrollTop / me.grid.rowHeight) - me.topBufferRows;
      const endRow = me.getEndRow();
      const deltaRows = endRow - startRow;

      if (deltaRows < me.bufferRows) {
        startRow = endRow - me.bufferRows;
      }

      if (startRow < 0) (startRow = 0);

      me.startRow = startRow;
    }
    getEndRow() {
      const me = this;
      const store = me.grid.store;
      const {
        rowGroups
      } = store;

      const displayedDataTotal = store.getDisplayedDataTotal();

      let startRow = Math.round(me.scrollTop / me.grid.rowHeight) - me.topBufferRows;
      let endRow = startRow + me.bufferRows;

      if (!rowGroups.length && endRow > me.grid.store.getDataTotal()) {
        endRow = me.grid.store.getDataTotal();
      }

      if (endRow > displayedDataTotal) (endRow = displayedDataTotal);

      me.endRow = endRow;

      return endRow;
    }
    render() {
      this.renderVerticalScroll();
      this.renderHorizontalScroll();

      this.ons();
    }
    renderVerticalScroll() {
      const me = this;

      const verticalScrollEl = div(BODY_VERTICAL_SCROLL);

      me.isDomInvisibleScrollbar && verticalScrollEl.classList.add(SCROLLBAR_INVISIBLE);

      const verticalScrollContainerEl = div(BODY_VERTICAL_SCROLL_CONTAINER,{
        width: me.scrollBarWidth + 'px'
      });

      const verticalScrollSizeEl = div(BODY_VERTICAL_SCROLL_SIZE, {
        width: me.scrollBarWidth + 'px'
      });

      verticalScrollContainerEl.appendChild(verticalScrollSizeEl);
      verticalScrollEl.appendChild(verticalScrollContainerEl);
      me.grid.bodyEl.appendChild(verticalScrollEl);

      me.verticalScrollEl = verticalScrollEl;
      me.verticalScrollContainerEl = verticalScrollContainerEl;
      me.verticalScrollSizeEl = verticalScrollSizeEl;

      me.setVerticalSize();
    }
    renderHorizontalScroll() {
      const me = this;
      const scrollBarWidth = `${me.scrollBarWidth}px`;

      const horizontalScrollEl = div(BODY_HORIZONTAL_SCROLL,{
        height: scrollBarWidth,
        minHeight: scrollBarWidth,
        maxHeight: scrollBarWidth,
        width: (me.isDomInvisibleScrollbar || !me.isVerticalVisible())? '100%':
          `calc(100% - ${scrollBarWidth})`
      });

      me.isDomInvisibleScrollbar && horizontalScrollEl.classList.add(SCROLLBAR_INVISIBLE);

      const horizontalScrollContainerEl = div(BODY_HORIZONTAL_SCROLL_CONTAINER, {
        height: scrollBarWidth,
        minHeight: scrollBarWidth,
        maxHeight: scrollBarWidth
      });

      const horizontalScrollSizeEl = div(BODY_HORIZONTAL_SCROLL_SIZE, {
        height: scrollBarWidth,
        minHeight: scrollBarWidth,
        maxHeight: scrollBarWidth
      });

      horizontalScrollContainerEl.appendChild(horizontalScrollSizeEl);
      horizontalScrollEl.appendChild(horizontalScrollContainerEl);
      me.grid.gridEl.appendChild(horizontalScrollEl);

      me.horizontalScrollEl = horizontalScrollEl;
      me.horizontalScrollContainerEl = horizontalScrollContainerEl;
      me.horizontalScrollSizeEl = horizontalScrollSizeEl;

      me.setHorizontalSize();
    }
    updateHorizontalScrollSize() {
      const me = this,
        horizontalScrollEl = me.horizontalScrollEl;

      if (me.isDomInvisibleScrollbar) {
        horizontalScrollEl.style.width = '100%';
      } else {
        if (me.isVerticalVisible()) {
          horizontalScrollEl.style.width = `calc(100% - ${me.scrollBarWidth}px)`;
        } else {
          horizontalScrollEl.style.width = '100%';
        }
      }
    }
    ons() {
      const me = this;

      me.verticalScrollContainerEl.addEventListener('scroll', me.onVerticalScroll);
      me.horizontalScrollContainerEl.addEventListener('scroll', me.onHorizontalScroll);
    }
    onVerticalScroll = () => {
      const me = this;

      if(!me.grid.wheelScrolling){
        me.scrollTop = me.verticalScrollContainerEl.scrollTop;
        me.grid.bodyInnerEl.scrollTop = me.scrollTop;

        cancelAnimationFrame(me.grid.animationRenderId);

        me.grid.animationRenderId = requestAnimationFrame(() => {
          me.grid.renderVisibleRows();
        });

        cancelAnimationFrame(me.grid.animationRemoveId);

        me.grid.animationRemoveId = requestAnimationFrame(() => {
          me.grid.removeNotNeededRows();
        });
      }
    }
    onHorizontalScroll = () => {
      const me = this;
      const grid = me.grid;

      me.scrollLeft = me.horizontalScrollContainerEl.scrollLeft;
      grid.headerEl.scrollLeft = me.scrollLeft;
      grid.bodyInnerEl.scrollLeft = me.scrollLeft;

      if (grid.filterBar) {
        grid.filterBarEl.scrollLeft = me.scrollLeft;
      }

      cancelAnimationFrame(grid.horizontalScrollId);

      me.grid.horizontalScrollId = requestAnimationFrame(() => {
        me.generateNewRange();
      });
    }
    generateNewRange(doRender = true) {
      const me = this;
      const grid = me.grid;
      const {
        columnStart: newColumnStart,
        columnEnd: newColumnEnd,
        range: newRange
      } = me.getColumnsViewRange();

      const newRangeSet = new Set(newRange);
      const rangeSet = new Set(me.columnsViewRange);

      const columnsToAdd = [];
      const columnsToRemove = [];

      if(doRender){
        newRange.forEach(newColumnIndex => {
          const column = grid.columns[newColumnIndex];
          if (!column.hidden && !rangeSet.has(newColumnIndex)) columnsToAdd.push(newColumnIndex);
        });

        rangeSet.forEach(columnIndex => {
          !newRangeSet.has(columnIndex) && columnsToRemove.push(columnIndex);
        });
      }

      me.columnsViewRange = newRange;
      me.columnViewStart = newColumnStart;
      me.columnViewEnd = newColumnEnd;

      grid.addColumnCells(columnsToAdd);
      grid.removeColumnCells(columnsToRemove);

      return {
        columnsViewRange: me.columnsViewRange,
        columnViewStart: me.columnViewStart,
        columnViewEnd: me.columnViewEnd,
        columnsToAdd,
        columnsToRemove
      };
    }
    setVerticalSize() {
      const me = this;
      const grid = me.grid;
      const store = grid.store;
      const {
        filters,
        rowGroups
      } = store;

      let height;

      if (filters.length || rowGroups.length) {
        height = store.getDisplayedDataTotal() * grid.rowHeight;
      } else {
        height = store.getDataTotal() * grid.rowHeight;
      }

      me.verticalScrollSizeEl.style.height = height + 'px';

      if (me.isVerticalVisible()) {
        me.verticalScrollEl.style.display = '';
      } else {
        me.verticalScrollEl.style.display = 'none';
      }
    }
    isHorizontalVisible() {
      const me = this;
      const bodyWidth = me.grid.bodyEl.getBoundingClientRect().width;
      const visibleColumnsWidth = me.grid.columns.reduce((sum, column) => {
        if (column.hidden) return sum;

        return sum + column.width;
      }, 0);

      return visibleColumnsWidth > bodyWidth;
    }
    isVerticalVisible() {
      const me = this;
      const grid = me.grid;
      const store = grid.store;
      const {
        filters,
        rowGroups
      } = store;
      const bodyHeight = grid.bodyEl.getBoundingClientRect().height;
      const rowHeight = grid.rowHeight;

      let visibleRowsHeight;

      if (filters.length || rowGroups.length) {
        visibleRowsHeight = store.getDisplayedDataTotal() * rowHeight;
      } else {
        visibleRowsHeight = store.getDataTotal() * rowHeight;
      }

      return bodyHeight < visibleRowsHeight;
    }
    setHorizontalSize() {
      const me = this;
      const columnsWidth = me.grid.getTotalColumnsWidth();

      me.horizontalScrollSizeEl.style.width = `${columnsWidth}px`;

      if (!me.isHorizontalVisible()) {
        me.horizontalScrollEl.style.display = 'none';
      } else {
        me.horizontalScrollEl.style.display = '';
      }
    }
    calcViewRange() {
      const me = this;
      const {
        columnStart,
        columnEnd,
        range
      } = me.getColumnsViewRange();

      me.columnViewStart = columnStart;
      me.columnViewEnd = columnEnd;
      me.columnsViewRange = range;
    }
    getColumnsViewRange() {
      const me = this;
      const gridWidth = me.grid.width;

      let columnStart;
      let columnEnd;
      let range = [];

      let columnPastWidth = 0;

      for (let i = 0; i < me.grid.columns.length; i++) {
        const column = me.grid.columns[i];

        if (column.hidden) continue;

        if (columnStart === undefined && columnPastWidth <= me.scrollLeft && (columnPastWidth + column.width) > me.scrollLeft) {
          columnStart = i;
        }

        if (columnStart !== undefined) range.push(i);

        if (columnEnd === undefined && columnPastWidth <= me.scrollLeft + gridWidth && columnPastWidth + column.width >= me.scrollLeft + gridWidth) {
          const nextColumn = me.grid.columns[i + 1];
          if (nextColumn) {
            columnEnd = i + 1;
            range.push(i + 1);
          } else {
            columnEnd = i;
          }

          break;
        }

        columnPastWidth += column.width;
      }

      if (columnEnd === undefined) {
        columnEnd = me.grid.columns.length - 1;
      }

      return {
        columnStart,
        columnEnd,
        range
      };
    }
    calcScrollBarWidth() {
      this.scrollBarWidth = this.getScrollbarWidth();
    }
    getScrollbarWidth() {
      const body = document.body;
      const el = div([],{
        width: '100px',
        height: '100px',
        opacity: '0',
        overflow: 'scroll',
        msOverflowStyle: 'scrollbar', // needed for WinJS apps
        position: 'absolute'
      });
      body.appendChild(el);

      let width = el.offsetWidth - el.clientWidth;

      el.parentNode && el.parentNode.removeChild(el);

      if (width === 0) {
        this.isDomInvisibleScrollbar = width === 0;
        width = 16;
      }

      return width;
    }
    initResizeObserver(){
      const me = this;

      me.resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries) || !entries.length) return;

        me.grid.checkSize() && me.updateSize();
      });

      me.resizeObserver.observe(me.grid.containerEl);
    }
    updateSize(){
      const me = this;
      const grid = me.grid;

      const changedBufferedRows = me.calcVisibleRows();
      me.generateNewRange();
      grid.reCalcColumnsPositions();
      grid.updateWidth();
      grid.updateCellPositions();

      changedBufferedRows && grid.renderVisibleRows();
    }
    isColumnVisible(checkColumn){
      const me = this;

      if (!checkColumn) return false;

      for(let i = 0, iL = me.columnsViewRange.length;i<iL;i++){
        const columnIndex = me.columnsViewRange[i];
        const column = me.grid.columns[columnIndex];

        if (column.id === checkColumn.id) return true;
      }

      return false;
    }
  }

  Fancy.Scroller = Scroller;
})();
