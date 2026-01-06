import { Edit2, Plus, Save, Star, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { addTestimonial, deleteTestimonial, updateTestimonial } from '../api';
import CustomImageInput from '../components/CustomImageInput';
import { AppState, TestimonialItem } from '../types';

interface TestimonialsManagerProps {
  data: AppState;
  onUpdate: (newData: Partial<AppState>) => void;
}

const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({ data, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [formData, setFormData] = useState<Partial<TestimonialItem>>({
    name: '',
    role: '',
    company: '',
    content: '',
    avatar: '',
    rating: 5
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const openAddModal = () => {
    setEditingTestimonial(null);
    setFormData({ name: '', role: '', company: '', content: '', avatar: '', rating: 5 });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial: TestimonialItem) => {
    setEditingTestimonial(testimonial);
    setFormData(testimonial);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.content) return alert('Name and content are required');

    try {
      const dataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'avatar' && key !== '_id') {
          dataToSend.append(key, (formData as any)[key]);
        }
      });

      // Append file if selected
      if (selectedFile) {
        dataToSend.append('avatar', selectedFile);
      }

      let savedTestimonial;
      if (editingTestimonial) {
        savedTestimonial = await updateTestimonial(editingTestimonial._id, dataToSend);
        const newList = data.testimonials.map(t => t._id === editingTestimonial._id ? savedTestimonial : t);
        onUpdate({ testimonials: newList });
      } else {
        savedTestimonial = await addTestimonial(dataToSend);
        const newList = [...(data.testimonials || []), savedTestimonial];
        onUpdate({ testimonials: newList });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await deleteTestimonial(id);
        onUpdate({ testimonials: data.testimonials.filter(t => t._id !== id) });
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        alert('Failed to delete testimonial');
      }
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Testimonials</h1>
          <p className="text-gray-400">Manage feedback from your happy clients to build social proof.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus size={18} />
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data.testimonials || []).map((t) => (
          <div key={t._id} className="bg-[#0a0a1a] p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img src={t.avatar ? import.meta.env.VITE_API_URL + t.avatar : `https://ui-avatars.com/api/?name=${t.name}&background=random`} alt={t.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/20" />
                <div>
                  <h3 className="font-bold text-white">{t.name}</h3>
                  <p className="text-xs text-cyan-400 font-medium">{t.role} {t.company ? `@ ${t.company}` : ''}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => openEditModal(t)} className="p-2 text-gray-500 hover:text-white"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(t._id)} className="p-2 text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < t.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'} />
              ))}
            </div>

            <p className="text-gray-400 text-sm italic leading-relaxed flex-grow">"{t.content}"</p>
          </div>
        ))}
        {data.testimonials?.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-gray-800 rounded-3xl">
            No testimonials added yet. Click "Add Testimonial" to get started.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0a0a1a] w-full max-w-xl rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Client Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Role / Designation</label>
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g. CEO"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g. Innovate AI"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Rating (Stars)</label>
                  <div className="flex gap-2 items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-transform active:scale-90"
                      >
                        <Star size={20} className={star <= (formData.rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <CustomImageInput 
                label="Client Avatar" 
                value={formData.avatar || ''} 
                onChange={(img, file) => {
                  setFormData({ ...formData, avatar: img });
                  if (file) setSelectedFile(file);
                }} 
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Testimonial Content</label>
                <textarea 
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none resize-none"
                  placeholder="What did they say about your work?"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2">
                <Save size={18} />
                {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
