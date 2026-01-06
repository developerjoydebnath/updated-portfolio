import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { updateContent } from '../api';
import CustomImageInput from '../components/CustomImageInput';
import { AppState, HeroContent, StatItem } from '../types';

interface ContentManagerProps {
  data: AppState;
  onUpdate: (newData: Partial<AppState>) => void;
}

const ContentManager: React.FC<ContentManagerProps> = ({ data, onUpdate }) => {
  const [hero, setHero] = useState<HeroContent>(data.hero);
  const [aboutMe, setAboutMe] = useState<string>(data.aboutMe);
  const [proficientIn, setProficientIn] = useState<string[]>(data.proficientIn);
  const [socialLinks, setSocialLinks] = useState(data.socialLinks);
  const [contact, setContact] = useState(data.contact);
  const [stats, setStats] = useState<StatItem[]>(data.stats);
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setHero(data.hero);
    setAboutMe(data.aboutMe);
    setProficientIn(data.proficientIn);
    setSocialLinks(data.socialLinks);
    setContact(data.contact);
    setStats(data.stats);
  }, [data]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!hero.name) newErrors.heroName = 'Full name is required';
    if (!hero.role) newErrors.heroRole = 'Role title is required';
    if (!hero.bio) newErrors.heroBio = 'Hero bio is required';
    if (!aboutMe) newErrors.aboutMe = 'About me bio is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const promise = async () => {
      const formData = new FormData();
      formData.append('hero', JSON.stringify(hero));
      formData.append('aboutMe', aboutMe);
      formData.append('proficientIn', JSON.stringify(proficientIn));
      formData.append('socialLinks', JSON.stringify(socialLinks));
      formData.append('contact', JSON.stringify(contact));
      formData.append('stats', JSON.stringify(stats));
      
      if (selectedProfileFile) {
        formData.append('profileImage', selectedProfileFile);
      }
      if (selectedResumeFile) {
        formData.append('resume', selectedResumeFile);
      }

      await updateContent(formData);
      onUpdate({ hero, aboutMe, proficientIn, socialLinks, contact, stats });
    };

    toast.promise(promise(), {
      loading: 'Saving content...',
      success: 'Content saved successfully!',
      error: 'Failed to save content'
    });
  };

  const updateStat = (id: string, value: string) => {
    setStats(prev => prev.map(s => s._id === id ? { ...s, value } : s));
  };

  const handleProficientInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setProficientIn(tags);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Main Content</h1>
          <p className="text-gray-400">Update hero section, about bio and quick statistics.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a0a1a] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">1</span>
              Hero Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Full Name</label>
                <input 
                  type="text" 
                  value={hero.name}
                  onChange={(e) => {
                    setHero({ ...hero, name: e.target.value });
                    if (errors.heroName) setErrors({ ...errors, heroName: '' });
                  }}
                  className={`w-full bg-gray-900/50 border ${errors.heroName ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all`}
                />
                {errors.heroName && <p className="text-xs text-red-500 mt-1">{errors.heroName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Role Title</label>
                <input 
                  type="text" 
                  value={hero.role}
                  onChange={(e) => {
                    setHero({ ...hero, role: e.target.value });
                    if (errors.heroRole) setErrors({ ...errors, heroRole: '' });
                  }}
                  className={`w-full bg-gray-900/50 border ${errors.heroRole ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all`}
                />
                {errors.heroRole && <p className="text-xs text-red-500 mt-1">{errors.heroRole}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Hero Bio</label>
              <textarea 
                rows={3}
                value={hero.bio}
                onChange={(e) => {
                  setHero({ ...hero, bio: e.target.value });
                  if (errors.heroBio) setErrors({ ...errors, heroBio: '' });
                }}
                className={`w-full bg-gray-900/50 border ${errors.heroBio ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all resize-none`}
              />
              {errors.heroBio && <p className="text-xs text-red-500 mt-1">{errors.heroBio}</p>}
            </div>
          </div>

          <div className="bg-[#0a0a1a] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">2</span>
              About Me Section
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Detailed About Me</label>
              <textarea 
                rows={6}
                value={aboutMe}
                onChange={(e) => {
                  setAboutMe(e.target.value);
                  if (errors.aboutMe) setErrors({ ...errors, aboutMe: '' });
                }}
                className={`w-full bg-gray-900/50 border ${errors.aboutMe ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all resize-none`}
              />
              {errors.aboutMe && <p className="text-xs text-red-500 mt-1">{errors.aboutMe}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Also Proficient In (comma separated)</label>
              <input 
                type="text" 
                value={proficientIn.join(', ')}
                onChange={handleProficientInChange}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all"
                placeholder="Redux, GraphQL, Docker..."
              />
            </div>
          </div>

          <div className="bg-[#0a0a1a] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">3</span>
              Social Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">GitHub URL</label>
                <input 
                  type="text" 
                  value={socialLinks.github}
                  onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">LinkedIn URL</label>
                <input 
                  type="text" 
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Twitter URL</label>
                <input 
                  type="text" 
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Facebook URL</label>
                <input 
                  type="text" 
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
          <div className="bg-[#0a0a1a] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">4</span>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="hello@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Phone Number</label>
                <input 
                  type="text" 
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="+880 123456789"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-400">Location</label>
                <input 
                  type="text" 
                  value={contact.location}
                  onChange={(e) => setContact({ ...contact, location: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0a0a1a] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">5</span>
              Identity & Files
            </h3>
            <CustomImageInput 
              label="Profile Photo" 
              value={hero.profileImage} 
              onChange={(img, file) => {
                setHero({ ...hero, profileImage: img });
                if (file) setSelectedProfileFile(file);
              }} 
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Upload CV (PDF)</label>
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setSelectedResumeFile(e.target.files?.[0] || null)}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all text-sm"
              />
              {hero.resumeUrl && (
                <p className="text-xs text-gray-500 truncate">Current: {hero.resumeUrl}</p>
              )}
            </div>
          </div>

          <div className="bg-[#0a0a1a] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">6</span>
              Floating Stats
            </h3>
            <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat._id} className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">{stat.label}</label>
                  <input 
                    type="text" 
                    value={stat.value}
                    onChange={(e) => updateStat(stat._id, e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
