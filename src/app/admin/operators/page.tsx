import { Metadata } from 'next';
import { Building2, Star, ShieldCheck, Bus, Calendar } from 'lucide-react';
import { AdminHeader } from '@/components/layout/Admin/AdminHeader';
import { Badge } from '@/components/ui/badge';
import { getAdminOperators } from '@/lib/admin/fetchers';

export const metadata: Metadata = {
  title: 'Operator Directory - Platform Admin',
  description: 'View partner bus operators registered on the platform.',
};

export default async function AdminOperatorsPage() {
  const operators = await getAdminOperators();

  return (
    <div className="flex-1 space-y-6 pb-10">
      <AdminHeader
        title="Platform Operator Directory"
        subtitle="Partner bus operators, fleet counts, active schedules, and verified ratings."
      />

      <main className="px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">Partner Bus Operators</h2>
            <Badge variant="secondary" className="font-semibold text-xs rounded-full px-2.5 py-0.5">
              {operators.length} Total Partners
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {operators.map((op) => (
            <div
              key={op.id}
              className="rounded-2xl border border-border/80 bg-white p-5 shadow-subtle flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1">
                        <span>{op.name}</span>
                        <ShieldCheck className="h-4 w-4 text-emerald-600 inline" />
                      </h3>
                      <span className="text-[11px] text-muted-foreground">Partner Operator</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-700">
                    <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                    {op.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-[11px]">({op.reviewCount} Reviews)</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-semibold text-slate-600">
                <div className="flex items-center space-x-1">
                  <Bus className="h-3.5 w-3.5 text-slate-400" />
                  <span>{op.busCount} Buses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{op.scheduleCount} Schedules</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
