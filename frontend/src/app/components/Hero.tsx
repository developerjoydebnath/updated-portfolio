import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconChevronDown
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import GradientButton from './GradientButton';

interface HeroProps {
  data: {
    name: string;
    role: string;
    bio: string;
    profileImage?: string;
  } | null;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export default function Hero({ data, socialLinks }: HeroProps) {
  if (!data) return null;

  const socialLinksList = [
    { icon: IconBrandGithub, href: socialLinks?.github || '#', label: 'GitHub', color: 'hover:text-white' },
    { icon: IconBrandLinkedin, href: socialLinks?.linkedin || '#', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: IconBrandTwitter, href: socialLinks?.twitter || '#', label: 'Twitter', color: 'hover:text-cyan-400' },
    { icon: IconBrandFacebook, href: socialLinks?.facebook || '#', label: 'WhatsApp', color: 'hover:text-emerald-400' },
  ];

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6 px-4 sm:px-6 py-1 sm:py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full"
          >
            <span className="text-emerald-400 text-sm sm:text-base">Welcome to my portfolio</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <span className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {data.name}
              </span>
            </span>
          </motion.h1>

          {/* Title with typing effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 sm:mb-8 text-xl sm:text-2xl md:text-3xl text-gray-300"
          >
            <span className="font-mono">
              <span className="text-emerald-400">{'<'}</span>
              {data.role}
              <span className="text-emerald-400">{' />'}</span>
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="max-w-3xl mx-auto mb-6 sm:mb-12 text-gray-400 text-base sm:text-lg px-4"
          >
            {data.bio}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-16"
          >
            <GradientButton
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-auto sm:px-8 px-6 sm:py-4 text-sm sm:text-base py-3 rounded-full cursor-pointer"
            >
              View My Work
            </GradientButton>
            <GradientButton
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              variant="secondary"
              className="w-auto sm:px-8 px-6 sm:py-4 text-sm sm:text-base py-3 rounded-full cursor-pointer"
            >
              Get In Touch
            </GradientButton>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center gap-6 mb-16"
          >
            {socialLinksList.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className={`text-gray-400 transition-colors ${social.color}`}
                aria-label={social.label}
                target="_blank"
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToAbout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 cursor-pointer -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <IconChevronDown size={32} />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}