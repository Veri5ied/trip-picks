import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
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

export async function fetchActivities(
  filters: ActivityFilters = {},
): Promise<ListResponse> {
  const { data } = await api.get<ListResponse>("/activities", {
    params: filters,
  });
  return data;
}
