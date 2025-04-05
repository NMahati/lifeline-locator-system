import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const axiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await axiosApi.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await axiosApi.post('/auth/register', userData);
    return response.data;
  },
  getUserProfile: async (userId: string) => {
    const response = await axiosApi.get(`/auth/profile/${userId}`);
    return response.data;
  },
  updateProfile: async (userId: string, userData: any) => {
    const response = await axiosApi.put(`/auth/profile/${userId}`, userData);
    return response.data;
  }
};

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend's base URL

export const api = {
  /**
   * Fetch donation history for a specific user.
   * @param userId - The ID of the user whose donation history is being fetched.
   * @returns A promise resolving to the donation history array.
   */
  getDonationHistory: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/donations/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch donation history');
    }
    return await response.json();
  },

  // Add other API methods here as needed
  // Example: Fetch blood banks, create requests, etc.
  getBloodBanks: async () => {
    const response = await fetch(`${API_BASE_URL}/blood-banks`);
    if (!response.ok) {
      throw new Error('Failed to fetch blood banks');
    }
    return await response.json();
  },

  createBloodRequest: async (requestData: any) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create blood request');
    }

    return await response.json();
  },
};

export const bloodRequestService = {
  getAllRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/blood-requests`);
    if (!response.ok) {
      throw new Error('Failed to fetch blood requests');
    }
    return await response.json();
  },

  createRequest: async (requestData: any) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    return await response.json();
  },

  updateRequest: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  deleteRequest: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  },

  respondToRequest: async (requestId: string, responseData: any) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${requestId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseData),
    });
    return await response.json();
  },

  getCompatibleDonors: async (bloodGroup: string) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/compatible-donors?bloodGroup=${bloodGroup}`);
    if (!response.ok) {
      throw new Error('Failed to fetch compatible donors');
    }
    return await response.json();
  },
};

// Blood bank services
export const bloodBankService = {
  getAllBanks: async () => {
    const response = await axiosApi.get('/blood-banks');
    return response.data;
  },
  getBankById: async (bankId: string) => {
    const response = await axiosApi.get(`/blood-banks/${bankId}`);
    return response.data;
  },
  getNearbyBanks: async (latitude: number, longitude: number, maxDistance: number = 10) => {
    const response = await axiosApi.get(`/blood-banks/nearby/${latitude}/${longitude}/${maxDistance}`);
    return response.data;
  }
};

export default api;
