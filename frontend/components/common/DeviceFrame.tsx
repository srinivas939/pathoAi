import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { viewMode, setViewMode } = useAuth();

  if (viewMode === 'web') {
    return <div className="w-full flex-1">{children}</div>;
  }

  // Android Phone Frame Mode
  return (
    <div className="w-full py-6 px-2 flex flex-col items-center justify-center bg-slate-900/95 dark:bg-slate-950 min-h-[calc(100vh-4rem)]">
      
      {/* Target Notice Header */}
      <div className="mb-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-teal-950/80 border border-teal-700/50 px-3 py-1 rounded-full text-xs text-teal-300 font-medium">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Flutter Android Target Frame (375x812 Viewport)</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Testing native mobile responsive layout, touch targets & density.
        </p>
      </div>

      {/* Outer Phone Shell */}
      <div className="relative w-full max-w-[390px] h-[820px] bg-slate-800 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-600/50 flex flex-col overflow-hidden">
        
        {/* Hardware Notch / Camera Hole */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-28 h-5 bg-black rounded-full flex items-center justify-center space-x-2">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-700"></div>
          <div className="w-1.5 h-1.5 bg-blue-900/80 rounded-full"></div>
        </div>

        {/* Android Status Bar */}
        <div className="pt-2 px-6 pb-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-between text-[11px] font-semibold select-none z-40 rounded-t-[36px]">
          <span>09:41</span>
          <div className="flex items-center space-x-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Scrollable Mobile Viewport */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-b-[36px] relative scrollbar-thin">
          {children}
        </div>

        {/* Android Home Bar Indicator */}
        <div className="h-4 bg-white dark:bg-slate-900 flex items-center justify-center pt-1 pb-1">
          <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>

      {/* Switch back CTA */}
      <button
        onClick={() => setViewMode('web')}
        className="mt-4 text-xs text-slate-400 hover:text-white underline transition-colors"
      >
        Expand to full Flutter Web layout
      </button>

    </div>
  );
};
