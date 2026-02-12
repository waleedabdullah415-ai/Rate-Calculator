export interface RowData {
  id: string;
  basicRate: number | '';
  discount: number | '';
  taxPercent: number | '';
  commission: number | string;
  freight: number | '';
}

export interface CommissionSettings {
  rate1: number;
  rate2: number;
}

export interface PanelData {
  id: string;
  name: string;
  rows: RowData[];
  commissionFormula?: string;
  commissionSettings?: CommissionSettings;
}