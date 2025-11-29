import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarContent } from './SidebarContent';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const EnhancedDashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-midnight text-text-primary">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-midnight-light border-b border-charcoal px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-midnight-lighter transition-base rounded-none"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-xl font-zen">Dashboard</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex">
        {/* Desktop Sidebar - Always visible */}
        <aside className="hidden lg:flex fixed lg:static inset-y-0 left-0 z-40 w-72 bg-midnight-light border-r border-charcoal">
          <div className="h-full flex flex-col w-full">
            <SidebarContent />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-midnight-light border-r border-charcoal pt-20"
              >
                <div className="h-full flex flex-col">
                  <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
                </div>
              </motion.aside>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-30"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 pt-20 lg:pt-0 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
