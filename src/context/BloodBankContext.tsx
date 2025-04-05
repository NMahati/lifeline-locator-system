
import React, { createContext, useState, useContext, ReactNode } from 'react';
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

// Mock data
const mockBloodBanks: BloodBank[] = [
  {
    id: '1',
    name: 'City Central Blood Bank',
    address: '123 Main Street, Downtown',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    contactPhone: '+1234567890',
    contactEmail: 'info@citybloodbank.org',
    website: 'https://www.citybloodbank.org',
    hoursOfOperation: 'Mon-Fri: 8am-6pm, Sat: 9am-3pm, Sun: Closed',
    acceptsWalkIns: true,
    services: ['Blood Donation', 'Plasma Donation', 'Blood Tests'],
    inventory: {
      'A+': { quantity: 15, lastUpdated: new Date('2024-04-01') },
      'A-': { quantity: 5, lastUpdated: new Date('2024-04-01') },
      'B+': { quantity: 10, lastUpdated: new Date('2024-04-01') },
      'B-': { quantity: 3, lastUpdated: new Date('2024-04-01') },
      'AB+': { quantity: 7, lastUpdated: new Date('2024-04-01') },
      'AB-': { quantity: 2, lastUpdated: new Date('2024-04-01') },
      'O+': { quantity: 20, lastUpdated: new Date('2024-04-01') },
      'O-': { quantity: 8, lastUpdated: new Date('2024-04-01') }
    }
  },
  {
    id: '2',
    name: 'Red Cross Donation Center',
    address: '456 Medical Drive, Midtown',
    coordinates: {
      latitude: 40.7580,
      longitude: -73.9855
    },
    contactPhone: '+1987654321',
    contactEmail: 'donations@redcross.org',
    website: 'https://www.redcross.org/donate/blood',
    hoursOfOperation: 'Mon-Sun: 9am-7pm',
    acceptsWalkIns: true,
    services: ['Blood Donation', 'Platelet Donation', 'Blood Drive Organization']
  },
  {
    id: '3',
    name: 'Community Hospital Blood Center',
    address: '789 Hospital Lane, Uptown',
    coordinates: {
      latitude: 40.7831,
      longitude: -73.9712
    },
    contactPhone: '+1567891234',
    contactEmail: 'bloodcenter@communityhospital.org',
    hoursOfOperation: 'Mon-Fri: 7am-8pm, Sat-Sun: 8am-4pm',
    acceptsWalkIns: false,
    services: ['Blood Donation', 'Medical Research', 'Plasma Donation']
  }
];

export const BloodBankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bloodBanks] = useState<BloodBank[]>(mockBloodBanks);
  const [nearbyBloodBanks, setNearbyBloodBanks] = useState<BloodBank[]>([]);

  // Calculate distance between two coordinates using Haversine formula (km)
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
    
    // Filter by distance and sort by closest
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
