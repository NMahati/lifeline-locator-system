
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth, BloodTypes } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import DonationHistory from '@/components/DonationHistory';
import BloodGroupSelector from '@/components/BloodGroupSelector';
import { CirclePlus, Loader2, Save, User } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bloodGroup: user?.bloodGroup || 'A+' as keyof BloodTypes,
    address: user?.location?.address || ''
  });

  if (!user) {
    return (
      <Layout>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">My Profile</h1>
          <p className="text-gray-500">Please log in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBloodGroupChange = (bloodGroup: keyof BloodTypes) => {
    setFormData(prev => ({ ...prev, bloodGroup }));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup,
        location: {
          address: formData.address,
          latitude: user.location?.latitude || 0,
          longitude: user.location?.longitude || 0
        }
      });
      
      setIsEditingPersonal(false);
      setIsSaving(false);
    }, 1000);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-xl bg-blood-100 text-blood-600">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 text-center">
                <CardTitle>{user.name}</CardTitle>
                <CardDescription className="mt-1">
                  {user.userType === 'donor' ? 'Blood Donor' : 
                   user.userType === 'recipient' ? 'Blood Recipient' : 'Hospital'}
                </CardDescription>
                
                {user.userType === 'donor' && user.bloodGroup && (
                  <div className="mt-2 inline-flex items-center bg-blood-50 text-blood-700 px-3 py-1 rounded-full text-sm font-medium">
                    Blood Type: {user.bloodGroup}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditingPersonal ? (
                <>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Email</div>
                    <div>{user.email}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-500">Phone</div>
                    <div>{user.phone}</div>
                  </div>
                  
                  {user.location?.address && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">Address</div>
                      <div>{user.location.address}</div>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsEditingPersonal(true)}
                  >
                    Edit Profile
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  {user.userType === 'donor' && (
                    <div className="space-y-2">
                      <Label>Blood Group</Label>
                      <BloodGroupSelector
                        selectedBloodGroup={formData.bloodGroup}
                        onChange={handleBloodGroupChange}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Your address"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-blood-600 hover:bg-blood-700"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingPersonal(false);
                        // Reset form data
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone,
                          bloodGroup: user.bloodGroup || 'A+',
                          address: user.location?.address || ''
                        });
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="history">
            <TabsList>
              <TabsTrigger value="history">Donation History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-4">
              <DonationHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
