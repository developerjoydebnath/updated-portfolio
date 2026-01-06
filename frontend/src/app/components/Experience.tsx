import { IconBriefcase, IconSchool } from '@tabler/icons-react';
import { motion } from 'motion/react';
import GradientBorderCard from './GradientBorderCard';

interface ExperienceProps {
  data: {
    _id: string;
    type?: string;
    title: string;
    company: string;
    duration: string;
    description: string;
    achievements?: string[];
  }[];
}

export default function Experience({ data }: ExperienceProps) {
  const displayExperiences = data.length > 0 ? data.map(e => ({
    _id: e._id,
    type: e.type || 'work',
    title: e.title,
    company: e.company,
    period: e.duration,
    description: e.description,
    achievements: e.achievements || []
  })) : [
    {
      _id: '1',
      type: 'work',
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      period: '2023 - Present',
      description: 'Leading frontend development team, architecting scalable React applications, and mentoring junior developers.',
      achievements: [
        'Improved app performance by 40%',
        'Led team of 5 developers',
        'Implemented CI/CD pipeline',
      ],
    },
    // ... other placeholders
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
            Experience & <span className="text-emerald-400">Education</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            My professional journey and educational background
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 to-emerald-500" />

          {/* Timeline items */}
          <div className="space-y-12">
            {displayExperiences.map((exp: any, index: number) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex flex-col lg:flex-row gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, type: 'spring' }}
                    className="w-full h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-ping opacity-75" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2">
                  <GradientBorderCard>
                    <div className="p-4 sm:p-6">
                      {/* Icon and Period */}
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 + index * 0.2, type: 'spring' }}
                          className={`p-3 rounded-xl ${
                            exp.type === 'work'
                              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                        >
                          {exp.type === 'work' ? (
                            <IconBriefcase size={24} className="text-white" />
                          ) : (
                            <IconSchool size={24} className="text-white" />
                          )}
                        </motion.div>
                        <span className="text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                          {exp.period}
                        </span>
                      </div>

                      {/* Title and Company */}
                      <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                      <p className="text-emerald-400 mb-3">{exp.company}</p>
                      
                      {/* Description */}
                      <p className="text-gray-400 mb-4">{exp.description}</p>

                      {/* Achievements */}
                      <div className="space-y-2">
                        {exp.achievements.map((achievement: string, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.2 + i * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
                            <span className="text-sm text-gray-300">{achievement}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </GradientBorderCard>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden lg:block lg:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
