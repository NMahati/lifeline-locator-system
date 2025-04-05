import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { BloodTypes, useAuth, UserProfile } from './AuthContext';
import { bloodRequestService } from '../services/api';

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

interface BloodRequestContextType {
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

const BloodRequestContext = createContext<BloodRequestContextType | undefined>(undefined);

// Mock data just for fallback
const mockRequests: BloodRequest[] = [
  {
    id: '1',
    requesterInfo: {
      id: '2',
      name: 'City Hospital',
      type: 'hospital'
    },
    bloodGroup: 'O-',
    quantity: 2,
    urgency: 'critical',
    location: {
      address: '456 Medical Dr, Chicago',
      latitude: 41.8781,
      longitude: -87.6298
    },
    requestDate: new Date('2024-04-04T10:30:00'),
    contactPhone: '+1987654321',
    contactEmail: 'emergency@cityhospital.com',
    additionalNotes: 'Needed for emergency surgery',
    status: 'open',
    responses: []
  },
  {
    id: '2',
    requesterInfo: {
      id: '3',
      name: 'Jane Smith',
      type: 'recipient'
    },
    bloodGroup: 'A+',
    quantity: 1,
    urgency: 'normal',
    location: {
      address: '789 Patient Lane, Boston',
      latitude: 42.3601,
      longitude: -71.0589
    },
    requestDate: new Date('2024-04-03T15:45:00'),
    contactPhone: '+1765432109',
    status: 'open',
    responses: []
  },
  {
    id: '3',
    requesterInfo: {
      id: '4',
      name: 'Memorial Hospital',
      type: 'hospital'
    },
    bloodGroup: 'B+',
    quantity: 3,
    urgency: 'urgent',
    location: {
      address: '101 Health Ave, Los Angeles',
      latitude: 34.0522,
      longitude: -118.2437
    },
    requestDate: new Date('2024-04-05T08:15:00'),
    contactPhone: '+1234098765',
    contactEmail: 'blood@memorialhospital.org',
    additionalNotes: 'Multiple transfusions needed',
    status: 'open',
    responses: []
  }
];

// Converting MongoDB data format to our app format
const formatRequestFromApi = (apiRequest: any): BloodRequest => {
  return {
    id: apiRequest._id,
    requesterInfo: apiRequest.requesterInfo,
    bloodGroup: apiRequest.bloodGroup as keyof BloodTypes,
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

export const BloodRequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch all blood requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await bloodRequestService.getAllRequests();
        if (response.success) {
          const formattedRequests = response.requests.map(formatRequestFromApi);
          setRequests(formattedRequests);
        } else {
          setError('Failed to fetch requests');
          // Fallback to mock data if API fails
          setRequests(mockRequests);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching blood requests');
        // Fallback to mock data if API fails
        setRequests(mockRequests);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests for current user
  const userRequests = requests.filter(req => 
    user && req.requesterInfo.id === user.id
  );

  // Get urgent requests
  const urgentRequests = requests.filter(req => 
    req.urgency === 'urgent' || req.urgency === 'critical'
  );

  const createRequest = async (requestData: Omit<BloodRequest, 'id' | 'requesterInfo' | 'requestDate' | 'status' | 'responses'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a request",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newRequestData = {
        requesterInfo: {
          id: user.id,
          name: user.name,
          type: user.userType as 'recipient' | 'hospital'
        },
        bloodGroup: requestData.bloodGroup,
        quantity: requestData.quantity,
        urgency: requestData.urgency,
        location: requestData.location,
        contactPhone: requestData.contactPhone,
        contactEmail: requestData.contactEmail,
        additionalNotes: requestData.additionalNotes
      };

      const response = await bloodRequestService.createRequest(newRequestData);
      
      if (response.success) {
        const formattedRequest = formatRequestFromApi(response.request);
        setRequests(prev => [formattedRequest, ...prev]);
        
        toast({
          title: "Request created",
          description: "Your blood request has been posted successfully."
        });
        
        // Find matching donors for notification
        getMatchingDonors(requestData.bloodGroup)
          .then(donors => console.log(`Notifying ${donors.length} compatible donors`));
      } else {
        throw new Error(response.error || 'Failed to create request');
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create blood request",
        variant: "destructive"
      });
      setError(err.message || 'Error creating request');
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (id: string, data: Partial<BloodRequest>) => {
    setLoading(true);
    try {
      const response = await bloodRequestService.updateRequest(id, data);
      
      if (response.success) {
        setRequests(prev => 
          prev.map(request => 
            request.id === id ? { ...request, ...data } : request
          )
        );
        
        toast({
          title: "Request updated",
          description: "The blood request has been updated."
        });
      } else {
        throw new Error(response.error || 'Failed to update request');
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update blood request",
        variant: "destructive"
      });
      setError(err.message || 'Error updating request');
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id: string) => {
    setLoading(true);
    try {
      const response = await bloodRequestService.deleteRequest(id);
      
      if (response.success) {
        setRequests(prev => prev.filter(request => request.id !== id));
        
        toast({
          title: "Request deleted",
          description: "The blood request has been removed."
        });
      } else {
        throw new Error(response.error || 'Failed to delete request');
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete blood request",
        variant: "destructive"
      });
      setError(err.message || 'Error deleting request');
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (requestId: string) => {
    if (!user || user.userType !== 'donor') {
      toast({
        title: "Action not allowed",
        description: "Only registered donors can respond to requests.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await bloodRequestService.respondToRequest(requestId, {
        donorId: user.id,
        donorName: user.name
      });
      
      if (response.success) {
        const updatedRequest = formatRequestFromApi(response.request);
        
        setRequests(prev => 
          prev.map(request => 
            request.id === requestId ? updatedRequest : request
          )
        );
        
        toast({
          title: "Response sent",
          description: "Your offer to donate has been sent. The requester will contact you soon."
        });
      } else {
        throw new Error(response.error || 'Failed to respond to request');
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to respond to blood request",
        variant: "destructive"
      });
      setError(err.message || 'Error responding to request');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine compatible blood groups
  const getMatchingDonors = async (bloodGroup: keyof BloodTypes): Promise<UserProfile[]> => {
    try {
      const response = await bloodRequestService.getCompatibleDonors(bloodGroup);
      
      if (response.success) {
        return response.donors.map((donor: any) => ({
          id: donor._id,
          name: donor.name,
          email: donor.email,
          phone: donor.phone,
          userType: donor.userType,
          bloodGroup: donor.bloodGroup,
          location: donor.location,
          lastDonation: donor.lastDonation ? new Date(donor.lastDonation) : null,
          eligibleToDonateSince: donor.eligibleToDonateSince ? new Date(donor.eligibleToDonateSince) : null
        }));
      } else {
        throw new Error(response.error || 'Failed to get compatible donors');
      }
    } catch (err) {
      console.error('Error finding compatible donors:', err);
      return [];
    }
  };

  return (
    <BloodRequestContext.Provider value={{ 
      requests, 
      userRequests,
      urgentRequests,
      createRequest, 
      updateRequest, 
      deleteRequest,
      respondToRequest,
      getMatchingDonors,
      loading,
      error
    }}>
      {children}
    </BloodRequestContext.Provider>
  );
};

export const useBloodRequests = () => {
  const context = useContext(BloodRequestContext);
  if (context === undefined) {
    throw new Error('useBloodRequests must be used within a BloodRequestProvider');
  }
  return context;
};
