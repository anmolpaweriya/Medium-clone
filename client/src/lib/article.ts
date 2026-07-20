import api from "./api";

export interface CreateArticlePayload {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: "draft" | "published";
}

export const createArticle = (data: CreateArticlePayload) =>
  api.post("/articles", data);

export const updateArticle = (
  id: string,
  data: Partial<CreateArticlePayload>
) => api.patch(`/articles/${id}`, data);

export const getArticle = (slug: string) =>
  api.get(`/articles/${slug}`);

export const getMyArticles = () =>
  api.get("/articles/me");

export const deleteArticle = (id: string) =>
  api.delete(`/articles/${id}`);



export const getFeed = () =>
  api.get("/articles");

export const getFollowingFeed = () =>
  api.get("/articles/following");

export const getTopicsFeed = () =>
  api.get("/articles/topics");

export const getTrendingFeed = () =>
  api.get("/articles/trending");


export const getArticleDetails = (slug: string) =>
  api.get(`/articles/${slug}`);

export const getArticleComments = (articleId: string) =>
  api.get(`/comments/article/${articleId}`);

export const likeArticle = (id: string) =>
  api.post(`/articles/${id}/like`);

export const postComment = (data: { articleId: string; content: string }) =>
  api.post("/comments", data);

export const deleteComment = (id: string) =>
  api.delete(`/comments/${id}`);
