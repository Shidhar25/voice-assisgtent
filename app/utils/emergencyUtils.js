/**
 * Validates and formats emergency data for API submission
 * @param {Object} emergencyData - Raw emergency data from voice assistant
 * @returns {Object} Formatted emergency data ready for API submission
 */
export const formatEmergencyData = (emergencyData) => {
  // Ensure all required fields are present and properly typed
  const formattedData = {
    latitude: Number(emergencyData.latitude) || 0,
    longitude: Number(emergencyData.longitude) || 0,
    issueType: String(emergencyData.issueType || ''),
    needAmbulance: Boolean(emergencyData.needAmbulance),
    requestedAmbulanceCount: Number(emergencyData.requestedAmbulanceCount) || 0,
    needPolice: Boolean(emergencyData.needPolice),
    requestedPoliceCount: Number(emergencyData.requestedPoliceCount) || 0,
    needFireBrigade: Boolean(emergencyData.needFireBrigade),
    requestedFireTruckCount: Number(emergencyData.requestedFireTruckCount) || 0,
    isForSelf: Boolean(emergencyData.isForSelf),
    victimPhoneNumber: String(emergencyData.victimPhoneNumber || ''),
    notes: String(emergencyData.notes || '')
  };

  return formattedData;
};

/**
 * Validates that all required emergency fields are present
 * @param {Object} emergencyData - Emergency data to validate
 * @returns {Object} Validation result with isValid boolean and missingFields array
 */
export const validateEmergencyData = (emergencyData) => {
  const requiredFields = [
    'latitude', 'longitude', 'issueType', 'needAmbulance', 
    'requestedAmbulanceCount', 'needPolice', 'requestedPoliceCount',
    'needFireBrigade', 'requestedFireTruckCount', 'isForSelf',
    'victimPhoneNumber', 'notes'
  ];

  const missingFields = requiredFields.filter(field => {
    const value = emergencyData[field];
    return value === undefined || value === null || value === '';
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Creates the exact JSON structure required for the booking API
 * @param {Object} emergencyData - Emergency data from voice assistant
 * @returns {Object} Properly formatted JSON for API submission
 */
export const createBookingRequest = (emergencyData) => {
  const formattedData = formatEmergencyData(emergencyData);
  
  // Return the exact structure required by the API
  return {
    latitude: formattedData.latitude,
    longitude: formattedData.longitude,
    issueType: formattedData.issueType,
    needAmbulance: formattedData.needAmbulance,
    requestedAmbulanceCount: formattedData.requestedAmbulanceCount,
    needPolice: formattedData.needPolice,
    requestedPoliceCount: formattedData.requestedPoliceCount,
    needFireBrigade: formattedData.needFireBrigade,
    requestedFireTruckCount: formattedData.requestedFireTruckCount,
    isForSelf: formattedData.isForSelf,
    victimPhoneNumber: formattedData.victimPhoneNumber,
    notes: formattedData.notes
  };
}; 