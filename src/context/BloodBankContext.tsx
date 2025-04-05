import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { BloodTypes } from './AuthContext';

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  contactPhone: string;
  contactEmail?: string;
  website?: string;
  hoursOfOperation: string;
  acceptsWalkIns: boolean;
  services: string[];
  inventory?: Record<keyof BloodTypes, {
    quantity: number;
    lastUpdated: Date;
  }>;
  distance?: number; // Calculated based on user's location
}

interface BloodBankContextType {
  bloodBanks: BloodBank[];
  nearbyBloodBanks: BloodBank[];
  findNearbyBanks: (latitude: number, longitude: number, maxDistance?: number) => BloodBank[];
  getBloodBankById: (id: string) => BloodBank | undefined;
}

const BloodBankContext = createContext<BloodBankContextType | undefined>(undefined);

export const BloodBankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [nearbyBloodBanks, setNearbyBloodBanks] = useState<BloodBank[]>([]);

  // Fetch blood banks from the backend
  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blood-banks');
        if (!response.ok) {
          throw new Error('Failed to fetch blood banks');
        }
        const data = await response.json();
        setBloodBanks(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch blood banks. Please try again later.',
          variant: 'destructive',
        });
        console.error(error);
      }
    };

    fetchBloodBanks();
  }, []);

  const calculateDistance = (
    lat1: number, lon1: number, 
    lat2: number, lon2: number
  ): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  const findNearbyBanks = (
    latitude: number, 
    longitude: number, 
    maxDistance: number = 10 // Default to 10km
  ): BloodBank[] => {
    const banksWithDistance = bloodBanks.map(bank => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        bank.coordinates.latitude, 
        bank.coordinates.longitude
      );
      return { ...bank, distance };
    });
    
    const nearby = banksWithDistance
      .filter(bank => bank.distance !== undefined && bank.distance <= maxDistance)
      .sort((a, b) => {
        if (a.distance === undefined || b.distance === undefined) return 0;
        return a.distance - b.distance;
      });
    
    setNearbyBloodBanks(nearby);
    return nearby;
  };

  const getBloodBankById = (id: string): BloodBank | undefined => {
    return bloodBanks.find(bank => bank.id === id);
  };

  return (
    <BloodBankContext.Provider value={{
      bloodBanks,
      nearbyBloodBanks,
      findNearbyBanks,
      getBloodBankById
    }}>
      {children}
    </BloodBankContext.Provider>
  );
};

export const useBloodBanks = () => {
  const context = useContext(BloodBankContext);
  if (context === undefined) {
    throw new Error('useBloodBanks must be used within a BloodBankProvider');
  }
  return context;
};
