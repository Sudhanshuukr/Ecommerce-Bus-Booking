import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const quickLinksGroup: FooterLinkGroup = {
  title: 'Quick Links',
  links: [
    { label: 'Home', href: '/' },
    { label: 'Search Buses', href: '/search' },
    { label: 'Popular Routes', href: '/routes' },
  ],
};

export const supportLinksGroup: FooterLinkGroup = {
  title: 'Explore & Book',
  links: [
    { label: 'Find Tickets', href: '/search' },
    { label: 'Featured Routes', href: '/routes' },
    { label: 'Book Travel', href: '/' },
  ],
};

export const socialLinksData: SocialLink[] = [
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
];

