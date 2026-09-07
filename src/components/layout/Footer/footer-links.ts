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
  title: 'Platform Navigation',
  links: [
    { label: 'Home', href: '/' },
    { label: 'Search Buses', href: '/search' },
    { label: 'Available Routes', href: '/routes' },
    { label: 'Bus Operators', href: '/operators' },
    { label: 'My Bookings', href: '/my-bookings' },
  ],
};

export const supportLinksGroup: FooterLinkGroup = {
  title: 'Company & Support',
  links: [
    { label: 'About Bustkit', href: '/about' },
    { label: 'Contact Support', href: '/contact' },
    { label: 'Popular Routes', href: '/routes' },
  ],
};

export const socialLinksData: SocialLink[] = [
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
];

