'use client';

import * as React from 'react';
import { Tag, Clock, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Offer } from '../types/promotion';

export interface OfferCardProps {
  offer: Offer;
  className?: string;
}

export const OfferCard = React.memo<OfferCardProps>(function OfferCard({ offer, className }) {
  const { code, title, description, discountBadge, validUntil, category, bgGradient } = offer;
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyCode = React.useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [code]);

  return (
    <Card
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-white p-5 shadow-subtle transition-all duration-normal hover:border-slate-300 hover:shadow-hover md:p-6',
        className
      )}
    >
      {/* Background Subtle Gradient Overlay */}
      {bgGradient && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br pointer-events-none opacity-60 transition-opacity group-hover:opacity-100',
            bgGradient
          )}
          aria-hidden="true"
        />
      )}

      <article className="relative z-10 flex flex-col justify-between h-full space-y-4">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="default" className="bg-primary font-bold text-xs px-2.5 py-0.5 rounded-full">
            {discountBadge}
          </Badge>
          <span className="text-[11px] font-semibold text-muted-foreground bg-slate-100 px-2.5 py-1 rounded-full">
            {category}
          </span>
        </div>

        {/* Title & Copy */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Code Box & Validity */}
        <div className="pt-2 space-y-3">
          {/* Promo Code Box */}
          <div className="flex items-center justify-between rounded-xl border border-dashed border-primary/40 bg-slate-50 p-2.5">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
              <code className="text-xs font-black tracking-wider text-slate-900 uppercase">
                {code}
              </code>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              aria-label={`Copy promo code ${code}`}
              className={cn(
                'inline-flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all',
                isCopied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 border border-border hover:bg-slate-100 shadow-subtle active:scale-95'
              )}
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Validity Information */}
          <div className="flex items-center space-x-1.5 text-[11px] font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Valid until <time>{validUntil}</time></span>
          </div>
        </div>
      </article>
    </Card>
  );
});
