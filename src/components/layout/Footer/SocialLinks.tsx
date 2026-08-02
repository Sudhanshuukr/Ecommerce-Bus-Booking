import * as React from 'react';
import { socialLinksData, type SocialLink } from './footer-links';

export interface SocialLinksProps {
  items?: SocialLink[];
}

export function SocialLinks({ items = socialLinksData }: SocialLinksProps) {
  return (
    <div className="flex items-center space-x-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors duration-fast hover:border-slate-300 hover:bg-slate-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
