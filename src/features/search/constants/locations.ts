import { LocationObject } from '../types/location';

export const LOCATION_DATASET: LocationObject[] = [
  {
    id: 'loc-del-isbt',
    name: 'Kashmere Gate ISBT',
    city: 'Delhi',
    state: 'DL',
    code: 'DEL',
    popular: true,
  },
  {
    id: 'loc-lko-alambagh',
    name: 'Alambagh Bus Stand',
    city: 'Lucknow',
    state: 'UP',
    code: 'LKO',
    popular: true,
  },
  {
    id: 'loc-jpr-sindhi',
    name: 'Sindhi Camp ISBT',
    city: 'Jaipur',
    state: 'RJ',
    code: 'JPR',
    popular: true,
  },
  {
    id: 'loc-bom-dadar',
    name: 'Dadar West Bus Terminal',
    city: 'Mumbai',
    state: 'MH',
    code: 'BOM',
    popular: true,
  },
  {
    id: 'loc-pnq-swargate',
    name: 'Swargate Bus Stand',
    city: 'Pune',
    state: 'MH',
    code: 'PNQ',
    popular: true,
  },
  {
    id: 'loc-blr-majestic',
    name: 'Majestic Bus Station (KSRTC)',
    city: 'Bengaluru',
    state: 'KA',
    code: 'BLR',
    popular: true,
  },
  {
    id: 'loc-hyd-mgbs',
    name: 'MGBS Bus Terminal',
    city: 'Hyderabad',
    state: 'TS',
    code: 'HYD',
    popular: true,
  },
  {
    id: 'loc-ixc-sec43',
    name: 'Sector 43 ISBT',
    city: 'Chandigarh',
    state: 'CH',
    code: 'IXC',
    popular: true,
  },
  {
    id: 'loc-ccu-esplanade',
    name: 'Esplanade Bus Stand',
    city: 'Kolkata',
    state: 'WB',
    code: 'CCU',
    popular: false,
  },
  {
    id: 'loc-amd-geetamandir',
    name: 'Geeta Mandir Bus Stand',
    city: 'Ahmedabad',
    state: 'GJ',
    code: 'AMD',
    popular: false,
  },
  {
    id: 'loc-ixb-tenzing',
    name: 'Tenzing Norgay Bus Terminus',
    city: 'Siliguri',
    state: 'WB',
    code: 'IXB',
    popular: false,
  },
];



/**
 * Finds a LocationObject by ID, city, or station code.
 */
export function findLocationByQuery(query: string): LocationObject | null {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  return (
    LOCATION_DATASET.find(
      (loc) =>
        loc.id.toLowerCase() === q ||
        loc.code.toLowerCase() === q ||
        loc.city.toLowerCase() === q ||
        loc.name.toLowerCase() === q
    ) || null
  );
}
