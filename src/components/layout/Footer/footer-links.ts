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
    { label: 'Routes', href: '/routes' },
    { label: 'Operators', href: '/operators' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
};

export const supportLinksGroup: FooterLinkGroup = {
  title: 'Support',
  links: [
    { label: 'Help Center', href: '/help' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
  ],
};

export const socialLinksData: SocialLink[] = [
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
];
