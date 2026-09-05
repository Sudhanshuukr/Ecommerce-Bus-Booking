'use client';

import * as React from 'react';
import { Bus, MapPin, Download, Share2, QrCode, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFullJourneyDate } from '@/lib/supabase/mappers';
import { BookingConfirmationData } from '../types/passenger';

export interface MobileTicketPassProps {
  data: BookingConfirmationData;
  className?: string;
}

export function MobileTicketPass({ data, className }: MobileTicketPassProps) {
  const { bookingId, bookingDate, journeyDate, schedule, boardingPoint, droppingPoint, selectedSeats, passengers } = data;

  return (
    <div className={cn('relative w-full max-w-md mx-auto space-y-4', className)}>
      {/* Ticket Pass Main Body */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-white shadow-modal transition-all">
        {/* Top Header Header Banner */}
        <div className="bg-primary px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Bus className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-white/80 block uppercase tracking-wider">
                  Boarding Pass
                </span>
                <span className="text-sm font-bold text-white truncate block max-w-[180px]">
                  {schedule.operator.name}
                </span>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 border border-emerald-400/30">
              CONFIRMED
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/90">
            <div>
              <span className="text-[10px] text-white/70 block uppercase">PNR / Reference</span>
              <span className="font-mono font-bold text-sm tracking-wide text-white">{bookingId}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/70 block uppercase">Booking Date</span>
              <span className="font-semibold">{bookingDate}</span>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="p-6 space-y-5">
          {/* Journey Date Banner */}
          {journeyDate && (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-600">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Journey Date</span>
              </div>
              <span className="font-extrabold text-slate-900">
                {formatFullJourneyDate(journeyDate)}
              </span>
            </div>
          )}

          {/* Timeline: Origin -> Destination */}
          <div className="flex items-center justify-between gap-3 text-center">
            <div className="text-left min-w-0">
              <span className="text-2xl font-black font-sans tabular-nums text-slate-900 block tracking-tight">
                {schedule.route.departureTime}
              </span>
              <span className="text-xs font-bold text-slate-700 truncate block max-w-[110px]">
                {schedule.route.origin}
              </span>
              <span className="text-[11px] text-muted-foreground block">{boardingPoint.time}</span>
            </div>

            <div className="flex flex-col items-center justify-center px-2 min-w-[80px]">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider mb-1">
                {schedule.route.duration}
              </span>
              <div className="relative flex items-center w-full">
                <div className="h-[2px] w-full bg-slate-200" />
                <div className="absolute left-0 h-2 w-2 rounded-full bg-primary" />
                <div className="absolute right-0 h-2 w-2 rounded-full bg-primary" />
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1">Direct Bus</span>
            </div>

            <div className="text-right min-w-0">
              <span className="text-2xl font-black font-sans tabular-nums text-slate-900 block tracking-tight">
                {schedule.route.arrivalTime}
              </span>
              <span className="text-xs font-bold text-slate-700 truncate block max-w-[110px]">
                {schedule.route.destination}
              </span>
              <span className="text-[11px] text-muted-foreground block">{droppingPoint.time}</span>
            </div>
          </div>

          {/* Perforated Divider Line with Left & Right Cutout Notches */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute -left-9 h-6 w-6 rounded-full bg-slate-100 border-r border-border/80" />
            <div className="w-full border-t-2 border-dashed border-slate-200" />
            <div className="absolute -right-9 h-6 w-6 rounded-full bg-slate-100 border-l border-border/80" />
          </div>

          {/* Passenger & Seat Numbers Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-1">
                Passenger(s)
              </span>
              <div className="space-y-0.5">
                {passengers.map((p, i) => (
                  <div key={p.seatId} className="text-xs font-bold text-slate-900 truncate">
                    {i + 1}. {p.fullName || `Passenger ${i + 1}`}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-1">
                Seat Number(s)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSeats.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-black font-sans tabular-nums text-primary"
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Boarding Point Details */}
          <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">{boardingPoint.name}</span>
                <span className="text-muted-foreground block text-[11px]">{boardingPoint.address}</span>
              </div>
            </div>
          </div>

          {/* QR Code Barcode Mockup for Mobile Verification */}
          <div className="flex flex-col items-center justify-center pt-2 space-y-2 border-t border-slate-100">
            <div className="flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <QrCode className="h-20 w-20 text-slate-800" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              SCAN TO VERIFY BOARDING
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-4 text-xs font-bold text-white shadow-subtle hover:bg-primary-600 active:scale-95 transition-all"
        >
          <Download className="mr-2 h-4 w-4" />
          <span>Download Pass</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Bus Ticket - ${bookingId}`,
                text: `Boarding Pass for ${schedule.operator.name} (${schedule.route.origin} -> ${schedule.route.destination})`,
                url: window.location.href,
              }).catch(() => {});
            }
          }}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 shadow-subtle hover:bg-slate-50 active:scale-95 transition-all"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
