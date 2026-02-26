import React, { useEffect, useState, useRef } from 'react';
import { Plus, Calculator, Info, Moon, Sun, RotateCcw } from 'lucide-react';
import { Panel } from './components/Panel';
import { GuideStickman } from './components/GuideStickman';
import { PanelData } from './types';
import { generateId } from './utils/calculation';

const STORAGE_KEY = 'rate-calc-pro-v1';
const THEME_KEY = 'rate-calc-theme';
const SCALE_KEY = 'rate-calc-scale';

const App: React.FC = () => {
  const [panels, setPanels] = useState<PanelData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // UI Scaling State
  const [uiScale, setUiScale] = useState(1);
  const [showScaleMenu, setShowScaleMenu] = useState(false);
  const scaleMenuRef = useRef<HTMLDivElement>(null);

  // Load from local storage on mount
  useEffect(() => {
    // Load Data
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure old data has new fields
        const upgradedData = parsedData.map((panel: any) => ({
          ...panel,
          freightName: panel.freightName || 'Freight',
          freight2Name: panel.freight2Name || 'Freight 2',
          rows: panel.rows.map((row: any) => ({
            ...row,
            freight2: row.freight2 ?? ''
          }))
        }));
        setPanels(upgradedData);
      } catch (e) {
        console.error("Failed to parse saved data", e);
        initializeDefault();
      }
    } else {
      initializeDefault();
    }

    // Load Theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }

    // Load Scale
    const savedScale = localStorage.getItem(SCALE_KEY);
    if (savedScale) {
      setUiScale(parseFloat(savedScale));
    }

    setLoaded(true);
  }, []);

  // Save to local storage whenever panels change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(panels));
    }
  }, [panels, loaded]);

  // Save Scale to local storage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(SCALE_KEY, uiScale.toString());
    }
  }, [uiScale, loaded]);

  // Handle Theme Changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  // Close scale menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (scaleMenuRef.current && !scaleMenuRef.current.contains(event.target as Node)) {
        setShowScaleMenu(false);
      }
    };

    if (showScaleMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showScaleMenu]);

  const toggleTheme = () => setIsDark(!isDark);

  const initializeDefault = () => {
    const defaultPanel: PanelData = {
      id: generateId(),
      name: 'General Rates',
      freightName: 'Freight',
      freight2Name: 'Freight 2',
      rows: [
        { id: generateId(), basicRate: 100, discount: 10, taxPercent: 5, commission: 2, freight: 5, freight2: 0 }
      ],
      commissionSettings: { rate1: 1.5, rate2: 12 }
    };
    setPanels([defaultPanel]);
  };

  const addPanel = () => {
    const newPanel: PanelData = {
      id: generateId(),
      name: `New Panel ${panels.length + 1}`,
      freightName: 'Freight',
      freight2Name: 'Freight 2',
      rows: [],
      commissionSettings: { rate1: 1.5, rate2: 12 }
    };
    setPanels([...panels, newPanel]);
  };

  const updatePanel = (id: string, updatedData: PanelData) => {
    setPanels(panels.map(p => p.id === id ? updatedData : p));
  };

  const deletePanel = (id: string) => {
    if (confirm('Are you sure you want to delete this entire panel?')) {
      setPanels(panels.filter(p => p.id !== id));
    }
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Resolution / Scale Settings Button */}
              <div className="relative" ref={scaleMenuRef}>
                <button 
                  onClick={() => setShowScaleMenu(!showScaleMenu)}
                  className="bg-indigo-600 p-2 rounded-lg text-white hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
                  title="Adjust UI Resolution"
                >
                  <Calculator size={24} />
                </button>
                
                {/* Scale Slider Dropdown */}
                {showScaleMenu && (
                  <div className="absolute top-full left-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-white text-sm">App Resolution</span>
                      </div>
                      <span className="text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded">
                        {Math.round(uiScale * 100)}%
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <input 
                        type="range" 
                        min="0.5" 
                        max="1.2" 
                        step="0.05"
                        value={uiScale}
                        onChange={(e) => setUiScale(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-2 px-0.5">
                        <span>Small (50%)</span>
                        <span>Normal (100%)</span>
                        <span>Large (120%)</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setUiScale(1)}
                      className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 py-2 rounded-lg transition-colors"
                    >
                      <RotateCcw size={12} />
                      Reset to Default
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 hidden sm:block">
                  RateCalculator Pro
                </h1>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 sm:hidden">
                  RCP
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                title="Toggle Theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={addPanel}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">New Panel</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-200 ease-out origin-top-center"
        style={{ zoom: uiScale }} 
      >
        
        {/* Info Banner */}
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3 text-sm text-blue-700 dark:text-blue-300 no-print">
          <Info className="shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold mb-1">Calculation Formula</p>
            <p className="font-mono text-xs opacity-90">
              Result = (Basic Rate - Discount) + Tax - Commission + Freight + Freight 2
            </p>
          </div>
        </div>

        {/* Panels Grid */}
        <div className="space-y-8">
          {panels.map((panel) => (
            <div key={panel.id} className="panel-container">
              <Panel
                panel={panel}
                onUpdatePanel={updatePanel}
                onDeletePanel={() => deletePanel(panel.id)}
              />
            </div>
          ))}

          {panels.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors">
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-full inline-block mb-4">
                <Calculator size={32} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No panels created</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">Get started by creating a new calculation panel to track your rates.</p>
              <button
                onClick={addPanel}
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 no-print"
              >
                Create your first panel &rarr;
              </button>
            </div>
          )}
        </div>
      </main>

      <GuideStickman />
    </div>
  );
};

export default App;