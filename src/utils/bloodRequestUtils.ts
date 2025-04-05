
import { BloodRequest } from '../types/bloodRequest';

// Converting MongoDB data format to our app format
export const formatRequestFromApi = (apiRequest: any): BloodRequest => {
  return {
    id: apiRequest._id,
    requesterInfo: apiRequest.requesterInfo,
    bloodGroup: apiRequest.bloodGroup,
    quantity: apiRequest.quantity,
    urgency: apiRequest.urgency as 'normal' | 'urgent' | 'critical',
    location: apiRequest.location,
    requestDate: new Date(apiRequest.requestDate),
    contactPhone: apiRequest.contactPhone,
    contactEmail: apiRequest.contactEmail,
    additionalNotes: apiRequest.additionalNotes,
    status: apiRequest.status as 'open' | 'in-progress' | 'fulfilled' | 'canceled',
    responses: apiRequest.responses?.map((response: any) => ({
      donorId: response.donorId,
      donorName: response.donorName,
      status: response.status as 'offered' | 'accepted' | 'rejected' | 'completed',
      responseDate: new Date(response.responseDate)
    }))
  };
};
