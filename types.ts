export interface RowData {
  id: string;
  basicRate: number | '';
  discount: number | '';
  taxPercent: number | '';
  commission: number | '';
  freight: number | '';
}

export interface PanelData {
  id: string;
  name: string;
  rows: RowData[];
  commissionFormula?: string;
}