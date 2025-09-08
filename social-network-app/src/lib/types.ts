export interface UserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  website?: string;
  createdAt: number;
}

export interface Post {
  id: string;
  uid: string;
  authorName: string | null;
  authorPhotoURL: string | null;
  text: string;
  imageUrl?: string;
  createdAt: number;
  likeCount: number;
  commentCount: number;
}

export interface NewPostInput {
  text: string;
  imageFile?: File | null;
}

export interface Comment {
  id: string;
  postId: string;
  uid: string;
  authorName: string | null;
  authorPhotoURL: string | null;
  text: string;
  createdAt: number;
}

export interface Like {
  id: string;
  postId: string;
  uid: string;
  createdAt: number;
}

