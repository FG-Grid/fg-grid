import { Column, DataItem } from './Column';

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

  columns: Column[];
  data: DataItem[];
}

export {
  Grid,
  GridConfig
}
