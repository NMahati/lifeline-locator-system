
import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DonationHistory from '@/components/DonationHistory';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, differenceInDays, addDays } from 'date-fns';
import { Calendar as CalendarIcon, CircleAlert, Loader2 } from 'lucide-react';

const MyDonations = () => {
  const { user, updateUserProfile } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!user) {
    return (
      <Layout>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">My Donations</h1>
          <p className="text-gray-500">Please log in to view your donation history.</p>
        </div>
      </Layout>
    );
  }

  const lastDonation = user.lastDonation ? new Date(user.lastDonation) : null;
  const nextEligibleDate = lastDonation ? addDays(lastDonation, 90) : new Date();
  const daysUntilNextDonation = lastDonation ? 
    Math.max(0, differenceInDays(nextEligibleDate, new Date())) : 0;
  
  // Track a new donation
  const trackDonation = () => {
    if (!selectedDate || !user) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newDonation = {
        date: selectedDate,
        location: "Local Blood Bank",
        recipient: "General Donation"
      };
      
      const updatedHistory = [
        newDonation,
        ...(user.donationHistory || [])
      ];
      
      updateUserProfile({
        lastDonation: selectedDate,
        eligibleToDonateSince: addDays(selectedDate, 90),
        donationHistory: updatedHistory
      });
      
      setIsLoading(false);
      setIsReminderDialogOpen(true);
    }, 1000);
  };
  
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">My Donations</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Track New Donation</CardTitle>
              <CardDescription>
                Record your recent blood donation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date > new Date()}
                  className="border rounded-md"
                />
                
                <Button 
                  onClick={trackDonation} 
                  className="w-full bg-blood-600 hover:bg-blood-700"
                  disabled={isLoading || !selectedDate}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    'Track Donation'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Next Donation</CardTitle>
              <CardDescription>
                When you can donate again
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lastDonation ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Last donation</div>
                    <div className="font-medium flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                      {format(new Date(lastDonation), 'MMMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500">Eligible to donate again on</div>
                    <div className="font-medium flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                      {format(nextEligibleDate, 'MMMM d, yyyy')}
                    </div>
                    {daysUntilNextDonation > 0 ? (
                      <div className="text-sm text-gray-500 mt-1">
                        {daysUntilNextDonation} days remaining
                      </div>
                    ) : (
                      <div className="text-sm text-green-600 mt-1">
                        You are eligible now!
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CircleAlert className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No donation recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <DonationHistory />
        </div>
      </div>
      
      {/* Donation Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thank You for Donating!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Your donation has been recorded. Remember that you need to wait at least 12 weeks before donating whole blood again.
            </p>
            <p className="mb-4">
              We've set a reminder in your profile. You'll be eligible to donate again on:
            </p>
            <div className="p-4 bg-gray-50 rounded-md text-center">
              <p className="text-xl font-bold">
                {selectedDate && format(addDays(selectedDate, 90), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MyDonations;
