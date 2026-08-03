export interface PopularRoute {
  id: string;
  origin: string;
  destination: string;
  startingPrice: number;
  currency: string;
  estimatedDuration: string;
  dailyBusesCount: number;
  imageUrl?: string;
  popularTag?: string;
}
