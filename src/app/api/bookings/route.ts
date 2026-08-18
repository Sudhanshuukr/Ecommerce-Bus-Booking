import { NextRequest } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentAuthUser } from '@/lib/auth/server';
import { apiSuccess, apiError } from '@/lib/api/response';

interface IncomingPassenger {
  seatId: string;
  fullName: string;
  age: number | string;
  gender: 'male' | 'female' | 'other';
  mobile: string;
  email: string;
}

interface BookingRequestBody {
  scheduleId: string;
  boardingPointId: string;
  droppingPointId: string;
  passengers: IncomingPassenger[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\d{10}$/;

function validatePassenger(p: IncomingPassenger, index: number): string | null {
  if (!p || typeof p !== 'object') {
    return `Passenger at position ${index + 1} is invalid.`;
  }
  if (!p.seatId || typeof p.seatId !== 'string' || p.seatId.trim() === '') {
    return `Passenger at position ${index + 1} is missing a valid seatId.`;
  }
  if (!p.fullName || typeof p.fullName !== 'string' || p.fullName.trim().length === 0) {
    return `Passenger ${index + 1}: Full name is required.`;
  }
  if (p.fullName.trim().length > 100) {
    return `Passenger ${index + 1}: Full name must not exceed 100 characters.`;
  }

  const numericAge = typeof p.age === 'number' ? p.age : parseInt(String(p.age), 10);
  if (isNaN(numericAge) || numericAge < 1 || numericAge > 120) {
    return `Passenger ${index + 1}: Age must be a number between 1 and 120.`;
  }

  if (!['male', 'female', 'other'].includes(p.gender)) {
    return `Passenger ${index + 1}: Gender must be 'male', 'female', or 'other'.`;
  }

  const cleanMobile = String(p.mobile || '').trim();
  if (!MOBILE_REGEX.test(cleanMobile)) {
    return `Passenger ${index + 1}: Mobile number must be exactly 10 digits.`;
  }

  const cleanEmail = String(p.email || '').trim();
  if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 254) {
    return `Passenger ${index + 1}: A valid email address (max 254 characters) is required.`;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    let body: BookingRequestBody;
    try {
      body = await request.json();
    } catch {
      return apiError('Invalid JSON request body.', 'INVALID_JSON', 400);
    }

    const { scheduleId, boardingPointId, droppingPointId, passengers } = body || {};

    if (!scheduleId || typeof scheduleId !== 'string' || scheduleId.trim() === '') {
      return apiError('scheduleId is required.', 'INVALID_SCHEDULE_ID', 400);
    }
    if (!boardingPointId || typeof boardingPointId !== 'string' || boardingPointId.trim() === '') {
      return apiError('boardingPointId is required.', 'INVALID_BOARDING_POINT_ID', 400);
    }
    if (!droppingPointId || typeof droppingPointId !== 'string' || droppingPointId.trim() === '') {
      return apiError('droppingPointId is required.', 'INVALID_DROPPING_POINT_ID', 400);
    }
    if (!Array.isArray(passengers) || passengers.length === 0) {
      return apiError('passengers array must contain at least one passenger.', 'INVALID_PASSENGERS', 400);
    }

    // Enforce passenger field validations
    for (let i = 0; i < passengers.length; i++) {
      const validationError = validatePassenger(passengers[i], i);
      if (validationError) {
        return apiError(validationError, 'INVALID_PASSENGER', 400);
      }
    }

    // Check for duplicate seat selections in request
    const seatIdSet = new Set<string>();
    for (const p of passengers) {
      const cleanSeatId = p.seatId.trim();
      if (seatIdSet.has(cleanSeatId)) {
        return apiError(`Duplicate seat selection '${cleanSeatId}' in request.`, 'DUPLICATE_SEAT_REQUEST', 400);
      }
      seatIdSet.add(cleanSeatId);
    }

    const supabase = getSupabaseServerClient();

    // Check for optional authenticated session (supports guest booking when null)
    let authenticatedUserId: string | null = null;
    try {
      const authSession = await getCurrentAuthUser(request);
      if (authSession?.user?.id) {
        authenticatedUserId = authSession.user.id;
      }
    } catch {
      // Guest booking fallback
      authenticatedUserId = null;
    }

    // Generate unique booking reference: BB-2026-XXXXXX
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const bookingReference = `BB-${new Date().getFullYear()}-${randomDigits}`;

    // Execute atomic PostgreSQL RPC function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('create_booking', {
      p_schedule_id: scheduleId.trim(),
      p_boarding_point_id: boardingPointId.trim(),
      p_dropping_point_id: droppingPointId.trim(),
      p_user_id: authenticatedUserId,
      p_booking_reference: bookingReference,
      p_passengers: passengers.map((p) => ({
        seatId: p.seatId.trim(),
        fullName: p.fullName.trim(),
        age: typeof p.age === 'number' ? p.age : parseInt(String(p.age), 10),
        gender: p.gender,
        mobile: String(p.mobile).trim(),
        email: String(p.email).trim().toLowerCase(),
      })),
    });

    if (error) {
      console.error('[POST /api/bookings] RPC Error:', error);

      const msg = error.message || '';
      if (msg.includes('SEAT_UNAVAILABLE')) {
        return apiError('One or more selected seats are no longer available.', 'SEAT_UNAVAILABLE', 409);
      }
      if (msg.includes('INVALID_BOARDING_POINT')) {
        return apiError('Selected boarding point does not belong to this schedule.', 'INVALID_BOARDING_POINT', 400);
      }
      if (msg.includes('INVALID_DROPPING_POINT')) {
        return apiError('Selected dropping point does not belong to this schedule.', 'INVALID_DROPPING_POINT', 400);
      }
      if (msg.includes('SCHEDULE_NOT_FOUND')) {
        return apiError('Bus schedule not found.', 'SCHEDULE_NOT_FOUND', 404);
      }
      if (msg.includes('INVALID_SEAT')) {
        return apiError('One or more selected seats are invalid for this schedule.', 'INVALID_SEAT', 400);
      }

      return apiError('Unable to complete booking transaction in database.', 'BOOKING_CREATION_FAILED', 500);
    }

    return apiSuccess(data, 201);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[POST /api/bookings] Unexpected server error:', errorMessage);
    return apiError('An unexpected server error occurred while processing booking.', 'INTERNAL_SERVER_ERROR', 500);
  }
}
