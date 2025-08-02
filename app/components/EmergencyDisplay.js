"use client";

import { useState, useEffect } from "react";
import { validateEmergencyData } from "../utils/emergencyUtils";

const EmergencyDisplay = ({ emergencyData, onBookEmergency }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  if (!emergencyData) return null;

  // Initialize edited data when emergency data changes
  useEffect(() => {
    if (emergencyData) {
      setEditedData({ ...emergencyData });
    }
  }, [emergencyData]);

  const getServiceIcon = (service) => {
    switch (service) {
      case 'ambulance': return '🚑';
      case 'police': return '🚔';
      case 'fire': return '🚒';
      default: return '🚨';
    }
  };

  const getIssueTypeColor = (issueType) => {
    switch (issueType?.toLowerCase()) {
      case 'fire': return 'text-red-500';
      case 'medical': return 'text-blue-500';
      case 'accident': return 'text-yellow-500';
      case 'theft': return 'text-purple-500';
      default: return 'text-gray-300';
    }
  };

  const handleConfirm = () => {
    setIsConfirming(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    setEditedData({ ...editedData });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData({ ...emergencyData });
  };

  const handleFinalConfirm = () => {
    onBookEmergency(editedData);
  };

  const handleCancel = () => {
    onBookEmergency(null);
  };

  const updateField = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const dataToShow = editedData || emergencyData;

  // Check for missing required parameters using utility function
  const validation = validateEmergencyData(dataToShow);
  const missingFields = validation.missingFields;
  const hasMissingFields = !validation.isValid;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🚨</span>
          <h2 className="text-xl font-bold text-red-400">
            {isConfirming ? 'Confirm Emergency Request' : 
             isEditing ? 'Edit Emergency Details' : 
             'Emergency Request'}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Validation Warning */}
          {hasMissingFields && (
            <div className="bg-yellow-900 border border-yellow-600 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">⚠️</span>
                <h3 className="font-semibold text-yellow-400">Missing Information</h3>
              </div>
              <p className="text-yellow-300 text-sm mb-2">
                The following required information is missing:
              </p>
              <ul className="text-yellow-300 text-sm space-y-1">
                {missingFields.map(field => (
                  <li key={field} className="flex items-center gap-2">
                    <span>•</span>
                    <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </li>
                ))}
              </ul>
              <p className="text-yellow-300 text-sm mt-2">
                Please provide this information before proceeding with the emergency request.
              </p>
            </div>
          )}

          {/* Issue Type */}
          <div className="bg-gray-700 p-3 rounded">
            <h3 className="font-semibold text-white mb-1">Issue Type</h3>
            {isEditing ? (
              <input
                type="text"
                value={dataToShow.issueType || ''}
                onChange={(e) => updateField('issueType', e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                placeholder="Describe the emergency"
              />
            ) : (
              <p className={`text-lg font-medium ${getIssueTypeColor(dataToShow.issueType)}`}>
                {dataToShow.issueType || 'Not specified'}
              </p>
            )}
          </div>

          {/* Services Needed */}
          <div className="bg-gray-700 p-3 rounded">
            <h3 className="font-semibold text-white mb-2">Services Requested</h3>
            <div className="space-y-3">
              {/* Ambulance */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🚑</span>
                  <span>Ambulance</span>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dataToShow.needAmbulance || false}
                      onChange={(e) => updateField('needAmbulance', e.target.checked)}
                      className="w-4 h-4"
                    />
                    {dataToShow.needAmbulance && (
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={dataToShow.requestedAmbulanceCount || 1}
                        onChange={(e) => updateField('requestedAmbulanceCount', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center"
                      />
                    )}
                  </div>
                ) : (
                  dataToShow.needAmbulance && (
                    <span className="text-blue-300">({dataToShow.requestedAmbulanceCount || 1})</span>
                  )
                )}
              </div>

              {/* Police */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🚔</span>
                  <span>Police</span>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dataToShow.needPolice || false}
                      onChange={(e) => updateField('needPolice', e.target.checked)}
                      className="w-4 h-4"
                    />
                    {dataToShow.needPolice && (
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={dataToShow.requestedPoliceCount || 1}
                        onChange={(e) => updateField('requestedPoliceCount', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center"
                      />
                    )}
                  </div>
                ) : (
                  dataToShow.needPolice && (
                    <span className="text-blue-300">({dataToShow.requestedPoliceCount || 1})</span>
                  )
                )}
              </div>

              {/* Fire Brigade */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🚒</span>
                  <span>Fire Brigade</span>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dataToShow.needFireBrigade || false}
                      onChange={(e) => updateField('needFireBrigade', e.target.checked)}
                      className="w-4 h-4"
                    />
                    {dataToShow.needFireBrigade && (
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={dataToShow.requestedFireTruckCount || 1}
                        onChange={(e) => updateField('requestedFireTruckCount', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-center"
                      />
                    )}
                  </div>
                ) : (
                  dataToShow.needFireBrigade && (
                    <span className="text-red-300">({dataToShow.requestedFireTruckCount || 1})</span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Victim Information */}
          <div className="bg-gray-700 p-3 rounded">
            <h3 className="font-semibold text-white mb-2">Victim Information</h3>
            <div className="space-y-3 text-gray-300">
              <div>
                <span className="font-medium">For:</span>
                {isEditing ? (
                  <select
                    value={dataToShow.isForSelf ? 'self' : 'other'}
                    onChange={(e) => updateField('isForSelf', e.target.value === 'self')}
                    className="ml-2 px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white"
                  >
                    <option value="self">Self</option>
                    <option value="other">Someone else</option>
                  </select>
                ) : (
                  <span> {dataToShow.isForSelf ? 'Self' : 'Someone else'}</span>
                )}
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                {isEditing ? (
                  <input
                    type="tel"
                    value={dataToShow.victimPhoneNumber || ''}
                    onChange={(e) => updateField('victimPhoneNumber', e.target.value)}
                    className="ml-2 px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <span> {dataToShow.victimPhoneNumber || 'Not provided'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-700 p-3 rounded">
            <h3 className="font-semibold text-white mb-1">Location</h3>
            <div className="space-y-2 text-gray-300">
              {dataToShow.latitude && dataToShow.longitude ? (
                <div>
                  <p><span className="font-medium">Coordinates:</span> {dataToShow.latitude}, {dataToShow.longitude}</p>
                  <a 
                    href={`https://maps.google.com/?q=${dataToShow.latitude},${dataToShow.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline text-sm"
                  >
                    📍 View on Google Maps
                  </a>
                </div>
              ) : (
                <p className="text-gray-400">Location not specified</p>
              )}
              {dataToShow.address && (
                <p><span className="font-medium">Address:</span> {dataToShow.address}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gray-700 p-3 rounded">
            <h3 className="font-semibold text-white mb-1">Additional Notes</h3>
            {isEditing ? (
              <textarea
                value={dataToShow.notes || ''}
                onChange={(e) => updateField('notes', e.target.value)}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white resize-none"
                rows="3"
                placeholder="Add any additional details..."
              />
            ) : (
              <p className="text-gray-300">{dataToShow.notes || 'No additional notes'}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
                         {isConfirming ? (
               <>
                 <button
                   onClick={handleFinalConfirm}
                   disabled={hasMissingFields}
                   className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                     hasMissingFields 
                       ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                       : 'bg-red-600 hover:bg-red-700 text-white'
                   }`}
                 >
                   {hasMissingFields ? '⚠️ Missing Information' : '✅ Confirm & Send Emergency'}
                 </button>
                 <button
                   onClick={() => setIsConfirming(false)}
                   className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                 >
                   Back
                 </button>
               </>
             ) : isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  💾 Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </>
                         ) : (
               <>
                 <button
                   onClick={handleConfirm}
                   disabled={hasMissingFields}
                   className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                     hasMissingFields 
                       ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                       : 'bg-red-600 hover:bg-red-700 text-white'
                   }`}
                 >
                   {hasMissingFields ? '⚠️ Complete Missing Info' : '📞 Book Emergency Services'}
                 </button>
                 <button
                   onClick={handleEdit}
                   className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                 >
                   ✏️ Edit Details
                 </button>
                 <button
                   onClick={handleCancel}
                   className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                 >
                   Cancel
                 </button>
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDisplay; 