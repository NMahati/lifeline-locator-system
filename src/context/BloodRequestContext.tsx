
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { BloodTypes, useAuth, UserProfile } from './AuthContext';

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
  getMatchingDonors: (bloodGroup: keyof BloodTypes) => UserProfile[];
}

const BloodRequestContext = createContext<BloodRequestContextType | undefined>(undefined);

// Mock data
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

// Mock donors for compatibility checking
const mockDonors: UserProfile[] = [
  {
    id: '5',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1122334455',
    userType: 'donor',
    bloodGroup: 'O-',
    location: {
      address: '222 Universal St, Chicago',
      latitude: 41.8750,
      longitude: -87.6290
    }
  },
  {
    id: '6',
    name: 'Bob Williams',
    email: 'bob@example.com',
    phone: '+1233445566',
    userType: 'donor',
    bloodGroup: 'A+',
    location: {
      address: '333 Downtown Ave, Boston',
      latitude: 42.3590,
      longitude: -71.0580
    }
  }
];

export const BloodRequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<BloodRequest[]>(mockRequests);
  const { user } = useAuth();

  // Filter requests for current user
  const userRequests = requests.filter(req => 
    user && req.requesterInfo.id === user.id
  );

  // Get urgent requests
  const urgentRequests = requests.filter(req => 
    req.urgency === 'urgent' || req.urgency === 'critical'
  );

  const createRequest = (requestData: Omit<BloodRequest, 'id' | 'requesterInfo' | 'requestDate' | 'status' | 'responses'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a request",
        variant: "destructive"
      });
      return;
    }

    const newRequest: BloodRequest = {
      id: `${Date.now()}`,
      requesterInfo: {
        id: user.id,
        name: user.name,
        type: user.userType as 'recipient' | 'hospital'
      },
      bloodGroup: requestData.bloodGroup,
      quantity: requestData.quantity,
      urgency: requestData.urgency,
      location: requestData.location,
      requestDate: new Date(),
      contactPhone: requestData.contactPhone,
      contactEmail: requestData.contactEmail,
      additionalNotes: requestData.additionalNotes,
      status: 'open',
      responses: []
    };

    setRequests(prev => [newRequest, ...prev]);
    
    toast({
      title: "Request created",
      description: "Your blood request has been posted successfully."
    });

    // Find matching donors for notification (in a real app)
    const matchingDonors = getMatchingDonors(requestData.bloodGroup);
    console.log(`Notifying ${matchingDonors.length} compatible donors`);
  };

  const updateRequest = (id: string, data: Partial<BloodRequest>) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, ...data } : request
      )
    );
    
    toast({
      title: "Request updated",
      description: "The blood request has been updated."
    });
  };

  const deleteRequest = (id: string) => {
    setRequests(prev => prev.filter(request => request.id !== id));
    
    toast({
      title: "Request deleted",
      description: "The blood request has been removed."
    });
  };

  const respondToRequest = (requestId: string) => {
    if (!user || user.userType !== 'donor') {
      toast({
        title: "Action not allowed",
        description: "Only registered donors can respond to requests.",
        variant: "destructive"
      });
      return;
    }

    setRequests(prev => 
      prev.map(request => {
        if (request.id === requestId) {
          // Check if donor already responded
          const alreadyResponded = request.responses?.some(r => r.donorId === user.id);
          
          if (alreadyResponded) {
            toast({
              title: "Already responded",
              description: "You have already responded to this request.",
              variant: "destructive"
            });
            return request;
          }
          
          // Add donor response with the correct type for status
          const updatedResponses = [...(request.responses || []), {
            donorId: user.id,
            donorName: user.name,
            status: 'offered' as 'offered' | 'accepted' | 'rejected' | 'completed',
            responseDate: new Date()
          }];
          
          toast({
            title: "Response sent",
            description: "Your offer to donate has been sent. The requester will contact you soon."
          });
          
          return {
            ...request,
            responses: updatedResponses,
            status: 'in-progress' as const
          };
        }
        return request;
      })
    );
  };

  // Helper function to determine compatible blood groups
  const getMatchingDonors = (bloodGroup: keyof BloodTypes): UserProfile[] => {
    // Blood compatibility chart (simplified)
    const compatibility: Record<keyof BloodTypes, Array<keyof BloodTypes>> = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-']
    };

    return mockDonors.filter(donor => 
      donor.userType === 'donor' && 
      donor.bloodGroup && 
      compatibility[bloodGroup].includes(donor.bloodGroup)
    );
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
      getMatchingDonors
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
