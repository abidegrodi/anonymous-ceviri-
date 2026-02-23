import api from '../api';

export interface Sticker {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  pointCost: number;
  displayOrder: number;
}

export interface StickerSendResult {
  id: number;
  sticker: {
    id: number;
    name: string;
    imageUrl: string;
  };
  pointsSpent: number;
  newBalance: number;
}

// Get all available stickers
export async function getStickers(): Promise<Sticker[]> {
  const response = await api.get('/stickers');
  return response.data.data;
}

// Send a sticker to a comment
export async function sendSticker(commentId: number, stickerId: number): Promise<StickerSendResult> {
  const response = await api.post(`/comments/${commentId}/stickers`, { stickerId });
  return response.data.data;
}
