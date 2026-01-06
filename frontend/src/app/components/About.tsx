import {
  IconAward,
  IconBolt,
  IconCode,
  IconDownload,
  IconRocket,
  IconStar,
  IconUsers
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import GradientBorderCard from './GradientBorderCard';
import GradientButton from './GradientButton';

interface AboutProps {
  stats: {
    _id: string;
    icon: string;
    value: string;
    label: string;
  }[];
  hero: {
    name: string;
    profileImage?: string;
    resumeUrl?: string;
  } | null;
  aboutMe?: string;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
  };
}

const iconMap: any = {
  Code: IconCode,
  Users: IconUsers,
  Star: IconStar,
  Zap: IconBolt,
  Award: IconAward,
  Rocket: IconRocket
};

export default function About({ stats, hero, aboutMe, contact }: AboutProps) {
  const displayStats = stats.length > 0 ? stats : [
    { _id: '1', icon: 'Code', value: '50+', label: 'Projects Completed' },
    { _id: '2', icon: 'Users', value: '30+', label: 'Happy Clients' },
    { _id: '3', icon: 'Star', value: '5★', label: 'Average Rating' },
    { _id: '4', icon: 'Zap', value: '3+', label: 'Years Experience' },
  ];

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
            About <span className="text-emerald-400">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Side - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative group">
              {/* Animated rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 sm:-inset-8 border-2 border-emerald-500/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-6 sm:-inset-12 border-2 border-cyan-500/20 rounded-full"
              />
              
              {/* Decorative Elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              
              {/* Profile Image Container */}
              <div className="relative bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm rounded-3xl p-4 sm:p-8 border border-white/10">
                <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center overflow-hidden">
                  {hero?.profileImage ? (
                    <img 
                      src={hero.profileImage.startsWith('http') ? hero.profileImage : import.meta.env.VITE_API_URL + hero.profileImage} 
                      alt={hero.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-6xl font-bold text-white">
                      {hero?.name?.split(' ').map((n: string) => n[0]).join('') || 'JD'}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full font-medium shadow-lg text-xs sm:text-base"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Available for work
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold mb-4 lg:text-left text-center"
            >
              Professional{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Full Stack Developer
              </span>
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 mb-6 max-w-2xl mx-auto leading-relaxed whitespace-pre-line lg:text-left text-center"
            >
              {aboutMe || "I'm a passionate Full Stack Developer with over 3 years of experience in creating stunning and functional web applications. I specialize in React, TypeScript, Node.js, and modern web technologies, delivering high-quality solutions that exceed client expectations."}
            </motion.p>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 gap-4 mb-8 lg:text-left text-center"
            >
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Location:</p>
                <p className="font-medium">{contact?.location || 'Dhaka, Bangladesh'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Email:</p>
                <p className="font-medium">{contact?.email || 'hello@joydebnath.com'}</p>
              </div>
            </motion.div>

            {/* Download CV Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className='flex lg:justify-start justify-center'
            >
              <a 
                href={hero?.resumeUrl?.startsWith('http') ? hero.resumeUrl : import.meta.env.VITE_API_URL + hero?.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <GradientButton className="flex cursor-pointer items-center gap-2 px-8 py-3 rounded-full">
                  <div className='flex items-center gap-2'>
                  <IconDownload size={20} />
                  Download CV
                  </div>
                </GradientButton>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || IconCode;
            return (
              <motion.div
                key={stat._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GradientBorderCard className='h-full'>
                  <div className="p-4 sm:p-6 text-center h-full">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                      className="inline-flex p-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl mb-4"
                    >
                      <IconComponent size={28} className="text-white" />
                    </motion.div>
                    <motion.h4
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
                    >
                      {stat.value}
                    </motion.h4>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </GradientBorderCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}