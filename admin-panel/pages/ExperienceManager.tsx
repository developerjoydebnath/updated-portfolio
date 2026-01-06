import { Briefcase, Edit2, GraduationCap, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { addExperience, deleteExperience, updateExperience } from '../api';
import { AppState, ExperienceItem } from '../types';

interface ExperienceManagerProps {
  data: AppState;
  onUpdate: (newData: Partial<AppState>) => void;
}

const ExperienceManager: React.FC<ExperienceManagerProps> = ({ data, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [formData, setFormData] = useState<Partial<ExperienceItem>>({
    title: '',
    company: '',
    duration: '',
    points: [''],
    type: 'experience'
  });

  const handleSave = async () => {
    if (!formData.title || !formData.company) return alert('Title and company are required');
    
    try {
      const cleanedPoints = formData.points?.filter(p => p.trim() !== '') || [];
      const payload = { ...formData, points: cleanedPoints };

      let updatedItem: ExperienceItem;
      let newList = [...data.experience];

      if (editingItem) {
        updatedItem = await updateExperience(editingItem._id, payload);
        newList = newList.map(item => item._id === editingItem._id ? updatedItem : item);
      } else {
        updatedItem = await addExperience(payload);
        newList.push(updatedItem);
      }

      onUpdate({ experience: newList });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save experience:', error);
      alert('Failed to save item');
    }
  };

  const handlePointChange = (index: number, val: string) => {
    const newPoints = [...(formData.points || [])];
    newPoints[index] = val;
    setFormData({ ...formData, points: newPoints });
  };

  const addPoint = () => setFormData({ ...formData, points: [...(formData.points || []), ''] });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Experience & Education</h1>
          <p className="text-gray-400">Track your career journey and educational background.</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setFormData({ title: '', company: '', duration: '', points: [''], type: 'experience' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className="space-y-12">
        {['experience', 'education'].map((type) => {
          const items = data.experience.filter(i => i.type === type);
          return (
            <div key={type} className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3 text-cyan-400 uppercase tracking-widest">
                <span className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  {type === 'experience' ? <Briefcase size={20} /> : <GraduationCap size={20} />}
                </span>
                {type}
              </h2>
              <div className="relative pl-8 border-l border-gray-800 space-y-8 ml-5">
                {items.length > 0 ? items.map((item) => (
                  <div key={item._id} className="relative group">
                    <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-gray-900 border-4 border-[#030712] flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    </div>
                    <div className="bg-[#0a0a1a] p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-white text-lg">{item.title}</h4>
                          <p className="text-cyan-400 text-sm font-medium">{item.company}</p>
                          <span className="text-xs text-gray-500 font-bold block mt-1">{item.duration}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-cyan-400"><Edit2 size={16} /></button>
                          <button onClick={async () => { 
                            if(window.confirm('Delete?')) {
                              try {
                                await deleteExperience(item._id);
                                onUpdate({ experience: data.experience.filter(i => i._id !== item._id) }); 
                              } catch (error) {
                                console.error('Failed to delete:', error);
                                alert('Failed to delete item');
                              }
                            }
                          }} className="p-2 text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {item.points.map((p, i) => (
                          <li key={i} className="text-sm text-gray-400 flex gap-2">
                            <span className="text-cyan-500 font-bold">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 italic py-4">No {type} items added yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0a0a1a] w-full max-w-2xl rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'New Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Institution / Company</label>
                  <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Duration</label>
                  <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none" placeholder="e.g. 2021 - Present" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none">
                    <option value="experience">Experience</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400">Description Points</label>
                {formData.points?.map((point, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input type="text" value={point} onChange={(e) => handlePointChange(idx, e.target.value)} className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none" placeholder="Key achievement or focus area" />
                    <button onClick={() => setFormData({ ...formData, points: formData.points?.filter((_, i) => i !== idx) })} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                ))}
                <button onClick={addPoint} className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest px-4 py-2 hover:bg-cyan-500/10 rounded-lg transition-all"><Plus size={14} /> Add Point</button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-400">Cancel</button>
              <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2">
                <Save size={18} />
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceManager;
