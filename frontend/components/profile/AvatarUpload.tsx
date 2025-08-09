import React, { useRef } from 'react';
import { useUpdateAvatar } from '../../hooks/useUser';
import { User } from '../../services/user';

interface AvatarUploadProps {
  user: User;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ user }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateAvatarMutation = useUpdateAvatar();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      updateAvatarMutation.mutate(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getAvatarDisplay = () => {
    if (user.avatar) {
      return (
        <img 
          src={user.avatar} 
          alt={`${user.first_name} ${user.last_name}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      );
    }

    // Show initials if no avatar
    const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    return (
      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg">
        {initials || (
          <svg className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
          </svg>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div 
        className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rounded-full border-4 border-white dark:border-gray-800 shadow-md flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleClick}
      >
        {getAvatarDisplay()}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {updateAvatarMutation.isPending && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
};