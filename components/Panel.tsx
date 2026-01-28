import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Plus, X, ArrowDown, Printer, Copy, Check, Calculator } from 'lucide-react';
import { PanelData, RowData } from '../types';
import { calculateRowResult, evaluateFormula, generateId, calculateCommissionFromRates } from '../utils/calculation';

interface PanelProps {
  panel: PanelData;
  onUpdatePanel: (id: string, data: PanelData) => void;
  onDeletePanel: (id: string) => void;
}

export const Panel: React.FC<PanelProps> = ({ panel, onUpdatePanel, onDeletePanel }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  
  // Specific state for the new commission formula
  const [modalRate1, setModalRate1] = useState(1.5);
  const [modalRate2, setModalRate2] = useState(12);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePanel(panel.id, { ...panel, name: e.target.value });
  };

  const addRow = () => {
    const newRow: RowData = {
      id: generateId(),
      basicRate: '',
      discount: '',
      taxPercent: '',
      commission: '',
      freight: ''
    };
    onUpdatePanel(panel.id, { ...panel, rows: [...panel.rows, newRow] });
  };

  const updateRow = (rowId: string, field: keyof RowData, value: number | '') => {
    const currentSettings = panel.commissionSettings || { rate1: 1.5, rate2: 12 };
    
    const updatedRows = panel.rows.map(row => {
      if (row.id === rowId) {
        const newRow = { ...row, [field]: value };
        
        // Auto-calc commission if Basic or Discount changes
        if (field === 'basicRate' || field === 'discount') {
             const autoComm = calculateCommissionFromRates(
                 field === 'basicRate' ? (value as number) : (newRow.basicRate as number | ''),
                 field === 'discount' ? (value as number) : (newRow.discount as number | ''),
                 currentSettings.rate1,
                 currentSettings.rate2
             );
             newRow.commission = autoComm;
        }
        return newRow;
      }
      return row;
    });
    onUpdatePanel(panel.id, { ...panel, rows: updatedRows });
  };

  const deleteRow = (rowId: string) => {
    const updatedRows = panel.rows.filter(row => row.id !== rowId);
    onUpdatePanel(panel.id, { ...panel, rows: updatedRows });
  };

  const fillColumn = (field: keyof RowData) => {
    if (panel.rows.length === 0) return;
    
    // Get value from the first row
    const firstValue = panel.rows[0][field];
    
    // If first row is empty, do nothing
    if (firstValue === '' || firstValue === undefined) return;

    const updatedRows = panel.rows.map((row, index) => {
      // Skip the first row itself, only update if the current cell is empty
      if (index > 0 && row[field] === '') {
        return { ...row, [field]: firstValue };
      }
      return row;
    });

    onUpdatePanel(panel.id, { ...panel, rows: updatedRows });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Find all inputs in the current panel's tbody
      const inputs = Array.from(panelRef.current?.querySelectorAll('tbody input:not([disabled])') || []) as HTMLInputElement[];
      const index = inputs.indexOf(e.currentTarget);
      
      // Move to next input if available
      if (index > -1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
        // Select text for easier overwriting
        inputs[index + 1].select();
      } else if (index === inputs.length - 1) {
        // Optional: If it's the very last input of the table, we could add a new row, 
        // but for now we just blur or keep focus to avoid accidental adds.
        e.currentTarget.blur();
      }
    }
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = panel.name || "Rate Table";
    
    // Use the panel container to identify which one to print
    const container = panelRef.current?.closest('.panel-container');
    if (container) {
      document.body.classList.add('printing-single');
      container.classList.add('current-print');
      
      window.print();
      
      document.body.classList.remove('printing-single');
      container.classList.remove('current-print');
    } else {
      window.print();
    }
    
    document.title = originalTitle;
  };

  const handleCopy = async () => {
    const headers = ['Basic Rate', 'Discount', 'Tax %', 'Commission', 'Freight', 'Result'];
    
    // Construct Excel-friendly TSV format
    let tsvContent = `Panel: ${panel.name}\n\n`;
    tsvContent += headers.join('\t') + '\n';
    
    panel.rows.forEach(row => {
      const result = calculateRowResult(row).toFixed(2);
      const rowData = [
        row.basicRate === '' ? '' : row.basicRate,
        row.discount === '' ? '' : row.discount,
        row.taxPercent === '' ? '' : row.taxPercent,
        row.commission === '' ? '' : row.commission,
        row.freight === '' ? '' : row.freight,
        result
      ];
      tsvContent += rowData.join('\t') + '\n';
    });

    try {
      await navigator.clipboard.writeText(tsvContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback or alert if needed, but modern browsers usually support this in secure context
    }
  };

  const handleCommissionClick = () => {
    // Load existing settings or defaults
    const currentSettings = panel.commissionSettings || { rate1: 1.5, rate2: 12 };
    setModalRate1(currentSettings.rate1);
    setModalRate2(currentSettings.rate2);
    setIsCommissionModalOpen(true);
  };

  const handleSaveCommissionSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Save new settings to panel
    const newSettings = { rate1: modalRate1, rate2: modalRate2 };
    
    // 2. Recalculate commission for ALL rows immediately based on new settings
    const updatedRows = panel.rows.map(row => {
        const autoComm = calculateCommissionFromRates(
             row.basicRate,
             row.discount,
             newSettings.rate1,
             newSettings.rate2
        );
        return { ...row, commission: autoComm };
    });

    onUpdatePanel(panel.id, { 
      ...panel, 
      rows: updatedRows,
      commissionSettings: newSettings
    });
    
    setIsCommissionModalOpen(false);
  };

  return (
    <div ref={panelRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8 transition-all hover:shadow-md duration-200 panel-to-print">
      {/* Panel Header */}
      <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors panel-header-print">
        <input
          type="text"
          value={panel.name}
          onChange={handleNameChange}
          className="bg-transparent text-lg font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-b-2 focus:border-indigo-500 transition-colors w-1/2"
          placeholder="Panel Name"
        />
        <div className="flex items-center gap-2 no-print">
          <button 
            onClick={handleCopy}
            className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 p-2 rounded-lg transition-all"
            title="Copy to Clipboard"
          >
            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
          </button>
          <button 
            onClick={handlePrint}
            className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 p-2 rounded-lg transition-all"
            title="Print Table"
          >
            <Printer size={20} />
          </button>
          <button 
            onClick={() => onDeletePanel(panel.id)}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
            title="Delete Panel"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300 border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-medium text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2 min-w-[120px] border border-slate-200 dark:border-slate-700">Basic Rate</th>
              <th className="px-4 py-2 min-w-[120px] border border-slate-200 dark:border-slate-700">Discount</th>
              <th className="px-4 py-2 min-w-[120px] border border-slate-200 dark:border-slate-700 group">
                <div className="flex items-center gap-1">
                  Tax %
                  <button 
                    onClick={() => fillColumn('taxPercent')}
                    className="opacity-0 group-hover:opacity-100 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-opacity p-0.5 no-print"
                    title="Fill empty cells with first row value"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </th>
              <th className="px-4 py-2 min-w-[120px] border border-slate-200 dark:border-slate-700 group">
                <div className="flex items-center gap-1">
                  <span 
                    onClick={handleCommissionClick}
                    className="cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 font-semibold decoration-dotted underline underline-offset-4 decoration-indigo-300 dark:decoration-indigo-700 print:no-underline"
                    title="Click to configure auto-commission settings"
                  >
                    Commission
                  </span>
                  <button 
                    onClick={() => fillColumn('commission')}
                    className="opacity-0 group-hover:opacity-100 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-opacity p-0.5 no-print"
                    title="Fill empty cells with first row value"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </th>
              <th className="px-4 py-2 min-w-[120px] border border-slate-200 dark:border-slate-700">Freight</th>
              <th className="px-4 py-2 min-w-[120px] border border-slate-200 dark:border-slate-700 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-bold result-cell">Result</th>
              <th className="px-2 py-2 w-10 border border-slate-200 dark:border-slate-700 no-print"></th>
            </tr>
          </thead>
          <tbody>
            {panel.rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                <td className="px-2 py-1 border border-slate-200 dark:border-slate-700">
                  <input
                    type="number"
                    value={row.basicRate}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => updateRow(row.id, 'basicRate', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all bg-transparent dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600"
                  />
                </td>
                <td className="px-2 py-1 border border-slate-200 dark:border-slate-700">
                  <input
                    type="number"
                    value={row.discount}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => updateRow(row.id, 'discount', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all bg-transparent dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600"
                  />
                </td>
                <td className="px-2 py-1 relative border border-slate-200 dark:border-slate-700">
                  <input
                    type="number"
                    value={row.taxPercent}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => updateRow(row.id, 'taxPercent', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="0"
                    className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all bg-transparent pr-6 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none no-print">%</span>
                  <span className="hidden print-only tax-symbol-print absolute right-4 top-1/2 -translate-y-1/2 text-black font-bold">%</span>
                </td>
                <td className="px-2 py-1 border border-slate-200 dark:border-slate-700">
                  <input
                    type="number"
                    value={row.commission}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => updateRow(row.id, 'commission', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="Auto"
                    className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all bg-transparent dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600"
                  />
                </td>
                <td className="px-2 py-1 border border-slate-200 dark:border-slate-700">
                  <input
                    type="number"
                    value={row.freight}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => updateRow(row.id, 'freight', e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all bg-transparent dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600"
                  />
                </td>
                <td className="px-4 py-1 font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-900/20 border border-slate-200 dark:border-slate-700 result-cell">
                  {calculateRowResult(row).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-2 py-1 text-center border border-slate-200 dark:border-slate-700 no-print">
                  <button
                    onClick={() => deleteRow(row.id)}
                    className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                    title="Delete Row"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {panel.rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 text-sm border border-slate-200 dark:border-slate-700">
                  No rows yet. Add a row to start calculating.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-3 border-t border-slate-100 dark:border-slate-700 transition-colors no-print">
        <button
          onClick={addRow}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Row
        </button>
      </div>

      {/* Commission Configuration Modal */}
      {isCommissionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 no-print animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-[33rem] border border-slate-200 dark:border-slate-700 p-6 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator size={20} className="text-indigo-600 dark:text-indigo-400"/>
                Commission Settings
              </h3>
              <button 
                onClick={() => setIsCommissionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCommissionSettings}>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
                  Edit Formula Percentages
                </label>
                
                {/* Visual Formula Builder */}
                <div className="flex flex-wrap items-center gap-2 text-lg font-mono text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400">(</span>
                  <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-sm">
                    Basic - Discount
                  </span>
                  <span>*</span>
                  <div className="relative group">
                    <input 
                      type="number"
                      step="0.01"
                      value={modalRate1}
                      onChange={(e) => setModalRate1(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 rounded bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 outline-none text-center font-bold text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="absolute -bottom-5 left-0 w-full text-center text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">First %</span>
                  </div>
                  <span>%</span>
                  <span className="text-slate-400">)</span>
                  <span>-</span>
                  <div className="relative group">
                    <input 
                      type="number"
                      step="0.01"
                      value={modalRate2}
                      onChange={(e) => setModalRate2(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 rounded bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 outline-none text-center font-bold text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="absolute -bottom-5 left-0 w-full text-center text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Reduction %</span>
                  </div>
                  <span>%</span>
                </div>
                
                <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 italic">
                  * This will automatically recalculate the commission column for all rows in this panel.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCommissionModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium transition-colors hover:bg-indigo-700 shadow-md hover:shadow-lg"
                >
                  Save & Recalculate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};