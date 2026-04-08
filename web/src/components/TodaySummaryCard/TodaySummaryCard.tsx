import { StatusBadge } from "@/components/StatusBadge/StatusBadge";

interface TodaySummaryCardProps {
  dateLabel: string;
  parityLabel: string;
  offDutyCount: number;
  riderCount: number;
  driverCount: number;
}

export function TodaySummaryCard({
  dateLabel,
  parityLabel,
  offDutyCount,
  riderCount,
  driverCount,
}: TodaySummaryCardProps) {
  return (
    <section className="card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">오늘 상황</h2>
        <StatusBadge label={parityLabel} tone="neutral" />
      </div>
      <p className="mb-4 text-sm text-slate-600">{dateLabel} 기준</p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-blue-50 p-2">
          <p className="text-lg font-bold text-blue-700">{driverCount}</p>
          <p className="text-xs text-slate-500">운행 가능</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-2">
          <p className="text-lg font-bold text-amber-700">{riderCount}</p>
          <p className="text-xs text-slate-500">탑승 필요</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-2">
          <p className="text-lg font-bold text-slate-700">{offDutyCount}</p>
          <p className="text-xs text-slate-500">비출근</p>
        </div>
      </div>
    </section>
  );
}
