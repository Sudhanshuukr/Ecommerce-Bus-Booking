export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountBadge: string;
  validUntil: string;
  category: 'First Booking' | 'Weekend Special' | 'Routes Discount' | 'Festive Deal';
  bgGradient?: string;
}
