
import { BloodTypes, UserProfile } from '../context/AuthContext';

export interface BloodRequest {
  id: string;
  requesterInfo: {
    id: string;
    name: string;
    type: 'recipient' | 'hospital';
  };
  bloodGroup: keyof BloodTypes;
  quantity: number;
  urgency: 'normal' | 'urgent' | 'critical';
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  requestDate: Date;
  contactPhone: string;
  contactEmail?: string;
  additionalNotes?: string;
  status: 'open' | 'in-progress' | 'fulfilled' | 'canceled';
  responses?: {
    donorId: string;
    donorName: string;
    status: 'offered' | 'accepted' | 'rejected' | 'completed';
    responseDate: Date;
  }[];
}

export interface BloodRequestContextType {
  requests: BloodRequest[];
  userRequests: BloodRequest[];
  urgentRequests: BloodRequest[];
  createRequest: (requestData: Omit<BloodRequest, 'id' | 'requesterInfo' | 'requestDate' | 'status' | 'responses'>) => void;
  updateRequest: (id: string, data: Partial<BloodRequest>) => void;
  deleteRequest: (id: string) => void;
  respondToRequest: (requestId: string) => void;
  getMatchingDonors: (bloodGroup: keyof BloodTypes) => Promise<UserProfile[]>;
  loading: boolean;
  error: string | null;
}
