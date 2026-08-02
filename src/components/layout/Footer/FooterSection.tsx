import * as React from 'react';
import Link from 'next/link';
import type { FooterLinkGroup } from './footer-links';

export interface FooterSectionProps {
  group: FooterLinkGroup;
}

export function FooterSection({ group }: FooterSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-heading text-sm font-semibold tracking-wider text-foreground uppercase">
        {group.title}
      </h3>
      <ul className="space-y-2">
        {group.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors duration-fast hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
