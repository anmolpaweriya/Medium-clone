import api from "./api";

export interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const signup = (data: SignupData) => api.post("/auth/signup", data);

export const login = (data: { email: string; password: string }) => api.post("/auth/login", data);

export const getMe = () => api.get("/auth/me");

export const toggleFollowUser = (targetId: string) => api.post(`/auth/follow/${targetId}`);

export const getFollowingUsers = () => api.get("/auth/following");

export const toggleBookmarkArticle = (articleId: string) => api.post(`/auth/bookmark/${articleId}`);

export const getBookmarkedArticles = () => api.get("/auth/bookmarks");

export const getNotifications = () => api.get("/notifications");

export const markNotificationsRead = () => api.patch("/notifications/read");

export interface UpdateProfileData {
  name?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  email?: string;
}

export const updateProfile = (data: UpdateProfileData) => api.patch("/auth/profile", data);
