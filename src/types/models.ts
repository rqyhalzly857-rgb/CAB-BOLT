export type UserRole = 'investor' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface VehicleModel {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  price_cents: number;
  range_miles: number;
  top_speed_mph: number;
  seats: number;
  zero_to_sixty_sec: number;
  is_published: boolean;
  created_at: string;
}

export type OfferingStatus = 'draft' | 'open' | 'closed';

export interface InvestmentOffering {
  id: string;
  model_id: string;
  title: string;
  summary: string;
  unit_price_cents: number;
  total_units: number;
  units_sold: number;
  min_units: number;
  expected_annual_return_pct: number;
  status: OfferingStatus;
  closes_at: string | null;
  created_at: string;
  vehicle_models?: Pick<VehicleModel, 'name' | 'image_url' | 'slug'> | null;
}

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export interface VehicleOrder {
  id: string;
  user_id: string;
  model_id: string;
  quantity: number;
  total_cents: number;
  status: OrderStatus;
  created_at: string;
  vehicle_models?: Pick<VehicleModel, 'name' | 'image_url' | 'slug'> | null;
  profiles?: Pick<Profile, 'email' | 'full_name'> | null;
}

export type InvestmentStatus = 'confirmed' | 'cancelled';

export interface Investment {
  id: string;
  user_id: string;
  offering_id: string;
  units: number;
  amount_cents: number;
  status: InvestmentStatus;
  created_at: string;
  investment_offerings?: {
    title: string;
    unit_price_cents: number;
    expected_annual_return_pct: number;
    vehicle_models?: Pick<VehicleModel, 'name'> | null;
  } | null;
  profiles?: Pick<Profile, 'email' | 'full_name'> | null;
}
