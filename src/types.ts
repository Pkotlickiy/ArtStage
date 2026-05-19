// src/types.ts
export interface PortfolioItem {
  id: string;
  image_url: string;
  year: number;
  title?: string;
  description?: string;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Contact {
  id: string;
  type: 'phone' | 'email' | 'address' | 'social';
  value: string;
  label?: string;
}