import api from '../api';
import { Pagination } from './games';

// Types
export interface CommentReactions {
  likes: number;
  dislikes: number;
}

export interface CommentSticker {
  id: number;
  stickerName: string;
  imageUrl: string;
  senderUsername: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  depth: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  username: string;
  reactions: CommentReactions;
  stickerCount: number;
  stickers: CommentSticker[];
  replies: Comment[];
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: Pagination;
}

export interface CommentsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
}

// Get comments for a game (tree structure)
export async function getComments(gameId: number, params?: CommentsQueryParams): Promise<CommentsResponse> {
  const response = await api.get(`/games/${gameId}/comments`, { params });
  return response.data.data;
}

// Create a new comment
export async function createComment(gameId: number, content: string, parentId?: number | null): Promise<{ id: number; status: string }> {
  const response = await api.post(`/games/${gameId}/comments`, {
    content,
    parentId: parentId || null,
  });
  return response.data.data;
}

// Edit a comment
export async function editComment(commentId: number, content: string): Promise<void> {
  await api.put(`/comments/${commentId}`, { content });
}

// Delete a comment
export async function deleteComment(commentId: number): Promise<void> {
  await api.delete(`/comments/${commentId}`);
}

// Like a comment (toggle)
export async function likeComment(commentId: number): Promise<{ action: 'added' | 'removed' | 'switched'; type?: string }> {
  const response = await api.post(`/comments/${commentId}/like`);
  return response.data.data;
}

// Dislike a comment (toggle)
export async function dislikeComment(commentId: number): Promise<{ action: 'added' | 'removed' | 'switched'; type?: string }> {
  const response = await api.post(`/comments/${commentId}/dislike`);
  return response.data.data;
}
