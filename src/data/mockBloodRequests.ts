
import { BloodRequest } from '../types/bloodRequest';

// Mock data just for fallback
export const mockRequests: BloodRequest[] = [
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
