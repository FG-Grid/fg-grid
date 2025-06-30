import { Column, DataItem, RenderParams, RowStyle, RowClsRules } from './Column';

interface GridConfig<TData = any> {
  renderTo?: string | HTMLElement | null;
  filterBar?: boolean;
  defaults?: Column<TData>;
  columns: Column<TData>[];
  data: DataItem<TData>[];
  width?: number;
  height?: number;
  id?: string;
  theme?: 'default' | 'string';
  defaultColumnWidth?: number;
  headerRowHeight?: number;
  rowHeight?: number;
  rowAnimation?: boolean;
  minColumnWidth?: number;
  rowGroupType?: 'row' | 'column';
  defaultRowGroupSort?: 'asc-string' | 'desc-string' | 'asc-amount' | 'desc-amount';
  rowGroupBar?: boolean;
  rowGroupExpanded?: boolean | string[] | ((groupName: string) => boolean);
  rowGroupBarSeparator?: boolean;
  rowStyle?: (params: RenderParams<TData>) => RowStyle | undefined;
  rowCls?: (params: RenderParams<TData>) => string | string[] | undefined;
  rowClsRules?: RowClsRules;
  activeCell?: boolean;
  selectingCells?: boolean;
  startEditByTyping?: boolean;
  editorEnterAction?: 'stay' | 'down' | 'right';
  flashChanges?: boolean;
  flashChangesColors?: [string, string];
  columnLines?: boolean;
}

declare class Grid<TData = any> implements GridConfig<TData> {
  constructor(config: GridConfig<TData>);
  showColumn(column: Column<TData>, animate: boolean): void;
  hideColumn(column: Column<TData>, animate: boolean): void;
  removeColumn(column: Column<TData>): void;
  getColumn(index: string): Column<TData>;
  setData(data: DataItem<TData>[]): void;
  setColumns(columns: Column<TData>[]): void;
  destroy(): void;
  setById(id: string, index: string|object, value?: string|number|boolean|undefined|null): void;
  getItemById(id: string): DataItem<TData>;
  remove(rows: string|DataItem<TData>): void;
  add(items: DataItem<TData>|DataItem<TData>[], position?: number|DataItem<TData>): void;

  columns: Column<TData>[];
  data: DataItem<TData>[];
}

export {
  Grid,
  GridConfig,
  Column,
  DataItem
}
