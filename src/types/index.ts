export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'guest' | 'user' | 'admin';
  reputation: number;
  joinDate: string;
  bio?: string;
  isOnline?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  color: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: User;
  tags: Tag[];
  votes: number;
  views: number;
  answerCount: number;
  acceptedAnswerId?: string;
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
  userVote?: 'up' | 'down' | null;
}

export interface Answer {
  id: string;
  content: string;
  author: User;
  questionId: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  userVote?: 'up' | 'down' | null;
}

export interface Notification {
  id: string;
  type: 'answer' | 'vote' | 'mention' | 'accepted' | 'comment';
  title: string;
  message: string;
  relatedId: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  questionId?: string;
  answerId?: string;
  votes: number;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
}