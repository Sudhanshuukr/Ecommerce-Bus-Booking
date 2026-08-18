export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      operators: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      buses: {
        Row: {
          id: string;
          operator_id: string;
          bus_number: string;
          bus_type: string;
          total_seats: number;
          amenities: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          operator_id: string;
          bus_number: string;
          bus_type: string;
          total_seats: number;
          amenities?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          operator_id?: string;
          bus_number?: string;
          bus_type?: string;
          total_seats?: number;
          amenities?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      bus_seats: {
        Row: {
          id: string;
          bus_id: string;
          seat_label: string;
          deck: 'lower' | 'upper';
          row: number;
          column: number;
          seat_type: 'seater' | 'sleeper';
          created_at: string;
        };
        Insert: {
          id?: string;
          bus_id: string;
          seat_label: string;
          deck?: 'lower' | 'upper';
          row: number;
          column: number;
          seat_type?: 'seater' | 'sleeper';
          created_at?: string;
        };
        Update: {
          id?: string;
          bus_id?: string;
          seat_label?: string;
          deck?: 'lower' | 'upper';
          row?: number;
          column?: number;
          seat_type?: 'seater' | 'sleeper';
          created_at?: string;
        };
      };
      schedules: {
        Row: {
          id: string;
          operator_id: string;
          bus_id: string;
          origin: string;
          destination: string;
          departure_time: string;
          arrival_time: string;
          duration_minutes: number;
          price: number;
          currency: string;
          total_seats: number;
          badge: 'Fastest' | 'Cheapest' | 'Top Rated' | 'Popular' | null;
          status: 'scheduled' | 'departed' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          operator_id: string;
          bus_id: string;
          origin: string;
          destination: string;
          departure_time: string;
          arrival_time: string;
          duration_minutes: number;
          price: number;
          currency?: string;
          total_seats: number;
          badge?: 'Fastest' | 'Cheapest' | 'Top Rated' | 'Popular' | null;
          status?: 'scheduled' | 'departed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          operator_id?: string;
          bus_id?: string;
          origin?: string;
          destination?: string;
          departure_time?: string;
          arrival_time?: string;
          duration_minutes?: number;
          price?: number;
          currency?: string;
          total_seats?: number;
          badge?: 'Fastest' | 'Cheapest' | 'Top Rated' | 'Popular' | null;
          status?: 'scheduled' | 'departed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      boarding_points: {
        Row: {
          id: string;
          schedule_id: string;
          name: string;
          time: string;
          address: string;
          sequence_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          schedule_id: string;
          name: string;
          time: string;
          address: string;
          sequence_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          schedule_id?: string;
          name?: string;
          time?: string;
          address?: string;
          sequence_order?: number;
          created_at?: string;
        };
      };
      dropping_points: {
        Row: {
          id: string;
          schedule_id: string;
          name: string;
          time: string;
          address: string;
          sequence_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          schedule_id: string;
          name: string;
          time: string;
          address: string;
          sequence_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          schedule_id?: string;
          name?: string;
          time?: string;
          address?: string;
          sequence_order?: number;
          created_at?: string;
        };
      };
      schedule_seats: {
        Row: {
          id: string;
          schedule_id: string;
          bus_seat_id: string;
          price: number;
          status: 'available' | 'reserved' | 'occupied';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          schedule_id: string;
          bus_seat_id: string;
          price: number;
          status?: 'available' | 'reserved' | 'occupied';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          schedule_id?: string;
          bus_seat_id?: string;
          price?: number;
          status?: 'available' | 'reserved' | 'occupied';
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          phone: string | null;
          role: 'customer' | 'platform_admin' | 'operator' | 'driver' | 'developer' | 'admin';
          operator_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          phone?: string | null;
          role?: 'customer' | 'platform_admin' | 'operator' | 'driver' | 'developer' | 'admin';
          operator_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string;
          phone?: string | null;
          role?: 'customer' | 'platform_admin' | 'operator' | 'driver' | 'developer' | 'admin';
          operator_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          booking_reference: string;
          user_id: string | null;
          schedule_id: string;
          boarding_point_id: string;
          dropping_point_id: string;
          seat_count: number;
          seat_price_total: number;
          service_fee: number;
          tax_amount: number;
          grand_total: number;
          currency: string;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_reference: string;
          user_id?: string | null;
          schedule_id: string;
          boarding_point_id: string;
          dropping_point_id: string;
          seat_count: number;
          seat_price_total: number;
          service_fee?: number;
          tax_amount: number;
          grand_total: number;
          currency?: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_reference?: string;
          user_id?: string | null;
          schedule_id?: string;
          boarding_point_id?: string;
          dropping_point_id?: string;
          seat_count?: number;
          seat_price_total?: number;
          service_fee?: number;
          tax_amount?: number;
          grand_total?: number;
          currency?: string;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      passengers: {
        Row: {
          id: string;
          booking_id: string;
          schedule_seat_id: string;
          full_name: string;
          age: number;
          gender: 'male' | 'female' | 'other';
          mobile: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          schedule_seat_id: string;
          full_name: string;
          age: number;
          gender: 'male' | 'female' | 'other';
          mobile: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          schedule_seat_id?: string;
          full_name?: string;
          age?: number;
          gender?: 'male' | 'female' | 'other';
          mobile?: string;
          email?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      create_booking: {
        Args: {
          p_schedule_id: string;
          p_boarding_point_id: string;
          p_dropping_point_id: string;
          p_user_id: string | null;
          p_booking_reference: string;
          p_passengers: Json;
        };
        Returns: Json;
      };
    };
  };
}
