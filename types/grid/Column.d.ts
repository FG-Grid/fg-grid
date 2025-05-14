export interface DataItem {
  id?: string;
  [key: string]: unknown;
}

export interface RenderParams {
  item: DataItem;
  column: Column;
  rowIndex: number;
  columnIndex: number;
  value: string | number | unknown;
  cell: HTMLDivElement;
}

type Currencies = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';

export interface FormatParams extends RenderParams {
  currency?: Currencies;
  minDecimal?: number;
  maxDecimal?: number;
}

export interface GetterParams {
  item: DataItem;
}

export interface SetterParams {
  item: DataItem;
}

export interface CellStyle {
  [cssProperty: string]: string | number;
}

export interface CellStyleFn {
  (params: RenderParams): CellStyle | null | undefined;
}

export interface CellClsRules {
  [cssClassName: string]: ((params: RenderParams) => boolean);
}

export interface CellClsFn {
  (params: RenderParams): string | string[] | null | undefined;
}

export interface RowStyle {
  [cssProperty: string]: string | number;
}

export interface RowClsRules {
  [cssClassName: string]: ((params: RenderParams) => boolean);
}

export interface Column<TData = any> {
  sortable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  hidden?: boolean;
  index?: keyof TData;
  filter?: boolean;
  menu?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'currency' | 'order';
  title?: string;
  editable?: boolean;

  minWidth?: number;
  width?: number;

  render?(params: RenderParams): string|undefined;
  cellStyle?: CellStyle | CellStyleFn;
  cellClsRules?: CellClsRules;
  cellCls?: string | string[] | CellClsFn;

  format?(params: FormatParams): string;
  currency?: Currencies;
  minDecimal?: number;
  maxDecimal?: number;

  getter?(params: GetterParams): string;

  setter?(params: GetterParams): string|number|undefined|null|object;

  agFn?: 'sum' | 'avg' | 'min' | 'max' | ((params: unknown) => number | string);
}
