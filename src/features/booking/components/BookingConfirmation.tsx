'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, Ticket, Clock, ArrowLeft, Search, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookingConfirmationData } from '../types/passenger';

export interface BookingConfirmationProps {
  data: BookingConfirmationData;
  onResetBooking: () => void;
  className?: string;
}

export const BookingConfirmation = React.memo<BookingConfirmationProps>(function BookingConfirmation({
  data,
  onResetBooking,
  className,
}) {
  const {
    bookingId,
    bookingDate,
    schedule,
    boardingPoint,
    droppingPoint,
    passengers,
    fareBreakdown,
  } = data;

  const { operator, busType, route, currency } = schedule;

  return (
    <div className={cn('space-y-6 max-w-4xl mx-auto', className)}>
      {/* Hero Confirmation Card */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center shadow-subtle space-y-3">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-soft">
            <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-md mx-auto">
          Your bus seats have been successfully reserved on the frontend demo flow.
        </p>

        {/* Reference ID Badge */}
        <div className="pt-2">
          <div className="inline-flex flex-col items-center justify-center rounded-xl bg-white border border-emerald-300 px-5 py-2.5 shadow-subtle">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Booking Reference ID
            </span>
            <span className="text-xl font-black text-slate-900 tracking-wide font-mono mt-0.5">
              {bookingId}
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Details Summary Card */}
      <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-subtle sm:p-6 space-y-6">
        {/* Ticket Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Ticket className="h-5 w-5 text-primary shrink-0" />
              <h2 className="text-lg font-bold text-slate-900">E-Ticket Summary</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Issued on: {bookingDate}</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground block font-medium">Total Paid</span>
            <span className="text-2xl font-black text-primary">
              {currency}{fareBreakdown.grandTotal}
            </span>
          </div>
        </div>

        {/* Operator & Bus Info */}
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-slate-900">{operator.name}</h3>
          <p className="text-xs font-semibold text-slate-600">{busType}</p>
        </div>

        {/* Route & Timing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 bg-slate-50/70 rounded-xl p-4 border border-slate-100">
          <div className="sm:col-span-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Origin / Departure
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
            <div className="h-[2px] w-full max-w-[100px] bg-slate-300" />
            <span className="text-[10px] font-semibold text-emerald-600 mt-1">Confirmed Route</span>
          </div>

          <div className="sm:col-span-4 sm:text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Destination / Arrival
            </span>
            <time className="text-lg font-black text-slate-900 block mt-0.5">
              {route.arrivalTime}
            </time>
            <p className="text-xs font-semibold text-slate-700">{route.destination}</p>
          </div>
        </div>

        {/* Boarding & Dropping Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
              Pickup Point
            </span>
            <h4 className="font-extrabold text-slate-900">{boardingPoint.name}</h4>
            <p className="font-bold text-emerald-700">Time: {boardingPoint.time}</p>
            <p className="text-slate-600">{boardingPoint.address}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
              Dropoff Point
            </span>
            <h4 className="font-extrabold text-slate-900">{droppingPoint.name}</h4>
            <p className="font-bold text-blue-700">Time: {droppingPoint.time}</p>
            <p className="text-slate-600">{droppingPoint.address}</p>
          </div>
        </div>

        {/* Passenger List */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
            Confirmed Passengers ({passengers.length})
          </span>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {passengers.map((p) => (
              <div
                key={p.seatId}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 text-xs gap-2"
              >
                <div className="flex items-center space-x-3">
                  <span className="inline-flex h-7 w-10 items-center justify-center rounded-md bg-primary text-white font-black text-xs">
                    {p.seatLabel}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900">{p.fullName}</h4>
                    <p className="text-[11px] text-slate-500">
                      Age: {p.age} • Gender: <span className="capitalize">{p.gender}</span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-[11px] text-slate-600">
                  <p>Mobile: {p.mobile}</p>
                  <p>Email: {p.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Link
          href="/search"
          className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-xs font-bold text-slate-700 shadow-subtle hover:bg-slate-50 active:scale-95 transition-all"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search Another Bus</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onResetBooking}
            className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl border border-primary/30 bg-primary/10 px-5 text-xs font-bold text-primary shadow-subtle hover:bg-primary/20 active:scale-95 transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Book New Seats</span>
          </button>

          <Link
            href="/"
            className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl bg-slate-900 px-6 text-xs font-bold text-white shadow-subtle hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
});
