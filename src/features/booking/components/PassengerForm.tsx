'use client';

import * as React from 'react';
import { User, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Seat } from '../types/seat';
import { Passenger, PassengerFormErrors, Gender } from '../types/passenger';

export interface PassengerFormProps {
  selectedSeats: Seat[];
  passengers: Passenger[];
  errors: Record<string, PassengerFormErrors>;
  onChangePassenger: (seatId: string, updated: Partial<Passenger>) => void;
  className?: string;
}

export function validatePassenger(passenger: Passenger): PassengerFormErrors {
  const errors: PassengerFormErrors = {};

  if (!passenger.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (passenger.fullName.trim().length > 100) {
    errors.fullName = 'Full name cannot exceed 100 characters';
  }

  const ageNum = parseInt(passenger.age, 10);
  if (!passenger.age) {
    errors.age = 'Age is required';
  } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
    errors.age = 'Enter a valid age between 1 and 120';
  }

  if (!passenger.gender) {
    errors.gender = 'Gender selection is required';
  }

  const mobileClean = passenger.mobile.trim();
  if (!mobileClean) {
    errors.mobile = 'Mobile number is required';
  } else if (!/^\d{10}$/.test(mobileClean)) {
    errors.mobile = 'Mobile number must be exactly 10 digits';
  }

  const emailClean = passenger.email.trim();
  if (!emailClean) {
    errors.email = 'Email address is required';
  } else if (emailClean.length > 254) {
    errors.email = 'Email cannot exceed 254 characters';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
    errors.email = 'Enter a valid email address';
  }

  return errors;
}

export const PassengerForm = React.memo<PassengerFormProps>(function PassengerForm({
  selectedSeats,
  passengers,
  errors,
  onChangePassenger,
  className,
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {selectedSeats.map((seat, index) => {
        const passenger = passengers.find((p) => p.seatId === seat.id) || {
          seatId: seat.id,
          seatLabel: seat.label,
          fullName: '',
          age: '',
          gender: '',
          mobile: '',
          email: '',
        };

        const seatErrors = errors[seat.id] || {};

        return (
          <div
            key={seat.id}
            className="rounded-2xl border border-border/80 bg-white p-5 shadow-subtle sm:p-6 space-y-5"
          >
            {/* Passenger Header & Seat Tag */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-black text-xs">
                  {index + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Passenger {index + 1} Details
                </h3>
              </div>
              <span className="inline-flex items-center rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black text-primary">
                Seat {seat.label} ({seat.type === 'sleeper' ? 'Sleeper' : 'Seater'})
              </span>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-8 space-y-1.5">
                <label
                  htmlFor={`name-${seat.id}`}
                  className="block text-xs font-bold text-slate-700"
                >
                  Full Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    id={`name-${seat.id}`}
                    type="text"
                    maxLength={100}
                    placeholder="Enter full name as on ID"
                    value={passenger.fullName}
                    onChange={(e) => onChangePassenger(seat.id, { fullName: e.target.value })}
                    className={cn(
                      'w-full h-10 rounded-xl border bg-white pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                      seatErrors.fullName ? 'border-destructive' : 'border-slate-300'
                    )}
                  />
                </div>
                {seatErrors.fullName && (
                  <p className="flex items-center space-x-1 text-[11px] font-semibold text-destructive pt-0.5">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{seatErrors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Age */}
              <div className="sm:col-span-4 space-y-1.5">
                <label
                  htmlFor={`age-${seat.id}`}
                  className="block text-xs font-bold text-slate-700"
                >
                  Age <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    id={`age-${seat.id}`}
                    type="number"
                    min={1}
                    max={120}
                    maxLength={3}
                    placeholder="Age (e.g. 28)"
                    value={passenger.age}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                      onChangePassenger(seat.id, { age: val });
                    }}
                    className={cn(
                      'w-full h-10 rounded-xl border bg-white pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                      seatErrors.age ? 'border-destructive' : 'border-slate-300'
                    )}
                  />
                </div>
                {seatErrors.age && (
                  <p className="flex items-center space-x-1 text-[11px] font-semibold text-destructive pt-0.5">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{seatErrors.age}</span>
                  </p>
                )}
              </div>

              {/* Gender Radio Buttons */}
              <div className="sm:col-span-12 space-y-1.5">
                <span className="block text-xs font-bold text-slate-700">
                  Gender <span className="text-destructive">*</span>
                </span>
                <div className="flex flex-wrap gap-3 pt-0.5">
                  {(['male', 'female', 'other'] as Gender[]).map((genderOption) => (
                    <label
                      key={genderOption}
                      className={cn(
                        'flex items-center space-x-2 rounded-xl border px-3.5 py-2 cursor-pointer text-xs font-semibold transition-all',
                        passenger.gender === genderOption
                          ? 'border-primary bg-primary/10 text-primary font-bold shadow-subtle'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                      )}
                    >
                      <input
                        type="radio"
                        name={`gender-${seat.id}`}
                        value={genderOption}
                        checked={passenger.gender === genderOption}
                        onChange={() => onChangePassenger(seat.id, { gender: genderOption })}
                        className="sr-only"
                      />
                      <span className="capitalize">{genderOption}</span>
                    </label>
                  ))}
                </div>
                {seatErrors.gender && (
                  <p className="flex items-center space-x-1 text-[11px] font-semibold text-destructive pt-0.5">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{seatErrors.gender}</span>
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="sm:col-span-6 space-y-1.5">
                <label
                  htmlFor={`mobile-${seat.id}`}
                  className="block text-xs font-bold text-slate-700"
                >
                  Mobile Number <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    id={`mobile-${seat.id}`}
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={passenger.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      onChangePassenger(seat.id, { mobile: val });
                    }}
                    className={cn(
                      'w-full h-10 rounded-xl border bg-white pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                      seatErrors.mobile ? 'border-destructive' : 'border-slate-300'
                    )}
                  />
                </div>
                {seatErrors.mobile && (
                  <p className="flex items-center space-x-1 text-[11px] font-semibold text-destructive pt-0.5">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{seatErrors.mobile}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="sm:col-span-6 space-y-1.5">
                <label
                  htmlFor={`email-${seat.id}`}
                  className="block text-xs font-bold text-slate-700"
                >
                  Email Address <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    id={`email-${seat.id}`}
                    type="email"
                    maxLength={254}
                    placeholder="E-ticket will be sent here"
                    value={passenger.email}
                    onChange={(e) => onChangePassenger(seat.id, { email: e.target.value })}
                    className={cn(
                      'w-full h-10 rounded-xl border bg-white pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                      seatErrors.email ? 'border-destructive' : 'border-slate-300'
                    )}
                  />
                </div>
                {seatErrors.email && (
                  <p className="flex items-center space-x-1 text-[11px] font-semibold text-destructive pt-0.5">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{seatErrors.email}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
