import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSend
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { submitQuery } from '../../api';
import GradientBorderCard from './GradientBorderCard';
import GradientButton from './GradientButton';

interface ContactProps {
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
  };
}

export default function Contact({ socialLinks, contact }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: IconMail,
      title: 'Email',
      value: contact?.email || 'hello@joydebnath.com',
      href: `mailto:${contact?.email || 'hello@joydebnath.com'}`,
    },
    {
      icon: IconPhone,
      title: 'Phone',
      value: contact?.phone || '+880 1734466416',
      href: `tel:${contact?.phone?.replace(/\s+/g, '') || '+8801734466416'}`,
    },
    {
      icon: IconMapPin,
      title: 'Location',
      value: contact?.location || 'Dhaka, Bangladesh',
      href: '#',
    },
  ];

  const socialLinksList = [
    { icon: IconBrandGithub, href: socialLinks?.github || '#', label: 'GitHub', color: 'hover:text-white' },
    { icon: IconBrandLinkedin, href: socialLinks?.linkedin || '#', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: IconBrandTwitter, href: socialLinks?.twitter || '#', label: 'Twitter', color: 'hover:text-cyan-400' },
    { icon: IconBrandFacebook, href: socialLinks?.facebook || '#', label: 'Facebook', color: 'hover:text-blue-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      await submitQuery(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
            Get In <span className="text-emerald-400">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? Feel free to reach out!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Let's talk about everything!</h3>
            <p className="text-gray-400 mb-8">
              Don't hesitate to get in touch with me. I'm always open to discussing new projects,
              creative ideas, or opportunities to be part of your visions.
            </p>

            {/* Contact Cards */}
            <div className="space-y-4 mb-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GradientBorderCard>
                    <a
                      href={info.href}
                      className="flex items-center gap-4 p-4 group"
                    >
                      <div className="relative p-3 rounded-lg overflow-hidden text-emerald-400 group-hover:text-white transition-colors duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-10 group-hover:opacity-100 transition-opacity duration-300" />
                        <info.icon size={24} className="relative z-10" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">{info.title}</p>
                        <p className="font-medium">{info.value}</p>
                      </div>
                    </a>
                  </GradientBorderCard>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-400 mb-4">Follow me on</p>
              <div className="flex items-center gap-4">
                {socialLinksList.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`p-3 bg-white/5 border hover:bg-white/10 border-white/10 rounded-lg text-gray-400 transition-all ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {submitStatus === 'success' && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400 text-center">
                  Message sent successfully!
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center">
                  Failed to send message. Please try again.
                </div>
              )}
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Project Inquiry"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit Button */}
              <GradientButton 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full flex items-center cursor-pointer justify-center gap-2 px-8 py-4 rounded-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className='flex items-center gap-2'>
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <IconSend size={20} />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
                </div>
              </GradientButton>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}