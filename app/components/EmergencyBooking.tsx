"use client";
import { useState, useEffect } from 'react';
import type { EmergencyBooking as EmergencyBookingType, EmergencyResponse } from '../types/emergency';

interface EmergencyBookingProps {
  onBookingCreated?: (response: EmergencyResponse) => void;
}

export default function EmergencyBooking({ onBookingCreated: _onBookingCreated }: EmergencyBookingProps) {
  const [bookings, setBookings] = useState<(EmergencyBookingType & { bookingId: string })[]>([]);
  const [loading, _setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/emergency/book');
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
    // Refresh bookings every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);



  const getPriorityColor = (priority?: number) => {
    switch (priority) {
      case 1: return 'text-red-500 bg-red-100';
      case 2: return 'text-yellow-600 bg-yellow-100';
      case 3: return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority?: number) => {
    switch (priority) {
      case 1: return 'CRITICAL';
      case 2: return 'URGENT';
      case 3: return 'NON-URGENT';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="emergency-booking-panel bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Emergency Dispatch Center</h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">Active</span>
        </div>
      </div>

      {loading && (
        <div className="mb-4 p-3 bg-blue-900 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Processing emergency booking...</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-300">Recent Emergency Calls</h3>
        
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🚨</div>
            <p>No active emergency calls</p>
            <p className="text-sm">Standing by for emergencies</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-3">
            {bookings.slice().reverse().map((booking) => (
              <div
                key={booking.bookingId}
                className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-500"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-sm text-gray-400">
                    #{booking.bookingId}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(booking.priorityLevel)}`}>
                    {getPriorityText(booking.priorityLevel)}
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="font-semibold text-white">{booking.issueType}</div>
                  <div className="text-sm text-gray-300">
                    📍 {booking.latitude.toFixed(4)}, {booking.longitude.toFixed(4)}
                  </div>
                  {booking.notes && (
                    <div className="text-sm text-gray-400 mt-1">
                      Note: {booking.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {booking.needAmbulance && (
                    <span className="px-2 py-1 bg-red-700 text-white text-xs rounded">
                      🚑 Ambulance x{booking.requestedAmbulanceCount}
                    </span>
                  )}
                  {booking.needPolice && (
                    <span className="px-2 py-1 bg-blue-700 text-white text-xs rounded">
                      🚔 Police x{booking.requestedPoliceCount}
                    </span>
                  )}
                  {booking.needFireBrigade && (
                    <span className="px-2 py-1 bg-orange-700 text-white text-xs rounded">
                      🚒 Fire x{booking.requestedFireTruckCount}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>📞 {booking.victimPhoneNumber}</span>
                  <span>{booking.timestamp ? new Date(booking.timestamp).toLocaleTimeString() : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
