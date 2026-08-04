import * as React from 'react';
import { Star, CheckCircle2, ArrowRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Testimonial } from '../types/testimonial';

export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const { name, role, initials, avatarUrl, route, rating, reviewText, verified } = testimonial;

  return (
    <article
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <div className="space-y-4">
        {/* Rating Stars & Quote Icon */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-1"
            aria-label={`Rating: ${rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          <Quote className="h-6 w-6 text-slate-300/80 dark:text-slate-700" aria-hidden="true" />
        </div>

        {/* Review Text */}
        <p className="text-sm italic leading-relaxed text-slate-700 dark:text-slate-300">
          &ldquo;{reviewText}&rdquo;
        </p>
      </div>

      {/* Footer Info: User & Route */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
        {/* Route Badge */}
        <div className="inline-flex items-center space-x-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <span>{route.from}</span>
          <ArrowRight className="h-3 w-3 text-slate-400" />
          <span>{route.to}</span>
        </div>

        {/* Author Details */}
        <div className="flex items-center space-x-3">
          {avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarUrl}
              alt={name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/10"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-sm text-primary ring-2 ring-primary/20">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {name}
              </h4>
              {verified && (
                <CheckCircle2
                  className="h-4 w-4 text-emerald-500 shrink-0"
                  aria-label="Verified Customer"
                />
              )}
            </div>
            {role && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{role}</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
