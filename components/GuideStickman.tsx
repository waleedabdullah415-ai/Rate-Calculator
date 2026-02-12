import React, { useState } from 'react';
import { X, FilePlus, Calculator, Printer, Copy, ArrowDown, CornerDownLeft, Info } from 'lucide-react';

export const GuideStickman: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Marching Stickman Trigger Container */}
      <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none z-40 overflow-hidden no-print">
        <div 
          className={`absolute bottom-4 pause-on-hover animate-march cursor-pointer pointer-events-auto transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          onClick={() => setIsOpen(true)}
          title="Click for Help"
        >
          {/* Bobbing Body Container */}
          <div className="animate-bob">
            {/* Unified SVG for Stickman + Flag */}
            <svg width="70" height="90" viewBox="0 0 100 120" className="drop-shadow-lg overflow-visible">
              
              {/* Flag Group - Animated Sway */}
              <g className="origin-[30px_70px] animate-wave-flag">
                  {/* Pole */}
                  <line x1="30" y1="70" x2="30" y2="5" className="stroke-slate-800 dark:stroke-slate-200 stroke-[3]" strokeLinecap="round" />
                  
                  {/* Flag Cloth */}
                  <path d="M 30 5 L 85 5 C 85 5 80 20 85 35 L 30 35 Z" className="fill-indigo-600 shadow-sm" />
                  <text x="36" y="24" className="fill-white text-[11px] font-bold tracking-wider font-sans select-none">GUIDE</text>
              </g>

              {/* Legs - Animated Walking */}
              {/* Left Leg (Background) */}
              <g className="origin-[60px_95px] animate-leg-delayed">
                <line x1="60" y1="95" x2="60" y2="120" className="stroke-slate-700 dark:stroke-slate-300 stroke-[3]" strokeLinecap="round" />
                {/* Foot */}
                <line x1="60" y1="120" x2="54" y2="120" className="stroke-slate-700 dark:stroke-slate-300 stroke-[3]" strokeLinecap="round" />
              </g>

              {/* Stickman Body - Static relative to bob */}
              {/* Torso */}
              <line x1="60" y1="75" x2="60" y2="95" className="stroke-slate-800 dark:stroke-slate-200 stroke-[3]" strokeLinecap="round" />

              {/* Right Leg (Foreground) */}
              <g className="origin-[60px_95px] animate-leg">
                <line x1="60" y1="95" x2="60" y2="120" className="stroke-slate-800 dark:stroke-slate-200 stroke-[3]" strokeLinecap="round" />
                {/* Foot */}
                <line x1="60" y1="120" x2="54" y2="120" className="stroke-slate-800 dark:stroke-slate-200 stroke-[3]" strokeLinecap="round" />
              </g>

              {/* Arm holding flag (Left side) */}
              <line x1="60" y1="80" x2="30" y2="70" className="stroke-slate-800 dark:stroke-slate-200 stroke-[3]" strokeLinecap="round" />

              {/* Head */}
              <circle cx="60" cy="65" r="10" className="fill-white dark:fill-slate-800 stroke-slate-800 dark:stroke-slate-200 stroke-[3]" />
              
              {/* Face Features */}
              <g className="fill-slate-800 dark:fill-slate-200">
                <circle cx="57" cy="63" r="1" />
                <circle cx="63" cy="63" r="1" />
              </g>
              <path d="M 57 68 Q 60 71 63 68" fill="none" className="stroke-slate-800 dark:stroke-slate-200 stroke-[2]" strokeLinecap="round" />
              
              {/* Waving Arm (Right side) */}
              <g className="origin-[60px_80px] animate-wave-arm">
                  <line x1="60" y1="80" x2="85" y2="65" className="stroke-slate-800 dark:stroke-slate-200 stroke-[3]" strokeLinecap="round" />
                  <circle cx="85" cy="65" r="3" className="fill-indigo-500" />
              </g>

            </svg>
          </div>
        </div>
      </div>

      {/* Help Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Info className="w-6 h-6" />
                How to use RateCalculator Pro
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* Introduction */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-indigo-900 dark:text-indigo-200 text-sm mb-6">
                This tool helps you calculate product costs including discounts, taxes, commissions, and freight. 
                Data is saved automatically to your browser.
              </div>

              {/* Core Features */}
              <div className="grid md:grid-cols-2 gap-4">
                <FeatureCard 
                  icon={<FilePlus className="text-blue-500" />}
                  title="Create Panels"
                  desc="Click 'New Panel' to create separate tables for different product categories."
                />
                <FeatureCard 
                  icon={<CornerDownLeft className="text-green-500" />}
                  title="Fast Entry"
                  desc="Press ENTER to jump to the next cell automatically. Supports rapid data entry."
                />
              </div>

              {/* Special Features */}
              <div className="space-y-4 pt-2">
                <h3 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                    Key Functionalities
                </h3>
                
                <ShortcutRow 
                  icon={<Calculator size={18} className="text-purple-500" />}
                  label="Commission Formula"
                  desc="Click the word 'Commission' in the header to set a global formula (e.g., 200 + 5%) for the column."
                />
                <ShortcutRow 
                  icon={<ArrowDown size={18} className="text-orange-500" />}
                  label="Auto-Fill Columns"
                  desc="Hover over 'Tax %' or 'Commission' headers and click the arrow icon to copy the first row's value to all empty cells below."
                />
                <ShortcutRow 
                  icon={<Printer size={18} className="text-slate-600 dark:text-slate-400" />}
                  label="Clean Print"
                  desc="Click the Printer icon on a panel to print just that table in a clean, Excel-like format."
                />
                <ShortcutRow 
                  icon={<Copy size={18} className="text-blue-400" />}
                  label="Export Data"
                  desc="Click the Copy icon to copy the entire table to your clipboard, ready to paste into Excel or Sheets."
                />
              </div>

              {/* Math Logic Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Calculation Logic</h4>
                <div className="font-mono text-xs bg-slate-100 dark:bg-slate-900 p-3 rounded text-slate-600 dark:text-slate-300 overflow-x-auto">
                    Result = (Basic Rate - Discount) + Tax - Commission + Freight
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 text-center">
                 <button 
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                 >
                    Got it, thanks!
                 </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="flex gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
    <div className="mt-1 shrink-0">{icon}</div>
    <div>
      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{desc}</p>
    </div>
  </div>
);

const ShortcutRow = ({ icon, label, desc }: any) => (
  <div className="flex items-start gap-4 py-2">
    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
        {icon}
    </div>
    <div>
        <span className="font-medium text-slate-800 dark:text-slate-200 text-sm block mb-0.5">{label}</span>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);