export interface EmergencyBooking {
  latitude: number;
  longitude: number;
  issueType: string;
  needAmbulance: boolean;
  requestedAmbulanceCount: number;
  needPolice: boolean;
  requestedPoliceCount: number;
  needFireBrigade: boolean;
  requestedFireTruckCount: number;
  isForSelf: boolean;
  victimPhoneNumber: string;
  notes: string;
  timestamp?: string;
  callerId?: string;
  priorityLevel?: 1 | 2 | 3; // 1 = Life-threatening, 2 = Urgent, 3 = Non-urgent
  status?: 'pending' | 'dispatched' | 'completed';
}

export interface EmergencyResponse {
  success: boolean;
  bookingId?: string;
  message: string;
  estimatedArrival?: string;
  dispatchedUnits?: {
    ambulances?: number;
    police?: number;
    fireTrucks?: number;
  };
}

export type EmergencyType = 'medical' | 'fire' | 'police' | 'other';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  landmarks?: string;
  crossStreets?: string;
}
