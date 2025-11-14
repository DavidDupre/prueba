export interface TableHeader {
  name: string;
  align?: string;
  label: string;
  field: string;
  sortable: boolean;
  format?: (val: any) => string;
}