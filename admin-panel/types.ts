
export interface HeroContent {
  name: string;
  role: string;
  bio: string;
  profileImage: string;
  resumeUrl: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  facebook: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface StatItem {
  _id: string;
  label: string;
  value: string;
  icon: string;
}

export interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface SkillItem {
  _id: string;
  name: string;
  percentage: number;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Styling';
  icon?: string;
}

export interface ExperienceItem {
  _id: string;
  title: string;
  company: string;
  duration: string;
  points: string[];
  type: 'experience' | 'education';
}

export interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  category: 'Full Stack' | 'Frontend' | 'UI/UX';
  liveUrl: string;
  githubUrl: string;
  screenshots: string[];
}

export interface TestimonialItem {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface ClientQuery {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export type AppState = {
  hero: HeroContent;
  aboutMe: string;
  proficientIn: string[];
  socialLinks: SocialLinks;
  contact: ContactInfo;
  stats: StatItem[];
  services: ServiceItem[];
  skills: SkillItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  queries: ClientQuery[];
};
