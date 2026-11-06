/*
# Lock investment records against direct edits

1. Modified Tables
- `investments`: removed the ability for admins to change the status directly from the app.

2. Security
- Dropped the admin UPDATE policy on `investments` and revoked the status UPDATE grant.
- Investment records are now read-only for admins and investors. Changes to investments must go through database functions that also keep offering unit counts correct.

3. Important Notes
- Admins can still view every investment.
*/

DROP POLICY IF EXISTS "admin_update_investments" ON public.investments;
REVOKE UPDATE (status) ON public.investments FROM authenticated;
