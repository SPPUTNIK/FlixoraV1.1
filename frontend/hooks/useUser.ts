import { useMutation, useQueryClient } from '@tanstack/react-query';
import { config } from '../config/api';
import { UpdateUserResponse } from '../services/user';

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<UpdateUserResponse> => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${config.apiUrl}/users`, {
        method: 'PATCH',
        body: formData,
        // Add authentication headers if needed
        // headers: {
        //   'Authorization': `Bearer ${token}`,
        // },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(errorData.message || 'Avatar upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      console.error('Avatar upload failed:', error);
    },
  });
};
