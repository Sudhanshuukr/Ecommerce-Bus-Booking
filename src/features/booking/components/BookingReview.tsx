'use client';

import * as React from 'react';
import { Bus, MapPin, Clock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusSchedule } from '@/features/bus/types/bus';
import { Seat, BoardingDroppingPoint } from '../types/seat';
import { Passenger } from '../types/passenger';

export interface BookingReviewProps {
  schedule: BusSchedule;
  boardingPoint: BoardingDroppingPoint;
  droppingPoint: BoardingDroppingPoint;
  selectedSeats: Seat[];
  passengers: Passenger[];
  className?: string;
}

export const BookingReview = React.memo<BookingReviewProps>(function BookingReview({
  schedule,
  boardingPoint,
  droppingPoint,
  selectedSeats,
  passengers,
  className,
}) {
  const { operator, busType, route } = schedule;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Bus & Journey Summary Card */}
      <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-subtle sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Bus className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-slate-900">Bus & Journey Details</h2>
          </div>
          <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
            Verified Operator
          </span>
        </div>

        {/* Operator Info */}
        <div>
          <h3 className="text-lg font-black text-slate-900">{operator.name}</h3>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">{busType}</p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 bg-slate-50/70 rounded-xl p-4 border border-slate-100">
          <div className="sm:col-span-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Departure Point
            </span>
            <time className="text-lg font-black text-slate-900 block mt-0.5">
              {route.departureTime}
            </time>
            <p className="text-xs font-semibold text-slate-700">{route.origin}</p>
          </div>

          <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-slate-600 mb-1 flex items-center space-x-1">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>{route.duration}</span>
            </span>
            <div className="relative flex items-center w-full max-w-[120px]">
              <div className="h-[2px] w-full bg-slate-300" />
              <ArrowRight className="absolute right-0 h-3.5 w-3.5 text-slate-500 bg-slate-50" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 mt-1">Direct Route</span>
          </div>

          <div className="sm:col-span-4 sm:text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Arrival Point
            </span>
            <time className="text-lg font-black text-slate-900 block mt-0.5">
              {route.arrivalTime}
            </time>
            <p className="text-xs font-semibold text-slate-700">{route.destination}</p>
          </div>
        </div>
      </div>

      {/* Boarding & Dropping Points Card */}
      <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-subtle sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-slate-900">Boarding & Dropping Points</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Boarding */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block">
              Boarding Point (Pickup)
            </span>
            <h4 className="text-sm font-black text-slate-900">{boardingPoint.name}</h4>
            <p className="text-xs font-bold text-emerald-700 flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {boardingPoint.time}
            </p>
            <p className="text-xs text-slate-600">{boardingPoint.address}</p>
          </div>

          {/* Dropping */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800 block">
              Dropping Point (Dropoff)
            </span>
            <h4 className="text-sm font-black text-slate-900">{droppingPoint.name}</h4>
            <p className="text-xs font-bold text-blue-700 flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {droppingPoint.time}
            </p>
            <p className="text-xs text-slate-600">{droppingPoint.address}</p>
          </div>
        </div>
      </div>

      {/* Passenger & Seat Mapping Summary */}
      <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-subtle sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-slate-900">Passenger & Seat Details</h2>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
          </span>
        </div>

        <div className="space-y-3">
          {selectedSeats.map((seat, idx) => {
            const p = passengers.find((passenger) => passenger.seatId === seat.id);

            return (
              <div
                key={seat.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="inline-flex h-8 w-12 items-center justify-center rounded-lg bg-primary text-white font-black text-xs shrink-0">
                    {seat.label}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {p?.fullName || `Passenger ${idx + 1}`}
                    </h4>
                    <p className="text-slate-600 text-[11px] font-medium mt-0.5">
                      Age: {p?.age || 'N/A'} • Gender: <span className="capitalize">{p?.gender || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-slate-600 font-medium text-[11px] border-t sm:border-t-0 pt-2 sm:pt-0">
                  <p>Mobile: {p?.mobile || 'N/A'}</p>
                  <p className="truncate max-w-[200px]">Email: {p?.email || 'N/A'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
