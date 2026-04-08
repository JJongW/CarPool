import { Profile } from "@/lib/CarpoolTypes";

interface CommuteStatusListProps {
  title: string;
  profiles: Profile[];
  attendanceLabels: Record<Profile["attendanceType"], string>;
}

export function CommuteStatusList({ title, profiles, attendanceLabels }: CommuteStatusListProps) {
  return (
    <section className="card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-slate-900">{title}</h3>
      <ul className="space-y-2">
        {profiles.map((profile) => (
          <li key={profile.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
            <span className="text-sm text-slate-700">{profile.name}</span>
            <span className="text-xs text-slate-500">{attendanceLabels[profile.attendanceType]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
