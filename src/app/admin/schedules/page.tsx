import { Metadata } from 'next';
import { Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { AdminHeader } from '@/components/layout/Admin/AdminHeader';
import { Badge } from '@/components/ui/badge';
import { getAdminSchedules } from '@/lib/admin/fetchers';

export const metadata: Metadata = {
  title: 'Schedule Management - Platform Admin',
  description: 'Monitor all operational bus schedules and routes.',
};

export default async function AdminSchedulesPage() {
  const schedules = await getAdminSchedules();

  return (
    <div className="flex-1 space-y-6 pb-10">
      <AdminHeader
        title="Platform Schedules Monitoring"
        subtitle="View all operational journeys, departure schedules, bus types, and seating capacities."
      />

      <main className="px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">Active Schedules</h2>
            <Badge variant="secondary" className="font-semibold text-xs rounded-full px-2.5 py-0.5">
              {schedules.length} Total Journeys
            </Badge>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Operator</th>
                  <th className="py-3.5 px-4">Bus Type</th>
                  <th className="py-3.5 px-4">Route</th>
                  <th className="py-3.5 px-4">Departure → Arrival</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Fare</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {schedules.length > 0 ? (
                  schedules.map((s) => {
                    const depDate = new Date(s.departureTime);
                    const arrDate = new Date(s.arrivalTime);
                    const depStr = depDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const arrStr = arrDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const hrs = Math.floor(s.durationMinutes / 60);
                    const mins = s.durationMinutes % 60;
                    const durationStr = `${hrs}h ${mins.toString().padStart(2, '0')}m`;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-primary shrink-0" />
                            <span>{s.operatorName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="font-semibold text-slate-800">{s.busType}</div>
                          <div className="text-[11px] text-muted-foreground">{s.busNumber}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1 font-bold text-slate-900">
                            <span>{s.origin}</span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                            <span>{s.destination}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          {depStr} <span className="text-slate-400 font-normal">→</span> {arrStr}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">{durationStr}</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          {s.currency}{s.price}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {s.totalSeats} Seats
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                      No operational bus schedules found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
