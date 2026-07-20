import api from "./api";

export async function getAdminStats() {
  return api.get("/admin/stats");
}

export async function getAdminUsers() {
  return api.get("/admin/users");
}

export async function getAdminArticles() {
  return api.get("/admin/articles");
}

export async function deleteAdminUser(id: string) {
  return api.delete(`/admin/users/${id}`);
}

export async function deleteAdminArticle(id: string) {
  return api.delete(`/admin/articles/${id}`);
}

export async function toggleUserRole(id: string) {
  return api.patch(`/admin/users/${id}/role`);
}
