export type DataItem<TData = any> = TData & { id?: string };

export interface RenderParams<TData = any> {
  item: DataItem<TData>;
  column: Column<TData>;
  rowIndex: number;
  columnIndex: number;
  value: string | number | unknown;
  cell: HTMLDivElement;
}

type Currencies = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';

export interface FormatParams<TData = any> extends RenderParams<TData> {
  currency?: Currencies;
  minDecimal?: number;
  maxDecimal?: number;
}

export interface GetterParams<TData = any> {
  item: DataItem<TData>;
}

export interface SetterParams<TData = any> {
  item: DataItem<TData>;
}

export interface CellStyle {
  [cssProperty: string]: string | number;
}

export interface CellStyleFn<TData = any> {
  (params: RenderParams<TData>): CellStyle | null | undefined;
}

export interface CellClsRules<TData = any> {
  [cssClassName: string]: ((params: RenderParams<TData>) => boolean);
}

export interface CellClsFn<TData = any> {
  (params: RenderParams<TData>): string | string[] | null | undefined;
}

export interface RowStyle {
  [cssProperty: string]: string | number;
}

export interface RowClsRules<TData = any> {
  [cssClassName: string]: ((params: RenderParams<TData>) => boolean);
}

export interface Column<TData = any> {
  sortable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  hidden?: boolean;
  index?: keyof TData;
  filter?: boolean;
  menu?: boolean;
  type?: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'order';
  title?: string;
  editable?: boolean;

  minWidth?: number;
  width?: number;

  render?(params: RenderParams<TData>): string|undefined;
  cellStyle?: CellStyle | CellStyleFn<TData>;
  cellClsRules?: CellClsRules<TData>;
  cellCls?: string | string[] | CellClsFn<TData>;

  format?(params: FormatParams<TData>): string;
  currency?: Currencies;
  minDecimal?: number;
  maxDecimal?: number;

  getter?(params: GetterParams<TData>): string;

  setter?(params: SetterParams<TData>): string|number|undefined|null|object;

  agFn?: 'sum' | 'avg' | 'min' | 'max' | ((params: unknown) => number | string);
}
