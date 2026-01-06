
import { ImageIcon, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface CustomImageInputProps {
  value: string;
  onChange: (base64: string, file?: File) => void;
  label: string;
}

const CustomImageInput: React.FC<CustomImageInputProps> = ({ value, onChange, label }) => {
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log(value);

const resolveImageSrc = (value: string) => {
  if (!value) return '';
  if (value.startsWith('data:image')) return value;
  return import.meta.env.VITE_API_URL + value;
};

useEffect(() => {
  setPreview(resolveImageSrc(value));
}, [value]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onChange(base64String, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    onChange('', undefined);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300 block">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
          ${preview ? 'border-cyan-500/50 h-48' : 'border-gray-800 hover:border-gray-700 bg-gray-900/50 h-40'}`}
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />

        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Click to change</span>
            </div>
            <button 
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="text-center space-y-3 px-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400 group-hover:text-cyan-400 transition-colors">
              <ImageIcon size={24} />
            </div>
            <div>
              <p className="text-gray-300 font-medium text-sm">Upload an image</p>
              <p className="text-gray-500 text-xs mt-1">PNG, JPG or WEBP (Max 2MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomImageInput;
