
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { BloodTypes, useAuth } from './AuthContext';
import { bloodRequestService } from '../services/api';
import { BloodRequest, BloodRequestContextType } from '../types/bloodRequest';
import { formatRequestFromApi } from '../utils/bloodRequestUtils';
import { mockRequests } from '../data/mockBloodRequests';
import { useBloodRequestActions } from '../hooks/useBloodRequestActions';

const BloodRequestContext = createContext<BloodRequestContextType | undefined>(undefined);

export const BloodRequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Get blood request actions
  const { 
    createRequest, 
    updateRequest, 
    deleteRequest, 
    respondToRequest, 
    getMatchingDonors 
  } = useBloodRequestActions(setRequests, setLoading, setError);

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

// Fix TypeScript error by using 'export type' for re-exporting a type
export { BloodTypes } from './AuthContext';
export type { BloodRequest } from '../types/bloodRequest';
