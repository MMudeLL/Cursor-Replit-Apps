import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  increment,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Post, Comment } from "../../types";

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Posts API
export const createPost = async (data: Omit<Post, "id" | "likeCount" | "commentCount" | "createdAt"> & { imageFile?: File | null; text: string; }) => {
  let imageUrl: string | undefined = undefined;
  if (data.imageFile) {
    const path = `posts/${data.uid}/${Date.now()}-${data.imageFile.name}`;
    imageUrl = await uploadFile(data.imageFile, path);
  }
  const payload = {
    uid: data.uid,
    authorName: data.authorName ?? null,
    authorPhotoURL: data.authorPhotoURL ?? null,
    text: data.text,
    imageUrl: imageUrl ?? null,
    createdAt: Date.now(),
    likeCount: 0,
    commentCount: 0,
  };
  const refDoc = await addDoc(collection(db, "posts"), payload);
  return { id: refDoc.id, ...(payload as any) } as Post;
};

export const listenToRecentPosts = (
  callback: (posts: Post[]) => void
) => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const posts: Post[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Post[];
    callback(posts);
  });
};

export const likePost = async (postId: string, uid: string) => {
  // naive like counter increment: create like doc and increment count
  const like = await addDoc(collection(db, "posts", postId, "likes"), {
    uid,
    createdAt: Date.now(),
  });
  await updateDoc(doc(db, "posts", postId), { likeCount: increment(1) });
  return like.id;
};

export const addComment = async (postId: string, data: Omit<Comment, "id" | "postId" | "createdAt"> & { text: string }) => {
  const payload = {
    postId,
    uid: data.uid,
    authorName: data.authorName ?? null,
    authorPhotoURL: data.authorPhotoURL ?? null,
    text: data.text,
    createdAt: Date.now(),
  };
  const refDoc = await addDoc(collection(db, "posts", postId, "comments"), payload);
  await updateDoc(doc(db, "posts", postId), { commentCount: increment(1) });
  return { id: refDoc.id, ...(payload as any) } as Comment;
};

export const listenToComments = (
  postId: string,
  callback: (comments: Comment[]) => void
) => {
  const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    const comments: Comment[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Comment[];
    callback(comments);
  });
};

// Profiles API
export const getUserProfile = async (uid: string) => {
  const refDoc = doc(db, "profiles", uid);
  const snap = await getDoc(refDoc);
  return snap.exists() ? { uid, ...(snap.data() as any) } : null;
};

export const upsertUserProfile = async (uid: string, data: any) => {
  const refDoc = doc(db, "profiles", uid);
  await setDoc(refDoc, { ...data, uid }, { merge: true });
};
