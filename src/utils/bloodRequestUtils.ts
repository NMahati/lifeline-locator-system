
import { BloodRequest } from '../types/bloodRequest';

// Converting MongoDB data format to our app format with better error handling
export const formatRequestFromApi = (apiRequest: any): BloodRequest => {
  try {
    if (!apiRequest) {
      throw new Error('Invalid request data received from API');
    }
    
    // Add logging for debugging
    console.log('Formatting API request data:', apiRequest);
    
    return {
      id: apiRequest._id || apiRequest.id,
      requesterInfo: {
        id: apiRequest.requesterInfo?.id || apiRequest.requesterInfo?._id || '',
        name: apiRequest.requesterInfo?.name || '',
        type: (apiRequest.requesterInfo?.type || 'recipient') as 'recipient' | 'hospital',
      },
      bloodGroup: apiRequest.bloodGroup,
      quantity: Number(apiRequest.quantity),
      urgency: apiRequest.urgency as 'normal' | 'urgent' | 'critical',
      location: {
        address: apiRequest.location?.address || '',
        latitude: Number(apiRequest.location?.latitude) || 0,
        longitude: Number(apiRequest.location?.longitude) || 0,
      },
      requestDate: new Date(apiRequest.requestDate),
      contactPhone: apiRequest.contactPhone || '',
      contactEmail: apiRequest.contactEmail,
      additionalNotes: apiRequest.additionalNotes,
      status: apiRequest.status as 'open' | 'in-progress' | 'fulfilled' | 'canceled',
      responses: Array.isArray(apiRequest.responses) ? apiRequest.responses.map((response: any) => ({
        donorId: response.donorId,
        donorName: response.donorName,
        status: response.status as 'offered' | 'accepted' | 'rejected' | 'completed',
        responseDate: new Date(response.responseDate)
      })) : []
    };
  } catch (error) {
    console.error('Error formatting request from API:', error);
    throw error;
  }
};
