import { Column, Item } from './Column';

interface GridConfig {
  renderTo?: string;
  filterBar?: boolean;
  defaults?: Column;
  columns: Column[];
  data: Item[];
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
}

declare class Grid implements GridConfig {
  constructor(config: GridConfig);
  showColumn(column: Column, animate: boolean): void;
  hideColumn(column: Column, animate: boolean): void;
  removeColumn(column: Column): void;
  getColumn(index: string): Column;
  setData(data: unknown[]): void;

  columns: Column[];
  data: Item[];
}

export {
  Grid
}
