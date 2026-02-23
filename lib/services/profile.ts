import api from '../api';

// Update username
export async function updateUsername(username: string): Promise<{ username: string }> {
  const response = await api.put('/profile/username', { username });
  return response.data.data;
}
