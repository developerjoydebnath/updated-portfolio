import { IconQuote, IconStar } from '@tabler/icons-react';
import { motion } from 'motion/react';
import GradientBorderCard from './GradientBorderCard';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

interface TestimonialsProps {
  data: Testimonial[];
}

export default function Testimonials({ data }: TestimonialsProps) {
  const testimonials = data;

  if (!testimonials || testimonials.length === 0) return null;

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
            Client <span className="text-cyan-400">Testimonials</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            What people say about working with me
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GradientBorderCard className="h-full">
                <div className="p-4 sm:p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img 
                        src={testimonial.avatar ? (testimonial.avatar.startsWith('http') ? testimonial.avatar : import.meta.env.VITE_API_URL + testimonial.avatar) : `https://ui-avatars.com/api/?name=${testimonial.name}&background=random`} 
                        alt={testimonial.name} 
                        className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-cyan-500/20" 
                      />
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base">{testimonial.name}</h3>
                        <p className="text-xs text-cyan-400 font-medium">{testimonial.role} {testimonial.company ? `@ ${testimonial.company}` : ''}</p>
                      </div>
                    </div>
                    <IconQuote className="text-gray-700 opacity-50 hidden sm:block" size={40} />
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <IconStar 
                        key={i} 
                        size={16} 
                        className={i < testimonial.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'} 
                      />
                    ))}
                  </div>

                  <p className="text-gray-400 italic leading-relaxed flex-grow">"{testimonial.content}"</p>
                </div>
              </GradientBorderCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
