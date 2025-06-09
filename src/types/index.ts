export interface Car {
  id: string;
  reference_number: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  engine_type: string;
  engine_size?: string;
  transmission_type: 'manual' | 'automatic' | 'semi-automatic';
  drivetrain_type: '2WD' | '4WD' | 'AWD' | 'RWD' | 'FWD';
  handling: 'left' | 'right';
  horsepower: number;
  torque?: string;
  color?: string;
  location?: string;
  status: string;
  description?: string;
  features?: string[];
  created_at: string;
  updated_at: string;
  images: Array<{
    url: string;
  }>;
  specs?: CarSpec[];
}

export interface CarImage {
  id: string;
  car_id: string;
  url: string;
  is_primary: boolean;
  created_at: string;
}

export interface CarSpec {
  id: string;
  car_id: string;
  category: string;
  name: string;
  value: string;
  created_at: string;
}

export interface CarComparison {
  id: string;
  user_id: string;
  name: string;
  cars: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomRequest {
  id: string;
  user_id: string;
  make: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  preferred_specs?: string[];
  additional_notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author_id?: string;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
  cover_image?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  category?: string;
}