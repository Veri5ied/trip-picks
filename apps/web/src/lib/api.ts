import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  withCredentials: true,
});

export interface Activity {
  id: string;
  title: string;
  category: string;
  area: string;
  durationMinutes: number;
  priceLevel: number;
  rating: number;
  imageUrl: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListResponse {
  data: Activity[];
  meta: {
    count: number;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ActivityFilters {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface User {
  id: string;
  email: string;
}

export interface Plan {
  id: string;
  userId: string;
  name: string;
  date: string;
  activityIds: string[];
  activities: Activity[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function fetchActivities(
  filters: ActivityFilters = {},
): Promise<ListResponse> {
  const { data } = await api.get<ListResponse>("/activities", {
    params: filters,
  });
  return data;
}

export async function signup(email: string, password: string) {
  const { data } = await api.post<{ data: User }>("/auth/signup", { email, password });
  return data.data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ data: User }>("/auth/login", { email, password });
  return data.data;
}

export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function fetchMe() {
  const { data } = await api.get<{ data: User | null }>("/auth/me");
  return data.data;
}

export async function fetchFavorites() {
  const { data } = await api.get<{ data: Activity[] }>("/favorites");
  return data.data;
}

export async function addFavorite(activityId: string) {
  const { data } = await api.post("/favorites", { activityId });
  return data;
}

export async function removeFavorite(activityId: string) {
  const { data } = await api.delete(`/favorites/${activityId}`);
  return data;
}

export async function fetchPlans() {
  const { data } = await api.get<{ data: Plan[] }>("/plans");
  return data.data;
}

export async function createPlan(input: {
  name: string;
  date: string;
  activityIds: string[];
  notes?: string;
}) {
  const { data } = await api.post<{ data: Plan }>("/plans", input);
  return data.data;
}

export async function getPlan(id: string) {
  const { data } = await api.get<{ data: Plan }>(`/plans/${id}`);
  return data.data;
}

export async function updatePlan(
  id: string,
  input: {
    name?: string;
    date?: string;
    activityIds?: string[];
    notes?: string;
  },
) {
  const { data } = await api.patch<{ data: Plan }>(`/plans/${id}`, input);
  return data.data;
}
