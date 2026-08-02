export interface NavItem {
  label: string;
  href: string;
}

export const mainNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Routes', href: '/routes' },
  { label: 'Operators', href: '/operators' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
