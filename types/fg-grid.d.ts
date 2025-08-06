import { Column, RenderParams } from './grid/Column';
import { Grid, GridConfig } from './grid/Grid';

interface CurrencyParams {
  value: unknown;
  minDecimal?: number;
  maxDecimal?: number;
  currency?: string;
}

declare const Fancy : {
  Grid: typeof Grid;
  version: string;
  cls: {
    HIDDEN: string;
    GRID: string;
    HEADER: string;
    HEADER_INNER: string;
    HEADER_INNER_CONTAINER: string;
    HEADER_CELL: string;
    HEADER_CELL_SORTABLE: string;
    HEADER_CELL_NOT_RESIZABLE: string;
    HEADER_CELL_LABEL: string;
    HEADER_CELL_TEXT: string;
    HEADER_FILTER_EL: string;
    HEADER_CELL_RESIZE: string;
    HEADER_CELL_MENU: string;
    HEADER_CELL_SELECTION: string;
    BODY: string;
    BODY_INNER: string;
    BODY_INNER_CONTAINER: string;
    COLUMN_RESIZING: string;
    COLUMN_DRAGGING: string;
    FAKE_COLUMN_CELL_DRAGGING: string;
    FAKE_COLUMN_CELL_DRAGGING_ALLOW: string;
    FAKE_COLUMN_CELL_DRAGGING_DENY: string;
    COLUMNS_MENU: string;
    COLUMNS_MENU_ITEM: string;
    COLUMNS_MENU_ITEM_TEXT: string;
    CELL: string;
    ANIMATE_CELLS_POSITION: string;
    GRID_CELLS_RIGHT_BORDER: string;
    CELL_BOOLEAN: string;
    CELL_ORDER: string;
    CELL_WRAPPER: string;
    CELL_SELECTION: string;
    ROW: string;
    ROW_ODD: string;
    ROW_EVEN: string;
    ROW_GROUP: string;
    ROW_SELECTED: string;
    ROW_GROUP_VALUE_CELL: string;
    ROW_GROUP_CELL: string;
    ROW_GROUP_CELL_SELECTION: string;
    ROW_GROUP_CELL_VALUE: string;
    ROW_GROUP_CELL_AMOUNT: string;
    ROW_GROUP_CELL_EXPANDER: string;
    ROW_GROUP_EXPANDED_CELL: string;
    ROW_ANIMATION: string;
    ROW_HOVER: string;
    ROW_GROUP_BAR: string;
    ROW_GROUP_BAR_EMPTY_TEXT: string;
    ROW_GROUP_BAR_ITEM_CONTAINER: string;
    ROW_GROUP_BAR_ITEM: string;
    ROW_GROUP_BAR_ITEM_TEXT: string;
    ROW_GROUP_BAR_ITEM_ACTIVE: string;
    FILTER_BAR: string;
    FILTER_BAR_CELL: string;
    FILTER_BAR_INNER: string;
    FILTER_BAR_INNER_CONTAINER: string;
    FILTER_INDICATOR_CONTAINER: string;
    FILTER_FIELD: string;
    FILTER_FIELD_INPUT: string;
    FILTER_FIELD_TEXT: string;
    FILTER_FIELD_SIGN: string;
    FILTER_FIELD_LIST: string;
    FILTER_FIELD_LIST_ITEM: string;
    FILTER_FIELD_LIST_ITEM_TEXT: string;
    SORT_ORDER: string;
    SORT_ASC: string;
    SORT_DESC: string;
    SORT_INDICATOR_CONTAINER: string;
    BODY_VERTICAL_SCROLL: string;
    BODY_VERTICAL_SCROLL_CONTAINER: string;
    BODY_VERTICAL_SCROLL_SIZE: string;
    BODY_HORIZONTAL_SCROLL: string;
    BODY_HORIZONTAL_SCROLL_CONTAINER: string;
    BODY_HORIZONTAL_SCROLL_SIZE: string;
    SCROLLBAR_INVISIBLE: string;
    INPUT_CHECKBOX: string;
    SVG_ITEM: string;
    SVG_CHEVRON_RIGHT: string;
    SVG_GROUP: string;
    SVG_DRAG: string;
    SVG_REMOVE: string;
    SVG_BLOCK: string;
  },
  svg: {
    chevronRight: string;
    group: string;
    groupCellDrag: string;
    remove: string;
    block: string;
    menu: string;
    sortAsc: string;
    sortDesc: string;
    filter: string;
  },
  render: {
    boolean(params: RenderParams): void;
    order(params: RenderParams): void;
  },
  format: {
    CURRENCY_REGIONS: {
      USD: 'en-US',
      EUR: 'de',
      GBP: 'en-gb',
      JPY: 'jp',
      CNY: 'zh-cn'
    },
    currency(params: CurrencyParams): string;
  },
  debounce(func: () => void, delay: number): void;
}

export {
  Fancy,
  Grid,
  Column,
  GridConfig,
  RenderParams
}
