/*
# Vehicle catalog, investment offerings, orders and investments

1. New Tables
- `vehicle_models`: the vehicles for sale (name, tagline, description, image, price, specs). `is_published` controls whether the public can see it.
- `investment_offerings`: investment rounds for a vehicle model. Each offering has a unit price, total units, units sold, minimum units per investor, expected annual return, status (draft, open, closed) and optional closing date.
- `orders`: vehicle purchase reservations placed by investors and buyers. Status moves through pending, confirmed, delivered, cancelled.
- `investments`: units an investor bought in an offering, with the amount paid and status.

2. New Functions (all run with controlled rights)
- `place_vehicle_order(model_id, quantity)`: validates the vehicle is published, calculates the total price on the server, and creates the order for the signed-in user.
- `invest_in_offering(offering_id, units)`: checks the offering is open, meets the minimum, and has enough units left. Then it records the investment and updates the units sold in one step.

3. Security
- Row level security enabled on every new table.
- Public (signed-out and signed-in) can read published vehicles and open or closed offerings.
- Signed-in users can read only their own orders and investments.
- Admins can read everything and manage vehicles, offerings, and update order and investment status.
- Users cannot insert orders or investments directly; they must go through the functions above, which set the owner and prices on the server.
- Users cannot change their own order or investment amounts, only admins can change statuses.

4. Seed Data
- Two illustrative vehicle models (Roadster and Cybercab) and one open investment offering for the Cybercab. All specs and prices are placeholders.

5. Important Notes
- No payment is taken. Orders are reservations and investments are recorded for admin follow-up.
- Amounts are stored in cents to avoid rounding errors.
*/

CREATE TABLE IF NOT EXISTS public.vehicle_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  price_cents integer NOT NULL CHECK (price_cents > 0),
  range_miles integer NOT NULL DEFAULT 0 CHECK (range_miles >= 0),
  top_speed_mph integer NOT NULL DEFAULT 0 CHECK (top_speed_mph >= 0),
  seats integer NOT NULL DEFAULT 2 CHECK (seats > 0),
  zero_to_sixty_sec numeric(3,1) NOT NULL DEFAULT 0 CHECK (zero_to_sixty_sec >= 0),
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.investment_offerings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES public.vehicle_models(id) ON DELETE RESTRICT,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  unit_price_cents integer NOT NULL CHECK (unit_price_cents > 0),
  total_units integer NOT NULL CHECK (total_units > 0),
  units_sold integer NOT NULL DEFAULT 0 CHECK (units_sold >= 0),
  min_units integer NOT NULL DEFAULT 1 CHECK (min_units > 0),
  expected_annual_return_pct numeric(5,2) NOT NULL DEFAULT 0 CHECK (expected_annual_return_pct >= 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  closes_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (units_sold <= total_units),
  CHECK (min_units <= total_units)
);

