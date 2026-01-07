import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#030712] z-50">
      <div className="relative flex items-center justify-center">
        <div className="absolute animate-ping h-32 w-32 rounded-full bg-cyan-500/50 opacity-75"></div>
        <div className="absolute animate-pulse h-32 w-32 rounded-full bg-cyan-500/30"></div>
        <img 
          src="/loader-image.png" 
          alt="Loading..." 
          className="relative h-28 w-28 rounded-full object-cover border-4 border-[#030712] shadow-2xl shadow-cyan-500/20"
        />
      </div>
    </div>
  );
};

export default Loader;
