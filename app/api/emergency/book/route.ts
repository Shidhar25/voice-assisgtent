import { NextRequest, NextResponse } from 'next/server';
import type { EmergencyBooking, EmergencyResponse } from '../../../types/emergency';

// In a real implementation, this would connect to a database
let emergencyBookings: (EmergencyBooking & { bookingId: string })[] = [];

export async function POST(request: NextRequest) {
  try {
    const bookingData: EmergencyBooking = await request.json();
    
    // Validate required fields
    if (!bookingData.latitude || !bookingData.longitude) {
      return NextResponse.json(
        { success: false, message: 'Location coordinates are required' },
        { status: 400 }
      );
    }

    if (!bookingData.issueType) {
      return NextResponse.json(
        { success: false, message: 'Issue type is required' },
        { status: 400 }
      );
    }

    // Generate booking ID
    const bookingId = `EMG-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Add timestamp and default values
    const completeBooking = {
      ...bookingData,
      bookingId,
      timestamp: new Date().toISOString(),
      status: 'pending' as const,
      priorityLevel: determinePriority(bookingData) as 1 | 2 | 3,
    };

    // Store booking (in real app, this would go to database)
    emergencyBookings.push(completeBooking);

    // Calculate estimated arrival (mock calculation)
    const estimatedArrival = calculateEstimatedArrival(bookingData);

    // Count dispatched units
    const dispatchedUnits = {
      ambulances: bookingData.needAmbulance ? bookingData.requestedAmbulanceCount : 0,
      police: bookingData.needPolice ? bookingData.requestedPoliceCount : 0,
      fireTrucks: bookingData.needFireBrigade ? bookingData.requestedFireTruckCount : 0,
    };

    const response: EmergencyResponse = {
      success: true,
      bookingId,
      message: `Emergency booking created successfully. Help is being dispatched.`,
      estimatedArrival,
      dispatchedUnits,
    };

    // Log for monitoring (in real app, this would go to proper logging system)
    console.log(`Emergency booking created:`, {
      bookingId,
      location: `${bookingData.latitude}, ${bookingData.longitude}`,
      issueType: bookingData.issueType,
      priority: completeBooking.priorityLevel,
      services: dispatchedUnits,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating emergency booking:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all bookings for monitoring dashboard
  return NextResponse.json({
    success: true,
    bookings: emergencyBookings,
    total: emergencyBookings.length,
  });
}

function determinePriority(booking: EmergencyBooking): number {
  const lowPriorityKeywords = ['minor', 'non-urgent', 'information'];
  const highPriorityKeywords = ['death', 'unconscious', 'bleeding', 'fire', 'trapped', 'weapon', 'shooting'];
  
  const issueTypeLower = booking.issueType.toLowerCase();
  const notesLower = booking.notes.toLowerCase();
  
  // Check for high priority keywords
  if (highPriorityKeywords.some(keyword => 
    issueTypeLower.includes(keyword) || notesLower.includes(keyword)
  )) {
    return 1; // Life-threatening
  }
  
  // Check for low priority keywords
  if (lowPriorityKeywords.some(keyword => 
    issueTypeLower.includes(keyword) || notesLower.includes(keyword)
  )) {
    return 3; // Non-urgent
  }
  
  return 2; // Urgent (default)
}

function calculateEstimatedArrival(booking: EmergencyBooking): string {
  // Mock calculation based on priority and services needed
  let baseTime = 8; // Base 8 minutes
  
  if (booking.needAmbulance) baseTime += 2;
  if (booking.needFireBrigade) baseTime += 3;
  if (booking.needPolice) baseTime += 1;
  
  // Adjust for priority
  const priority = determinePriority(booking);
  if (priority === 1) baseTime -= 3; // Faster for life-threatening
  if (priority === 3) baseTime += 5; // Slower for non-urgent
  
  return `${Math.max(3, baseTime)} minutes`;
}