CREATE INDEX IF NOT EXISTS investment_offerings_model_id_idx ON public.investment_offerings(model_id);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  model_id uuid NOT NULL REFERENCES public.vehicle_models(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  total_cents integer NOT NULL CHECK (total_cents > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);

CREATE TABLE IF NOT EXISTS public.investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  offering_id uuid NOT NULL REFERENCES public.investment_offerings(id) ON DELETE RESTRICT,
  units integer NOT NULL CHECK (units > 0),
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS investments_user_id_idx ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS investments_offering_id_idx ON public.investments(offering_id);

ALTER TABLE public.vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.vehicle_models TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.vehicle_models TO authenticated;
GRANT SELECT ON public.investment_offerings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.investment_offerings TO authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT UPDATE (status) ON public.orders TO authenticated;
GRANT SELECT ON public.investments TO authenticated;
GRANT UPDATE (status) ON public.investments TO authenticated;

DROP POLICY IF EXISTS "public_select_published_models" ON public.vehicle_models;
CREATE POLICY "public_select_published_models" ON public.vehicle_models FOR SELECT
  TO anon, authenticated USING (is_published);

DROP POLICY IF EXISTS "admin_select_all_models" ON public.vehicle_models;
CREATE POLICY "admin_select_all_models" ON public.vehicle_models FOR SELECT
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admin_insert_models" ON public.vehicle_models;
CREATE POLICY "admin_insert_models" ON public.vehicle_models FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_models" ON public.vehicle_models;
CREATE POLICY "admin_update_models" ON public.vehicle_models FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_models" ON public.vehicle_models;
CREATE POLICY "admin_delete_models" ON public.vehicle_models FOR DELETE
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_select_visible_offerings" ON public.investment_offerings;
CREATE POLICY "public_select_visible_offerings" ON public.investment_offerings FOR SELECT
  TO anon, authenticated USING (status IN ('open', 'closed'));

DROP POLICY IF EXISTS "admin_select_all_offerings" ON public.investment_offerings;
CREATE POLICY "admin_select_all_offerings" ON public.investment_offerings FOR SELECT
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admin_insert_offerings" ON public.investment_offerings;
CREATE POLICY "admin_insert_offerings" ON public.investment_offerings FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_offerings" ON public.investment_offerings;
CREATE POLICY "admin_update_offerings" ON public.investment_offerings FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_offerings" ON public.investment_offerings;
CREATE POLICY "admin_delete_offerings" ON public.investment_offerings FOR DELETE
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "select_own_orders" ON public.orders;
CREATE POLICY "select_own_orders" ON public.orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_all_orders" ON public.orders;
CREATE POLICY "admin_select_all_orders" ON public.orders FOR SELECT
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admin_update_orders" ON public.orders;
CREATE POLICY "admin_update_orders" ON public.orders FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "select_own_investments" ON public.investments;
CREATE POLICY "select_own_investments" ON public.investments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_all_investments" ON public.investments;
CREATE POLICY "admin_select_all_investments" ON public.investments FOR SELECT
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admin_update_investments" ON public.investments;
CREATE POLICY "admin_update_investments" ON public.investments FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.place_vehicle_order(p_model_id uuid, p_quantity integer)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_model public.vehicle_models%ROWTYPE;
  v_row public.orders%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Please sign in to place an order' USING ERRCODE = '42501';
  END IF;

  IF p_quantity IS NULL OR p_quantity < 1 OR p_quantity > 10 THEN
    RAISE EXCEPTION 'Quantity must be between 1 and 10';
  END IF;

  SELECT * INTO v_model FROM public.vehicle_models WHERE id = p_model_id AND is_published;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'This vehicle is not available';
  END IF;

  INSERT INTO public.orders (user_id, model_id, quantity, total_cents)
  VALUES (auth.uid(), p_model_id, p_quantity, v_model.price_cents * p_quantity)
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.invest_in_offering(p_offering_id uuid, p_units integer)
RETURNS public.investments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_offering public.investment_offerings%ROWTYPE;
  v_row public.investments%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Please sign in to invest' USING ERRCODE = '42501';
  END IF;

  IF p_units IS NULL OR p_units < 1 THEN
    RAISE EXCEPTION 'Units must be at least 1';
  END IF;

  SELECT * INTO v_offering FROM public.investment_offerings WHERE id = p_offering_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'This offering could not be found';
  END IF;

  IF v_offering.status <> 'open' OR (v_offering.closes_at IS NOT NULL AND v_offering.closes_at <= now()) THEN
    RAISE EXCEPTION 'This offering is no longer accepting investments';
  END IF;

  IF p_units < v_offering.min_units THEN
    RAISE EXCEPTION 'The minimum investment is % units', v_offering.min_units;
  END IF;

  IF v_offering.units_sold + p_units > v_offering.total_units THEN
    RAISE EXCEPTION 'Only % units are left in this offering', v_offering.total_units - v_offering.units_sold;
  END IF;

  UPDATE public.investment_offerings
  SET units_sold = units_sold + p_units
  WHERE id = p_offering_id;

  INSERT INTO public.investments (user_id, offering_id, units, amount_cents)
  VALUES (auth.uid(), p_offering_id, p_units, p_units * v_offering.unit_price_cents)
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.place_vehicle_order(uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_vehicle_order(uuid, integer) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.invest_in_offering(uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.invest_in_offering(uuid, integer) TO authenticated;

INSERT INTO public.vehicle_models (id, slug, name, tagline, description, image_url, price_cents, range_miles, top_speed_mph, seats, zero_to_sixty_sec, is_published)
VALUES
  (
    '5f1c0a10-0000-4000-8000-000000000001',
    'roadster',
    'Roadster',
    'Open-air performance, reimagined',
    'A two-seat electric roadster built for the open road. Instant torque, a low stance and a carbon-reinforced chassis make every drive feel alive.',
    'https://images.pexels.com/photos/36634696/pexels-photo-36634696.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    20000000,
    620,
    250,
    2,
    1.9,
    true
  ),
  (
    '5f1c0a10-0000-4000-8000-000000000002',
    'cybercab',
    'Cybercab',
    'Autonomous mobility for every city',
    'A two-seat autonomous cab designed for ride-hailing fleets. Park-free urban travel, sensor suite for full self-driving and a cabin built for passengers.',
    'https://images.pexels.com/photos/35076289/pexels-photo-35076289.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    3000000,
    300,
    85,
    2,
    5.5,
    true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.investment_offerings (id, model_id, title, summary, unit_price_cents, total_units, units_sold, min_units, expected_annual_return_pct, status)
VALUES (
  '6a2d1b20-0000-4000-8000-000000000001',
  '5f1c0a10-0000-4000-8000-000000000002',
  'Cybercab Fleet Round 1',
  'Fund the first production run of Cybercab fleet vehicles. Investors receive a share of ride-hailing revenue from the fleet they help fund.',
  500000,
  1000,
  120,
  1,
  9.50,
  'open'
)
ON CONFLICT (id) DO NOTHING;
