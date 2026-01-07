import {
  IconBrandGithub,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconX
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import GradientBorderCard from './GradientBorderCard';
import GradientButton from './GradientButton';

interface ProjectsProps {
  data: {
    _id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    techStack?: string[];
    liveUrl?: string;
    githubUrl?: string;
    screenshots?: string[];
  }[];
}

export default function Projects({ data }: ProjectsProps) {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const displayProjects = data.length > 0 ? data.map(p => ({
    ...p,
    image: p.image.startsWith('http') ? p.image : import.meta.env.VITE_API_URL + p.image,
    category: p.category.toLowerCase().replace(' ', ''),
    tags: p.techStack || [],
    github: p.githubUrl || '#',
    live: p.liveUrl || '#',
  })) : [
    {
      _id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-featured online shopping platform with cart, checkout, and payment integration.',
      image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&q=80',
      category: 'frontend',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Stripe'],
      github: '#',
      live: '#',
      screenshots: []
    },
    // ... other placeholders
  ];

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'ui/ux', label: 'UI/UX' },
  ];

  const filteredProjects = filter === 'all' 
    ? displayProjects 
    : displayProjects.filter(project => project.category === filter);

  const nextScreenshot = () => {
    if (!selectedProject?.screenshots) return;
    setCurrentScreenshot((prev) => (prev + 1) % selectedProject.screenshots.length);
  };

  const prevScreenshot = () => {
    if (!selectedProject?.screenshots) return;
    setCurrentScreenshot((prev) => (prev - 1 + selectedProject.screenshots.length) % selectedProject.screenshots.length);
  };

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center md:mb-16 sm:mb-12 mb-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-emerald-400">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all cursor-pointer ${
                filter === category.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              layout
              className="flex"
            >
              <GradientBorderCard className="flex flex-col w-full group">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden shrink-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/80 text-black rounded-full hover:bg-white transition-colors"
                      aria-label="View GitHub"
                    >
                      <IconBrandGithub size={20} />
                    </motion.a>
                    <motion.a
                      href={project.live}
                      target="_blank"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-emerald-500 rounded-full hover:bg-emerald-600 transition-colors"
                      aria-label="View Live"
                    >
                      <IconExternalLink size={20} />
                    </motion.a>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-4 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag: string, index: number) => (
                      <span
                        key={tag + index}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <GradientButton 
                      variant="secondary" 
                      className="w-full py-3 cursor-pointer rounded-xl text-sm"
                      onClick={() => {
                        setSelectedProject(project);
                        setCurrentScreenshot(0);
                      }}
                    >
                      View Details
                    </GradientButton>
                  </div>
                </div>
              </GradientBorderCard>
            </motion.div>
          ))}
        </div>

        {/* Project Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                onClick={() => setSelectedProject(null)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-slate-900 w-full max-w-4xl rounded-2xl sm:rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 p-1.5 sm:p-2 bg-slate-800/50 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                >
                  <IconX size={20} className="sm:hidden" />
                  <IconX size={24} className="hidden sm:block" />
                </button>

                <div className="overflow-y-auto custom-scrollbar">
                  {/* Screenshot Carousel */}
                  <div className="relative aspect-video bg-black/40 group/carousel">
                    {selectedProject.screenshots && selectedProject.screenshots.length > 0 ? (
                      <>
                        <motion.img 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={selectedProject.screenshots[currentScreenshot].startsWith('http') 
                            ? selectedProject.screenshots[currentScreenshot] 
                            : import.meta.env.VITE_API_URL + selectedProject.screenshots[currentScreenshot]} 
                          alt={`Screenshot ${currentScreenshot + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Carousel Controls */}
                        {selectedProject.screenshots.length > 1 && (
                          <>
                            <button 
                              onClick={prevScreenshot}
                              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                            >
                              <IconChevronLeft size={18} className="sm:hidden" />
                              <IconChevronLeft size={24} className="hidden sm:block" />
                            </button>
                            <button 
                              onClick={nextScreenshot}
                              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                            >
                              <IconChevronRight size={18} className="sm:hidden" />
                              <IconChevronRight size={24} className="hidden sm:block" />
                            </button>
                            
                            {/* Indicators */}
                            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                              {selectedProject.screenshots.map((_: any, i: number) => (
                                <button 
                                  key={i}
                                  onClick={() => setCurrentScreenshot(i)}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    currentScreenshot === i ? 'bg-white w-5 sm:w-6' : 'bg-white/40 hover:bg-white/60'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <img 
                        src={selectedProject.image} 
                        alt={selectedProject.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-4 flex-1">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            {selectedProject.category}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">{selectedProject.title}</h2>
                        <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{selectedProject.description}</p>
                      </div>

                      <div className="flex gap-2 sm:gap-3">
                        <a 
                          href={selectedProject.github} 
                          target="_blank" 
                          className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all group"
                        >
                          <IconBrandGithub size={16} className="sm:hidden text-gray-400 group-hover:text-white" />
                          <IconBrandGithub size={20} className="hidden sm:block text-gray-400 group-hover:text-white" />
                          <span className="font-bold text-xs sm:text-sm">Code</span>
                        </a>
                        <a 
                          href={selectedProject.live} 
                          target="_blank" 
                          className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-emerald-500 text-white rounded-xl sm:rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <IconExternalLink size={16} className="sm:hidden" />
                          <IconExternalLink size={20} className="hidden sm:block" />
                          <span className="font-bold text-xs sm:text-sm">Live Demo</span>
                        </a>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                        <div className="w-1 h-4 sm:w-1.5 sm:h-6 bg-emerald-400 rounded-full" />
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                        {selectedProject.tags.map((tag: string, index: number) => (
                          <div 
                            key={tag + index} 
                            className="px-2.5 py-1 sm:px-4 sm:py-2 bg-slate-800/50 border border-white/5 rounded-lg sm:rounded-xl text-gray-300 text-xs sm:text-sm font-medium hover:border-emerald-500/30 transition-colors"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}