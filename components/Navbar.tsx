
import React from 'react';
import { AppTab, UserRole } from '../types';
import { Home, Map as MapIcon, Calendar, User, MessageSquare, Wallet } from 'lucide-react';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  userRole: UserRole;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, userRole }) => {
  const isInstructor = userRole === 'instructor';

  const tabs = [
    { id: AppTab.FEED, icon: Home, label: 'Início' },
    ...(!isInstructor ? [{ id: AppTab.MAP, icon: MapIcon, label: 'Mapa' }] : [{ id: AppTab.WALLET, icon: Wallet, label: 'Carteira' }]),
    { id: AppTab.CHAT_LIST, icon: MessageSquare, label: 'Conversas' },
    { id: AppTab.SCHEDULES, icon: Calendar, label: 'Agenda' },
    { id: AppTab.PROFILE, icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 px-4 py-2 flex justify-between items-center z-50 transition-colors duration-500">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id || 
                        (tab.id === AppTab.CHAT_LIST && activeTab === AppTab.CHAT);
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 min-w-[64px] ${
              isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navbar;