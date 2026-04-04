export interface OrganizationProfile {
  history: string;
  vision: string;
  mission: string[];
}

export interface Member {
  id: string;
  name: string;
  role: string;
  akd: string; // Alat Kelengkapan Dewan (e.g., Komisi I, Komisi II, Badan Kehormatan)
  period: string; // e.g., 2024/2025
  photoUrl: string;
  order: number;
}

export interface News {
  id: string;
  title: string;
  content: string;
  category: "Proker" | "Reward" | "Pengumuman" | "Lainnya";
  date: string;
  imageUrl: string;
  author: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: "photo" | "video";
  url: string;
  thumbnailUrl?: string;
  date: string;
}

export interface Aspiration {
  id: string;
  name?: string;
  email?: string;
  message: string;
  date: string;
  status: "pending" | "reviewed" | "responded";
}
