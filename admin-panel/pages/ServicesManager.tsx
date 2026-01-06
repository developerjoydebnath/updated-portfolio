import {
    IconBrandFigma,
    IconBrush,
    IconBulb,
    IconChartBar,
    IconChartLine,
    IconClipboardText,
    IconCloud,
    IconCode,
    IconColorSwatch,
    IconDatabase,
    IconDeviceDesktop,
    IconDeviceFloppy,
    IconDeviceMobile,
    IconEdit,
    IconFileText,
    IconHeadset,
    IconLayoutDashboard,
    IconLifebuoy,
    IconMail,
    IconPalette,
    IconPencil,
    IconPlus,
    IconRocket,
    IconSearch,
    IconServer,
    IconSettings,
    IconShoppingCart,
    IconSpeakerphone,
    IconTarget,
    IconTrash,
    IconTrendingUp,
    IconUsers,
    IconWorld,
    IconWriting,
    IconX
} from '@tabler/icons-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { addService, deleteService, updateService } from '../api';
import { AppState, ServiceItem } from '../types';

interface ServicesManagerProps {
  data: AppState;
  onUpdate: (newData: Partial<AppState>) => void;
}

// Service-relevant icons organized by category
const iconMap: any = {
  // Design Services
  IconBrandFigma,        // UI/UX Design
  IconPalette,           // Graphic Design
  IconBrush,             // Creative Design
  IconColorSwatch,       // Branding
  IconLayoutDashboard,   // Dashboard Design
  
  // Development Services
  IconCode,              // Frontend Development
  IconServer,            // Backend Development
  IconDatabase,          // Database Management
  IconDeviceDesktop,     // Web Development
  IconDeviceMobile,      // Mobile Development
  IconCloud,             // Cloud Services
  IconSettings,          // DevOps / Configuration
  
  // SEO & Analytics
  IconSearch,            // SEO
  IconChartBar,          // Analytics
  IconChartLine,         // Growth Analytics
  IconTrendingUp,        // Performance Optimization
  IconTarget,            // Target Marketing
  
  // Marketing & Content
  IconSpeakerphone,      // Marketing
  IconMail,              // Email Marketing
  IconWriting,           // Content Writing
  IconPencil,            // Copywriting
  IconFileText,          // Content Management
  IconClipboardText,     // Documentation
  
  // Business & Support
  IconShoppingCart,      // E-commerce
  IconUsers,             // Team Management
  IconBulb,              // Consulting / Ideas
  IconRocket,            // Launch / Startup
  IconHeadset,           // Support
  IconLifebuoy,          // Customer Support
  IconWorld,             // Global Services
};

const ServicesManager: React.FC<ServicesManagerProps> = ({ data, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    title: '',
    description: '',
    color: 'blue',
    icon: 'Layout'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Service title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    const promise = async () => {
      let newServices = [...data.services];
      if (editingService) {
        const updatedService = await updateService(editingService._id, formData);
        newServices = newServices.map(s => s._id === editingService._id ? updatedService : s);
      } else {
        const newService = await addService(formData);
        newServices.push(newService);
      }
      onUpdate({ services: newServices });
      setIsModalOpen(false);
    };

    toast.promise(promise(), {
      loading: 'Saving service...',
      success: 'Service saved successfully!',
      error: 'Failed to save service'
    });
  };

  const colors = ['blue', 'pink', 'green', 'yellow', 'purple', 'cyan'];
  const availableIcons = Object.keys(iconMap);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]';
      case 'pink': return 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]';
      case 'green': return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
      case 'yellow': return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
      case 'purple': return 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]';
      case 'cyan': return 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]';
      default: return 'bg-cyan-500';
    }
  };

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500/10 text-blue-400';
      case 'pink': return 'bg-pink-500/10 text-pink-400';
      case 'green': return 'bg-emerald-500/10 text-emerald-400';
      case 'yellow': return 'bg-amber-500/10 text-amber-400';
      case 'purple': return 'bg-purple-500/10 text-purple-400';
      case 'cyan': return 'bg-cyan-500/10 text-cyan-400';
      default: return 'bg-cyan-500/10 text-cyan-400';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Services</h1>
          <p className="text-gray-400">List and describe the professional services you offer.</p>
        </div>
        <button 
          onClick={() => {
            setEditingService(null);
            setFormData({ title: '', description: '', color: 'blue', icon: 'IconLayout' });
            setErrors({});
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
        >
          <IconPlus size={18} />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.services.map((service) => {
          const IconComponent = iconMap[service.icon || ''] || IconBulb;
          return (
            <div key={service._id} className="bg-[#0a0a1a] p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-all relative group overflow-hidden">
              <div className={`absolute top-0 left-0 w-1.5 h-full transition-all duration-300 ${getColorClasses(service.color)}`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getIconColorClasses(service.color)}`} title={service.icon}>
                  <IconComponent size={28} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => { setEditingService(service); setFormData(service); setErrors({}); setIsModalOpen(true); }}
                    className="p-2 bg-gray-800 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white"
                    title="Edit Service"
                  >
                    <IconEdit size={16} />
                  </button>
                  <button 
                    onClick={() => { 
                      if(window.confirm('Delete?')) {
                        toast.promise(deleteService(service._id), {
                          loading: 'Deleting service...',
                          success: () => {
                            onUpdate({ services: data.services.filter(s => s._id !== service._id) });
                            return 'Service deleted successfully!';
                          },
                          error: 'Failed to delete service'
                        });
                      }
                    }}
                    className="p-2 bg-gray-800 hover:bg-red-500/20 rounded-xl text-gray-400 hover:text-red-500"
                    title="Delete Service"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{service.description}</p>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0a0a1a] w-full max-w-xl rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingService ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><IconX size={24} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Service Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  className={`w-full bg-gray-900 border ${errors.title ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none`}
                  placeholder="e.g. Web Development"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Accent Color</label>
                <div className="flex flex-wrap gap-4">
                  {colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${
                        formData.color === color ? 'border-white scale-110' : 'border-transparent'
                      } ${
                        color === 'blue' ? 'bg-blue-500' : 
                        color === 'pink' ? 'bg-pink-500' :
                        color === 'green' ? 'bg-emerald-500' :
                        color === 'yellow' ? 'bg-amber-500' :
                        color === 'purple' ? 'bg-purple-500' : 'bg-cyan-500'
                      }`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Icon</label>
                <div className="grid grid-cols-6 gap-3">
                  {availableIcons.map(icon => {
                    const IconComp = iconMap[icon] || IconBulb;
                    const isSelected = formData.icon === icon;
                    return (
                      <button 
                        key={icon}
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center ${
                          isSelected 
                            ? `border-white ${getIconColorClasses(formData.color || 'cyan')}` 
                            : 'border-gray-800 text-gray-500 hover:border-gray-700'
                        }`}
                        title={icon}
                      >
                        <IconComp size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  className={`w-full bg-gray-900 border ${errors.description ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none resize-none`}
                  placeholder="What does this service include?"
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-400">Cancel</button>
              <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2">
                <IconDeviceFloppy size={18} />
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
