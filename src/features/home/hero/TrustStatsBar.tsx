import * as React from 'react';
import { Calendar, Building2, Armchair, TicketCheck } from 'lucide-react';

export function TrustStatsBar() {
  const stats = [
    {
      label: '45+ Daily Schedules',
      sublabel: 'Across 15 top corridors',
      icon: Calendar,
    },
    {
      label: '14 Fleet Operators',
      sublabel: 'State transit & private fleets',
      icon: Building2,
    },
    {
      label: '52-Seat Live Layouts',
      sublabel: 'Seater & sleeper selection',
      icon: Armchair,
    },
    {
      label: 'Instant PNR E-Tickets',
      sublabel: 'Zero-wait digital confirmation',
      icon: TicketCheck,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-subtle backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-4 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0 sm:divide-x sm:divide-slate-200/80">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 px-2 ${idx > 1 ? 'pt-3 sm:pt-0' : ''}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {item.label}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {item.sublabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
