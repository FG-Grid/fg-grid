import { Column, DataItem, RenderParams, RowStyle, RowClsRules } from './Column';

interface GridConfig {
  renderTo?: string | HTMLElement | null;
  filterBar?: boolean;
  defaults?: Column;
  columns: Column[];
  data: DataItem[];
  width?: number;
  height?: number;
  theme?: 'default' | 'string';
  defaultColumnWidth?: number;
  headerRowHeight?: number;
  rowHeight?: number;
  rowAnimation?: boolean;
  minColumnWidth?: number;
  rowGroupType?: 'row' | 'column';
  defaultRowGroupSort?: 'asc-string' | 'desc-string' | 'asc-amount' | 'desc-amount';
  rowGroupBarSeparator?: boolean;
  rowStyle?: (params: RenderParams) => RowStyle | undefined;
  rowCls?: (params: RenderParams) => string | string[] | undefined;
  rowClsRules?: RowClsRules;
  activeCell?: boolean;
  selectingCells?: boolean;
  startEditByTyping?: boolean;
  editorEnterAction?: 'stay' | 'down' | 'right';
}

declare class Grid implements GridConfig {
  constructor(config: GridConfig);
  showColumn(column: Column, animate: boolean): void;
  hideColumn(column: Column, animate: boolean): void;
  removeColumn(column: Column): void;
  getColumn(index: string): Column;
  setData(data: unknown[]): void;
  setColumns(columns: Column[]): void;
  destroy(): void;
  setById(id: string, index: string, value: string|number|boolean|undefined|null): void;
  getItemById(id: string): DataItem;
  remove(rows: string|DataItem): void;
  add(items: DataItem[], position?: number|DataItem): void;

  columns: Column[];
  data: DataItem[];
}

export {
  Grid,
  GridConfig
}
