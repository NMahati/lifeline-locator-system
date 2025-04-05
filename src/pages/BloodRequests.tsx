import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBloodRequests } from '@/context/BloodRequestContext';
import { useAuth } from '@/context/AuthContext';
import BloodDonationCard from '@/components/BloodDonationCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BloodGroupSelector from '@/components/BloodGroupSelector';
import { BloodTypes } from '@/context/AuthContext';
import { Search, Plus, CircleX } from 'lucide-react';
import api from '../services/api'; // Assuming api is imported from a relevant module

const BloodRequests = () => {
  const { requests, userRequests, createRequest, respondToRequest } = useBloodRequests();
  const { user, userType, isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const initialRequest = {
    bloodGroup: 'A+' as keyof BloodTypes,
    quantity: 1,
    urgency: 'normal' as 'normal' | 'urgent' | 'critical',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    additionalNotes: '',
    location: {
      address: user?.location?.address || '',
      latitude: user?.location?.latitude || 0,
      longitude: user?.location?.longitude || 0
    }
  };

  const [newRequest, setNewRequest] = useState(initialRequest);

  const filteredRequests = requests.filter(request => {
    const searchMatch =
      request.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.additionalNotes?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

    const bloodGroupMatch = filterBloodGroup === 'all' || request.bloodGroup === filterBloodGroup;
    const urgencyMatch = filterUrgency === 'all' || request.urgency === filterUrgency;

    return searchMatch && bloodGroupMatch && urgencyMatch;
  });

  const handleCreateRequest = async () => {
    const requestData = {
      bloodGroup: newRequest.bloodGroup,
      quantity: newRequest.quantity,
      donor: user?.id,
      location: {
        address: newRequest.location.address,
      },
      urgency: newRequest.urgency,
      contactPhone: newRequest.contactPhone,
      contactEmail: newRequest.contactEmail,
      additionalNotes: newRequest.additionalNotes,
    };

    try {
      const response = await api.createBloodRequest(requestData);
      console.log('Blood request created successfully:', response);
      setIsDialogOpen(false);
      setNewRequest(initialRequest);
    } catch (error: any) {
      console.error('Failed to create blood request:', error.message);
    }
  };

  const canCreateRequest = userType === 'recipient' || userType === 'hospital';

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blood Requests</h1>
        {isAuthenticated && canCreateRequest && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blood-600 hover:bg-blood-700">
                <Plus className="h-4 w-4 mr-2" />
                Post Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Post Blood Request</DialogTitle>
                <DialogDescription>
                  Enter the details for your blood request.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="blood-group">Blood Group</Label>
                  <BloodGroupSelector 
                    selectedBloodGroup={newRequest.bloodGroup}
                    onChange={(group) => setNewRequest({...newRequest, bloodGroup: group})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Units Required</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1"
                      value={newRequest.quantity}
                      onChange={(e) => setNewRequest({...newRequest, quantity: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select 
                      value={newRequest.urgency}
                      onValueChange={(value) => setNewRequest({
                        ...newRequest, 
                        urgency: value as 'normal' | 'urgent' | 'critical'
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Location/Address</Label>
                  <Input 
                    id="address" 
                    value={newRequest.location.address}
                    onChange={(e) => setNewRequest({
                      ...newRequest, 
                      location: {...newRequest.location, address: e.target.value}
                    })}
                    placeholder="Hospital/Clinic Address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input 
                      id="phone" 
                      value={newRequest.contactPhone}
                      onChange={(e) => setNewRequest({...newRequest, contactPhone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email (Optional)</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newRequest.contactEmail}
                      onChange={(e) => setNewRequest({...newRequest, contactEmail: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes" 
                    value={newRequest.additionalNotes}
                    onChange={(e) => setNewRequest({...newRequest, additionalNotes: e.target.value})}
                    placeholder="Any specific requirements or information"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-blood-600 hover:bg-blood-700"
                  onClick={handleCreateRequest}
                >
                  Post Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="search" 
              placeholder="Search by location or details" 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <CircleX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="w-40">
            <Select 
              value={filterBloodGroup}
              onValueChange={setFilterBloodGroup}
            >
              <SelectTrigger>
                <SelectValue placeholder="Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blood Types</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select 
              value={filterUrgency}
              onValueChange={setFilterUrgency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency Levels</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || filterBloodGroup !== 'all' || filterUrgency !== 'all') && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterBloodGroup('all');
                setFilterUrgency('all');
              }}
              className="text-sm"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          {isAuthenticated && userType !== 'donor' && (
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {filteredRequests.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredRequests.map((request) => (
                <BloodDonationCard 
                  key={request.id} 
                  request={request}
                  onRespond={userType === 'donor' ? () => respondToRequest(request.id) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500">No blood requests found matching your criteria.</p>
            </div>
          )}
        </TabsContent>

        {isAuthenticated && userType !== 'donor' && (
          <TabsContent value="my-requests" className="mt-4">
            {userRequests.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {userRequests.map((request) => (
                  <BloodDonationCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">You haven't posted any blood requests yet.</p>
                {canCreateRequest && (
                  <Button 
                    className="mt-4 bg-blood-600 hover:bg-blood-700"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Request
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </Layout>
  );
};

export default BloodRequests;
