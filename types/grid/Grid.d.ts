import { Column, RenderParams, RowStyle, RowClsRules } from './Column';

interface GridConfig<TData = any> {
  renderTo?: string | HTMLElement | null;
  filterBar?: boolean;
  defaults?: Column<TData>;
  columns: Column<TData>[];
  data: TData[];
  width?: number;
  height?: number;
  id?: string;
  theme?: 'default' | 'air' | 'dark' | string;
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

  lang?: {
    group?: string;
    groupBarDragEmpty?: string;
    sign?: {
      clear?: string;
      contains?: string;
      notContains?: string;
      equals?: string;
      notEquals?: string;
      empty?: string;
      notEmpty?: string;
      startsWith?: string;
      endsWith?: string;
      regex?: string;
      greaterThan?: string;
      lessThan?: string;
      positive?: string;
      negative?: string;
    }
  }
}

type Sign = '<'|'>'|'<='|'>='|'='|'!=';
type Value = string|number|boolean|undefined|null;

declare class Grid<TData = any> implements GridConfig<TData> {
  constructor(config: GridConfig<TData>);

  // Columns
  showColumn(column: Column<TData>, animate: boolean): void;
  hideColumn(column: Column<TData>, animate: boolean): void;
  removeColumn(column: Column<TData>): void;
  getColumn(index: string): Column<TData>;
  getColumnById(id: string): Column<TData>;
  setColumns(columns: Column<TData>[]): void;

  // Data
  setData(data: TData[]): void;
  setById(id: string, index: string|object, value?: Value): void;
  getItemById(id: string): TData;
  remove(rows: string|TData): void;
  add(items: TData|TData[], position?: number|TData): void;

  // Sorting
  sort(column: Column<TData>, dir: 'ASC' | 'DESC', multi?: boolean): void;
  clearSort(column: Column<TData>, multi?: boolean): void;
  multiSort(column: Column<TData>, dir: 'ASC' | 'DESC'): void;

  // Filtering
  filter(column: Column<TData>, value: Value, operator: Sign): void;
  clearFilter(index?: Column<TData>, sign?: Sign): void;

  // Row Grouping
  expandAll(): void;
  collapseAll(): void;

  destroy(): void;

  columns: Column<TData>[];
  data: TData[];
}

export {
  Grid,
  GridConfig,
  Column
}
