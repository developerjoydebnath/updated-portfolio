
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileEdit, 
  Briefcase, 
  Code2, 
  Layers, 
  MessageSquare, 
  GraduationCap,
  Sparkles,
  Quote,
  X
} from 'lucide-react';

interface SidebarProps {
  queriesCount: number;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ queriesCount, isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/content', icon: <FileEdit size={20} />, label: 'Main Content' },
    { path: '/services', icon: <Layers size={20} />, label: 'Services' },
    { path: '/skills', icon: <Code2 size={20} />, label: 'Technical Skills' },
    { path: '/projects', icon: <Briefcase size={20} />, label: 'Projects' },
    { path: '/experience', icon: <GraduationCap size={20} />, label: 'Exp & Edu' },
    { path: '/testimonials', icon: <Quote size={20} />, label: 'Testimonials' },
    { path: '/queries', icon: <MessageSquare size={20} />, label: 'Client Queries', count: queriesCount },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a1a] border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out
    md:relative md:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <div className={sidebarClasses}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">
              JD
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Admin CMS</h1>
              <p className="text-xs text-cyan-400 font-medium tracking-wider uppercase">Portfolio Manager</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose} // Close sidebar on mobile when link is clicked
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-cyan-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-800">
        <button className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors w-full px-4 py-2 text-sm font-medium">
          <Sparkles size={18} />
          AI Content Assistant
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
