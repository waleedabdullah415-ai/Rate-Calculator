import React, { useEffect, useState } from 'react';
import { Plus, Calculator, Info, Moon, Sun } from 'lucide-react';
import { Panel } from './components/Panel';
import { GuideStickman } from './components/GuideStickman';
import { PanelData } from './types';
import { generateId } from './utils/calculation';

const STORAGE_KEY = 'rate-calc-pro-v1';
const THEME_KEY = 'rate-calc-theme';

const App: React.FC = () => {
  const [panels, setPanels] = useState<PanelData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    // Load Data
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setPanels(JSON.parse(savedData));
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

    setLoaded(true);
  }, []);

  // Save to local storage whenever panels change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(panels));
    }
  }, [panels, loaded]);

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

  const toggleTheme = () => setIsDark(!isDark);

  const initializeDefault = () => {
    const defaultPanel: PanelData = {
      id: generateId(),
      name: 'General Rates',
      rows: [
        { id: generateId(), basicRate: 100, discount: 10, taxPercent: 5, commission: 2, freight: 5 }
      ]
    };
    setPanels([defaultPanel]);
  };

  const addPanel = () => {
    const newPanel: PanelData = {
      id: generateId(),
      name: `New Panel ${panels.length + 1}`,
      rows: []
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
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Calculator size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  RateCalculator Pro
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
                New Panel
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Info Banner */}
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3 text-sm text-blue-700 dark:text-blue-300 no-print">
          <Info className="shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold mb-1">Calculation Formula</p>
            <p className="font-mono text-xs opacity-90">
              Result = (Basic Rate - Discount) + Tax - Commission + Freight
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