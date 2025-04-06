
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useBloodRequests } from '@/context/BloodRequestContext';
import { useAuth } from '@/context/AuthContext';
import BloodDonationCard from '@/components/BloodDonationCard';
import { Calendar as CalendarIcon, Clock } from "lucide-react";

const AppointmentSchedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { requests, respondToRequest } = useBloodRequests();
  const { user } = useAuth();
  const { requestId } = location.state || {};
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Find the request from the requests array
  const request = requests.find(req => req.id === requestId);
  
  if (!request) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
          <p className="mb-6">The blood donation request could not be found.</p>
          <Button onClick={() => navigate('/requests')}>Back to Requests</Button>
        </div>
      </Layout>
    );
  }
  
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "01:00 PM", "02:00 PM", 
    "03:00 PM", "04:00 PM", "05:00 PM"
  ];
  
  const handleSubmit = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    if (!timeSlot) {
      toast.error("Please select a time slot");
      return;
    }
    
    // Submit appointment and respond to request
    respondToRequest(requestId);
    
    toast.success("Appointment scheduled successfully! The requester will contact you soon.", {
      duration: 5000
    });
    
    // Navigate back to blood requests
    setTimeout(() => {
      navigate('/requests');
    }, 1500);
  };
  
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Schedule Donation Appointment</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Blood Request Details</CardTitle>
              <CardDescription>Review the details of the blood request</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <BloodDonationCard request={request} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Schedule Appointment</CardTitle>
              <CardDescription>Choose a date and time for your donation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <div className="border rounded-md p-1">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => {
                      // Disable past dates and weekends
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const day = date.getDay();
                      return date < today || day === 0 || day === 6;
                    }}
                    className="rounded-md border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Select Time</Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time slot">
                      {timeSlot ? (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {timeSlot}
                        </div>
                      ) : "Select time slot"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes"
                  placeholder="Any special requirements or information"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/requests')}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-blood-500 hover:bg-blood-600">
                Schedule Appointment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentSchedule;
