
import { AppState } from './types';

export const INITIAL_DATA: AppState = {
  hero: {
    name: "Joy Debnath",
    role: "Full Stack Developer",
    bio: "I'm a passionate web developer with expertise in crafting beautiful, functional, and user-friendly digital experiences. Let's build something amazing together!",
    profileImage: "https://picsum.photos/400/400",
    resumeUrl: "#"
  },
  aboutMe: "I'm a passionate Full Stack Developer with over 3 years of experience in creating stunning and functional web applications. I specialize in React, TypeScript, Node.js, and modern web technologies, delivering high-quality solutions that exceed client expectations.",
  proficientIn: ['Redux', 'GraphQL', 'Jest', 'Webpack', 'Prisma', 'AWS', 'Vercel', 'CI/CD'],
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com"
  },
  contact: {
    email: "hello@example.com",
    phone: "+880 123456789",
    location: "Dhaka, Bangladesh"
  },
  stats: [
    { _id: '1', label: 'Projects Completed', value: '50+', icon: 'Code' },
    { _id: '2', label: 'Happy Clients', value: '30+', icon: 'Users' },
    { _id: '3', label: 'Average Rating', value: '5.0', icon: 'Star' },
    { _id: '4', label: 'Years Experience', value: '3+', icon: 'Zap' }
  ],
  services: [
    { _id: '1', title: 'Web Development', description: 'Building responsive and performant web applications using modern technologies.', icon: 'Layout', color: 'blue' },
    { _id: '2', title: 'UI/UX Design', description: 'Creating beautiful, intuitive user interfaces with focus on user experience.', icon: 'Figma', color: 'pink' }
  ],
  skills: [
    { _id: '1', name: 'React', percentage: 95, category: 'Frontend' },
    { _id: '2', name: 'TypeScript', percentage: 90, category: 'Frontend' },
    { _id: '3', name: 'Node.js', percentage: 85, category: 'Backend' },
    { _id: '4', name: 'PostgreSQL', percentage: 78, category: 'Database' }
  ],
  experience: [
    {
      _id: '1',
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      duration: '2023 - Present',
      points: ['Leading frontend team', 'Architecting scalable React apps'],
      type: 'experience'
    }
  ],
  projects: [
    {
      _id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-featured online shopping platform with cart and checkout.',
      image: 'https://picsum.photos/600/400',
      techStack: ['React', 'TypeScript', 'Tailwind CSS'],
      category: 'Full Stack',
      liveUrl: '#',
      githubUrl: '#',
      screenshots: []
    }
  ],
  testimonials: [
    {
      _id: '1',
      name: "Sarah Jenkins",
      role: "CEO",
      company: "Innovate AI",
      content: "Joy delivered a top-tier dashboard for our product. The attention to detail in the UI was exceptional and the performance is blazing fast.",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      rating: 5
    }
  ],
  queries: [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'New Project Inquiry',
      message: 'Hello Joy, I would like to discuss a new web project with you.',
      status: 'unread',
      createdAt: new Date().toISOString()
    }
  ]
};
