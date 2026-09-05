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
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/95 p-2.5 sm:p-4 shadow-subtle backdrop-blur-sm">
      <div className="flex overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-2.5 sm:grid sm:grid-cols-4 sm:gap-4 sm:divide-x sm:divide-slate-200/80">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex shrink-0 sm:shrink items-center space-x-2.5 sm:space-x-3 rounded-xl bg-slate-50/70 sm:bg-transparent p-2 sm:p-0 sm:px-2 border border-slate-100 sm:border-0 min-w-[210px] sm:min-w-0"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap sm:truncate">
                  {item.label}
                </div>
                <div className="text-[10px] sm:text-[11px] text-muted-foreground whitespace-nowrap sm:truncate">
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
