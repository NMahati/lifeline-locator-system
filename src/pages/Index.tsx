
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useBloodRequests } from '@/context/BloodRequestContext';
import { useBloodBanks } from '@/context/BloodBankContext';
import BloodDonationCard from '@/components/BloodDonationCard';
import UrgentRequestsBanner from '@/components/UrgentRequestsBanner';
import { DropletIcon, Heart, MapPin, Clock, ArrowRight } from 'lucide-react';
import { BloodTypes } from '@/context/AuthContext';
import BloodGroupSelector from '@/components/BloodGroupSelector';

const Index = () => {
  const { isAuthenticated, userType } = useAuth();
  const { urgentRequests, respondToRequest } = useBloodRequests();
  const { bloodBanks, findNearbyBanks } = useBloodBanks();
  
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<keyof BloodTypes>('A+');
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    // Try to get user's location for nearby blood banks
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          findNearbyBanks(latitude, longitude, 20);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default location in case of error
          findNearbyBanks(40.7128, -74.0060, 20);
        }
      );
    }
  }, [findNearbyBanks]);

  return (
    <Layout>
      {/* Hero section */}
      <section className="mb-8">
        <div className="blood-drop-bg rounded-lg bg-gradient-to-r from-blood-700 to-blood-500 text-white p-8 md:p-12 shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <DropletIcon className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Give Life, Donate Blood</h1>
            <p className="text-lg mb-6 text-white/90">
              Every donation can save up to three lives. Find blood donation centers near you or connect with patients in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/blood-banks">
                <Button className="bg-white text-blood-600 hover:bg-gray-100">
                  Find Donation Centers
                </Button>
              </Link>
              <Link to="/requests">
                <Button variant="outline" className="border-white text-white hover:bg-blood-600">
                  View Blood Requests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Register/Login CTA for non-authenticated users */}
      {!isAuthenticated && (
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Join Our Lifeline Community</CardTitle>
              <CardDescription>
                Create an account to donate blood, request donations, or find nearby blood banks.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="flex-1">
                <Button className="w-full bg-blood-600 hover:bg-blood-700">
                  Register as Donor/Recipient
                </Button>
              </Link>
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Already have an account? Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Blood group selector */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Find Your Blood Type Match</CardTitle>
            <CardDescription>
              Select a blood group to see compatibility information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BloodGroupSelector 
              selectedBloodGroup={selectedBloodGroup}
              onChange={setSelectedBloodGroup}
            />
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Blood Type {selectedBloodGroup}</h3>
              
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Can donate to:</span>
                  <span className="font-medium">
                    {selectedBloodGroup === 'O-' && 'All blood types'}
                    {selectedBloodGroup === 'O+' && 'O+, A+, B+, AB+'}
                    {selectedBloodGroup === 'A-' && 'A-, A+, AB-, AB+'}
                    {selectedBloodGroup === 'A+' && 'A+, AB+'}
                    {selectedBloodGroup === 'B-' && 'B-, B+, AB-, AB+'}
                    {selectedBloodGroup === 'B+' && 'B+, AB+'}
                    {selectedBloodGroup === 'AB-' && 'AB-, AB+'}
                    {selectedBloodGroup === 'AB+' && 'AB+'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Can receive from:</span>
                  <span className="font-medium">
                    {selectedBloodGroup === 'O-' && 'O-'}
                    {selectedBloodGroup === 'O+' && 'O-, O+'}
                    {selectedBloodGroup === 'A-' && 'O-, A-'}
                    {selectedBloodGroup === 'A+' && 'O-, O+, A-, A+'}
                    {selectedBloodGroup === 'B-' && 'O-, B-'}
                    {selectedBloodGroup === 'B+' && 'O-, O+, B-, B+'}
                    {selectedBloodGroup === 'AB-' && 'O-, A-, B-, AB-'}
                    {selectedBloodGroup === 'AB+' && 'All blood types'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Urgent requests section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Urgent Blood Requests</h2>
          <Link to="/requests" className="text-blood-600 hover:text-blood-700 flex items-center text-sm font-medium">
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {urgentRequests.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {urgentRequests.slice(0, 2).map((request) => (
              <BloodDonationCard 
                key={request.id} 
                request={request} 
                onRespond={userType === 'donor' ? () => respondToRequest(request.id) : undefined}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No urgent blood requests at the moment.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Blood donation facts */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Blood Donation Facts</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <DropletIcon className="h-8 w-8 text-blood-500 mb-2" />
              <h3 className="font-bold mb-1">Every 2 Seconds</h3>
              <p className="text-sm text-gray-500">Someone needs blood in emergencies</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <Heart className="h-8 w-8 text-blood-500 mb-2" />
              <h3 className="font-bold mb-1">3 Lives Saved</h3>
              <p className="text-sm text-gray-500">A single donation can help multiple patients</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 text-blood-500 mb-2" />
              <h3 className="font-bold mb-1">15 Minutes</h3>
              <p className="text-sm text-gray-500">Average time it takes to donate blood</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 text-blood-500 mb-2" />
              <h3 className="font-bold mb-1">38% of People</h3>
              <p className="text-sm text-gray-500">Can donate but only 10% actually do</p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Display urgent request banner */}
      <UrgentRequestsBanner />
    </Layout>
  );
};

export default Index;
