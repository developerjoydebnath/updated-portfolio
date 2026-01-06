import { Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { addProject, deleteProject, updateProject } from '../api';
import CustomImageInput from '../components/CustomImageInput';
import { AppState, ProjectItem } from '../types';

interface ProjectsManagerProps {
  data: AppState;
  onUpdate: (newData: Partial<AppState>) => void;
}

const ProjectsManager: React.FC<ProjectsManagerProps> = ({ data, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectItem>>({
    title: '',
    description: '',
    image: '',
    techStack: [],
    category: 'Full Stack'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedScreenshots, setSelectedScreenshots] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Project title is required';
    if (!formData.image && !selectedFile) newErrors.image = 'Project thumbnail is required';
    if (!formData.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', image: '', techStack: [], category: 'Full Stack', liveUrl: '', githubUrl: '', screenshots: [] });
    setSelectedFile(null);
    setSelectedScreenshots([]);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (project: ProjectItem) => {
    setEditingProject(project);
    setFormData(project);
    setSelectedFile(null);
    setSelectedScreenshots([]);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!validate()) return;

    const promise = async () => {
      const dataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && key !== 'screenshots' && key !== '_id') {
          const value = (formData as any)[key];
          if (key === 'techStack') {
            dataToSend.append(key, JSON.stringify(value));
          } else {
            dataToSend.append(key, value || '');
          }
        }
      });

      // Append existing screenshots as a JSON string
      dataToSend.append('existingScreenshots', JSON.stringify(formData.screenshots || []));

      // Append main image if selected
      if (selectedFile) {
        dataToSend.append('image', selectedFile);
      }

      // Append new screenshots
      selectedScreenshots.forEach(file => {
        dataToSend.append('screenshots', file);
      });

      let newProjects = [...data.projects];
      
      if (editingProject) {
        const updatedProject = await updateProject(editingProject._id, dataToSend);
        newProjects = newProjects.map(p => p._id === editingProject._id ? updatedProject : p);
      } else {
        const newProject = await addProject(dataToSend);
        newProjects.push(newProject);
      }

      onUpdate({ projects: newProjects });
      setIsModalOpen(false);
    };

    toast.promise(promise(), {
      loading: 'Saving project...',
      success: 'Project saved successfully!',
      error: 'Failed to save project'
    });
  };

  const removeScreenshot = (index: number, isExisting: boolean) => {
    if (isExisting) {
      const newScreenshots = [...(formData.screenshots || [])];
      newScreenshots.splice(index, 1);
      setFormData({ ...formData, screenshots: newScreenshots });
    } else {
      const newScreenshots = [...selectedScreenshots];
      newScreenshots.splice(index, 1);
      setSelectedScreenshots(newScreenshots);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this project?')) {
      toast.promise(deleteProject(id), {
        loading: 'Deleting project...',
        success: () => {
          onUpdate({ projects: data.projects.filter(p => p._id !== id) });
          return 'Project deleted successfully!';
        },
        error: 'Failed to delete project'
      });
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio Projects</h1>
          <p className="text-gray-400">Showcase your best work with high-quality images and tech specs.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.projects.map((project) => (
          <div key={project._id} className="bg-[#0a0a1a] rounded-2xl border border-gray-800 overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img src={project.image.startsWith('http') ? project.image : import.meta.env.VITE_API_URL + project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  onClick={() => openEditModal(project)}
                  className="p-2 bg-white/10 hover:bg-cyan-500 rounded-lg text-white transition-all backdrop-blur-md"
                  title="Edit Project"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(project._id)}
                  className="p-2 bg-white/10 hover:bg-red-500 rounded-lg text-white transition-all backdrop-blur-md"
                  title="Delete Project"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-lg">{project.title}</h3>
                <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">
                  {project.category}
                </span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="text-[10px] text-gray-500 font-medium bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0a0a1a] w-full max-w-2xl rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h2 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Project Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: '' });
                    }}
                    className={`w-full bg-gray-900 border ${errors.title ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none`}
                    placeholder="Enter project name"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="UI/UX">UI/UX</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  className={`w-full bg-gray-900 border ${errors.description ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none resize-none`}
                  placeholder="What is this project about?"
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Live URL</label>
                  <input 
                    type="text" 
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">GitHub URL</label>
                  <input 
                    type="text" 
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <CustomImageInput 
                  label="Project Thumbnail" 
                  value={formData.image || ''} 
                  onChange={(base64, file) => {
                    setFormData({ ...formData, image: base64 });
                    if (file) setSelectedFile(file);
                    if (errors.image) setErrors({ ...errors, image: '' });
                  }} 
                />
                {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-400 block">Project Screenshots (Multiple)</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {/* Existing Screenshots */}
                  {formData.screenshots?.map((url, index) => (
                    <div key={`existing-${index}`} className="relative aspect-video rounded-lg border border-gray-800 overflow-hidden group">
                      <img src={url.startsWith('http') ? url : import.meta.env.VITE_API_URL + url} className="w-full h-full object-cover" alt="" />
                      <button 
                        onClick={() => removeScreenshot(index, true)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {/* New Screenshots Preview */}
                  {selectedScreenshots.map((file, index) => (
                    <div key={`new-${index}`} className="relative aspect-video rounded-lg border border-cyan-500/50 overflow-hidden group">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                      <button 
                        onClick={() => removeScreenshot(index, false)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {/* Add Button */}
                  <label className="aspect-video rounded-lg border-2 border-dashed border-gray-800 hover:border-cyan-500/50 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-cyan-500/5">
                    <Plus size={20} className="text-gray-500" />
                    <span className="text-[10px] text-gray-500 mt-1">Add</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files) {
                          setSelectedScreenshots([...selectedScreenshots, ...Array.from(e.target.files)]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Tech Stack (Comma separated)</label>
                <input 
                  type="text" 
                  value={formData.techStack?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none"
                  placeholder="React, Next.js, Tailwind..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2">
                <Save size={18} />
                {editingProject ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
