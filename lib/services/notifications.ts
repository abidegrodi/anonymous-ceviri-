import api from '../api';

export interface NotificationStatus {
  gameId: number;
  release: boolean;
  update: boolean;
}

// Toggle release notification
export async function toggleReleaseNotification(gameId: number): Promise<{ subscribed: boolean }> {
  const response = await api.post(`/notifications/${gameId}/release`);
  return response.data.data;
}

// Toggle update notification
export async function toggleUpdateNotification(gameId: number): Promise<{ subscribed: boolean }> {
  const response = await api.post(`/notifications/${gameId}/update`);
  return response.data.data;
}

// Get notification status for a game
export async function getNotificationStatus(gameId: number): Promise<NotificationStatus> {
  const response = await api.get(`/notifications/${gameId}/status`);
  return response.data.data;
}
