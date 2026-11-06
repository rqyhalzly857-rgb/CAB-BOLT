import { Download, FileText } from 'lucide-react';
import type { Investment, VehicleOrder } from '@/types/models';
import { downloadCsv } from '@/lib/csv';
import { formatCents, formatDate } from '@/lib/format';
import { cardClass, secondaryButtonClass } from '@/components/ui/styles';

interface StatementsPanelProps {
  investments: Investment[];
  orders: VehicleOrder[];
}

export function StatementsPanel({ investments, orders }: StatementsPanelProps) {
  const confirmedTotal = investments
    .filter((item) => item.status === 'confirmed')
    .reduce((sum, item) => sum + item.amount_cents, 0);

  const exportInvestments = () => {
    const header = ['Date', 'Round', 'Units', 'Amount (USD)', 'Expected annual return (%)', 'Status'];
    const rows = investments.map((item) => [
      formatDate(item.created_at),
      item.investment_offerings?.title ?? '',
      item.units,
      item.amount_cents / 100,
      item.investment_offerings?.expected_annual_return_pct ?? '',
      item.status,
    ]);
    downloadCsv('voltway-investments.csv', [header, ...rows]);
  };

  const exportOrders = () => {
    const header = ['Date', 'Vehicle', 'Quantity', 'Total (USD)', 'Status'];
    const rows = orders.map((order) => [
      formatDate(order.created_at),
      order.vehicle_models?.name ?? '',
      order.quantity,
      order.total_cents / 100,
      order.status,
    ]);
    downloadCsv('voltway-vehicle-orders.csv', [header, ...rows]);
  };

  return (
    <div className="space-y-6">
      <div className={`${cardClass} flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8`}>
        <div>
          <p className="text-sm text-zinc-500">Total confirmed investments</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{formatCents(confirmedTotal)}</p>
          <p className="mt-2 text-sm text-zinc-600">Export your records as spreadsheets for your own reporting.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ExportCard
          title="Investment statement"
          description={`${investments.length} ${investments.length === 1 ? 'record' : 'records'} with amounts, units and status.`}
          disabled={investments.length === 0}
          onExport={exportInvestments}
        />
        <ExportCard
          title="Vehicle order history"
          description={`${orders.length} ${orders.length === 1 ? 'reservation' : 'reservations'} with quantities and status.`}
          disabled={orders.length === 0}
          onExport={exportOrders}
        />
      </div>
    </div>
  );
}

interface ExportCardProps {
  title: string;
  description: string;
  disabled: boolean;
  onExport: () => void;
}

function ExportCard({ title, description, disabled, onExport }: ExportCardProps) {
  return (
    <div className={`${cardClass} flex flex-col p-6 sm:p-8`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
        <FileText className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{description}</p>
      <div className="mt-6">
        <button type="button" onClick={onExport} disabled={disabled} className={secondaryButtonClass}>
          <Download className="h-4 w-4" />
          Download CSV
        </button>
      </div>
    </div>
  );
}
