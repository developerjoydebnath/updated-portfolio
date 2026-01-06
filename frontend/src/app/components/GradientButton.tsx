import { motion } from 'motion/react';
import { MouseEvent, ReactNode, useRef, useState } from 'react';
import { cn } from './ui/utils';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function GradientButton({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary', 
  type = 'button',
  disabled = false
}: GradientButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(`relative overflow-hidden`, className)}
      type={type}
      disabled={disabled}
    >
      {variant === 'primary' ? (
        <>
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500" />
          
          {/* Moving gradient on hover */}
          {isHovered && (
            <div
              className="absolute inset-0 opacity-50 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.3), transparent 50%)`,
              }}
            />
          )}
          
          {/* Content */}
          <span className="relative z-10">{children}</span>
        </>
      ) : (
        <>
          {/* Border gradient */}
          <div
            className="absolute inset-0 rounded-full p-[2px] transition-opacity duration-300"
            style={{
              background: isHovered
                ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.8), rgba(6, 182, 212, 0.5) 50%, transparent 100%)`
                : 'linear-gradient(to right, rgba(16, 185, 129, 0.5), rgba(6, 182, 212, 0.5))',
            }}
          >
            <div className="w-full h-full bg-slate-950 rounded-full" />
          </div>
          
          {/* Content */}
          <span className="relative z-10">{children}</span>
        </>
      )}
    </motion.button>
  );
}
