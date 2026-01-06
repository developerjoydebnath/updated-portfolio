import { Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import {
    getContent,
    getExperience,
    getProjects,
    getQueries,
    getServices,
    getSkills,
    getTestimonials
} from './api';
import Sidebar from './components/Sidebar';
import { INITIAL_DATA } from './constants';
import ContentManager from './pages/ContentManager';
import Dashboard from './pages/Dashboard';
import ExperienceManager from './pages/ExperienceManager';
import Login from './pages/Login';
import ProjectsManager from './pages/ProjectsManager';
import QueriesManager from './pages/QueriesManager';
import ServicesManager from './pages/ServicesManager';
import SkillsManager from './pages/SkillsManager';
import TestimonialsManager from './pages/TestimonialsManager';
import { AppState } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<AppState>(INITIAL_DATA);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (token: string) => {
    localStorage.setItem('admin_token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        const [
          testimonials, 
          content, 
          experience, 
          projects, 
          queries, 
          services, 
          skills
        ] = await Promise.all([
          getTestimonials(),
          getContent(),
          getExperience(),
          getProjects(),
          getQueries(),
          getServices(),
          getSkills()
        ]);

        setData({
          hero: content.hero || INITIAL_DATA.hero,
          aboutMe: content.aboutMe || INITIAL_DATA.aboutMe,
          proficientIn: content.proficientIn || INITIAL_DATA.proficientIn,
          socialLinks: content.socialLinks || INITIAL_DATA.socialLinks,
          contact: content.contact || INITIAL_DATA.contact,
          stats: content.stats || INITIAL_DATA.stats,
          experience: experience || [],
          projects: projects || [],
          queries: queries || [],
          services: services || [],
          skills: skills || [],
          testimonials: testimonials || []
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const updateData = (newData: Partial<AppState>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-[#030712] text-gray-100 overflow-hidden relative">
        <Toaster position="top-right" richColors theme="dark" />
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a1a] border-b border-gray-800 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
              JD
            </div>
            <span className="font-bold text-sm tracking-wide">Admin CMS</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white transition-colors text-xs font-bold"
            >
              Logout
            </button>
            <button 
              onClick={toggleSidebar}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar Component */}
        <Sidebar 
          queriesCount={data.queries.filter(q => q.status === 'unread').length} 
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        
        <main className="flex-1 overflow-y-auto p-4 pt-20 md:pt-8 md:p-8 lg:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="hidden md:flex justify-end mb-6">
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:border-gray-700 transition-all"
              >
                Logout
              </button>
            </div>
            <Routes>
              <Route path="/" element={<Dashboard data={data} />} />
              <Route path="/content" element={<ContentManager data={data} onUpdate={updateData} />} />
              <Route path="/services" element={<ServicesManager data={data} onUpdate={updateData} />} />
              <Route path="/projects" element={<ProjectsManager data={data} onUpdate={updateData} />} />
              <Route path="/skills" element={<SkillsManager data={data} onUpdate={updateData} />} />
              <Route path="/experience" element={<ExperienceManager data={data} onUpdate={updateData} />} />
              <Route path="/testimonials" element={<TestimonialsManager data={data} onUpdate={updateData} />} />
              <Route path="/queries" element={<QueriesManager data={data} onUpdate={updateData} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
