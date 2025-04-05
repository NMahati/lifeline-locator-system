
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

export type UserType = 'donor' | 'recipient' | 'hospital' | null;

export interface BloodTypes {
  'A+': boolean;
  'A-': boolean;
  'B+': boolean;
  'B-': boolean;
  'AB+': boolean;
  'AB-': boolean;
  'O+': boolean;
  'O-': boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  bloodGroup?: keyof BloodTypes;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  lastDonation?: Date | null;
  eligibleToDonateSince?: Date | null;
  medicalConditions?: string[];
  donationHistory?: {
    date: Date;
    location: string;
    recipient?: string;
  }[];
}

interface AuthContextType {
  user: UserProfile | null;
  userType: UserType;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (userData: Partial<UserProfile> & {password: string}) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    userType: 'donor',
    bloodGroup: 'A+',
    location: {
      address: '123 Main St, New York',
      latitude: 40.7128,
      longitude: -74.0060
    },
    lastDonation: new Date('2023-11-01'),
    eligibleToDonateSince: new Date('2024-02-01'),
    donationHistory: [
      {
        date: new Date('2023-11-01'),
        location: 'Red Cross Blood Bank',
        recipient: 'General Donation'
      },
      {
        date: new Date('2023-05-15'),
        location: 'City Hospital',
        recipient: 'Emergency Requirement'
      }
    ]
  },
  {
    id: '2',
    name: 'City Hospital',
    email: 'hospital@example.com',
    phone: '+1987654321',
    userType: 'hospital',
    location: {
      address: '456 Medical Dr, Chicago',
      latitude: 41.8781,
      longitude: -87.6298
    }
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setUserType(userData.userType);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string) => {
    // In a real app, this would be an API call
    // This is just for demonstration
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      setUserType(foundUser.userType);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${foundUser.name}!`
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive"
      });
    }
  };

  const register = (userData: Partial<UserProfile> & {password: string}) => {
    // In a real app, this would be an API call
    const newUser: UserProfile = {
      id: `${mockUsers.length + 1}`,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      userType: userData.userType || null,
      bloodGroup: userData.bloodGroup,
      location: userData.location,
      lastDonation: null,
      eligibleToDonateSince: new Date(),
      donationHistory: []
    };
    
    // Save to our mock database
    mockUsers.push(newUser);
    
    // Log the user in
    setUser(newUser);
    setUserType(newUser.userType);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    toast({
      title: "Registration successful",
      description: `Welcome to Lifeline, ${newUser.name}!`
    });
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userType, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
