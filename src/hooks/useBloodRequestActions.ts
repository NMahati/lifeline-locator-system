
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bloodRequestService } from '../services/api';
import { BloodRequest } from '../types/bloodRequest';
import { UserProfile, BloodTypes } from '../context/AuthContext';
import { formatRequestFromApi } from '../utils/bloodRequestUtils';
import { toast } from '@/components/ui/use-toast';

export const useBloodRequestActions = (
  setRequests: React.Dispatch<React.SetStateAction<BloodRequest[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const { user } = useAuth();

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

  return {
    createRequest,
    updateRequest,
    deleteRequest,
    respondToRequest,
    getMatchingDonors
  };
};
