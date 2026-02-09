import { MotionConfig } from 'motion/react';
import { useEffect, useState } from 'react';
import {
  getContent,
  getExperience,
  getProjects,
  getServices,
  getSkills,
  getTestimonials,
  recordVisit
} from '../api';
import About from './components/About';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import Projects from './components/Projects';
import Services from './components/Services';
import Skills from './components/Skills';
import Testimonials from './components/Testimonials';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [heroData, setHeroData] = useState<any>(null);
  const [aboutMeData, setAboutMeData] = useState<string>('');
  const [proficientInData, setProficientInData] = useState<string[]>([]);
  const [socialLinksData, setSocialLinksData] = useState<any>(null);
  const [contactData, setContactData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [experienceData, setExperienceData] = useState<any[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const timerPromise = new Promise(resolve => setTimeout(resolve, 1500));
      const [content, services, skills, exp, projects, testimonials] = await Promise.all([
        getContent(),
        getServices(),
        getSkills(),
        getExperience(),
        getProjects(),
        getTestimonials()
      ]);

      if (content) {
        setHeroData(content.hero);
        setAboutMeData(content.aboutMe);
        setProficientInData(content.proficientIn);
        setSocialLinksData(content.socialLinks);
        setContactData(content.contact);
        setStatsData(content.stats);
      }
      setServicesData(services);
      setSkillsData(skills);
      setExperienceData(exp);
      setProjectsData(projects);
      setTestimonialsData(testimonials);
      await timerPromise;
      setLoading(false);
    };
    fetchData();

    recordVisit(window.location.pathname);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: '-20% 0px -20% 0px' // Offset to trigger closer to center
      }
    );

    const sections = ['home', 'about', 'services', 'skills', 'experience', 'projects', 'testimonials', 'contact'];
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-50">
        <div className="relative flex items-center justify-center">
          <div className="absolute animate-ping h-32 w-32 rounded-full bg-cyan-500/50 opacity-75"></div>
          <div className="absolute animate-pulse h-32 w-32 rounded-full bg-cyan-500/30"></div>
          <img
            src="/loader-image.png"
            alt="Loading..."
            className="relative h-28 w-28 rounded-full object-cover border-4 border-slate-900 shadow-2xl shadow-cyan-500/20"
          />
        </div>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion={isMobile ? "always" : "user"}>
      <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
        {/* Grid Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage: `
              linear-gradient(to right, rgba(34, 211, 238, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(34, 211, 238, 0.15) 1px, transparent 1px)
            `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Animated Gradient Blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-[120px] animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-blob animation-delay-4000" />
        </div>

        {/* Navigation */}
        <Navigation activeSection={activeSection} />

        {/* Content */}
        <main className="relative">
          <section id="home">
            <Hero data={heroData} socialLinks={socialLinksData} />
          </section>
          <section id="about">
            <About stats={statsData} hero={heroData} aboutMe={aboutMeData} contact={contactData} />
          </section>
          <section id="services">
            <Services data={servicesData} />
          </section>
          <section id="skills">
            <Skills data={skillsData} proficientIn={proficientInData} />
          </section>
          <section id="experience">
            <Experience data={experienceData} />
          </section>
          <section id="projects">
            <Projects data={projectsData} />
          </section>
          <section id="testimonials">
            <Testimonials data={testimonialsData} />
          </section>
          <section id="contact">
            <Contact socialLinks={socialLinksData} contact={contactData} />
          </section>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 py-8 backdrop-blur-sm bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-2 justify-between items-center text-center text-gray-400">
            <p>© {new Date().getFullYear()} Joy Debnath. All rights reserved.</p>
            <p>Designed with <span className="text-red-500">❤️</span> by JOY</p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}