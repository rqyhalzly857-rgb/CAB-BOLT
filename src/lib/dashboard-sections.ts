import { Activity, BarChart3, Compass, FileText, LineChart, Package, Settings, Wallet, type LucideIcon } from 'lucide-react';

export type DashboardSectionId =
  | 'overview'
  | 'opportunities'
  | 'investments'
  | 'returns'
  | 'activity'
  | 'statements'
  | 'orders'
  | 'profile';

export const dashboardSections: { id: DashboardSectionId; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'opportunities', label: 'Opportunities', icon: Compass },
  { id: 'investments', label: 'Investments', icon: Wallet },
  { id: 'returns', label: 'Returns', icon: LineChart },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'statements', label: 'Statements', icon: FileText },
  { id: 'orders', label: 'Vehicle orders', icon: Package },
  { id: 'profile', label: 'Profile', icon: Settings },
];
