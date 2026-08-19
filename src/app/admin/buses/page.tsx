import { Metadata } from 'next';
import { Bus, Wifi, Zap, Tv, Coffee } from 'lucide-react';
import { AdminHeader } from '@/components/layout/Admin/AdminHeader';
import { Badge } from '@/components/ui/badge';
import { getAdminBuses } from '@/lib/admin/fetchers';

export const metadata: Metadata = {
  title: 'Bus Fleet Management - Platform Admin',
  description: 'View registered bus fleet across partner operators.',
};

export default async function AdminBusesPage() {
  const buses = await getAdminBuses();

  const renderAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return <Wifi key={amenity} className="h-3 w-3" />;
    if (lower.includes('power') || lower.includes('usb') || lower.includes('outlet'))
      return <Zap key={amenity} className="h-3 w-3" />;
    if (lower.includes('screen') || lower.includes('tv'))
      return <Tv key={amenity} className="h-3 w-3" />;
    if (lower.includes('snack') || lower.includes('water'))
      return <Coffee key={amenity} className="h-3 w-3" />;
    return null;
  };

  return (
    <div className="flex-1 space-y-6 pb-10">
      <AdminHeader
        title="Bus Fleet Management"
        subtitle="Registered vehicle fleet, seating layout capabilities, and amenity configurations."
      />

      <main className="px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900">Registered Fleet Buses</h2>
            <Badge variant="secondary" className="font-semibold text-xs rounded-full px-2.5 py-0.5">
              {buses.length} Total Vehicles
            </Badge>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Bus Number</th>
                  <th className="py-3.5 px-4">Operator</th>
                  <th className="py-3.5 px-4">Bus Type</th>
                  <th className="py-3.5 px-4">Total Seats</th>
                  <th className="py-3.5 px-4">Amenities</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {buses.length > 0 ? (
                  buses.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center space-x-2">
                          <Bus className="h-4 w-4 text-primary shrink-0" />
                          <span>{b.busNumber}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{b.operatorName}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{b.busType}</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {b.totalSeats} Seats
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {b.amenities.map((am) => (
                            <span
                              key={am}
                              className="inline-flex items-center space-x-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                            >
                              {renderAmenityIcon(am)}
                              <span>{am}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(b.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                      No fleet buses found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
