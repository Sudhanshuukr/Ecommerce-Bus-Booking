export interface WhyUsFeature {
  id: string;
  title: string;
  description: string;
  iconName: 'ShieldCheck' | 'Clock' | 'Ticket' | 'Headphones' | 'Sparkles' | 'CreditCard' | 'RefreshCw' | 'MapPin';
  badgeText?: string;
}

export interface WhyUsStat {
  id: string;
  label: string;
  value: string;
}

