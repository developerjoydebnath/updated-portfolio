import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg', 'pdf', 'doc', 'docx'],
  } as any,
});

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export { cloudinary };

export const deleteImage = async (imageUrl: string) => {
  if (!imageUrl) return;

  // Skip deletion if it's not a Cloudinary URL
  if (!imageUrl.includes('cloudinary.com')) {
    console.log('Skipping deletion - not a Cloudinary URL:', imageUrl);
    return;
  }

  try {
    // Extract public ID from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloudname/image/upload/v1234567890/folder/filename.jpg
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      console.error('Invalid Cloudinary URL');
      return;
    }
    
    // Get everything after 'upload/' and before the extension
    const afterUpload = urlParts.slice(uploadIndex + 1);
    const withVersion = afterUpload.join('/');
    
    // Remove version if present (v1234567890/)
    const publicId = withVersion.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');
    
    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Deleted from Cloudinary:', publicId, result);
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};