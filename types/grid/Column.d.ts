export interface DataItem {
  id?: string;
  [key: string]: unknown;
}

interface renderParams {
  item: DataItem;
}

export interface Column {
  sortable?: boolean;
  width?: number;
  render?(params: renderParams): string|undefined;

  index?: string;
  filter?: boolean;
  agFn?: 'sum' | 'avg' | 'min' | 'max' | ((params: unknown) => number | string);
  type?: 'string' | 'number' | 'boolean' | 'currency' | 'order';
}
