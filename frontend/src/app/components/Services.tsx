import {
  IconBrandFigma,
  IconBrush,
  IconBulb,
  IconChartBar,
  IconChartLine,
  IconClipboardText,
  IconCloud,
  IconCode,
  IconColorSwatch,
  IconDatabase,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconFileText,
  IconHeadset,
  IconLayoutDashboard,
  IconLifebuoy,
  IconMail,
  IconPalette,
  IconPencil,
  IconRocket,
  IconSearch,
  IconServer,
  IconSettings,
  IconShoppingCart,
  IconSpeakerphone,
  IconTarget,
  IconTrendingUp,
  IconUsers,
  IconWorld,
  IconWriting
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import GradientBorderCard from './GradientBorderCard';

interface ServicesProps {
  data: {
    _id: string;
    title: string;
    description: string;
    icon?: string;
    color?: string;
  }[];
}

// Service-relevant icons - matches admin panel
const iconMap: any = {
  // Design Services
  IconBrandFigma,        // UI/UX Design
  IconPalette,           // Graphic Design
  IconBrush,             // Creative Design
  IconColorSwatch,       // Branding
  IconLayoutDashboard,   // Dashboard Design
  
  // Development Services
  IconCode,              // Frontend Development
  IconServer,            // Backend Development
  IconDatabase,          // Database Management
  IconDeviceDesktop,     // Web Development
  IconDeviceMobile,      // Mobile Development
  IconCloud,             // Cloud Services
  IconSettings,          // DevOps / Configuration
  
  // SEO & Analytics
  IconSearch,            // SEO
  IconChartBar,          // Analytics
  IconChartLine,         // Growth Analytics
  IconTrendingUp,        // Performance Optimization
  IconTarget,            // Target Marketing
  
  // Marketing & Content
  IconSpeakerphone,      // Marketing
  IconMail,              // Email Marketing
  IconWriting,           // Content Writing
  IconPencil,            // Copywriting
  IconFileText,          // Content Management
  IconClipboardText,     // Documentation
  
  // Business & Support
  IconShoppingCart,      // E-commerce
  IconUsers,             // Team Management
  IconBulb,              // Consulting / Ideas
  IconRocket,            // Launch / Startup
  IconHeadset,           // Support
  IconLifebuoy,          // Customer Support
  IconWorld,             // Global Services
};

const colorMap: any = {
  blue: 'from-blue-500 to-cyan-500',
  pink: 'from-pink-500 to-purple-500',
  green: 'from-emerald-500 to-green-500',
  yellow: 'from-amber-500 to-orange-500',
  purple: 'from-purple-500 to-indigo-500',
  cyan: 'from-cyan-500 to-blue-500'
};

export default function Services({ data }: ServicesProps) {
  const displayServices = data.length > 0 ? data : [
    {
      _id: '1',
      icon: 'IconCode',
      title: 'Web Development',
      description: 'Building responsive and performant web applications using modern technologies like React, Next.js, and TypeScript.',
      color: 'blue',
    },
    {
      _id: '2',
      icon: 'IconPalette',
      title: 'UI/UX Design',
      description: 'Creating beautiful, intuitive user interfaces with focus on user experience and modern design principles.',
      color: 'pink',
    },
    {
      _id: '3',
      icon: 'IconDatabase',
      title: 'Backend Development',
      description: 'Developing robust server-side applications with Node.js, Express, and various database technologies.',
      color: 'green',
    },
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
            My <span className="text-emerald-400">Services</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            I provide a wide range of web development services to help bring your ideas to life
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service: any, index: number) => {
            const IconComponent = iconMap[service.icon] || IconBulb;
            const gradientClass = colorMap[service.color] || 'from-emerald-500 to-cyan-500';
            
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex"
              >
                <GradientBorderCard className="w-full">
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex-1">
                      {/* Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                        className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${gradientClass} mb-6`}
                      >
                        <IconComponent size={32} className="text-white" />
                      </motion.div>

                      {/* Title */}
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-xl font-bold mb-3"
                      >
                        {service.title}
                      </motion.h3>

                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="text-gray-400 leading-relaxed"
                      >
                        {service.description}
                      </motion.p>
                    </div>

                    {/* Decorative line - Always at the bottom */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-1 bg-gradient-to-r ${gradientClass} mt-8 rounded-full`}
                    />
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
